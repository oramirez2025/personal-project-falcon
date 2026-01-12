from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from .serializers import TicketTemplateSerializer
from .models import TicketTemplate
from rest_framework import status as s


# View all ticket templates 
class TicketTemplatesView(APIView):
    def get(self,request):
        ticket_templates = TicketTemplate.objects.all()
        ser_ticket_templates = TicketTemplateSerializer(ticket_templates, many=True)
        return Response(ser_ticket_templates.data, status=HTTP_200_OK)

