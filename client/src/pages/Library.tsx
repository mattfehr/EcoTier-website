// client/src/pages/Library.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../shared/types/product";
import LibraryCard from "../components/LibraryCard";

export default function Library() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchLibrary = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/library/${user.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch library");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("❌ Error fetching library:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [user]);

  const handleEdit = (productID: number) => {
    navigate(`/editor/${productID}`);
  };

  const handleDelete = async (productID: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${productID}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p.productID !== productID));
    } catch (err) {
      console.error("❌ Error deleting product:", err);
    }
  };

  const handleCreate = () => {
    navigate("/editor/new"); // 👈 new product editor
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        Please log in to view your library.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with New Product button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Library</h1>
          <p className="mt-2 text-gray-600">
            Manage your saved designs and creations.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
        >
          + New Product
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-gray-500">Loading your creations...</p>
      ) : products.length === 0 ? (
        <p className="mt-6 text-gray-500">You don’t have any creations yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <LibraryCard
              key={p.productID}
              product={p}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
