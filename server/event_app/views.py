from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import EventSerializer
from .models import Event
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
)


class EventView(APIView):

    def is_admin(self, user):
        return user.is_authenticated and getattr(user, "is_admin", False)

    # CREATE (Only allowed by the admin)
    def post(self, request):
        if not self.is_admin(request.user):
            return Response({"detail": "Not authorized"}, status=HTTP_403_FORBIDDEN)
        event_ser = EventSerializer(data=request.data)
        if event_ser.is_valid():
            event_ser.save()
            return Response(event_ser.data, status=HTTP_201_CREATED)
        return Response(event_ser.errors, status=HTTP_400_BAD_REQUEST)

    # READ (anyone)
    def get(self, request):
        events = Event.objects.all()
        events_ser = EventSerializer(events, many=True)
        return Response(events_ser.data, status=HTTP_200_OK)

    # UPDATE (Only allowed by the admin)
    def put(self, request, id):
        if not self.is_admin(request.user):
            return Response({"detail": "Not authorized"}, status=HTTP_403_FORBIDDEN)
        event = get_object_or_404(Event, id=id)
        event_ser = EventSerializer(event, data=request.data, partial=True)
        if event_ser.is_valid():
            event_ser.save()
            return Response(event_ser.data, status=HTTP_200_OK)
        return Response(event_ser.errors, status=HTTP_400_BAD_REQUEST)

    # DELETE (only allowed by the admin)
    def delete(self, request, id):
        if not self.is_admin(request.user):
            return Response({"detail": "Not authorized"}, status=HTTP_403_FORBIDDEN)
        event = get_object_or_404(Event, id=id)
        event.delete()
        return Response(status=HTTP_204_NO_CONTENT)
