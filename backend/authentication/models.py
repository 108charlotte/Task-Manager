from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserInfo(models.Model): 
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=100)
    hashed_password = models.CharField(max_length=200)