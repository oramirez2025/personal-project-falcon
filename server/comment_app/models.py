from django.db import models
from event_app.models import Event
# updated to correct path
from user_app.models import MyUsers

class Comment(models.Model):
    author = models.ForeignKey(MyUsers, on_delete=models.CASCADE, related_name="comments")
    time = models.DateTimeField(auto_now_add=True)
    text = models.TextField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="comments")
    def __str__(self):
        return f"{self.author} on {self.event} said {self.text[:50]}..."