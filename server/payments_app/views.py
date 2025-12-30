from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as s
import stripe
from .models import Payment
from .serializers import PaymentSerializer
from ticket_app.models import Ticket
from falcon_proj import settings
from decimal import Decimal
from django.shortcuts import get_object_or_404

# Create your views here.

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntent(APIView):
    def post(self, request):

        ticket_id = request.data.get('ticket_id')
        ticket = get_object_or_404(Ticket, id=ticket_id)

        if not ticket.user:
            if not hasattr(request.user, 'user'):
                return Response({'detail': 'Only users can buy tickets'}, status=s.HTTP_403_FORBIDDEN)
        elif ticket.user != request.user:
            return Response(status=s.HTTP_403_FORBIDDEN)
        
        ticket.user = request.user
        ticket.save()
        
        amount = Decimal(ticket.ticket_template.price)
        amount_cents = int(amount * 100)
        
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency='usd',
                metadata={'ticket_id': ticket.id}
            )

            payment = Payment.objects.create(
                ticket=ticket,
                amount=amount,
                stripe_payment_intent_id=intent.id,
                status='pending'
            )

            return Response({
                'client_secret': intent.client_secret,
                'payment_id': payment.id
            }, status=s.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=s.HTTP_400_BAD_REQUEST)
        

            
class ViewPayment(APIView):
    def get(self, request):
        staff = getattr(request.user, "is_staff")
        if not staff:
            return Response({'detail': "Only staff can access this."}, status=s.HTTP_403_FORBIDDEN)
        payments = Payment.objects.all(
            status="paid"
        )
        ser_payment = PaymentSerializer(payments, many=True)
        return Response(ser_payment.data, status=s.HTTP_200_OK)