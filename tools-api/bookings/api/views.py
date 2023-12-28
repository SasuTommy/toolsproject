from rest_framework.generics import ListCreateAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import NotAuthenticated
from rest_framework.mixins import UpdateModelMixin, DestroyModelMixin
from rest_framework import status
from rest_framework.response import Response

from bookings.models import Booking
from tools.models import Tool
from bookings.api.serializers import BookingSerializer, BookingCreateSerializer, BookingUpdateSerializer
from bookings.exceptions import NoAvailableTools


class BookingListAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get', 'post']

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookingCreateSerializer
        else:
            return BookingSerializer

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.data['user'] = request.user.pk
            selected_tools = Tool.objects.filter(pk__in=request.data['tools'])
            for tool in selected_tools:
                if tool.available <= 0:
                    raise NoAvailableTools(
                        detail=f'No available tools left for ID: {tool.id}')
            return super().create(request, *args, **kwargs)
        else:
            raise NotAuthenticated()


class UpdateBookingAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    http_method_names = ['put', 'delete']

    serializer_class = BookingUpdateSerializer

    def delete(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            user = request.user.pk
            id = kwargs['id']

            Booking.objects.filter(user=user, id=id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            user = request.user.pk
            id = kwargs['id']
            date_end = request.data['date_end']

            Booking.objects.filter(user=user, id=id).update(date_end=date_end)

            return Response(status=status.HTTP_202_ACCEPTED)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
class RaportAPIView(ListCreateAPIView):
    http_method_names = ['get']
    permission_classes = (IsAuthenticated, IsAdminUser)

    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.all()


        
