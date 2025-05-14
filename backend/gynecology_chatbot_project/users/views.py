# users/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """Manage users in the database"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        """Set custom permissions for each action"""
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Return objects for the current authenticated user only"""
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['GET'])
    def me(self, request):
        """Return authenticated user"""
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)