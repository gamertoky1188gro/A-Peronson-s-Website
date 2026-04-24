# E-sign Provider Integration & Webhook Mapping

This document explains how the app maps external e-sign provider webhooks to the internal
contract signature model (`buyer_signed` / `factory_signed`) and provides examples.

Summary

- The server accepts provider callbacks at `POST /api/documents/contracts/:contractId/sign-callback`.
- Callbacks are validated (HMAC/timestamp) and then passed through a best-effort mapper
  (`server/services/eSignCallbackMapper.js`) that extracts `buyer_signed` and/or `factory_signed`.

Mapping rules (best-effort)

- If the incoming JSON already contains `buyer_signed` or `factory_signed`, the value is used.
- Common provider shapes are inspected for `event.event_type`, `signature_request.signatures`,
  `signatures`, or `signers`. For each signature object the mapper tries to detect a role by
  examining `role`, `signer_role`, `role_name`, `email`, or `name` fields for `buyer` or `factory`/`supplier`.
- If the provider emits an "all signed" event, both `buyer_signed` and `factory_signed` are set.

Best practices for reliable mapping

- When configuring your e-sign provider (or adapter), include explicit signer role or email
  metadata so the mapper can correctly assign buyer vs factory. Example metadata to send when
  creating a signing session (recommended):

  {
  "signers": [
  { "role": "buyer", "email": "buyer@example.com" },
  { "role": "factory", "email": "factory@example.com" }
  ]
  }

- Alternatively, the provider can POST a minimal payload containing `{ "buyer_signed": true }`
  or `{ "factory_signed": true }` which will be honored directly.

Examples

- Dropbox Sign-like event (signature_request_signed): the mapper will inspect
  `payload.signature_request.signatures` and match signer `role` or `signer_email_address`.

- HelloSign-like event (signature_request_all_signed): the mapper will set both flags.

If mapping is ambiguous

- The mapper tries to avoid false positives; if it cannot determine a role it will return
  an empty result and the original payload will be used. In that case, you can:
  - Configure the provider to include explicit `buyer_signed`/`factory_signed` fields, or
  - Ensure signer roles/emails are present when creating the signing session.

Developer notes

- Mapper implementation: `server/services/eSignCallbackMapper.js` (best-effort heuristics).
- To test locally, use the dev sandbox at `/api/dev/esign/simulate_callback` which will
  POST an HMAC-signed payload to the real webhook endpoint for quick verification.
