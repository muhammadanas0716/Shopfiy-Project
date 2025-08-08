from django.core.management.base import BaseCommand
from apps.orders.models import Product, ProductVariant

class Command(BaseCommand):
    help = 'Populate database with products and variants'

    def handle(self, *args, **options):
        # Create GT3 RS Spoiler Shelf product
        gt3rs_product, created = Product.objects.get_or_create(
            name="991 GT3 RS Style SPOILER SHELF - BLACK & WHITE",
            defaults={
                'description': 'Introducing GT3RS Style SPOILER SHELF, spoilershelf.pk first-ever shelf that combines aggressive design with exceptional functionality.',
                'regular_price': 9999.00,
                'sale_price': 4999.00,
                'is_active': True
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f'Created product: {gt3rs_product.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'Product already exists: {gt3rs_product.name}'))

        # Create variants for GT3 RS product
        gt3rs_variants = [
            "Black / Red",
            "Black / No Sticker", 
            "White / Red",
            "White / No Sticker"
        ]

        for variant_name in gt3rs_variants:
            variant, created = ProductVariant.objects.get_or_create(
                product=gt3rs_product,
                name=variant_name,
                defaults={'is_active': True}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created variant: {variant.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Variant already exists: {variant.name}'))

        # Create License Plate Posters product
        license_product, created = Product.objects.get_or_create(
            name="License Plate Posters",
            defaults={
                'description': 'Turn any space into a car lover\'s zone with this bold, clean, and iconic License Plates Poster from SpoilerShelf.pk.',
                'regular_price': 1999.00,
                'sale_price': 1599.00,
                'is_active': True
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f'Created product: {license_product.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'Product already exists: {license_product.name}'))

        # Create variants for License Plate product
        license_variants = [
            "Ferrari Plate",
            "Porsche Plate", 
            "Lambo Plate",
            "Porsche 911 Plate",
            "Imran Khan Plate",
            "Nissan GTR Plate"
        ]

        for variant_name in license_variants:
            variant, created = ProductVariant.objects.get_or_create(
                product=license_product,
                name=variant_name,
                defaults={'is_active': True}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created variant: {variant.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Variant already exists: {variant.name}'))

        self.stdout.write(self.style.SUCCESS('Successfully populated products and variants')) 