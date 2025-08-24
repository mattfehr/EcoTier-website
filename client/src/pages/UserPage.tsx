import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import type { Product, ProductType } from "../../../shared/types/product";
import ProductCard from "../components/ProductCard";
import ShopFilter from "../components/ShopFilter";

// Mock data — later fetch from backend
const mockUsers = [
  {
    id: "user1",
    name: "Matthew",
    profileImage: "https://via.placeholder.com/100",
    bio: "Engineer & indoor farming enthusiast.",
  },
  {
    id: "user2",
    name: "Grace",
    profileImage: "https://via.placeholder.com/100",
    bio: "Designer and hydroponics innovator.",
  },
];

// Mock products belonging to users
const mockProducts: Product[] = [
  {
    id: 1,
    name: "EcoTower Pro",
    price: 199.99,
    productType: "towers",
    creator: {
      id: "user1",
      name: "Matthew",
      profileImage: "https://via.placeholder.com/40",
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
      profileImage: "https://via.placeholder.com/40",
    },
    imageUrl: "https://via.placeholder.com/600x400",
  },
  {
    id: 3,
    name: "SunShield Add-on",
    price: 29.0,
    productType: "addons",
    creator: {
      id: "user1",
      name: "Matthew",
      profileImage: "https://via.placeholder.com/40",
    },
    imageUrl: "https://via.placeholder.com/600x400",
  },
];

type Mode = "all" | ProductType;

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const user = mockUsers.find((u) => u.id === id);

  const [isFollowing, setIsFollowing] = useState(false);
  const [mode, setMode] = useState<Mode>("all");

  if (!user) {
    return <div className="p-6">User not found.</div>;
  }

  // Products belonging to this user
  const userProducts = mockProducts.filter((p) => p.creator.id === user.id);

  // Apply filter
  const filteredProducts = useMemo(() => {
    if (mode === "all") return userProducts;
    return userProducts.filter((p) => p.productType === mode);
  }, [mode, userProducts]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
          </div>
        </div>

        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-4 py-2 rounded-xl text-white transition ${
            isFollowing
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isFollowing ? "Unfollow" : "Follow +"}
        </button>
      </div>

      {/* Divider with section title */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Creations</h2>

        {/* Filter */}
        <ShopFilter mode={mode} onChange={setMode} />

        {/* Grid */}
        <div className="mt-4">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No public creations match this filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
