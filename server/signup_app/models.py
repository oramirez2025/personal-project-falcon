from django.db import models
from django.contrib.auth.models import AbstractUser

class MyUsers(AbstractUser):
    # Fields for users
    email = models.EmailField(unique=True)
    # now we can have users be admins, make, delete, events.
    is_admin = models.BooleanField(default=False)
    
    # Information about fields
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
