from rest_framework.serializers import ModelSerializer
from .models import Order, Customer


class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"

    def to_representation(self, instance):
        self.fields["customer"] = CustomerSerializer(read_only=True)
        return super(OrderSerializer, self).to_representation(instance)


class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"
