from django.shortcuts import render
from rest_framework.views import APIView
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
)

class CommentView(APIView):
    def is_admin(self, user):
        return user.is_authenticated and getattr(user, "is_admin", False)

    def is_OP(self, user, comment):
        return user.is_authenticated and comment.author == user

    # CREATE (anyone)
    def post(self, request):
        comment_ser = CommentSerializer(data=request.data)
        if comment_ser.is_valid():
            comment_ser.save(author=request.user)
            return Response(comment_ser.data, status=HTTP_201_CREATED)
        return Response(comment_ser.errors, status=HTTP_400_BAD_REQUEST)

    # READ (anyone)
    def get(self, request):
        comments = Comment.objects.all()
        comments_ser = CommentSerializer(comments, many=True)
        return Response(comments_ser.data, status=HTTP_200_OK)

    # UPDATE (only the OP)
    def put(self, request, id):
        comment = get_object_or_404(Comment, id=id)
        if not self.is_OP(request.user, comment):
            return Response({"detail": "Not authorized"}, status=HTTP_403_FORBIDDEN)
        comment_ser = CommentSerializer(comment, data=request.data, partial=True)
        if comment_ser.is_valid():
            comment_ser.save()
            return Response(comment_ser.data, status=HTTP_200_OK)
        return Response(comment_ser.errors, status=HTTP_400_BAD_REQUEST)

    # DELETE (only OP or admin)
    def delete(self, request, id):
        comment = get_object_or_404(Comment, id=id)
        if not (self.is_OP(request.user, comment) or self.is_admin(request.user)):
            return Response({"detail": "Not authorized"}, status=HTTP_403_FORBIDDEN)
        comment.delete()
        return Response(status=HTTP_204_NO_CONTENT)
