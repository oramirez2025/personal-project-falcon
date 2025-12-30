from rest_framework import serializers
from .models import MyUsers, UserProfile

# TODO
# ensure following serializers are created for implementation,
# --if not using sep ser's for comment adapt to use single comment ser--
from event_app.serializers import EventWishlistSerializer
# from comment_app.serializers import EventCommentSerializer, MerchandiseReviewSerializer
# from merchandise_app.serializers import MerchandiseWishListSerializer

class UsersSerializer(serializers.ModelSerializer):
    '''
    Basic - for reg/auth
    '''
    class Meta:
        model = MyUsers
        fields = ['email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password' : {'write_only': True}
        }

class UserProfileSerializer(serializers.ModelSerializer):
    '''
    Gets all user data
    '''
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
    # TODO item (stand in for merch w/l)
    # merchandise_wishlists = MerchandiseWishlistSerializer(
    #     source='user.merchandise_wishlists', 
    #     many=True, 
    #     read_only=True
    # )

    # TODO item (stand in for event comment)
    # event_comments = EventCommentSerializer(
    #     source='user.event_comments',
    #     many=True,
    #     read_only=True
    # )
    # TODO item (stand in for merch comment/review)
    # merchandise_reviews = MerchandiseReviewSerializer(
    #     source='user.merchandise_reviews',
    #     many=True,
    #     read_only=True
    # )

    
    tickets = serializers.PrimaryKeyRelatedField(
        source="ticket_purchases",
        many=True,
        read_only=True
    )

    class Meta:
        model = UserProfile
        fields = [
            # Basic user info
            'email',
            'first_name',
            'last_name',
            'full_name',
            'is_admin',
            'is_staff',
            'is_superuser',
            
            # Profile specific fields
            'bio',
            'phone_number',
            'profile_picture',
            
            # Related data (one query via reverse relationships)
            # Uncomment when ready
            #      |
            #      V
            'event_wishlists',
            # 'merchandise_wishlists', 
            # 'event_comments',  
            # 'merchandise_reviews',  
            # 'comments',  # Use this if only singular ser
            'tickets',  
        ]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    '''
    Used to update profile.
    '''
    class Meta:
        model = UserProfile
        fields = [
            'bio',
            'phone_number',
            'profile_pic'
        ]


class AdminPromotionSerializer(serializers.Serializer):
    """For promoting/demoting users to/from admin."""
    email = serializers.EmailField()
    action = serializers.ChoiceField(choices=['promote', 'demote'])
    
    def validate_email(self, value):
        """Ensure user exists."""
        try:
            MyUsers.objects.get(email=value)
        except MyUsers.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist")
        return value        