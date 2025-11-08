"""
Management command to cleanup old abandoned carts
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from main.models import Cart

class Command(BaseCommand):
    help = 'Delete abandoned carts older than 30 days'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Number of days to keep carts (default: 30)'
        )

    def handle(self, *args, **options):
        days = options['days']
        cutoff_date = timezone.now() - timedelta(days=days)
        
        # Delete old carts without users
        old_carts = Cart.objects.filter(
            user__isnull=True,
            updated_at__lt=cutoff_date
        )
        
        count = old_carts.count()
        old_carts.delete()
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully deleted {count} old carts'
            )
        )
