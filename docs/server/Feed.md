# Feed

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/feed` -> `server/routes/feedRoutes.js:118` (router var: `feedRoutes`)

## Routes (ultra-detailed)

### GET `/api/feed/`

- **Route definition:** `server/routes/feedRoutes.js:6`

```js
router.get("/", requireAuth, combinedFeed);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `combinedFeed`
- **Controller file:** `server/controllers/feedController.js`

#### Controller implementation: `server/controllers/feedController.js:3`

```js
export async function combinedFeed(req, res) {
  const unique = req.query.unique === "true";
  const type = req.query.type || "all";
  const category = req.query.category || "";
  const cursor = Number.isFinite(Number(req.query.cursor))
    ? Math.max(0, Math.floor(Number(req.query.cursor)))
    : 0;
  const limitRaw = Number.isFinite(Number(req.query.limit))
    ? Math.floor(Number(req.query.limit))
    : 12;
  const limit = Math.min(50, Math.max(1, limitRaw));
  const data = await getCombinedFeed({
    unique,
    type,
    category,
    cursor,
    limit,
    viewer: req.user,
  });
  return res.json(data);
}
```

## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.
