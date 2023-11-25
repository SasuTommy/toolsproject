from django.contrib import admin

from bookings.models import Booking


class BookingAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'is_verified']
    readonly_fields = (
        'id', 'created_at', 'user', 'tools', 'sum_price',
        )

admin.site.register(Booking, BookingAdmin)
