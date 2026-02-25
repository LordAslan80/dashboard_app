from rest_framework.serializers import ModelSerializer
from .models import Order


class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = ["id", "amount", "description", "created_time"]
