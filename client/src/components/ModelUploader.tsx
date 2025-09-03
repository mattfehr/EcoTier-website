import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { slugify } from "../utils/slugify";

const API_URL = import.meta.env.VITE_API_URL;

type Props = {
  productID: number;
  userID: string;
  onSaved?: () => void;
  maxBytes?: number;
  existingFile?: { name: string; type: string }; // 👈 from EditorPage
};

export default function ModelUploader({
  productID,
  userID,
  onSaved,
  maxBytes = 50 * 1024 * 1024,
  existingFile,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attached, setAttached] = useState<{ name: string; type: string } | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const ACCEPT = ".stl,.obj,.3mf,.step,.stp";

  // Show existing file info if provided
  useEffect(() => {
    if (existingFile) setAttached(existingFile);
  }, [existingFile]);

  async function handleFile(file: File) {
    setError(null);
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

      const path = `${userID}/${productID}/${Date.now()}-${slugify(file.name)}`;

      // Upload file to Supabase Storage
      setProgress(10);
      const { error: upErr } = await supabase.storage.from("models").upload(path, file, { upsert: true });
      if (upErr) throw upErr;

      setProgress(60);

      // Get public URL
      const { data: pub } = supabase.storage.from("models").getPublicUrl(path);
      const modelURL = pub?.publicUrl;
      if (!modelURL) throw new Error("Failed to resolve model public URL.");

      setProgress(80);

      // Save metadata to backend
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

      // Update attached file info
      setAttached({ name: file.name, type: mapped });

      // Let parent refetch product
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
      {/* Hidden input */}
      <input
        id={`model-file-input-${productID}`}
        type="file"
        accept={ACCEPT}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        disabled={busy}
        className="sr-only"
      />
      {/* Styled button */}
      <label
        htmlFor={`model-file-input-${productID}`}
        className={`inline-block cursor-pointer rounded px-3 py-2 text-white ${
          busy ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Choose File
      </label>

      {progress !== null && (
        <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
          <div className="h-2 bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {attached ? (
        <p className="text-sm">
          Model attached: <strong>{attached.name}</strong> ({attached.type})
        </p>
      ) : (
        <p className="text-sm text-gray-500">No model file uploaded yet.</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
