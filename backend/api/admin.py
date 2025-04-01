from django.contrib import admin
from .models import User, Port, ContainerSize, VAT_INFO

# Register your models here.
admin.site.register(User)
admin.site.register(Port)
admin.site.register(ContainerSize)
admin.site.register(VAT_INFO)
