from rest_framework.serializers import ModelSerializer
from .models import Order, Customer, Product, Supplier, Category


class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"

    def to_representation(self, instance):
        self.fields["customer"] = CustomerSerializer(read_only=True)
        self.fields["product"] = ProductSerializer(read_only=True)
        return super(OrderSerializer, self).to_representation(instance)


class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

    def to_representation(self, instance):
        self.fields["category"] = CategorySerializer(read_only=True)
        self.fields["supplier"] = SupplierSerializer(read_only=True)
        return super(ProductSerializer, self).to_representation(instance)


class SupplierSerializer(ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CountryFilterSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = ["shipped_country"]


class CityFilterSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = ["shipped_city"]
