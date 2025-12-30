import threading
import pytest
from django.db.models import Sum

from ticket_app.serializers import TicketSerializer
from ticket_app.models import Ticket


@pytest.mark.django_db
def test_ticket_serializer_valid(user, premium_template):
    data = {
        "ticket": premium_template.id,
        "quantity": 2,
    }

    serializer = TicketSerializer(data=data)
    assert serializer.is_valid(), serializer.errors

    ticket = serializer.save(user=user)

    assert ticket.quantity == 2
    assert ticket.ticket == premium_template


# ❗ Only keep this if you added validate_quantity()
@pytest.mark.django_db
def test_ticket_serializer_rejects_zero_quantity(premium_template):
    serializer = TicketSerializer(
        data={"ticket": premium_template.id, "quantity": 0}
    )
    assert not serializer.is_valid()


@pytest.mark.django_db
def test_cannot_oversell_single_template(
    auth_client,
    user,
    premium_template,
):
    Ticket.objects.create(
        user=user,
        ticket=premium_template,
        quantity=3,
    )

    response = auth_client.post(
        "/ticket/purchased_tickets/",
        data={
            "ticket": premium_template.id,
            "quantity": 2,
        },
        format="json",
    )

    assert response.status_code == 400
    assert "Only 1 tickets" in str(response.data)


@pytest.mark.django_db
def test_global_premium_limit_enforced(
    auth_client,
    user,
    premium_template,
):
    Ticket.objects.create(
        user=user,
        ticket=premium_template,
        quantity=4,
    )

    response = auth_client.post(
        "/ticket/purchased_tickets/",
        data={
            "ticket": premium_template.id,
            "quantity": 1,
        },
        format="json",
    )

    assert response.status_code == 400


@pytest.mark.django_db(transaction=True)
def test_concurrent_purchases_do_not_oversell(
    auth_client,
    user,
    premium_template,
):
    results = []

    def attempt_purchase():
        response = auth_client.post(
            "/ticket/purchased_tickets/",
            data={
                "ticket": premium_template.id,
                "quantity": 3,
            },
            format="json",
        )
        results.append(response.status_code)

    t1 = threading.Thread(target=attempt_purchase)
    t2 = threading.Thread(target=attempt_purchase)

    t1.start()
    t2.start()

    t1.join()
    t2.join()

    assert sorted(results) == [201, 400]

    total_sold = (
        Ticket.objects
        .filter(ticket=premium_template)
        .aggregate(total=Sum("quantity"))["total"]
    )

    assert total_sold == 3
