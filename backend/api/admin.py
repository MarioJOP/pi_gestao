from django.contrib import admin
from .models import Produto  # Certifique-se de que o nome do modelo está correto (Produto)

@admin.register(Produto)  # Registro do modelo Produto no Django Admin
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'supplier', 'buy_price', 'sale_price', 'quantity')  # Campos a serem exibidos na lista de produtos
    list_filter = ('category',)  # Filtro por categoria
    search_fields = ('name', 'description')  # Campos que podem ser pesquisados na interface admin
