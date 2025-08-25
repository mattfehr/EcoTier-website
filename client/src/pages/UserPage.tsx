import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { UserPublicProfile } from "../../../shared/types/user";
import type { Product, ProductType } from "../../../shared/types/product";

import ProductCard from "../components/ProductCard";
import ShopFilter from "../components/ShopFilter";

type Mode = "all" | ProductType;

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false); // optional feature
  const [mode, setMode] = useState<Mode>("all");

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");

        const data: UserPublicProfile = await res.json();
        setUser(data);
      } catch (err) {
        console.error("❌ Error loading user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const filteredProducts = useMemo(() => {
    if (!user) return [];
    if (mode === "all") return user.products || [];
    return (user.products || []).filter((p) => p.productType === mode);
  }, [mode, user]);

  if (loading) return <div className="p-6">Loading user data...</div>;
  if (!user) return <div className="p-6">User not found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={user.profileImage}
            alt={user.username}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.username}
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

        <ShopFilter mode={mode} onChange={setMode} />

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
