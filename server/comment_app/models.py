from django.contrib.postgres.fields import ArrayField
from django.db import models
from event_app.models import Event
# updated to correct path
from user_app.models import MyUsers
from .validators import validate_id
from django.core import validators as v


class Comment(models.Model):
    author = models.ForeignKey(
        MyUsers, 
        on_delete=models.CASCADE, 
        related_name="comments"
        )
    time = models.DateTimeField(auto_now_add=True)
    
    parent = models.ForeignKey(
        "self", 
        null=True, 
        blank=True, 
        on_delete=models.CASCADE, 
        related_name="replies"
    )
    
    
    text = models.TextField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="comments")
    
    # List of user_ids of those who liked this comment
    likes = ArrayField(
        models.IntegerField(validators=[validate_id])
    )
    
    def __str__(self):
        return f"{self.author} on {self.event} said {self.text[:50]}..."