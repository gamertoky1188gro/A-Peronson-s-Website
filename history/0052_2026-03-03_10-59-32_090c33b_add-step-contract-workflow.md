# Commit 0052: Add Step-Based Contract Workflow in Contract Vault

## Commit Metadata

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Commit Number** | 0052                                       |
| **Commit Hash**   | `090c33b9e7a809a0ddf3e2640fd01898497ed36f` |
| **Parent Hash**   | `5ddb592bcc06b141caf23c2986cb1bb5b0cc3fb2` |
| **Author**        | Cyber Code Master                          |
| **Date/Time**     | 2026-03-03 10:59:32                        |
| **Files Changed** | 1                                          |
| **Additions**     | 240                                        |
| **Deletions**     | 44                                         |
| **Net Change**    | +196                                       |
| **Merge Commit**  | No                                         |

## Custom Title

Add Step-Based Contract Workflow in Contract Vault

## High-Level Summary

Extends the Contract Vault with a 5-step guided workflow: draft creation → buyer signature → factory signature → artifact finalize → archive. The UI now shows a step timeline, role-sensitive action buttons, and per-step enabling logic. Users can create drafts inline, sign as buyer/factory, finalize with PDF/hash, and archive.

## File-by-File Breakdown

- **src/pages/ContractVault.jsx** (+240/-44): Complete rewrite with step flow, inline draft creation form, lifecycle timeline drawer, role-sensitive signature/artifact/archive buttons.

## Detailed Diff Analysis

The new flow defines five steps via `FLOW_STEPS` constant. `computeFlow` function derives step completion states from contract data. Role-sensitive helper functions (`canBuyerSign`, `canFactorySign`, `canFinalizeArtifact`, `canArchive`, `canCreateDraft`) control button availability. The drawer now shows a numbered step timeline with checkmarks and blocker descriptions. Action buttons call signature/artifact PATCH APIs with contextual payloads.

## Why This Change May Have Been Needed

Contract execution needed a clear, guided workflow with role-based permissions at each step.

## Was It Useful?

Yes, transforms contract vault from a document viewer into an interactive workflow tool.

## Impact Analysis

Medium. Single file but significant UI restructuring.

## Relationship to Surrounding Commits

This branch is merged by 0053. Extends the contract lifecycle from 0034. Permission hardening from 0059 affects contract access.

## Confidence Notes

High confidence. Clean step-based pattern with role sensitivity baked into UI actions.
