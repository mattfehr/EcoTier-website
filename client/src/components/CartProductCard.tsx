import { Plus, Minus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { routes } from "../utils/routes";
import type { Product } from "../../../shared/types/product";

type CartItem = Product & { quantity: number };

type Props = {
  item: CartItem;
  onQuantityChange: (productID: number, newQuantity: number) => void;
  onRemove: (productID: number) => void;
};

export default function CartProductCard({ item, onQuantityChange, onRemove }: Props) {
  const { user } = useAuth();
  const { setCartCount } = useCart();
  const navigate = useNavigate();

  const updateQuantity = async (delta: number) => {
    if (!user) return;
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) return; // don’t send 0 from the minus button

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.id,
          productID: item.productID,
          quantity: newQuantity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (!data.inCart) {
          onRemove(item.productID);
          setCartCount((prev) => Math.max(0, prev - 1));
        } else {
          onQuantityChange(item.productID, data.quantity);
        }
      }
    } catch (err) {
      console.error("❌ Error updating cart item:", err);
    }
  };

  const removeItem = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.id,
          productID: item.productID,
          quantity: 0,
        }),
      });

      if (res.ok) {
        onRemove(item.productID);
      }
    } catch (err) {
      console.error("❌ Error removing cart item:", err);
    }
  };

  return (
    <div
      className="flex items-center justify-between p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition cursor-pointer"
      onClick={() => navigate(routes.product(item.productID))}
    >
      <div className="flex items-center gap-4">
        <img
          src={item.imageURL || "/placeholder.png"}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-gray-600">${item.price.toFixed(2)}</p>
        </div>
      </div>

      {/* Quantity controls */}
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()} // prevent navigation
      >
        <button
          onClick={() => updateQuantity(-1)}
          disabled={item.quantity <= 1} // 🔹 disable minus at 1
          className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <Minus size={16} />
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(1)}
          className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeItem();
        }}
        className="ml-4 text-red-500 hover:text-red-700"
      >
        <X size={20} />
      </button>
    </div>
  );
}
