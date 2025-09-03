import { useState } from "react";
import { supabase } from "../lib/supabase";
import { slugify } from "../utils/slugify";

const API_URL = import.meta.env.VITE_API_URL;

type Props = {
  productID: number;
  userID: string;             // pass from AuthContext.user.id
  onSaved?: () => void;       // optional: refetch product after upload
  maxBytes?: number;          // default 50MB
};

export default function ModelUploader({ productID, userID, onSaved, maxBytes = 50 * 1024 * 1024 }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attached, setAttached] = useState<{ name: string; type: string } | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const ACCEPT = ".stl,.obj,.3mf,.step,.stp";

  async function handleFile(file: File) {
    setError(null);
    setAttached(null);
    setProgress(null);

    if (!file) return;
    if (file.size > maxBytes) {
      setError(`File too large. Max ${Math.round(maxBytes / (1024 * 1024))}MB.`);
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    const typeMap: Record<string, string> = {
      stl: "STL",
      obj: "OBJ",
      "3mf": "3MF",
      step: "STEP",
      stp: "STEP",
    };
    const mapped = typeMap[ext || ""] || "UNKNOWN";
    if (mapped === "UNKNOWN") {
      setError("Unsupported file type. Use STL, OBJ, 3MF, or STEP.");
      return;
    }

    try {
      setBusy(true);

      // Path convention: userId/productId/timestamp-filename
      const path = `${userID}/${productID}/${Date.now()}-${slugify(file.name)}`;

      // Upload to Supabase Storage (models bucket)
      // Note: Storage upload progress isn’t streamed; we simulate simple stages
      setProgress(10);
      const { error: upErr } = await supabase.storage.from("models").upload(path, file, {
        upsert: false,
      });
      if (upErr) throw upErr;

      setProgress(60);

      // Get public URL (assuming bucket is public; if private, use createSignedUrl)
      const { data: pub } = supabase.storage.from("models").getPublicUrl(path);
      const modelURL = pub?.publicUrl;
      if (!modelURL) throw new Error("Failed to resolve model public URL.");

      setProgress(80);

      // Persist metadata to backend
      const resp = await fetch(`${API_URL}/api/products/${productID}/model`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID,
          modelURL,
          modelFileType: mapped,
          modelSizeBytes: file.size,
          modelFilename: file.name,
        }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.error || "Model metadata save failed.");
      }

      setProgress(100);
      setAttached({ name: file.name, type: mapped });
      onSaved?.();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Upload failed.");
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(null), 600);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Attach 3D Model</label>

      <input
        type="file"
        accept={ACCEPT}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        disabled={busy}
        className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700"
      />

      {progress !== null && (
        <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
          <div
            className="h-2 bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {attached && (
        <p className="text-sm">
          Attached: <strong>{attached.name}</strong> ({attached.type})
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        Supported: STL, OBJ, 3MF, STEP. Max {Math.round(maxBytes / (1024 * 1024))}MB.
      </p>
    </div>
  );
}
