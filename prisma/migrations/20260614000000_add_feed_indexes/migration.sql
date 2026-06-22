-- Add indexes to optimize feed endpoint performance

-- feed_posts: status is queried for published posts
CREATE INDEX IF NOT EXISTS "feed_posts_status_created_at_idx"
  ON "feed_posts"("status", "created_at" DESC);

-- requirements: status is queried for open requirements
CREATE INDEX IF NOT EXISTS "requirements_status_created_at_idx"
  ON "requirements"("status", "created_at" DESC);

-- company_products: status, category, and content_review_status are queried
CREATE INDEX IF NOT EXISTS "company_products_status_category_review_created_at_idx"
  ON "company_products"("status", "category", "content_review_status", "created_at" DESC);

-- social_interactions: queried by entity_id for feed item interactions
CREATE INDEX IF NOT EXISTS "social_interactions_entity_id_type_interaction_created_at_idx"
  ON "social_interactions"("entity_id", "entity_type", "interaction_type", "created_at" DESC);

-- boosts: queried for active feed boosts within date range
CREATE INDEX IF NOT EXISTS "boosts_scope_status_starts_ends_idx"
  ON "boosts"("scope", "status", "starts_at", "ends_at");

-- ratings: queried by profile_key prefix "user:"
CREATE INDEX IF NOT EXISTS "ratings_profile_key_idx"
  ON "ratings"("profile_key");
