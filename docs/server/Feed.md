# Feed - Server Feature Documentation (Manual)

## File Structure & Overview
- `server/routes/feedRoutes.js`: Feed endpoint registration.
- `server/controllers/feedController.js`: Query extraction and feed response.
- `server/services/feedService.js`: Ranking, anti-abuse checks, unique-toggle behavior, feed metadata generation.
- `server/services/requirementService.js`: Source buyer request items.
- `server/services/productService.js`: Source product items.
- `server/database/requirements.json`, `server/database/company_products.json`, `server/database/users.json`, `server/database/social_interactions.json`: feed input sources.

## Code Explanation

### `feedRoutes.js`
- Single route:
  - `GET /api/feed/` with `requireAuth`.

### `feedController.js`
- Function `combinedFeed(req, res)`:
1. Parses query flags:
   - `unique` (`true` string check)
   - `type` (`all|requests|products`)
   - `category` filter
2. Calls `getCombinedFeed({ unique, type, category })`.
3. Returns JSON result.

### `feedService.js`
Summary:
- Produces ranked combined feed from requirements + products.
- Applies profile/activity/account-age boosts and anti-spam checks.

Key internals:
- `computeProfileCompleteness(user)`: profile completeness ratio.
- `computeActivityQuality(authorItemIds, socialRows)`: interaction quality score using comment/share vs report counts.
- `evaluateSpamPattern(item, authorItems)`: keyword/duplicate/word-variety analysis.
- `evaluateRepeatedPosting(item, authorItems)`: rapid posting window abuse check.
- `evaluateAntiAbuseSignals(...)`: composite anti-abuse decision.
- `calculateRecencyScore(created_at)`: freshness scoring.
- `getCombinedFeed({ unique, type, category })`:
  - pulls requirements/products based on `type`.
  - joins with user and social interaction records.
  - computes ranking metadata per item.
  - sorts by ranking score.
  - applies `unique` filter behavior.
  - logs ranking snapshot and returns tags + items + boost metadata.

Data fields included in response item metadata:
- `feed_metadata.boost_active`
- `feed_metadata.ranking_components.*` including recency, profile completeness, spam and repeated-post signals.

## API Endpoints
- `GET /api/feed?unique=<true|false>&type=<all|requests|products>&category=<optional>`
- Auth: required.
- Response shape:
```json
{
  "tags": ["Shirts", "Knitwear", "..."],
  "unique": false,
  "metadata": { "boost": { "active_item_count": 2, "total_item_count": 10, "config": {} } },
  "items": [ { "id": "...", "feed_type": "buyer_request", "feed_metadata": { ... } } ]
}
```
- Status: `200`, `401`.

## Database / Data Model
- Reads:
  - `requirements.json` (`status=open` subset when included).
  - `company_products.json`.
  - `users.json` (author profile/verification/age).
  - `social_interactions.json` (quality signals).
- Computed relationships:
  - item author id derived by item type (`buyer_id` or `company_id`).
  - author items grouped for abuse detection.

## Business Logic & Workflow
1. Frontend calls `/api/feed` with filters/toggles.
2. Service fetches source records.
3. For each item, computes recency + trust/quality boost eligibility.
4. Applies anti-abuse gates to prevent boost abuse.
5. Sorts and returns enriched feed.

## Error Handling & Validation
- Minimal controller-level validation (query defaults are tolerant).
- Errors generally bubble to global middleware.
- Feed service clamps/normalizes numeric ratios to stable bounds.

## Security Considerations
- JWT required via route middleware.
- Anti-abuse heuristics reduce spam prominence.
- Ranking logs provide audit visibility (without exposing private tokens).

## Extra Notes / Metadata
- Boost behavior is environment configurable (`FEED_*` env vars).
- `unique` toggle logic currently filters for alternating/category patterns rather than semantic dedupe.
