CREATE TABLE IF NOT EXISTS "link_previews" (
  "id" TEXT PRIMARY KEY,
  "url" TEXT NOT NULL UNIQUE,
  "title" TEXT,
  "description" TEXT,
  "image" TEXT,
  "favicon" TEXT,
  "site_name" TEXT,
  "domain" TEXT,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
