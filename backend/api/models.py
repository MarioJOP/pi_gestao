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

class Venda(models.Model):
    product = models.CharField(max_length=255) # Produto vendido
    quantity = models.IntegerField() # venda de mais de um produto precisa especificar a quantidade de cada produto
    date = models.DateTimeField(auto_now_add=True)
    total_venda = models.DecimalField(max_digits=10, decimal_places=2)
    ## funcionario = models.ForeignKey(CustomUser, on_delete=models.CASCADE) # Podemos tentar fazer assim depois
    funcionario = models.CharField(max_length=255) # Funcionário que realizou a venda

    def __str__(self):
        return self.product.name


class Entry(models.Model):
    product = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product} - {self.quantity} unidades"