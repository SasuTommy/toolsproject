from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from tools.models import Tool
from tools.api.serializers import ToolSerializer


class ToolsListAPIView(ListAPIView):
    permission_classes = (AllowAny,)
    http_method_names = ['get']
    serializer_class = ToolSerializer
    queryset = Tool.objects.all()
    