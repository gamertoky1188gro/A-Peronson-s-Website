CREATE TABLE IF NOT EXISTS "feed_posts" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description_markdown" TEXT NOT NULL,
  "caption" TEXT,
  "cta_text" TEXT,
  "cta_url" TEXT,
  "hashtags" JSONB,
  "emojis" JSONB,
  "mentions" JSONB,
  "links" JSONB,
  "product_tags" JSONB,
  "location_tag" TEXT,
  "media" JSONB,
  "category" TEXT,
  "status" TEXT NOT NULL DEFAULT 'published',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3)
);

CREATE INDEX IF NOT EXISTS "feed_posts_user_id_created_at_idx" ON "feed_posts"("user_id", "created_at");
