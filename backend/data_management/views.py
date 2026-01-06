from django.shortcuts import redirect
from .models import Task
from django.views.decorators.csrf import csrf_exempt
from django.contrib import admin
import json
from django.http import JsonResponse


# Create your views here.
admin.site.register(Task)

# so django doesn't reject request
@csrf_exempt
def getUserTasks(request): 
    print("received request")
    if request.method == "POST": 
        print("received POST request")
        data = json.loads(request.body)
        username = data.get("username")
        print("Username: " + username)
        user_tasks = list(Task.objects.filter(username=username).values("name", "description"))
        print(user_tasks)
        return JsonResponse(user_tasks, safe=False)
    return JsonResponse({"error": "Needs a post request"})