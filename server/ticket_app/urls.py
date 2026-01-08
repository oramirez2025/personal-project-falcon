from .views import TicketTemplatesView, DecrementTemplate
from django.urls import path

urlpatterns = [
    # view all ticket templates 
    path('ticket_templates/', TicketTemplatesView.as_view(), name="ticket_templates"),
    path('decrement/', DecrementTemplate.as_view(), name='decrement'),
]