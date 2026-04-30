# OnboardingWizard - Route `/onboarding`

**Access:** Protected - All roles (buyer, buying_house, factory, owner, admin, agent)

## 1) Purpose

3-step onboarding wizard for new users after signup:
- Step 1: Profile image upload (URL)
- Step 2: Organization name
- Step 3: Industry/category selection

**Backend interactions:**
- POST `/api/onboarding` - Submit onboarding data
- Updates user session with `saveSession`

## 2) Page Structure (Components + Sections)

### 2.1 Imported Components
- `../../components/ui/BackButton` - Navigation back button
- `react-router-dom` - useNavigate

### 2.2 Structural Sections
- Step indicator (1/3, 2/3, 3/3)
- Step 1: Profile image URL input
- Step 2: Organization name input (min 3 chars)
- Step 3: Category selection (multi-select)
- Navigation: Back, Skip, Next/Submit buttons

## 3) Styling (className blocks)

### 3.1 Custom CSS classes
- `bg-[rgba(10,102,194,0.10)]` - Brand accent background
- `text-gtBlue` - Custom brand color
- `shadow-borderless`, `shadow-borderlessDark`

### 3.2 Tailwind utilities used
- Layout: `flex`, `inline-flex`, `min-h-screen`
- Colors: `bg-slate-*`, `text-slate-*`, `dark:`
- Spacing: `p-4`, `py-6`, `mt-4`, `gap-2`

## 4) API Map

| Frontend Call | Backend Route | Purpose |
|---------------|---------------|---------|
| POST /api/onboarding | `/onboarding` | Submit onboarding data |

## 5) Component Inventory

- `BackButton` - UI component
- `StepHeader` - Inline step header component

## 6) State Management

- `useState` for:
  - `step` - Current step (1-3)
  - `saving` - Saving state
  - `error` - Error message
  - `profileImage` - Profile image URL
  - `organizationName` - Org name
  - `categories` - Selected categories array

## 7) Key Functions

- `toggleCategory(cat)` - Toggle category selection
- `submit({ skipped })` - Submit onboarding data
- `next()` - Validate and advance step
- `back()` - Go to previous step

## 8) Animations & Motion

- No Framer Motion detected

## 9) Theme / Dark Mode

- Full dark mode support via `dark:` prefixes

## 10) Accessibility

- Semantic HTML forms
- aria-label on buttons
- Keyboard navigation support

## 11) Open Issues / TODOs

- URL validation could be more robust

## 12) Test Coverage

- Test file: `tests/unit/onboardingWizard.test.js` (if exists)

## 13) Route Guards & Redirects

- Requires login (token check)
- Non-blocking: users can skip
- Re-prompts until `onboarding_completed` is true
- Redirects to role home on completion via `getRoleHome`

## 14) External Dependencies

- `lucide-react` (via BackButton)

## 15) Performance Notes

- Lightweight component (~300 lines)
- Local state only

## 16) Error Handling

- Validation errors displayed inline
- Try/catch in submit function

## 17) Analytics Events

- No explicit analytics tracking

## 18) URL Params / Query Params

- None

## 19) Real-time Updates

- None

## 20) Form Validation

- Organization name: min 3 characters
- At least one category required (unless skipped)
- Profile image URL validation

## 21) Keyboard Shortcuts

- None

## 22) Feature Flags

- None

## 23) SEO / Meta

- No meta tags set

## 24) Caching Strategy

- No caching

## 25) File Size / Bundle Impact

- ~304 lines - lightweight
- Minimal bundle impact

---

*Generated from source: src/pages/auth/OnboardingWizard.jsx*