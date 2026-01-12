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
        try:
            # Extract only needed fields
            email = request.data.get('email')
            password = request.data.get('password')
            first_name = request.data.get('first_name', '')
            last_name = request.data.get('last_name', '')
            
            # Validate required fields
            if not email or not password:
                return Response(
                    {'error': 'Email and password are required'},
                    status=s.HTTP_400_BAD_REQUEST
                )
            
            # Check if user already exists
            if MyUsers.objects.filter(email=email).exists():
                return Response(
                    {'error': 'User with this email already exists'},
                    status=s.HTTP_400_BAD_REQUEST
                )
            
            # TODO verify un req
            # Create user with explicit fields
            user = MyUsers.objects.create_user(
                username=email,  # may not need !!!!
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # Create UserProfile
            UserProfile.objects.create(user=user)
            
            # Create auth token
            token = Token.objects.create(user=user)
            
            return Response({
                'user': user.email,  # Changed to 'user' (singular)
                'token': token.key
            }, status=s.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=s.HTTP_400_BAD_REQUEST
            )


class Log_in(APIView):
    """User login endpoint."""
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=s.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=email, password=password)
        
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key, 
                "user": user.email,  # Changed to 'user' (singular)
                "is_admin": user.is_admin,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            }, status=s.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Invalid email or password'}, 
                status=s.HTTP_401_UNAUTHORIZED
            )


class User_Auth(APIView):
    """Helper for Auth"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


class Log_out(User_Auth):
    """User logout endpoint."""
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({
                "message": "Logged out successfully"
            }, status=s.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=s.HTTP_400_BAD_REQUEST
            )


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
        profile = UserProfile.objects.select_related('user').prefetch_related(
            'user__event_wishlists__event',
            'user__comments__event',
            'user__tickets__ticket_template',
        ).get(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=s.HTTP_200_OK)
    
    def update(self, request):
        """Update user profile information (handles PUT and PATCH)."""
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
    
    # Alias PUT and PATCH to update handler
    put = patch = update


class AdminPromotionView(User_Auth):
    """
    Admin management endpoint - SUPERUSER ONLY.
    Only superusers can promote/demote admins.
    """
    def post(self, request):
        """Promote or demote a user."""
        # Single permission check
        if not request.user.is_superuser:
            return Response(
                {"error": "Only superusers can manage admins"},
                status=s.HTTP_403_FORBIDDEN
            )
        
        # Validate and get user
        serializer = AdminPromotionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=s.HTTP_400_BAD_REQUEST)
        
        target_user = get_object_or_404(MyUsers, email=serializer.validated_data['email'])
        action = serializer.validated_data['action']
        
        # Prevent self-demotion
        if action == 'demote' and target_user == request.user:
            return Response(
                {"error": "You cannot demote yourself"},
                status=s.HTTP_403_FORBIDDEN
            )
        
        # Check current state
        if action == 'promote' and target_user.is_admin:
            return Response(
                {"message": "User is already an admin"},
                status=s.HTTP_200_OK
            )
        if action == 'demote' and not target_user.is_admin:
            return Response(
                {"message": "User is not an admin"},
                status=s.HTTP_200_OK
            )
        
        # Execute action
        is_admin = (action == 'promote')
        target_user.is_admin = target_user.is_staff = is_admin
        target_user.save()
        
        verb = "promoted to" if is_admin else "demoted from"
        return Response({
            "message": f"{target_user.email} has been {verb} admin",
            "user": {
                "email": target_user.email,
                "is_staff": is_admin,
                "is_admin": is_admin
            }
        }, status=s.HTTP_200_OK)


class UserTicketsView(User_Auth):
    """Get user's paid ticket orders."""
    def get(self, request):
        from payments_app.models import Order
        from payments_app.serializers import OrderSerializer

        orders = Order.objects.filter(
            user=request.user,
            status='paid'
        ).prefetch_related(
            'items__ticket_template',
            'payment'
        ).order_by('-created_at')

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=s.HTTP_200_OK)