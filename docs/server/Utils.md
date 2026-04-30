# Utils Documentation

**Location:** `server/utils/`

## Complete Utils List (13 files)

| #   | Utils                    | Purpose                    | Status |
| --- | ------------------------ | -------------------------- | ------ |
| 1   | prisma.js                | Prisma client singleton    | ✅     |
| 2   | db.js                    | Database connection        | ✅     |
| 3   | logger.js                | Logging utility            | ✅     |
| 4   | validators.js            | Input validation           | ✅     |
| 5   | permissions.js           | Permission checking        | ✅     |
| 6   | localStore.js            | Local JSON store           | ✅     |
| 7   | jsonStore.js             | JSON file storage          | ✅     |
| 8   | metrics.js               | Metrics collection         | ✅     |
| 9   | pendingInvites.js        | Invite tracking            | ✅     |
| 10  | hallucinationDetector.js | AI hallucination detection | ✅     |
| 11  | dotenv.js                | Env variable loading       | ✅     |
| 12  | crmFallbackStore.js      | CRM fallback               | ✅     |
| 13  | auditStore.js            | Audit log storage          | ✅     |

---

## 1. Prisma Client

**File:** `server/utils/prisma.js`

### Functions

| Function | Returns      | Description                      |
| -------- | ------------ | -------------------------------- |
| `prisma` | PrismaClient | Singleton Prisma client instance |

### Usage

```javascript
import { prisma } from "../utils/prisma.js";
const users = await prisma.user.findMany();
```

---

## 2. Database Connection

**File:** `server/utils/db.js`

### Functions

| Function            | Parameters | Returns    | Description             |
| ------------------- | ---------- | ---------- | ----------------------- |
| `getDbConnection()` | -          | connection | Get database connection |
| `testConnection()`  | -          | boolean    | Test connection         |
| `closeConnection()` | -          | void       | Close connection        |

---

## 3. Logger

**File:** `server/utils/logger.js`

### Functions

| Function               | Parameters    | Returns | Description |
| ---------------------- | ------------- | ------- | ----------- |
| `info(message, meta)`  | message, meta | void    | Log info    |
| `warn(message, meta)`  | message, meta | void    | Log warning |
| `error(message, meta)` | message, meta | void    | Log error   |
| `debug(message, meta)` | message, meta | void    | Log debug   |

### Log Levels

- `info` - General info
- `warn` - Warnings
- `error` - Errors
- `debug` - Debug info
- `audit` - Audit events

---

## 4. Validators

**File:** `server/utils/validators.js`

### Functions

| Function                     | Parameters       | Returns  | Description                |
| ---------------------------- | ---------------- | -------- | -------------------------- |
| `requireFields(obj, fields)` | obj, fields      | string[] | Check required fields      |
| `validateEmail(email)`       | email: string    | boolean  | Validate email format      |
| `validateRole(role)`         | role: string     | boolean  | Validate role              |
| `validatePassword(password)` | password: string | boolean  | Validate password strength |
| `validateUrl(url)`           | url: string      | boolean  | Validate URL               |
| `validateDate(date)`         | date: string     | boolean  | Validate ISO date          |
| `validateNumber(value)`      | value: any       | boolean  | Validate number            |
| `sanitizeHtml(html)`         | html: string     | string   | Sanitize HTML              |

### Validation Rules

- Email: RFC 5322 format
- Password: min 8 chars
- Role: enum of valid roles

---

## 5. Permissions

**File:** `server/utils/permissions.js`

### Functions

| Function                              | Parameters       | Returns | Description             |
| ------------------------------------- | ---------------- | ------- | ----------------------- |
| `hasPermission(user, permission)`     | user, permission | boolean | Check permission        |
| `hasRole(user, role)`                 | user, role       | boolean | Check role              |
| `canAccessResource(user, resource)`   | user, resource   | boolean | Check resource access   |
| `checkPermissionMatrix(user, action)` | user, action     | boolean | Check permission matrix |

### Permission Categories

- `users.read` - View users
- `users.write` - Modify users
- `users.delete` - Delete users
- `admin.*` - Admin operations
- `org.*` - Organization operations
- `products.*` - Product operations

---

## 6. Local Store

**File:** `server/utils/localStore.js`

### Functions

| Function          | Parameters   | Returns | Description      |
| ----------------- | ------------ | ------- | ---------------- |
| `getStore(name)`  | name: string | Store   | Get/create store |
| `get(key)`        | key: string  | any     | Get value        |
| `set(key, value)` | key, value   | void    | Set value        |
| `delete(key)`     | key: string  | void    | Delete value     |
| `clear()`         | -            | void    | Clear store      |

### Usage

```javascript
import { getStore } from "./localStore.js";
const store = getStore("users");
store.set("user1", { name: "John" });
```

---

## 7. JSON Store

**File:** `server/utils/jsonStore.js`

### Functions

| Function                    | Parameters        | Returns | Description    |
| --------------------------- | ----------------- | ------- | -------------- |
| `load(filePath)`            | filePath: string  | object  | Load JSON file |
| `save(filePath, data)`      | filePath, data    | void    | Save JSON file |
| `update(filePath, updater)` | filePath, updater | object  | Update JSON    |

---

## 8. Metrics

**File:** `server/utils/metrics.js`

### Functions

| Function                               | Parameters          | Returns | Description       |
| -------------------------------------- | ------------------- | ------- | ----------------- |
| `incrementCounter(name, labels)`       | name, labels        | void    | Increment counter |
| `recordHistogram(name, value, labels)` | name, value, labels | void    | Record histogram  |
| `recordGauge(name, value, labels)`     | name, value, labels | void    | Record gauge      |
| `getMetrics()`                         | -                   | object  | Get all metrics   |

### Metric Types

- Counters - Cumulative counts
- Histograms - Value distributions
- Gauges - Current values

---

## 9. Pending Invites

**File:** `server/utils/pendingInvites.js`

### Functions

| Function               | Parameters     | Returns | Description        |
| ---------------------- | -------------- | ------- | ------------------ |
| `createInvite(invite)` | invite: object | Invite  | Create invite      |
| `getInvite(token)`     | token: string  | Invite  | Get invite         |
| `consumeInvite(token)` | token: string  | Invite  | Consume invite     |
| `expireOldInvites()`   | -              | number  | Expire old invites |

---

## 10. Hallucination Detector

**File:** `server/utils/hallucinationDetector.js`

### Functions

| Function                               | Parameters      | Returns         | Description          |
| -------------------------------------- | --------------- | --------------- | -------------------- |
| `detectHallucination(text, threshold)` | text, threshold | DetectionResult | Detect hallucination |
| `calculateConfidence(text)`            | text: string    | number          | Confidence score     |
| `isFactualClaim(text)`                 | text: string    | boolean         | Check factual claim  |

### Detection Methods

- Self-consistency checking
- Source verification
- Confidence scoring

---

## 11. Dotenv

**File:** `server/utils/dotenv.js`

### Functions

| Function                    | Returns | Description                |
| --------------------------- | ------- | -------------------------- |
| `loadEnv()`                 | void    | Load environment variables |
| `getRequired(key)`          | string  | Get required env var       |
| `getOptional(key, default)` | string  | Get optional env var       |

---

## 12. CRM Fallback Store

**File:** `server/utils/crmFallbackStore.js`

### Functions

| Function                 | Parameters  | Returns | Description       |
| ------------------------ | ----------- | ------- | ----------------- |
| `getFallback(key)`       | key: string | object  | Get fallback data |
| `setFallback(key, data)` | key, data   | void    | Set fallback      |
| `syncFromPrimary()`      | -           | void    | Sync from primary |

---

## 13. Audit Store

**File:** `server/utils/auditStore.js`

### Functions

| Function                 | Parameters      | Returns      | Description      |
| ------------------------ | --------------- | ------------ | ---------------- |
| `logEntry(entry)`        | entry: object   | AuditEntry   | Log audit entry  |
| `queryEntries(filters)`  | filters: object | AuditEntry[] | Query audit logs |
| `exportLogs(start, end)` | start, end      | Log[]        | Export logs      |

---

_Generated from source: server/utils/_
