from rest_framework import serializers

from bookings.models import Booking
from tools.api.serializers import ToolSerializer


class BookingSerializer(serializers.ModelSerializer):
    tools = ToolSerializer(many=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'created_at',
            'is_verified',
            'tools',
            'sum_price',
            'date_start',
            'date_end',
        ]


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'tools',
            'user',
            'date_start',
            'date_end',
        ]

class BookingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'date_end'
        ]
