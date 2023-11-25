from rest_framework import serializers
from django.db import transaction

from users.services import UserActivationCreator, UserAcivator
from users.models.user import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']

    @transaction.atomic
    def create(self, validated_data):
        return UserActivationCreator(validated_data=validated_data)()

    def validate(self, data):
        super().validate(data)
        self.create(data)
        return data

class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']

class ActivateAccountSerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField()

    def activate(self, validated_data):
        token = validated_data.get('token')
        email = validated_data.get('email')

        return UserAcivator(token, email)()

    def validate(self, attrs):
        validated_data = super().validate(attrs)
        self.activate(validated_data)
        return validated_data