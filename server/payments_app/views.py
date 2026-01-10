from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as s
import stripe
from .models import Order, OrderItem, Payment
from .serializers import PaymentSerializer
from ticket_app.models import Ticket, TicketTemplate
from falcon_proj import settings
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.validators import ValidationError
from user_app.views import User_Auth
from decimal import Decimal


# Create your views here.

stripe.api_key = settings.STRIPE_API_KEY

class CreatePaymentIntent(User_Auth):
    @transaction.atomic
    def post(self, request):
        order_id = request.data.get("order_id")
        if not order_id:
            return Response({"detail": "order_id required."}, status=s.HTTP_400_BAD_REQUEST)
        order = get_object_or_404(Order, id=order_id, user=request.user)

        if order.status == 'paid':
            return Response({"detail": 'Order already paid for.'})
        
        items = list(order.items.select_related("ticket_template"))

        for item in items:
            tt = TicketTemplate.objects.select_for_update().get(
                id=item.ticket_template.id
            )

            if item.quantity > tt.available_quantity:
                raise ValidationError("Not enough tickets available for {tt.ticket_type}.")
            
            tt.available_quantity -= item.quantity
            # Recall: community lodging is an upgrade of the general ticket; thus, we need to also reduce the availability of general tickets 
            if tt.ticket_type == "community":
                general = TicketTemplate.objects.select_for_update().get(ticket_type="general")
                if item.quantity > general.available_quantity:
                    raise ValidationError(
                        "Not enough general tickets available for community lodging."
                    )
                general.available_quantity -= item.quantity
                general.save()
            tt.save()
        intent = stripe.PaymentIntent.create(
            amount=int(order.total * 100),
            currency="usd",
            automatic_payment_methods={'enabled': True},
            metadata={"order_id": str(order.id), 'user_id': str(request.user.id)},
        )
        Payment.objects.create(
            order=order,
            stripe_payment_intent_id=intent.id,
            status="pending"
        )
        return Response(
            {
                "client_secret": intent.client_secret,
                "order_id": order.id,
            },
            status=s.HTTP_201_CREATED
        )

            
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
    
class CreateOrder(User_Auth):
    def post(self, request):
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

        created_items = []
        for ticket_type, qty in type_map.items():
            if qty <= 0:
                continue
            template = templates.get(ticket_type)
            if not template:
                return Response(
                    {"detail": f"Missing TicketTemplate for type '{ticket_type}'."},
                    status=s.HTTP_400_BAD_REQUEST
                )
            
            unit_price = template.price
            line_total = (unit_price * Decimal(qty)).quantize(Decimal("0.01"))

            item = OrderItem.objects.create(
                order=order,
                ticket_template=template,
                quantity=qty,
                title_at_purchase=template.title,
                unit_price_at_purchase=unit_price,
                line_total=line_total,
            )
            created_items.append(item)
        
        order.recalculate_totals()
        order.save(update_fields=["subtotal", "total"])
            
        return Response(
            {
                'id': order.id,
                'status': order.status,
                'subtotal': str(order.subtotal),
                'tax': str(order.tax),
                'fees': str(order.fees),
                'total': str(order.total),
                'items': [
                    {
                        "id": item.id,
                        "title_at_purchase": item.title_at_purchase,
                        "quantity": item.quantity,
                        "unit_price_at_purchase": str(item.unit_price_at_purchase),
                        "line_total": str(item.line_total),
                        "ticket_type": item.ticket_template.ticket_type,
                    }
                    for item in order.items.select_related("ticket_template")
                ]
            }, 
            status=s.HTTP_201_CREATED
        )
        
        