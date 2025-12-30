import stripe
from falcon_proj import settings
from ticket_app.models import Ticket
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    try:
        if event['type'] == 'payment_intent.succeeded':
            intent = event['data']['object']
            ticket_id = intent.metadata.get('ticket_id')

            if not ticket_id:
                print("Webhook: Missing ticket_id in metadata")
                return HttpResponse(status=400)

            try:
                ticket = Ticket.objects.get(id=ticket_id)
            except Ticket.DoesNotExist:
                print(f"Webhook: Lesson {ticket_id} does not exist")
                return HttpResponse(status=400)

            payment = getattr(ticket, "payment", None)
            if payment:
                payment.status = 'paid'
                payment.save()

                ticket.status = "confirmed"
                ticket.save
            else:
                print(f"Webhook: Payment for ticket {ticket_id} does not exist")

        else:
            print(f"Webhook: Ignoring {event['type']}")

    except Exception as e:
        print("Webhook error:", e)
        return HttpResponse(status=500)

    return HttpResponse(status=200)
