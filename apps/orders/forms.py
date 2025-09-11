from django import forms
from django.forms import ModelForm
from .models import Order

class OrderForm(ModelForm):
    class Meta:
        model = Order
        fields = ['customer_name', 'customer_email', 'customer_phone', 'shipping_address', 'shipping_method']
        widgets = {
            'customer_name': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sans-font',
                'placeholder': 'Your full name'
            }),
            'customer_email': forms.EmailInput(attrs={
                'class': 'w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sans-font',
                'placeholder': 'your.email@example.com'
            }),
            'customer_phone': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sans-font',
                'placeholder': '+92 300 1234567'
            }),
            'shipping_address': forms.Textarea(attrs={
                'class': 'w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sans-font',
                'placeholder': 'Your complete shipping address',
                'rows': 3
            }),
            'shipping_method': forms.RadioSelect(attrs={
                'class': 'shipping-method-radio'
            }),
        }
    
    def clean(self):
        cleaned_data = super().clean()
        
        # Add custom validation if needed
        customer_name = cleaned_data.get('customer_name')
        customer_email = cleaned_data.get('customer_email')
        customer_phone = cleaned_data.get('customer_phone')
        shipping_address = cleaned_data.get('shipping_address')
        
        if not customer_name or len(customer_name.strip()) < 2:
            raise forms.ValidationError("Please enter a valid full name.")
        
        if not customer_email:
            raise forms.ValidationError("Please enter a valid email address.")
        
        if not customer_phone or len(customer_phone.strip()) < 10:
            raise forms.ValidationError("Please enter a valid phone number.")
        
        if not shipping_address or len(shipping_address.strip()) < 10:
            raise forms.ValidationError("Please enter a complete shipping address.")
        
        return cleaned_data 