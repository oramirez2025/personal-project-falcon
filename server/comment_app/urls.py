from django.urls import path
from .views import CommentView, ACommentView

urlpatterns = [
    path("single/<int:comment_id>/", ACommentView.as_view(), name="comment-view"),
    path("<int:id>/", CommentView.as_view(), name="comment-detail"),
    path("events/<int:event_id>/", CommentView.as_view(), name="event-comments")
]