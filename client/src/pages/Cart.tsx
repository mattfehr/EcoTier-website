// src/pages/Cart.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartProductCard from "../components/CartProductCard";
import type { Product } from "../../../shared/types/product";

type CartItem = Product & { quantity: number };

export default function Cart() {
  const { user } = useAuth();
  const { setCartCount } = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch cart items
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${user.id}`);
        if (res.ok) {
          const data: CartItem[] = await res.json();
          setItems(data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // ✅ Update quantity
  const handleQuantityChange = (productID: number, newQuantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === productID ? { ...i, quantity: newQuantity } : i))
    );
  };

  // ✅ Remove item
  const handleRemove = (productID: number) => {
    setItems((prev) => prev.filter((i) => i.id !== productID));
    setCartCount((prev) => Math.max(0, prev - 1));
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (loading) {
    return <div className="p-6">Loading cart...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <p className="mt-2 text-gray-600">
          Review your selected items and proceed to checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 1: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <CartProductCard
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>

        {/* Section 2 + 3: Receipt + Order Form */}
        <div className="space-y-6">
          {/* Receipt */}
          <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-900">
            <h2 className="font-bold text-lg mb-3">Receipt</h2>
            <ul className="space-y-2">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between">
                  <span>
                    {i.quantity} × {i.name}
                  </span>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <hr className="my-3" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="p-4 border rounded-xl bg-white dark:bg-gray-800 shadow-sm space-y-4">
            <h2 className="font-bold text-lg">Checkout</h2>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Shipping Address"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Card Number"
              className="w-full border p-2 rounded"
            />
            <button className="w-full py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
