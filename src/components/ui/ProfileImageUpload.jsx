import { useState, useRef } from "react";
import { getToken } from "../../lib/auth";

export default function ProfileImageUpload({
  value = "",
  onChange,
  label = "Profile image",
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getToken();
      const response = await fetch("/api/users/me/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      onChange(data.avatar_url || data.profile_image);
    } catch (err) {
      setError(err.message || "Unable to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {uploading ? "Uploading..." : "Choose Image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </div>
      )}

      {value && (
        <div className="flex items-center gap-3">
          <img
            src={value}
            alt="Preview"
            className="h-16 w-16 rounded-xl object-cover ring-1 ring-slate-200/60 dark:ring-slate-800"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="text-xs text-slate-500">Image set</span>
        </div>
      )}
    </div>
  );
}