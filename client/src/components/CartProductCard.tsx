import { Plus, Minus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { routes } from "../utils/routes";
import type { Product } from "../../../shared/types/product";

type CartItem = Product & { quantity: number };

type Props = {
  item: CartItem;
};

export default function CartProductCard({ item }: Props) {
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // ✅ Pull latest quantity from context
  const liveItem = cartItems.find((i) => i.productID === item.productID);
  const quantity = liveItem?.quantity ?? item.quantity;

  const handleUpdateQuantity = async (delta: number) => {
    if (!user) return;
    const newQuantity = quantity + delta;
    if (newQuantity < 1) return; // don’t send 0 from minus button
    await updateQuantity(item.productID, newQuantity);
  };

  const handleRemove = async () => {
    if (!user) return;
    await removeFromCart(item.productID);
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
          onClick={() => handleUpdateQuantity(-1)}
          disabled={quantity <= 1}
          className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <Minus size={16} />
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => handleUpdateQuantity(1)}
          className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemove();
        }}
        className="ml-4 text-red-500 hover:text-red-700"
      >
        <X size={20} />
      </button>
    </div>
  );
}
