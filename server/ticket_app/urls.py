from .views import TicketView,TicketTemplatesView,TicketPurchasedView, TicketPurchasedListView
from django.urls import path

urlpatterns = [
    # url for Stripe payment 
    path('purchase/', TicketView.as_view(), name='ticket_purchase'),
    
    # view all user's purchased tickets
    path('purchased_tickets/',TicketPurchasedView.as_view(), name="purchased_tickets"),
    
    # view all ticket templates 
    path('ticket_templates/', TicketTemplatesView.as_view(), name="ticket_templates"),

    # view my purchased tickets
    path('my-tickets/', TicketPurchasedListView.as_view(), name="my-tickets")

]