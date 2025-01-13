from rest_framework.permissions import BasePermission

class IsBusinessUser(BasePermission):
    """
    Allows access only to users with the role of 'business'.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'business'
