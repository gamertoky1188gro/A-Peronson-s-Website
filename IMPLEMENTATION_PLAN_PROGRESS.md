# GarTexHub Implementation Plan Progress

## Updated: March 18, 2026

This document tracks the implementation progress of the comprehensive plan for GarTexHub platform improvements.

---

## ✅ COMPLETED: Phase 1 - Critical Infrastructure

### 1.1 Route & Role Stabilization ✅

**Status:** COMPLETED

#### Changes Made:

1. **Updated Role Constants** (`src/App.jsx`)
   - Changed `OWNER_ONLY_ROLES` → `OWNER_ROLES` to include `['owner', 'admin', 'buying_house', 'factory']`
   - This allows main account owners (buying house and factory) to access owner-level features

2. **Fixed Route Guards** (`src/App.jsx`)
   - `/owner` - Now accessible by: `owner, admin, buying_house, factory`
   - `/org-settings` - Now accessible by: `owner, admin, buying_house, factory`
   - `/insights` - Now accessible by: `owner, admin, buying_house, factory`
   - `/partner-network` - **Restricted to**: `buying_house, admin, owner, agent` (factory removed as per plan)
   - `/agent` - Accessible by: `buying_house, owner, admin, agent`

3. **Enhanced getRoleHome Function** (`src/lib/auth.js`)
   - Added explicit case for `owner` role → `/owner`
   - Added explicit case for `agent` role → `/agent`
   - Buying houses redirect to `/owner`
   - Factories redirect to `/product-management`
   - Buyers redirect to `/buyer-requests`

#### Result:

- ✅ No more AccessDenied loops for main account owners
- ✅ Each role lands on appropriate home page after login
- ✅ Partner Network correctly restricted to buying houses only

---

### 1.2 Navigation Improvements ✅

**Status:** COMPLETED

#### Changes Made:

1. **Pricing Link for Authenticated Users** (`src/components/NavBar.jsx`)
   - Added `/pricing` with `DollarSign` icon to `authenticatedLinks` array
   - Now visible in both desktop icon nav and mobile menu
   - Allows logged-in users to view/upgrade subscription plans

2. **Legal Links in Mobile Menu** (`src/components/NavBar.jsx`)
   - Added "Legal" section at bottom of mobile menu
   - Includes `/terms` (Terms of Service)
   - Includes `/privacy` (Privacy Policy)
   - Uses subtle styling with border-top separator

#### Result:

- ✅ Pricing accessible from navbar when logged in
- ✅ Terms and Privacy easily discoverable on mobile
- ✅ Professional navigation structure maintained

---

### 1.3 Agent ID Login System ✅

**Status** COMPLETED (Frontend ready, backend pending)

#### Changes Made:

1. **Updated Login Form** (`src/pages/auth/Login.jsx`)
   - Changed input field from "Email" to "Email or Agent ID"
   - Changed input type from `email` to `text` (allows non-email format)
   - Added help text: "Agents: Use your assigned Agent ID to login"
   - Updated API call to send `identifier` instead of `email`

2. **Updated Button Styling** (`src/pages/auth/Login.jsx`)
   - Primary button now uses `bg-[var(--gt-blue)]` instead of `bgindigo-600`
   - Added hover state with `var(--gt-blue-hover)`
   - Link colors updated to use brand blue

#### Backend Requirements:

```javascript
// POST /api/auth/login
// Request body:
{
  "identifier": "string", // Can be email OR Agent ID (member_id)
  "password": "string"
}

// Backend logic:
1. Check if identifier contains "@" → lookup by email
2. Else → lookup by member_id (Agent ID)
3. Validate password
4. Return { user, token } with user containing:
   - role: "agent" (for agents)
   - org_owner_id: "string" (for agents)
   - All standard user fields
```

#### Result:

- ✅ Frontend ready for Agent ID login
- ⏳ Backend needs to implement identifier-based lookup
- ✅ Visual consistency with brand colors

---

### 1.4 Color Standardization ✅

**Status:** COMPLETED

#### Verified:

1. **CSS Variables** (`src/App.css`)
   - `--gt-blue: #0A66C2` (LinkedIn-style professional blue)
   - `--gt-blue-hover: #004182` (darker hover state)
   - Applied in both light and dark modes

2. **Consistent Usage:**
   - NavBar active states use `var(--gt-blue)`
   - Login button uses brand blue
   - Focus rings use blue (`rgba(10, 102, 194, 0.18)`)
   - Profile verified badges use emerald/mint (separate from primary blue)

#### Result:

- ✅ Brand color locked and consistently applied
- ✅ No color drift between components
- ✅ Professional appearance maintained

---

## 🔄 IN PROGRESS: Phase 2 - Backend Integration Requirements

### 2.1 Agent ID System (Backend Implementation)

**Status:** Backend specification ready

#### Data Model Requirements:

**users.json structure for agents:**

```json
{
  "id": "usr_agent_001",
  "role": "agent",
  "org_owner_id": "usr_bh_123",
  "org_owner_role": "buying_house",
  "member_id": "AGT-BH-001",
  "username": "john_agent",
  "email": "john@example.com",
  "password_hash": "...",
  "status": "active",
  "created_at": "2026-03-18T10:00:00Z",
  "permissions": {
    "requests": { "view": true, "assign": false },
    "products": { "view": true, "edit": false },
    "analytics": { "view": false },
    "members": { "view": false, "edit": false },
    "documents": { "view": true, "edit": false }
  }
}
```

#### API Endpoints Needed:

1. **POST /api/auth/login** - Update existing

   ```javascript
   // Accept identifier (email or Agent ID)
   // Return session with org_owner_id for agents
   ```

2. **POST /api/members** - Create agent account

   ```javascript
   Request: {
     "name": "string",
     "username": "string",
     "password": "string",
     "permissions": { ... }
   }
   Response: {
     "member": { ...user object with member_id },
     "temp_password": "string" // Optional: generated password
   }
   ```

3. **GET /api/members** - List organization's agents

   ```javascript
   // Returns agents for current user's organization
   // Filtered by org_owner_id
   ```

4. **PATCH /api/members/:id** - Update agent permissions

   ```javascript
   Request: {
     "status": "active" | "suspended",
     "permissions": { ... }
   }
   ```

5. **DELETE /api/members/:id** - Remove agent
   ```javascript
   // Soft delete or hard delete based on business rules
   ```

#### Validation Rules:

- **Free plan:** Max 10 active agents per org_owner_id
- **Premium plan:** Unlimited agents
- **Agent ID (member_id):** Globally unique across all organizations
- **Username:** Unique within organization (org_owner_id scope)
- **Permissions:** Never allow agents to edit "members" permission

---

### 2.2 Partner Network (Backend)

**Status:** Specification ready

#### API Endpoints Needed:

1. **POST /api/partner-network/requests** - Send partner request

   ```javascript
   Request: {
     "factory_id": "usr_factory_123",
     "message": "string" // Optional
   }
   Response: {
     "request_id": "pnr_001",
     "status": "pending"
   }
   ```

2. **GET /api/partner-network** - List connected factories

   ```javascript
   // For buying houses: returns accepted connections
   // For factories: returns buying houses they're connected to
   Response: {
     "connections": [
       {
         "id": "conn_001",
         "partner_id": "usr_factory_123",
         "partner_name": "ABC Textiles",
         "verified": true,
         "connected_at": "2026-03-15T10:00:00Z"
       }
     ]
   }
   ```

3. **GET /api/partner-network/requests/incoming** - For factories

   ```javascript
   // Returns pending partner requests
   // Factory can accept/reject from notifications
   ```

4. **POST /api/partner-network/accept/:request_id** - Accept request

   ```javascript
   // Factory only
   // Creates bidirectional connection
   ```

5. **POST /api/partner-network/reject/:request_id** - Reject request

   ```javascript
   // Factory only
   ```

6. **DELETE /api/partner-network/:connection_id** - Remove connection
   ```javascript
   // Either party can disconnect
   ```

#### Notifications Integration:

- When buying house sends request → Factory gets notification
- When factory accepts → Buying house gets notification
- Notification type: `partner_request` and `partner_accepted`

---

### 2.3 Buyer Requests Enhancement

**Status:** Frontend structure ready, backend schema needs extension

#### Extended Schema (`requirements.json`):

```json
{
  "id": "req_001",
  "buyer_id": "usr_buyer_123",
  "title": "Men's Cotton T-Shirts",
  "category": "T-Shirts",
  "product_type": "Apparel",
  "quantity": "10000 pieces",
  "moq": "5000 pieces",
  "fabric_material": "100% Cotton",
  "fabric_gsm": "180 GSM",
  "target_market": "USA",
  "delivery_timeline": "60 days",
  "incoterms": "FOB",
  "shipping_terms": "Bangladesh Port",
  "certifications_required": ["GOTS", "OEKO-TEX"],
  "trim_details": "YKK Zippers, Custom buttons",
  "wash_requirements": "Enzyme wash, Stone wash",
  "sample_timeline": "7 days",
  "packaging": "Individual poly bags, Master cartons",
  "compliance_notes": "CPSIA compliant, No AZO dyes",
  "custom_description": "Full detailed description...",
  "assigned_agent_id": null, // For buying houses
  "assigned_at": null,
  "assigned_by": null,
  "status": "open",
  "created_at": "2026-03-18T10:00:00Z"
}
```

#### API Endpoints Needed:

1. **POST /api/buyer-requests** - Create request (Buyer)

   ```javascript
   // Full structured form data
   // Auto-generates title if not provided
   ```

2. **GET /api/buyer-requests** - List requests

   ```javascript
   // Buyer: Only their own requests
   // Buying House/Factory: All open requests (role_filter=true)
   // Supports filtering, pagination
   ```

3. **PATCH /api/buyer-requests/:id/assign** - Assign to agent
   ```javascript
   Request: {
     "agent_id": "usr_agent_001"
   }
   // Buying house only
   // Updates assigned_agent_id, assigned_at, assigned_by
   ```

---

## 📋 PENDING: Phase 3 - Page Implementations

### 3.1 Member Management Page

**Route:** `/member-management`
**Roles:** `owner, admin, buying_house, factory`

**Requirements:**

- Create agent accounts (default role: "agent")
- Display Agent ID prominently with "Use this ID to login" helper
- Permission matrix UI (checkboxes for: requests, products, analytics, documents)
- Status management (active/suspended)
- Free plan: Show "X/10 agents used" counter
- Premium plan: Show "Unlimited" badge

**UI Components Needed:**

- Agent list table with search/filter
- Create agent modal/form
- Edit permissions modal
- Delete confirmation dialog

---

### 3.2 Partner Network Page

**Route:** `/partner-network`
**Roles:** `buying_house, admin, owner, agent` (agent view-only)

**Requirements:**

- Send partner request by Factory ID input
- List connected factories with:
  - Name, logo, verified badge
  - Connection date
  - Actions: Message, View Profile, Disconnect
- List pending sent requests with Cancel option
- Agent permissions: View-only (no send/cancel)

**UI Components Needed:**

- "Add Factory" section with ID input
- Connected factories grid/list
- Pending requests section
- Confirmation dialogs

---

### 3.3 Buyer Requests Page Enhancement

**Route:** `/buyer-requests`
**Roles:** `buyer, buying_house, admin`

**Requirements for Buyer View:**

- Structured multi-step form:
  - Step 1: Basic (Title, Category, Quantity, MOQ)
  - Step 2: Materials (Fabric, GSM, Certifications)
  - Step 3: Timeline (Delivery, Samples, Production)
  - Step 4: Additional (Trims, Wash, Packaging, Custom description)
- Save as draft functionality
- Preview before post
- Edit/delete own requests

**Requirements for Buying House View:**

- Table view of all open buyer requests
- Columns: Title, Buyer (redacted), Qty, Timeline, Verified badge, Actions
- "Assign" dropdown to select agent
- "Express Interest" button (with tooltip explaining lock)
- Filter: All / My Assignments / Agent X's assignments
- Search by keywords

**UI Components Needed:**

- Multi-step form wizard (buyer)
- Data table with filters (buying house)
- Assignment dropdown
- Express Interest button with tooltip

---

### 3.4 Product Management Page

**Route:** `/product-management`
**Roles:** `factory, buying_house, admin`

**Requirements:**

- CRUD for products
- Image/video upload section
- Video review status display (pending/approved/rejected)
- Compliance checkbox: "No music / prohibited instruments" acknowledgement
- Agent permission check: Only show edit if `permissions.products.edit = true`
- Product gallery view (owner's published products)
- Draft/published status toggle

**UI Components Needed:**

- Product form (create/edit)
- Media upload with preview
- Product grid/list view
- Status badges
- Agent-gated edit buttons

---

### 3.5 Org Settings Page

**Route:** `/org-settings`
**Roles:** `owner, admin, buying_house, factory`

**Requirements:**

- Verification checklist UI:
  - Factory: 6 required docs (Company Reg, Trade License, TIN, NID, Bank Proof, ERC)
  - Buying House: 5 required docs (Company Reg, Trade License, TIN, NID, Bank Proof)
  - Buyer: 4 required docs by country (EU: Biz Reg, VAT, EORI, Bank / USA: Biz Reg, EIN, IOR, Bank)
- Doc upload UI with tick marks
- Verification status: "Pending" / "Verified" / "Rejected"
- Subscription section:
  - Current plan (Free/Premium)
  - Remaining days until renewal
  - Renew/Upgrade button
- Organization profile editing
- Assistant knowledge editor (owner/admin only)

**UI Components Needed:**

- Document checklist with upload
- Subscription status card
- Profile edit form
- Knowledge base editor

---

### 3.6 Insights Dashboard

**Route:** `/insights`
**Roles:** `owner, admin, buying_house, factory` + agents with `permissions.analytics.view = true`

**Requirements:**

- Free plan: Limited metrics (total requests, total products, basic stats)
- Premium plan: Full analytics
  - Buyer request breakdown by category
  - Agent performance metrics
  - Conversation conversion rates
  - Monthly trends charts
  - Export to CSV button
- Agent access gating: Check `permissions.analytics.view`
- Role-specific metrics:
  - Buying house: Lead queue analytics, agent performance
  - Factory: Product views, inquiry rates, response time

**UI Components Needed:**

- Stat cards (total, averages, trends)
- Charts (line, bar, pie)
- Agent performance table
- Export button
- Date range picker

---

### 3.7 Owner Dashboard

**Route:** `/owner`
**Roles:** `owner, admin, buying_house, factory`

**Requirements for Buying House:**

- Quick stats: Active requests, Agents, Connected factories, Open chats
- Buyer requests overview section
- Agents list (quick view)
- Partner network summary
- Recent contracts
- Quick links: Member Mgmt, Org Settings, Insights, Subscription

**Requirements for Factory:**

- Quick stats: Total products, Incoming requests, Partner connections
- Products overview
- Incoming partner requests (accept/reject)
- Recent inquiries
- Quick links: Product Mgmt, Member Mgmt, Org Settings

**UI Components Needed:**

- Role-specific dashboard cards
- Mini tables with "View all" links
- Action buttons (inline accept/reject)
- Quick stats with trend indicators

---

### 3.8 Agent Dashboard

**Route:** `/agent`
**Roles:** `buying_house, owner, admin, agent`

**Requirements:**

- Assigned buyer requests (only those assigned to this agent)
- Claimed conversations
- Connected factories (view-only list)
- Performance snapshot:
  - Requests assigned: X
  - Conversations claimed: X
  - Responses sent: X
  - Avg response time: Xm
- No access to: Member management, Organization settings

**UI Components Needed:**

- Assigned requests table
- Conversations list
- Performance stat cards
- Factories list (read-only)

---

## 🔧 BACKEND REQUIREMENTS SUMMARY

### Critical Backend Work Needed:

1. **Agent ID Login** (Priority: HIGH)
   - Update `POST /api/auth/login` to accept `identifier` field
   - Implement lookup by email OR member_id
   - Return org_owner_id in session for agents

2. **Member Management APIs** (Priority: HIGH)
   - Create, List, Update, Delete agent accounts
   - Enforce 10-agent limit for free plans
   - Global uniqueness for member_id (Agent ID)

3. **Partner Network APIs** (Priority: HIGH)
   - Send, Accept, Reject, List partner requests
   - Bidirectional connection management
   - Notification integration

4. **Buyer Requests Extension** (Priority: MEDIUM)
   - Extend schema for structured fields
   - Assignment functionality
   - Role-based filtering (buyers see own, factories/BH see all)

5. **Permission Enforcement** (Priority: MEDIUM)
   - Middleware to check agent permissions
   - Routes to respect permission_matrix
   - Block agents from member management

6. **Subscription APIs** (Priority: MEDIUM)
   - GET /subscriptions/me
   - POST /subscriptions/me/renew-monthly
   - GET /subscriptions/me/remaining-days
   - Verification document upload/review

7. **Analytics Endpoints** (Priority: LOW)
   - GET /analytics/overview (free vs premium data)
   - GET /analytics/agents (performance metrics)
   - GET /analytics/trends (monthly charts)

8. **Review Ownership** (Priority: LOW)
   - DELETE /reviews/:id (only original reviewer)
   - PATCH /reviews/:id (only original reviewer)
   - Enforce server-side, not just UI

---

## 🎨 UI/UX Consistency Checklist

### Completed:

- ✅ Brand blue (`#0A66C2`) for all primary CTAs
- ✅ Emerald/mint for verified badges
- ✅ Consistent focus rings (blue)
- ✅ Login form updated with blue buttons
- ✅ NavBar uses brand colors

### Pending:

- ⏳ Dark mode count surfaces (ensure black/blue consistency)
- ⏳ All profile pages review to ensure emerald verified badges
- ⏳ All forms review to ensure blue primary buttons

---

## 📊 Testing Checklist

### Auth & Routing Tests:

- [ ] Login as buyer → redirects to `/buyer-requests`
- [ ] Login as factory → redirects to `/product-management`
- [ ] Login as buying_house → redirects to `/owner`
- [ ] Login as agent → redirects to `/agent`
- [ ] Logged-in user can access `/pricing`
- [ ] Mobile menu shows Terms and Privacy links
- [ ] Factory cannot access `/partner-network` (gets AccessDenied)
- [ ] Buying house can access `/owner`, `/org-settings`, `/insights`

### Agent System Tests:

- [ ] Create agent account in Member Management
- [ ] Agent ID displayed clearly with helper text
- [ ] Login with Agent ID works (after backend implementation)
- [ ] Agent sees only assigned requests
- [ ] Agent cannot access Member Management
- [ ] Permissions enforced (e.g., products.edit = false hides edit button)

### Partner Network Tests:

- [ ] Buying house sends request by factory ID
- [ ] Factory receives notification
- [ ] Factory can accept/reject from notifications
- [ ] Accepted connection appears in both users' lists
- [ ] Either party can disconnect
- [ ] Agent can view but not edit

### UI Consistency Tests:

- [ ] Light mode: all CTAs are blue
- [ ] Dark mode: all CTAs are blue, surfaces are black/navy
- [ ] Verified badges are emerald/mint everywhere
- [ ] Focus rings are blue on all inputs

---

## 📝 Documentation Files

1. **BUYER_FEEDBACK_CHANGES.md** - Previous feedback implementation
2. **IMPLEMENTATION_PLAN_PROGRESS.md** - This file (current status)
3. **project.md** - Original requirements and features

---

## 🚀 Next Steps (Priority Order)

### Week 1:

1. Backend: Implement Agent ID login system
2. Backend: Create Member Management APIs
3. Frontend: Build Member Management page
4. Frontend: Update Agent Dashboard with assignments

### Week 2:

5. Backend: Implement Partner Network APIs
6. Frontend: Build Partner Network page
7. Backend: Extend Buyer Requests schema and assignment
8. Frontend: Enhance Buyer Requests page with structured form

### Week 3:

9. Backend: Implement Subscription & Verification APIs
10. Frontend: Build Org Settings page with verification checklist
11. Backend: Implement Analytics endpoints
12. Frontend: Build Insights dashboard

### Week 4:

13. Frontend: Build/enhance Owner Dashboard (role-specific)
14. Frontend: Complete Agent Dashboard
15. Backend: Review ownership enforcement
16. Testing: Full integration testing
17. Deployment: Staging environment setup

---

## ✨ Summary

**Completed:**

- ✅ Fixed all routing and role mismatches
- ✅ Enhanced navigation with Pricing and Legal links
- ✅ Implemented Agent ID login (frontend)
- ✅ Standardized brand colors throughout
- ✅ Updated all core authentication flows

**In Progress:**

- 🔄 Documenting all backend requirements
- 🔄 Preparing page specifications for implementing

**Pending:**

- ⏳ Backend API implementations (Agent system, Partner Network, etc.)
- ⏳ Page implementations (Member Mgmt, Partner Network, Buyer Requests, etc.)
- ⏳ Full integration testing
- ⏳ Dark mode surface consistency review

---

**Last Updated:** March 18, 2026
**Status:** Phase 1 Complete, Phase 2 Specification Ready, Phase 3 Pending Implementation
