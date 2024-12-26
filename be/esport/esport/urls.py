from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenBlacklistView
from app.views import AuthViewSet, WalletViewSet, CategoryViewSet, ProductViewSet, BannerViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'wallet', WalletViewSet, basename='wallet')
router.register(r'category', CategoryViewSet, basename='category')
router.register(r'product', ProductViewSet, basename='product')
router.register(r'banner', BannerViewSet, basename='banner')


# Define urlpatterns
urlpatterns = [
    # Admin site URL
    path('admin/', admin.site.urls),

    # Include API URLs
    path('api/', include(router.urls)),
    path("api/auth/token/revoke/", TokenBlacklistView.as_view(), name="token_revoke"),
]
if settings.DEBUG:  # Only in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Update the admin site titles
admin.site.site_header = "eSportsCardNepal"
admin.site.site_title = "Esports Card Nepal"
admin.site.index_title = "Welcome to eSportsCardNepal site."