from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="order.user.id", read_only=True)
    user_email = serializers.EmailField(source="order.user.email", read_only=True)
    order_id = serializers.IntegerField(source="order.id", read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order_id', 'user_id', 'user_email', 'amount', 'stripe_payment_intent_id', 'status', 'created_at']
        read_only_fields = ['id', 'order_id', 'user_id', 'user_email', 'stripe_payment_intent_id', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    pass


class OrderSerializer(serializers.ModelSerializer):
    pass




    """
    # Add user details via method field if needed
    user_email = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    
    def get_user_email(self, obj):
        return obj.ticket.user.email
    
    def get_user_name(self, obj):
        return obj.ticket.user.full_name
    """