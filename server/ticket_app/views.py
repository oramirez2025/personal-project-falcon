from django.shortcuts import render
from django.conf import settings 
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.status import HTTP_303_SEE_OTHER, HTTP_200_OK,HTTP_400_BAD_REQUEST
from .serializers import *
from .models import TicketTemplate
from rest_framework.generics import CreateAPIView
from django.db.models import Sum
from rest_framework.exceptions import ValidationError
from .models import Ticket
from .validators import validate_available_quantity

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
class TicketPurchasedView(CreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    @transaction.atomic
    def perform_create(self, serializer):
        ticket_template = serializer.validated_data["ticket"]
        requested_qty = serializer.validated_data["quantity"]

        # Invariant 1: Template capacity 
        # Lock the ticket template to ensure no race condition
        locked_template = (
            TicketTemplate.objects.
            select_for_update()
            .get(pk=ticket_template.pk)
        )
        # Calculate the number of tickets sold for that type of ticket
        already_sold = (
            Ticket.objects
            .filter(ticket=locked_template)
            .aggregate(total=Sum("quantity"))["total"]
            or 0
        )
        remaining = locked_template.available_quantity - already_sold
        if requested_qty > remaining:
            raise ValidationError(
                f"Only {remaining} tickets are still available for this ticket type."
        )
        sold_counts = (
            Ticket.objects
            .values("ticket__ticket_type")
            .annotate(total=Sum("quantity"))
        )

        # Invariant 2: Global count 
        p = u = g = 0
        for row in sold_counts:
            if row["ticket__ticket_type"] == "premium":
                p = row["total"]
            elif row["ticket__ticket_type"] == "upgrade":
                u = row["total"]
            elif row["ticket__ticket_type"] == "general":
                g = row["total"]

        if locked_template.ticket_type == "premium":
            p += requested_qty
        elif locked_template.ticket_type == "upgrade":
            u += requested_qty
        elif locked_template.ticket_type == "general":
            g += requested_qty
        
        validate_available_quantity(p=p, u=u, g=g)

        serializer.save(
            userprofile=self.request.user,
            ticket=locked_template
        )

# View all ticket templates
class TicketTemplatesView(APIView):
    def get(self,request):
        ticket_templates = TicketTemplate.objects.all()
        ser_ticket_templates = TicketTemplateSerializer(ticket_templates, many=True)
        return Response(ser_ticket_templates.data, status=HTTP_200_OK)