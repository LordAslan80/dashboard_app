from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrderViewSet,
    CategoryViewSet,
    ProductViewSet,
    CustomerViewSet,
    SupplierViewSet,
    CountryFilterViewSet,
    CityFilterViewSet,
    ProductFilterViewSet,
    SupplierFilterViewSet,
    ProductPriceFilterViewSet,
)


router = DefaultRouter()
router.register("orders", OrderViewSet, basename="orders")
router.register("categories", CategoryViewSet, basename="categories")
router.register("products", ProductViewSet, basename="products")
router.register("customers", CustomerViewSet, basename="customers")
router.register("suppliers", SupplierViewSet, basename="suppliers")
router.register("country-filters", CountryFilterViewSet, basename="country-filters")
router.register("city-filters", CityFilterViewSet, basename="city-filters")
router.register("product-filters", ProductFilterViewSet, basename="product-filters")
router.register("supplier-filters", SupplierFilterViewSet, basename="supplier-filters")
router.register(
    "product-price-filters", ProductPriceFilterViewSet, basename="product-price-filters"
)


urlpatterns = [path("", include(router.urls))]
