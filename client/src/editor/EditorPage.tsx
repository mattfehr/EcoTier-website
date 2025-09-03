import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { routes } from "../utils/routes";
import type { Product, ProductType } from "../../../shared/types/product";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { slugify } from "../utils/slugify";
import ModelUploader from "../components/ModelUploader";
import ModelViewer from "../components/ModelViewer";

export default function EditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const { user } = useAuth();

  const [form, setForm] = useState<{
    name?: string;
    price?: number;
    productType?: ProductType;
    public?: boolean;
    description?: string;
    imageURL?: string;
    PIN?: string;
    modelURL?: string;
    modelFileType?: string;
    modelFilename?: string;
  }>({
    name: "",
    price: 0,
    productType: "modules",
    public: false,
    description: "",
    imageURL: "",
  });

  const [loading, setLoading] = useState(!isNew);

  // Load existing product if editing
  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${id}?userID=${
            user?.id ?? ""
          }`
        );
        if (!res.ok) throw new Error("Failed to load product");
        const p: Product = await res.json();

        setForm({
          name: p.name,
          price: p.price,
          productType: p.productType,
          description: p.description,
          imageURL: p.imageURL,
          modelURL: (p as any).modelURL, // new fields not in shared type yet
          modelFileType: (p as any).modelFileType,
          modelFilename: (p as any).modelFilename,
          public: p.public,
          PIN: p.PIN,
        });
      } catch (e) {
        console.error(e);
        alert("Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew, user?.id]);

 // Upload helper for images
  const uploadImage = async (file: File) => {
    if (!user) return;

    const path = `${user.id}/images/${Date.now()}-${slugify(file.name)}`;
    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) throw error;

    const { data: pub } = supabase.storage.from("images").getPublicUrl(path);
    setForm((f) => ({ ...f, imageURL: pub?.publicUrl }));
  };

  // --- Save ---
  const saveNew = async () => {
    if (!user) {
      alert("You must be logged in to create a product.");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userID: user.id }),
      });
      if (!res.ok) throw new Error("Create failed");
      const created: Product = await res.json();
      navigate(routes.editor(created.productID));
    } catch (e) {
      console.error(e);
      alert("Could not create product.");
    }
  };

  const saveExisting = async () => {
    if (!user) {
      alert("You must be logged in to save.");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, userID: user.id }),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      alert("Saved!");
    } catch (e) {
      console.error(e);
      alert("Could not save changes.");
    }
  };

  const onSave = () => (isNew ? saveNew() : saveExisting());

  if (!isNew && loading) return <div className="p-6">Loading editor…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">
        {isNew ? "Create New Product" : `Edit: ${form.name}`}
      </h1>

      {/* Name */}
      <input
        className="w-full border p-2 rounded"
        placeholder="Name"
        value={form.name ?? ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* Price */}
      <input
        type="number"
        inputMode="decimal"
        className="w-full border p-2 rounded"
        placeholder="Price"
        min={0}
        value={form.price ?? ""}
        onChange={(e) =>
          setForm({
            ...form,
            price:
              e.target.value === ""
                ? undefined
                : parseFloat(e.target.value),
          })
        }
      />

      {/* Type */}
      <select
        className="w-full border p-2 rounded"
        value={form.productType ?? "modules"}
        onChange={(e) =>
          setForm({ ...form, productType: e.target.value as ProductType })
        }
      >
        <option value="towers">towers</option>
        <option value="modules">modules</option>
        <option value="addons">addons</option>
      </select>

      {/* Description */}
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Description"
        value={form.description ?? ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      {/* Public */}
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!form.public}
          onChange={(e) => setForm({ ...form, public: e.target.checked })}
        />
        Public
      </label>

      {/* Image Upload */}
      <div>
        <label className="block font-medium mb-1">Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
        />
        {form.imageURL && (
          <img
            src={form.imageURL}
            alt="preview"
            className="mt-2 h-32 rounded border"
          />
        )}
      </div>

      {/* 3D Model Upload & Preview */}
      {!isNew && user && (
        <div>
          <label className="block font-medium mb-1">3D Model File</label>
          <ModelUploader
            productID={Number(id)}
            userID={user.id}
            onSaved={() => window.location.reload()}
          />
          {form.modelURL && form.modelFileType && (
            <div className="mt-4">
              <ModelViewer
                url={form.modelURL}
                fileType={form.modelFileType as "STL" | "OBJ" | "3MF" | "STEP"}
                height={400}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {isNew ? "Create" : "Save"}
        </button>
      </div>
    </div>
  );
}
