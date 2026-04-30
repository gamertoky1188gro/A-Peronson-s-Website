# CI/CD Workflows

**Location:** `.github/workflows/`

## Workflows

### 1. CI (ci.yml)

**Triggers:** Push and Pull Requests

**Jobs:**

1. **test** - Ubuntu latest
   - Node.js 18 setup
   - Install dependencies (`npm ci`)
   - Start OpenSearch via docker-compose
   - Wait for OpenSearch to be ready
   - Reindex sample data (`npm run ci:reindex`)
   - Run unit tests (`npm test --silent`)
   - Run smoke tests (`npm run ci:smoke`)

---

### 2. Node.js Tests (nodejs-tests.yml)

**Triggers:** Push to main, PRs

**Jobs:**

1. **test** - Multiple Node versions
   - Tests on Node.js 18, 20, 22
   - Full test suite
   - Coverage reporting

---

### 3. OpenSearch CI (opensearch-ci.yml)

**Triggers:** Manual + Push to main

**Jobs:**

1. **opensearch-tests**
   - OpenSearch integration tests
   - Search functionality tests
   - Index/reindex operations

---

## Running CI Locally

```bash
# Full CI (requires OpenSearch)
npm run ci:full

# Reindex OpenSearch
npm run ci:reindex

# Smoke tests
npm run ci:smoke

# Unit tests only
npm run test:unit

# E2E tests
npm run test:e2e
```

---

_Generated from source: .github/workflows/_
