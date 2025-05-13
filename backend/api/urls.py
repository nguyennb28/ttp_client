from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"ports", views.PortViewSet)
router.register(r"container-sizes", views.ContainerSizeViewSet)
router.register(r"vat-infos", views.VatInfoViewSet)
router.register(r"agencies", views.AgencyViewSet)
router.register(r"cfss", views.CFSViewSet)
router.register('databases', views.DatabaseViewSet, basename='database')  # Phải chỉ định basename
urlpatterns = [path("", include(router.urls))]
