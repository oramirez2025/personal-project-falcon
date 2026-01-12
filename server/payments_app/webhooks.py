import stripe
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from falcon_proj import settings
from .models import Order, Payment
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from .services import release_order_inventory

stripe.api_key = settings.STRIPE_API_KEY

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            settings.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return HttpResponse(status=400)

    
    event_type = event["type"]
    intent = event["data"]["object"]
    order_id = intent.metadata.get("order_id")

    if not order_id:
        return HttpResponse(status=200)

    # --- Payment Success ---
    if event_type == "payment_intent.succeeded":
        with transaction.atomic():
            try:
                order = Order.objects.select_for_update().get(id=order_id)
            except Order.DoesNotExist:
                return HttpResponse(status=200)

            # --- Already Paid ---
            if order.status == 'paid':
                Payment.objects.filter(
                    stripe_payment_intent_id=intent['id']
                ).update(status='paid')
                return HttpResponse(status=200)

            # --- Hold Expired ---
            if order.status == 'reserved' and order.reserved_until and order.reserved_until <= timezone.now():
                release_order_inventory(order)
                Payment.objects.filter(
                    stripe_payment_intent_id=intent['id']
                ).update(status='failed')
                return HttpResponse(status=200)
        
            # --- Normal Success ---
            order.status = 'paid'
            order.save(update_fields=['status'])
            Payment.objects.filter(
                stripe_payment_intent_id=intent['id']
            ).update(status='paid')
    
        return HttpResponse(status=200)

    # --- Payment failed ---
    if event_type == "payment_intent.payment_failed":
        with transaction.atomic():
            try:
                order = Order.objects.select_for_update().get(id=order_id)
            except Order.DoesNotExist:
                return HttpResponse(status=200)

            Payment.objects.filter(
                stripe_payment_intent_id=intent['id']
            ).update(status='failed')

            if order.status == 'reserved':
                release_order_inventory(order)
            else:
                order.status = 'failed'
                order.save(update_fields=['status'])
        return HttpResponse(status=200)
    
    if event_type == "payment_intent.canceled":
        with transaction.atomic():
            try:
                order = Order.objects.select_for_update().get(id=order_id)
            except Order.DoesNotExist:
                return HttpResponse(status=200)

            Payment.objects.filter(
                stripe_payment_intent_id=intent["id"]
            ).update(status="failed")
            if order.status == "reserved":
                release_order_inventory(order)
            else:
                order.status = "failed"
                order.save(update_fields=["status"])
        return HttpResponse(status=200)

    return HttpResponse(status=200)
