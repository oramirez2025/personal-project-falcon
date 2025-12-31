from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CommentSerializer
from .models import Comment
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_401_UNAUTHORIZED
)
from .services import build_comment_tree
from event_app.models import Event


class CommentView(APIView):
    def is_admin(self, user):
        return user.is_authenticated and getattr(user, "is_admin", False)

    def is_OP(self, user, comment):
        return user.is_authenticated and comment.author == user

    # READ (anyone)
    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        comments = build_comment_tree(event)
        return Response(comments, status=HTTP_200_OK)

    # CREATE (authenicated users)
    def post(self, request, event_id):
        if request.user.is_authenticated:
            event = get_object_or_404(Event, id=event_id)
            ser = CommentSerializer(data=request.data)
            if ser.is_valid():
                parent = ser.validated_data.get("parent")
                # parent and child's events should match
                if parent and parent.event != event:
                    Response({"detail": "Parent and child's events should match."}, status=HTTP_400_BAD_REQUEST)
                ser.save(author=request.user, event=event)
                return Response(ser.data, status=HTTP_201_CREATED)
            else:
                return Response(ser.errors, status=HTTP_400_BAD_REQUEST)
        else:
            return Response("Need to signup/login!", status=HTTP_401_UNAUTHORIZED)

    # TODO: 
    # - Make sure the methods below still work with the new way of building comment structure
    # # UPDATE (only the OP)
    # def put(self, request, id):
    #     comment = get_object_or_404(Comment, id=id)
    #     if not self.is_OP(request.user, comment):
    #         return Response({"detail": "Not authorized"}, status=HTTP_403_FORBIDDEN)
    #     comment_ser = CommentSerializer(comment, data=request.data, partial=True)
    #     if comment_ser.is_valid():
    #         comment_ser.save()
    #         return Response(comment_ser.data, status=HTTP_200_OK)
    #     return Response(comment_ser.errors, status=HTTP_400_BAD_REQUEST)

    # # DELETE (only OP or admin)
    # def delete(self, request, id):
    #     comment = get_object_or_404(Comment, id=id)
    #     if not (self.is_OP(request.user, comment) or self.is_admin(request.user)):
    #         return Response({"detail": "Not authorized"}, status=HTTP_403_FORBIDDEN)
    #     comment.delete()
    #     return Response(status=HTTP_204_NO_CONTENT)
