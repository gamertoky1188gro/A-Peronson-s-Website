# Commit 0667 — fa74d1b

| Field | Value |
|-------|-------|
| **Commit Number** | 0667 |
| **Commit Hash** | fa74d1b88b4c0fb89eba26ea705fa145adf1337e |
| **Parent Hash** | 5c926cf1c18e547fcfce7dfd446201bc272e3bab |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-11 19:26:24 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 1 |
| **Deletions** | 2 |
| **Net Change** | +1/-2 |

## Remove AI Term and Rewrite Privacy Policy Storage Language

This commit makes two changes to the Privacy page: (1) removes the "AI-Assisted Replies" pill from the "How We Use Your Information" section, eliminating any reference to AI in the privacy policy; and (2) rewrites the vague "may be securely stored" language to be more reassuring and transparent — now stating that data is "stored securely for your protection" and explicitly promising it will "never be sold to third parties."

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/pages/Privacy.jsx | Modified | 1 | 2 | -1 |

## Detailed Diff Analysis

Two changes in `src/pages/Privacy.jsx`:

**1. Remove "AI-Assisted Replies" pill:**
```diff
 pills: [
     "Account Management",
     "Order Matching",
-    "AI-Assisted Replies",
     "Secure Communications",
     "Digital Contracts",
     "Fraud Prevention",
```

**2. Rewrite storage language:**
```diff
- "All communications conducted within the platform may be securely stored.",
+ "All communications within the platform are stored securely for your protection. Your data will never be sold to third parties.",
```

The rewrite changes three things:
- Removes hedging language ("may be") — commits to definite storage
- Adds benefit framing ("for your protection") — explains why data is stored
- Adds explicit promise ("never be sold to third parties") — addresses a common privacy concern

## Why This Change Was Needed

Two separate issues drove this change:

1. **AI reference removal:** The "AI-Assisted Replies" pill implied the platform uses AI to process communications, which may not be accurate or may raise concerns among users who don't expect AI involvement. Removing it is a factual correction and avoids potential user alarm.

2. **Language rewrite:** "May be securely stored" is vague and noncommittal. Users reading a privacy policy want clarity about what happens to their data. The new language is more direct, explains the purpose of storage (protection), and addresses the #1 privacy concern (data selling).

## Was It Useful

Yes — both changes improve the clarity and trustworthiness of the privacy policy. Removing AI references avoids confusion, and the rewritten storage language is more transparent and reassuring.

## Impact Analysis

- **User-facing:** Privacy policy text changes visible to all users viewing the Privacy page
- **Legal/compliance:** The rewritten language makes a more specific commitment ("never be sold to third parties") which should be verified against actual data practices
- **Risk:** Low — text-only changes, no functional impact

## Relationship to Surrounding Commits

- **Predecessor (0666):** HelpCenter scroll fixes
- **Successor (0668):** NavBar mobile menu fixes
- This commit is an isolated content update, not part of a UI fix chain

## Confidence Notes

The AI removal is straightforward. The storage language rewrite is good UX writing — it's clearer and more reassuring. However, "never be sold to third parties" is a strong legal commitment that should be verified against the platform's actual data practices.

## Optional Technical Details

- The pills are rendered in a flex container with `gap-2` and `flex-wrap`
- The storage section uses a `MessagesSquare` icon and renders as a list of bullet points
- Both changes are in the `sections` array which maps over the privacy policy content
