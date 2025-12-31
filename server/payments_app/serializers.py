from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    # changed to break circular imports
    """
    # Add user details via method field if needed
    user_email = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    
    def get_user_email(self, obj):
        return obj.ticket.user.email
    
    def get_user_name(self, obj):
        return obj.ticket.user.full_name
    """

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['created_at', 'lesson', 'stripe_payment_intent_id']