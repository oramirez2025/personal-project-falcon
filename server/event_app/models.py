from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=255)
    day = models.DateField(null=False) # make sure it's in the range of the event
    start_time = models.TimeField(null=False) 
    end_time = models.TimeField(null=False)
    location = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return f"{self.day} at {self.location} from {self.start_time} to {self.end_time}"
