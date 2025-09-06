// src/pages/Home.tsx
import { useEffect, useState } from "react";
import FeatureProduct from "../components/FeatureProduct";
import CompanyFeatures from "../components/CompanyFeatures";
import AeroponicInfo from "../components/AeroponicInfo";

type Product = {
  productID: number;
  name: string;
  price: number;
  imageURL?: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const featuresData = [
    {
      title: "Varied Plants",
      description: "Longer definition on the company features",
    },
    {
      title: "Customization feature",
      description: "Longer definition on the company features",
    },
    {
      title: "Affordable price",
      description: "Longer definition on the company features",
    },
  ];

  const infos = {
    title: "About Aeroponic",
    description: "A brief intro to the aeroponic",
    imageUrls: [
      "https://picsum.photos/1000/600",
      "https://picsum.photos/1000/600",
    ],
  };

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products?sort=new&order=desc`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Product[] = await res.json();
        setProducts(data.slice(0, 5)); // only take first 5 for featured
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        Welcome to EcoTier Solutions
      </h1>

      <div>
        {/* ✅ pass backend products to FeatureProduct */}
        <FeatureProduct products={products} loading={loading} />
      </div>

      <div>
        <CompanyFeatures features={featuresData} />
      </div>
      <div>
        <AeroponicInfo section={infos} />
      </div>

      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p.productID}
            className="border p-3 rounded shadow-sm flex justify-between"
          >
            <span>{p.name}</span>
            <span className="font-semibold text-green-600">
              ${p.price.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
