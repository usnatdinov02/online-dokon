"""
Management command to update user statistics
"""

from django.core.management.base import BaseCommand
from django.db.models import Sum, Count
from main.models import UserProfile, Order

class Command(BaseCommand):
    help = 'Update user profile statistics (total orders and spent)'

    def handle(self, *args, **options):
        profiles = UserProfile.objects.all()
        updated = 0
        
        for profile in profiles:
            # Calculate total orders and spent
            orders = Order.objects.filter(
                user=profile.user,
                status__in=['processing', 'shipped', 'delivered']
            )
            
            total_orders = orders.count()
            total_spent = orders.aggregate(
                total=Sum('total_amount')
            )['total'] or 0
            
            # Update profile
            profile.total_orders = total_orders
            profile.total_spent = total_spent
            profile.save()
            
            updated += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully updated {updated} user profiles'
            )
        )
