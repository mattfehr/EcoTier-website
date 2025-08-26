import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../../../shared/types/product";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favorites/${user.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data: Product[] = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("❌ Error loading favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Favorites</h1>
      <p className="mt-2 text-gray-600">
        Your favorite modules and tower builds will appear here.
      </p>

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading favorites...</p>
        ) : !user ? (
          <p className="text-gray-500">Please log in to see your favorites.</p>
        ) : favorites.length === 0 ? (
          <p className="text-gray-500">No favorites yet. ❤️</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
