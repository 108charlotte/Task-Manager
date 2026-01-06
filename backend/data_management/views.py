from django.shortcuts import redirect
from .models import Task
from django.contrib import admin
import requests

# Create your views here.
admin.site.register(Task)

def getUserTasks(request): 
    username = request.get('username')
    userTasks = Task.objects.filter(username=username)
    requests.post("http://127.0.0.1:3000", json={"tasks": userTasks})
    return redirect("http://localhost:5173")