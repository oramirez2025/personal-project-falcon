from django.db import models
from user_app.models import MyUsers
from django.core.exceptions import ValidationError
from django.core import validators as v




# Ticket on the frontend
class TicketTemplate(models.Model):
    TICKET_TYPE_CHOICES = [
        ("general", "General"),
        ("community", "Community"),
        ("master", "Master"),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    ticket_type = models.CharField(max_length=20, choices=TICKET_TYPE_CHOICES)
    available_quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"There are {self.available_quantity} {self.ticket_type} tickets left."

# Purchased ticket
class Ticket(models.Model):
    user = models.ForeignKey(MyUsers, on_delete=models.CASCADE, related_name="tickets")
    ticket_template = models.ForeignKey(TicketTemplate, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(validators=[v.MinValueValidator(1)])

    def __str__(self):
        return f"{self.user.full_name} had {self.quantity} {self.ticket_template.ticket_type} tickets."
