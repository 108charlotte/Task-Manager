from django.shortcuts import render
from django.http import JsonResponse
import json
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import UserInfo
from django.contrib.auth.hashers import make_password, check_password

# Create your views here.
@ensure_csrf_cookie
def verify_login(request): 
    print("Method: " + request.method)
    print("body: " + request.body)
    if request.method == "POST": 
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        user = UserInfo.objects.filter(username=username).first()
        try: 
            if check_password(password, user.hashed_password): 
                return JsonResponse({})
        except UserInfo.DoesNotExist: 
            pass
        return JsonResponse({"error": "Username and/or password incorrect"}) # no user found with username or password hashes didn't match
    return JsonResponse({"error": "Needs a post request to log user in"})

def save_register(request): 
    if request.method == "POST": 
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        # check if two passwords are equal, already checked on frontend but verifying here. If the frontend catches it, it will send a user-friendly error.
        if confirm_password == password: # bc python is nice like this
            new_user = UserInfo(username=username, hashed_password=make_password(password)).save() # save to Postgres database
            return JsonResponse({"username": username}) # this is for pulling up their tasks automatically
    return JsonResponse({"error": "Needs a post request to register new user"})