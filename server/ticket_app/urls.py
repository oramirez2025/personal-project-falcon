from .views import TicketTemplatesView
from django.urls import path

urlpatterns = [
    # view all ticket templates 
    path('ticket_templates/', TicketTemplatesView.as_view(), name="ticket_templates"),

]