from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from user_app.models import UserProfile
from ticket_app.models import TicketTemplate
from payments_app.models import Order, OrderItem, Payment
from decimal import Decimal
from datetime import timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates test data for user profile and tickets'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating test data...')

        # Create or get test user
        email = 'test@example.com'
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': 'John',
                'last_name': 'Doe',
            }
        )

        if created:
            user.set_password('password123')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {email}'))
        else:
            self.stdout.write(self.style.WARNING(f'User already exists: {email}'))

        # Create or get user profile
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'bio': 'Fantasy enthusiast and forge master. Ready for the ultimate medieval experience!',
                'phone_number': '555-123-4567'
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS('Created user profile'))
        else:
            self.stdout.write(self.style.WARNING('User profile already exists'))

        # Create ticket templates if they don't exist
        templates_data = [
            {
                'title': 'General Admission',
                'description': 'Base ticket for FalconForge event',
                'price': Decimal('250.00'),
                'ticket_type': 'general',
                'available_quantity': 100
            },
            {
                'title': 'Community Ticket',
                'description': 'Shared on-site stay experience',
                'price': Decimal('400.00'),
                'ticket_type': 'community',
                'available_quantity': 50
            },
            {
                'title': 'Master Upgrade',
                'description': 'Private chamber accommodation',
                'price': Decimal('600.00'),
                'ticket_type': 'master',
                'available_quantity': 20
            }
        ]

        templates = {}
        for data in templates_data:
            template, created = TicketTemplate.objects.get_or_create(
                ticket_type=data['ticket_type'],
                defaults=data
            )
            templates[data['ticket_type']] = template

            if created:
                self.stdout.write(self.style.SUCCESS(f'Created ticket template: {data["title"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'Ticket template already exists: {data["title"]}'))

        # Create test orders with different dates
        # Include orders from previous years (2024, 2025) and current year (2026)
        orders_data = [
            # 2024 orders (history)
            {
                'date_offset': 730,  # ~2 years ago
                'items': [
                    {'type': 'general', 'quantity': 1},
                ]
            },
            {
                'date_offset': 700,  # ~1.9 years ago
                'items': [
                    {'type': 'community', 'quantity': 1},
                ]
            },
            # 2025 orders (history)
            {
                'date_offset': 365,  # ~1 year ago
                'items': [
                    {'type': 'general', 'quantity': 2},
                ]
            },
            {
                'date_offset': 340,  # ~11 months ago
                'items': [
                    {'type': 'master', 'quantity': 1},
                ]
            },
            # 2026 orders (active - current year)
            {
                'date_offset': 7,  # 7 days ago
                'items': [
                    {'type': 'general', 'quantity': 2},
                ]
            },
            {
                'date_offset': 3,  # 3 days ago
                'items': [
                    {'type': 'community', 'quantity': 1},
                ]
            },
            {
                'date_offset': 1,  # 1 day ago
                'items': [
                    {'type': 'general', 'quantity': 1},
                    {'type': 'master', 'quantity': 1},
                ]
            },
        ]

        for i, order_data in enumerate(orders_data, 1):
            # Check if order already exists for this user
            existing_orders = Order.objects.filter(user=user, status='paid').count()

            if existing_orders >= len(orders_data):
                self.stdout.write(self.style.WARNING(f'Test orders already exist for user'))
                break

            # Create order
            order = Order.objects.create(
                user=user,
                status='paid',
                subtotal=Decimal('0.00'),
                tax=Decimal('0.00'),
                fees=Decimal('0.00'),
                total=Decimal('0.00')
            )

            # Set created_at to past date
            order.created_at = timezone.now() - timedelta(days=order_data['date_offset'])

            subtotal = Decimal('0.00')

            # Create order items
            for item_data in order_data['items']:
                template = templates[item_data['type']]
                quantity = item_data['quantity']
                line_total = template.price * quantity
                subtotal += line_total

                OrderItem.objects.create(
                    order=order,
                    ticket_template=template,
                    title_at_purchase=template.title,
                    unit_price_at_purchase=template.price,
                    quantity=quantity,
                    line_total=line_total
                )

            # Update order totals
            order.subtotal = subtotal
            order.total = subtotal
            order.save()

            # Create payment record
            Payment.objects.create(
                order=order,
                status='paid',
                stripe_payment_intent_id=f'pi_test_{i}_{user.id}'
            )

            self.stdout.write(self.style.SUCCESS(
                f'Created order #{order.id} with {len(order_data["items"])} ticket type(s) - ${order.total}'
            ))

        self.stdout.write(self.style.SUCCESS('\n✅ Test data creation complete!'))
        self.stdout.write(self.style.SUCCESS(f'\nTest user credentials:'))
        self.stdout.write(self.style.SUCCESS(f'  Email: {email}'))
        self.stdout.write(self.style.SUCCESS(f'  Password: password123'))
        self.stdout.write(self.style.SUCCESS(f'\nLog in and visit /profile to see the tickets!'))
