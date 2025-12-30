from django.db import models
from django.contrib.auth.models import AbstractUser

# TODO
# consider refactor to replace is_admin with is_staff (removes bloat)
# profile pic y/n? If y, then implement pillow

class MyUsers(AbstractUser):
    email = models.EmailField(unique=True)
    # REFACTOR ME. Now we can have users be admins, make, delete, events. 
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
    def full_name(self):
        name = f"{self.first_name or ''} {self.last_name or ''}".strip()
        return name if name else self.email
    
    def __str__(self):
        return self.full_name if self.full_name else self.email
    
class UserProfile(models.Model):
    '''
    Single query source for React via reverse relationships.
    '''
    # Reverse Relationship ref assumptions:
    # From UserProfile: user.profile → UserProfile inst (OneToOne)
    # From EventWishlist: user.event_wishlists.all() → QuerySet of EventWishlist
    # From MerchandiseWishlist: user.merchandise_wishlists.all() → QuerySet of MerchandiseWishlist
    # From EventComment: user.event_comments.all() → QuerySet of EventComment
    # From MerchandiseReview: user.merchandise_reviews.all() → QuerySet of MerchandiseReview
    # From Ticket: user.tickets.all() → QuerySet of Ticket
    # From Comment: user.comments.all() → QuerySet of Comment (used if ser's not split?)

    user = models.OneToOneField(
        MyUsers,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    bio = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    # TODO item
    # profile_pic = models.ImageField(
    #     upload_to='profile_pics/',
    #     blank=True,
    #     null=True
    # )

    def __str__(self):
        return f"{self.user.email or self.user.first_name}'s Profile"
    
    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"