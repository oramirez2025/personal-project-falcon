from django.shortcuts import render
from .models import MyUsers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate


from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_204_NO_CONTENT,
    HTTP_200_OK
)

# 

class Sign_Up(APIView):
    def post(self, request):
        request.data["username"] = request.data["email"]
        users = MyUsers.objects.create_user(**request.data)
        token = Token.objects.create(user=users)
        users.save()
        return Response (
            {'user': users.email, 'token':token.key}, status=HTTP_201_CREATED
        )

class Log_in(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get('password')
        users = authenticate(username=email, password=password)
        if users:
            # don't need second output from get_or_create
            token, _ = Token.objects.get_or_create(user=users)
            print("did we make it here?")
            return Response({"token": token.key, "users": users.email})
        else:
            return Response("No user matching credentials", status=HTTP_404_NOT_FOUND)
        
class Log_out(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        user = request.user
        user_data = {
        "email": user.email,
        "id": user.id,
        "username": getattr(user, "username", None),
    }
        request.user.auth_token.delete()
        return Response({"message": "Logged out successfully", "user": user_data})
    

class Info(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"email": request.user.email}, status=HTTP_200_OK)
    
class Master_Sign_Up(APIView):

        def post(self, request):
            master_users = MyUsers.objects.create_user(**request.data)
            master_users.is_staff = True
            master_users.is_superuser = True
            master_users.save()
            token = Token.objects.create(user=MyUsers)
            return Response(
                {"master_Users": master_users.email, "token": token.key}, status=HTTP_201_CREATED
            )