from django.db import models
from django.contrib.auth.models import AbstractUser

class MyUsers(AbstractUser):
    # Fields for users
    email = models.EmailField(unique=True)
    # now we can have users be admins, make, delete, events.
    is_admin = models.BooleanField(default=False)
    # user can now make use of names for more personalized profile and ticket information
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    
    # Information about fields
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # added properties to make calling easier
    # added repr str for testing purposes
    @property
    def is_admin(self):
        return self.is_admin
    
    @property
    def full_name(self):
        name = f"{self.first_name or ''} {self.last_name or ''}".strip()
        return name if name else self.email
    
    def __str__(self):
        return self.full_name if self.full_name else self.email