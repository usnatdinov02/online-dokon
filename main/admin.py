from django.contrib import admin
from .models import Category, Product, Cart, CartItem, Order, OrderItem, ContactMessage, Address, Wishlist, UserProfile

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'is_active', 'is_featured', 'created_at']
    list_filter = ['category', 'is_active', 'is_featured', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['price', 'stock', 'is_active', 'is_featured']

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
    list_display = ['user', 'phone', 'created_at']
    search_fields = ['user__username', 'phone']
    readonly_fields = ['created_at']
