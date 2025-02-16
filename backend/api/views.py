from rest_framework import viewsets
from .models import Produto
from .serializers import ProdutoSerializer
import csv
from django.http import HttpResponse
from rest_framework.decorators import api_view
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from io import BytesIO
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from .models import Venda
from .serializers import VendaSerializer
from .models import Entry
from .serializers import EntrySerializer

class EntryCreateView(APIView):
    def get(self, request):
        vendas = Entry.objects.all().order_by('-date')
        serializer = EntrySerializer(vendas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EntrySerializer(data=request.data)
        if serializer.is_valid():
            product_name = serializer.validated_data.get("product")
            quantity = serializer.validated_data.get("quantity")

            # Verificar se o produto existe no estoque
            try:
                produto = Produto.objects.get(name=product_name)
            except Produto.DoesNotExist:
                return Response({"error": "Produto não encontrado"}, status=status.HTTP_404_NOT_FOUND)

            # Salvar entrada e atualizar estoque
            produto.quantity += quantity
            produto.save()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class EntryViewSet(viewsets.ModelViewSet):
#     queryset = Entry.objects.all().order_by('-date')
#     serializer_class = EntrySerializer

class VendaAPIView(APIView):
    def get(self, request):
        vendas = Venda.objects.all().order_by('-date')
        serializer = VendaSerializer(vendas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = VendaSerializer(data=request.data)
        if serializer.is_valid():
            product_name = serializer.validated_data.get("product")
            quantity = serializer.validated_data.get("quantity")

            # Verificar se o produto existe no estoque
            try:
                produto = Produto.objects.get(name=product_name)
            except Produto.DoesNotExist:
                return Response({"error": "Produto não encontrado"}, status=status.HTTP_404_NOT_FOUND)

            # Verificar se há estoque suficiente
            if produto.quantity < quantity:
                return Response({"error": "Estoque insuficiente"}, status=status.HTTP_400_BAD_REQUEST)

            # Salvar venda e atualizar estoque
            produto.quantity -= quantity
            produto.save()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            venda_id = request.data.get('id')
            venda = Venda.objects.get(id=venda_id)
            produto = Produto.objects.get(name=venda.product)

            # Restaurar a quantidade vendida ao estoque
            produto.quantity += venda.quantity
            produto.save()
            venda.delete()
            return Response({"message": "Venda excluída com sucesso."}, status=status.HTTP_204_NO_CONTENT)
        except Venda.DoesNotExist:
            return Response({"error": "Venda não encontrada."}, status=status.HTTP_404_NOT_FOUND)

    

class VendaViewSet(viewsets.ModelViewSet):
    queryset = Venda.objects.all()
    serializer_class = VendaSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
        })

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout realizado com sucesso."}, status=204)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

# auth views
class RegisterView(APIView):
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login realizado com sucesso!",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
        return Response({"message": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)
    

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]  # Somente usuários autenticados podem acessar

    def get(self, request):
        if request.user.has_perm('app_name.delete_product'):
            return Response({"message": "Você tem permissão para excluir produtos."})
        return Response({"message": "Permissão negada."}, status=status.HTTP_403_FORBIDDEN)

class ProdutoViewSet(viewsets.ModelViewSet):

    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer


# report view
@api_view(['GET'])
def generate_csv(request):
    # Cria o response de tipo CSV
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="produtos.csv"'

    # Cria o writer CSV
    writer = csv.writer(response)
    writer.writerow(['ID', 'Produto', 'Categoria', 'Fornecedor','Preço de Compra', 'Preço de venda', 'Estoque'])

    # Escreve os dados dos produtos no CSV
    produtos = Produto.objects.all()
    for produto in produtos:
        writer.writerow([produto.id, produto.name, produto.category, produto.supplier, produto.buy_price, produto.sale_price, produto.quantity])

    return response


@api_view(['GET'])
def generate_pdf(request):
    # Cria o response de tipo PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="produtos_report.pdf"'

    # Cria o objeto de documento PDF
    doc = SimpleDocTemplate(response, pagesize=letter)

    # Cria o conteúdo do documento (tabela e estilo)
    elements = []

    # Título do relatório
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    title = Paragraph("Relatório de Produtos", title_style)
    elements.append(title)

    # Dados da tabela
    data = [
        ['ID', 'Produto', 'Categoria', 'Fornecedor','Preço de Compra', 'Preço de venda', 'Estoque'],  # Cabeçalho
    ]
    
    produtos = Produto.objects.all()
    for produto in produtos:
        data.append([produto.id, produto.name, produto.category, produto.supplier, f"R$ {produto.buy_price:.2f}", f"R$ {produto.sale_price:.2f}", produto.quantity])

    # Definindo as larguras das colunas
    col_widths = [30, 120, 80, 120, 80, 80, 50]  # Largura para cada coluna (ID, Produto, Preço, Estoque)

    # Cria a tabela com o estilo e larguras das colunas
    table = Table(data, colWidths=col_widths)

    # Define o estilo da tabela
    table_style = TableStyle([
        # Estilo para as células de cabeçalho
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#D3D3D3')),  # Cor de fundo do cabeçalho (cinza claro)
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),  # Cor do texto do cabeçalho
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  # Alinha todos os dados no centro
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),  # Define a fonte
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),  # Espaçamento entre as linhas do cabeçalho
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),  # Cor de fundo das células de dados (branco)
        ('GRID', (0, 0), (-1, -1), 1, colors.black),  # Borda entre todas as células
    ])
    table.setStyle(table_style)

    # Adiciona a tabela ao documento
    elements.append(table)

    # Cria o documento PDF
    doc.build(elements)

    return response

@api_view(['GET'])
def search_products(request):
    query = request.GET.get('q', '')
    print(query)
    if query:
        produtos = Produto.objects.filter(name__icontains=query)[:10]  # Limita a 10 sugestões
        serializer = ProdutoSerializer(produtos, many=True)
        return Response(serializer.data)
    return Response([])