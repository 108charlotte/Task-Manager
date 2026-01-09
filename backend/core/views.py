from django.shortcuts import render
from .models import Task
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from django.http import JsonResponse
from django.contrib.auth.models import User

# Create your views here.
# so django doesn't reject request
@ensure_csrf_cookie
def getUserTasks(request): 
    if request.method == "POST": 
        data = json.loads(request.body)
        username = data.get("username")
        user = User.objects.filter(username=username).first()
        if not user: 
            return JsonResponse({"error": "User " + username + " could not be found"})
        return getTasks(user)
    return JsonResponse({"error": "Needs a post request to retreive user's tasks"})

@ensure_csrf_cookie
def addTaskForUser(request): 
    if request.method == "POST": 
        data = json.loads(request.body)
        username = data.get("username")
        task_name = data.get("taskname")
        task_desc = data.get("taskdesc")
        # check permissions (double-check since frontend won't display this functionality anyways)
        user = User.objects.filter(username=username).first()
        current_user = request.user
        if user != current_user: 
            return JsonResponse({"error": "You do not have permission to add tasks for other users"})
        # preventing duplicate tasks for the same user
        is_duplicate = Task.objects.filter(user=user, name=task_name).exists() # description can be the same, name just has to be different (this makes updateStatus possible)
        if is_duplicate: 
            return JsonResponse({"error": "A task with this name already exists for this user"})
        user_task = Task(user=user, name=task_name, description=task_desc).save() # add the task to the user, I don't necessarily need to be assigning a variable to this value since it's already saved
        return JsonResponse({"error": "None, successfully added task"})
    return JsonResponse({"error": "Needs a post request to get a user's tasks"})

@ensure_csrf_cookie
def deleteTask(request): 
    # does this really need to be a post request? 
    if request.method == "POST": 
        data = json.loads(request.body)
        task_name = data.get("clickedtaskname")
        username_for_task = data.get("usernamefortask")
        # not necessarily the current user, but for the task to exist the user must exist since each new task is assigned a user
        user = User.objects.filter(username=username_for_task).first() # will work since I restricted new user sign ups to only accept one user per username
        current_user = request.user
        if user != current_user: 
            return JsonResponse({"error": "You cannot delete another user's tasks"})
        delete_task_entry = Task.objects.filter(user=user, name=task_name).first() # first works because I have a precaution against adding duplicate names
        if not delete_task_entry: 
            return JsonResponse({"error": "Task attempted to be deleted does not exist"})
        delete_task_entry.delete() # delete task entry hopefully
        return JsonResponse({"error": "None, successfully deleted task"})
    return JsonResponse({"error": "Needs a post request to update the status of the user's tasks"})

# utility function called at the end of every function so that the frontend knows what to display, rn this isn't working for some reason? 
def getTasks(user): 
    user_tasks = list(Task.objects.filter(user=user).values("name", "description"))
    return JsonResponse(user_tasks, safe=False)