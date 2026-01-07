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
        return getTasks(username)
    return JsonResponse({"error": "Needs a post request to retreive user's tasks"})

@csrf_exempt
def addTaskForUser(request): 
    if request.method == "POST": 
        data = json.loads(request.body)
        username = data.get("username")
        task_name = data.get("taskname")
        task_desc = data.get("taskdesc")
        # preventing duplicates
        duplicate = Task.objects.filter(username=username, name=task_name) # description can be the same, name just has to be different (this makes updateStatus possible)
        if duplicate != None: 
            return JsonResponse({}) # don't add task if a duplicate
        user_task = Task(username=username, name=task_name, description=task_desc, completed=False).save() # add the task to the user, I don't necessarily need to be saving this
        # hopefully the postgres database updates fast enough for the new task to get sent to the backend, but if this doesn't work then I know why
        return getTasks(username)
    return JsonResponse({"error": "Needs a post request to get a user's tasks"})

@csrf_exempt
def deleteTask(request): 
    # does this really need to be a post request? 
    if request.method == "POST": 
        data = json.loads(request.body)
        task_name = data.get("clickedtaskname")
        username_for_task = data.get("usernamefortask")
        delete_task_entry = Task.objects.filter(username=username_for_task, name=task_name).first() # first works because I have a precaution against adding duplicate names
        delete_task_entry.delete() # delete task entry hopefully
        return getTasks(username_for_task)
    return JsonResponse({"error": "Needs a post request to update the status of the user's tasks"})

# utility function called at the end of every function so that the frontend knows what to display, rn this isn't working for some reason? 
def getTasks(username): 
    user_tasks = list(Task.objects.filter(username=username).values("name", "description", "completed"))
    return JsonResponse(user_tasks, safe=False)