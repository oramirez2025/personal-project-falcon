from rest_framework import serializers
from .models import Comment

# Iterative serializer
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "author", "parent", "event", "text", "time", "likes"]
        read_only_fields = ["author", "event","likes"]




# Keep just for testing lol
class CommentRecursiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "author", "parent", "event", "text", "time", "likes"]
        read_only_fields = ["author"]
    # Recursively grab the replies of the comment
    def get_replies(self, curr_comment):
        replies = curr_comment.replies.all().order_by("time")
        return CommentSerializer(replies, many=True).data