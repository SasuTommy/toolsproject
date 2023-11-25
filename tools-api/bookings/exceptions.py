from rest_framework import status
from rest_framework.exceptions import APIException

class NoAvailableTools(APIException):
    status_code = status.HTTP_417_EXPECTATION_FAILED
    default_detail = 'No available tools left'