## Commit Metadata
- **Hash:** `d83a5daf6ea36233ae3ae66c5a4872b3fcae0425`
- **Parent:** `385842742ebef87e1eac31174cc7c1017e0c55f0`
- **Author:** Cyber Code Master
- **Date:** 2026-04-28 23:26:49 +0600
- **Subject:** Fix AppState create unique constraint error
- **Body:** (none)

## Custom Title
Fix Prisma Unique Constraint Race Condition in AppState

## High-Level Summary
Wraps the `ensureStateRow` function in `server/utils/localStore.js` with a try-catch for Prisma's `P2002` unique constraint error. If a concurrent request creates the row between the `findUnique` check and `create` call, catches the error and retries with `findUnique`.

## File-by-File
| File | Change |
|------|--------|
| `server/utils/localStore.js` | +14, -7 |

## Detailed Diff
```diff
--- a/server/utils/localStore.js
+++ b/server/utils/localStore.js
 async function ensureStateRow(key, fallback) {
   const existing = await prisma.appState.findUnique({ where: { key } });
   if (existing) return existing;
-  const created = await prisma.appState.create({
-    data: { key, data: toSerializable(fallback) },
-  });
-  return created;
+  try {
+    const created = await prisma.appState.create({
+      data: { key, data: toSerializable(fallback) },
+    });
+    return created;
+  } catch (e) {
+    if (e.code === 'P2002') {
+      return await prisma.appState.findUnique({ where: { key } });
+    }
+    throw e;
+  }
 }
```

## Why
Concurrent requests could trigger the same `ensureStateRow` call simultaneously. The find-then-create pattern has a race condition where both requests find `null`, then the first `create` succeeds and the second fails with Prisma's `P2002` unique constraint violation. The try-catch handles this gracefully.

## Was It Useful
Yes — prevented intermittent server errors under concurrent load.

## Impact
Moderate. Server stability fix; no API changes.

## Relationships
Follows commit 304. Key fix for production reliability.

## Confidence
High
