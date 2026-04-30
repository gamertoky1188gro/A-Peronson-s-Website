# AdminGovernance - Route `/admin/governance`

**Access:** Protected - Admin roles only

## 1) Purpose

Admin governance console for policy management, trust scoring, and enforcement actions.
- Create and manage governance policies
- Policy version control with role/plan/region scopes
- Trust signal evaluation for users
- Enforcement action application
- Notification template management
- Monthly compliance reports

**Backend interactions:**
- GET `/admin/governance/policies` - List policies
- POST `/admin/governance/policies` - Create policy
- POST `/admin/governance/policy-versions` - Create policy version
- POST `/admin/governance/simulate` - Simulate policy
- GET `/admin/governance/trust/signals` - Get user trust signals
- POST `/admin/governance/trust/evaluate` - Evaluate user trust
- POST `/admin/governance/enforcement/apply` - Apply enforcement
- GET `/admin/governance/templates` - List notification templates
- POST `/admin/governance/templates` - Create template
- POST `/admin/governance/reports/monthly` - Generate monthly report

## 2) Page Structure (Components + Sections)

### 2.1 Imported Components
- `../lib/auth` - apiRequest

### 2.2 Structural Sections
- `<div className="min-h-screen bg-slate-950 p-6 text-slate-100">` - Main container
- Policy Editor section
- Policy Version Creator section
- Policy Simulator section
- Trust Evaluation section
- Notification Templates section
- Monthly Reports section

## 3) Styling (className blocks)

### 3.1 Tailwind utilities used
- Layout: `flex`, `grid`, `min-h-screen`, `max-w-6xl`
- Colors: `bg-slate-950`, `text-slate-100`, `bg-indigo-600`, `border-slate-800`
- Spacing: `p-6`, `p-4`, `gap-2`, `mt-3`
- Borders: `border`, `rounded-xl`

## 4) API Map

| Frontend Call | Backend Route | Purpose |
|---------------|---------------|---------|
| GET /admin/governance/policies | `/admin/governance/policies` | List all policies |
| POST /admin/governance/policies | `/admin/governance/policies` | Create new policy |
| POST /admin/governance/policy-versions | `/admin/governance/policy-versions` | Create version |
| POST /admin/governance/simulate | `/admin/governance/simulate` | Simulate policy |
| GET /admin/governance/trust/signals | `/admin/governance/trust/signals` | Get user trust data |
| POST /admin/governance/trust/evaluate | `/admin/governance/trust/evaluate` | Evaluate trust |
| POST /admin/governance/enforcement/apply | `/admin/governance/enforcement/apply` | Apply action |
| GET /admin/governance/templates | `/admin/governance/templates` | List templates |
| POST /admin/governance/templates | `/admin/governance/templates` | Create template |
| POST /admin/governance/reports/monthly | `/admin/governance/reports/monthly` | Monthly report |

## 5) Component Inventory

- Pure React component with no external child components
- Standard HTML form elements

## 6) State Management

- `useState` for:
  - `policy` - Policy form (code, name, description)
  - `version` - Version form (policyId, status, effectiveFrom, scopes, rulesJson)
  - `simulation` - Simulation form
  - `userId` - User ID for trust evaluation
  - `trustSignals` - Trust signal data
  - `policies` - List of policies
  - `history` - Enforcement history
  - `simulationResult` - Simulation output
  - `reportMonth` - Report month selector
  - `monthlyReport` - Generated report
  - `templates` - Notification templates
  - `status` - Status message

## 7) Key Functions

- `splitCsv(value)` - Split CSV string to array
- `load()` - Load all governance data via Promise.all

## 8) Animations & Motion

- No Framer Motion detected
- Simple CSS transitions on buttons/inputs

## 9) Theme / Dark Mode

- Dark theme: `bg-slate-950`, `text-slate-100`
- Uses `slate-*` color palette

## 10) Accessibility

- Standard semantic HTML
- Form labels via placeholder
- Keyboard accessible inputs

## 11) Open Issues / TODOs

- Form validation could be improved
- Error boundary recommended

## 12) Test Coverage

- Test file: `tests/unit/adminGovernance.test.js` (if exists)

## 13) Route Guards & Redirects

- Must be admin role
- No explicit redirect (relies on route guard in parent)

## 14) External Dependencies

- None (pure React + Tailwind)
- Uses `apiRequest` from auth lib

## 15) Performance Notes

- Lightweight component (~400 lines)
- Multiple API calls on mount - consider batching

## 16) Error Handling

- Try/catch in load function
- Status message display for errors

## 17) Analytics Events

- No explicit analytics tracking

## 18) URL Params / Query Params

- `user_id` query param in trust signals endpoint

## 19) Real-time Updates

- No WebSocket/SSE
- Manual refresh via load()

## 20) Form Validation

- JSON validation for rules field
- No Zod/Yup schemas

## 21) Keyboard Shortcuts

- None detected

## 22) Feature Flags

- None detected

## 23) SEO / Meta

- No meta tags set
- Title: "Admin Governance Console"

## 24) Caching Strategy

- No caching implemented

## 25) File Size / Bundle Impact

- ~407 lines - lightweight component
- Minimal bundle impact

---

*Generated from source: src/pages/AdminGovernance.jsx*