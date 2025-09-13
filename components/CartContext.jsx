"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "../lib/catalog";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ key, productId, variantId, qty }]

  // Load/save cart to localStorage to persist across reloads.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("spoilershelf_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("spoilershelf_cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (productId, variantId, qty = 1) => {
    setItems((prev) => {
      const key = `${productId}:${variantId}`;
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { key, productId, variantId, qty }];
    });
  };

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const updateQty = (key, qty) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)));
  const changeVariant = (oldKey, newVariantId) =>
    setItems((prev) => {
      const found = prev.find((i) => i.key === oldKey);
      if (!found) return prev;
      const newKey = `${found.productId}:${newVariantId}`;
      const merged = prev.filter((i) => i.key !== oldKey);
      const existing = merged.find((i) => i.key === newKey);
      if (existing) {
        return merged.map((i) => (i.key === newKey ? { ...i, qty: i.qty + found.qty } : i));
      }
      return [...merged, { ...found, key: newKey, variantId: newVariantId }];
    });

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = PRODUCTS[item.productId];
      if (!product) return sum;
      return sum + product.salePrice * item.qty;
    }, 0);
  }, [items]);

  const value = {
    items,
    addItem,
    removeItem,
    updateQty,
    changeVariant,
    clear: () => setItems([]),
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
