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
    ProductPriceFilterSerializer,
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
    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    filterset_fields = ["supplier__company_name", "unit_price"]
    search_fields = ["product_name", "category__name"]

    def get_queryset(self):
        match self.request.GET.get("order_by"):
            case "unit_price":
                return Product.objects.all().order_by("unit_price")
            case "units_in_stock":
                return Product.objects.all().order_by("units_in_stock")
            case "units_on_order":
                return Product.objects.all().order_by("units_on_order")
            case _:
                return Product.objects.all().order_by("id")


class ProductFilterViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    paginator = None


class CountryFilterViewSet(ModelViewSet):
    queryset = Order.objects.values("shipped_country").distinct()
    serializer_class = CountryFilterSerializer
    paginator = None


class CityFilterViewSet(ModelViewSet):
    queryset = Order.objects.values("shipped_city").distinct()
    serializer_class = CityFilterSerializer
    paginator = None


class SupplierFilterViewSet(ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    paginator = None


class ProductPriceFilterViewSet(ModelViewSet):
    queryset = Product.objects.values("unit_price").distinct()
    serializer_class = ProductPriceFilterSerializer
    paginator = None
