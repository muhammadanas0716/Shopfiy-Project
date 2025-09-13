import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongoose';
import Order from '../../../../models/Order';

export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const { orderId } = params;
    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error('Order GET error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { orderId } = params;
    const { status } = await req.json();
    const allowed = ['placed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }
    const updated = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    ).lean();
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    console.error('Order PATCH error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
