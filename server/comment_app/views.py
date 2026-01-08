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
# from .services import build_comment_tree
from event_app.models import Event


class ACommentView(APIView):
    def get(self,request,comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        ser = CommentSerializer(comment)
        return Response(ser.data, status=HTTP_200_OK)


class CommentView(APIView):
    def is_admin(self, user):
        return user.is_authenticated and getattr(user, "is_admin", False)

    def is_OP(self, user, comment):
        return user.is_authenticated and comment.author == user

    # READ (anyone)
    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        parents = (
            Comment.objects
            .filter(event=event,parent=None)
            .select_related("author")
        )
        ser = CommentSerializer(parents, many=True)
        return Response(ser.data, status=HTTP_200_OK)

    # CREATE (authenicated users)
    def post(self, request, event_id):
        if request.user.is_authenticated:
            event = get_object_or_404(Event, id=event_id)
            ser = CommentSerializer(data=request.data)
            if ser.is_valid():
                parent = ser.validated_data.get("parent")
                if parent and parent.event != event:
                    return Response({"detail": "Parent and child's events must be match up."}, status=HTTP_400_BAD_REQUEST)
                comment = ser.save(author=request.user, event=event)
                if parent:
                    print(parent.replies)
                    # also, add this newly created comment as a reply to the parent's comment
                    parent.replies.add(comment)
                    # parent.replies.save()



                return Response(ser.data, status=HTTP_201_CREATED)
            else:
                return Response(ser.errors, status=HTTP_400_BAD_REQUEST)
        else:
            return Response("Need to signup/login!", status=HTTP_401_UNAUTHORIZED)

    # UPDATE (only the OP)
    def put(self, request, id):
        comment = get_object_or_404(Comment, id=id)
        # print("text" in request and not self.is_OP(request.user, comment), ("parent" in request.data or "event" in request.data),("likes" in request and not request.user.is_authenticated) )
        if (("text" in request.data and not self.is_OP(request.user, comment)) 
            or 
        ("parent" in request.data or "event" in request.data) 
            or 
        (("likes" in request.data and not request.user.is_authenticated))):
            return Response({"detail": "Not authorized"}, status=HTTP_403_FORBIDDEN)
        comment_ser = CommentSerializer(comment, data=request.data, partial=True)
        if comment_ser.is_valid():
            comment_ser.save()
            print(request.data, comment_ser.data)
            return Response(comment_ser.data, status=HTTP_200_OK)
        return Response(comment_ser.errors, status=HTTP_400_BAD_REQUEST)

    # DELETE (only OP or admin)
    def delete(self, request, id):
        comment = get_object_or_404(Comment, id=id)
        if not (self.is_OP(request.user, comment) or self.is_admin(request.user)):
            return Response({"detail": "Not authorized"}, status=HTTP_403_FORBIDDEN)
        comment.delete()
        return Response(status=HTTP_204_NO_CONTENT)
