# Document - Server Feature Documentation (Manual)

## File Structure & Overview

- `server/routes/documentRoutes.js`: Document upload/list/delete and contract lifecycle routes.
- `server/controllers/documentController.js`: HTTP orchestration and permission/result mapping.
- `server/services/documentService.js`: File persistence, contract draft/signature/artifact/archival logic.
- `server/utils/permissions.js`: Contract/document permission checks.
- `server/database/documents.json`: Generic document and contract records (contracts stored as `entity_type='contract'`).
- Upload dirs:
  - `server/uploads/`
  - `server/uploads/contracts/`

## Code Explanation

### `documentRoutes.js`

- Uses multer memory storage for document upload (`8MB` limit).
- Routes:
  - `POST /api/documents/` upload document
  - `GET /api/documents/` list docs by entity
  - `DELETE /api/documents/:documentId` remove doc
  - `POST /api/documents/contracts/draft` create contract draft
  - `GET /api/documents/contracts` list contracts
  - `PATCH /api/documents/contracts/:contractId/signatures` update signatures
  - `PATCH /api/documents/contracts/:contractId/artifact` update artifact state

### `documentController.js`

- `uploadDocument`: validates file present, sets defaults (`entity_type=verification`, `entity_id=req.user.id`), calls `saveDocumentMetadata`.
- `getDocuments`: filters by query params (default same as above).
- `removeDocument`: maps `forbidden`/not-found results.
- `createContractDraft`: owner/role checks happen in service.
- `getContracts`: returns scoped contracts.
- `patchContractSignatures` and `patchContractArtifact`: map forbidden/not-found and return updated contract.

### `documentService.js`

Main document functions:

- `saveDocumentMetadata(ownerId, entityType, entityId, type, file)`:
  - allows only `.pdf/.png/.jpg/.jpeg`.
  - writes file to disk.
  - stores metadata row.
- `listDocuments(entityType, entityId)` and `deleteDocument`.

Contract lifecycle functions:

- `createDraftContract(actor, payload)`:
  - denies agent role.
  - creates draft contract row with signature/artifact defaults.
- `listContracts(actor)`:
  - scope by role/ownership through `scopeRecordsForUser`.
- `updateContractSignatures(contractId, patch, actor)`:
  - role/ownership permission check.
  - updates buyer/factory signature state and signed timestamps.
  - if both signed and no generated artifact, auto-generates PDF artifact + hash.
- `updateContractArtifact(contractId, patch, actor)`:
  - validates artifact state transitions.
  - only generated artifacts can be locked/archived.
  - updates lifecycle status.

Artifact generation internals:

- `buildSimpleContractPdf(contract)`: constructs minimal PDF text content.
- `generateContractArtifact(contract)`: writes versioned PDF, computes SHA-256 hash, stores signer/timestamp audit metadata.

## API Endpoints

- `POST /api/documents/`
  - multipart upload (`file`) + optional form fields:
    - `entity_type`, `entity_id`, `type`
  - Response: `201` metadata row, `400` if file missing/invalid.
- `GET /api/documents/?entity_type=...&entity_id=...`
  - Response: filtered document rows.
- `DELETE /api/documents/:documentId`
  - Response: `{ok:true}` or `403/404`.
- `POST /api/documents/contracts/draft`
  - Body: `title`, `contract_number`, `buyer_name`, `factory_name`, `buyer_id`, `factory_id`.
  - Response: `201` contract draft.
- `GET /api/documents/contracts`
  - Response: scoped contracts list.
- `PATCH /api/documents/contracts/:contractId/signatures`
  - Body example:

```json
{
  "buyer_signature_state": "signed",
  "factory_signature_state": "signed",
  "is_draft": false
}
```

- Response: updated contract or `403/404`.
- `PATCH /api/documents/contracts/:contractId/artifact`
  - Body example: `{ "status": "locked" }` or `{ "status": "archived" }`
  - Response: updated contract or `400/403/404`.

## Database / Data Model

- `documents.json` mixed entities:
  - generic docs (`entity_type` varies)
  - contracts (`entity_type='contract'`) with:
    - signature states/timestamps
    - artifact block (`pdf_path`, `pdf_hash`, `status`, `version`, signer ids, signature timestamps)
    - lifecycle helpers (`lifecycle_status`, optional `archived_at`)

## Business Logic & Workflow

1. Verification/contracts pages upload documents to `/api/documents`.
2. Contract vault creates draft contract.
3. Buyer/factory signatures advance contract.
4. Auto-generated artifact appears once both signatures are complete.
5. Artifact can then be locked and archived through explicit steps.

## Error Handling & Validation

- Invalid file type throws error (`Invalid file type`).
- Missing upload file -> `400`.
- Permission failures mapped to `403`.
- Missing records mapped to `404`.
- Invalid artifact transition (lock/archive before generation) -> `400`.

## Security Considerations

- All routes require JWT auth.
- Contract/document mutation checks actor permissions and ownership.
- File name sanitization and type allowlist reduce upload abuse.
- Artifact hash provides tamper-evidence metadata.

## Extra Notes / Metadata

- Contract artifact PDF is generated server-side (not uploaded by client) for audit consistency.
- Current persistence model is JSON + local files (MVP scope).
