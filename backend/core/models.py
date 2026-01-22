from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Task(models.Model): 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=400, null=True, blank=True)

    # for django admin display
    def __str__(self): 
        return self.user.username + ": " + self.name