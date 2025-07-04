from django.contrib import admin
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
from django.contrib.auth.admin import UserAdmin

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Port)
admin.site.register(ContainerSize)
admin.site.register(VAT_INFO)
admin.site.register(Agency)
admin.site.register(CFS)
admin.site.register(Door)
admin.site.register(DoorFeeDetail)
admin.site.register(DoorDeliveryFee)
