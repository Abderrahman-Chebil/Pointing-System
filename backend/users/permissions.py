from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Allows access only to Admins.
    """

    def has_permission(self, request, view):
        return bool(request.user.role == 'admin')

class IsEmployee(BasePermission):
    """
    Allows access only to Employees.
    """

    def has_permission(self, request, view):
        return bool(request.user.role == 'employee')
    
class IsManager(BasePermission):
    """
    Allows access only to Managers.
    """

    def has_permission(self, request, view):
        return bool(request.user.is_manager)

class IsChief(BasePermission):
    """
    Allows access only to Chiefs.
    """

    def has_permission(self, request, view):
        return bool(request.user.is_chief)

class IsManagerOrChief(BasePermission):
    """
    Allows access only to Managers or Chiefs.
    """

    def has_permission(self, request, view):
        return bool(request.user.is_manager or request.user.is_chief)