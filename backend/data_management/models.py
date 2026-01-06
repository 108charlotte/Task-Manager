from django.db import models

# Create your models here.
# this is very simplified since typically I would have a separate user model
class Task(models.Model): 
    username = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=400)