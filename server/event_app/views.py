from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework import status as s
from .models import Event, EventWishlist
from .serializers import EventSerializer, AddToWishlistSerializer


class EventView(APIView):
    """
    - CREATE/UPDATE/DELETE: Admin only (is_staff=True)
    - READ: Anyone
    """
    # Allow token auth for admin operations, but don't require auth (GET is public)
    authentication_classes = [TokenAuthentication]

    def is_admin(self, user):
        return user.is_authenticated and user.is_staff

    def post(self, request):
        """Create an event (Admin Only)"""
        if not self.is_admin(request.user):
            return Response({"detail": "Not authorized"}, status=s.HTTP_403_FORBIDDEN)
        
        event_ser = EventSerializer(data=request.data)
        if event_ser.is_valid():
            event_ser.save()
            return Response(event_ser.data, status=s.HTTP_201_CREATED)
        return Response(event_ser.errors, status=s.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        """Read (anyone)"""
        if id:
            # Get single event
            event = get_object_or_404(Event, id=id)
            event_ser = EventSerializer(event)
            return Response(event_ser.data, status=s.HTTP_200_OK)
        else:
            # Get all events
            events = Event.objects.all()
            events_ser = EventSerializer(events, many=True)
            return Response(events_ser.data, status=s.HTTP_200_OK)

    def put(self, request, id):
        """Update event (Admin Only)"""
        if not self.is_admin(request.user):
            return Response({"detail": "Not authorized"}, status=s.HTTP_403_FORBIDDEN)
        event = get_object_or_404(Event, id=id)
        event_ser = EventSerializer(event, data=request.data, partial=True)
        if event_ser.is_valid():
            event_ser.save()
            return Response(event_ser.data, status=s.HTTP_200_OK)
        return Response(event_ser.errors, status=s.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        """Delete event (Admin Only)"""
        if not self.is_admin(request.user):
            return Response({"detail": "Not authorized"}, status=s.HTTP_403_FORBIDDEN)
        event = get_object_or_404(Event, id=id)
        event.delete()
        return Response(status=s.HTTP_204_NO_CONTENT)


class EventWishlistView(APIView):
    """
    Manage event wishlists for authenticated users.\n
    POST: Add event to user's wishlist\n
    DELETE: Remove event from user's wishlist
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Add an event to wishlist."""
        serializer = AddToWishlistSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=s.HTTP_400_BAD_REQUEST)
        
        event_id = serializer.validated_data['event_id']
        notes = serializer.validated_data.get('notes', '')
        event = get_object_or_404(Event, id=event_id)
        
        # Create or get existing wishlist item
        wishlist_item, created = EventWishlist.objects.get_or_create(
            user=request.user,
            event=event,
            defaults={'notes': notes}
        )
        
        if not created:
            return Response({"message": "Event already in watchlist"},status=s.HTTP_200_OK)
        return Response(
            {
                "message": "Event added to watchlist", 
                "id": wishlist_item.id
            },
            status=s.HTTP_201_CREATED
        )
    
    def delete(self, request, event_id=None):
        """Remove an event from watchlist."""
        # Support both URL parameter and request body
        if event_id is None:
            event_id = request.data.get('event_id')

        if not event_id:
            return Response({"error": "event_id is required"}, status=s.HTTP_400_BAD_REQUEST)
        try:
            wishlist_item = EventWishlist.objects.get(
                user=request.user,
                event_id=event_id
            )
            wishlist_item.delete()
            return Response({"message": "Event removed from wishlist"}, status=s.HTTP_204_NO_CONTENT)
        except EventWishlist.DoesNotExist:
            return Response({"error": "Event not in wishlist"}, status=s.HTTP_404_NOT_FOUND)