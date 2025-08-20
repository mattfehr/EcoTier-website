// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Product = {
  product_id: string;
  name: string;
  price: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("product_id, name, price")
        .limit(5);

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to EcoTier Solutions</h1>
      {loading && <p>Loading products...</p>}
      {!loading && products.length === 0 && <p>No products found.</p>}
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.product_id} className="border p-3 rounded shadow-sm flex justify-between">
            <span>{p.name}</span>
            <span className="font-semibold text-green-600">${p.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
