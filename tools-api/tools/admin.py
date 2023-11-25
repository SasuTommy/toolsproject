from django.contrib import admin

from tools.models import Tool


class ToolAdmin(admin.ModelAdmin):
    list_display = [
        'label',
        'description',
        'image_url',
        'in_stock',
        'price',
    ]
    readonly_fields = ('available',)

admin.site.register(Tool, ToolAdmin)
