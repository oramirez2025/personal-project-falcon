from django.urls import path
from .views import CreatePaymentIntent
from .webhooks import stripe_webhook

urlpatterns = [
    path('create-intent/', CreatePaymentIntent.as_view(), name='create_payment_intent'),
    path('stripe-webhook/', stripe_webhook, name='stripe_webhook'),
]