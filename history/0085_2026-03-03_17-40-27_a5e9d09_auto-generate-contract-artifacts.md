# Commit 0085: Auto-Generate Contract Artifacts After Signatures

## Commit Metadata

| Field         | Value                                      |
| ------------- | ------------------------------------------ |
| Commit Number | 0085                                       |
| Hash          | `a5e9d09d8cd21be29d0c9c9f00604757ac00a4ae` |
| Parent Hash   | `f8df2ba8ba8bb09c47d0a59f399f34a69381617e` |
| Author        | Cyber Code Master                          |
| Date/Time     | 2026-03-03 17:40:27                        |
| Files Changed | 2                                          |
| Additions     | 162                                        |
| Deletions     | 30                                         |
| Net Change    | +132                                       |
| Merge         | No                                         |

## Custom Title

Implement Server-Side PDF Artifact Generation on Both Signatures

## High-Level Summary

This commit introduces automatic PDF contract artifact generation on the server when both buyer and factory signatures are present. A new `generateContractArtifact` function creates a simple PDF document using raw PDF syntax, embedding contract metadata, signer information, and timestamps. The artifact enters a `generated` status (new state in the lifecycle). The `updateContractSignatures` function auto-triggers artifact generation when both signatures are received. The contract artifact schema is extended with `generated_at`, `version`, `signer_ids`, and `signature_timestamps`. The frontend is simplified: the manual PDF path/hash inputs are removed, replaced with a "Lock generated artifact" button. The download availability changes from "locked only" to "generated only".

## File-by-File Breakdown

### server/services/documentService.js (modified, +123/-14)

- **What changed**: Added `generated` to `ARTIFACT_STATES`; added `escapePdfText` and `buildSimpleContractPdf` for raw PDF creation; added `generateContractArtifact` function that creates PDF with contract details, writes to `server/uploads/contracts/`, returns artifact metadata; `createDraftContract` now initializes new artifact fields; `updateContractSignatures` records `buyer_signed_at`/`factory_signed_at` timestamps and auto-generates artifact when both signed; `updateContractArtifact` blocks locking/archiving if no generated artifact exists; artifact schema expanded with `generated_at`, `version`, `signer_ids`, `signature_timestamps`.
- **Why it matters**: Automates contract artifact creation, removes manual PDF upload step, and ensures artifact integrity.

### src/pages/ContractVault.jsx (modified, +23/-24)

- **What changed**: `computeFlow` now tracks `generated` state; flow blockers updated to mention generated artifact; `actionBlockers` checks for artifact generation; removed `artifactForm` state and manual PDF path/hash inputs; step 4 renamed from "Artifact finalize" to "Lock generated artifact"; download condition changed from `finalized` to `generated`; artifact detail panel shows generation timestamp, version, signer IDs, signature timestamps.
- **Why it matters**: Simplifies contract workflow by removing manual artifact entry.

## Detailed Diff Analysis

### Functions/Classes Added

- **`escapePdfText(value)`** — Escapes PDF string for embedding in content stream
- **`buildSimpleContractPdf(contract)`** — Generates valid PDF from scratch using PDF syntax objects
- **`generateContractArtifact(contract)`** — Creates PDF, writes to disk, returns metadata with hash, path, version, timestamps, signer IDs

### Logic Changes

- **Auto-generation**: When both signatures are received in `updateContractSignatures`, artifact is auto-generated if not already done
- **Artifact states extended**: `draft → generated → locked → archived` (new `generated` state)
- **Signature timestamps**: `buyer_signed_at`/`factory_signed_at` recorded on sign
- **Validation**: Locking/archiving requires existing generated artifact
- **PDF storage**: Written to `server/uploads/contracts/{contract_number}-v{version}.pdf`
- **Artifact schema expanded**: `generated_at`, `version: 0+`, `signer_ids: { buyer_id, factory_id }`, `signature_timestamps: { buyer_signed_at, factory_signed_at }`

### UI/UX Changes

- Manual PDF path/hash inputs removed from Contract Vault
- Step 4 renamed to "Lock generated artifact" with explanation text
- Download button enabled when artifact is generated (not just locked)
- Artifact details panel shows generation metadata and signer info

## Why This Change May Have Been Needed

Manual PDF upload was error-prone and required external tooling. Auto-generation ensures every signed contract gets a verifiable, timestamped, hashed PDF artifact automatically.

## Was It Useful?

**Highly useful.** Automates a critical compliance step, reduces user error, and provides verifiable audit trail.

## Impact Analysis

- **Developers**: New artifact schema fields; manual `pdf_path`/`pdf_hash` no longer accepted from client for locking. Backend generates PDF server-side.
- **Users**: No need to upload PDF — artifact is auto-generated after both signatures. Can download after generation. Can lock/archive generated artifacts.
- **Backward compatibility**: Existing contracts without generated artifacts need migration (no `generated_at`, `version`).

## Relationship to Surrounding Commits

Follows recording lifecycle merge (0084) and precedes merge PR #45. This completes the contract lifecycle automation.

## Confidence Notes

High. The PDF generation is straightforward (raw PDF syntax) with proper file storage and hashing.

## Optional Technical Details

- PDF generated using raw PDF-1.4 syntax with Type1 Helvetica font
- PDF stored at `server/uploads/contracts/{safeContractNumber}-v{version}.pdf`
- SHA-256 hash computed on PDF buffer
- New artifact status `generated` sits between draft and locked
- Artifact generation increments version from previous value
