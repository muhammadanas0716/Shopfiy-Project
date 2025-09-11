from django.contrib import admin
from .models import Product, ProductVariant, Order, OrderItem

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'regular_price', 'sale_price', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['product', 'name', 'is_active']
    list_filter = ['is_active', 'product']
    search_fields = ['name', 'product__name']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer_name', 'customer_email', 'status', 'shipping_method', 'total_amount', 'created_at', 'is_paid', 'is_delivered']
    list_filter = ['status', 'shipping_method', 'is_paid', 'is_delivered', 'created_at']
    search_fields = ['customer_name', 'customer_email', 'customer_phone']
    readonly_fields = ['created_at', 'updated_at', 'total_amount']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('status', 'total_amount', 'created_at', 'updated_at')
        }),
        ('Customer Information', {
            'fields': ('customer_name', 'customer_email', 'customer_phone', 'shipping_address')
        }),
        ('Shipping Information', {
            'fields': ('shipping_method', 'shipping_cost')
        }),
        ('Order Status', {
            'fields': ('is_paid', 'is_delivered')
        }),
    )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_variant', 'quantity', 'price']
    list_filter = ['order__status', 'product_variant__product']
    search_fields = ['order__customer_name', 'product_variant__name']
