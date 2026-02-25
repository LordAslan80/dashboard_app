from rest_framework.viewsets import ModelViewSet
from .serializers import OrderSerializer
from .models import Order


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.all().order_by("-created_time")
