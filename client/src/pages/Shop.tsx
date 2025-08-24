import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import type { Product, ProductType } from "../../../shared/types/product"; 
import ShopFilter from "../components/ShopFilter";

type Mode = "all" | ProductType;

// Mock data shaped like real API responses
const mockProducts: Product[] = [
  {
    id: 1,
    name: "EcoTower Pro",
    price: 199.99,
    productType: "towers",
    creator: {
      id: "user1",
      name: "Matthew",
      profileImage: "https://via.placeholder.com/40x40",
    },
    imageUrl: "https://via.placeholder.com/600x400",
  },
  {
    id: 2,
    name: "Herb Module",
    price: 49.99,
    productType: "modules",
    creator: {
      id: "user2",
      name: "Grace",
      profileImage: "https://via.placeholder.com/40x40",
    },
    imageUrl: "https://via.placeholder.com/600x400",
  },
  {
    id: 3,
    name: "SunShield Add‑on",
    price: 29.0,
    productType: "addons",
    creator: {
      id: "user1",
      name: "Matthew",
      profileImage: "https://via.placeholder.com/40x40",
    },
    imageUrl: "https://via.placeholder.com/600x400",
  },
];

export default function Shop() {
  const [mode, setMode] = useState<Mode>("all");

  const products = useMemo(() => {
    if (mode === "all") return mockProducts;
    return mockProducts.filter((p) => p.productType === mode);
  }, [mode]);

  return (
    <div className="p-6 space-y-4">
      {/* Filter bar */}
      <ShopFilter mode={mode} onChange={setMode} />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
