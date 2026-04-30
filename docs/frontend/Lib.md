# Frontend Lib Documentation

**Location:** `src/lib/`

## Lib Files

| # | File | Purpose | Status |
|---|------|---------|--------|
| 1 | auth.js | Authentication, JWT, API requests | ✅ |
| 2 | events.js | Analytics event tracking | ✅ |
| 3 | aiPrefill.js | AI content prefill | ✅ |
| 4 | leadSource.js | Lead source tracking | ✅ |
| 5 | notificationsRealtime.js | Real-time notifications | ✅ |

---

## 1. Auth Library

**File:** `src/lib/auth.js`

### Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `apiRequest(url, options)` | url, options | Promise | Make authenticated API request |
| `getToken()` | - | string | Get JWT token from storage |
| `getCurrentUser()` | - | User object | Get current user |
| `saveSession(user, token)` | user, token | void | Save session to storage |
| `clearSession()` | - | void | Clear session |
| `getRoleHome(role)` | role: string | string | Get home route for role |
| `hasEntitlement(user, entitlement)` | user, ent | boolean | Check entitlement |

### Storage
- `localStorage` - jwt, user data

---

## 2. Events Library

**File:** `src/lib/events.js`

### Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `trackClientEvent(event, data)` | event, data | void | Track client-side event |
| `trackPageView(page, data)` | page, data | void | Track page view |
| `identifyUser(userId, traits)` | userId, traits | void | Identify user |

---

## 3. AI Prefill Library

**File:** `src/lib/aiPrefill.js`

### Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getPrefillData(type, context)` | type, context | Promise | Get AI prefill data |
| `prefillForm(formType, data)` | formType, data | void | Prefill form fields |

---

## 4. Lead Source Library

**File:** `src/lib/leadSource.js`

### Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `trackLeadSource(source, metadata)` | source, metadata | void | Track lead source |
| `getLeadSource()` | - | object | Get current lead source |

### Sources
- organic
- referral
- paid
- social

---

## 5. Notifications Realtime

**File:** `src/lib/notificationsRealtime.js`

### Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `connectNotificationsRealtime(userId)` | userId | WebSocket | Connect to realtime |
| `subscribeNotificationsRealtime(callback)` | callback | unsubscribe | Subscribe to updates |

---

*Generated from source: src/lib/*