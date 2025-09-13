import dbConnect from '../../../lib/mongoose';
import Order from '../../../models/Order';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SuccessOrderPage({ params }) {
  const { orderId } = params;
  await dbConnect();
  const order = await Order.findOne({ orderId }).lean();

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg border border-gray-200 p-12 rounded-lg text-center">
            <h1 className="text-3xl font-bold mb-4">Order not found</h1>
            <p className="text-gray-600 mb-6">We couldn’t locate order {orderId}.</p>
            <Link href="/" className="text-red-600 hover:text-red-700 font-semibold">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg border border-gray-200 p-12 rounded-lg text-center">
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">🎉 Thank You!</h1>
            <p className="text-2xl text-gray-600 mb-8">Your COD order has been placed.</p>
            <div className="inline-block bg-red-100 text-red-800 px-6 py-3 rounded-full font-bold text-lg mb-8">
              Order #{order.orderId}
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg mb-8 text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Order Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between"><span className="font-medium">Order ID:</span><span className="font-bold">#{order.orderId}</span></div>
                <div className="flex justify-between"><span className="font-medium">Order Date:</span><span>{new Date(order.createdAt).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="font-medium">Status:</span><span className="text-green-600 font-semibold">{order.status}</span></div>
                <div className="flex justify-between"><span className="font-medium">Total Amount:</span><span className="font-bold text-red-600">Rs.{order.total.toLocaleString()} PKR</span></div>
              </div>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between"><span className="font-medium">Name:</span><span>{order.customer_name}</span></div>
                <div className="flex justify-between"><span className="font-medium">Email:</span><span>{order.customer_email}</span></div>
                <div className="flex justify-between"><span className="font-medium">Phone:</span><span>{order.customer_phone}</span></div>
                <div className="flex justify-between"><span className="font-medium">Address:</span><span className="text-sm text-right">{order.shipping_address}</span></div>
              </div>
            </div>
          </div>

          {order.items?.length ? (
            <div className="bg-gray-50 p-8 rounded-lg mb-8 text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                    <div className="text-gray-900">
                      <div className="font-semibold text-sm">{item.productId === 'gt3rs' ? '991 GT3 RS Style SPOILER SHELF' : 'License Plate Posters'}</div>
                      <div className="text-xs text-gray-600">Variant #{item.variantId}</div>
                    </div>
                    <div className="text-right text-sm">Qty: {item.qty}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="bg-yellow-50 p-8 rounded-lg mb-8 text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-6">Contact us on WhatsApp to track your order or ask any questions.</p>
            <a href="https://wa.me/923006481758" target="_blank" rel="noreferrer" className="inline-flex items-center space-x-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              <span>Contact on WhatsApp</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300">Continue Shopping</Link>
            <Link href="/checkout" className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300">Place Another Order</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

