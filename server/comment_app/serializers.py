from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["author", "parent", "event", "text", "time", "likes"]
        read_only_fields = ["author", "parent"]
