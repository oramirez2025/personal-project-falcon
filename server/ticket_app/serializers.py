from rest_framework import serializers
from .models import TicketTemplate, Ticket
from payments_app.serializers import PaymentSerializer
from rest_framework.exceptions import ValidationError
from django.db.models import Sum

class TicketTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketTemplate
        fields = ['title', 'description', 'price', 'available_quantity']

    def validate(self,data):
        num_tickets_templates = len(TicketTemplate.TICKET_TYPE_CHOICES)
        # Check if the object exists and is a new type that needs to be made
        if self.instance is None and TicketTemplate.objects.count() >= num_tickets_templates:
            raise ValidationError(f"A maximum of {num_tickets_templates} is allowed.")
        else:
            return data


class TicketSerializer(serializers.ModelSerializer):
    ticket_type = serializers.CharField(max_length=255, source="ticket.ticket_type", read_only=True)
    payment = PaymentSerializer(read_only=True)
    class Meta:
        model = Ticket
        fields = ['ticket_type', 'quantity', 'ticket']   
    
    def validate(self, data):
        ticket_template = data["ticket"]
        requested_qty = data["quantity"]
        already_sold = (
            Ticket.objects
            .filter(ticket=ticket_template)
            .aggregate(total=Sum("quantity"))["total"]
            or 0 
        )

        remaining = ticket_template.available_quantity - already_sold
        if requested_qty > remaining:
            raise ValidationError(f"Only {remaining} tickets are still available for this ticket type.")
        return data 
