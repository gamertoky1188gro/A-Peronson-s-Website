# Controllers Documentation

**Location:** `server/controllers/`

## Complete Controller List (56 files)

| #   | Controller                      | Purpose                                   | Status |
| --- | ------------------------------- | ----------------------------------------- | ------ |
| 1   | adminController.js              | Admin panel operations, config, actions   | ✅     |
| 2   | adminMasterController.js        | Master admin operations                   | ✅     |
| 3   | adminOpsController.js           | Admin operations, bulk actions            | ✅     |
| 4   | adminCatalogController.js       | Admin catalog management                  | ✅     |
| 5   | agentSubIdController.js         | Agent sub-ID management                   | ✅     |
| 6   | aiController.js                 | AI endpoints, orchestration               | ✅     |
| 7   | analyticsController.js          | Analytics data, aggregations              | ✅     |
| 8   | assistantController.js          | AI assistant/chatbot                      | ✅     |
| 9   | authController.js               | Authentication, login, register, passkeys | ✅     |
| 10  | boostController.js              | Product boost/promotion                   | ✅     |
| 11  | callSessionController.js        | Video/audio calls                         | ✅     |
| 12  | certificationController.js      | Order certification                       | ✅     |
| 13  | chatbotController.js            | Chatbot AI                                | ✅     |
| 14  | cmsController.js                | Content management                        | ✅     |
| 15  | conversationController.js       | Chat conversations                        | ✅     |
| 16  | couponController.js             | Coupon management                         | ✅     |
| 17  | crmController.js                | CRM operations                            | ✅     |
| 18  | dealJourneyController.js        | Deal pipeline/journey                     | ✅     |
| 19  | documentController.js           | Document upload/management                | ✅     |
| 20  | eSignController.js              | Electronic signatures                     | ✅     |
| 21  | eventController.js              | Event tracking                            | ✅     |
| 22  | exportController.js             | Data export                               | ✅     |
| 23  | feedController.js               | Feed/activity                             | ✅     |
| 24  | feedPostController.js           | Feed posts                                | ✅     |
| 25  | feedUploadController.js         | Feed media uploads                        | ✅     |
| 26  | geoController.js                | Geographic data                           | ✅     |
| 27  | governanceController.js         | Policy governance                         | ✅     |
| 28  | industryController.js           | Industry data                             | ✅     |
| 29  | infraController.js              | Infrastructure management                 | ✅     |
| 30  | integrationController.js        | Integrations                              | ✅     |
| 31  | leadController.js               | Lead management (CRM)                     | ✅     |
| 32  | memberController.js             | Member management                         | ✅     |
| 33  | moderationController.js         | Content moderation                        | ✅     |
| 34  | networkController.js            | Network operations                        | ✅     |
| 35  | notificationController.js       | Notifications                             | ✅     |
| 36  | onboardingController.js         | User onboarding                           | ✅     |
| 37  | orderCertificationController.js | Order certification admin                 | ✅     |
| 38  | orgOperationsController.js      | Org operations                            | ✅     |
| 39  | partnerNetworkController.js     | Partner network                           | ✅     |
| 40  | paymentProofController.js       | Payment proof verification                | ✅     |
| 41  | presetsController.js            | Filter presets                            | ✅     |
| 42  | presenceController.js           | Online presence                           | ✅     |
| 43  | productController.js            | Product CRUD                              | ✅     |
| 44  | profileController.js            | User profiles                             | ✅     |
| 45  | ratingsController.js            | Ratings/reviews                           | ✅     |
| 46  | reportController.js             | Reporting                                 | ✅     |
| 47  | requirementController.js        | Buyer requirements/RFQs                   | ✅     |
| 48  | securityController.js           | Security operations                       | ✅     |
| 49  | serverAdminController.js        | Server admin ops                          | ✅     |
| 50  | socialController.js             | Social features (comments, follow)        | ✅     |
| 51  | subscriptionController.js       | Subscriptions                             | ✅     |
| 52  | supportController.js            | Support tickets                           | ✅     |
| 53  | systemController.js             | System config                             | ✅     |
| 54  | userController.js               | User management                           | ✅     |
| 55  | verificationController.js       | User verification                         | ✅     |
| 56  | walletController.js             | Wallet/credits                            | ✅     |
| 57  | workflowLifecycleController.js  | Workflow lifecycles                       | ✅     |

---

## 1. Auth Controller

**File:** `server/controllers/authController.js`

### Functions

| Function                               | Parameters | Returns | Description                                        |
| -------------------------------------- | ---------- | ------- | -------------------------------------------------- |
| `register(req, res)`                   | req, res   | JSON    | Register new user with email, name, password, role |
| `login(req, res)`                      | req, res   | JSON    | Login with email or agent ID + password            |
| `me(req, res)`                         | req, res   | JSON    | Get current user profile                           |
| `logout(req, res)`                     | req, res   | JSON    | Logout (invalidate token server-side)              |
| `passkeyLoginOptions(req, res)`        | req, res   | JSON    | Get passkey login options (WebAuthn)               |
| `passkeyLoginVerify(req, res)`         | req, res   | JSON    | Verify passkey login response                      |
| `passkeyRegistrationOptions(req, res)` | req, res   | JSON    | Get passkey registration options                   |
| `passkeyRegistrationVerify(req, res)`  | req, res   | JSON    | Verify passkey registration                        |
| `passkeyList(req, res)`                | req, res   | JSON    | List user's passkeys                               |
| `passkeyRemove(req, res)`              | req, res   | JSON    | Remove a passkey                                   |

### Dependencies

- `userService.js` - findUserByEmail, findUserById, findUserByMemberId, registerUser, verifyPassword
- `walletService.js` - assertCouponRedeemable
- `passkeyService.js` - passkey operations
- `entitlementService.js` - getEntitlements
- `validators.js` - requireFields, validateEmail, validateRole

### API Endpoints

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- POST `/api/auth/logout`
- POST `/api/auth/passkey/login/options`
- POST `/api/auth/passkey/login/verify`
- POST `/api/auth/passkey/registration/options`
- POST `/api/auth/passkey/registration/verify`
- GET `/api/auth/passkeys`
- DELETE `/api/auth/passkeys/:credentialId`

---

## 2. User Controller

**File:** `server/controllers/userController.js`

### Functions

| Function                  | Parameters | Returns | Description                    |
| ------------------------- | ---------- | ------- | ------------------------------ |
| `listUsers(req, res)`     | req, res   | JSON    | List all users with pagination |
| `getUser(req, res)`       | req, res   | JSON    | Get user by ID                 |
| `updateUser(req, res)`    | req, res   | JSON    | Update user profile            |
| `deleteUser(req, res)`    | req, res   | JSON    | Soft-delete user               |
| `searchUsers(req, res)`   | req, res   | JSON    | Search users by query          |
| `lookupUsers(req, res)`   | req, res   | JSON    | Lookup users by IDs            |
| `friendRequest(req, res)` | req, res   | JSON    | Send friend request            |
| `follow(req, res)`        | req, res   | JSON    | Follow a user                  |
| `unfollow(req, res)`      | req, res   | JSON    | Unfollow a user                |

### Dependencies

- `userService.js`
- `friendService.js`

### API Endpoints

- GET `/api/users`
- GET `/api/users/:id`
- PATCH `/api/users/:id`
- DELETE `/api/users/:id`
- GET `/api/users/search`
- POST `/api/users/lookup`
- POST `/api/users/:id/friend-request`
- POST `/api/users/:id/follow`
- DELETE `/api/users/:id/follow`

---

## 3. Wallet Controller

**File:** `server/controllers/walletController.js`

### Functions

| Function                       | Parameters | Returns | Description                |
| ------------------------------ | ---------- | ------- | -------------------------- |
| `getWallet(req, res)`          | req, res   | JSON    | Get user wallet balance    |
| `creditWallet(req, res)`       | req, res   | JSON    | Add credits to wallet      |
| `debitWallet(req, res)`        | req, res   | JSON    | Deduct credits from wallet |
| `refundWallet(req, res)`       | req, res   | JSON    | Refund credits             |
| `transactionHistory(req, res)` | req, res   | JSON    | Get transaction history    |

### Dependencies

- `walletService.js`

### API Endpoints

- GET `/api/wallet`
- POST `/api/wallet/credit`
- POST `/api/wallet/debit`
- POST `/api/wallet/refund`
- GET `/api/wallet/transactions`

---

## 4. Verification Controller

**File:** `server/controllers/verificationController.js`

### Functions

| Function                       | Parameters | Returns | Description                   |
| ------------------------------ | ---------- | ------- | ----------------------------- |
| `getVerification(req, res)`    | req, res   | JSON    | Get verification status       |
| `submitVerification(req, res)` | req, res   | JSON    | Submit verification documents |
| `reviewVerification(req, res)` | req, res   | JSON    | Admin review verification     |
| `revokeVerification(req, res)` | req, res   | JSON    | Revoke verification           |

### Dependencies

- `verificationService.js`

### API Endpoints

- GET `/api/verification`
- POST `/api/verification/submit`
- POST `/api/verification/review`
- POST `/api/verification/revoke`

---

## 5. Product Controller

**File:** `server/controllers/productController.js`

### Functions

| Function                   | Parameters | Returns | Description                |
| -------------------------- | ---------- | ------- | -------------------------- |
| `listProducts(req, res)`   | req, res   | JSON    | List products with filters |
| `getProduct(req, res)`     | req, res   | JSON    | Get product by ID          |
| `createProduct(req, res)`  | req, res   | JSON    | Create new product         |
| `updateProduct(req, res)`  | req, res   | JSON    | Update product             |
| `deleteProduct(req, res)`  | req, res   | JSON    | Delete product             |
| `searchProducts(req, res)` | req, res   | JSON    | Search products            |

### Dependencies

- `productService.js`
- `productViewService.js`

### API Endpoints

- GET `/api/products`
- GET `/api/products/:id`
- POST `/api/products`
- PATCH `/api/products/:id`
- DELETE `/api/products/:id`
- GET `/api/products/search`

---

## 6. Requirement Controller

**File:** `server/controllers/requirementController.js`

### Functions

| Function                       | Parameters | Returns | Description            |
| ------------------------------ | ---------- | ------- | ---------------------- |
| `listRequirements(req, res)`   | req, res   | JSON    | List buyer requests    |
| `getRequirement(req, res)`     | req, res   | JSON    | Get requirement by ID  |
| `createRequirement(req, res)`  | req, res   | JSON    | Create new requirement |
| `updateRequirement(req, res)`  | req, res   | JSON    | Update requirement     |
| `deleteRequirement(req, res)`  | req, res   | JSON    | Delete requirement     |
| `searchRequirements(req, res)` | req, res   | JSON    | Search requirements    |

### Dependencies

- `requirementService.js`
- `matchingService.js`

### API Endpoints

- GET `/api/requirements`
- GET `/api/requirements/:id`
- POST `/api/requirements`
- PATCH `/api/requirements/:id`
- DELETE `/api/requirements/:id`
- GET `/api/requirements/search`

---

## 7. Lead Controller

**File:** `server/controllers/leadController.js`

### Functions

| Function                     | Parameters | Returns | Description                |
| ---------------------------- | ---------- | ------- | -------------------------- |
| `getLeads(req, res)`         | req, res   | JSON    | List CRM leads             |
| `getLead(req, res)`          | req, res   | JSON    | Get lead by ID             |
| `patchLead(req, res)`        | req, res   | JSON    | Update lead                |
| `postLeadNote(req, res)`     | req, res   | JSON    | Add note to lead           |
| `postLeadReminder(req, res)` | req, res   | JSON    | Set reminder for lead      |
| `getLeadForMatch(req, res)`  | req, res   | JSON    | Get lead for match context |

### Dependencies

- `leadService.js`
- `leadReminderService.js`

### API Endpoints

- GET `/api/leads`
- GET `/api/leads/:leadId`
- PATCH `/api/leads/:leadId`
- POST `/api/leads/:leadId/notes`
- POST `/api/leads/:leadId/reminders`
- GET `/api/leads/by-match/:matchId`

---

## 8. Message Controller

**File:** `server/controllers/messageController.js`

### Functions

| Function                    | Parameters | Returns | Description             |
| --------------------------- | ---------- | ------- | ----------------------- |
| `listMessages(req, res)`    | req, res   | JSON    | List messages in thread |
| `sendMessage(req, res)`     | req, res   | JSON    | Send message            |
| `deleteMessage(req, res)`   | req, res   | JSON    | Delete message          |
| `flagMessage(req, res)`     | req, res   | JSON    | Flag message            |
| `takedownMessage(req, res)` | req, res   | JSON    | Admin takedown          |

### Dependencies

- `messageService.js`
- `moderationService.js`

### API Endpoints

- GET `/api/messages`
- POST `/api/messages`
- DELETE `/api/messages/:id`
- POST `/api/messages/:id/flag`
- POST `/api/messages/:id/takedown`

---

## 9. Subscription Controller

**File:** `server/controllers/subscriptionController.js`

### Functions

| Function                       | Parameters | Returns | Description           |
| ------------------------------ | ---------- | ------- | --------------------- |
| `getSubscription(req, res)`    | req, res   | JSON    | Get user subscription |
| `createSubscription(req, res)` | req, res   | JSON    | Create subscription   |
| `updateSubscription(req, res)` | req, res   | JSON    | Update subscription   |
| `cancelSubscription(req, res)` | req, res   | JSON    | Cancel subscription   |
| `renewSubscription(req, res)`  | req, res   | JSON    | Manual renew          |

### Dependencies

- `subscriptionService.js`
- `subscriptionHistoryService.js`

### API Endpoints

- GET `/api/subscriptions`
- POST `/api/subscriptions`
- PATCH `/api/subscriptions/:id`
- DELETE `/api/subscriptions/:id`
- POST `/api/subscriptions/:id/renew`

---

## 10. Admin Controller

**File:** `server/controllers/adminController.js`

### Functions

| Function                  | Parameters | Returns | Description          |
| ------------------------- | ---------- | ------- | -------------------- |
| `getConfig(req, res)`     | req, res   | JSON    | Get admin config     |
| `updateConfig(req, res)`  | req, res   | JSON    | Update admin config  |
| `executeAction(req, res)` | req, res   | JSON    | Execute admin action |
| `listMetrics(req, res)`   | req, res   | JSON    | Get platform metrics |
| `exportEmails(req, res)`  | req, res   | CSV     | Export email list    |

### Dependencies

- `adminConfigService.js`
- `adminDynamicConfigService.js`
- `adminActionService.js`

### API Endpoints

- GET `/admin/config`
- POST `/admin/config`
- POST `/admin/actions`
- GET `/admin/metrics`
- GET `/admin/export-emails`

---

_To be continued with remaining controllers..._

---

_Generated from source: server/controllers/_
