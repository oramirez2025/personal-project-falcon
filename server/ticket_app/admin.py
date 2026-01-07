from django.contrib import admin
from .models import Ticket, TicketTemplate
# Register your models here.
admin.site.register(Ticket)
admin.site.register(TicketTemplate)