## Commit Metadata
- **Hash:** 01df8cafc38ca1e0865f055005675676334b2743
- **Parent:** 2d69ddaec9b6bb08496c8c28c8c0f48ea5482c73
- **Author:** Cyber Code Master
- **Date:** 2026-04-06 19:21:20
- **Message:** Add communication policy engine v2 with queue, limits, and admin/org controls

## Custom Title
Add communication policy engine v2 with queue, limits, and admin/org controls

## High-Level Summary
Added feature: Add communication policy engine v2 with queue, limits, and admin/org controls. Affects 11 files (904 additions, 0 deletions).

## File-by-File Breakdown
- **.../migration.sql** — +86/-0 lines
- **prisma/schema.prisma** — +62/-0 lines
- **server/controllers/messageController.js** — +32/-0 lines
- **server/routes/messageRoutes.js** — +6/-0 lines
- **server/server.js** — +13/-0 lines
- **.../communicationPolicyService.contract.test.js** — +39/-0 lines
- **server/services/communicationPolicyService.js** — +463/-0 lines
- **server/services/messageService.js** — +13/-0 lines
- **server/utils/jsonStore.js** — +3/-0 lines
- **src/pages/AdminPanel.jsx** — +119/-0 lines
- **src/pages/OrgSettings.jsx** — +68/-0 lines

## Detailed Diff Analysis
@@ -0,0 +1,86 @@
+CREATE TABLE IF NOT EXISTS "message_policy_logs" (
+  "id" TEXT PRIMARY KEY,
+  "queue_id" TEXT,
+  "sender_id" TEXT NOT NULL,
+  "org_id" TEXT,
+  "match_id" TEXT NOT NULL,
+  "action" TEXT NOT NULL,
+  "reason" TEXT NOT NULL,
+  "reputation_score" DOUBLE PRECISION NOT NULL,
+  "spam_score" DOUBLE PRECISION NOT NULL,
+  "frequency_count" INTEGER NOT NULL,
+  "first_response_priority" BOOLEAN NOT NULL DEFAULT false,
+  "queue_rank" TEXT,
+  "queue_score" INTEGER,
+  "queue_priority_label" TEXT,
+  "premium_verified_priority_score" DOUBLE PRECISION,
+  "retry_after_seconds" INTEGER,
+  "moderation_flag" BOOLEAN NOT NULL DEFAULT false,
+  "false_positive" BOOLEAN NOT NULL DEFAULT false,
+  "reviewer_id" TEXT,
+  "reviewer_notes" TEXT,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3)
+);
+
+CREATE TABLE IF NOT EXISTS "message_queue_items" (
+  "id" TEXT PRIMARY KEY,
+  "message_id" TEXT,
+  "match_id" TEXT NOT NULL,

## Why This Change
Feature addition: Add communication policy engine v2 with queue, limits, and admin/org controls.

## Was It Useful
Yes

## Impact Analysis
- **Scope:** **11 files**, +904/-0 lines
- **Risk:** Medium

## Relationships
Part of ongoing feature development and maintenance.

## Confidence Notes
High. Clear commit message.
