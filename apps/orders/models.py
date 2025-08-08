from django.db import models
from decimal import Decimal

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    regular_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)  # e.g., "Black / Red", "White / No Sticker"
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.product.name} - {self.name}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_paid = models.BooleanField(default=False)
    is_delivered = models.BooleanField(default=False)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Customer information
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=15)
    shipping_address = models.TextField()

    def __str__(self):
        return f"Order #{self.pk} - {self.customer_name}"
    
    def calculate_total(self):
        total = sum(item.get_total() for item in self.items.all())
        self.total_amount = total
        self.save()
        return total
    
    class Meta:
        ordering = ['-created_at']

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        variant_name = self.product_variant.name if self.product_variant else 'Unknown Product'
        return f"{self.quantity} x {variant_name}"
    
    def get_total(self):
        """Calculate total price for this item with proper null handling"""
        if self.quantity is None or self.price is None:
            return Decimal('0.00')
        
        try:
            return self.quantity * self.price
        except (TypeError, ValueError):
            return Decimal('0.00')
