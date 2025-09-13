import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Order from '../../../models/Order';
import { PRODUCTS } from '../../../lib/catalog';

function generateOrderId() {
  const n = Math.floor(100000 + Math.random() * 900000); // 6-digit
  return `SS${n}`;
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_method = 'normal',
      items = [],
    } = body || {};

    if (!customer_name || !customer_email || !customer_phone || !shipping_address) {
      return NextResponse.json({ success: false, error: 'Missing required customer fields' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    const normalizedItems = items.map((i) => {
      const product = PRODUCTS[i.productId];
      if (!product) throw new Error('Invalid product');
      return {
        productId: i.productId,
        variantId: String(i.variantId),
        qty: Number(i.qty || 1),
        price: product.salePrice,
      };
    });

    const subtotal = normalizedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shippingCost = shipping_method === 'express' ? 500 : 350;
    const total = subtotal + shippingCost;

    // Ensure unique orderId
    let orderId;
    for (let attempt = 0; attempt < 5; attempt++) {
      orderId = generateOrderId();
      const exists = await Order.findOne({ orderId }).lean();
      if (!exists) break;
      orderId = null;
    }
    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Could not generate order ID' }, { status: 500 });
    }

    const doc = await Order.create({
      orderId,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_method,
      items: normalizedItems,
      subtotal,
      shippingCost,
      total,
      status: 'placed',
    });

    return NextResponse.json({ success: true, orderId: doc.orderId });
  } catch (err) {
    console.error('Order POST error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

