from django.contrib import admin
from .models import (
    User,
    Port,
    ContainerSize,
    VAT_INFO,
    Agency,
    CFS,
    PaymentDocument,
    PaymentDocumentFeeDetail,
    PaymentDocumentDeliveryFee,
)
from django.contrib.auth.admin import UserAdmin

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Port)
admin.site.register(ContainerSize)
admin.site.register(VAT_INFO)
admin.site.register(Agency)
admin.site.register(CFS)
admin.site.register(PaymentDocument)
admin.site.register(PaymentDocumentFeeDetail)
admin.site.register(PaymentDocumentDeliveryFee)
