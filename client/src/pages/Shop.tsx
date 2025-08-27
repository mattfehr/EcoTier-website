import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import ShopFilter from "../components/ShopFilter";
import ShopSort from "../components/ShopSort";
import type { Product, ProductType } from "../../../shared/types/product";

type Mode = "all" | ProductType;

export default function Shop() {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("all");
  const [sort, setSort] = useState<"new" | "price">("new");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());
  const [cartIds, setCartIds] = useState<Set<number>>(new Set());

  // ✅ Fetch products
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products?sort=${sort}&order=${order}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, [sort, order]);

  // ✅ Bulk fetch favorited product IDs (if logged in)
  useEffect(() => {
    if (!user) {
      setFavoritedIds(new Set());
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favorites/${user.id}/ids`
        );
        if (!res.ok) throw new Error("Failed to fetch favorite IDs");
        const ids: number[] = await res.json();
        setFavoritedIds(new Set(ids));
      } catch (err) {
        console.error("❌ Error loading favorite IDs:", err);
      }
    };

    fetchFavorites();
  }, [user]);

  // ✅ Bulk fetch cart product IDs (if logged in)
  useEffect(() => {
    if (!user) {
      setCartIds(new Set());
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/cart/${user.id}/ids`
        );
        if (!res.ok) throw new Error("Failed to fetch cart IDs");
        const ids: number[] = await res.json();
        setCartIds(new Set(ids));
      } catch (err) {
        console.error("❌ Error loading cart IDs:", err);
      }
    };

    fetchCart();
  }, [user]);

  // ✅ Apply filter client-side
  const filtered = useMemo(() => {
    return mode === "all"
      ? products
      : products.filter((p) => p.productType === mode);
  }, [products, mode]);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Shop Products</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Browse and filter modular tower components.
        </p>
      </div>

      {/* Filter + Sort */}
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

      {/* Results */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Loading products...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              {...p}
              isFavorited={favoritedIds.has(p.id)} // ✅ bulk preload favorites
              isInCart={cartIds.has(p.id)}        // ✅ bulk preload cart
            />
          ))}
        </div>
      )}
    </div>
  );
}
