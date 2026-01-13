from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from ticket_app.models import TicketTemplate
from .models import Order
from falcon_proj import settings
import stripe


hold_minutes = 11

stripe.api_key = settings.STRIPE_API_KEY

def lock_templates_for_order_items(items):
    locked = {}
    for item in items:
        if item.ticket_template_id not in locked:
            locked[item.ticket_template_id] = TicketTemplate.objects.select_for_update().get(
                id=item.ticket_template_id
            )
    return locked

@transaction.atomic
def reserve_order_inventory(order):
    order = Order.objects.select_for_update().get(id=order.id)

    if order.status == "paid":
        raise ValidationError("Order already paid for.")
    
    if order.hold_is_active():
        return order
    
    if order.status == "reserved" and order.reserved_until and order.reserved_until <= timezone.now():
        release_order_inventory(order)

    items = list(order.items.select_related('ticket_template'))

    locked = lock_templates_for_order_items(items)

    upgrade_types = {'community', 'master'}

    # include explicit general purchases too
    needs_general = any(
        t.ticket_type == "general" or t.ticket_type in upgrade_types
        for t in locked.values()
    )
    general_tt = None
    if needs_general:
        general_tt = TicketTemplate.objects.select_for_update().get(ticket_type='general')

    # Validate
    for item in items:
        tt = locked[item.ticket_template_id]
        if item.quantity > tt.available_quantity:
            raise ValidationError(f"Not enough tickets available for {tt.ticket_type}.")
        
        if tt.ticket_type in upgrade_types:
            if item.quantity > general_tt.available_quantity:
                raise ValidationError("Not enough general tickets available for community lodging.")

    # Decrement
    general_consumed = 0

    for item in items:
        tt = locked[item.ticket_template_id]

        if tt.ticket_type != "general":
            tt.available_quantity -= item.quantity
            tt.save(update_fields=["available_quantity"])

        if tt.ticket_type in upgrade_types or tt.ticket_type == "general":
            general_consumed += item.quantity

    if general_tt and general_consumed > 0:
        if general_consumed > general_tt.available_quantity:
            raise ValidationError("Not enough general tickets available.")
        general_tt.available_quantity -= general_consumed
        general_tt.save(update_fields=["available_quantity"])
    
    order.status = 'reserved'
    order.reserved_until = timezone.now() + timedelta(minutes=hold_minutes)
    order.save(update_fields=['status', 'reserved_until'])
    return order

@transaction.atomic
def release_order_inventory(order):

    order = Order.objects.select_for_update().get(id=order.id)

    if order.status == 'paid':
        return order
    
    if order.status != 'reserved':
        return order
    
    items = list(order.items.select_related('ticket_template'))
    locked = lock_templates_for_order_items(items)

    upgrade_types = {'community', 'master'}

    # include explicit general purchases too
    needs_general = any(
        t.ticket_type == "general" or t.ticket_type in upgrade_types
        for t in locked.values()
    )
    general_tt = None
    if needs_general:
        general_tt = TicketTemplate.objects.select_for_update().get(ticket_type='general')

    general_consumed = 0

    for item in items:
        tt = locked[item.ticket_template_id]

        if tt.ticket_type != "general":
            tt.available_quantity += item.quantity
            tt.save(update_fields=['available_quantity'])

        if tt.ticket_type in upgrade_types or tt.ticket_type == "general":
            general_consumed += item.quantity

    if general_tt and general_consumed > 0:
        general_tt.available_quantity += general_consumed
        general_tt.save(update_fields=["available_quantity"])

    payment = getattr(order, 'payment', None)
    if payment and payment.stripe_payment_intent_id:
        try:
            stripe.PaymentIntent.cancel(payment.stripe_payment_intent_id)
        except stripe.error.StripeError:
            pass
        
    # --- Payment fails whenn hold expires ---
    payment = getattr(order, "payment", None)
    if payment and payment.status != "paid":
        payment.status = "failed"
        payment.save(update_fields=["status"])

    order.status = 'expired'
    order.reserved_until = None
    order.save(update_fields=['status', 'reserved_until'])
    return order

@transaction.atomic
def release_expired_holds():
    now = timezone.now()
    expired = (
        Order.objects.select_for_update(skip_locked=True).filter(status="reserved", reserved_until__lte=now)
    )
    for order in expired:
        release_order_inventory(order)
