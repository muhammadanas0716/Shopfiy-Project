from django.shortcuts import render

# Create your views here.

def landing_page(request):
    return render(request, 'core/landing.html')

def gt3rs_product(request):
    return render(request, 'core/gt3rs_product.html')

def license_plate_product(request):
    return render(request, 'core/license_plate_product.html')
