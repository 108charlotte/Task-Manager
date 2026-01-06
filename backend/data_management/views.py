from django.shortcuts import render
from .models import User, Task
from django.contrib import admin
import requests

SUCCESS = 0
currentUserId = 0 # for testing

# Create your views here.
admin.site.register(User)
admin.site.register(Task)

def getUserTasks(request): 
    # how do I extract a user_id from request? or can i get the current user? 
    sampleUser = User(username="TestUser")
    userTasks = Task.objects.filter(id=currentUserId)
    requests.post("http://127.0.0.1:3000", json={"user": sampleUser, "tasks": userTasks})
    return SUCCESS # indicates data successfully sent to frontend