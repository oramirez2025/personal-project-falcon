from django.urls import path
from .views import (
    Sign_Up,
    Info,
    Log_in,
    Log_out,
    UserAccountView,
    AdminPromotionView,
    UserTicketsView,
)

urlpatterns = [
    # Authentication endpoints
    path('new_account/', Sign_Up.as_view(), name='new_account'),
    path('login/', Log_in.as_view(), name='login'),
    path('logout/', Log_out.as_view(), name='logout'),
    path('info/', Info.as_view(), name='info'),
    
    # User account/profile endpoint (single source for React)
    path('account/', UserAccountView.as_view(), name='user_account'),

    # User tickets endpoint
    path('tickets/', UserTicketsView.as_view(), name='user_tickets'),

    # Admin management endpoint
    path('admin-stat/', AdminPromotionView.as_view(), name='admin_access'),
]