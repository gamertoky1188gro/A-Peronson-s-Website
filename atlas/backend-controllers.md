# backend-controllers

- **Parent**: (none — under `server/`)
- **Purpose**: Request handlers — parse input, enforce guards, delegate to services, shape responses. 63 files.
- **Key Files**: `server/controllers/feedController.js`, `feedPostController.js`, `feedStreamController.js`, `feedUploadController.js`, `authController.js`, `userController.js`, `memberController.js`, `syncController.js`, `seoRoutes.js` companion `botMeta`, `securityController.js`, `logController.js`, `orgOperationsController.js`
- **Dependencies**: backend-services, backend-middleware, backend-utils, backend-sync
- **Dependents**: backend-routes
- **Exposes**: Per-domain handlers (~63 files); `logController` accepts `{level,message,data,user,url,stack}` or `{batch:[…]}` and stamps pubip/user-id/role into the log hub.

## Internal Structure
- **Feed/social**: feedController, feedPostController, feedStreamController (SSE + delta replay), feedUploadController, socialController, linkPreviewController, ratingsController, networkController, moderationController.
- **Comms**: conversationController, messageController, callSessionController, notificationController.
- **Marketplace**: productController, requirementController, leadController, crmController, dealJourneyController, workflowLifecycleController, orderCertificationAdminController, certificationController, partnerNetworkController, industryController, geoController.
- **Identity/tenancy**: authController, userController (incl. public `/users/lookup`), memberController, orgOperationsController, profileController, presenceController, onboardingController, verificationController, paymentProofController, passkeyController (via auth).
- **Admin/ops**: adminController + adminMasterController + adminCatalogController + adminOpsController, serverAdminController, securityController, infraController, integrationController, systemController, diagnosticsController, presetsController, cmsController, logController, exportController, syncController.
- **Billing/AI/support**: subscriptionController, walletController, couponController, boostController, aiController, assistantController, chatbotController, reportController, supportController.

## Gotchas
- **Entitlement gates are never premium-locked for team access** — the three `ensureEntitlement("team_access_management")` gates in `memberController.js` were removed; free is bounded only by the 3-seat cap.
- `userService.shapeLookupUser()` / `lookupPublicUsers()` strip `email`, `username`, and `profile.phone` for strangers; self, platform admin/owner, and same-org members keep them.
- Chatbot premium entitlement returns **403**, not 500.