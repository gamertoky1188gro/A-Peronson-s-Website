**AI Pipeline Integration**

**Endpoints**

- POST /api/assistant/extract-requirement — body: { text }
- POST /api/assistant/generate-first-response — body: { extracted, match_id? }
- POST /api/assistant/validate-response — body: { draft, extracted, match_id?, threshold? }

**BuyerRequestManagement**: call `/api/assistant/extract-requirement` with free-text requirement; use returned `extracted` to prefill the structured form fields (`product_type`, `category`, `moq`, `target_price`, `timeline`, `incoterm`, `certifications`, `notes`). Render `missing_fields` checklist and allow buyer to complete.

**ChatInterface / AgentDashboard**: when a new buyer message arrives, client can call `/api/assistant/generate-first-response` with the extracted fields (or call `extract-requirement` first). The API returns a `draft` and `meta` including `confidence` and `missing_fields`. If `meta.handoff` is true or `confidence` below threshold, surface `meta.suggested_clarifying_questions` and flag for manual review.

**Storage**: AI metadata (`confidence`, `missing_fields`, `handoff_reason`) is persisted as a system message and as a lead note when `match_id` is supplied.

**Fallback policy**: UI should treat `meta.handoff === true` as requiring manual review and present suggested questions for the agent to ask buyer.

**Offline evaluation**: `server/evals/ai_extraction_eval.mjs` runs labeled examples in `server/evals/examples.json` and prints per-field precision/recall-like scores. Run with `node server/evals/ai_extraction_eval.mjs` (Node 18+).
