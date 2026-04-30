# Middleware Documentation

**Location:** `server/middleware/`

## Complete Middleware List (9 files)

| #   | Middleware               | Purpose                       | Status |
| --- | ------------------------ | ----------------------------- | ------ |
| 1   | auth.js                  | Authentication, JWT, passkeys | ✅     |
| 2   | errorHandler.js          | Error handling                | ✅     |
| 3   | requestLogger.js         | Request logging               | ✅     |
| 4   | validateSearchFilters.js | Search filter validation      | ✅     |
| 5   | entitlements.js          | Feature entitlements          | ✅     |
| 6   | adminSecurity.js         | Admin security layer          | ✅     |
| 7   | adminStepUp.js           | Admin step-up auth            | ✅     |
| 8   | adminDualConfirm.js      | Admin dual confirmation       | ✅     |
| 9   | adminAudit.js            | Admin audit logging           | ✅     |

---

## 1. Auth Middleware

**File:** `server/middleware/auth.js`

### Functions

| Function                       | Parameters     | Returns    | Description            |
| ------------------------------ | -------------- | ---------- | ---------------------- |
| `requireAuth(req, res, next)`  | req, res, next | void       | Require authentication |
| `optionalAuth(req, res, next)` | req, res, next | void       | Optional auth          |
| `allowRoles(...roles)`         | ...roles       | middleware | Role-based access      |
| `signToken(user)`              | user: object   | string     | Generate JWT           |
| `verifyToken(token)`           | token: string  | payload    | Verify JWT             |

### JWT Configuration

- Algorithm: HS256
- Expiry: 7 days (default)
- Claims: user.id, user.role, user.email

### Exports

- `requireAuth` - Protected routes
- `optionalAuth` - Public routes with optional auth
- `allowRoles` - Role-based middleware factory

---

## 2. Error Handler

**File:** `server/middleware/errorHandler.js`

### Functions

| Function                            | Parameters          | Returns | Description          |
| ----------------------------------- | ------------------- | ------- | -------------------- |
| `errorHandler(err, req, res, next)` | err, req, res, next | void    | Global error handler |
| `ApiError(status, message)`         | status, message     | Error   | Custom error class   |
| `notFound(req, res, next)`          | req, res, next      | void    | 404 handler          |

### Error Types

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Error

---

## 3. Request Logger

**File:** `server/middleware/requestLogger.js`

### Functions

| Function                        | Parameters     | Returns | Description       |
| ------------------------------- | -------------- | ------- | ----------------- |
| `requestLogger(req, res, next)` | req, res, next | void    | Log HTTP requests |

### Logged Data

- Timestamp
- HTTP method
- URL path
- Query parameters
- User agent
- Response time

---

## 4. Validate Search Filters

**File:** `server/middleware/validateSearchFilters.js`

### Functions

| Function                                | Parameters     | Returns | Description            |
| --------------------------------------- | -------------- | ------- | ---------------------- |
| `validateSearchFilters(req, res, next)` | req, res, next | void    | Validate search params |

### Validates

- Filter field names
- Date ranges
- Numeric bounds
- Enum values

---

## 5. Entitlements Middleware

**File:** `server/middleware/entitlements.js`

### Functions

| Function                          | Parameters          | Returns    | Description           |
| --------------------------------- | ------------------- | ---------- | --------------------- |
| `requireEntitlement(entitlement)` | entitlement: string | middleware | Check entitlement     |
| `getEntitlements(user)`           | user: object        | string[]   | Get user entitlements |

### Common Entitlements

- `premium` - Premium features
- `dedicated_support` - Priority support
- `dedicated_account_manager` - Account manager
- `advanced_analytics` - Analytics features
- `api_access` - API access

---

## 6. Admin Security

**File:** `server/middleware/adminSecurity.js`

### Functions

| Function                               | Parameters     | Returns | Description           |
| -------------------------------------- | -------------- | ------- | --------------------- |
| `requireAdminSecurity(req, res, next)` | req, res, next | void    | Verify admin security |

### Security Checks

- IP allowlist verification
- Device fingerprint validation
- Admin role verification

---

## 7. Admin Step-Up

**File:** `server/middleware/adminStepUp.js`

### Functions

| Function                             | Parameters     | Returns | Description          |
| ------------------------------------ | -------------- | ------- | -------------------- |
| `requireAdminStepUp(req, res, next)` | req, res, next | void    | Require step-up auth |

### Step-Up Requirements

- Second factor verification
- Session timeout check
- Re-authentication for sensitive ops

---

## 8. Admin Dual Confirmation

**File:** `server/middleware/adminDualConfirm.js`

### Functions

| Function                             | Parameters     | Returns | Description            |
| ------------------------------------ | -------------- | ------- | ---------------------- |
| `requireDualConfirm(req, res, next)` | req, res, next | void    | Require double confirm |

### Confirmation Types

- Confirmation code via header
- Secondary admin approval

---

## 9. Admin Audit Logger

**File:** `server/middleware/adminAudit.js`

### Functions

| Function                    | Parameters      | Returns    | Description       |
| --------------------------- | --------------- | ---------- | ----------------- |
| `adminAuditLogger(options)` | options: object | middleware | Log admin actions |

### Logged Data

- Admin user ID
- Action type
- Target entity
- Request body (sanitized)
- IP address
- Timestamp

---

_Generated from source: server/middleware/_
