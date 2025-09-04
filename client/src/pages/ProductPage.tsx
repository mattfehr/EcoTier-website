import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import type { Product } from "../../../shared/types/product";
import { routes } from "../utils/routes";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
// ✅ import ModelViewer
import ModelViewer from "../components/ModelViewer";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [inCart, setInCart] = useState(false);
  const { user } = useAuth();
  const { setCartCount } = useCart();

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Product = await res.json();
        setProduct(data);

        if (user) {
          // preload favorite
          const favRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/favorites/${user.id}/contains/${data.productID}`
          );
          if (favRes.ok) {
            const { favorited } = await favRes.json();
            setIsFavorited(favorited);
          }

          // preload cart
          const cartRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/cart/${user.id}/contains/${data.productID}`
          );
          if (cartRes.ok) {
            const { inCart, quantity } = await cartRes.json();
            setInCart(inCart);
            if (quantity) setQuantity(quantity);
          }
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user || !product) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: user.id, productID: product.productID }),
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
    if (!user || !product) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.id,
          productID: product.productID,
          quantity,
        }),
      });

      if (!res.ok) throw new Error("Failed to toggle cart");
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

  if (loading) {
    return <div className="p-6 text-gray-600 dark:text-gray-300">Loading product...</div>;
  }

  if (error || !product) {
    return <div className="p-6 text-red-500">Product not found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Image */}
      <img
        src={product.imageURL || "/placeholder.png"}
        alt={product.name}
        className="w-full h-80 object-cover rounded-xl shadow-md"
      />

      {/* ✅ 3D Model Preview */}
      {product.modelURL && product.modelFileType && (
        <section>
          <h2 className="text-xl font-semibold mb-2">3D Preview</h2>
          <ModelViewer
            url={product.modelURL}
            fileType={product.modelFileType as "STL" | "OBJ" | "3MF" | "STEP"}
            height={420}
          />
        </section>
      )}

      {/* Core info */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {product.name}
        </h1>

        {/* Creator */}
        {product.creator && (
          <Link
            to={routes.user(product.creator.id)}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <img
              src={product.creator.profileImage || "/default-avatar.png"}
              alt={product.creator.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="text-gray-700 dark:text-gray-300">
              {product.creator.username}
            </p>
          </Link>
        )}

        {/* Price + Quantity */}
        <div className="flex items-center gap-6">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </p>

          <div className="flex items-center border rounded-xl overflow-hidden">
            <button
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus size={18} />
            </button>
            <span className="px-4">{quantity}</span>
            <button
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={toggleCart}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white transition ${
              inCart ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <ShoppingCart size={20} />
            {inCart ? "Remove" : "Add to Cart"}
          </button>

          <button
            onClick={toggleFavorite}
            className="p-3 rounded-xl border hover:bg-gray-100 dark:hover:bg-gray-700 transition transform hover:scale-110"
          >
            <Heart
              size={22}
              className={`transition-colors duration-200 ${
                isFavorited
                  ? "text-red-500 fill-red-500"
                  : "text-gray-500 hover:text-red-500 hover:fill-red-500"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Description */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {product.description || "No description available."}
        </p>
      </section>

      {/* Comments placeholder */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {/* ... */}
      </section>
    </div>
  );
}
