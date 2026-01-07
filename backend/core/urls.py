from django.urls import path
from .views import getUserTasks, addTaskForUser

urlpatterns = [
    path('tasks', getUserTasks, name='tasks'),
    path('addtask', addTaskForUser, name='addtask')
]