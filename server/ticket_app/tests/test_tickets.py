import pytest

from ticket_app.serializers import TicketSerializer


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
