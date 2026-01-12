from django.urls import path
from .views import CreatePaymentIntent, CreateOrder, ReserveTickets
from .webhooks import stripe_webhook

urlpatterns = [
    path('create-intent/', CreatePaymentIntent.as_view(), name='create_payment_intent'),
    path('stripe-webhook/', stripe_webhook, name='stripe_webhook'),
    path('orders/create/', CreateOrder.as_view(), name='create_order'),
    path('reserve/', ReserveTickets.as_view(), name="reserve_tickets"),
]