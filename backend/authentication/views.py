from django.shortcuts import render
from django.http import JsonResponse
import json
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

# Create your views here.
@ensure_csrf_cookie
def verify_login(request): 
    if request.method == "POST": 
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None: 
            login(request, user)
            return JsonResponse({"error": "None, login successful"})
        return JsonResponse({"error": "Username and/or password incorrect"})
    return JsonResponse({"error": "Needs a post request to log user in"})

@ensure_csrf_cookie
def save_register(request): 
    if request.method == "POST": 
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        # check if two passwords are equal, already checked on frontend but verifying here. If the frontend catches it, it will send a user-friendly error.
        if confirm_password == password: # bc python is nice like this
            # check that there isn't an existing user with this username
            are_other_users_with_username = User.objects.filter(username=username).exists()
            if are_other_users_with_username: 
                return JsonResponse({"error": "A user has already registered with this username. Please choose another, or if you think this is you, head over to the login page"})
            new_user = User.objects.create_user(username=username, password=password)
            login(request, new_user)
            return JsonResponse({"error": "None, user creation successful"}) # this is for pulling up their tasks automatically
        return JsonResponse({"error": "Passwords don't match!"})
    return JsonResponse({"error": "Needs a post request to register new user"})

@ensure_csrf_cookie
def logout_user(request): 
    if request.method == "POST": 
        logout(request)
        return JsonResponse({"error": "None, logged out successfully"})
    return JsonResponse({"error": "Needs a post request to log out current user"})