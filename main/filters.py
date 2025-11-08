"""
Advanced filtering system for products
"""

from django.db.models import Q, Min, Max
from .models import Product, Category

class ProductFilter:
    """Advanced product filtering"""
    
    def __init__(self, queryset, params):
        self.queryset = queryset
        self.params = params
    
    def filter(self):
        """Apply all filters"""
        qs = self.queryset
        
        # Search by name and description
        search = self.params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search)
            )
        
        # Filter by category
        category = self.params.get('category')
        if category:
            qs = qs.filter(category_id=category)
        
        # Filter by price range
        min_price = self.params.get('min_price')
        max_price = self.params.get('max_price')
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)
        
        # Filter by discount
        has_discount = self.params.get('has_discount')
        if has_discount == 'true':
            qs = qs.filter(discount_percent__gt=0)
        
        # Filter by stock
        in_stock = self.params.get('in_stock')
        if in_stock == 'true':
            qs = qs.filter(stock__gt=0)
        
        # Filter by featured
        featured = self.params.get('featured')
        if featured == 'true':
            qs = qs.filter(is_featured=True)
        
        # Sort
        sort_by = self.params.get('sort', '-created_at')
        valid_sorts = [
            'price', '-price',
            'name', '-name',
            'created_at', '-created_at',
            'discount_percent', '-discount_percent'
        ]
        if sort_by in valid_sorts:
            qs = qs.order_by(sort_by)
        
        return qs
    
    @staticmethod
    def get_price_range(queryset):
        """Get min and max price from queryset"""
        result = queryset.aggregate(
            min_price=Min('price'),
            max_price=Max('price')
        )
        return result['min_price'] or 0, result['max_price'] or 0
