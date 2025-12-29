from rest_framework import serializers
from .models import Payment
from user_app.serializers import UserAppProfileSerializer

class PaymentSerializer(serializers.ModelSerializer):
    student = UserAppProfileSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['created_at', 'lesson', 'stripe_payment_intent_id']