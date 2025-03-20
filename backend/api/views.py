from rest_framework import viewsets
from .models import User
from .serializers import (
    UserSerializer
)

from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsRoleAdmin, IsRoleUser, IsRoleAdminOrUser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'list']:
            permission_classes = [IsRoleAdmin]
        elif self.action in ['retrieve']:
            permission_classes = [IsRoleAdminOrUser]
        else:
            permission_classes = [IsRoleAdmin]  # fallback
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        print(request)
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)