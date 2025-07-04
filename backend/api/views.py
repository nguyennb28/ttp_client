from .models import (
    User,
    Port,
    ContainerSize,
    VAT_INFO,
    Agency,
    CFS,
    Door,
    DoorFeeDetail,
    DoorDeliveryFee,
)
from .serializers import (
    UserSerializer,
    PortSerializer,
    ContainerSizeSerializer,
    VatInfoSerializer,
    AgencySerializer,
    CFSSerizalier,
    CustomLoginSerializer,
    DoorFeeDetailSerializer,
    DoorDeliveryFeeSerializer,
    DoorSerializer,
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
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
import psycopg2
from psycopg2.errors import DuplicateDatabase
from psycopg2 import sql
from django.conf import settings
from django.db import connection
from contextlib import contextmanager
from .color import AnsiColors
import re
import logging
from rest_framework.parsers import MultiPartParser
import xml.etree.ElementTree as ET


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

    def get_queryset(self):
        queryset = User.objects.all()
        param = self.request.query_params.get("q")
        if param:
            queryset = queryset.filter(
                Q(username__icontains=param)
                | Q(full_name__icontains=param)
                | Q(phone__icontains=param)
                | Q(role__icontains=param)
                | Q(tenant_db__icontains=param)
            )
        return queryset

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        print(request)
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], permission_classes=[IsRoleAdmin])
    def get_tenant_db(self, request):
        qs = User.objects.all().exclude(tenant_db__isnull=True)

        param = request.query_params.get("q")
        if param:
            qs = qs.filter(tenant_db__icontains=param)
        list_db = qs.values("tenant_db").distinct("tenant_db")

        result = [
            {"id": item["tenant_db"], "name": item["tenant_db"]} for item in list_db
        ]
        return Response({"results": result}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], permission_classes=[IsRoleAdmin])
    def bulk_delete(self, request):
        ids = request.data.get("ids")
        if not ids:
            return Response({"msg": "Ids is empty"}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(ids, list):
            return Response(
                {"msg": "Ids list is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        existing_objs = User.objects.filter(id__in=ids)
        # filter ids is exist
        existing_ids = set(existing_objs.values_list("id", flat=True))
        # not found ids
        not_found_ids = [i for i in ids if i not in existing_ids]

        # delete
        deleted_count, _ = existing_objs.delete()
        return Response(
            {
                "deleted_count": existing_ids,
                "not_found_ids": not_found_ids,
                "msg": f"Delete {deleted_count} records. {len(not_found_ids)} ids not found.",
            },
            status=status.HTTP_200_OK,
        )


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


@contextmanager
def get_postgres_connection(dbname="postgres", autocommit=True):
    conn = None
    try:
        print(f"Connecting: {dbname}")
        conn = psycopg2.connect(
            dbname=dbname,
            user=settings.DATABASES["default"]["USER"],
            password=settings.DATABASES["default"]["PASSWORD"],
            host=settings.DATABASES["default"]["HOST"],
            port=settings.DATABASES["default"]["PORT"] or "5432",
        )
        conn.autocommit = autocommit
        # print("Connect successfully")
        yield conn
    except psycopg2.Error as e:
        print(f"Connect failed: {e}")
        raise
    except Exception as e:
        print(f"Exception: {e}")
        raise
    finally:
        if conn:
            print("Close connection")
            conn.close()


class DatabaseViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            search_db_name = request.query_params.get("q")
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT datname FROM pg_database WHERE datistemplate = false AND datname NOT IN ('postgres', 'template0', 'template1')"
                )
                databases = [row[0] for row in cursor.fetchall()]
                if search_db_name:
                    databases = [
                        name
                        for name in databases
                        if search_db_name.lower() in name.lower()
                    ]
                results = [
                    {"id": idx + 1, "database_name": name}
                    for idx, name in enumerate(databases)
                ]
            return Response(
                {
                    "count": len(results),
                    "previous": None,
                    "next": None,
                    "results": results,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # Make different response for search tenant database
    @action(detail=False, methods=["get"], permission_classes=[IsRoleAdmin])
    def get_tenant_db(self, request):
        try:
            search_db_name = request.query_params.get("q")
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT datname FROM pg_database WHERE datistemplate = false AND datname NOT IN ('postgres', 'template0', 'template1')"
                )
                databases = [row[0] for row in cursor.fetchall()]
                if search_db_name:
                    databases = [
                        name
                        for name in databases
                        if search_db_name.lower() in name.lower()
                    ]
                    print(databases)
                results = [
                    {"id": name, "name": name} for idx, name in enumerate(databases)
                ]
            return Response(
                {
                    "results": results,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request):
        db_name = request.data.get("db_name")
        if not db_name:
            return Response(
                {"error": "You must provide a database name"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            with get_postgres_connection(autocommit=True) as conn:
                cursor = conn.cursor()
                safe_db_name = sql.Identifier(db_name)
                create_cmd = sql.SQL("CREATE DATABASE {}").format(safe_db_name)

                # Execution
                cursor.execute(create_cmd)
            return Response(
                {"results": f"Create {db_name} successfully"},
                status=status.HTTP_201_CREATED,
            )
        except DuplicateDatabase:
            print(f"{AnsiColors.FAIL_RED}{AnsiColors.BOLD} Error: Duplicate {db_name}")
            return Response(
                {"error": f"{db_name} existed, try again ?"},
                status=status.HTTP_409_CONFLICT,
            )
        except psycopg2.Error as e:
            print(f"{AnsiColors.FAIL_RED}{AnsiColors.BOLD}Error psycopg2 : {str(e)}")
            return Response(
                {"error": f"{str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            print(f"{AnsiColors.FAIL_RED}{AnsiColors.BOLD}Exception error: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # drop database
    # def drop_database(self, db_name):
    #     with get_postgres_connection(autocommit=True) as conn:
    #         cursor = conn.cursor()
    #         try:
    #             cursor.execute(f'DROP DATABASE IF EXISTS "{db_name}"')
    #         finally:
    #             cursor.close()
    def drop_database(self, db_name):
        if not re.match(r"^[a-zA-Z0-9_]+$", db_name):
            raise ValueError(f"Database name is not valid: {db_name}")
        try:
            with get_postgres_connection(autocommit=True) as conn:
                with conn.cursor() as cursor:
                    cursor.execute(f'DROP DATABASE IF EXISTS "{db_name}"')
                    logging.info(f"Database deleted: {db_name}")
        except Exception as e:
            logging.error(f"Error when deleting database {db_name}: {e}")
            raise

    @action(detail=False, methods=["post"], permission_classes=[IsRoleAdmin])
    def bulk_delete(self, request):
        db_names = request.data.get("db_names")
        if not db_names or not isinstance(db_names, list):
            return Response(
                {"error": "db_names is not list"}, status=status.HTTP_400_BAD_REQUEST
            )

        forbidden_names = {
            "postgres",
            "template0",
            "template1",
            settings.DATABASES["default"]["NAME"],
        }
        print(f"Forbidden names: {forbidden_names}")

        results = {}
        for db_name in db_names:
            if not re.match(r"^[a-zA-Z0-9_]+$", db_name):
                results[db_name] = "Database name invalid"
                continue
            if db_name in forbidden_names:
                results[db_name] = "Can't delete"
                continue
            try:
                self.drop_database(db_name)
                results[db_name] = "Deleted"
            except Exception as e:
                results[db_name] = f"Error: {str(e)}"

        return Response({"results": results}, status=status.HTTP_207_MULTI_STATUS)


class DoorViewSet(viewsets.ModelViewSet):
    queryset = Door.objects.all().order_by("-created_at")
    serializer_class = DoorSerializer
    permission_classes = [IsRoleAdminOrEmployee]

    def get_queryset(self):
        queryset = Door.objects.all().order_by("-created_at")
        param = self.request.query_params.get("q")
        if param:
            queryset = queryset.filter(
                Q(spc__icontains=param)
                | Q(settlement_date__icontains=param)
                | Q(company_name__icontains=param)
                | Q(employee_name__icontains=param)
                | Q(product_name__icontains=param)
                | Q(declaration__icontains=param)
                | Q(bln__icontains=param)
                | Q(product_detail__icontains=param)
                | Q(agent__icontains=param)
            )
        start_date = self.request.query_params.get("startDate", None)
        end_date = self.request.query_params.get("endDate", None)
        date_field_to_filter = "settlement_date"

        if start_date:
            start_date_lookup = f"{date_field_to_filter}__gte"
            queryset = queryset.filter(**{start_date_lookup: start_date})

        if end_date:
            end_date_lookup = f"{date_field_to_filter}__lte"
            queryset = queryset.filter(**{end_date_lookup: end_date})

        return queryset

    """
        Delete multiple
    """
    # @action(detail=false)


class DoorFeeDetailViewSet(viewsets.ModelViewSet):
    queryset = DoorFeeDetail.objects.all().order_by("-created_at")
    serializer_class = DoorFeeDetailSerializer
    permission_classes = [IsRoleAdmin]

    def get_queryset(self):
        queryset = DoorFeeDetail.objects.all().order_by("-created_at")
        param = self.request.query_params.get("q")

        if param:
            queryset = queryset.filter(
                Q(cost_name__icontains=param)
                | Q(contract_fee__icontains=param)
                | Q(non_contract_fee__icontains=param)
                | Q(contract_number__icontains=param)
                | Q(note__icontains=param)
            )

        return queryset


class DoorDeliveryFeeViewSet(viewsets.ModelViewSet):
    queryset = DoorDeliveryFee.objects.all().order_by("-created_at")
    serializer_class = DoorDeliveryFeeSerializer
    permission_classes = [IsRoleAdminOrEmployee]

    def get_queryset(self):
        queryset = DoorDeliveryFee.objects.all().order_by("-created_at")
        param = self.request.query_params.get("q")

        if param:
            queryset = queryset.filter(
                Q(cost_name__icontains=param)
                | Q(fee__icontains=param)
                | Q(note__icontains=param)
            )

        return queryset


# Upload Hoa Don
class UploadXMLView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsRoleAdminOrEmployee]

    def post(self, request, format=None):
        files = request.FILES.getlist("file")
        results = []
        namespace = {"inv": "http://laphoadon.gdt.gov.vn/2014/09/invoicexml/v1"}
        if not files:
            return Response({"message": "Files are empty"})
        for xml_file in files:
            try:
                tree = ET.parse(xml_file)
                root = tree.getroot()

                # INVOICE NAME
                invoice_names = [
                    elem.text for elem in root.findall(".//THHDVu") if elem.text
                ]
                invoice_names += [
                    elem.text for elem in root.findall(".//inv:itemName", namespace) if elem.text
                ]

                # INVOICE NUMBER
                invoice_number_elem = root.find(".//inv:invoiceNumber", namespace)
                shdon_value = (
                    invoice_number_elem.text
                    if invoice_number_elem is not None
                    else None
                )
                if not shdon_value:
                    for elem in root.iter():
                        if elem.tag.startswith("SHDon") and elem.text:
                            shdon_value = elem.text
                            break

                invoice_total_elem = root.find(".//inv:totalAmountWithVAT", namespace)
                total_value = (
                    invoice_total_elem.text if invoice_total_elem is not None else None
                )
                if not total_value:
                    for elem in root.iter():
                        if elem.tag.startswith("TgTTTBSo") and elem.text:
                            total_value = elem.text
                            break

                if shdon_value and total_value:
                    results.append(
                        {
                            "itemName": invoice_names,
                            "shdon": shdon_value,
                            "total": total_value,
                        }
                    )
            except Exception as e:
                results.append(
                    {
                        "filename": xml_file.name,
                        "error": str(e),
                    }
                )
        return Response(results)
