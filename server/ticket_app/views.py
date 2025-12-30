from django.shortcuts import render
from django.conf import settings 
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.status import HTTP_303_SEE_OTHER, HTTP_200_OK,HTTP_400_BAD_REQUEST
from .serializers import *
from .models import TicketTemplate

import stripe

stripe.api_key = settings.STRIPE_API_KEY

# This class represents all the requests made related to tickets.
class TicketView(APIView):
    def get(self, request):
        print('in get for ticket view')
        my_response = Response('Hello World',status=HTTP_200_OK)
        print('response created')
        print(my_response)
        return my_response

    # When someone wants to buy a Ticket, they'll need to make a post request.
    # Before they can purchase a ticket user must be authenticated. 
    # POST = CREATE
    # For now left commented out to make request without needing auth oursevles, uncomment when deployed.
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        line_items = []
        ticketQtyA = request.data.get("typeA")
        if (ticketQtyA):
            line_items.append({
                "price": "price_1Se4zBPgEHDjnAGo7JXfIGFH",
                "quantity": ticketQtyA
            })
        ticketQtyB = request.data.get("typeB")
        if (ticketQtyB):
            line_items.append({
                "price": "price_1Se53YPgEHDjnAGoOGJoeJhm",
                "quantity": ticketQtyB
        
            })
        ticketQtyC = request.data.get("typeC")
        if (ticketQtyC):
            line_items.append({
                "price": "price_1Se54ZPgEHDjnAGolleqQKtM",
                "quantity": ticketQtyC
        
            })
        # NOTE: Switch PRICE IDS
        checkout_session = stripe.checkout.Session.create(
            line_items=line_items,

            # The available ways to pay:
            payment_method_types=['card'],
            # mode is the type of payment (one, sub, etc.)
            mode = 'payment',
            # usually, when it's a one-time payment, you want to create a customer for that payment
            customer_creation='always',
            # for the success_url, when the purchase goes through, this is where the user is redirected
            success_url="http://localhost:5173/", # should redirect to page showing their ticke they purchased
            cancel_url="http://localhost:5173/" # should redirect to page to buy tickets 
        )
        return Response(checkout_session.url, status=HTTP_200_OK)

# View user's purchased tickets
class TicketsPurchasedView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        userprofile = request.user.userprofile
        purchased_tickets = userprofile.ticket_purchases.all()
        ser_purchased_tickets = TicketSerializer(purchased_tickets,many=True)
        return Response(ser_purchased_tickets.data, status=HTTP_200_OK)

# View all ticket templates
class TicketTemplatesView(APIView):
    def get(self,request):
        ticket_templates = TicketTemplate.objects.all()
        ser_ticket_templates = TicketTemplateSerializer(ticket_templates, many=True)
        return Response(ser_ticket_templates.data, status=HTTP_200_OK)