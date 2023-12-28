from django.urls import path

from bookings.api.views import BookingListAPIView, UpdateBookingAPIView, RaportAPIView


urlpatterns = [
    path('list', BookingListAPIView.as_view()),
    path('list/<str:id>', UpdateBookingAPIView.as_view()),
    path('raport/', RaportAPIView.as_view()),
]
