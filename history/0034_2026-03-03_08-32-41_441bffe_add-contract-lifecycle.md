# Commit 0034: Add Contract Lifecycle and Signature/Artifact Support

## Commit Metadata
| Field | Value |
|-------|-------|
| **Commit Number** | 0034 |
| **Commit Hash** | `441bffe60e1ac99d9f8ac5a68ec30070a3ebcd5c` |
| **Parent Hash** | `c60086fc0cab2c88e7587a304f0d9af89b792b35` |
| **Author** | Cyber Code Master |
| **Date/Time** | 2026-03-03 08:32:41 |
| **Files Changed** | 4 |
| **Additions** | 279 |
| **Deletions** | 47 |
| **Net Change** | +232 |
| **Merge Commit** | No |

## Custom Title
Add Contract Lifecycle and Signature/Artifact Support

## High-Level Summary
Extends the document management system with full contract lifecycle tracking: draft creation, buyer/factory signature states, artifact finalization (PDF path/hash), and archive. The ContractVault UI is rewritten to display lifecycle status, filter by state, and show a detailed drawer with signature and artifact info.

## File-by-File Breakdown
- **server/controllers/documentController.js** (+26/-2): Added draft creation, contract listing, signature/artifact patch endpoints.
- **server/routes/documentRoutes.js** (+12/-1): Added `/documents/contracts/*` routes.
- **server/services/documentService.js** (+100/-0): Added `createDraftContract`, `listContracts`, `updateContractSignatures`, `updateContractArtifact` with lifecycle normalization.
- **src/pages/ContractVault.jsx** (+141/-44): Full rewrite with API data loading, filter by lifecycle state, detail drawer showing signatures, artifact status, download links.

## Detailed Diff Analysis
The service introduces a `normalizeContractLifecycle` function that computes contract state (draft/pending_signature/signed/archived) from signature states and artifact status. Sanitized signature states ensure only `pending` or `signed` values. The artifact supports `draft`, `locked`, and `archived` states with PDF hash tracking. The UI now has real data from `/documents/contracts`, filterable by lifecycle status, with PDF download URLs resolved from the server.

## Why This Change May Have Been Needed
Contracts are a core business artifact. The system needed proper lifecycle management with signature tracking and artifact finalization.

## Was It Useful?
Yes, foundational feature for legally-binding digital contract workflows.

## Impact Analysis
Medium. Extends existing document system with contract-specific logic. The API is kept under the same document routes.

## Relationship to Surrounding Commits
The step-based contract workflow (0052) extends this further. The role hardening (0038) and permissions (0059) gates contract access.

## Confidence Notes
High confidence. Clean extension of existing document service.
