from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.core.exceptions import ValidationError
from .forms import OrderForm
from .models import Order, OrderItem, Product, ProductVariant

def cart_count(request):
    """Return the number of items in the cart"""
    cart = request.session.get('cart', {})
    count = sum(item['quantity'] for item in cart.values())
    return JsonResponse({'count': count})

def add_to_cart(request, variant_id):
    if request.method == 'POST':
        variant = get_object_or_404(ProductVariant, id=variant_id, is_active=True)
        quantity = int(request.POST.get('quantity', 1))
        
        cart = request.session.get('cart', {})
        cart_key = str(variant_id)
        
        if cart_key in cart:
            cart[cart_key]['quantity'] += quantity
        else:
            cart[cart_key] = {
                'variant_id': variant_id,
                'quantity': quantity,
                'price': float(variant.product.sale_price)
            }
        
        request.session['cart'] = cart
        request.session.modified = True
        
        messages.success(request, f'{variant} added to cart!')
        return JsonResponse({'success': True, 'message': 'Added to cart'})
    
    return JsonResponse({'success': False, 'message': 'Invalid request'})

def update_cart_quantity(request, variant_id):
    """Update quantity of an item in cart"""
    if request.method == 'POST':
        variant = get_object_or_404(ProductVariant, id=variant_id, is_active=True)
        quantity = int(request.POST.get('quantity', 1))
        
        if quantity <= 0:
            return JsonResponse({'success': False, 'message': 'Quantity must be greater than 0'})
        
        cart = request.session.get('cart', {})
        cart_key = str(variant_id)
        
        if cart_key in cart:
            cart[cart_key]['quantity'] = quantity
            request.session['cart'] = cart
            request.session.modified = True
            return JsonResponse({'success': True, 'message': 'Quantity updated'})
        else:
            return JsonResponse({'success': False, 'message': 'Item not found in cart'})
    
    return JsonResponse({'success': False, 'message': 'Invalid request'})

def remove_from_cart(request, variant_id):
    """Remove an item from cart"""
    if request.method == 'POST':
        cart = request.session.get('cart', {})
        cart_key = str(variant_id)
        
        if cart_key in cart:
            del cart[cart_key]
            request.session['cart'] = cart
            request.session.modified = True
            return JsonResponse({'success': True, 'message': 'Item removed from cart'})
        else:
            return JsonResponse({'success': False, 'message': 'Item not found in cart'})
    
    return JsonResponse({'success': False, 'message': 'Invalid request'})

def change_cart_variant(request, variant_id):
    """Change variant of an item in cart"""
    if request.method == 'POST':
        new_variant_id = request.POST.get('new_variant_id')
        if not new_variant_id:
            return JsonResponse({'success': False, 'message': 'New variant ID required'})
        
        try:
            new_variant = ProductVariant.objects.get(id=new_variant_id, is_active=True)
        except ProductVariant.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Invalid variant'})
        
        cart = request.session.get('cart', {})
        cart_key = str(variant_id)
        
        if cart_key in cart:
            # Update the cart item with new variant
            cart[cart_key]['variant_id'] = int(new_variant_id)
            cart[cart_key]['price'] = float(new_variant.product.sale_price)
            request.session['cart'] = cart
            request.session.modified = True
            return JsonResponse({'success': True, 'message': 'Variant updated'})
        else:
            return JsonResponse({'success': False, 'message': 'Item not found in cart'})
    
    return JsonResponse({'success': False, 'message': 'Invalid request'})

def get_product_variants(request, product_id):
    """Get variants for a product"""
    try:
        product = Product.objects.get(id=product_id, is_active=True)
        variants = product.variants.filter(is_active=True)
        variants_data = [{'id': v.id, 'name': v.name} for v in variants]
        return JsonResponse({'success': True, 'variants': variants_data})
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Product not found'})

def submit_order(request):
    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            try:
                # Create the order
                order = form.save()
                
                # Get cart items from session
                cart = request.session.get('cart', {})
                
                if not cart:
                    messages.error(request, 'Your cart is empty.')
                    return redirect('order')
                
                # Create order items
                total_amount = 0
                for variant_id, item_data in cart.items():
                    try:
                        variant = ProductVariant.objects.get(id=item_data['variant_id'], is_active=True)
                        quantity = item_data['quantity']
                        price = variant.product.sale_price
                        
                        OrderItem.objects.create(
                            order=order,
                            product_variant=variant,
                            quantity=quantity,
                            price=price
                        )
                        
                        total_amount += quantity * price
                    except ProductVariant.DoesNotExist:
                        messages.error(request, f'Product variant not found.')
                        continue
                
                # Update order total
                order.total_amount = total_amount
                order.save()
                
                # Clear cart
                request.session['cart'] = {}
                request.session.modified = True
                
                messages.success(request, 'Order placed successfully!')
                return redirect('order_success', order_id=order.id)
                
            except Exception as e:
                messages.error(request, f'Error processing order: {str(e)}')
                return redirect('order')
        else:
            # Display form errors
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{field}: {error}')
    else:
        form = OrderForm()
    
    # Get cart items for display
    cart = request.session.get('cart', {})
    cart_items = []
    total = 0
    
    for variant_id, item_data in cart.items():
        try:
            variant = ProductVariant.objects.get(id=item_data['variant_id'], is_active=True)
            quantity = item_data['quantity']
            price = variant.product.sale_price
            item_total = quantity * price
            
            cart_items.append({
                'variant': variant,
                'quantity': quantity,
                'price': price,
                'total': item_total
            })
            total += item_total
        except ProductVariant.DoesNotExist:
            continue
    
    context = {
        'form': form,
        'cart_items': cart_items,
        'total': total
    }
    
    return render(request, 'orders/order_form.html', context)

def order_success(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    return render(request, 'orders/order_success.html', {'order': order})

def track_order(request):
    """Track order by order ID"""
    order = None
    error_message = None
    
    if request.method == 'POST':
        order_id = request.POST.get('order_id')
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                error_message = "Order not found. Please check your order number and try again."
        else:
            error_message = "Please enter a valid order number."
    
    context = {
        'order': order,
        'error_message': error_message
    }
    
    return render(request, 'orders/track_order.html', context)
