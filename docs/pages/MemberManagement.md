# MemberManagement — Complete Page Specification

## Page Title & Description
- **Page title:** `MemberManagement`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/MemberManagement.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<button>`, `<form>`, `<input>`, `<table>`.
- **Approximate placement model (desktop):**
  - Header / top controls: `x: 0-100%`, `y: 0-15%` (if present).
  - Primary content zone: `x: 5-95%`, `y: 12-88%`.
  - Sidebars/panels: left and/or right columns where `aside` blocks are present.
  - Footer/trailing actions: lower area of the page card/container.

## Theme & Styling
- **Theme system:** Tailwind utility classes and app-level dark/light behavior.
- **Explicit color tokens found in implementation:** `#0A66C2`, `#1A1A1A`, `#5A5A5A`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `Close`
- `Member Management`
- `Manage sub-accounts and permissions`
- `+ Add New Member`
- `Name`
- `Username`
- `Member ID`
- `Role`
- `Status`
- `Actions`
- `Loading members...`
- `No members found.`
- `Edit`
- `Reset`
- `Deactivate`
- `Remove`
- `Create`
- `Permissions`
- `Permission matrix (view/edit per module)`
- `View`
- `active`
- `inactive`
- `Save changes`
- `react`
- `../lib/auth`
- `/org/members`
- `,
  member_id:`
- `,
  role:`
- `,
  password:`
- `text-sm text-gray-500`
- `)
    setSuccess(`
- `POST`
- `Member created.`
- `)
    try {
      await apiRequest(`${MEMBER_API_BASE}/${memberId}?remove=${remove ?`
- `:`
- `}`, { method:`
- `Member removed.`
- `Member deactivated.`
- `)
    try {
      await apiRequest(`${MEMBER_API_BASE}/${memberId}`, { method:`
- `Member updated.`
- `text-sm text-[#5A5A5A]`
- `Search members`
- `overflow-x-auto`
- `w-full text-left text-sm`
- `text-[#5A5A5A]`
- `py-2 px-3`
- `py-4 px-3`
- `border-t`
- `Create member`
- `space-y-3`
- `placeholder=`
- `submit`
- `text-sm mb-1`
- `grid grid-cols-2 gap-2`
- `checkbox`
- `text-red-600 text-sm mt-1`
- `space-y-2`
- `,
    role: member.role ||`
- `,
    status: member.status ||`
- **Button labels detected:** `Close`, `Create`, `handleDeactivateOrRemove(m.id, false)}>Deactivate`, `handleDeactivateOrRemove(m.id, true)}>Remove`, `handleResetPassword(m.id)}>Reset`, `onSave(form)}>Save changes`, `setActivePermissionMember(m)}>Edit`, `setShowCreate(true)}>+ Add New Member`
- **Input placeholders detected:** `Initial password`, `Member ID`, `Member name`, `Role`, `Search members`, `Unique member ID`, `Unique username`, `Username`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => handleDeactivateOrRemove(m.id, false)`
  - `() => handleDeactivateOrRemove(m.id, true)`
  - `() => handleResetPassword(m.id)`
  - `() => onSave(form)`
  - `() => setActivePermissionMember(m)`
  - `() => setShowCreate(true)`
  - `(e) =>
                    onChange({
                      ...matrix,
                      [section]: { ...matrix?.[section], edit: e.target.checked`
  - `(e) =>
                    onChange({
                      ...matrix,
                      [section]: { ...matrix?.[section], view: e.target.checked`
  - `(e) => setCreateForm({ ...createForm, member_id: e.target.value`
  - `(e) => setCreateForm({ ...createForm, name: e.target.value`
  - `(e) => setCreateForm({ ...createForm, password: e.target.value`
  - `(e) => setCreateForm({ ...createForm, role: e.target.value`
  - `(e) => setCreateForm({ ...createForm, username: e.target.value`
  - `(e) => setForm({ ...form, member_id: e.target.value`
  - `(e) => setForm({ ...form, name: e.target.value`
  - `(e) => setForm({ ...form, role: e.target.value`
  - `(e) => setForm({ ...form, status: e.target.value`
  - `(e) => setForm({ ...form, username: e.target.value`
  - `(e) => setSearch(e.target.value)`
  - `(e) => {
                const next = e.target.checked ? [...permissions, perm] : permissions.filter((p) => p !== perm)
                onChange(next)`
  - `(permission_matrix) => setCreateForm({ ...createForm, permission_matrix`
  - `(permission_matrix) => setForm({ ...form, permission_matrix`
  - `(permissions) => setCreateForm({ ...createForm, permissions`
  - `(permissions) => setForm({ ...form, permissions`
  - `handleCreateMember`
  - `onClose`
- **Behavior model:** user actions trigger local state updates and/or API requests through shared auth/request helpers where used.

## Images & Media
- **Image elements:** none explicitly declared in this page source (icons may come from component libraries).
- **Video elements:** not explicitly declared.
- **Iconography:** uses shared icon sets/components (e.g., Lucide or emoji/text icons where coded).

## Extra Notes / Metadata
- **SEO metadata:** no page-specific `<head>` metadata is set in this component; defaults are inherited from app shell/index.
- **Accessibility notes:** semantic improvements should ensure button labels, alt text, focus states, and color contrast remain compliant.
- **Responsive behavior:** controlled by utility breakpoints (`sm:`, `md:`, `lg:` etc.) and flexible grid/flex containers.
- **Implementation source of truth:** this markdown reflects the current component and should be updated whenever UI text/layout/classes change.
