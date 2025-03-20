from rest_framework import serializers
from .models import User
import re

class UserSerializer(serializers.ModelSerializer):

    # remove validator default 
    phone = serializers.CharField(validators=[], max_length=10)

    class Meta:
        model = User
        fields = ['id', 'username', 'phone', 'mst', 'role', 'password']
        extra_kwargs = {"password", {"write_only": True}}

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