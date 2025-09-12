from django.core.management.base import BaseCommand
from django.db import connection
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Fix shipping method migration issue'

    def handle(self, *args, **options):
        self.stdout.write('Checking database state...')
        
        with connection.cursor() as cursor:
            try:
                cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name='orders_order' AND column_name='shipping_method';")
                result = cursor.fetchone()
                
                if result:
                    self.stdout.write(self.style.SUCCESS('shipping_method column already exists!'))
                else:
                    self.stdout.write(self.style.WARNING('shipping_method column does not exist. Applying migration...'))
                    call_command('migrate', 'orders', '0005', verbosity=2)
                    self.stdout.write(self.style.SUCCESS('Migration applied successfully!'))
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error checking database: {str(e)}'))
                self.stdout.write('Attempting to apply migration anyway...')
                try:
                    call_command('migrate', 'orders', verbosity=2)
                    self.stdout.write(self.style.SUCCESS('Migration completed!'))
                except Exception as migrate_error:
                    self.stdout.write(self.style.ERROR(f'Migration failed: {str(migrate_error)}'))
