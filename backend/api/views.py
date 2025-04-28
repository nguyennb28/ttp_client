from .models import User, Port, ContainerSize, VAT_INFO, Agency, CFS
from .serializers import (
    UserSerializer,
    PortSerializer,
    ContainerSizeSerializer,
    VatInfoSerializer,
    AgencySerializer,
    CFSSerizalier,
    CustomLoginSerializer,
)

from django.db.models import Q
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import (
    IsRoleAdmin,
    IsRoleUser,
    IsRoleAdminOrUserOrEmployee,
    IsRoleEmployee,
    IsRoleAdminOrEmployee,
)
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView


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

    # search or filter (api/ports?q=...)
    # search all filter in Port
    def get_queryset(self):
        queryset = Port.objects.all().order_by("country")
        param = self.request.query_params.get("q")
        if param:
            queryset = queryset.filter(
                Q(country__icontains=param)
                | Q(name__icontains=param)
                | Q(code__icontains=param)
            )
        return queryset


class ContainerSizeViewSet(viewsets.ModelViewSet):
    queryset = ContainerSize.objects.all().order_by("id")
    serializer_class = ContainerSizeSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsRoleAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = ContainerSize.objects.all().order_by("id")
        param = self.request.query_params.get("q")
        if param:
            queryset = queryset.filter(
                Q(name__icontains=param)
                | Q(size__icontains=param)
                | Q(abbreviation__icontains=param)
            )
        return queryset


class VatInfoViewSet(viewsets.ModelViewSet):
    queryset = VAT_INFO.objects.all().order_by("id")
    serializer_class = VatInfoSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsRoleAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = VAT_INFO.objects.all().order_by("id")
        param = self.request.query_params.get("q")
        if param:
            queryset = queryset.filter(
                Q(company_name__icontains=param)
                | Q(address__icontains=param)
                | Q(company_tax_code__icontains=param)
                | Q(ward_or_commune__icontains=param)
                | Q(district__icontains=param)
                | Q(province_or_city__icontains=param)
                | Q(country__icontains=param)
                | Q(einvoice_contact_name__icontains=param)
                | Q(einvoice_contact_email__icontains=param)
            )
        return queryset


class AgencyViewSet(viewsets.ModelViewSet):
    queryset = Agency.objects.all().order_by("id")
    serializer_class = AgencySerializer
    permission_classes = [IsRoleAdminOrEmployee]

    def get_queryset(self):
        queryset = Agency.objects.all().order_by("id")
        param = self.request.query_params.get("q")
        if param:
            queryset = queryset.filter(
                Q(name__icontains=param)
                | Q(address__icontains=param)
                | Q(phone__icontains=param)
                | Q(abbreviation__icontains=param)
            )
        return queryset


class CFSViewSet(viewsets.ModelViewSet):
    queryset = CFS.objects.all().order_by("-id")
    serializer_class = CFSSerizalier
    permission_classes = [IsRoleAdminOrEmployee]

    def get_queryset(self):
        queryset = CFS.objects.all().order_by("-id")
        param = self.request.query_params.get("q")
        if param:
            queryset = queryset.filter(
                Q(ship_name__icontains=param)
                | Q(mbl__icontains=param)
                | Q(container_number__icontains=param)
                | Q(cbm__icontains=param)
                | Q(eta__icontains=param)
                | Q(actual_date__icontains=param)
                | Q(note__icontains=param)
                | Q(delivery_order_fee__icontains=param)
                | Q(cleaning__icontains=param)
                | Q(agency__name__icontains=param)
                | Q(container_size__name__icontains=param)
                | Q(port__name__icontains=param)
                | Q(created_at__icontains=param)
                | Q(updated_at__icontains=param)
                | Q(end_date__icontains=param)
            )
        start_date = self.request.query_params.get("startDate", None)
        end_date = self.request.query_params.get("endDate", None)
        date_field_to_filter = "eta"

        if start_date:
            start_date_lookup = f"{date_field_to_filter}__gte"
            queryset = queryset.filter(**{start_date_lookup: start_date})

        if end_date:
            end_date_lookup = f"{date_field_to_filter}__lte"
            queryset = queryset.filter(**{end_date_lookup: end_date})

        return queryset

    @action(detail=False, methods=["post"])
    def delete_multiple(self, request):
        ids_to_delete = request.data.get("ids", [])
        if not ids_to_delete or not isinstance(ids_to_delete, list):
            return Response(
                {"error": "Please provide a list of IDs to delete."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            cfs_to_delete = CFS.objects.filter(id__in=ids_to_delete)

            delete_count, _ = cfs_to_delete.delete()
            return Response(
                {
                    "message": f"Successfully deleted {delete_count} records",
                    "data": {"records": delete_count},
                },
                status=(
                    status.HTTP_204_NO_CONTENT
                    if delete_count > 0
                    else status.HTTP_400_BAD_REQUEST
                ),
            )
        except Exception as e:
            return Response(
                {"error": f"Error deleting books: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomLoginSerializer
