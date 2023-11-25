from django.urls import path

from tools.api.views import ToolsListAPIView

urlpatterns = [
    path('list', ToolsListAPIView.as_view())
]