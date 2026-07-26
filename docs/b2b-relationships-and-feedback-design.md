# B2B Relationships & Feedback Hub — Design Spec

## Scope
5 independent sub-projects, implementable in any order:

1. **Business Relationship Confirmation** — new model + visibility gating
2. **Custom License Requests** — request→upload→approve flow
3. **Privacy Guardrail** — phone redaction on documents
4. **Mandatory + Immutable Ratings** — enforce rating, remove mutations
5. **Feedback Hub** — new nav page feeding into support tickets

---

## A. Business Relationship Confirmation

### Model
Extend `PartnerRequest` or create `BusinessRelationship`:
- `id`, `buyer_id` (FK→User), `counterparty_id` (FK→User), `status` (pending/confirmed/rejected), `confirmed_at`, `created_at`

### Visibility gating
- `GET /verification/:userId/documents` — check relationship before returning docs
- `GET /profiles/:userId/documents` — same gate
- Unauthenticated/not-in-relationship: return docs with phone redacted + limited fields
- In-relationship: return full documents

### Implementation touchpoints
- New Prisma model + migration
- New relationship service (or extend partnerNetworkService)
- Document visibility middleware
- Frontend: "Confirm Relationship" button on buyer/factory profile pages

---

## B. Custom License Requests

### Model: `LicenseRequest`
- `id`, `requester_id` (FK), `recipient_id` (FK), `license_name` (string), `status` (pending/uploaded/rejected), `uploaded_file_url`, `created_at`, `responded_at`

### Flow
1. User A clicks "Request License" on User B's profile
2. Types license name (free text)
3. Notification sent to User B
4. User B sees request in notifications dashboard
5. User B uploads document → saved to their profile's licenses
6. User A notified of completion

### Implementation touchpoints
- New Prisma model + migration
- LicenseRequestService (CRUD + notification)
- Frontend modal on profile pages
- NotificationsCenter handles `license_request` type

---

## C. Privacy Guardrail

### Approach
Central `redactPhoneNumbers(text)` utility. Apply at serialization boundary.

### Where to redact
- `presentContractForActor()` in documentService.js — redact phone from banking refs
- Profile endpoints — redact `account_manager_phone` for non-owner viewers
- Verification document display — redact trade license fields containing phone patterns

### What to redact
Phone patterns: digits grouped as phone numbers (7-15 digits, optional +/()/-/.) → replace with `[REDACTED]`.

---

## D. Mandatory + Immutable Ratings

### Immutability
- Remove `updateRating()` and `deleteRating()` from ratingsService.js
- Remove PATCH `/:id` and DELETE `/:id` from ratingsRoutes.js
- Remove "Edit" and "Delete" buttons in any rating display UI

### Mandatory ratings
- When `RatingFeedbackRequest` exists with `status: pending`, block:
  - Creating new contracts (POST /contracts/draft)
  - Sending new messages to that counterparty
- Check: `hasPendingRating(userId, counterpartyId)` in relevant endpoints

### Implementation touchpoints
- ratingsService.js: delete updateRating, deleteRating
- ratingsRoutes.js: remove PATCH/DELETE
- messageService.js: add pending-rating gate
- documentService.js: add pending-rating gate for contract creation

---

## E. Feedback Hub

### Route
- `/feedback` — public page (no auth required, but captures user if logged in)

### Form
- Category: Bug Report / Feature Request / General Feedback
- Subject (required)
- Description (required)
- File attachment (optional)
- Contact email (pre-filled if logged in)

### Backend
- Creates `SupportTicket` with `category: "feedback"` and `priority: "normal"`
- Sets `SupportTicket.category` to distinguish feedback from regular support

### Frontend
- NavBar.jsx: add "Feedback" link under "Support" group
- New `FeedbackPage.jsx` at `/feedback`

---

## Schema changes summary
- New: `BusinessRelationship` model
- New: `LicenseRequest` model
- Modify: `SupportTicket.category` to accept "feedback"
- Remove: PATCH/DELETE on ratings
