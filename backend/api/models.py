from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.exceptions import ValidationError

class User(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'Người dùng'),
        ('employee', 'Nhân viên'),
        ('admin', 'Quản trị viên')
    ]
    role = models.CharField(
        max_length=10, choices=ROLE_CHOICES, default='user', verbose_name='Vai trò'
    )
    phone = models.CharField(
        max_length=10, verbose_name='Số điện thoại'
    )
    mst = models.CharField(
        max_length=13, verbose_name='Mã số thuế' 
    )
    full_name = models.CharField(max_length=150)
    groups = models.ManyToManyField(
        Group,
        verbose_name="groups",
        blank=True,
        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
        related_name="api_user_groups",  # Đặt tên khác với mặc định
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name="user permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        related_name="api_user_permissions",  # Đặt tên khác với mặc định
        related_query_name="user",
    )
    
    class Meta:
        verbose_name = 'Người dùng'
        verbose_name_plural = 'Người dùng'
    
    def __str__(self):
        return f"{self.full_name}"

