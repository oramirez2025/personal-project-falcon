from rest_framework.response import Response
from rest_framework import status as s
from .models import Order, OrderItem, Payment
from .serializers import PaymentSerializer, OrderSerializer
from ticket_app.models import TicketTemplate
from falcon_proj import settings
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.validators import ValidationError
from user_app.views import User_Auth
from decimal import Decimal
from .services import reserve_order_inventory, release_expired_holds
import stripe


# Create your views here.

stripe.api_key = settings.STRIPE_API_KEY

class CreatePaymentIntent(User_Auth):
    @transaction.atomic
    def post(self, request):
        release_expired_holds()
        order_id = request.data.get("order_id")
        if not order_id:
            return Response({"detail": "order_id required."}, status=s.HTTP_400_BAD_REQUEST)
        order = get_object_or_404(Order, id=order_id, user=request.user)

        if order.status == 'paid':
            return Response({"detail": 'Order already paid for.'}, status=s.HTTP_400_BAD_REQUEST)
        
        if not order.hold_is_active():
            return Response({'detail': 'Order not reserved or hold is expired'}, status=s.HTTP_400_BAD_REQUEST)

        # Check if we already have a valid payment intent for this order
        existing_payment = Payment.objects.filter(order=order).first()
        
        if existing_payment and existing_payment.stripe_payment_intent_id:
            try:
                intent = stripe.PaymentIntent.retrieve(existing_payment.stripe_payment_intent_id)
                
                # If intent is still usable, return it (don't create a new one)
                if intent.status in ['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing']:
                    return Response(
                        {
                            "client_secret": intent.client_secret,
                            "order_id": order.id,
                        },
                        status=s.HTTP_200_OK
                    )
                
                # If intent succeeded, order is paid
                if intent.status == 'succeeded':
                    return Response({"detail": 'Order already paid'}, status=s.HTTP_400_BAD_REQUEST)
                    
            except stripe.error.StripeError as e:
                # Intent doesn't exist or other Stripe error - we'll create a new one below
                print(f"Stripe error retrieving intent: {e}")
        amount = int((order.total * Decimal('100')).quantize(Decimal('1')))

        # Create new Stripe payment intent
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            automatic_payment_methods={'enabled': True},
            metadata={"order_id": str(order.id), 'user_id': str(request.user.id)},
        )
        
        # Use update_or_create to avoid duplicate key errors
        Payment.objects.update_or_create(
            order=order,
            defaults={
                'stripe_payment_intent_id': intent.id,
                'status': 'pending'
            }
        )
            
        return Response(
            {
                "client_secret": intent.client_secret,
                "order_id": order.id,
            },
            status=s.HTTP_201_CREATED
        )

            
class ViewPayment(User_Auth):
    def get(self, request):
        staff = getattr(request.user, "is_staff")
        if not staff:
            return Response({'detail': "Only staff can access this."}, status=s.HTTP_403_FORBIDDEN)
        payments = Payment.objects.filter(
            status="paid"
        )
        ser_payment = PaymentSerializer(payments, many=True)
        return Response(ser_payment.data, status=s.HTTP_200_OK)
    
class CreateOrder(User_Auth):
    def post(self, request):
        release_expired_holds()
        if not request.user:
            return Response({'detail': 'Login or create account to purchase tickets'}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        cart = request.data

        def to_integer(x):
            try:
                return int(x)
            except(TypeError, ValueError):
                return 0
        general = to_integer(cart.get("typeA"))
        community = to_integer(cart.get("typeB"))
        master = to_integer(cart.get("typeC"))

        if general <= 0 and community <= 0 and master <= 0:
            return Response({
                "detail": "Cart is empty"}, status=s.HTTP_400_BAD_REQUEST)
         
        order = Order.objects.create(user=user, status="pending")
        type_map = {
            'general': general,
            'community': community,
            'master': master
        }
        templates = {
            t.ticket_type: t
            for t in TicketTemplate.objects.filter(
                ticket_type__in=type_map.keys(),
                is_active=True
            )
        }

        for ticket_type, qty in type_map.items():
            if qty <= 0:
                continue
            template = templates.get(ticket_type)
            if not template:
                return Response(
                    {"detail": f"Missing TicketTemplate for type '{ticket_type}'."},
                    status=s.HTTP_400_BAD_REQUEST
                )
            
            template = templates[ticket_type]
            unit_price = template.price
            line_total = (unit_price * Decimal(qty)).quantize(Decimal("0.01"))

            OrderItem.objects.create(
                order=order,
                ticket_template=template,
                quantity=qty,
                title_at_purchase=template.title,
                unit_price_at_purchase=unit_price,
                line_total=line_total,
            )
        
        order.recalculate_totals()
        order.save(update_fields=["subtotal", "total", 'tax', 'fees'])

        return Response(OrderSerializer(order).data, status=s.HTTP_201_CREATED)


class ReserveTickets(User_Auth):
    @transaction.atomic
    def patch(self, request):
        release_expired_holds()
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({'detail': 'order_id required'}, status=s.HTTP_400_BAD_REQUEST)
        
        order = get_object_or_404(Order, id=order_id, user=request.user)

        try:
            reserve_order_inventory(order)
        except ValidationError as e:
            return Response({'detail': str(e.detail)}, status=s.HTTP_400_BAD_REQUEST)
        
        order.refresh_from_db()
        return Response(
            {
                "detail": 'Tickets reserved for 10 minutes.',
                'order_id': order.id,
                'status': order.status,
                'reserved_until': order.reserved_until,
            },
            status=s.HTTP_200_OK
        )
        
