"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../../components/CartContext";
import { PRODUCTS } from "../../lib/catalog";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, updateQty, removeItem, changeVariant, subtotal, clear } = useCart();

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    shipping_method: "normal", // normal | express
  });

  const shippingCost = form.shipping_method === "express" ? 500 : 350;
  const total = subtotal + (items.length ? shippingCost : 0);

  const onPlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to place order');
        return;
      }
      clear();
      router.push(`/success/${data.orderId}`);
    } catch (err) {
      console.error(err);
      alert('Unexpected error placing order');
    }
  };

  // Variant change support: inline select for simplicity.
  const VariantSelector = ({ item }) => {
    const product = PRODUCTS[item.productId];
    return (
      <select
        className="mt-1 text-sm border border-gray-300 rounded-md px-2 py-1"
        value={item.variantId}
        onChange={(e) => changeVariant(item.key, e.target.value)}
      >
        {product.variants.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>
              <form className="space-y-6" onSubmit={onPlaceOrder}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    required
                    value={form.customer_name}
                    onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.customer_email}
                    onChange={(e) => setForm((f) => ({ ...f, customer_email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    required
                    value={form.customer_phone}
                    onChange={(e) => setForm((f) => ({ ...f, customer_phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.shipping_address}
                    onChange={(e) => setForm((f) => ({ ...f, shipping_address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-4">Shipping Method *</span>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="shipping_method"
                        value="normal"
                        checked={form.shipping_method === "normal"}
                        onChange={() => setForm((f) => ({ ...f, shipping_method: "normal" }))}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <span className="ml-3 flex-1">
                        <span className="block text-sm font-medium text-gray-900">Normal Shipping</span>
                        <span className="block text-sm text-gray-600">5-7 business days</span>
                      </span>
                      <span className="text-sm font-semibold text-gray-900">Rs.350.00 PKR</span>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="shipping_method"
                        value="express"
                        checked={form.shipping_method === "express"}
                        onChange={() => setForm((f) => ({ ...f, shipping_method: "express" }))}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <span className="ml-3 flex-1">
                        <span className="block text-sm font-medium text-gray-900">Express Shipping</span>
                        <span className="block text-sm text-gray-600">2-4 business days</span>
                      </span>
                      <span className="text-sm font-semibold text-gray-900">Rs.500.00 PKR</span>
                    </label>
                  </div>
                </div>

                {/* Payment summary note: COD only */}
                <div className="bg-yellow-50 p-4 rounded border border-yellow-200 text-yellow-800 text-sm">
                  Payment will be collected on delivery (COD). No online payment required.
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Place Order (COD)
                  </button>
                  <Link
                    href="/"
                    className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              {items.length ? (
                <>
                  <div className="space-y-4">
                    {items.map((item) => {
                      const product = PRODUCTS[item.productId];
                      return (
                        <div key={item.key} className="flex items-start justify-between py-4 border-b border-gray-100">
                          <div className="flex-1 pr-4">
                            <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                            <div className="text-xs text-gray-600">Variant:</div>
                            <VariantSelector item={item} />
                            <div className="mt-2 flex items-center space-x-2">
                              <button
                                onClick={() => updateQty(item.key, item.qty - 1)}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                </svg>
                              </button>
                              <span className="w-12 text-center text-sm font-medium">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.key, item.qty + 1)}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                              </button>
                            </div>
                            <div className="mt-3">
                              <button
                                onClick={() => removeItem(item.key)}
                                className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-sm">
                              Rs.{(product.salePrice * item.qty).toLocaleString()} PKR
                            </p>
                            <p className="text-xs text-gray-500 line-through">
                              Rs.{product.regularPrice.toLocaleString()} PKR
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm text-gray-900">Rs.{subtotal.toLocaleString()} PKR</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Shipping</span>
                      <span className="text-sm text-gray-900 font-medium">Rs.{shippingCost.toLocaleString()}.00 PKR</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-red-600">Rs.{total.toLocaleString()} PKR</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Link
                      href="/"
                      className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      ← Continue Shopping
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                  </svg>
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link href="/" className="text-red-600 hover:text-red-700 inline-block font-medium">
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
