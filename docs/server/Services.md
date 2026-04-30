# Services Documentation

**Location:** `server/services/`

## Complete Service List (78 files)

| #   | Service                       | Purpose                 | Status |
| --- | ----------------------------- | ----------------------- | ------ |
| 1   | adminActionService.js         | Admin action execution  | ✅     |
| 2   | adminConfigService.js         | Admin configuration     | ✅     |
| 3   | adminDynamicConfigService.js  | Dynamic config          | ✅     |
| 4   | adminCatalogService.js        | Catalog management      | ✅     |
| 5   | adminMasterService.js         | Master admin ops        | ✅     |
| 6   | agentSubIdService.js          | Agent sub-IDs           | ✅     |
| 7   | aiConversationService.js      | AI conversation         | ✅     |
| 8   | aiOrchestrationService.js     | AI orchestration        | ✅     |
| 9   | aiVerifier.js                 | AI content verification | ✅     |
| 10  | analyticsService.js           | Analytics data          | ✅     |
| 11  | analyticsGovernanceService.js | Analytics governance    | ✅     |
| 12  | analyticsExportService.js     | Analytics export        | ✅     |
| 13  | assistantService.js           | Assistant/AI            | ✅     |
| 14  | authorizationService.js       | Authorization           | ✅     |
| 15  | boostService.js               | Product boosting        | ✅     |
| 16  | callSessionService.js         | Call sessions           | ✅     |
| 17  | certificationService.js       | Certifications          | ✅     |
| 18  | chatbotService.js             | Chatbot AI              | ✅     |
| 19  | cmsService.js                 | CMS                     | ✅     |
| 20  | communicationPolicyService.js | Comm policy             | ✅     |
| 21  | conversationLockService.js    | Conversation locks      | ✅     |
| 22  | crmService.js                 | CRM                     | ✅     |
| 23  | currencyService.js            | Currency/FX             | ✅     |
| 24  | dealJourneyService.js         | Deal journey            | ✅     |
| 25  | documentService.js            | Documents               | ✅     |
| 26  | eSignCallbackMapper.js        | E-sign callbacks        | ✅     |
| 27  | eSignProvider.js              | E-sign providers        | ✅     |
| 28  | eSignService.js               | E-signatures            | ✅     |
| 29  | emailService.js               | Email sending           | ✅     |
| 30  | enforcementService.js         | Enforcement             | ✅     |
| 31  | entitlementService.js         | Entitlements            | ✅     |
| 32  | enterpriseOpsService.js       | Enterprise ops          | ✅     |
| 33  | esignRetryService.js          | E-sign retries          | ✅     |
| 34  | eventIngestionService.js      | Event ingestion         | ✅     |
| 35  | eventTrackingService.js       | Event tracking          | ✅     |
| 36  | feedPostService.js            | Feed posts              | ✅     |
| 37  | feedService.js                | Feed/activity           | ✅     |
| 38  | friendService.js              | Friends/follow          | ✅     |
| 39  | geoService.js                 | Geographic data         | ✅     |
| 40  | industryService.js            | Industry data           | ✅     |
| 41  | infraService.js               | Infrastructure          | ✅     |
| 42  | integrationStatusService.js   | Integration status      | ✅     |
| 43  | leadReminderService.js        | Lead reminders          | ✅     |
| 44  | leadService.js                | Lead management         | ✅     |
| 45  | matchingService.js            | Matching algorithm      | ✅     |
| 46  | memberService.js              | Member management       | ✅     |
| 47  | messageService.js             | Messages                | ✅     |
| 48  | networkService.js             | Network ops             | ✅     |
| 49  | notificationService.js        | Notifications           | ✅     |
| 50  | openSearchService.js          | Search engine           | ✅     |
| 51  | orderCertificationService.js  | Order certification     | ✅     |
| 52  | orgAiService.js               | Org AI                  | ✅     |
| 53  | orgOperationsService.js       | Org operations          | ✅     |
| 54  | partnerNetworkService.js      | Partner network         | ✅     |
| 55  | passkeyService.js             | Passkey/WebAuthn        | ✅     |
| 56  | paymentProofService.js        | Payment proof           | ✅     |
| 57  | policyRegistryService.js      | Policy registry         | ✅     |
| 58  | policyService.js              | Policy management       | ✅     |
| 59  | presenceService.js            | Online presence         | ✅     |
| 60  | presetsService.js             | Filter presets          | ✅     |
| 61  | productService.js             | Products                | ✅     |
| 62  | productViewService.js         | Product views           | ✅     |
| 63  | profileService.js             | Profiles                | ✅     |
| 64  | ratingsService.js             | Ratings/reviews         | ✅     |
| 65  | refundService.js              | Refunds                 | ✅     |
| 66  | reportService.js              | Reporting               | ✅     |
| 67  | searchAccessService.js        | Search access           | ✅     |
| 68  | securityService.js            | Security                | ✅     |
| 69  | serverAdminService.js         | Server admin            | ✅     |
| 70  | socialService.js              | Social features         | ✅     |
| 71  | subscriptionHistoryService.js | Sub history             | ✅     |
| 72  | subscriptionService.js        | Subscriptions           | ✅     |
| 73  | supportTicketService.js       | Support tickets         | ✅     |
| 74  | trustRiskScoringService.js    | Trust scoring           | ✅     |
| 75  | userService.js                | User management         | ✅     |
| 76  | verificationService.js        | Verification            | ✅     |
| 77  | walletService.js              | Wallet/credits          | ✅     |
| 78  | webrtcService.js              | WebRTC                  | ✅     |

---

## 1. User Service

**File:** `server/services/userService.js`

### Functions

| Function                         | Parameters       | Returns     | Description             |
| -------------------------------- | ---------------- | ----------- | ----------------------- |
| `findUserById(id)`               | id: string       | User object | Find user by ID         |
| `findUserByEmail(email)`         | email: string    | User object | Find user by email      |
| `findUserByMemberId(memberId)`   | memberId: string | User object | Find agent by member_id |
| `findUserByUsername(username)`   | username: string | User object | Find user by username   |
| `registerUser(data)`             | data: object     | User object | Create new user         |
| `updateUser(id, data)`           | id, data         | User object | Update user             |
| `deleteUser(id)`                 | id: string       | User object | Soft delete user        |
| `verifyPassword(user, password)` | user, password   | boolean     | Verify password         |
| `searchUsers(query, options)`    | query, options   | User[]      | Search users            |

### Database Tables

- `users` - Main user table

### Dependencies

- `prisma.js` - Database access
- `bcryptjs` - Password hashing

---

## 2. Wallet Service

**File:** `server/services/walletService.js`

### Functions

| Function                               | Parameters             | Returns       | Description             |
| -------------------------------------- | ---------------------- | ------------- | ----------------------- |
| `getWallet(userId)`                    | userId: string         | Wallet object | Get wallet balance      |
| `creditWallet(userId, amount, reason)` | userId, amount, reason | Transaction   | Add credits             |
| `debitWallet(userId, amount, reason)`  | userId, amount, reason | Transaction   | Deduct credits          |
| `refundWallet(userId, amount, ref)`    | userId, amount, ref    | Transaction   | Refund credits          |
| `getTransactions(userId, options)`     | userId, options        | Transaction[] | Get transaction history |
| `assertCouponRedeemable(code)`         | code: string           | Coupon        | Validate coupon         |
| `redeemCoupon(userId, code)`           | userId, code           | Redemption    | Redeem coupon           |

### Database Tables

- `wallets` - Wallet balances
- `wallet_transactions` - Transaction log
- `coupons` - Coupon codes
- `coupon_redemptions` - Redemption history

---

## 3. Verification Service

**File:** `server/services/verificationService.js`

### Functions

| Function                                | Parameters        | Returns             | Description                  |
| --------------------------------------- | ----------------- | ------------------- | ---------------------------- |
| `getVerification(userId)`               | userId: string    | Verification object | Get verification status      |
| `submitVerification(userId, documents)` | userId, documents | Verification        | Submit documents             |
| `approveVerification(userId)`           | userId: string    | Verification        | Approve verification         |
| `rejectVerification(userId, reason)`    | userId, reason    | Verification        | Reject verification          |
| `revokeVerification(userId, reason)`    | userId, reason    | Verification        | Revoke verification          |
| `checkExpiring()`                       | -                 | Verification[]      | Check expiring verifications |

### Database Tables

- `verification` - Verification records

---

## 4. Product Service

**File:** `server/services/productService.js`

### Functions

| Function                         | Parameters       | Returns   | Description              |
| -------------------------------- | ---------------- | --------- | ------------------------ |
| `createProduct(factoryId, data)` | factoryId, data  | Product   | Create product           |
| `getProduct(id)`                 | id: string       | Product   | Get product by ID        |
| `updateProduct(id, data)`        | id, data         | Product   | Update product           |
| `deleteProduct(id)`              | id: string       | Product   | Delete product           |
| `listProducts(filters, options)` | filters, options | Product[] | List products            |
| `searchProducts(query, options)` | query, options   | Product[] | Search products          |
| `boostProduct(id, duration)`     | id, duration     | Boost     | Boost product visibility |

### Database Tables

- `products` - Product listings

---

## 5. Requirement Service

**File:** `server/services/requirementService.js`

### Functions

| Function                             | Parameters        | Returns       | Description                |
| ------------------------------------ | ----------------- | ------------- | -------------------------- |
| `createRequirement(buyerId, data)`   | buyerId, data     | Requirement   | Create buyer request       |
| `getRequirement(id)`                 | id: string        | Requirement   | Get requirement            |
| `updateRequirement(id, data)`        | id, data          | Requirement   | Update requirement         |
| `deleteRequirement(id)`              | id: string        | Requirement   | Delete requirement         |
| `listRequirements(filters, options)` | filters, options  | Requirement[] | List requirements          |
| `searchRequirements(query, options)` | query, options    | Requirement[] | Search requirements        |
| `matchRequirements(productId)`       | productId: string | Requirement[] | Find matching requirements |

### Database Tables

- `requirements` - Buyer requests/RFQs

---

## 6. Lead Service

**File:** `server/services/leadService.js`

### Functions

| Function                               | Parameters              | Returns      | Description     |
| -------------------------------------- | ----------------------- | ------------ | --------------- |
| `createLead(orgOwnerId, data)`         | orgOwnerId, data        | Lead         | Create lead     |
| `getLead(id)`                          | id: string              | Lead         | Get lead        |
| `updateLead(id, data)`                 | id, data                | Lead         | Update lead     |
| `listLeads(orgOwnerId, filters)`       | orgOwnerId, filters     | Lead[]       | List leads      |
| `assignLead(leadId, agentId)`          | leadId, agentId         | Lead         | Assign to agent |
| `addNote(leadId, authorId, note)`      | leadId, authorId, note  | LeadNote     | Add note        |
| `setReminder(leadId, creatorId, data)` | leadId, creatorId, data | LeadReminder | Set reminder    |

### Database Tables

- `leads` - CRM leads
- `lead_notes` - Lead notes
- `lead_reminders` - Lead reminders
- `lead_assignments` - Agent assignments

---

## 7. Message Service

**File:** `server/services/messageService.js`

### Functions

| Function                                         | Parameters                | Returns   | Description    |
| ------------------------------------------------ | ------------------------- | --------- | -------------- |
| `sendMessage(senderId, conversationId, content)` | senderId, convId, content | Message   | Send message   |
| `getMessages(conversationId, options)`           | convId, options           | Message[] | Get messages   |
| `deleteMessage(messageId)`                       | messageId: string         | Message   | Delete message |
| `flagMessage(messageId, reason)`                 | messageId, reason         | Message   | Flag message   |
| `takedownMessage(messageId, reason)`             | messageId, reason         | Message   | Admin takedown |

### Database Tables

- `conversations` - Chat threads
- `messages` - Individual messages

---

## 8. Subscription Service

**File:** `server/services/subscriptionService.js`

### Functions

| Function                           | Parameters     | Returns        | Description              |
| ---------------------------------- | -------------- | -------------- | ------------------------ |
| `createSubscription(userId, plan)` | userId, plan   | Subscription   | Create subscription      |
| `getSubscription(userId)`          | userId: string | Subscription   | Get current subscription |
| `updateSubscription(id, data)`     | id, data       | Subscription   | Update subscription      |
| `cancelSubscription(id)`           | id: string     | Subscription   | Cancel subscription      |
| `renewSubscription(id)`            | id: string     | Subscription   | Manual renew             |
| `checkExpiring()`                  | -              | Subscription[] | Check expiring subs      |

### Database Tables

- `subscriptions` - Subscription records
- `subscription_history` - Change history

---

## 9. Notification Service

**File:** `server/services/notificationService.js`

### Functions

| Function                            | Parameters             | Returns        | Description            |
| ----------------------------------- | ---------------------- | -------------- | ---------------------- |
| `createNotification(userId, data)`  | userId, data           | Notification   | Create notification    |
| `getNotifications(userId, options)` | userId, options        | Notification[] | Get user notifications |
| `markAsRead(notificationId)`        | notificationId: string | Notification   | Mark as read           |
| `markAllAsRead(userId)`             | userId: string         | void           | Mark all as read       |
| `deleteNotification(id)`            | id: string             | Notification   | Delete notification    |
| `sendRealTime(userId, data)`        | userId, data           | void           | WebSocket push         |

### Database Tables

- `notifications` - User notifications

---

## 10. Search Service (OpenSearch)

**File:** `server/services/openSearchService.js`

### Functions

| Function                             | Parameters            | Returns | Description       |
| ------------------------------------ | --------------------- | ------- | ----------------- |
| `indexDocument(index, id, document)` | index, id, document   | void    | Index document    |
| `search(index, query, options)`      | index, query, options | Results | Search index      |
| `deleteDocument(index, id)`          | index, id             | void    | Remove from index |
| `bulkIndex(index, documents)`        | index, documents      | void    | Bulk index        |
| `reindex()`                          | -                     | void    | Full reindex      |

### Indices

- `products` - Product search
- `requirements` - Requirement search
- `users` - User search
- `posts` - Feed post search

---

## 11. Matching Service

**File:** `server/services/matchingService.js`

### Functions

| Function                                     | Parameters            | Returns | Description                |
| -------------------------------------------- | --------------------- | ------- | -------------------------- |
| `matchProductToRequirements(productId)`      | productId: string     | Match[] | Find matching requirements |
| `matchRequirementToProducts(requirementId)`  | requirementId: string | Match[] | Find matching products     |
| `calculateMatchScore(product, requirement)`  | product, requirement  | number  | Similarity score           |
| `getTopMatches(entityType, entityId, limit)` | type, id, limit       | Match[] | Get top matches            |

---

## 12. AI Services

**File:** `server/services/aiVerifier.js`

### Functions

| Function                       | Parameters    | Returns             | Description             |
| ------------------------------ | ------------- | ------------------- | ----------------------- |
| `verifyContent(content, type)` | content, type | VerificationResult  | Verify content          |
| `detectHallucination(text)`    | text: string  | HallucinationResult | Detect AI hallucination |
| `classifyContent(text)`        | text: string  | Classification      | Classify content        |

**File:** `server/services/aiOrchestrationService.js`

### Functions

| Function                          | Parameters          | Returns    | Description                |
| --------------------------------- | ------------------- | ---------- | -------------------------- |
| `processRequest(userId, request)` | userId, request     | AIResponse | Process AI request         |
| `routeToProvider(request)`        | request: object     | Provider   | Route to best provider     |
| `aggregateResponses(responses)`   | responses: object[] | Response   | Combine provider responses |

---

## 13. E-Sign Service

**File:** `server/services/eSignService.js`

### Functions

| Function                              | Parameters          | Returns  | Description              |
| ------------------------------------- | ------------------- | -------- | ------------------------ |
| `createEnvelope(contractId, signers)` | contractId, signers | Envelope | Create signing envelope  |
| `sendForSignature(envelopeId)`        | envelopeId: string  | void     | Send to signers          |
| `getSigningStatus(envelopeId)`        | envelopeId: string  | Status   | Get signing status       |
| `handleCallback(provider, payload)`   | provider, payload   | void     | Handle provider callback |
| `downloadSignedDocument(envelopeId)`  | envelopeId: string  | Document | Download signed doc      |

### Providers

- Dropbox Sign (formerly HelloSign)
- Custom provider support

---

## 14. Analytics Service

**File:** `server/services/analyticsService.js`

### Functions

| Function                              | Parameters              | Returns      | Description      |
| ------------------------------------- | ----------------------- | ------------ | ---------------- |
| `trackEvent(userId, event, metadata)` | userId, event, metadata | void         | Track event      |
| `getMetrics(userId, options)`         | userId, options         | Metrics      | Get metrics      |
| `getAggregations(filters)`            | filters: object         | Aggregations | Get aggregations |
| `exportData(format, filters)`         | format, filters         | Data         | Export analytics |

### Data Models

- `event_logs` - Event tracking
- Various aggregation tables

---

## 15. Security Service

**File:** `server/services/securityService.js`

### Functions

| Function                          | Parameters       | Returns  | Description              |
| --------------------------------- | ---------------- | -------- | ------------------------ |
| `checkRateLimit(userId, action)`  | userId, action   | boolean  | Rate limiting            |
| `validateIpWhitelist(ip)`         | ip: string       | boolean  | IP allowlist             |
| `checkGeoFence(userId, location)` | userId, location | boolean  | Geo restrictions         |
| `rotateEncryptionKey()`           | -                | void     | Key rotation             |
| `createIncident(title, severity)` | title, severity  | Incident | Create security incident |

---

_To be continued with remaining services..._

---

_Generated from source: server/services/_
