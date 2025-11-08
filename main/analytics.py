"""
Analytics and reporting utilities
"""

from django.db.models import Sum, Count, Avg, F, Q
from django.utils import timezone
from datetime import timedelta
from .models import Order, OrderItem, Product, UserProfile

class SalesAnalytics:
    """Sales analytics and statistics"""
    
    @staticmethod
    def get_dashboard_stats():
        """Get main dashboard statistics"""
        today = timezone.now().date()
        last_30_days = today - timedelta(days=30)
        last_7_days = today - timedelta(days=7)
        
        # Total sales
        total_sales = Order.objects.filter(
            status__in=['processing', 'shipped', 'delivered']
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Sales this month
        month_sales = Order.objects.filter(
            created_at__gte=last_30_days,
            status__in=['processing', 'shipped', 'delivered']
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Sales this week
        week_sales = Order.objects.filter(
            created_at__gte=last_7_days,
            status__in=['processing', 'shipped', 'delivered']
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Total orders
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        completed_orders = Order.objects.filter(status='delivered').count()
        
        # Total products
        total_products = Product.objects.filter(is_active=True).count()
        out_of_stock = Product.objects.filter(stock=0).count()
        
        # Total users
        total_users = UserProfile.objects.count()
        verified_users = UserProfile.objects.filter(email_verified=True).count()
        
        # Average order value
        avg_order = Order.objects.filter(
            status__in=['processing', 'shipped', 'delivered']
        ).aggregate(avg=Avg('total_amount'))['avg'] or 0
        
        return {
            'total_sales': float(total_sales),
            'month_sales': float(month_sales),
            'week_sales': float(week_sales),
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
            'total_products': total_products,
            'out_of_stock': out_of_stock,
            'total_users': total_users,
            'verified_users': verified_users,
            'avg_order': float(avg_order),
        }
    
    @staticmethod
    def get_top_products(limit=10):
        """Get top selling products"""
        return Product.objects.annotate(
            total_sold=Count('orderitem')
        ).order_by('-total_sold')[:limit]
    
    @staticmethod
    def get_sales_by_region():
        """Get sales statistics by region"""
        return UserProfile.objects.values('region').annotate(
            total_orders=Count('user__order'),
            total_spent=Sum('user__order__total_amount')
        ).order_by('-total_spent')
    
    @staticmethod
    def get_daily_sales(days=30):
        """Get daily sales for last N days"""
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        sales = Order.objects.filter(
            created_at__date__gte=start_date,
            created_at__date__lte=end_date,
            status__in=['processing', 'shipped', 'delivered']
        ).values('created_at__date').annotate(
            total=Sum('total_amount'),
            count=Count('id')
        ).order_by('created_at__date')
        
        return list(sales)
    
    @staticmethod
    def get_low_stock_products(threshold=5):
        """Get products with low stock"""
        return Product.objects.filter(
            stock__lte=threshold,
            stock__gt=0,
            is_active=True
        ).order_by('stock')

class ExportUtility:
    """Export data to various formats"""
    
    @staticmethod
    def export_orders_csv(orders):
        """Export orders to CSV format"""
        import csv
        from io import StringIO
        
        output = StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow([
            'ID', 'Sana', 'Mijoz', 'Email', 'Telefon',
            'Manzil', 'Summa', 'Holat'
        ])
        
        # Data
        for order in orders:
            writer.writerow([
                order.id,
                order.created_at.strftime('%Y-%m-%d %H:%M'),
                f"{order.first_name} {order.last_name}",
                order.email,
                order.phone,
                order.address,
                order.total_amount,
                order.get_status_display()
            ])
        
        return output.getvalue()
    
    @staticmethod
    def export_products_csv(products):
        """Export products to CSV format"""
        import csv
        from io import StringIO
        
        output = StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow([
            'ID', 'Nomi', 'Kategoriya', 'Narx', 'Chegirma %',
            'Omborda', 'Faol', 'Yaratilgan'
        ])
        
        # Data
        for product in products:
            writer.writerow([
                product.id,
                product.name,
                product.category.name,
                product.price,
                product.discount_percent,
                product.stock,
                'Ha' if product.is_active else 'Yo\'q',
                product.created_at.strftime('%Y-%m-%d')
            ])
        
        return output.getvalue()
