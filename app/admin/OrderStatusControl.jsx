"use client";
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

const OPTIONS = [
  { value: 'placed', label: 'Placed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function OrderStatusControl({ orderId, current }) {
  const [status, setStatus] = useState(current);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const update = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to update status');
        return;
      }
      startTransition(() => router.refresh());
    } catch (e) {
      console.error(e);
      alert('Unexpected error');
    }
  };

  const quick = (v) => {
    setStatus(v);
    setTimeout(update, 0);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <button
        onClick={update}
        disabled={pending}
        className="text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
      >
        Update
      </button>
      <div className="hidden md:flex items-center gap-1">
        <button onClick={() => quick('shipped')} className="text-[10px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Shipped</button>
        <button onClick={() => quick('delivered')} className="text-[10px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Delivered</button>
        <button onClick={() => quick('cancelled')} className="text-[10px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Cancelled</button>
      </div>
    </div>
  );
}

