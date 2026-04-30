# AdminPanel - Route `/admin/panel`

**Access:** Protected - Owner/Admin roles only

## 1) Purpose

Primary admin dashboard for platform-wide management. Provides:
- Platform metrics dashboard (users, orgs, verification, finance, wallet)
- Action center for bulk admin operations
- Configurable UI sections via `useAdminConfig` hook
- Infrastructure, network, server-admin, CMS, and ultra-security management tabs

**Backend interactions:**
- GET `/admin/config` - Load admin panel configuration
- POST `/admin/actions` - Execute admin actions (users, orgs, verification, finance, etc.)
- POST `/infra/actions` - Infrastructure management actions
- POST `/network/actions` - Network management actions
- POST `/admin/server-admin/actions` - Server administration
- POST `/admin/cms/actions` - CMS content management
- POST `/admin/security/actions` - Ultra security layer

## 2) Page Structure (Components + Sections)

### 2.1 Imported Components
- `../components/AccessDeniedState` - Access denied fallback
- `../components/admin/RejectionReasonModal` - Rejection reason modal
- `../lib/auth` - apiRequest, getCurrentUser, getToken, saveSession
- `../hooks/useAdminConfig` - useInventory, useUiConfig, useCapabilities, useActions, useActionGroups

### 2.2 Structural Sections
- `<main className="min-h-screen bg-slate-950 text-slate-100">` - Main container (line ~12800)
- Dashboard metrics grid with pie charts, line charts, area charts (recharts)
- Action center with categorized action groups
- Config editor section
- Multi-tab interface: Platform, Infra, Network, Server-Admin, CMS, Ultra-Security, Config

## 3) Styling (className blocks)

### 3.1 Custom CSS utilities referenced
- `.nav-glass` - Navigation glass effect
- `.spotlight-card` - Card with spotlight effect
- `.skeleton` - Loading skeleton
- `.neo-page`, `.neo-panel` - Neo-brutalist styling
- `.cyberpunk-page`, `.cyberpunk-card` - Cyberpunk theme
- `.verified-shimmer`, `.verified-pulse` - Verification animations
- `.conic-beam` - Gradient beam effect

### 3.2 Tailwind utilities used
- Layout: `flex`, `grid`, `min-h-screen`, `w-full`, `max-w-*`
- Colors: `bg-slate-*`, `text-slate-*`, `text-emerald-*`, `bg-indigo-*`
- Spacing: `p-*`, `m-*`, `gap-*`
- Charts: `recharts` components (AreaChart, BarChart, PieChart, LineChart)

## 4) API Map

| Frontend Call | Backend Route | Controller |
|---------------|---------------|------------|
| GET /admin/config | `/admin/config` | adminController.getConfig |
| POST /admin/actions | `/admin/actions` | adminController.executeAction |
| POST /infra/actions | `/infra/actions` | infraController.executeAction |
| POST /network/actions | `/network/actions` | networkController.executeAction |
| POST /admin/server-admin/actions | `/admin/server-admin/actions` | serverAdminController.executeAction |
| POST /admin/cms/actions | `/admin/cms/actions` | cmsController.executeAction |
| POST /admin/security/actions | `/admin/security/actions` | securityController.executeAction |

## 5) Component Inventory

- `AccessDeniedState` - Shown when user lacks admin permissions
- `RejectionReasonModal` - Modal for rejection reason input
- Recharts: AreaChart, BarChart, PieChart, LineChart, ResponsiveContainer, Tooltip
- Lucide icons: 60+ icons for various admin functions

## 6) State Management

- `useState` for:
  - `inventory` - Admin panel sections
  - `config` - UI configuration
  - `metrics` - Dashboard metrics data
  - `selectedTab` - Active tab
  - `loading` - Loading states
  - `error` - Error states

## 7) Key Functions

- `getAdminPanelAllowedRoles(config)` - Get allowed roles from config
- `getAdminPanelFallbackInventory(config)` - Get fallback inventory
- `getIconComponent(iconName)` - Resolve icon component
- `listToTextarea()`, `textareaToList()` - Convert between formats
- `exportEmailsCsv(rows)` - Export email list as CSV
- `formatNumber()`, `formatCurrency()` - Number formatting
- `_resolvePath(source, path)` - Deep object path resolution
- `isHexColor()` - Validate hex colors

## 8) Animations & Motion

- Recharts animations for data visualization
- Tailwind transitions on interactive elements
- No explicit Framer Motion usage detected

## 9) Theme / Dark Mode

- Dark mode default: `bg-slate-950`, `text-slate-100`
- Uses Tailwind dark mode classes
- Configurable via `useAdminConfig` hook

## 10) Accessibility

- Uses semantic HTML (`section`, `h1`, `h2`, `button`, `input`)
- Icon buttons for actions
- Keyboard accessible form inputs

## 11) Open Issues / TODOs

- Large file size (~16k lines) - consider code splitting
- Many action groups may need lazy loading
- Config editor needs validation

## 12) Test Coverage

- Unit tests in `tests/unit/frontendAdminPanel.test.js` (if exists)
- Integration tests for admin actions

## 13) Route Guards & Redirects

- Access check via `getCurrentUser()` and role validation
- Redirect to `/access-denied` if not owner/admin
- Role allowed: `["owner", "admin"]` (configurable)

## 14) External Dependencies

- `recharts` - Data visualization charts
- `@simplewebauthn/browser` - Passkey authentication
- `lucide-react` - Icon library

## 15) Performance Notes

- Large bundle size due to many icons and charts
- Consider code splitting by tab
- Metrics data should be paginated/cached
- Use `useMemo` for expensive chart data calculations

## 16) Error Handling

- Try/catch in API calls
- Error states displayed inline
- Status messages for action results
- Fallback inventory if config unavailable

## 17) Analytics Events

- `trackClientEvent` calls for admin actions
- Track policy changes, user modifications
- Enforcement actions logged

## 18) URL Params / Query Params

- Tab selection via React state (not URL params)
- User ID in trust signal evaluation

## 19) Real-time Updates

- No WebSocket/SSE detected
- Manual refresh button available
- Polling not implemented

## 20) Form Validation

- JSON validation for rules/permissions fields
- Required field validation on forms
- No Yup/Zod schemas detected

## 21) Keyboard Shortcuts

- No explicit keyboard shortcuts detected

## 22) Feature Flags

- Config-driven via `useAdminConfig` hook
- Feature flags from `/admin/config` endpoint

## 23) SEO / Meta

- Page title: "Admin Panel" (not in metadata)
- No og:tags or meta description set

## 24) Caching Strategy

- No SWR/React Query detected
- Config cached in `useAdminConfig` hook

## 25) File Size / Bundle Impact

- ~16,489 lines of code
- Large bundle impact - recommend code splitting
- Icons and charts contribute significantly

---

*Generated from source: src/pages/AdminPanel.jsx*