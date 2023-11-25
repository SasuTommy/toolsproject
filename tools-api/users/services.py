from rest_framework import serializers

from users.models.user import User
from users.models.activate_tokens import UserActivateToken
from django.core.mail import send_mail
from django.conf import settings


class UserActivationCreator:
    def __init__(self, validated_data: dict = None, user: User = None) -> None:
        self.validated_data = validated_data
        self.user = user

    def __call__(self) -> User:
        self.resulting_user = self.user or self.create()
        self.after_creation()

        return self.resulting_user
    
    def create(self) -> User:
        return User.objects.create_user(
            email=self.validated_data.get('email'),
            password=self.validated_data.get('password'),
            first_name=self.validated_data.get('first_name'),
            last_name=self.validated_data.get('last_name'),
            is_active=False,
        )
    
    def after_creation(self) -> None:
        user_token = UserActivateToken().create_token(self.resulting_user)
        if user_token:
            send_mail(
                subject='Potwierdzenie rejestracji',
                message=f'Dziękujemy za rejestrację! To jest ostatni krok\n twój kod potwierdzający to: {user_token.token}\n Wprowadź go na stronie',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[f'{self.resulting_user.email}']
            )

class UserAcivator:
    def __init__(self, token: str, email: str) -> None:
        self.data = {"token": token, "email": email}

    def __call__(self) -> User:
        self.activate()
        return self.get()

    def get(self) -> User:
        return User.objects.filter(email=self.data["email"]).first()

    def activate(self):
        try:
            user_activation_token = UserActivateToken.objects.get(
                token=self.data["token"],
                user__email=self.data["email"],
            )
        except (TypeError, ValueError, OverflowError, UserActivateToken.DoesNotExist):
            raise serializers.ValidationError({"token":"Invalid Token"})
        
        if user_activation_token and user_activation_token.user:
            user_activation_token.user.is_active = True
            user_activation_token.user.save()
            user_activation_token.is_used = True
            user_activation_token.save()
        