"""
URL configuration for spoilershelf project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from apps.core.views import landing_page, gt3rs_product, license_plate_product
from apps.orders.views import (
    submit_order, order_success, add_to_cart, cart_count,
    update_cart_quantity, remove_from_cart, change_cart_variant, get_product_variants,
    track_order
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', landing_page, name='landing'),
    path('product/gt3rs-spoiler-shelf/', gt3rs_product, name='gt3rs_product'),
    path('product/license-plate-posters/', license_plate_product, name='license_plate_product'),
    path('add-to-cart/<int:variant_id>/', add_to_cart, name='add_to_cart'),
    path('cart-count/', cart_count, name='cart_count'),
    path('update-cart-quantity/<int:variant_id>/', update_cart_quantity, name='update_cart_quantity'),
    path('remove-from-cart/<int:variant_id>/', remove_from_cart, name='remove_from_cart'),
    path('change-cart-variant/<int:variant_id>/', change_cart_variant, name='change_cart_variant'),
    path('get-product-variants/<int:product_id>/', get_product_variants, name='get_product_variants'),
    path('order/', submit_order, name='order'),
    path('order/success/<int:order_id>/', order_success, name='order_success'),
    path('track-order/', track_order, name='track_order'),
]
