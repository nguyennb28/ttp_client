from rest_framework import serializers
from .models import (
    User,
    Port,
    VAT_INFO,
    ContainerSize,
    Agency,
    CFS,
    PaymentDocument,
    PaymentDocumentFeeDetail,
    PaymentDocumentDeliveryFee,
)
import re
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):

    # remove validator default
    phone = serializers.CharField(validators=[], max_length=10)
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "phone",
            "tax_code",
            "role",
            "tenant_db",
            "password",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def get_full_name(self, obj):
        return obj.get_full_name().strip()

    def create(self, validated_data):
        user_currently = self.context.get("request").user
        password = validated_data.pop("password", None)
        tax_code = validated_data.pop("tax_code", None)
        tenant_db = validated_data.pop("tenant_db", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)

        # Custom field for [tax_code, tenant_db] when value null
        if tax_code:
            user.tax_code = tax_code
        else:
            user.tax_code = user_currently.tax_code

        if tenant_db:
            user.tenant_db = tenant_db
        else:
            user.tenant_db = user_currently.tenant_db

        user.save()
        return user

    def update(self, instance, validated_data):
        user_currently = self.context.get("request").user
        password = validated_data.pop("password", None)
        tax_code = validated_data.pop("tax_code", None)
        tenant_db = validated_data.pop("tenant_db", None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)

        if tax_code:
            instance.tax_code = tax_code
        else:
            instance.tax_code = user_currently.tax_code

        if tenant_db:
            instance.tenant_db = tenant_db
        else:
            instance.tenant_db = instance.tenant_db

        instance.save()
        return instance

    # Check phone is valid
    def validate_phone(self, value):
        value = value.strip()
        if not re.fullmatch(r"\d{10}", value):
            raise serializers.ValidationError("Số điện thoại phải gồm đúng 10 chữ số")
        if self.instance and self.instance.phone == value:
            return value
        return value


class PortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Port
        fields = ["id", "country", "name", "code"]


class ContainerSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContainerSize
        fields = ["id", "name", "size", "abbreviation"]


class VatInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VAT_INFO
        fields = [
            "id",
            "company_name",
            "address",
            "company_tax_code",
            "ward_or_commune",
            "district",
            "province_or_city",
            "country",
            "einvoice_contact_name",
            "einvoice_contact_email",
        ]


class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = ["id", "name", "address", "phone", "abbreviation"]


class CFSSerizalier(serializers.ModelSerializer):

    agency_name = serializers.CharField(source="agency.name", read_only=True)
    container_type = serializers.CharField(source="container_size.name", read_only=True)
    size = serializers.CharField(source="container_size.size", read_only=True)
    port_name = serializers.CharField(source="port.name", read_only=True)

    class Meta:
        model = CFS
        fields = [
            "id",
            "ship_name",
            "mbl",
            "container_number",
            "agency",
            "container_size",
            "cbm",
            "eta",
            "port",
            "actual_date",
            "end_date",
            "note",
            "agency_name",
            "container_type",
            "size",
            "port_name",
        ]


UserModel = get_user_model()


class CustomLoginSerializer(TokenObtainPairSerializer):
    tax_code = serializers.CharField(max_length=20, required=True, write_only=True)
    default_error_messages = {
        "no_active_account": "Incorrect username, password or tax code or account not activated"
    }

    def validate(self, attrs):
        username = attrs.get(self.username_field)
        password = attrs.get("password")
        tax_code = attrs.get("tax_code")

        user_obj = None

        if username and password and tax_code:
            try:
                user_lookup = {self.username_field: username}
                user_obj = UserModel._default_manager.get(**user_lookup)

                if not user_obj.check_password(password):
                    print(f"Login failed for {username}: Incorrect password")
                    user_obj = None
                elif user_obj.tax_code != tax_code:
                    print(
                        f"Login failed for {username}: Incorrect tax_code (Excepted: {user_obj.tax_code}, Got: {tax_code})"
                    )
                    user_obj = None
                elif not user_obj.is_active:
                    print(f"Login failed for {username}: User inactive")
                    user_obj = None
            except UserModel.DoesNotExist:
                print(f"Login failed: User {username} not found")
        if user_obj is None:
            raise serializers.ValidationError(
                self.error_messages["no_active_account"], code="authentication"
            )

        self.user = user_obj
        print(f"Authentication successful for user: {self.user.username}")

        data = super().validate(attrs)

        return data


class PaymentDocumentFeeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentDocumentFeeDetail
        fields = [
            "id",
            "cost_name",
            "contract_fee",
            "non_contract_fee",
            "contract_number",
            "note",
        ]


class PaymentDocumentDeliveryFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentDocumentDeliveryFee
        fields = ["id", "cost_name", "fee", "note"]


class PaymentDocumentSerializer(serializers.ModelSerializer):

    detail_fees = PaymentDocumentFeeDetailSerializer(many=True, read_only=True)
    ship_fees = PaymentDocumentDeliveryFeeSerializer(many=True, read_only=True)

    class Meta:
        model = PaymentDocument
        fields = [
            "id",
            "spc",
            "settlement_date",
            "company_name",
            "employee_name",
            "product_name",
            "declaration",
            "bln",
            "product_detail",
            "agent",
            "detail_fees",
            "ship_fees",
        ]
