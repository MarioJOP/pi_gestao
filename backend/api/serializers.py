# serializers.py
from rest_framework import serializers
from .models import Produto

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from .models import CustomUser
from rest_framework import serializers
from .models import Venda
from .models import Entry

class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ["product", "quantity", "cost", "date"]

User = get_user_model()  # Isso garantirá que o modelo de usuário personalizado seja usado

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['id', 'name', 'description', 'category', 'supplier', 'sale_price', 'buy_price', 'quantity']

    def validate_nome(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("O nome deve ter pelo menos 2 caracteres.")
        return value

    def validate_descricao(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("A descrição deve ter pelo menos 10 caracteres.")
        return value

    def validate_preco(self, value):
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que 0.")
        return value
    

class VendaSerializer(serializers.ModelSerializer):
    total_venda = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = Venda
        fields = '__all__'
    
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("A quantidade deve ser maior que zero.")
        return value

    def validate_total_venda(self, value):
        if value < 0:
            raise serializers.ValidationError("O valor total não pode ser negativo.")
        return value
