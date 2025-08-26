import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../../shared/types/product";
import { routes } from "../utils/routes";
import { useAuth } from "../context/AuthContext";

type ProductCardProps = Product & {
  isFavorited?: boolean; // ✅ new optional prop
};

export default function ProductCard({
  id,
  name,
  price,
  creator,
  imageUrl,
  productType,
  isFavorited: initialFavorited, // ✅ from parent if available
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(initialFavorited ?? false);
  const { user } = useAuth();

  // ✅ Only preload if parent didn’t provide a value
  useEffect(() => {
    if (initialFavorited !== undefined) return;
    if (!user) return;

    const checkFavorite = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favorites/${user.id}/contains/${id}`
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
  }, [user, id, initialFavorited]);

  // ✅ Toggle favorite
  const toggleFavorite = async () => {
    if (!user) {
      console.warn("User must be logged in to favorite");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: user.id, productID: id }),
        }
      );

      if (!res.ok) throw new Error("Failed to toggle favorite");

      const data = await res.json();
      setIsFavorited(data.favorited);
    } catch (err) {
      console.error("❌ Error toggling favorite:", err);
    }
  };

  return (
    <div className="rounded-2xl shadow-md bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition">
      {/* Product Image */}
      <Link to={routes.product(id)}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover hover:opacity-90 transition"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          <Link to={routes.product(id)} className="hover:underline">
            {name}
          </Link>
        </h3>

        {/* Creator Info */}
        <Link
          to={routes.user(creator.id)}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img
            src={creator.profileImage}
            alt={creator.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {creator.name}
          </p>
        </Link>

        {/* Price + Quantity */}
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

        {/* Actions */}
        <div className="flex justify-between mt-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600">
            <ShoppingCart size={18} /> Add
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
