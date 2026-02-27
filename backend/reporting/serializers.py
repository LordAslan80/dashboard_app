from rest_framework.serializers import ModelSerializer
from .models import Order, Customer, Product, Supplier, Category


class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"

    def to_representation(self, instance):
        self.fields["customer"] = CustomerSerializer(read_only=True)
        self.fields["product"] = CustomerSerializer(read_only=True)
        return super(OrderSerializer, self).to_representation(instance)


class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class SupplierSerializer(ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
