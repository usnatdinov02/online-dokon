from django.contrib import admin
from .models import Category, Product, ProductImage, Cart, CartItem, Order, OrderItem, ContactMessage, Address, Wishlist, UserProfile

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    fields = ['image', 'order']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'discount_percent', 'stock', 'is_active', 'is_featured', 'created_at']
    list_filter = ['category', 'is_active', 'is_featured', 'created_at', 'discount_percent']
    search_fields = ['name', 'description']
    list_editable = ['price', 'discount_percent', 'stock', 'is_active', 'is_featured']
    inlines = [ProductImageInline]

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'session_key', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'session_key']
    inlines = [CartItemInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'email', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    list_editable = ['status']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [OrderItemInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'price', 'total_price']
    list_filter = ['order__status', 'order__created_at']
    search_fields = ['order__first_name', 'order__last_name', 'product__name']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['created_at']


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'full_name', 'city', 'country', 'is_default', 'created_at']
    list_filter = ['is_default', 'country', 'created_at']
    search_fields = ['user__username', 'full_name', 'line1', 'city']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at']
    search_fields = ['user__username']
    filter_horizontal = ['products']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'region', 'email_verified', 'total_orders', 'total_spent', 'created_at']
    list_filter = ['region', 'email_verified', 'gender', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone', 'city', 'telegram_username']
    readonly_fields = ['created_at', 'updated_at', 'total_orders', 'total_spent']
    
    fieldsets = (
        ('Foydalanuvchi', {
            'fields': ('user', 'avatar', 'bio')
        }),
        ('Shaxsiy ma\'lumotlar', {
            'fields': ('phone', 'date_of_birth', 'gender')
        }),
        ('Manzil', {
            'fields': ('region', 'city', 'address', 'postal_code')
        }),
        ('Aloqa', {
            'fields': ('telegram_username', 'whatsapp_number')
        }),
        ('Email tasdiqlash', {
            'fields': ('email_verified', 'email_verification_code')
        }),
        ('Statistika', {
            'fields': ('total_orders', 'total_spent', 'created_at', 'updated_at')
        }),
    )
