// src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

type CartContextType = {
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Load cart count on login
  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }

    const fetchCartCount = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/cart/${user.id}/ids`
        );
        if (res.ok) {
          const ids: number[] = await res.json();
          setCartCount(ids.length);
        }
      } catch (err) {
        console.error("❌ Error fetching cart count:", err);
      }
    };

    fetchCartCount();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
