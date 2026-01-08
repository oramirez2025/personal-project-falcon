from django.core.exceptions import ValidationError
from user_app.models import MyUsers


# Check if the id corresponds to an existing user in the db
def validate_id(id):
    error_msg = "The user doesn't exist in our db"
    existence_check = MyUsers.objects.filter(pk=id).exists()
    if not existence_check:
        print("HJIDJWIADWA")
        return ValidationError(error_msg, params={"id": id})
    else:
        return id