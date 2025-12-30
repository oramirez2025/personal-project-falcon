from django.core.exceptions import ValidationError


# Constraints set by AJ
MAX_PREMIUM = 4
MAX_UPGRADES = 4
MAX_GENERAL = 16
MAX_TOTAL = 20


def validate_available_quantity(p, u, g):
    """
    :param p: Premium tickets
    :param u: General tickets upgraded to community lodging
    :param g: General tickets (not upgraded)
    """

    if not (0 <= p <= MAX_PREMIUM):
        raise ValidationError(
            f"The number of premium tickets must be between 0 and {MAX_PREMIUM}.",
            params={"premium": p, "upgraded": u, "general": g},
        )

    if not (0 <= u <= MAX_UPGRADES):
        raise ValidationError(
            f"The number of general tickets upgraded to community lodging "
            f"must be between 0 and {MAX_UPGRADES}.",
            params={"premium": p, "upgraded": u, "general": g},
        )

    if not (0 <= g + u <= MAX_GENERAL):
        raise ValidationError(
            f"The total number of general tickets, including those upgraded "
            f"to community lodging, cannot exceed {MAX_GENERAL}.",
            params={"premium": p, "upgraded": u, "general": g},
        )

    if not (0 <= p + u + g <= MAX_TOTAL):
        raise ValidationError(
            f"The total number of tickets across all categories "
            f"cannot exceed {MAX_TOTAL}.",
            params={"premium": p, "upgraded": u, "general": g},
        )
