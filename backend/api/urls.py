from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ProdutoViewSet, generate_csv, generate_pdf, RegisterView, 
    LoginView, UserProfileView, LogoutView, VendaAPIView, 
    search_products, EntryCreateView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'products', ProdutoViewSet)

urlpatterns = router.urls

urlpatterns += [
    path('reports/csv/', generate_csv, name='generate_csv'),
    path('reports/pdf/', generate_pdf, name='generate_pdf'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('sales/', VendaAPIView.as_view(), name='vendas-list-create'),
    path('search/', search_products, name='search-products'),
    path('entries/', EntryCreateView.as_view(), name='entries-create'),
]
