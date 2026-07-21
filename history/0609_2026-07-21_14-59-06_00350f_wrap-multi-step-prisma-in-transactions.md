# Commit 0609 — `00350f910d4c`

| Field | Value |
|-------|-------|
| **Commit Number** | 0609 |
| **Commit Hash** | `00350f910d4c7671592fda47ce9cac6f91c3b5de` |
| **Parent Hash** | `4235cafad726f7afa14382a1b250238ea86bc9ea` |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-07-21 14:59:06 |
| **Branch** | main |
| **Files Changed** | 21 |
| **Additions** | 1,196 |
| **Deletions** | 1,021 |
| **Net Change** | +175 |
| **Merge Commit** | No |

## Wrap Multi-Step Prisma Operations in Transactions

DATA-002: Wrap all multi-step Prisma operations across 16 server files in `prisma.$transaction()` to ensure atomicity. Previously, operations that performed multiple Prisma queries (update + create, updateMany + individual updates, read + conditional writes) could leave the database in an inconsistent state if a later step failed mid-way. Now each logically grouped set of writes is wrapped in a transaction so either all succeed or all roll back.

### Files covered (count of multi-step operations wrapped)

| Service/Controller | Functions wrapped |
|---|---|
| `walletService.js` | `creditWallet`, `debitWallet`, `redeemCouponForUser` |
| `supportTicketService.js` | `createSupportTicket`, `appendSupportTicketMessage` |
| `conversationLockService.js` | `grantAccess`, `requestConversationAccess`, `transferConversation`, `revokeAccess` |
| `moderationController.js` | `submitModerationDecision` |
| `documentController.js` | signature/status transitions in document lifecycle |
| `ratingsService.js` | `recordMilestone`, `createRating`, `autoGenerateRatingsForOverdueRequests` |
| `documentService.js` | `createDraftContract`, `updateContractSignatures`, `updateContractArtifact` |
| `leadService.js` | `updateLead` |
| `enforcementService.js` | `applyEnforcement` |
| `adminActionService.js` | action + audit log writes |
| `messageService.js` | `postMessage` |
| `userService.js` | `listUsers` (MFA/stepup code generation) |
| `enterpriseOpsService.js` | `persistWorkloads`, `applyLeadOpsOnCreateOrUpdate`, `evaluateAndEscalateLeadIfBreached` |
| `orgOperationsService.js` | `rebalanceOrgQueue`, `escalateOrgLead` |
| `communicationPolicyService.js` | 3 functions (policy + state writes) |
| `adminDynamicConfigService.js` | 9 functions (config + audit trail writes) |

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `server/services/adminDynamicConfigService.js` | Modified | 265 | 235 | +30 |
| `server/services/communicationPolicyService.js` | Modified | 132 | 144 | -12 |
| `server/services/conversationLockService.js` | Modified | 125 | 72 | +53 |
| `server/services/ratingsService.js` | Modified | 143 | 129 | +14 |
| `server/services/walletService.js` | Modified | 99 | 87 | +12 |
| `server/services/enterpriseOpsService.js` | Modified | 57 | 51 | +6 |
| `server/services/orgOperationsService.js` | Modified | 63 | 59 | +4 |
| `server/services/enforcementService.js` | Modified | 52 | 48 | +4 |
| `server/services/documentService.js` | Modified | 49 | 27 | +22 |
| `server/services/moderationController.js` | Modified | 45 | 35 | +10 |
| `server/services/supportTicketService.js` | Modified | 45 | 37 | +8 |
| `server/services/leadService.js` | Modified | 42 | 32 | +10 |
| `server/services/documentController.js` | Modified | 20 | 18 | +2 |
| `server/services/userService.js` | Modified | 18 | 12 | +6 |
| `server/services/messageService.js` | Modified | 17 | 14 | +3 |
| `server/services/adminActionService.js` | Modified | 19 | 16 | +3 |
| `AUDIT_DETAILED_FIXES.md` | Modified | 1 | 1 | 0 |
| `AUDIT_EXECUTIVE_SUMMARY.md` | Modified | 1 | 1 | 0 |
| `AUDIT_INDEX.md` | Modified | 1 | 1 | 0 |
| `AUDIT_QUICKSTART.md` | Modified | 1 | 1 | 0 |
| `AUDIT_REPORT.md` | Modified | 1 | 1 | 0 |

## Detailed Diff Analysis

### Transaction wrapping pattern

The dominant refactoring pattern across all 16 files follows this structure:

**Before** (no transaction):
```js
await prisma.user.update({ where: { id }, data: { balance } });
await prisma.walletHistory.create({ data: { userId, amount, balanceAfter } });
```

**After** (wrapped):
```js
const [result] = await prisma.$transaction(async (tx) => {
  await tx.user.update({ where: { id }, data: { balance } });
  const row = await tx.walletHistory.create({ data: { userId, amount, balanceAfter } });
  return [row];
});
```

Key changes:
- All `prisma.` calls inside the callback become `tx.` (transaction client)
- Functions that previously used a separate helper to create notifications/audit entries now receive `tx` as a parameter so the helper also participates in the transaction
- Functions that returned a single entity now destructure from a returned array `const [result] = await prisma.$transaction(...)`
- Some functions that previously had interleaved `await` + `.catch(() => null)` inside transactions now have the `.catch` still present but on the `tx.` call

### Notable file-by-file changes

**`walletService.js`** (`creditWallet`, `debitWallet`, `redeemCouponForUser`):
Balance update + wallet history creation are now atomic. Previously, if the history write failed after the balance update, the user's balance would be incremented/decremented without an audit trail.

**`documentService.js`** (`createDraftContract`, `updateContractSignatures`, `updateContractArtifact`):
Contract audit entries (`appendContractAudit`) are now called inside the same transaction as the document update, with the `tx` client passed through. This ensures contract state transitions and their audit log entries are committed together.

**`conversationLockService.js`**:
Notification creation (`tx.notification.create`) was previously done via a separate helper function. Now the notification is created inline within the same transaction as the lock update, and `createLockNotification` helper was removed (its logic inlined).

**`enforcementService.js`**:
The `applyEnforcement` function previously created a governance enforcement record, then conditionally updated user fields or created a manual review queue entry in separate uncoordinated queries. Now all three steps are inside a single transaction.

**`messageService.js`**:
Message creation + messageRequest upsert (for unverified senders) are now atomic.

**`ratingsService.js`**:
The `recordMilestone` function was the most complex refactor — milestone upsert, completion check, feedback request creation, feedback event creation, and notification creation are all wrapped in one transaction. The `createFeedbackRequestNotification` helper now accepts an optional `tx` parameter.

### Side effect: `appendContractAudit` signature change

The `appendContractAudit` helper gained a third parameter `tx` (optional, defaults to `prisma`). This allows it to participate in transactions when called from within `documentService.js` while remaining backward-compatible for any external callers.

## Why This Change Was Needed

DATA-002 was identified during the code audit as a data-integrity issue. Across the server codebase, 16 files contained functions that performed multiple Prisma operations sequentially without any transaction wrapping. If any operation in the sequence failed (e.g., a database constraint violation, a timeout, a crash), the preceding operations would have already committed their changes, leaving the database in an inconsistent state. Specific risks included:

- Wallet credits applied but history entries not created (lost audit trail)
- Contract signatures updated but audit log entries missing
- Enforcement actions applied but user restrictions not updated
- Messages posted but message request entries not created
- Milestones recorded but feedback requests not generated

## Was It Useful

**Critical usefulness** — this is a data-integrity hardening change. While the probability of mid-sequence failures is low under normal operation, the consequences of such failures are severe: silent data corruption, missing audit trails, and inconsistent application state. Transactions are the standard defense against these issues in relational databases.

## Impact Analysis

- **Data integrity**: all multi-step Prisma operations are now atomic (all-or-nothing)
- **Performance**: minor overhead from transaction begin/commit; negligible for OLTP workloads
- **Code quality**: some functions gained nesting depth; the trade-off for correctness is justified
- **Testing**: existing tests that mock `prisma` calls may need updates if they don't account for the transaction wrapper
- **Rollback risk**: low — the refactoring is mechanical and does not change business logic

## Relationship to Surrounding Commits

Commit 609 is the second commit of Round 5 (following 608 which gated `VITE_REQUEST_DEBUG` to dev). It directly addresses the DATA-002 audit finding. It is followed by commit 610 (QUALITY-004 — remove unused imports). The updated audit files mark DATA-002 as complete.

## Confidence Notes

High confidence. The transaction wrapping follows a consistent mechanical pattern across all 16 files. The code passes `node -c` syntax check. The `appendContractAudit` parameter change is backward-compatible (optional parameter).
