from django.urls import path
from .views import EventView, EventWishlistView

urlpatterns = [
    path("", EventView.as_view(), name="event-list"),
    path("<int:id>/", EventView.as_view(), name="event-detail"),
    path("watchlist/", EventWishlistView.as_view(), name="event-watchlist"),
    path("watchlist/<int:event_id>/", EventWishlistView.as_view(), name="event-watchlist-detail"),
]