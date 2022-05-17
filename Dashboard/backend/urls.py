from django.urls import path
from .views import RoomView
from .views import MenuListSelection
from .views import getLotId_handleRequest
from .views import DataTypeSelection
from .views import DataTypeOperationMenuList
from .views import ParametersSummaryForJson

urlpatterns = [
    path('home', RoomView.as_view()),
    path('menulist', MenuListSelection),
    path('getLotId', getLotId_handleRequest),
    path('datatype',DataTypeSelection),
    path('datatype/OperationMenuList',DataTypeOperationMenuList),
    path('parametersSummary', ParametersSummaryForJson),
]