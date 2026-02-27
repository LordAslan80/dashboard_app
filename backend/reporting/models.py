from django.db import models


class Order(models.Model):
    order_date = models.DateTimeField()
    required_date = models.DateTimeField()
    shipped_name = models.CharField(max_length=100)
    shipped_city = models.CharField(max_length=100)
    shipped_address = models.CharField(max_length=100)
    shipped_postal_code = models.CharField(max_length=100)
    shipped_country = models.CharField(max_length=100)
    customer = models.ForeignKey(Customer, on_delete=models.DO_NOTHING)
