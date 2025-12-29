from rest_framework import serializers
from .models import TicketTemplate, Ticket
from payment_app.serializers import PaymentSerializer

class TicketTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketTemplate
        fields = ['title', 'description', 'price', 'available_quantity']

class TicketSerializer(serializers.ModelSerializer):
    ticket_type = serializers.CharField(max_length=255, source="ticket_template.title")
    payment = PaymentSerializer(read_only=True)
    class Meta:
        model = Ticket
        fields = ['ticket_type', 'quantity']   