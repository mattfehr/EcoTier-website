import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../../shared/types/product";
import { routes } from "../utils/routes";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

type ProductCardProps = Product & {
  isFavorited?: boolean;
  isInCart?: boolean;
};

export default function ProductCard({
  productID,
  name,
  price,
  creator,
  imageURL,
  productType,
  isFavorited: initialFavorited,
  isInCart: initialInCart,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(initialFavorited ?? false);
  const [inCart, setInCart] = useState(initialInCart ?? false);
  const { user } = useAuth();
  const { setCartCount } = useCart();

  useEffect(() => {
    if (!user) return;

    if (initialFavorited === undefined) {
      const checkFavorite = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/favorites/${user.id}/contains/${productID}`
          );
          if (res.ok) {
            const { favorited } = await res.json();
            setIsFavorited(favorited);
          }
        } catch (err) {
          console.error("❌ Error checking favorite:", err);
        }
      };
      checkFavorite();
    }

    if (initialInCart === undefined) {
      const checkCart = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/cart/${user.id}/contains/${productID}`
          );
          if (res.ok) {
            const { inCart, quantity } = await res.json();
            setInCart(inCart);
            if (quantity) setQuantity(quantity);
          }
        } catch (err) {
          console.error("❌ Error checking cart:", err);
        }
      };
      checkCart();
    }
  }, [user, productID, initialFavorited, initialInCart]);

  const toggleFavorite = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: user.id, productID }),
        }
      );

      if (!res.ok) throw new Error("Failed to toggle favorite");

      const data = await res.json();
      setIsFavorited(data.favorited);
    } catch (err) {
      console.error("❌ Error toggling favorite:", err);
    }
  };

  const toggleCart = async () => {
    if (!user) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.id,
          productID,
          quantity,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to toggle cart: ${text}`);
      }

      const data = await res.json();
      setInCart(data.inCart);
      setQuantity(data.quantity || 1);

      setCartCount((prev) =>
        data.inCart ? prev + 1 : Math.max(0, prev - 1)
      );
    } catch (err) {
      console.error("❌ Error toggling cart:", err);
    }
  };

  return (
    <div className="rounded-2xl shadow-md bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition">
      <Link to={routes.product(productID)}>
        <img
          src={imageURL || "/placeholder.png"}
          alt={name}
          className="w-full h-48 object-cover hover:opacity-90 transition"
        />
      </Link>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          <Link to={routes.product(productID)} className="hover:underline">
            {name}
          </Link>
        </h3>

        {creator && (
          <Link
            to={routes.user(creator.id)}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <img
              src={creator.profileImage || "/default-avatar.png"}
              alt={creator.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {creator.username}
            </p>
          </Link>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </p>
          <div className="flex items-center border rounded-xl overflow-hidden">
            <button
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-3 select-none">{quantity}</span>
            <button
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="flex justify-between mt-2">
          <button
            onClick={toggleCart}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-white transition ${
              inCart
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <ShoppingCart size={18} />
            {inCart ? "Remove" : "Add"}
          </button>

          <button
            onClick={toggleFavorite}
            className="p-2 rounded-xl border hover:bg-gray-100 dark:hover:bg-gray-700 transition transform hover:scale-110"
            aria-label="Toggle favorite"
          >
            <Heart
              size={18}
              className={`transition-colors duration-200 ${
                isFavorited
                  ? "text-red-500 fill-red-500"
                  : "text-gray-500 hover:text-red-500 hover:fill-red-500"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
