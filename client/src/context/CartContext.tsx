// src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import type { Product } from "../../../shared/types/product";

export type CartItem = Product & { quantity: number };

type CartContextType = {
  cartItems: CartItem[]; // full cart items with product details
  cartCount: number;
  addToCart: (productID: number, quantity?: number) => Promise<void>;
  removeFromCart: (productID: number) => Promise<void>;
  updateQuantity: (productID: number, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartCount = cartItems.length;

  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${user.id}`);
      if (res.ok) {
        const items: CartItem[] = await res.json();
        setCartItems(items);
      }
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (productID: number, quantity = 1) => {
    if (!user) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.id, productID, quantity }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      await refreshCart(); // reload full cart
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
    }
  };

  const updateQuantity = async (productID: number, quantity: number) => {
    if (!user) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.id, productID, quantity }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");
      await refreshCart();
    } catch (err) {
      console.error("❌ Error updating cart:", err);
    }
  };

  const removeFromCart = async (productID: number) => {
    if (!user) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.id, productID, quantity: 0 }),
      });
      if (!res.ok) throw new Error("Failed to remove from cart");
      await refreshCart();
    } catch (err) {
      console.error("❌ Error removing from cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, removeFromCart, updateQuantity, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
