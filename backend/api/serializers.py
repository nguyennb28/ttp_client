from rest_framework import serializers
from .models import User, Port, VAT_INFO, ContainerSize, Agency, CFS
import re


class UserSerializer(serializers.ModelSerializer):

    # remove validator default
    phone = serializers.CharField(validators=[], max_length=10)

    class Meta:
        model = User
        fields = ["id", "username", "phone", "mst", "role", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
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
