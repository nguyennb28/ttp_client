from rest_framework import viewsets
from .models import User, Port, ContainerSize, VAT_INFO
from .serializers import (
    UserSerializer,
    PortSerializer,
    ContainerSizeSerializer,
    VatInfoSerializer,
)

from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsRoleAdmin, IsRoleUser, IsRoleAdminOrUserOrEmployee
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy", "list"]:
            permission_classes = [IsRoleAdmin]
        elif self.action in ["retrieve", "me"]:
            permission_classes = [IsRoleAdminOrUserOrEmployee]
        else:
            permission_classes = [IsRoleAdmin]  # fallback
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        print(request)
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PortViewSet(viewsets.ModelViewSet):
    queryset = Port.objects.all().order_by("country")
    serializer_class = PortSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsRoleAdmin]
        return [permission() for permission in permission_classes]


class ContainerSizeViewSet(viewsets.ModelViewSet):
    queryset = ContainerSize.objects.all().order_by("id")
    serializer_class = ContainerSizeSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsRoleAdmin]
        return [permission() for permission in permission_classes]


class VatInfoViewSet(viewsets.ModelViewSet):
    queryset = VAT_INFO.objects.all().order_by("id")
    serializer_class = VatInfoSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsRoleAdmin]
        return [permission() for permission in permission_classes]
