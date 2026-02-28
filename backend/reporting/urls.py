from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrderViewSet,
    CategoryViewSet,
    ProductViewSet,
    CustomerViewSet,
    SupplierViewSet,
)


router = DefaultRouter()
router.register("orders", OrderViewSet, basename="orders")
router.register("categories", CategoryViewSet, basename="categories")
router.register("products", ProductViewSet, basename="products")
router.register("customers", CustomerViewSet, basename="customers")
router.register("suppliers", SupplierViewSet, basename="suppliers")


urlpatterns = [path("", include(router.urls))]
