from rest_framework import serializers
from .models import Comment

from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    likes = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )

    class Meta:
        model = Comment
        fields = [
            "id",
            "author",
            "parent",
            "event",
            "text",
            "time",
            "likes",
            "replies",
        ]
        read_only_fields = ["author", "event"]

    def get_replies(self, curr_comment):
        replies = curr_comment.replies.all().order_by("time")
        return CommentSerializer(replies, many=True).data


# Keep just for testing lol
class CommentIterativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "author", "parent", "event", "text", "time", "likes"]
        read_only_fields = ["author", "event","likes"]



