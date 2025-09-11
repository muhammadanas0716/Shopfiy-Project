from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum, Count
from django.template.response import TemplateResponse
from .models import Product, ProductVariant, Order, OrderItem

# Admin site customization
admin.site.site_header = "SpoilerShelf Administration"
admin.site.site_title = "SpoilerShelf Admin"
admin.site.index_title = "Welcome to SpoilerShelf Administration"

# Override admin index view to add statistics
def admin_index_view(request):
    from django.contrib.admin.sites import site
    
    # Get the original response
    response = site.index(request)
    
    # Add our custom context
    if hasattr(response, 'context_data'):
        response.context_data.update({
            'total_orders': Order.objects.count(),
            'total_revenue': Order.objects.aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
            'total_products': Product.objects.filter(is_active=True).count(),
            'pending_orders': Order.objects.filter(status='pending').count(),
            'recent_orders': Order.objects.order_by('-created_at')[:5],
        })
    
    return response

# Monkey patch the admin site index view
admin.site.index = admin_index_view

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'formatted_regular_price', 'formatted_sale_price', 'status_badge', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 20
    
    def formatted_regular_price(self, obj):
        return f"Rs. {obj.regular_price}"
    formatted_regular_price.short_description = 'Regular Price'
    
    def formatted_sale_price(self, obj):
        return f"Rs. {obj.sale_price}"
    formatted_sale_price.short_description = 'Sale Price'
    
    def status_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color: green; font-weight: bold;">● Active</span>')
        else:
            return format_html('<span style="color: red; font-weight: bold;">● Inactive</span>')
    status_badge.short_description = 'Status'

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['product', 'name', 'is_active']
    list_filter = ['is_active', 'product']
    search_fields = ['name', 'product__name']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['get_total']
    
    def get_total(self, obj):
        return f"Rs.{obj.get_total()} PKR"
    get_total.short_description = 'Total'

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer_name', 'customer_email', 'status_badge', 'shipping_method', 'formatted_total', 'created_at', 'payment_status', 'delivery_status']
    list_filter = ['status', 'shipping_method', 'is_paid', 'is_delivered', 'created_at']
    search_fields = ['customer_name', 'customer_email', 'customer_phone']
    readonly_fields = ['created_at', 'updated_at', 'total_amount']
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Order Information', {
            'fields': ('status', 'total_amount', 'created_at', 'updated_at'),
            'classes': ('wide',)
        }),
        ('Customer Information', {
            'fields': ('customer_name', 'customer_email', 'customer_phone', 'shipping_address'),
            'classes': ('wide',)
        }),
        ('Shipping Information', {
            'fields': ('shipping_method', 'shipping_cost'),
            'classes': ('wide',)
        }),
        ('Order Status', {
            'fields': ('is_paid', 'is_delivered'),
            'classes': ('wide',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ['shipping_cost']
        return self.readonly_fields
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FFA500',  # Orange
            'processing': '#007BFF',  # Blue
            'shipped': '#6F42C1',  # Purple
            'delivered': '#28A745',  # Green
            'cancelled': '#DC3545',  # Red
        }
        color = colors.get(obj.status, '#6C757D')
        return format_html(
            '<span style="color: {}; font-weight: bold;">● {}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def formatted_total(self, obj):
        return f"Rs. {obj.total_amount}"
    formatted_total.short_description = 'Total Amount'
    
    def payment_status(self, obj):
        if obj.is_paid:
            return format_html('<span style="color: green; font-weight: bold;">✓ Paid</span>')
        else:
            return format_html('<span style="color: red; font-weight: bold;">✗ Unpaid</span>')
    payment_status.short_description = 'Payment'
    
    def delivery_status(self, obj):
        if obj.is_delivered:
            return format_html('<span style="color: green; font-weight: bold;">✓ Delivered</span>')
        else:
            return format_html('<span style="color: orange; font-weight: bold;">⏳ Pending</span>')
    delivery_status.short_description = 'Delivery'
    
    # Custom admin actions
    actions = ['mark_as_paid', 'mark_as_delivered', 'mark_as_processing']
    
    def mark_as_paid(self, request, queryset):
        updated = queryset.update(is_paid=True)
        self.message_user(request, f'{updated} orders marked as paid.')
    mark_as_paid.short_description = "Mark selected orders as paid"
    
    def mark_as_delivered(self, request, queryset):
        updated = queryset.update(is_delivered=True, status='delivered')
        self.message_user(request, f'{updated} orders marked as delivered.')
    mark_as_delivered.short_description = "Mark selected orders as delivered"
    
    def mark_as_processing(self, request, queryset):
        updated = queryset.update(status='processing')
        self.message_user(request, f'{updated} orders marked as processing.')
    mark_as_processing.short_description = "Mark selected orders as processing"

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_variant', 'quantity', 'price', 'get_total']
    list_filter = ['order__status', 'product_variant__product']
    search_fields = ['order__customer_name', 'product_variant__name']
    readonly_fields = ['get_total']
    
    def get_total(self, obj):
        return f"Rs.{obj.get_total()} PKR"
    get_total.short_description = 'Total'
