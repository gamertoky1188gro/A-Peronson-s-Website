# GarTexHub Audit - Quick Start Guide

## 🚨 CRITICAL ISSUES - DO THIS FIRST

### 1. Secrets Exposure (IMMEDIATE)

```bash
# DO NOT push .env to git!
# Rotate these credentials NOW:
- DATABASE_URL (Aiven PostgreSQL)
- GEMINI_API_KEY (Google)
- JWT_SECRET
- OPENSEARCH credentials
- ADMIN_MFA_CODE

# Remove from git history:
git filter-repo --path .env --invert-paths

# Add to .gitignore:
echo ".env" >> .gitignore
```

### 2. Promise Error Handling (2-3 hours)

**Files to fix:** 48 locations with unhandled .then()

```jsx
// ❌ Bad:
apiRequest("/api/data").then((data) => setState(data));

// ✅ Good:
apiRequest("/api/data")
  .then((data) => setState(data))
  .catch((err) => handleError(err));

// ✅ Better (async/await):
try {
  const data = await apiRequest("/api/data");
  setState(data);
} catch (err) {
  handleError(err);
}
```

Key files:

- `src/pages/AdminPanel.jsx`
- `src/pages/ChatInterface.jsx`
- `src/pages/SearchResults.jsx`
- `src/components/FloatingAssistant.jsx`

### 3. Missing Routes (30 min)

Add to `/src/App.jsx` if missing:

```jsx
<Route path="/verification" element={<ProtectedRoute><VerificationPage /></ProtectedRoute>} />
<Route path="/contracts" element={<ProtectedRoute roles={OWNER_ROLES}><ContractVault /></ProtectedRoute>} />
<Route path="/leads" element={<ProtectedRoute roles={OWNER_ROLES}><LeadsPage /></ProtectedRoute>} />
```

### 4. XSS Vulnerability in SearchResults (1-2 hours)

```bash
npm install dompurify
```

```jsx
import DOMPurify from 'dompurify';

// Replace all dangerouslySetInnerHTML in SearchResults.jsx:
// ❌ Before:
<div dangerouslySetInnerHTML={{ __html: data.description }} />

// ✅ After:
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description) }} />
```

---

## 🔴 HIGH PRIORITY (Next Sprint)

### Remove Console Statements (1-2 hours)

```bash
# Find all:
grep -r "console\." src/ --include="*.jsx" --include="*.js" | wc -l
# Expected: ~78 instances across 21 files

# Remove or wrap in dev check:
if (import.meta.env.DEV) console.log(...);
```

### Add Input Validation (2-3 hours)

Key files needing validation:

- `src/pages/OrgSettings.jsx`
- `src/pages/OnboardingWizard.jsx`
- `src/pages/AdminPanel.jsx`

Example:

```jsx
// Add validation before submission:
if (!orgName || orgName.length < 3) {
  setError("Organization name must be at least 3 characters");
  return;
}
```

### Fix Admin Credential Storage (1 hour)

**File:** `src/pages/AdminPanel.jsx`

```jsx
// ❌ Bad - in localStorage:
localStorage.setItem("admin_mfa_code", mfaCode);

// ✅ Good - in session with expiry:
sessionStorage.setItem("admin_mfa_code", mfaCode);

// OR: Use secure HTTP-only cookies from server
```

### Fix SSE Token (1 hour)

**File:** `src/lib/feedRealtime.js`

```jsx
// ❌ Bad - token in URL:
const url = `${BASE}/api/feed/stream?token=${token}`;

// ✅ Good - use Authorization header:
const source = new EventSource(url);
source.addEventListener("open", () => {
  source.close();
  // Use fetch with proper headers instead
});
```

### Disable Sourcemaps in Production (10 min)

**File:** `vite.config.js`

```js
// Current (problematic):
sourcemap: process.env.NODE_ENV !== "production";

// Better:
sourcemap: false; // or use process.env.GENERATE_SOURCEMAP === "true"
```

### Fix CORS (10 min)

**File:** `server/server.js`

```js
// Current: allows no-origin in production
// Fix: Ensure strict CORS for production
if (process.env.NODE_ENV === "production") {
  if (!origin) callback(new Error("Origin required"));
}
```

---

## 🟡 MEDIUM PRIORITY (This Month)

- [ ] Add Error Boundary component
- [ ] Add PropTypes to all components
- [ ] Add loading/error states to async operations
- [ ] Refactor large components (AdminPanel: 10k lines)
- [ ] Create type definitions for API responses
- [ ] Add request/response logging service
- [ ] Implement pagination for large lists

---

## 📊 Audit Results Summary

| Category     | Critical | High  | Medium | Low   |
| ------------ | -------- | ----- | ------ | ----- |
| Security     | 2        | 3     | 2      | -     |
| Bugs         | 3        | 2     | 2      | -     |
| Code Quality | -        | 2     | 3      | 2     |
| Performance  | -        | -     | 3      | -     |
| **TOTAL**    | **5**    | **7** | **10** | **2** |

---

## 🛠️ Tools to Run

```bash
# ESLint - find unused vars, missing returns
npm run lint

# Run tests
npm test

# Check dependencies
npm audit

# Check for secrets (install if needed)
git secrets --scan

# Build
npm run build
```

---

## 📝 Checklists

### Before Next Deployment

- [ ] .env removed from git
- [ ] All credentials rotated
- [ ] All .then() have .catch()
- [ ] No console.log in production code
- [ ] Sourcemaps disabled
- [ ] Routes defined and working
- [ ] Input validation added to forms
- [ ] XSS sanitization in place
- [ ] CORS properly configured
- [ ] Admin credentials moved to secure storage

### Before Production Launch

- [ ] All above completed
- [ ] Error boundary added
- [ ] PropTypes added to components
- [ ] Tests passing (npm test)
- [ ] No audit warnings (npm audit)
- [ ] Bundle size acceptable
- [ ] Load testing completed
- [ ] Security headers configured
- [ ] Rate limiting configured
- [ ] Error logging set up

---

## 📞 Contact & Questions

For detailed findings, see `AUDIT_REPORT.md` in project root.

Most critical: Fix secrets exposure and promise error handling this week.
