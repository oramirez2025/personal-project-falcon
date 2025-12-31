from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status as s
from .models import MyUsers, UserProfile
from .serializers import (
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    AdminPromotionSerializer,
)

class Sign_Up(APIView):
    """
    User registration endpoint.
    Auto creates UserProfile after user creation.
    """
    def post(self, request):
        request.data["username"] = request.data["email"]   # Set username to email for Django's User model
        user = MyUsers.objects.create_user(**request.data) # Create user
        UserProfile.objects.create(user=user)              # Create UserProfile
        token = Token.objects.create(user=user)            # Create auth token
        return Response(
            {'user': user.email, 'token': token.key}, 
            status=s.HTTP_201_CREATED
        )


class Log_in(APIView):
    """User login endpoint."""
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get('password')
        user = authenticate(username=email, password=password)
        
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key, 
                "user": user.email,
                "is_admin": user.is_admin,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            })
        else:
            return Response(
                "No user matching credentials", 
                status=s.HTTP_404_NOT_FOUND
            )


class User_Auth(APIView):
    """Helper for Auth"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


class Log_out(User_Auth):
    """User logout endpoint."""
    def post(self, request):
        user = request.user
        user_data = {
            "email": user.email,
            "id": user.id,
            "username": getattr(user, "username", None),
        }
        request.user.auth_token.delete()
        return Response({
            "message": "Logged out successfully", 
            "user": user_data
        })


class Info(User_Auth):
    """Quick user info endpoint."""
    def get(self, request):
        return Response({
            "email": request.user.email,
            "is_admin": request.user.is_admin,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser
        }, status=s.HTTP_200_OK)


class UserAccountView(User_Auth):
    """
    ALL user account data in one query with select_related and prefetch_related.
    
    :GET: Returns complete user profile with all related data
    :PUT/PATCH: Updates profile information only
    """
    def get(self, request):
        """
        Reverse relationship reference:
        - event_wishlists
        - comments 
        - tickets 
        """
        profile = UserProfile.objects.select_related('user').prefetch_related(
            'user__event_wishlists__event',
            'user__comments__event',
            'user__tickets__ticket',
            # 'user__merchandise_wishlists__merchandise',  # when merch app implemented
            # 'user__merchandise_reviews__merchandise',  # when merch app implemented
        ).get(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=s.HTTP_200_OK)
    
    def update(self, request):
        """Update user profile information (PUT / PATCH)."""
        profile = request.user.profile
        serializer = UserProfileUpdateSerializer(
            profile, 
            data=request.data, 
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            full_serializer = UserProfileSerializer(profile)
            return Response(full_serializer.data, status=s.HTTP_200_OK)
        return Response(serializer.errors, status=s.HTTP_400_BAD_REQUEST)
    
    # Alias PUT and PATCH to be same
    put = patch = update


class AdminPromotionView(User_Auth):
    """
    Admin management endpoint for promoting/demoting users.
    
    #### Permissions:
    - Promote: Requires is_admin
    - Demote: Requires is_superuser
    """ 
    def post(self, request):
        """Promote or demote a user."""
        action = request.data.get('action')
        
        # Permission check - fail fast
        if action == 'promote' and not request.user.is_admin:
            return Response({"error": "Only admins can promote users"}, status=HTTP_403_FORBIDDEN)
        if action == 'demote' and not request.user.is_superuser:
            return Response({"error": "Only superusers can demote admins"}, status=HTTP_403_FORBIDDEN)
        
        # Validate and get user
        serializer = AdminPromotionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=s.HTTP_400_BAD_REQUEST)
        
        target_user = get_object_or_404(MyUsers, email=serializer.validated_data['email'])
        
        # Action-specific validation and execution
        if action == 'promote':
            if target_user.is_admin:
                return Response({"message": "User is already an admin"}, status=s.HTTP_200_OK)
            
            target_user.is_admin = target_user.is_staff = True
            target_user.save()
            return Response({
                "message": f"{target_user.email} has been promoted to admin",
                "user": {"email": target_user.email, "is_staff": True, "is_admin": True}
            }, status=s.HTTP_200_OK)
        
        else:  # demote
            # safety checks
            if target_user == request.user:
                return Response({"error": "You cannot demote yourself!"}, status=s.HTTP_403_FORBIDDEN)
            if not target_user.is_admin:
                return Response({"message": "Selected user is not an admin."}, status=s.HTTP_200_OK)
            if target_user.is_superuser:
                return Response({"error": "Cannot demote a superuser!"}, status=s.HTTP_403_FORBIDDEN)
            # perform the demotion
            target_user.is_admin = target_user.is_staff = False
            target_user.save()
            return Response({
                "message": f"{target_user.email} has been demoted from admin",
                "user": {"email": target_user.email, "is_staff": False, "is_admin": False}
            }, status=s.HTTP_200_OK)