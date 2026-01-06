from django.db import models
import uuid

# Create your models here.
class User(models.Model): 
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=100)

    def __str__(self): 
        return self.username

class Task(models.Model): # this .CASCADE may be a problem later
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=400)

    def get_name_and_description(self): 
        return {"name": self.name, "description": self.description}