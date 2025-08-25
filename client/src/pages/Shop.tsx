import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import type { Product, ProductType } from "../../../shared/types/product";
import ShopFilter from "../components/ShopFilter";

type Mode = "all" | ProductType;

export default function Shop() {
  const [mode, setMode] = useState<Mode>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = mode === "all"
    ? products
    : products.filter((p) => p.productType === mode);

  return (
    <div className="p-6 space-y-4">
      <ShopFilter mode={mode} onChange={setMode} />

      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Loading products...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </div>
  );
}
