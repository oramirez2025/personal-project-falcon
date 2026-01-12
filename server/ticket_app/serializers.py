from rest_framework import serializers
from .models import TicketTemplate, Ticket
from rest_framework.exceptions import ValidationError

class TicketTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketTemplate
        fields = ['title', 'description', 'price', 'available_quantity', 'is_active']

    def validate(self,data):
        num_tickets_templates = len(TicketTemplate.TICKET_TYPE_CHOICES)
        # Check if the object exists and is a new type that needs to be made
        if self.instance is None and TicketTemplate.objects.count() >= num_tickets_templates:
            raise ValidationError(f"A maximum of {num_tickets_templates} is allowed.")
        else:
            return data


class TicketSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    ticket_type = serializers.CharField(source="ticket_template.ticket_type", read_only=True)
    ticket_template_id = serializers.IntegerField(source='ticket_template.id', read_only=True)
    title = serializers.CharField(source='ticket_template.title', read_only=True)
    class Meta:
        model = Ticket
        fields = ['id', 'user','ticket_type', 'ticket_template_id', 'title', 'quantity',]   
    