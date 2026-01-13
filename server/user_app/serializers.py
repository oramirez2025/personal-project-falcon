from rest_framework import serializers
from .models import MyUsers, UserProfile
from event_app.serializers import EventWishlistSerializer
from comment_app.serializers import CommentSerializer
from ticket_app.serializers import TicketSerializer
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys

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
            'profile_pic',

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
    # User model fields (writable)
    first_name = serializers.CharField(max_length=50, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=50, required=False, allow_blank=True)

    class Meta:
        model = UserProfile
        fields = [
            'first_name',
            'last_name',
            'bio',
            'phone_number',
            'profile_pic',
        ]

    def update(self, instance, validated_data):
        # Extract user fields
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)

        # Update user model fields if provided
        user = instance.user
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        user.save()

        # Update profile fields
        return super().update(instance, validated_data)

    # Image validation constants
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    MIN_DIMENSION = 50  # Minimum 50x50 pixels
    MAX_DIMENSION = 4000  # Maximum 4000x4000 pixels
    RESIZE_THRESHOLD = 800  # Auto-resize if larger than 800x800
    VALID_FORMATS = ['JPEG', 'PNG', 'GIF']

    def validate_profile_pic(self, value):
        if not value:
            return value

        # Check file size (5MB max)
        if value.size > self.MAX_FILE_SIZE:
            raise serializers.ValidationError("Image file too large. Max size is 5MB.")

        # Verify image is valid using Pillow
        try:
            image = Image.open(value)
            image.verify()  # Verify it's a valid image
            # Re-open after verify (verify() can only be called once)
            value.seek(0)
            image = Image.open(value)
        except Exception:
            raise serializers.ValidationError("Invalid or corrupted image file.")

        # Check image format
        if image.format not in self.VALID_FORMATS:
            raise serializers.ValidationError(
                f"Invalid image format. Allowed formats: {', '.join(self.VALID_FORMATS)}."
            )

        # Check minimum dimensions
        width, height = image.size
        if width < self.MIN_DIMENSION or height < self.MIN_DIMENSION:
            raise serializers.ValidationError(
                f"Image too small. Minimum size is {self.MIN_DIMENSION}x{self.MIN_DIMENSION} pixels."
            )

        # Check maximum dimensions
        if width > self.MAX_DIMENSION or height > self.MAX_DIMENSION:
            raise serializers.ValidationError(
                f"Image too large. Maximum size is {self.MAX_DIMENSION}x{self.MAX_DIMENSION} pixels."
            )

        # Auto-resize if larger than threshold
        if width > self.RESIZE_THRESHOLD or height > self.RESIZE_THRESHOLD:
            value = self._resize_image(image, value.name)

        return value

    def _resize_image(self, image, filename):
        """Resize image to fit within RESIZE_THRESHOLD while maintaining aspect ratio."""
        # Convert to RGB if necessary (for PNG with transparency)
        if image.mode in ('RGBA', 'P'):
            image = image.convert('RGB')

        # Calculate new dimensions maintaining aspect ratio
        image.thumbnail((self.RESIZE_THRESHOLD, self.RESIZE_THRESHOLD), Image.LANCZOS)

        # Save to BytesIO buffer
        output = BytesIO()
        image.save(output, format='JPEG', quality=85)
        output.seek(0)

        # Create new InMemoryUploadedFile
        return InMemoryUploadedFile(
            file=output,
            field_name='profile_pic',
            name=f"{filename.rsplit('.', 1)[0]}.jpg",
            content_type='image/jpeg',
            size=sys.getsizeof(output),
            charset=None
        )