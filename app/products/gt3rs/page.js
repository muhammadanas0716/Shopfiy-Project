"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../../components/CartContext";
import { PRODUCTS } from "../../../lib/catalog";

export default function GT3RSPage() {
  const product = PRODUCTS.gt3rs;
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "1");
  const [qty, setQty] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-red-600">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <span className="text-red-600">GT3 RS Spoiler Shelf</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: 650 }}>
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                  Sale
                </span>
              </div>
            </div>
            <div className="p-10 flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sans-font tracking-tight">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-gray-500 line-through text-xl">Rs.{product.regularPrice.toLocaleString()} PKR</span>
                <span className="text-red-600 font-bold text-3xl">Rs.{product.salePrice.toLocaleString()} PKR</span>
              </div>

              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-lg text-gray-700 mb-6">
                  Introducing GT3RS Style SPOILER SHELF — racecar-inspired shelf blending aggressive design with function. Handcrafted with premium wood and coated metal for durable, smooth use.
                </p>
                <p className="text-xl font-semibold text-gray-900 mb-6">
                  Where form meets function and style meets speed.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Variant</h3>
                <div className="space-y-3">
                  {product.variants.map((v) => (
                    <label key={v.id} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="variant"
                        value={v.id}
                        checked={variantId === v.id}
                        onChange={() => setVariantId(v.id)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-gray-700">{v.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 sans-font">Specifications</h3>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <strong>Material & Size:</strong> Top Wood, Acrylic side wings and Steel brackets; 40inch*8inch*0.75inch
                  </div>
                  <div>
                    <strong>Country of Origin:</strong> 100% Made in Pakistan (Proudly)
                  </div>
                  <div>
                    <strong>Included:</strong> Wood Panel + Steel Mounts + Side acrylic wings + Hardware + Instruction Manual
                  </div>
                  <div>
                    <strong>Shipping:</strong> Delivers in 7-10 business days
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => addItem(product.id, variantId, qty)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded text-lg transition-colors duration-300"
                >
                  Add to Cart
                </button>
                <Link
                  href="/checkout"
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded text-lg transition-colors duration-300 text-center"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
