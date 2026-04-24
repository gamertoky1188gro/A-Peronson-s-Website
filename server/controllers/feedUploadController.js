import path from "path";

function inferType(mime = "", originalName = "") {
  const lower = String(mime || "").toLowerCase();
  if (lower.startsWith("video/")) return "video";
  if (lower.startsWith("image/")) return "image";
  const ext = path.extname(String(originalName || "")).toLowerCase();
  if ([".mp4", ".webm", ".mov", ".mkv"].includes(ext)) return "video";
  return "image";
}

export async function uploadFeedMedia(req, res) {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "File is required" });
  const type = inferType(file.mimetype, file.originalname);
  const filename = String(file.filename || "");
  if (!filename) return res.status(500).json({ error: "Upload failed" });
  return res.status(201).json({
    url: `/uploads/feed/${filename}`,
    type,
  });
}
