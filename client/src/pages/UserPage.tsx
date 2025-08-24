// client/src/pages/UserPage.tsx
import { useParams, Link } from "react-router-dom";
import type { Product } from "../../../shared/types/product";
import ProductCard from "../components/ProductCard";

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

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return <div className="p-6">User not found.</div>;
  }

  const userProducts = mockProducts.filter((p) => p.creator.id === user.id);

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
        <button className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600">
          Follow +
        </button>
      </div>

      {/* Creations */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Creations</h2>
        {userProducts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No public creations yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {userProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
