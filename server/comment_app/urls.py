from django.urls import path
from .views import CommentView, ACommentView, GeneralCommentView

urlpatterns = [
    path("single/<int:comment_id>/", ACommentView.as_view(), name="comment-view"),
    path("events/<int:event_id>/", CommentView.as_view(), name="event-comments"),
    path("general/<int:year>/", GeneralCommentView.as_view(), name="general-comments"),
    path("<int:id>/", CommentView.as_view(), name="comment-detail"),
]