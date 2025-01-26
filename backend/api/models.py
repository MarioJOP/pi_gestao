# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Campo extra para permissões específicas (opcional)
    permissions = models.JSONField(default=list)  # Lista de permissões (ex.: ['add_product', 'delete_product'])

    def __str__(self):
        return self.username

class Produto(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=255)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    buy_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    supplier = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name