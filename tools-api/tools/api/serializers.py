from rest_framework import serializers

from tools.models import Tool


class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = [
            'id',
            'label',
            'description',
            'image_url',
            'available',
            'price',
        ]