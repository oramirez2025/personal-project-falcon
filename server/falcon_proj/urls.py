from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("ticket/", include("ticket_app.urls")),
    path("payments/", include("payments_app.urls")),
    # corrected pathing to user
    path("user/", include("user_app.urls")),
    path("weather/", include("weather_app.urls")),
    path("event/", include("event_app.urls")),
    path("comment/", include("comment_app.urls"))
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

"""
NEXT TO DO LIST, FRONT END:
install axios
X user sign up form (react), not going to do anything yet 
X when user puts info in form and puts sign up, fire useEffect to make API call.
X The API call will use Axios to call signup end point, signup/new_account of my django API.
When my react app gets the HTTP response, it grabs the auth token and saves it in react app.
Then we redirect user who is now logged in to the logged in user homepage.
"""
