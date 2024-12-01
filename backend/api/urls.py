from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet, generate_csv, generate_pdf

router = DefaultRouter()
router.register(r'products', ProdutoViewSet)

urlpatterns = router.urls  # Registra as URLs do ProdutoViewSet

# Adiciona as URLs para gerar o CSV e o PDF
urlpatterns += [
    path('reports/csv/', generate_csv, name='generate_csv'),
    path('reports/pdf/', generate_pdf, name='generate_pdf'),
]
