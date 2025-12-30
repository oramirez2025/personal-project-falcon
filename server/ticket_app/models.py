from django.db import models
from user_app.models import MyUsers
from django.core.exceptions import ValidationError
from django.core import validators as v




# Ticket on the frontend
class TicketTemplate(models.Model):
    TICKET_TYPE_CHOICES = [
        ("premium", "Premium"),
        ("general", "General"),
        ("upgrade", "Community Lodging Upgrade"),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    ticket_type = models.CharField(max_length=20, choices=TICKET_TYPE_CHOICES)
    available_quantity = models.PositiveIntegerField()

# Purchased ticket
class Ticket(models.Model):
    userprofile = models.ForeignKey(MyUsers, on_delete=models.CASCADE, related_name="ticket_purchases")
    ticket = models.ForeignKey(TicketTemplate, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(validators=[v.MinValueValidator(1)])
