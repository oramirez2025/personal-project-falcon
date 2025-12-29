from rest_framework.views import APIView
from .services import fetchWeather
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK

class WeatherView(APIView):
    def get(self, request):
        currTemp, feelsLikeTemp, maxTemp, minTemp = fetchWeather()
        return Response({"currTemp": currTemp, "feelsLikeTemp": feelsLikeTemp, "maxTemp": maxTemp, "minTemp": minTemp }, status=HTTP_200_OK)