import dbConnect from '../../lib/mongoose';
import Order from '../../models/Order';
import Link from 'next/link';
import { PRODUCTS } from '../../lib/catalog';
import OrderStatusControl from './OrderStatusControl';

export const dynamic = 'force-dynamic';

function formatCurrency(n) {
  try { return `Rs.${Number(n).toLocaleString()} PKR`; } catch { return `Rs.${n}`; }
}

const STATUS_LABELS = {
  all: 'All',
  placed: 'Placed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function buildQueryString(params) {
  const p = new URLSearchParams(params);
  return `?${p.toString()}`;
}

export default async function AdminPage({ searchParams }) {
  await dbConnect();

  const pageSize = 10;
  const page = Math.max(1, parseInt(searchParams?.page || '1', 10));
  const q = (searchParams?.q || '').trim();
  const status = (searchParams?.status || 'all').toLowerCase();

  const query = {};
  if (status && status !== 'all') query.status = status;
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { orderId: regex },
      { customer_name: regex },
      { customer_email: regex },
      { customer_phone: regex },
    ];
  }

  const [orders, totalFiltered, statusAgg] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Order.countDocuments(query),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const counts = { all: statusAgg.reduce((s, r) => s + r.count, 0) };
  for (const r of statusAgg) counts[r._id] = r.count;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Admin — Orders</h1>
            <div className="text-sm text-gray-600">{totalFiltered} result{totalFiltered === 1 ? '' : 's'}</div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(['all','placed','shipped','delivered','cancelled']).map((key) => {
                const active = status === key;
                const baseParams = { ...searchParams, status: key, page: '1' };
                const href = buildQueryString(baseParams);
                const badge = counts[key] ?? 0;
                const classes = active
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
                return (
                  <Link key={key} href={`/admin${href}`} className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${classes}`}>
                    {STATUS_LABELS[key]}<span className="ml-2 text-xs opacity-80">{badge}</span>
                  </Link>
                );
              })}
            </div>

            <form action="/admin" method="get" className="flex items-center gap-2">
              {/* Keep current status when searching */}
              <input type="hidden" name="status" value={status} />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search by order, name, email, phone"
                className="w-72 max-w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">Search</button>
              <Link href="/admin" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Clear</Link>
            </form>
          </div>
        </div>

        <div className="bg-white shadow border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Shipping</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Totals</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                      No orders found. Try adjusting filters or search.
                    </td>
                  </tr>
                ) : null}
                {orders.map((o) => (
                  <tr key={o._id} className="align-top hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Link href={`/success/${o.orderId}`} className="text-blue-600 hover:underline font-medium">{o.orderId}</Link>
                        <span className="text-xs text-gray-400">#{String(o._id).slice(-6)}</span>
                      </div>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-gray-600">Items ({o.items?.length || 0})</summary>
                        <div className="mt-2 space-y-1">
                          {o.items?.map((it, idx) => (
                            <div key={idx} className="text-xs text-gray-700 flex justify-between">
                              <span>
                                {(it.productId === 'gt3rs' ? PRODUCTS.gt3rs.name : PRODUCTS.plates.name)} — Var #{it.variantId}
                              </span>
                              <span>{it.qty} × {formatCurrency(it.price)}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{o.customer_name}</div>
                      <div className="text-xs text-gray-600 break-all line-clamp-2 max-w-xs">{o.shipping_address}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="break-all">{o.customer_email}</div>
                      <div className="text-xs text-gray-500">{o.customer_phone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 capitalize">
                        {o.shipping_method}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>Subtotal: <span className="font-medium">{formatCurrency(o.subtotal)}</span></div>
                      <div>Shipping: <span className="font-medium">{formatCurrency(o.shippingCost)}</span></div>
                      <div>Total: <span className="font-bold text-red-600">{formatCurrency(o.total)}</span></div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold capitalize ${o.status === 'placed' ? 'bg-yellow-100 text-yellow-800' : o.status === 'shipped' ? 'bg-blue-100 text-blue-800' : o.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {o.status}
                      </span>
                      <OrderStatusControl orderId={o.orderId} current={o.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
          <div>
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link href={`/admin${buildQueryString({ ...searchParams, page: String(page - 1) })}`} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded">Prev</Link>
            ) : (
              <span className="px-3 py-2 bg-gray-50 text-gray-400 rounded">Prev</span>
            )}
            {page < totalPages ? (
              <Link href={`/admin${buildQueryString({ ...searchParams, page: String(page + 1) })}`} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded">Next</Link>
            ) : (
              <span className="px-3 py-2 bg-gray-50 text-gray-400 rounded">Next</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
