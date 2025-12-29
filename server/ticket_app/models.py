from django.db import models
from user_app.models import MyUsers



# Ticket on the frontend
class TicketTemplate(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    # Add validator to ensure people don't buy too many tickets and that tickets are available 
    available_quantity = models.PositiveIntegerField()


# Purchased ticket
class Ticket(models.Model):
    userprofile = models.ForeignKey(MyUsers, on_delete=models.CASCADE, related_name="ticket_purchases")
    ticket = models.ForeignKey(TicketTemplate, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
