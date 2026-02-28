from rest_framework.viewsets import ModelViewSet
from .serializers import OrderSerializer, CategorySerializer
from .models import Order, Category


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.all().order_by("-order_date")


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
