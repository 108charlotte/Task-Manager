from django.shortcuts import render
from .models import Task
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse

# Create your views here.
# so django doesn't reject request
@csrf_exempt
def getUserTasks(request): 
    if request.method == "POST": 
        data = json.loads(request.body)
        username = data.get("username")
        user_tasks = list(Task.objects.filter(username=username).values("name", "description"))
        return JsonResponse(user_tasks, safe=False)
    return JsonResponse({"error": "Needs a post request to retreive user's tasks"})

@csrf_exempt
def addTaskForUser(request): 
    if request.method == "POST": 
        data = json.loads(request.body)
        username = data.get("username")
        task_name = data.get("taskname")
        task_desc = data.get("taskdesc")
        user_task = Task(username=username, name=task_name, description=task_desc).save()
        # hopefully the postgres database updates fast enough for the new task to get sent to the backend, but if this doesn't work then I know why
        user_tasks = list(Task.objects.filter(username=username).values("name", "description"))
        return JsonResponse(user_tasks, safe=False)
    return JsonResponse({"error": "Needs a post request to get a user's tasks"})