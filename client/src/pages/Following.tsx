import { useEffect, useState } from "react";
import type { FollowerMinimal } from "../../../shared/types/user";
import { Link } from "react-router-dom";

export default function Following() {
  const [following, setFollowing] = useState<FollowerMinimal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/following`);
        if (!res.ok) throw new Error("Failed to fetch following");

        const data: FollowerMinimal[] = await res.json();
        setFollowing(data);
      } catch (err) {
        console.error("❌ Error loading following list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Following</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        See the profiles of creators you follow.
      </p>

      <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-700 border rounded-md">
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : following.length === 0 ? (
          <p className="p-4 text-gray-500">You’re not following anyone yet.</p>
        ) : (
          following.map((user) => (
            <Link
              to={`/users/${user.id}`}
              key={user.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <img
                src={user.profileImage ?? "https://via.placeholder.com/40"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-900 dark:text-white font-medium">{user.username}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
