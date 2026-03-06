from django.urls import re_path
from . import consumers

websocket_urlpatterns =[
    re_path(r"ws/comments/(?P<event_id>\d+)/$", consumers.CommentConsumer.as_asgi()),
    re_path(r"ws/comments/general/(?P<year_id>\d+)/$", consumers.GeneralCommentConsumer.as_asgi()),
]