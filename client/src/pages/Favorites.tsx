import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import type { Product, ProductType } from "../../../shared/types/product";
import ProductCard from "../components/ProductCard";
import ShopFilter from "../components/ShopFilter";
import ShopSort from "../components/ShopSort";

type Mode = "all" | ProductType;

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mode, setMode] = useState<Mode>("all");
  const [sort, setSort] = useState<"new" | "price">("new");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favorites/${user.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data: Product[] = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("❌ Error loading favorites:", err);
        setError("Unable to load favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // Filter + sort client-side
  const filtered = useMemo(() => {
    let list =
      mode === "all" ? favorites : favorites.filter((p) => p.productType === mode);

    if (sort === "price") {
      list = [...list].sort((a, b) =>
        order === "asc" ? a.price - b.price : b.price - a.price
      );
    } else {
      // "new" — use productID as proxy for recency
      list = [...list].sort((a, b) =>
        order === "asc" ? a.productID - b.productID : b.productID - a.productID
      );
    }
    return list;
  }, [favorites, mode, sort, order]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Favorites</h1>
        <p className="mt-2 text-gray-600">
          Your favorite modules and tower builds will appear here.
        </p>
      </div>

      {user && favorites.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <ShopFilter mode={mode} onChange={setMode} />
          <ShopSort
            sort={sort}
            order={order}
            onChange={(s, o) => {
              setSort(s);
              setOrder(o);
            }}
          />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading favorites...</p>
        ) : !user ? (
          <p className="text-gray-500">Please log in to see your favorites.</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No favorites yet. ❤️</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.productID} {...p} isFavorited={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
