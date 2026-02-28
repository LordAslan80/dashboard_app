from rest_framework.viewsets import ModelViewSet
from .serializers import (
    OrderSerializer,
    CategorySerializer,
    CustomerSerializer,
    SupplierSerializer,
)
from .models import Order, Category, Customer, Supplier


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.all().order_by("-order_date")


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
