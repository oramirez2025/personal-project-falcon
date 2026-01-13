from rest_framework import serializers
from .models import Event, EventWishlist

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id","title", "day", "start_time", "end_time", "location", "description"]


class EventWishlistSerializer(serializers.ModelSerializer):
    """For displaying user's wishlisted events."""
    event = EventSerializer(read_only=True)
    
    class Meta:
        model = EventWishlist
        fields = ['id', 'event', 'added_at', 'notes']


class AddToWishlistSerializer(serializers.Serializer):
    """For adding event to wishlist."""
    event_id = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_event_id(self, value):
        """Check if event exists."""
        if not Event.objects.filter(id=value).exists():
            raise serializers.ValidationError("Event doesn't exist")
        return value
