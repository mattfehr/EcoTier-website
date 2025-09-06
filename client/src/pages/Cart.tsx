// src/pages/Cart.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartProductCard from "../components/CartProductCard";

export default function Cart() {
  const { user } = useAuth();
  const { cartItems, refreshCart } = useCart();
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const placeOrder = async () => {
    if (!user) return;
    if (!fullName || !address) {
      alert("Please enter your full name and address.");
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.id, fullName, address }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const data = await res.json();
      console.log("✅ Order placed:", data);

      await refreshCart(); // clear cart after order
      setFullName("");
      setAddress("");
      alert("Order placed successfully!");
    } catch (err) {
      console.error("❌ Error placing order:", err);
      alert("Failed to place order.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <p className="mt-2 text-gray-600">
          Review your selected items and proceed to checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => <CartProductCard key={item.productID} item={item} />)
          )}
        </div>

        {/* Receipt + Checkout */}
        <div className="space-y-6">
          <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-900">
            <h2 className="font-bold text-lg mb-3">Receipt</h2>
            <ul className="space-y-2">
              {cartItems.map((i) => (
                <li key={i.productID} className="flex justify-between">
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

          <div className="p-4 border rounded-xl bg-white dark:bg-gray-800 shadow-sm space-y-4">
            <h2 className="font-bold text-lg">Checkout</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Shipping Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Card Number"
              className="w-full border p-2 rounded"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-1/2 border p-2 rounded"
              />
              <input
                type="text"
                placeholder="CVC"
                className="w-1/2 border p-2 rounded"
              />
            </div>

            <button
              onClick={placeOrder}
              disabled={placing || cartItems.length === 0}
              className="w-full py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-50"
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
