from django.shortcuts import render
from apps.orders.models import Product

# Create your views here.

def landing_page(request):
    return render(request, 'core/landing.html')

def gt3rs_product(request):
    product = Product.objects.filter(name="991 GT3 RS Style SPOILER SHELF - BLACK & WHITE", is_active=True).first()
    variants = product.variants.filter(is_active=True) if product else []
    return render(request, 'core/gt3rs_product.html', {"product": product, "variants": variants})

def license_plate_product(request):
    product = Product.objects.filter(name="License Plate Posters", is_active=True).first()
    variants = product.variants.filter(is_active=True) if product else []
    return render(request, 'core/license_plate_product.html', {"product": product, "variants": variants})
