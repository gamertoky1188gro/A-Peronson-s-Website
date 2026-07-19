# Commit 0063: Add Company Knowledge Matching and FAQ Management UI

## Commit Metadata

| Field         | Value                                      |
| ------------- | ------------------------------------------ |
| Commit Number | 0063                                       |
| Hash          | `255a25c25d0ea3bbef96c245038ede532953c961` |
| Parent Hash   | `b93472398dcd1bda2c939be24922315b758b4d7e` |
| Author        | Cyber Code Master                          |
| Date/Time     | 2026-03-03 12:04:40                        |
| Files Changed | 3                                          |
| Additions     | 204                                        |
| Deletions     | 27                                         |
| Net Change    | +177                                       |
| Merge         | No                                         |

## Custom Title

Add Type-Differentiated Company Knowledge Matching with FAQ/Fact Classification

## High-Level Summary

This commit extends the assistant knowledge system by introducing a `type` field (`faq` vs `fact`) for knowledge entries, enabling the assistant to differentiate between FAQs and company facts when matching user questions. The matching algorithm now scores FAQ and fact entries separately and picks the best overall match. On the frontend, the Help Center page gains a full CRUD FAQ management interface (visible to owner/admin only), and Org Settings is refactored to support both FAQ and fact entry types with a type selector.

## File-by-File Breakdown

### server/services/assistantService.js (modified, +47/-12)

- **What changed**: Added `KNOWLEDGE_TYPES` constant (`faq`/`fact`); added `normalizeType` function; added `type` field to `createKnowledgeEntry`, `updateKnowledgeEntry`, and `mapKnowledgeRow`; refactored `assistantReply` to split entries into FAQ and fact pools, score separately, and pick the best match; enhanced `buildMatchedResponse` with `metadata` containing `matched_source`, `matched_type`, `confidence`, and `fallback_reason`; added `findBestMatch` helper.
- **Why it matters**: Enables the assistant to distinguish between frequently asked questions and company facts, improving answer relevance and transparency.

### src/pages/HelpCenter.jsx (modified, +111/-12)

- **What changed**: Added `loadFaqs`, `saveFaq`, `removeFaq`, `selectForEdit`, `resetForm` functions; added API-driven FAQ list from `/assistant/knowledge`; renders managed FAQ entries alongside static FAQs; owner/admin-only management UI with form and managed list panel.
- **Why it matters**: Transforms Help Center from a static page to a dynamic, editable FAQ management interface for authorized roles.

### src/pages/OrgSettings.jsx (modified, +23/-12)

- **What changed**: Renamed `emptyFaq` to `emptyKnowledge`; added `type` field to form state; changed tab name from `assistant_faq` to `assistant_knowledge`; added entry type selector (FAQ/Company Fact) in the form; displays entry type badge in the list.
- **Why it matters**: Generalizes Org Settings knowledge management to support both FAQ and fact entries, aligning with the backend type system.

## Detailed Diff Analysis

### Functions/Classes Added

- **`normalizeType`** (service) — Normalizes type string, defaults to `faq` if not `fact`
- **`findBestMatch`** (service) — Extracted helper that scores all entries against question text and returns best match
- **`loadFaqs`** (React) — Fetches knowledge entries from API with auth
- **`saveFaq`** (React) — Creates or updates a knowledge entry via POST/PUT
- **`removeFaq`** (React) — Deletes a knowledge entry via DELETE
- **`selectForEdit`** / `resetForm` (React) — Form management helpers

### Logic Changes

- **Type classification**: Knowledge entries now carry a `type: 'faq' | 'fact'` field
- **Dual-pool matching**: FAQ entries and fact entries are scored separately; the best overall match wins
- **Rich response metadata**: Assistant replies now include `matched_source`, `matched_type`, `confidence`, and `fallback_reason` in a `metadata` object
- **Fallback behavior**: If no company data matches, falls back to global rules; if nothing matches, returns `forward_to_agent: true` with metadata

### UI/UX Changes

- Help Center shows API-managed FAQs alongside static ones
- Owner/admin users see a full FAQ management panel with add/edit/delete
- Org Settings tab relabeled from "Assistant FAQ" to "Assistant Knowledge"
- Entry type selector (FAQ vs Company Fact) in the knowledge form
- Entry type badge displayed in the knowledge list

## Why This Change May Have Been Needed

The assistant previously treated all knowledge entries uniformly. To provide more relevant answers and accurate attribution, entries needed type classification. This also enables the Help Center to be self-service for admins without code changes.

## Was It Useful?

**Useful.** The FAQ/fact distinction improves assistant response quality. The Help Center management UI reduces admin friction for maintaining content.

## Impact Analysis

- **Developers**: New `type` field required on knowledge entries; existing untyped entries default to `faq`.
- **Users**: Help Center now shows dynamic FAQ entries alongside static ones; admins can edit FAQs directly.
- **Backward compatibility**: Backend defaults `type` to `'faq'` for existing entries, so no data migration is needed.

## Relationship to Surrounding Commits

Follows the org member management commits (0061-0062) and precedes merge PR #34. The knowledge type system prepares for more sophisticated AI assistant features.

## Confidence Notes

High. The diff is clean and self-contained. The dual-pool matching logic is a natural extension.

## Optional Technical Details

- `KNOWLEDGE_TYPES.FAQ = 'faq'`, `KNOWLEDGE_TYPES.FACT = 'fact'`
- Source format in response: `company_data:faq` or `company_data:fact`
- Confidence cap at 0.95, with base of 0.45 + score * 0.1
- Tab rename from `assistant_faq` to `assistant_knowledge` is a breaking UI change for any direct URL references
