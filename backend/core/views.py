from django.shortcuts import render
from .models import Task
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from django.http import JsonResponse

# Create your views here.
# so django doesn't reject request
@ensure_csrf_cookie
def getUserTasks(request): 
    if request.method == "POST": 
        data = json.loads(request.body)
        username = data.get("username")
        return getTasks(username)
    return JsonResponse({"error": "Needs a post request to retreive user's tasks"})

@ensure_csrf_cookie
def addTaskForUser(request): 
    if request.method == "POST": 
        data = json.loads(request.body)
        username = data.get("username")
        task_name = data.get("taskname")
        task_desc = data.get("taskdesc")
        # preventing duplicates
        is_duplicate = Task.objects.filter(username=username, name=task_name).exists() # description can be the same, name just has to be different (this makes updateStatus possible)
        if not is_duplicate: # if the duplicate doesn't exist
            user_task = Task(username=username, name=task_name, description=task_desc).save() # add the task to the user, I don't necessarily need to be assigning a variable to this value since it's already saved
        return getTasks(username)
    return JsonResponse({"error": "Needs a post request to get a user's tasks"})

@ensure_csrf_cookie
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
    user_tasks = list(Task.objects.filter(username=username).values("name", "description"))
    return JsonResponse(user_tasks, safe=False)