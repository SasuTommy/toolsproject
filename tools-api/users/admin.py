from django.contrib import admin

from users.models.user import User
from users.models.activate_tokens import UserActivateToken


admin.site.register(User)
admin.site.register(UserActivateToken)