import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingCart, Minus, Plus, Star } from "lucide-react";
import type { Product } from "../../../shared/types/product";
import { routes } from "../utils/routes";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ModelViewer from "../components/ModelViewer";
import CommentCard from "../components/CommentCard";

// Types for comments
interface Comment {
  id: string;
  userID: string;
  username: string;
  profileImage?: string;
  content: string;
  postTime: string;
  rating: number;
}

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

  // Comments + ratings state
  const [comments, setComments] = useState<Comment[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState<number>(5);

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

        // fetch comments
        const commentsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/comments/${data.productID}`
        );
        if (commentsRes.ok) {
          const c: Comment[] = await commentsRes.json();
          setComments(c);

          // ⭐ compute average rating from comments (ignore nulls)
          const ratings = c.map((x) => x.rating).filter((r): r is number => r != null);
          if (ratings.length > 0) {
            const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
            setAverageRating(avg);
            setReviewCount(ratings.length);
          } else {
            setAverageRating(null);
            setReviewCount(0);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.id, productID: product.productID }),
      });
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
      setCartCount((prev) => (data.inCart ? prev + 1 : Math.max(0, prev - 1)));
    } catch (err) {
      console.error("❌ Error toggling cart:", err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product || !newComment.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.id,
          productID: product.productID,
          content: newComment,
          rating: newRating,
        }),
      });
      if (res.ok) {
        const added: Comment = await res.json();
        setComments((prev) => [added, ...prev]);
        setNewComment("");
        setNewRating(5);
      }
    } catch (err) {
      console.error("❌ Error posting comment:", err);
    }
  };

  const handleUpdateComment = async (id: string, content: string, rating: number) => {
    if (!user) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.id, content, rating }),
      });
      if (res.ok) {
        const updated: Comment = await res.json();
        setComments((prev) => prev.map((c) => (c.id === id ? updated : c)));
      }
    } catch (err) {
      console.error("❌ Error updating comment:", err);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("❌ Error deleting comment:", err);
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

        {/* ⭐ Average rating */}
        {reviewCount > 0 ? (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    averageRating && i <= Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {averageRating?.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No reviews yet</p>
        )}

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

      {/* Comments */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {user && (
          <form onSubmit={handleSubmitComment} className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2">
              {/* ⭐ Rating picker for new comment */}
              <div className="flex">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setNewRating(r)}
                    className="focus:outline-none"
                    aria-label={`Set rating ${r}`}
                  >
                    <Star
                      size={20}
                      className={
                        r <= newRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500">Your rating</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              <button
                type="submit"
                className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}
          {comments.map((c) => (
            <CommentCard
              key={c.id}
              id={c.id}
              userID={c.userID}
              username={c.username}
              profileImage={c.profileImage}
              content={c.content}
              postTime={c.postTime}
              rating={c.rating}
              currentUserID={user?.id}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
