// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import FeatureProduct from "../components/FeatureProduct";
import CompanyFeatures from "../components/CompanyFeatures";
import AeroponicInfo from "../components/AeroponicInfo";

type Product = {
  product_id: string;
  name: string;
  price: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const data = [
    {
      id: 1,
      imageUrl: "https://picsum.photos/1500/600"
    }, 
    {
      id: 2,
      imageUrl: "https://picsum.photos/1500/600"
    }, 
    {
      id: 3,
      imageUrl: "https://picsum.photos/1000/600"
    }
  ];

  const featuresData = [
  {
    title: "Varied Plants",
    description:
      "Longer definition on the company features",
  },
  {
    title: "Customization feature",
    description:
      "Longer definition on the company features",
  },
  {
    title: "Affordable price",
    description:
      "Longer definition on the company features",
  },
];

const infos = 
  {
    title: 'About Aeroponic',
    description: 'A brief intro to the aeroponic',
    imageUrls: [
      'https://picsum.photos/1000/600',
      'https://picsum.photos/1000/600'
    ],
  }
;


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
      <h1 className="text-4xl font-bold text-center mb-10">Welcome to EcoTier Solutions</h1>
      <div>
        <FeatureProduct data = {data}/>
      </div>
      <div>
        <CompanyFeatures features = {featuresData}/>
      </div>
      <div>
        <AeroponicInfo section = {infos}/>
      </div>
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
