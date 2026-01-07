from django.contrib import admin
from .models import UserProfile, MyUsers
# Register your models here.
admin.site.register(UserProfile)
admin.site.register(MyUsers)