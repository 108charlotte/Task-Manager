from django.urls import path
from .views import verify_login, save_register, logout_user

urlpatterns = [
    path('login', verify_login, name='login'),
    path('register', save_register, name='register'), 
    path('logout', logout_user, name='logout')
]