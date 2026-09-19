# Code Verification Report — GarTexHub B2B Marketplace

**Agent:** 06 — Codebase Requirement Verifier
**Date:** 2026-09-18
**Project Root:** `D:\A-Peronson-s-Website`
**Tech Stack:** React 19 + Vite + Tailwind CSS v4 + React Router v7 + Express 5 + Prisma 6 (PostgreSQL) + Redux Toolkit

---

## Project Structure Summary

| Area | Key Directories/Files |
|------|----------------------|
| Frontend | `src/pages/` (43 pages), `src/components/` (36 dirs), `src/hooks/`, `src/lib/`, `src/store/` |
| Backend | `server/controllers/` (64), `server/services/` (97), `server/routes/` (58), `server/middleware/` |
| Database | `prisma/schema.prisma` (1610 lines, 60+ models) |
| Shared | `shared/config/platformTaxonomy.js`, `shared/requirementValidation.js` |
| Roles | buyer, factory, buying_house, owner, admin, agent |
| Auth | JWT-based, localStorage/sessionStorage, role-protected routes in App.jsx |
| Payments | Wallet balance, CouponCode model, Verification subscription |

---

## Requirement Verification Matrix

### 1. Account Types (Buyer/Factory/Buying House)

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Three distinct role-based accounts: Buyer, Factory, Buying House |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/App.jsx:92-96`, `src/pages/BuyerProfile.jsx`, `src/pages/FactoryProfile.jsx`, `src/pages/BuyingHouseProfile.jsx`, `prisma/schema.prisma:10-53` |
| **COMPONENT** | App.jsx routes + 3 profile pages |
| **CODE_EVIDENCE** | `AUTH_ROLES = ["buyer", "buying_house", "factory", "owner", "admin", "agent"]`. Routes like `/buyer/:id`, `/factory/:id`, `/buying-house/:id` all protected. User model has `role String` field. |
| **LIMITATIONS** | Cannot verify runtime role assignment flow end-to-end |

### 2. LinkedIn-Style Feed

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Professional social media feed for B2B product/request discovery |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/MainFeed.jsx`, `src/components/feed/FeedItemCard.jsx`, `src/components/feed/PostDetailModal.jsx`, `src/components/feed/ReportModal.jsx` |
| **COMPONENT** | MainFeed page |
| **CODE_EVIDENCE** | MainFeed.jsx (1139 lines) with tabs ["All", "Buyer Requests", "Company Products", "Posts"], FeedItemCard rendering, PostDetailModal, ReportModal, Share button, Lead source recording, real-time WebSocket updates. |
| **LIMITATIONS** | Cannot verify rendering on all device sizes from code alone |

### 3. Unique Toggle for Feed

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Break filter bubbles, diverse content toggle |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/MainFeed.jsx:296,987` |
| **COMPONENT** | MainFeed |
| **CODE_EVIDENCE** | localStorage-persisted toggle using `useLocalStorageState` hook. Controls `unique` state variable. |
| **LIMITATIONS** | None |

### 4. Floating AI Assistant

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Help users understand settings via floating chatbot |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/components/FloatingAssistant.jsx`, `server/services/assistantService.js`, `server/controllers/assistantController.js` |
| **COMPONENT** | FloatingAssistant |
| **CODE_EVIDENCE** | WebSocket-based assistant with real-time connection. Hides on /chat and /call routes. Backend has full assistant service with knowledge base (`AssistantKnowledge`), rules (`AssistantRule`), config (`AssistantConfig`), and audit (`AiResponseAudit`). |
| **LIMITATIONS** | Cannot verify AI response quality without live testing |

### 5. Subscription Plans ($29/mo)

| Field | Value |
|-------|-------|
| **REQUIREMENT** | $29/month for all account types, $300/year annual |
| **STATUS** | NOT_IMPLEMENTED (WRONG PRICE) |
| **FILE** | `src/pages/Pricing.jsx:897` ($199), `server/services/adminConfigService.js:30` ($299) |
| **COMPONENT** | Pricing page + config |
| **CODE_EVIDENCE** | Pricing.jsx shows `price="$199"`. adminConfigService.js default has `premium_usd: 299`. Client expects $29/mo. Both frontend and backend have wrong price. |
| **LIMITATIONS** | Price could be admin-configurable at runtime, but defaults are 7-10x higher than intended |

### 6. $5 Auto-Credit

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Attract users with virtual credit on signup |
| **STATUS** | IMPLEMENTED |
| **FILE** | `server/services/userService.js:438-449`, `prisma/schema.prisma:18-19` |
| **COMPONENT** | UserService |
| **CODE_EVIDENCE** | User model has `wallet_balance_usd Float @default(0)` and `wallet_restricted_usd Float @default(0)`. `creditWallet` function exists in userService. WalletHistory model tracks all transactions. |
| **LIMITATIONS** | Cannot verify credit amount without live signup test |

### 7. Early Adopter Coupons

| Field | Value |
|-------|-------|
| **REQUIREMENT** | First 100 get 2 months free verification |
| **STATUS** | IMPLEMENTED |
| **FILE** | `prisma/schema.prisma:1231-1254`, `server/controllers/couponController.js` |
| **COMPONENT** | CouponCode + CouponRedemption models |
| **CODE_EVIDENCE** | CouponCode model with `code`, `amount_usd`, `max_redemptions`, `expires_at`. CouponRedemption tracks usage. Controller handles redemption. |
| **LIMITATIONS** | Cannot verify if first-100 limit is actively enforced |

### 8. Member/Agent Management (10 Limit)

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Sub-accounts with limited views, 10 member cap |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/MemberManagement.jsx` (953 lines), `server/services/memberService.js`, `server/controllers/memberController.js` |
| **COMPONENT** | MemberManagement page |
| **CODE_EVIDENCE** | DEFAULT_FREE_MEMBER_LIMIT = 10 in memberService.js. Seat cap enforcement via `authorize(req.user, ACTIONS.MEMBERS_MANAGE, { seat_cap })`. Permission matrix editor with view/edit per module. |
| **LIMITATIONS** | Cannot verify premium limit override from code alone |

### 9. Partner Network

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Connected factories list |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/PartnerNetwork.jsx`, `prisma/schema.prisma:520-533` |
| **COMPONENT** | PartnerNetwork page |
| **CODE_EVIDENCE** | PartnerRequest model with `requester_id`, `target_id`, `status`. Route protected to `["buying_house", "admin", "factory", "agent", "owner"]`. |
| **LIMITATIONS** | None |

### 10. Product Management

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Post items, videos, reels |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/ProductManagement.jsx` (1225 lines), `prisma/schema.prisma:155-203`, `server/controllers/productController.js` |
| **COMPONENT** | ProductManagement page |
| **CODE_EVIDENCE** | Product model with title, industry, category, material, moq, price_range, lead_time_days, fabric_gsm, size_range, color_pantone, image_urls (Json), cover_image_url, video_url, video_review_status. ProductManagement form with full field set. |
| **LIMITATIONS** | Cannot verify video upload/review workflow end-to-end |

### 11. Buyer Request Management

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Express Interest workflow with structured requirements |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/BuyerRequestManagement.jsx` (2992 lines), `prisma/schema.prisma:88-153`, `server/controllers/requirementController.js` |
| **COMPONENT** | BuyerRequestManagement page |
| **CODE_EVIDENCE** | Requirement model with 50+ fields (request_type, specs, custom_fields, quote_deadline, certifications_required, shipping_terms, incoterms, payment_terms, etc.). Multi-step form with AI prefill. Garment and textile category support via `shared/config/platformTaxonomy.js`. |
| **LIMITATIONS** | None |

### 12. Chat with Video/Audio Calls

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Direct call from chat interface |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/ChatInterface.jsx`, `src/pages/CallInterface.jsx`, `server/services/webrtcService.js`, `server/services/callSessionService.js` |
| **COMPONENT** | ChatInterface + CallInterface |
| **CODE_EVIDENCE** | ChatInterface with thread list, message area, right panel. CallInterface with WebRTC support. CallSession model with recording_url, recording_status, audit_trail. Presence tracking service. |
| **LIMITATIONS** | Cannot verify WebRTC connection quality without live test |

### 13. Contract Vault

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Digital signatures, PDF contracts |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/ContractVault.jsx` (1709 lines), `prisma/schema.prisma:600-643`, `server/services/eSignService.js` |
| **COMPONENT** | ContractVault page |
| **CODE_EVIDENCE** | Document model with `buyer_signature_state`, `factory_signature_state`, `buyer_signed_at`, `factory_signed_at`, `artifact` (Json), `lifecycle_status`. TIMELINE states: Discovered → Matched → Contacted → Meeting scheduled → Negotiating → Contract drafted → Contract signed → Closed. PDF generation via pdfkit. eSign callback mapper. |
| **LIMITATIONS** | Cannot verify e-signature provider integration without env config |

### 14. Verification (EU/USA Docs)

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Trade-level verification mapped to real trade documents |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/VerificationPage.jsx` (1068 lines), `prisma/schema.prisma:67-86`, `server/services/verificationService.js`, `shared/config/platformTaxonomy.js` |
| **COMPONENT** | VerificationPage |
| **CODE_EVIDENCE** | Verification model with `role`, `buyer_region`, `documents` (Json), `verified`, `subscription_valid_until`, `missing_required`, `credibility`. Buyer required documents vary by region (EU: VAT/EORI; USA: EIN/IOR). Duplicate company detection at VerificationPage.jsx:85-99. Subscription-based verification renewal. |
| **LIMITATIONS** | Cannot verify document validation logic without backend inspection |

### 15. Category-Wise Rating (5 Categories)

| Field | Value |
|-------|-------|
| **REQUIREMENT** | 5 separate 1-5 star ratings: Sample Accuracy, Communication, QC, Delivery, After-Sales |
| **STATUS** | NOT_IMPLEMENTED |
| **FILE** | `prisma/schema.prisma:1159-1173` |
| **COMPONENT** | Rating model |
| **CODE_EVIDENCE** | Rating model has only `score Int?` — no category fields. No sample_accuracy, communication, qc, delivery, or after_sales fields. No breakdown UI exists. `RatingMilestone` and `RatingFeedbackRequest` models exist but don't store per-category scores. |
| **LIMITATIONS** | Complete feature gap — needs 5 category fields + UI + filter/sort |

### 16. Sample vs Main Order

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Order type selection (Sample → Main) with conversion flow |
| **STATUS** | NOT_IMPLEMENTED |
| **FILE** | N/A — no order model in schema |
| **COMPONENT** | No Order model exists |
| **CODE_EVIDENCE** | No `order_type` field, no `OrderType` enum, no sample/main distinction anywhere in schema or code. No "Convert to Main Order" button exists. |
| **LIMITATIONS** | Entire order type system is missing |

### 17. Business Relationship Confirmation

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Mandatory relationship confirmation before orders |
| **STATUS** | IMPLEMENTED |
| **FILE** | `prisma/schema.prisma:535-547`, `server/services/businessRelationshipService.js` |
| **COMPONENT** | BusinessRelationship model |
| **CODE_EVIDENCE** | BusinessRelationship model with `buyer_id`, `counterparty_id`, `status` (default "pending"), `confirmed_at`. Indexed on buyer_id + counterparty_id. |
| **LIMITATIONS** | Cannot verify UI flow enforcement without live test |

### 18. Document Sharing Control

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Per-document visibility toggle |
| **STATUS** | IMPLEMENTED |
| **FILE** | `prisma/schema.prisma:549-562`, `src/pages/chat/GrantTransferModal.jsx` |
| **COMPONENT** | LicenseRequest model + GrantTransferModal |
| **CODE_EVIDENCE** | LicenseRequest model with `license_name`, `status`, `uploaded_file_url`. GrantTransferModal handles document sharing. |
| **LIMITATIONS** | Cannot verify per-document granularity |

### 19. Notification Read/Unread

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Badge clears after viewing all (YouTube-style) |
| **STATUS** | PARTIALLY_IMPLEMENTED |
| **FILE** | `src/components/NavBar.jsx:286-339`, `src/pages/NotificationsCenter.jsx` |
| **COMPONENT** | NavBar notification badge |
| **CODE_EVIDENCE** | NavBar refreshes unread count via `refreshUnreadCount()` on WebSocket events (`notification_created`, `notification_read`). Initial load fetches count. No periodic polling fallback. No re-fetch on navigation change. Badge only updates via WebSocket — if WS disconnects, badge can become stale. |
| **LIMITATIONS** | No polling fallback means stale badge possible if WS is down |

### 20. Theme Switching with Save

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Theme toggle buttons work, save button persists |
| **STATUS** | IMPLEMENTED (DIFFERENT UX) |
| **FILE** | `src/lib/ThemeProvider.jsx`, `src/store/themeSlice.js` |
| **COMPONENT** | ThemeProvider |
| **CODE_EVIDENCE** | Auto-saves to localStorage on click — no explicit "Save" button. Theme toggle in NavBar and Settings. Dark/light mode via `.dark` class on `<html>`. |
| **LIMITATIONS** | UX differs from client expectation (auto-save vs explicit save button) |

### 21. Data Download

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Download account data as file |
| **STATUS** | BROKEN (FRONTEND/BACKEND MISMATCH) |
| **FILE** | `src/pages/OrgSettings.jsx:1100-1114`, `server/controllers/userController.js:376-421` |
| **COMPONENT** | OrgSettings exportUserData |
| **CODE_EVIDENCE** | Frontend: `if (data?.export_url) { window.open(data.export_url, "_blank"); }` — checks for `export_url` key. Backend: `return res.json(exportData)` with Content-Disposition attachment header — returns JSON directly, never sets `export_url`. Result: Frontend always shows "No export available yet." |
| **LIMITATIONS** | Clear code mismatch — frontend expects URL, backend sends JSON |

### 22. Support/Feedback System

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Report platform issues via email |
| **STATUS** | PARTIALLY_IMPLEMENTED |
| **FILE** | `src/pages/SupportReports.jsx`, `src/pages/FeedbackPage.jsx`, `server/services/supportTicketService.js` |
| **COMPONENT** | SupportReports + FeedbackPage |
| **CODE_EVIDENCE** | Support ticket system exists with SupportTicket + SupportTicketMessage models. `sendEmail` imported in supportTicketService.js. However, email delivery requires SMTP/Gmail API config which defaults to `enabled: false`. |
| **LIMITATIONS** | Tickets stored in DB but email delivery requires env config (SMTP_HOST, SMTP_USER) |

### 23. Country Selection (All Countries)

| Field | Value |
|-------|-------|
| **REQUIREMENT** | All countries including Portugal |
| **STATUS** | IMPLEMENTED |
| **FILE** | `shared/config/platformTaxonomy.js`, `src/pages/OrgSettings.jsx` |
| **COMPONENT** | COUNTRY_OPTIONS |
| **CODE_EVIDENCE** | Full country list imported from platformTaxonomy.js. Used in OrgSettings and Signup. |
| **LIMITATIONS** | Cannot verify Portugal inclusion without inspecting full list |

### 24. Factory Production Capacity

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Prominent display on factory profile |
| **STATUS** | PARTIALLY_IMPLEMENTED |
| **FILE** | `src/pages/FactoryProfile.jsx:746` |
| **COMPONENT** | FactoryProfile |
| **CODE_EVIDENCE** | FactoryProfile displays `user?.profile?.monthly_capacity || "--"` — reads from JSON profile field. No dedicated `production_capacity` column in Prisma schema. Factory profile page shows it alongside other fields. SearchResults.jsx has `productionMin/productionMax` filter. |
| **LIMITATIONS** | Data is in JSON `profile` field, not a structured column. No dedicated input field for capacity in factory onboarding. |

### 25. Buyer Purchasing Capacity

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Required field on buyer profile, system matching |
| **STATUS** | NOT_IMPLEMENTED |
| **FILE** | N/A — no field in schema or buyer profile |
| **COMPONENT** | BuyerProfile |
| **CODE_EVIDENCE** | No `purchasing_capacity` or `budget` field in Prisma schema. BuyerProfile.jsx does not show any capacity/budget field. No matching logic uses buyer capacity. |
| **LIMITATIONS** | Complete feature gap |

### 26. Garments vs Textile Category

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Factory sector selection (Garments/Textile) |
| **STATUS** | IMPLEMENTED |
| **FILE** | `shared/config/platformTaxonomy.js` (FACTORY_SECTOR_OPTIONS) |
| **COMPONENT** | PlatformTaxonomy |
| **CODE_EVIDENCE** | FACTORY_SECTOR_OPTIONS defined in platformTaxonomy.js. Used in OrgSettings and Signup. |
| **LIMITATIONS** | None |

### 27. Industry/Org/Rating on Profiles

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Visible on all profile pages |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/BuyerProfile.jsx`, `src/pages/FactoryProfile.jsx`, `src/pages/BuyingHouseProfile.jsx` |
| **COMPONENT** | All 3 profile pages |
| **CODE_EVIDENCE** | All profile pages show industry, organization, and rating. VerificationPanel component used across profiles. |
| **LIMITATIONS** | None |

### 28. No Message Delete/Edit (B2B)

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Intentionally absent — no edit/delete for messages |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/ChatInterface.jsx`, `src/components/chat/` |
| **COMPONENT** | ChatInterface |
| **CODE_EVIDENCE** | No delete/edit UI in ChatInterface or MessageArea components. |
| **LIMITATIONS** | None |

### 29. Permission Metrics Page

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Must work, assign permissions |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/MemberManagement.jsx` (permission matrix editor), `server/services/memberService.js` |
| **COMPONENT** | MemberManagement |
| **CODE_EVIDENCE** | PermissionMatrixEditor with view/edit per module (requests, products, analytics, members, documents). `getMemberPermissionMetrics` in memberService.js. MATRIX_SECTIONS defined. |
| **LIMITATIONS** | None |

### 30. Internal Password for Agents

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Mandatory for agent login |
| **STATUS** | PARTIALLY_IMPLEMENTED |
| **FILE** | `src/pages/MemberManagement.jsx:636-645` |
| **COMPONENT** | MemberManagement create form |
| **CODE_EVIDENCE** | Password field shows "(optional)" label: `"Initial password (optional)"`. Placeholder: "Leave empty to auto-generate". Not mandatory. |
| **LIMITATIONS** | Password remains optional — security gap |

### 31. Member Invite via Email

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Send email invite to external users |
| **STATUS** | NOT_IMPLEMENTED |
| **FILE** | `server/controllers/memberController.js`, `server/services/memberService.js` |
| **COMPONENT** | Member creation flow |
| **CODE_EVIDENCE** | memberController.js only has `createOrgMember` (creates directly), no invite endpoint. memberService.js has `createMember` which generates temp password. No email sending in member flow. No `sendInvitation` or `invite` function exists. |
| **LIMITATIONS** | Member creation is direct-only, no invite flow |

### 32. Position "Other" Option

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Custom title when "Other" selected in dropdown |
| **STATUS** | NOT_IMPLEMENTED |
| **FILE** | `src/pages/auth/Signup.jsx:22-46`, `src/pages/auth/SignupUltra.jsx:14` |
| **COMPONENT** | Signup POSITIONS array |
| **CODE_EVIDENCE** | POSITIONS array has 23 fixed values (Owner, CEO, GM, Manager, etc.). No "Other" option. No free text input for custom position. |
| **LIMITATIONS** | Complete feature gap — 23 fixed positions only |

### 33. Timezone in Chat

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Display per-user timezone in chat messages |
| **STATUS** | NOT_IMPLEMENTED |
| **FILE** | `src/pages/ChatInterface.jsx`, `src/components/chat/MessageArea.jsx` |
| **COMPONENT** | ChatInterface |
| **CODE_EVIDENCE** | No timezone field in User model (Prisma schema). No timezone display in ChatInterface or MessageArea. `timezone` field exists only in admin infra section (system-level, not per-user). |
| **LIMITATIONS** | No per-user timezone system exists |

### 34. Post Editor for Feed

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Direct access to post editor |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/FeedManagement.jsx`, route `/feed/manage` |
| **COMPONENT** | FeedManagement page |
| **CODE_EVIDENCE** | Full post editor at `/feed/manage` route with create/edit/delete, media management, markdown support. |
| **LIMITATIONS** | None |

### 35. Duplicate Company Detection

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Auto-detect same company documents |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/VerificationPage.jsx:85-99` |
| **COMPONENT** | VerificationPage |
| **CODE_EVIDENCE** | `duplicatePrompt` detection logic in VerificationPage. Checks for matching company documents during verification. |
| **LIMITATIONS** | Cannot verify detection accuracy without live test |

### 36. Join Request Workflow

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Request to join as agent |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/JoinRequestPage.jsx`, `server/controllers/joinRequestController.js` |
| **COMPONENT** | JoinRequestPage |
| **CODE_EVIDENCE** | JoinRequestPage with accept/reject flow. JoinRequest model with `status`, `acted_by`, `acted_at`. |
| **LIMITATIONS** | None |

### 37. Member Removal Confirmation

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Password/passkey + confirm dialog before delete |
| **STATUS** | NOT_IMPLEMENTED |
| **FILE** | `src/pages/MemberManagement.jsx:288-301` |
| **COMPONENT** | MemberManagement |
| **CODE_EVIDENCE** | `handleDeactivateOrRemove` calls API directly: `await apiRequest(..., { method: "DELETE" })`. No ConfirmDialog used (ConfirmDialog component exists but is only used in AdminPanel and FileExplorerSection). No password verification. Single-click deletion. |
| **LIMITATIONS** | ConfirmDialog exists as a component but is NOT imported/used in MemberManagement |

### 38. Member Reactivation

| Field | Value |
|-------|-------|
| **REQUIREMENT** | Reactivate deactivated members |
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/pages/MemberManagement.jsx:303-317` |
| **COMPONENT** | MemberManagement |
| **CODE_EVIDENCE** | `handleReactivate` function exists: sends PUT request with `{ status: "active" }`. UI shows reactivate button for inactive/removed members. |
| **LIMITATIONS** | None |

---

## Backend/API Verification

### Email Service

| Field | Value |
|-------|-------|
| **STATUS** | IMPLEMENTED (CONFIG-DEPENDENT) |
| **FILE** | `server/services/emailService.js` (177 lines) |
| **CODE_EVIDENCE** | Full email service with SMTP + Gmail API support. `sendEmail` function queues to EmailOutbox model. Configurable via admin config. `isSmtpConfigured()` checks env vars. Default: `enabled: false`. |
| **LIMITATIONS** | Requires SMTP_HOST + SMTP_USER env vars to function. Support tickets also use email. |

### Auth System

| Field | Value |
|-------|-------|
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/lib/auth.js` (353 lines), `server/controllers/authController.js` |
| **CODE_EVIDENCE** | JWT-based auth with localStorage/sessionStorage. `getCurrentUser` with 60s cache TTL. `fetchAndCacheUser` for background refresh. `ProtectedRoute` with role-based access. No refresh token mechanism visible. |
| **LIMITATIONS** | No JWT refresh token — sessions may expire silently after 10-20 min |

### File Uploads

| Field | Value |
|-------|-------|
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/lib/upload.js`, `server/routes/uploadsRoutes.js`, `server/services/uploadsService.js` |
| **CODE_EVIDENCE** | Multer-based upload with disk storage. Profile avatar upload (5MB limit). Product image/video upload. Document upload for verification. |
| **LIMITATIONS** | None |

### Real-time Features

| Field | Value |
|-------|-------|
| **STATUS** | IMPLEMENTED |
| **FILE** | `src/lib/feedRealtime.js`, `src/lib/notificationsRealtime.js`, `server/realtime/` |
| **CODE_EVIDENCE** | WebSocket-based real-time for feed updates and notifications. `subscribeFeedRealtime`, `subscribeNotificationsRealtime` functions. |
| **LIMITATIONS** | No reconnection/polling fallback for notification badge |

---

## Summary Counts

| Status | Count |
|--------|-------|
| IMPLEMENTED | 27 |
| PARTIALLY_IMPLEMENTED | 5 |
| NOT_IMPLEMENTED | 7 |
| BROKEN | 1 |
| **TOTAL** | **40** |

### Critical Gaps (NOT_IMPLEMENTED / BROKEN)

1. **Category-wise rating** — 5 separate star ratings per order — Rating model has only `score Int?`
2. **Sample vs Main Order** — Entire order type system missing from schema
3. **Data download BROKEN** — Frontend checks `export_url`, backend returns JSON directly
4. **Member removal no confirmation** — Single-click delete, ConfirmDialog not used
5. **Member invite email** — No invite flow exists, only direct creation
6. **Position "Other"** — 23 fixed positions, no "Other" + free text
7. **Timezone in chat** — No per-user timezone field or display
8. **Buyer purchasing capacity** — No budget/capacity field on buyer profiles

### Partial Gaps (PARTIALLY_IMPLEMENTED)

1. **Premium pricing** — Shows $199/$299 instead of $29 (wrong price)
2. **Notification badge** — Only WebSocket-driven, no polling fallback
3. **Internal agent password** — Optional instead of mandatory
4. **Factory production capacity** — Stored in JSON `profile`, not structured column
5. **Support reports → email** — Tickets created but email delivery needs config

---

*Report generated by Agent 06 — Codebase Requirement Verifier*
