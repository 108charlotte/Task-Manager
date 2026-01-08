from django.urls import path
from .views import verify_login, save_register

urlpatterns = [
    path('login', verify_login, name='login'),
    path('register', save_register, name='register'), 
]