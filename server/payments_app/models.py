from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from user_app.models import MyUsers
from ticket_app.models import TicketTemplate


class Payment(models.Model):
    # ticket will be replaced with Order?
    order = models.OneToOneField('Order', on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(1.00), MaxValueValidator(1500.00)])
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(
    max_length=30,
    choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed')],
    default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order.user.full_name} paid ${self.amount} for Order #{self.order.id}."
    

    # TO-DO Create Order for tickets/payment
    # Order should take in user, ticket_type, quantity, status, price_at_purchase, and create_at.
    # Could split into two models, order and order item. May work better and display as a nicer receipt. 
    # One user can own many orders. 
    # Orders will double as what stripe pays for and as a displayable receipt to the user. 
    # TO-DO: Look into how to retrieve stripe order id and and put it in the order, if possible. 

class Order(models.Model):
    status = models.CharField(
    max_length=30,
    choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed')],
    default='pending'
    )
    user = models.ForeignKey(MyUsers, on_delete=models.CASCADE, related_name="orders")
    created_at = models.DateTimeField(auto_now_add=True)
    # Receipt Fields
    subtotal = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    fees = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    def __str__(self):
        return f"Order #{self.id} for {self.user.email} is {self.status}."
    
class OrderItem(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name="items")
    ticket_template = models.ForeignKey(TicketTemplate, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    # Receipt Fields
    title_at_purchase = models.CharField(max_length=255)
    unit_price_at_purchase = models.DecimalField(max_digits=8, decimal_places=2)
    line_total = models.DecimalField(max_digits=8, decimal_places=2)

# title_at_purchase = ticket_template.title
# unit_price_at_purchase = ticket_template.price
# line_total = unit_price_at_purchase * quantity

# order.subtotal = sum(line_total)
# order.total = subtotal + tax + fees