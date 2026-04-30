# Payment Proof

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/payment-proofs` -> `server/routes/paymentProofRoutes.js:9` (router var: `router`)

## Routes

### GET `/api/payment-proofs`

- **Route:** `server/routes/paymentProofRoutes.js:11`
- **Middleware:** requireAuth, allowRoles(buyer, factory, buying_house, admin, owner, agent)
- **Handler:** `getPaymentProofs`

### POST `/api/payment-proofs`

- **Route:** `server/routes/paymentProofRoutes.js:17`
- **Middleware:** requireAuth, allowRoles(buyer, factory, buying_house, admin, owner, agent)
- **Handler:** `postPaymentProof`

### PATCH `/api/payment-proofs/:proofId`

- **Route:** `server/routes/paymentProofRoutes.js:23`
- **Middleware:** requireAuth, allowRoles(factory, buying_house, admin, owner)
- **Handler:** `patchPaymentProof`

---

## Service Layer

- **Payment Proof Service:** `server/services/paymentProofService.js`

---

*Generated from source: server/routes/paymentProofRoutes.js*