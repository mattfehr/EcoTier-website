import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { slugify } from "../utils/slugify";
import type { UserPublicProfile } from "../../../shared/types/user";
import type { Product, ProductType } from "../../../shared/types/product";

import ProductCard from "../components/ProductCard";
import ShopFilter from "../components/ShopFilter";
import ShopSort from "../components/ShopSort";

type Mode = "all" | ProductType;

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, refreshUser } = useAuth();
  const [user, setUser] = useState<UserPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());

  const [mode, setMode] = useState<Mode>("all");
  const [sort, setSort] = useState<"new" | "price">("new");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // Editing state
  const isOwnProfile = currentUser?.id === user?.id;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", bio: "", profileImage: "" });

  // Fetch user profile
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");

        const data: UserPublicProfile = await res.json();
        setUser(data);
        setForm({
          username: data.username,
          bio: data.bio || "",
          profileImage: data.profileImage || "",
        });
      } catch (err) {
        console.error("❌ Error loading user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Check follow status
  useEffect(() => {
    if (!id || !currentUser) return;
    const checkFollowing = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${currentUser.id}/following`
        );
        const data = await res.json();
        const isFollowed = data.some((u: { id: string }) => u.id === id);
        setIsFollowing(isFollowed);
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };
    checkFollowing();
  }, [id, currentUser]);

  // Bulk fetch favorites
  useEffect(() => {
    if (!currentUser) {
      setFavoritedIds(new Set());
      return;
    }
    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favorites/${currentUser.id}/ids`
        );
        if (!res.ok) throw new Error("Failed to fetch favorite IDs");
        const ids: number[] = await res.json();
        setFavoritedIds(new Set(ids));
      } catch (err) {
        console.error("❌ Error loading favorite IDs:", err);
      }
    };
    fetchFavorites();
  }, [currentUser]);

  const handleFollowToggle = async () => {
    if (!id || !currentUser) return;
    const method = isFollowing ? "DELETE" : "POST";
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}/follow`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (!res.ok) throw new Error("Failed to follow/unfollow");
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  // Upload profile image to Supabase
  const uploadProfileImage = async (file: File) => {
    if (!currentUser) return;
    const path = `${currentUser.id}/profile/${Date.now()}-${slugify(file.name)}`;
    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) {
      console.error("Upload error:", error);
      return;
    }
    const { data: pub } = supabase.storage.from("images").getPublicUrl(path);
    if (pub?.publicUrl) {
      setForm((f) => ({ ...f, profileImage: pub.publicUrl }));
    }
  };

  const handleSave = async () => {
    if (!user || !currentUser) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          username: form.username,
          bio: form.bio,
          profileImage: form.profileImage,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setUser(updated);
      setEditing(false);

      await refreshUser(); // refresh AuthContext so header updates
    } catch (err) {
      console.error("❌ Error updating profile:", err);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!user) return [];
    let filtered =
      mode === "all"
        ? user.products || []
        : (user.products || []).filter((p) => p.productType === mode);
    if (sort === "price") {
      filtered = [...filtered].sort((a, b) =>
        order === "asc" ? a.price - b.price : b.price - a.price
      );
    } else {
      filtered = [...filtered].sort((a, b) =>
        order === "asc" ? a.productID - b.productID : b.productID - a.productID
      );
    }
    return filtered;
  }, [user, mode, sort, order]);

  if (loading) return <div className="p-6">Loading user data...</div>;
  if (!user) return <div className="p-6">User not found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {editing ? (
            <div>
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && uploadProfileImage(e.target.files[0])}
                className="sr-only"
              />
              <label
                htmlFor="profile-image-input"
                className="inline-block cursor-pointer rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
              >
                Choose Profile Image
              </label>
              {form.profileImage && (
                <img
                  src={form.profileImage}
                  alt="preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover"
                />
              )}
            </div>
          ) : (
            <img
              src={user.profileImage}
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover"
            />
          )}

          <div>
            {editing ? (
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="border rounded p-1 text-lg font-bold"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.username}
              </h1>
            )}

            {editing ? (
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="border rounded p-1 mt-1 w-full"
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
            )}
          </div>
        </div>

        {isOwnProfile ? (
          editing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Edit Profile
            </button>
          )
        ) : (
          <button
            onClick={handleFollowToggle}
            className={`px-4 py-2 rounded-xl text-white transition ${
              isFollowing
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow +"}
          </button>
        )}
      </div>

      {/* Creations */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Creations</h2>
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
        <div className="mt-4">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No public creations match this filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.productID}
                  {...p}
                  isFavorited={favoritedIds.has(p.productID)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
