from django.urls import path
from . import views

urlpatterns = [
    # Bosh sahifa
    path('', views.home, name='home'),

    # Info sahifa
    path('info/', views.info, name='info'),
    path('faq/', views.faq, name='faq'),
    path('contact/', views.contact, name='contact'),
    path('terms/', views.terms, name='terms'),
    path('settings/', views.settings_view, name='settings'),
    path('set-language/', views.set_language, name='set_language'),
    
    # Foydalanuvchi
    path('register/', views.register, name='register'),
    path('logout/', views.user_logout, name='logout'),
    path('profile/', views.user_profile, name='user_profile'),
    path('profile/send-verification/', views.send_email_verification, name='send_email_verification'),
    path('profile/verify-email/', views.verify_email, name='verify_email'),
    path('orders/', views.order_history, name='order_history'),
    path('order/<int:order_id>/', views.order_detail, name='order_detail'),
    
    # Mahsulotlar
    path('products/', views.product_list, name='product_list'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),
    path('product/<int:product_id>/add-review/', views.add_review, name='add_review'),
    path('category/<int:category_id>/', views.category_products, name='category_products'),
    
    # Savatcha
    path('cart/', views.cart_view, name='cart'),
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('update-cart-item/', views.update_cart_item, name='update_cart_item'),
    path('remove-from-cart/', views.remove_from_cart, name='remove_from_cart'),
    path('cart-count/', views.cart_count, name='cart_count'),
    path('wishlist-count/', views.wishlist_count, name='wishlist_count'),
    
    # Buyurtma
    path('checkout/', views.checkout, name='checkout'),
    path('order-success/<int:order_id>/', views.order_success, name='order_success'),
    path('order/<int:order_id>/cancel/', views.cancel_order, name='cancel_order'),
    # User features
    path('wishlist/', views.wishlist_view, name='wishlist'),
    path('wishlist/add/<int:product_id>/', views.add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/remove/<int:product_id>/', views.remove_from_wishlist, name='remove_from_wishlist'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('addresses/', views.address_list, name='address_list'),
    path('addresses/add/', views.address_add, name='address_add'),
    path('addresses/<int:address_id>/delete/', views.address_delete, name='address_delete'),
    
    # Admin Analytics
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/export/orders/', views.export_orders, name='export_orders'),
    path('admin/export/products/', views.export_products, name='export_products'),
    
    # API Endpoints
    path('api/search-suggestions/', views.api_search_suggestions, name='api_search_suggestions'),
    path('api/product/<int:product_id>/stock/', views.api_product_stock, name='api_product_stock'),
]