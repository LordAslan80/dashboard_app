from rest_framework.viewsets import ModelViewSet
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import (
    OrderSerializer,
    CategorySerializer,
    CustomerSerializer,
    SupplierSerializer,
    ProductSerializer,
    CountryFilterSerializer,
    CityFilterSerializer,
)
from .models import Order, Category, Customer, Supplier, Product


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    filterset_fields = ["shipped_country", "shipped_city"]
    search_fields = ["product__product_name", "customer__last_name"]

    def get_queryset(self):
        if self.request.GET.get("order_by") == "order_date":
            return Order.objects.all().order_by("-order_date")
        else:
            return Order.objects.all().order_by("id")


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CustomerViewSet(ModelViewSet):
    serializer_class = CustomerSerializer

    def get_queryset(self):
        return Customer.objects.all().order_by("country", "last_name")


class SupplierViewSet(ModelViewSet):
    serializer_class = SupplierSerializer

    def get_queryset(self):
        return Supplier.objects.all().order_by("country", "company_name")


class ProductViewSet(ModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.all().order_by("category__name", "unit_price")


class CountryFilterViewSet(ModelViewSet):
    queryset = Order.objects.values("shipped_country").distinct()
    serializer_class = CountryFilterSerializer


class CityFilterViewSet(ModelViewSet):
    queryset = Order.objects.values("shipped_city").distinct()
    serializer_class = CityFilterSerializer
