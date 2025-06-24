from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator


class User(AbstractUser):
    ROLE_CHOICES = [
        ("user", "Người dùng"),
        ("employee", "Nhân viên"),
        ("admin", "Quản trị viên"),
        ("client-saas", "Khách hàng saas"),
    ]
    role = models.CharField(
        max_length=50, choices=ROLE_CHOICES, default="user", verbose_name="Vai trò"
    )
    phone = models.CharField(max_length=10, verbose_name="Số điện thoại")
    tax_code = models.CharField(max_length=13, null=True, verbose_name="Mã số thuế")
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

    tenant_db = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = "Người dùng"
        verbose_name_plural = "Người dùng"

    def __str__(self):
        return f"{self.username}"


class Port(models.Model):
    country = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.name


class ContainerSize(models.Model):
    name = models.CharField(max_length=100)
    size = models.CharField(max_length=10)
    abbreviation = models.CharField(max_length=10, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.size + " " + self.name


class VAT_INFO(models.Model):
    company_name = models.TextField(null=True)
    address = models.TextField(null=True)
    company_tax_code = models.TextField(null=True, unique=True)
    ward_or_commune = models.TextField(null=True)
    district = models.TextField(null=True)
    province_or_city = models.TextField(null=True)
    country = models.TextField(null=True)
    einvoice_contact_name = models.TextField(null=True)
    einvoice_contact_email = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"{self.company_tax_code} - {self.company_name}"


class Agency(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField(null=True)
    phone = models.CharField(
        max_length=10,
        validators=[
            RegexValidator(r"^\d{10}$", "Enter a valid phone number (10 digits).")
        ],
        null=True,
    )
    abbreviation = models.CharField(max_length=10, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.address} - {self.phone} - {self.abbreviation}"


class CFS(models.Model):
    ship_name = models.CharField(max_length=100)
    mbl = models.CharField(max_length=100)
    container_number = models.CharField(
        max_length=100,
        unique=True,
        help_text="Mã số container, đặt unique nếu cần đảm bảo không trùng",
    )
    agency = models.ForeignKey(Agency, on_delete=models.PROTECT)
    container_size = models.ForeignKey(ContainerSize, on_delete=models.PROTECT)
    cbm = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        blank=True,
        null=True,
        help_text="Thể tích, tính theo khối mét",
    )
    eta = models.DateField(help_text="Ngày dự kiến đến")
    port = models.ForeignKey(Port, on_delete=models.PROTECT)
    actual_date = models.DateField(
        blank=True, null=True, help_text="Ngày tàu thực sự đến hoặc rời đi"
    )
    end_date = models.DateField(
        blank=True, null=True, help_text="Ngày kết thúc giao dịch hoặc xử lý thực tế"
    )
    note = models.TextField(
        blank=True, null=True, help_text="Các thông tin bổ sung nếu cần"
    )
    # TASA
    delivery_order_fee = models.DecimalField(
        max_digits=15, decimal_places=0, blank=True, null=True
    )
    cleaning = models.DecimalField(
        max_digits=15, decimal_places=0, blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"{self.mbl} - {self.ship_name}"


class PaymentDocument(models.Model):
    spc = models.CharField(max_length=100, unique=True)
    settlement_date = models.DateField(
        verbose_name="Ngày quyết toán", null=True, blank=True
    )
    company_name = models.TextField(verbose_name="Tên công ty vận chuyển")
    employee_name = models.CharField(
        max_length=255, verbose_name="Tên nhân viên (Họ tên)"
    )
    product_name = models.CharField(max_length=255, verbose_name="Tên hàng")
    declaration = models.CharField(max_length=25, verbose_name="Tờ khai")
    bln = models.TextField(verbose_name="Bill of Lading number / Số vận đơn")
    product_detail = models.TextField(verbose_name="Chi tiết hàng")
    agent = models.TextField(verbose_name="Chủ hàng/Đại lý")
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"{self.spc}"


class PaymentDocumentFeeDetail(models.Model):
    payment_document = models.ForeignKey(
        PaymentDocument, on_delete=models.CASCADE, related_name="detail_fees"
    )
    cost_name = models.TextField(verbose_name="Tên chi phí")
    contract_fee = models.DecimalField(
        max_digits=15,
        decimal_places=0,
        verbose_name="Số tiền có hợp đồng",
        null=True,
        blank=True,
    )
    non_contract_fee = models.DecimalField(
        max_digits=15,
        decimal_places=0,
        verbose_name="Số tiền không hợp đồng",
        null=True,
        blank=True,
    )
    contract_number = models.CharField(max_length=10, null=True, verbose_name="Số hợp đồng")
    note = models.TextField(verbose_name="Ghi chú", null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"{self.cost_name}"


class PaymentDocumentDeliveryFee(models.Model):
    payment_document = models.ForeignKey(
        PaymentDocument, on_delete=models.CASCADE, related_name="ship_fees"
    )
    cost_name = models.TextField(verbose_name="Phí vận chuyển")
    fee = models.DecimalField(
        max_digits=15,
        decimal_places=0,
        verbose_name="Số tiền",
        null=True,
        blank=True,
    )
    note = models.TextField(verbose_name="Ghi chú", null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"{self.cost_name}"
