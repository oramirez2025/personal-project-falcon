from rest_framework import serializers
from .models import Payment, Order, OrderItem

class PaymentSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="order.user.id", read_only=True)
    user_email = serializers.EmailField(source="order.user.email", read_only=True)
    order_id = serializers.IntegerField(source="order.id", read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order_id', 'user_id', 'user_email', 'stripe_payment_intent_id', 'status', 'created_at']
        read_only_fields = ['id', 'order_id', 'user_id', 'user_email', 'stripe_payment_intent_id', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    ticket_template_id = serializers.IntegerField(source="ticket_template.id", read_only=True)
    ticket_type = serializers.CharField(source='ticket_template.ticket_type', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'ticket_template_id', 'ticket_type', 'title_at_purchase', 'quantity', 'line_total', 'unit_price_at_purchase',]
        read_only_fields = fields


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    # I have these as serializer method fields because the attributes may not exist and be accessible.
    payment_status = serializers.SerializerMethodField()
    stripe_payment_intent_id = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "status", "created_at", "user_id", "user_email", "subtotal", "tax", "fees", "total", "items", "payment_status", "stripe_payment_intent_id", 'reserved_until',]
        read_only_fields = fields

    def get_payment_status(self, obj):
        payment = getattr(obj, "payment", None)
        return payment.status if payment else None

    def get_stripe_payment_intent_id(self, obj):
        payment = getattr(obj, "payment", None)
        return payment.stripe_payment_intent_id if payment else None
