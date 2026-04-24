# Dynamic Admin Panel Configuration Plan

## Executive Summary

Convert all hardcoded/static admin panel data into dynamic, database-driven configuration. This enables:

- **No-code UI customization** - Change sidebar, actions, and labels without deploying code
- **Multi-environment support** - Different configs for dev/staging/prod
- **Runtime flexibility** - Update features without redeployment
- **Audit trail** - Track who changed what configuration

---

## Phase 1: Database Schema Design

### 1.1 New Prisma Models

```prisma
// Admin Inventory Configuration
model AdminModule {
  id              String    @id @default(cuid())
  module_id        String    @unique  // e.g., "platform", "infra"
  label            String
  icon_name        String?
  sort_order       Int       @default(0)
  active          Boolean   @default(true)
  sections         AdminSection[]
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt

  @@map("admin_modules")
}

model AdminSection {
  id              String    @id @default(cuid())
  section_id      String    @unique  // e.g., "users", "orgs"
  module_id       String
  title           String
  sort_order       Int       @default(0)
  active          Boolean   @default(true)
  features        Json?     // String array of features
  module          AdminModule @relation(fields: [module_id], references: [id])

  @@map("admin_sections")
}

// Action Definitions
model AdminAction {
  id              String    @id @default(cuid())
  action_id       String    @unique  // e.g., "users.export_emails"
  label           String
  category       String?
  sort_order     Int       @default(0)
  active         Boolean   @default(true)
  fields         Json      // Array of {key, label, type, required}
  created_at     DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  @@map("admin_actions")
}

// Capability Definitions
model AdminCapability {
  id              String    @id @default(cuid())
  capability_id  String    @unique
  module_id       String    // e.g., "infra", "network"
  title           String
  count           Int       @default(0)
  icon_name      String?
  subtitle       String?
  sort_order     Int       @default(0)
  active         Boolean   @default(true)

  @@map("admin_capabilities")
}

// UI Configuration
model AdminUiConfig {
  id              String    @id @default("default")
  section_metrics Json?     // {wallet: [{label, path}]}
  chart_palette   String[]  // Hex colors
  empty_states  Json?     // {no_pending_verifications: "message"}
  updated_at   DateTime  @updatedAt

  @@map("admin_ui_config")
}

// Fallback/Mock Data
model AdminMockData {
  id              String    @id @default(cuid())
  data_key        String    @unique  // e.g., "cms_weekly_trend"
  data_type      String    // "chart", "kpi", "sparkline"
  payload        Json
  active         Boolean   @default(true)
  sort_order     Int       @default(0)

  @@map("admin_mock_data")
}

// Role & Business Config
model AdminRoleConfig {
  id              String    @id @default(cuid())
  role_key        String    @unique
  label           String
  is_admin_role   Boolean   @default(false)
  benefits       String[]  // Marketing strings
  active         Boolean   @default(true)

  @@map("admin_role_config")
}

// Governance Config
model GovernanceConfig {
  id              String    @id @default("default")
  initial_policy  Json?
  initial_version Json?
  initial_simulation Json?
  initial_template Json?
  default_rules  Json?     // {"maxWarnings":1}
  updated_at    DateTime  @updatedAt

  @@map("governance_config")
}

// Branding & Security
model AdminBranding {
  id              String    @id @default(cuid())
  brand_key       String    @unique  // "app_name", "admin_title"
  value          String
  active         Boolean   @default(true)

  @@map("admin_branding")
}

model AdminSecurityPurpose {
  id              String    @id @default(cuid())
  purpose_key    String    @unique  // "admin_security"
  purpose_type  String    // "passkey", "mfa"
  active        Boolean   @default(true)

  @@map("admin_security_purposes")
}

// Configuration Version History (Audit Trail)
model AdminConfigHistory {
  id              String    @id @default(cuid())
  config_type     String    // "inventory", "actions", "ui"
  changed_by      String
  previous_value Json?
  new_value      Json?
  created_at     DateTime  @default(now())

  @@map("admin_config_history")
}
```

### 1.2 Migration Command

```bash
# Generate and run migration
npm run db:generate
npm run db:migrate:dev -- --name add_admin_dynamic_config
```

---

## Phase 2: Backend API Design

### 2.1 New Endpoints (adminConfigRoutes.js)

```javascript
// GET /api/admin/config/inventory - Fetch full inventory
// GET /api/admin/config/inventory/:moduleId - Fetch specific module
// PUT /api/admin/config/inventory - Update inventory (admin only)
// GET /api/admin/config/actions - Fetch all actions
// PUT /api/admin/config/actions - Update actions
// GET /api/admin/config/capabilities - Fetch capabilities
// PUT /api/admin/config/capabilities - Update capabilities
// GET /api/admin/config/ui - Fetch UI config
// PUT /api/admin/config/ui - Update UI config
// GET /api/admin/config/mock/:type - Fetch mock data
// PUT /api/admin/config/mock/:type - Update mock data
// GET /api/admin/config/roles - Fetch role config
// PUT /api/admin/config/roles - Update role config
// GET /api/admin/config/governance - Fetch governance config
// PUT /api/admin/config/governance - Update governance config
// GET /api/admin/config/branding - Fetch branding
// PUT /api/admin/config/branding - Update branding
// GET /api/admin/config/history/:type - Get config history
```

### 2.2 Service Layer (adminDynamicConfigService.js)

```javascript
// Core functions needed:
-getInventoryConfig() - // Merges DB config with hardcoded defaults
  getInventoryByModule(id) - // Single module with sections
  updateInventoryConfig(data, actorId) - // With history tracking
  getActionsConfig() - // All action definitions
  updateActionsConfig(data, actorId) -
  getCapabilitiesByModule(moduleId) -
  updateCapabilities(data, actorId) -
  getUiConfig() - // Merged with defaults
  updateUiConfig(data, actorId) -
  getMockData(type) -
  updateMockData(key, data, actorId) -
  getRoleConfig() -
  updateRoleConfig(data, actorId) -
  getGovernanceConfig() -
  updateGovernanceConfig(data, actorId) -
  getBrandingConfig() -
  updateBrandingConfig(data, actorId) -
  getConfigHistory(type, limit);
```

### 2.3 Seeding Script (scripts/seed-admin-config.js)

```javascript
// Initial seed with hardcoded values converted to JSON:
- admin_modules (6 modules from ADMIN_INVENTORY)
- admin_sections (all sections nested under modules)
- admin_actions (all ACTION_GROUPS entries)
- admin_capabilities (INFRA, NETWORK, ULTRA capabilities)
- admin_ui_config (SECTION_METRICS, DEFAULT_PIE_PALETTE, DEFAULT_EMPTY_STATE_COPY)
- admin_mock_data (DEFAULT_CMS_WEEKLY_TREND, etc.)
- admin_role_config (KNOWN_ROLES with benefits)
- governance_config (initialPolicy, etc.)
- admin_branding (GarTexHub, Admin Matrix, Command Deck)
- admin_security_purposes (admin_security)
```

---

## Phase 3: Frontend Integration

### 3.1 State Management Changes

```javascript
// Before (hardcoded):
const inventory = ADMIN_INVENTORY;
const fallbackInventory = DEFAULT_ADMIN_PANEL_FALLBACK_INVENTORY;

// After (fetch from API + fallback):
const [inventory, setInventory] = useState(null);
const [fallbackInventory, setFallbackInventory] = useState(
  DEFAULT_ADMIN_PANEL_FALLBACK_INVENTORY,
);

useEffect(() => {
  apiRequest("/api/admin/config/inventory")
    .then((data) => setInventory(data))
    .catch(() => setInventory(fallbackInventory));
}, []);
```

### 3.2 New Configuration Hook

```javascript
// hooks/useAdminConfig.js
import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../lib/auth";

export function useAdminConfig(configType) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/api/admin/config/${configType}`);
      setConfig(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [configType]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { config, loading, error, refetch };
}

// Usage:
const { config: inventory, loading } = useAdminConfig("inventory");
const { config: actions } = useAdminConfig("actions");
const { config: uiConfig } = useAdminConfig("ui");
```

### 3.3 Components to Update

| Component       | File                    | Changes                                               |
| --------------- | ----------------------- | ----------------------------------------------------- |
| AdminPanel      | AdminPanel.jsx          | Replace hardcoded constants with useAdminConfig hooks |
| Sidebar         | AdminPanel.jsx (render) | Use dynamic inventory from config                     |
| ActionDialog    | AdminPanel.jsx          | Render dynamic action fields                          |
| DashboardCharts | AdminPanel.jsx          | Use dynamic section_metrics and palettes              |
| EmptyStates     | Various                 | Use dynamic empty state copy                          |
| Branding        | Layout/Header           | Use dynamic branding values                           |

### 3.4 Error Handling Strategy

```
┌─────────────────────────────────────────────────────────┐
│  API Request                                             │
│     │                                                    │
│     ▼                                                    │
│  ┌──────────┐  success  ┌───────────┐                   │
│  │ /config  │───OK──────▶│ Use data   │                   │
│  └──────────┘            └───────────┘                   │
│     │                                                    │
│     │ error                                               │
│     ▼                                                    │
│  ┌────────────────┐  no data  ┌──────────────────┐      │
│  │ Check fallback │──OK──────▶│ Use hardcoded     │      │
│  │ config stored │           │ DEFAULT_ constants│      │
│  └────────────────┘          └──────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 4: Migration Strategy (By Category)

### 4.1 Priority 1: Structural Data (Week 1)

| Data                                   | Source File           | Migration                                 |
| -------------------------------------- | --------------------- | ----------------------------------------- |
| ADMIN_INVENTORY                        | adminMasterService.js | Extract to admin_modules + admin_sections |
| DEFAULT_ADMIN_PANEL_FALLBACK_INVENTORY | AdminPanel.jsx        | Seed as fallback in DB                    |
| ICON_REGISTRY                          | AdminPanel.jsx        | Create icon_aliases table                 |

**Migration Steps:**

1. Create JSON extraction script
2. Run seed with extracted data
3. Update frontend to fetch from API
4. Remove hardcoded after verification

### 4.2 Priority 2: Actions (Week 2)

| Data                       | Source File    | Migration                     |
| -------------------------- | -------------- | ----------------------------- |
| ACTION_GROUPS              | AdminPanel.jsx | Extract to admin_actions      |
| INFRA_CAPABILITIES         | AdminPanel.jsx | Extract to admin_capabilities |
| NETWORK_CAPABILITIES       | AdminPanel.jsx | Extract to admin_capabilities |
| DEFAULT_ULTRA_CAPABILITIES | AdminPanel.jsx | Extract to admin_capabilities |

**Migration Steps:**

1. Parse ACTION_GROUPS array (hundreds of lines)
2. Convert each action to JSON
3. Seed admin_actions table
4. Update action dialog to use dynamic fields
5. Add field type rendering (text, select, date)

### 4.3 Priority 3: UI Config (Week 2-3)

| Data                     | Source File    | Migration                            |
| ------------------------ | -------------- | ------------------------------------ |
| SECTION_METRICS          | AdminPanel.jsx | Seed admin_ui_config.section_metrics |
| DEFAULT_PIE_PALETTE      | AdminPanel.jsx | Seed admin_ui_config.chart_palette   |
| DEFAULT_EMPTY_STATE_COPY | AdminPanel.jsx | Seed admin_ui_config.empty_states    |

### 4.4 Priority 4: Mock Data (Week 3)

| Data                            | Source File    | Migration            |
| ------------------------------- | -------------- | -------------------- |
| DEFAULT_CMS_WEEKLY_TREND        | AdminPanel.jsx | Seed admin_mock_data |
| DEFAULT_ULTRA_MINI_CHART_POINTS | AdminPanel.jsx | Seed admin_mock_data |
| DEFAULT_ULTRA_MINI_CHART_KPIS   | AdminPanel.jsx | Seed admin_mock_data |

### 4.5 Priority 5: Business Logic (Week 3-4)

| Data                              | Source File    | Migration              |
| --------------------------------- | -------------- | ---------------------- |
| buyerBenefits                     | ?              | Seed admin_role_config |
| factoryBenefits                   | ?              | Seed admin_role_config |
| buyingHouseBenefits               | ?              | Seed admin_role_config |
| KNOWN_ROLES                       | AdminPanel.jsx | Seed admin_role_config |
| DEFAULT_ADMIN_PANEL_ALLOWED_ROLES | AdminPanel.jsx | Seed admin_role_config |

### 4.6 Priority 6: Governance (Week 4)

| Data               | Source File | Migration              |
| ------------------ | ----------- | ---------------------- |
| initialPolicy      | ?           | Seed governance_config |
| initialVersion     | ?           | Seed governance_config |
| initialSimulation  | ?           | Seed governance_config |
| initialTemplate    | ?           | Seed governance_config |
| default rules JSON | ?           | Seed governance_config |

### 4.7 Priority 7: Branding & Security (Week 4-5)

| Data           | Source File    | Migration                    |
| -------------- | -------------- | ---------------------------- |
| GarTexHub      | Multiple files | Seed admin_branding          |
| Admin Matrix   | Multiple files | Seed admin_branding          |
| Command Deck   | Multiple files | Seed admin_branding          |
| admin_security | Security flows | Seed admin_security_purposes |

---

## Phase 5: Admin UI for Configuration Management

### 5.1 New Admin Pages

```
/admin/config          - Configuration dashboard
/admin/config/inventory - Module/section editor
/admin/config/actions  - Action definition editor
/admin/config/ui        - UI config editor
/admin/config/mock     - Mock data editor
/admin/config/roles     - Role config editor
/admin/config/governance - Governance config editor
/admin/config/branding - Branding editor
/admin/config/history  - Config change history
```

### 5.2 Editor Features

- **JSON Editor** - Direct JSON editing with validation
- **Version Preview** - See diff before saving
- **Rollback** - Revert to previous version
- **Import/Export** - Bulk JSON import/export
- **Search** - Find config by key
- **Filters** - Filter by type, active status

---

## Phase 6: Implementation Roadmap

### Timeline

```
Week 1:   Schema + Seeding + Basic API
Week 2:   Frontend hooks + Inventory conversion
Week 3:   Actions + UI config conversion
Week 4:   Mock data + Role/Governance conversion
Week 5:   Branding conversion + Admin UI
Week 6:   Testing + Error handling + Cleanup
```

### Testing Strategy

1. **Unit Tests** - Service layer functions
2. **Integration Tests** - API endpoints
3. **E2E Tests** - Full config cycle
4. **Manual Testing** - Admin UI editors
5. **Regression Tests** - Verify all features work

---

## Key Design Decisions

### 1. Lazy Loading vs Eager Loading

- **Decision**: Lazy load config per category
- **Rationale**: Reduces initial payload, allows incremental updates
- **Tradeoff**: Slight latency on first access

### 2. Hardcoded Fallback Strategy

- **Decision**: Keep hardcoded defaults as final fallback
- **Rationale**: App must work if DB is unavailable
- **Implementation**: Default constants remain, used only on API failure

### 3. Caching Strategy

- **Decision**: Redis cache with 5-minute TTL
- **Rationale**: Admin config changes infrequently
- **Cache Invalidation**: On config update via API

### 4. Versioning Strategy

- **Decision**: Single active version with history table
- **Rationale**: Simple rollback capability
- **Tradeoff**: Full history storage if many changes

---

## File Changes Summary

### New Files

- `prisma/migrations/...add_admin_dynamic_config.sql`
- `server/services/adminDynamicConfigService.js`
- `server/routes/adminConfigRoutes.js`
- `server/controllers/adminConfigController.js`
- `src/hooks/useAdminConfig.js`
- `src/components/admin/ConfigEditor.jsx`
- `src/pages/admin/AdminConfig.jsx`
- `scripts/seed-admin-config.js`

### Modified Files

- `prisma/schema.prisma` - Add new models
- `server/services/adminMasterService.js` - Add config loading
- `src/pages/AdminPanel.jsx` - Replace hardcoded with dynamic
- Multiple component files - Use dynamic config hooks
- `server/server.js` - Register new routes

### Deleted (After Verification)

- Hardcoded constants from AdminPanel.jsx
- Hardcoded constants from adminMasterService.js
