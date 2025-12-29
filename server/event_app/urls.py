from django.urls import path

from .views import EventView

urlpatterns = [
    path("", EventView.as_view(), name="event-view"),
    path("<int:id>/", EventView.as_view(), name="event-detail")
]