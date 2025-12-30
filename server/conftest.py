import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from ticket_app.models import Ticket,TicketTemplate


User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(db):
    return User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="password123",
    )

@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def premium_template(db):
    return TicketTemplate.objects.create(
        title="Premium Ticket",
        description="Premium access",
        price=500,
        ticket_type="premium",
        available_quantity=4,
    )

@pytest.fixture
def general_template(db):
    return TicketTemplate.objects.create(
        title="General Ticket",
        description="General access",
        price=200,
        ticket_type="general",
        available_quantity=16,
    )

@pytest.fixture
def upgrade_template(db):
    return TicketTemplate.objects.create(
        title="Community Lodging Upgrade",
        description="Upgrade lodging",
        price=100,
        ticket_type="upgrade",
        available_quantity=4,
    )