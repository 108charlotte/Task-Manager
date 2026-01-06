from django.urls import path
from .views import getUserTasks

urlpatterns = [
    path('tasks', getUserTasks, name='tasks'),
]