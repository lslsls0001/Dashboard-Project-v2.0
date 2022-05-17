from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('panel', index),
    path('display', index),
]