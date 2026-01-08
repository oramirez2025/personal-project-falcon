from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from .serializers import TicketTemplateSerializer
from .models import TicketTemplate
from user_app.views import User_Auth
from django.shortcuts import get_object_or_404
from payments_app.models import Order
from rest_framework import status as s
from rest_framework.validators import ValidationError
from django.db import transaction


# View all ticket templates 
class TicketTemplatesView(APIView):
    def get(self,request):
        ticket_templates = TicketTemplate.objects.all()
        ser_ticket_templates = TicketTemplateSerializer(ticket_templates, many=True)
        return Response(ser_ticket_templates.data, status=HTTP_200_OK)


class DecrementTemplate(User_Auth):
    @transaction.atomic
    def patch(self, request):
        order_id = request.data.get("order_id")
        req_id = request.headers.get("X-Request-ID")
        print("DECREMENT PATCH", order_id, "req_id=", req_id)
        if not order_id:
            return Response({"detail": "order_id required."}, status=s.HTTP_400_BAD_REQUEST)
        order = Order.objects.select_for_update().get(id=order_id, user=request.user)

        if order.status == 'paid':
            return Response({"detail": 'Tickets already decremented.'})
        
        items = list(order.items.select_related("ticket_template"))
        
        for item in items:
            tt = TicketTemplate.objects.select_for_update().get(
                id=item.ticket_template.id
            )
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
        order.status = "paid"
        order.save(update_fields=["status"])
        return Response({"detail": "Tickets successfully decremented."})