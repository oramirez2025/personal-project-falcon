from .views import Sign_Up, Info, Log_in, Log_out
from django.urls import path

urlpatterns = [
    path('new_account/', Sign_Up.as_view(), name='new_account'),
    path('info/', Info.as_view(), name='info'),
    path('login/', Log_in.as_view(), name='login'),
    path('logout/', Log_out.as_view(), name='logout')
]