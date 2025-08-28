// client/src/pages/EditorPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { routes } from "../utils/routes";
import type { Product, ProductType } from "../../../shared/types/product";

export default function EditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [form, setForm] = useState<Partial<Product>>({
    name: "",
    price: 0,
    productType: "modules" as ProductType,
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to load product");
        const p: Product = await res.json();
        setForm(p);
      } catch (e) {
        console.error(e);
        alert("Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const saveNew = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Create failed");
      const created: Product = await res.json();
      navigate(routes.editor(created.productID)); // hop to edit mode
    } catch (e) {
      console.error(e);
      alert("Could not create product.");
    }
  };

  const saveExisting = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
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

      <input
        className="w-full border p-2 rounded"
        placeholder="Name"
        value={form.name ?? ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="number"
        className="w-full border p-2 rounded"
        placeholder="Price"
        value={form.price ?? 0}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />
      <select
        className="w-full border p-2 rounded"
        value={form.productType ?? "modules"}
        onChange={(e) => setForm({ ...form, productType: e.target.value as ProductType })}
      >
        <option value="towers">towers</option>
        <option value="modules">modules</option>
        <option value="addons">addons</option>
      </select>
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Description"
        value={form.description ?? ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!form.public}
          onChange={(e) => setForm({ ...form, public: e.target.checked })}
        />
        Public
      </label>

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
