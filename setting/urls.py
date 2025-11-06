from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),

    # Informational pages (mobile-friendly)
    path('about/', TemplateView.as_view(template_name='about.html'), name='about'),
    path('help/', TemplateView.as_view(template_name='help-center.html'), name='help_center'),
    path('shipping/', TemplateView.as_view(template_name='shipping.html'), name='shipping'),
    path('returns/', TemplateView.as_view(template_name='returns.html'), name='returns'),
    path('privacy/', TemplateView.as_view(template_name='privacy.html'), name='privacy'),
    path('payments/', TemplateView.as_view(template_name='payments.html'), name='payments'),
    path('contact-mobile/', TemplateView.as_view(template_name='contact-mobile.html'), name='contact_mobile'),
]

# Media va static fayllar uchun URL
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)