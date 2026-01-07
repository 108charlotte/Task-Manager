from django.urls import path
from .views import getUserTasks, addTaskForUser, deleteTask

urlpatterns = [
    path('tasks', getUserTasks, name='tasks'),
    path('addtask', addTaskForUser, name='addtask'), 
    path('deletetask', deleteTask, name='deletetask')
]