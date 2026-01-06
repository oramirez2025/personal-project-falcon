from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from user_app.models import MyUsers
from ticket_app.models import TicketTemplate


class Payment(models.Model):
    order = models.OneToOneField(
        'Order',
        on_delete=models.CASCADE,
        related_name='payment'
    )
    stripe_payment_intent_id = models.CharField(max_length=255)
    status = models.CharField(
        max_length=30,
        choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order #{self.order.id} ({self.status})"
    

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
    
    def recalculate_totals(self):
        subtotal = sum(
            item.line_total for item in self.items.all()
        )
        self.subtotal = subtotal
        self.total = subtotal + self.tax + self.fees

    def line_item_display(self):
        return list(
            self.items.values(
                'id',
                'title_at_purchase',
                'unit_price_at_purchase',
                'line_total',
                'quantity',
            )
        )
    
class OrderItem(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name="items")
    ticket_template = models.ForeignKey(TicketTemplate, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    # Receipt Fields
    title_at_purchase = models.CharField(max_length=255)
    unit_price_at_purchase = models.DecimalField(max_digits=8, decimal_places=2)
    line_total = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.unit_price_at_purchase} for {self.quantity} {self.ticket_template.ticket_type} tickets."

# title_at_purchase = ticket_template.title
# unit_price_at_purchase = ticket_template.price
# line_total = unit_price_at_purchase * quantity

# order.subtotal = sum(line_total)
# order.total = subtotal + tax + fees