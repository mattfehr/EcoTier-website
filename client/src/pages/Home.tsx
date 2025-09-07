// src/pages/Home.tsx
import { useEffect, useState } from "react";
import FeatureProduct from "../components/FeatureProduct";
import CompanyFeatures from "../components/CompanyFeatures";
import AeroponicInfo from "../components/AeroponicInfo";
import AeroponicDiagram from "../assets/aeroponicsdiagram.jpg";
import Aeroponics from "../assets/aeroponics.jpg";

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
      description: "Grow leafy greens, herbs, and even fruits with a single system.",
    },
    {
      title: "Customization",
      description: "Mix towers, modules, and add-ons to design your perfect setup.",
    },
    {
      title: "Affordable price",
      description: "Eco-friendly food production at a fraction of the cost.",
    },
  ];

  const infos = {
    title: "About Aeroponic Vertical Farming",
    description:
      "Aeroponics is a method of growing plants without soil, where roots are suspended in the air and misted with a nutrient-rich solution. This technique uses up to 90% less water than traditional farming, speeds up plant growth, and allows for dense, vertical systems that are perfect for urban or indoor environments.",
    imageUrls: [
      AeroponicDiagram,
      Aeroponics,
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
    </div>
  );
}
