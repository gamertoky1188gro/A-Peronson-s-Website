import { useState, useRef } from "react";
import { getToken } from "../../lib/auth";

export default function ProfileImageUpload({
  value = "",
  onChange,
  label = "Profile image",
  placeholder = "https://...",
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

  const handleUrlChange = (e) => {
    onChange(e.target.value);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={handleUrlChange}
          placeholder={placeholder}
          className="mt-2 w-full rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white px-4 py-3 text-sm outline-none transition dark:bg-[#0b1224]"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading}
          className="rounded-xl bg-gtBlue px-4 py-2 text-sm font-semibold text-white transition hover:bg-gtBlueHover disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          or paste a URL above
        </span>
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

      {value ? (
        <div className="flex items-center gap-3">
          <img
            src={value}
            alt="Preview"
            className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200/60 dark:ring-slate-800"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="text-xs text-slate-600 dark:text-slate-300">
            Preview
          </div>
        </div>
      ) : null}
    </div>
  );
}
