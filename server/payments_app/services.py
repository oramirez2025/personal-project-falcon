from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from ticket_app.models import TicketTemplate
from .models import Order

hold_minutes = 10

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

    needs_general = any(t.ticket_type == 'community' for t in locked.values())
    general_tt = None
    if needs_general:
        general_tt = TicketTemplate.objects.select_for_update().get(ticket_type='general')

    for item in items:
        tt = locked[item.ticket_template_id]
        if item.quantity > tt.available_quantity:
            raise ValidationError(f"Not enough tickets available for {tt.ticket_type}.")
        
        if tt.ticket_type == 'community':
            if item.quantity > general_tt.available_quantity:
                raise ValidationError("Not enough general tickets available for community lodging.")

    # Decrement
    for item in items:
        tt = locked[item.ticket_template_id]
        tt.available_quantity -= item.quantity
        tt.save(update_fields=['available_quantity'])

        if tt.ticket_type == 'community':
            general_tt.available_quantity -= item.quantity
            general_tt.save(update_fields=['available_quantity'])
    
    order.status = 'reserved'
    order.reserved_until = timezone.now() + timedelta(minutes=hold_minutes)
    order.save(update_fields=['status', 'reserved_until'])
    return order

@transaction.atomic
def release_order_inventory(order):

    order = Order.objects.select_for_update().get(id=order.id)

    if order.status != 'reserved':
        return order
    if order.status == 'paid':
        return order
    
    items = list(order.items.select_related('ticket_template'))
    locked = lock_templates_for_order_items(items)

    needs_general = any(t.ticket_type == 'community' for t in locked.values())
    general_tt = None
    if needs_general:
        general_tt = TicketTemplate.objects.select_for_update().get(ticket_type='general')

    for item in items:
        tt = locked[item.ticket_template_id]
        tt.available_quantity += item.quantity
        tt.save(update_fields=['available_quantity'])

        if tt.ticket_type == 'community':
            general_tt.available_quantity += item.quantity
            general_tt.save(update_fields=['available_quantity'])
        
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