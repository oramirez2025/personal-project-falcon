from rest_framework import serializers
from .models import MyUsers, UserProfile
from event_app.serializers import EventWishlistSerializer
from comment_app.serializers import CommentSerializer
from ticket_app.serializers import TicketSerializer

"""
TODO : Profile pic Y/N ? Y = utilize pillow
"""

class UsersSerializer(serializers.ModelSerializer):
    """Basic - for reg/auth"""
    class Meta:
        model = MyUsers
        fields = ['email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password' : {'write_only': True}
        }


class AdminPromotionSerializer(serializers.Serializer):
    """For promoting/demoting users to/from admin."""
    email = serializers.EmailField()
    action = serializers.ChoiceField(choices=['promote', 'demote'])
    
    def validate_email(self, value):
        """Ensure user exists."""
        if not MyUsers.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist")
        return value      


class UserProfileSerializer(serializers.ModelSerializer):
    """Gets all user data"""
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    is_admin = serializers.BooleanField(source='user.is_admin', read_only=True)
    is_staff = serializers.BooleanField(source='user.is_staff', read_only=True)
    is_superuser = serializers.BooleanField(source='user.is_superuser', read_only=True)
    event_wishlists = EventWishlistSerializer(
        source='user.event_wishlists', 
        many=True, 
        read_only=True
    )
    comments = CommentSerializer(
        source='user.comments',
        many=True,
        read_only=True
    )
    tickets = TicketSerializer(
        source='user.tickets',
        many=True,
        read_only=True
    )

    """
    For Merchandise_app future implementation
    ========================================= 
    merchandise_wishlists = MerchandiseWishlistSerializer(
        source='user.merchandise_wishlists', 
        many=True, 
        read_only=True
    )
    merchandise_reviews = MerchandiseReviewSerializer(
        source='user.merchandise_reviews',
        many=True,
        read_only=True
    )
    """

    
    class Meta:
        model = UserProfile
        fields = [
            # ================================
            #       Basic user info
            # ================================
            'email',
            'first_name',
            'last_name',
            'full_name',
            'is_admin',
            'is_staff',
            'is_superuser',

            # ================================
            #     Profile specific fields
            # ================================
            'bio',
            'phone_number',
            # 'profile_picture', # When pillow is configured, profile pic can be integrated

            # ================================
            # Related data (all-in-one query)
            # ================================
            'event_wishlists',
            'comments',    
            'tickets',
            # For Merchandise_app future implementation  
            # 'merchandise_reviews',  
            # 'merchandise_wishlists', 
        ]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Used to update profile."""
    
    class Meta:
        model = UserProfile
        fields = [
            'bio',
            'phone_number',
            # 'profile_picture', # REQ pillow implementation
        ]