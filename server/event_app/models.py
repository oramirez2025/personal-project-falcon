from django.db import models
from user_app.models import MyUsers

class Event(models.Model):
    title = models.CharField(max_length=255)
    day = models.DateField(null=False) # make sure it's in the range of the event
    start_time = models.TimeField(null=False) 
    end_time = models.TimeField(null=False)
    location = models.CharField(max_length=255)
    is_general_discussion = models.BooleanField(default=False)
    description = models.TextField()

    def __str__(self):
        return f"{self.day} at {self.location} from {self.start_time} to {self.end_time}"


class EventWishlist(models.Model):
    """
    Many-to-many relationship for events a user has favorited/wishlisted.\n
    user.event_wishlists.all() → QuerySet of EventWishlist\n
    event.wishlisted_by.all() → QuerySet of EventWishlist
    """
    user = models.ForeignKey(
        MyUsers, 
        on_delete=models.CASCADE, 
        related_name='event_wishlists'
    )
    event = models.ForeignKey(
        Event, 
        on_delete=models.CASCADE, 
        related_name='wishlisted_by'
    )
    added_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ['user', 'event']
        ordering = ['-added_at']
    
    def __str__(self):
        return f"{self.user.email} wishlisted {self.event.title}"
