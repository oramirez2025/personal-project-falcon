from django.db import models
from ticket_app.models import Ticket
from django.core.validators import MinValueValidator, MaxValueValidator


class Payment(models.Model):
    # ticket will be replaced with Order?
    ticket = models.OneToOneField(Ticket, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(1.00), MaxValueValidator(1500.00)])
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(
    max_length=30,
    choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed')],
    default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ticket.userprofile.full_name} paid for {self.ticket.quantity} {self.ticket.ticket_template} for ${self.amount}."
    

    # TO-DO Create Order for tickets/payment
    # Order should take in user, ticket_type, quantity, status, price_at_purchase, and create_at. 