from rest_framework import viewsets
from .models import Produto
from .serializers import ProdutoSerializer
import csv
from django.http import HttpResponse
from rest_framework.decorators import api_view
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from io import BytesIO

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

@api_view(['GET'])
def generate_csv(request):
    # Cria o response de tipo CSV
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="produtos.csv"'

    # Cria o writer CSV
    writer = csv.writer(response)
    writer.writerow(['ID', 'Produto', 'Preço', 'Estoque'])

    # Escreve os dados dos produtos no CSV
    produtos = Produto.objects.all()
    for produto in produtos:
        writer.writerow([produto.id, produto.name, produto.price, produto.quantity])

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
        ["ID", "Produto", "Preço", "Estoque"],  # Cabeçalho
    ]
    
    produtos = Produto.objects.all()
    for produto in produtos:
        data.append([produto.id, produto.name, f"R$ {produto.price:.2f}", produto.quantity])

    # Definindo as larguras das colunas
    col_widths = [50, 200, 100, 100]  # Largura para cada coluna (ID, Produto, Preço, Estoque)

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