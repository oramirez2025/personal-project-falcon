from django.urls import path
from .views import CommentView

urlpatterns = [
    path("", CommentView.as_view(), name="comment-view"),
    path("<int:id>/", CommentView.as_view(), name="comment-detail")
]