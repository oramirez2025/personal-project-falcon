from django.db import models
from django.contrib.auth.models import AbstractUser

# TODO: consider refactor to replace is_admin with is_staff (removes bloat)

class MyUsers(AbstractUser):
    email = models.EmailField(unique=True)
    # REFACTOR - can use is_staff to replace this entirely.  
    is_admin = models.BooleanField(default=False)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    
    # Information about fields
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    @property
    def full_name(self):
        """Return full name or email if name not set."""
        name = f"{self.first_name or ''} {self.last_name or ''}".strip()
        return name if name else self.email
    
    def __str__(self):
        return self.full_name if self.full_name else self.email
    
class UserProfile(models.Model):
    """Single source for queries.

    ***

    <h3>Relationships:</h3>
        <u>Direct:</u>
            * user (OneToOne) → MyUsers instance
            
        <u>Reverse (accessed via user):</u>
            * profile.user.profile → UserProfile instance (self-reference)
            * profile.user.event_wishlists.all() → QuerySet of EventWishlist
            * profile.user.comments.all() → QuerySet of Comment
            * profile.user.tickets.all() → QuerySet of Ticket
            
        <u>Future (when merchandise app is ready):</u>
            * profile.user.merchandise_wishlists.all() → QuerySet of MerchandiseWishlist
            * profile.user.merchandise_reviews.all() → QuerySet of MerchandiseReview
    
    ***        
    
    <h3> Example Usage:</h3>

        <u>Get user's profile</u>
        ```python
        profile = UserProfile.objects.get(user=request.user)
        ```

        <u>Access user info</u>
        ```python
        email = profile.user.email
        full_name = profile.user.full_name
        ```

        <u>Access related data via reverse relationships</u>
        ```python
        wishlists = profile.user.event_wishlists.all()
        comments = profile.user.comments.all()
        tickets = profile.user.tickets.all()
        ```

        <u>Optimized query for all data</u>
        ```python
        profile = UserProfile.objects.select_related('user').prefetch_related(
            'user__event_wishlists__event',
            'user__comments__event',
            'user__tickets__ticket_template',
        ).get(user=request.user)
        ```
    """

    user = models.OneToOneField(
        MyUsers,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    bio = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_pic = models.ImageField(
        upload_to='profile_pics/',
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.user.email or self.user.first_name}'s Profile"
    
    class Meta:

        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"