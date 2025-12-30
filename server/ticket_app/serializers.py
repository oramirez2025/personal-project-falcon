from rest_framework import serializers
from .models import TicketTemplate, Ticket
from payments_app.serializers import PaymentSerializer
from rest_framework.exceptions import ValidationError

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
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    ticket_type = serializers.CharField(max_length=255, source="ticket.ticket_type", read_only=True)
    payment = PaymentSerializer(read_only=True)
    class Meta:
        model = Ticket
        fields = ['id', 'user','ticket_type', 'quantity', 'ticket', 'payment']   
    