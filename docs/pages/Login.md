# Login - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `Login`
- Route: `/login`
- Purpose: Authenticate existing users and redirect them to role-specific dashboards or requested protected route.

## Layout & Structure
- Full-screen centered auth layout:
  - Root: full viewport height (`min-h-screen`) with centered card.
  - Card width: `max-w-md`.
- Card structure (top to bottom):
1. Heading and description.
2. Login form.
3. New account link.

Approximate placement:
- Auth card centered around viewport midpoint (x=50%, y=50%).
- Form controls stacked vertically with consistent spacing.

## Theme & Styling
- Light auth theme using white card surfaces and soft borders.
- Primary action color: indigo (`bg-indigo-600`, `text-indigo-500` for link accents).
- Typography:
  - Title: `text-3xl font-bold`
  - Supporting text: `text-sm text-gray-600`
- Inputs:
  - Full-width bordered rounded inputs (`px-4 py-3 border rounded-lg`).

## Content Details
Exact text:
- Heading: `Login`
- Description: `Access pages based on your role (Buyer, Factory, Buying House, Admin).`
- Field labels: `Email`, `Password`
- Checkbox label: `Remember me`
- Error area: displays runtime API error string.
- Button states:
  - idle: `Sign in`
  - loading: `Signing in...`
- Footer line: `New here? Create account`

## Interactions & Functionality
- Form submit:
  - Handler: `handleLogin`.
  - Prevents default submit behavior.
  - Sends `POST /auth/login` through `apiRequest`.
  - Payload:
```json
{ "email": "<input>", "password": "<input>" }
```
- On success:
  - Calls `saveSession(data.user, data.token, { remember: rememberMe })`.
  - Redirect:
    - first preference: `location.state.from`
    - fallback: `getRoleHome(data.user.role)`.
- On failure:
  - Displays `err.message` inline in red text.
- Controlled inputs:
  - Email and password use React state.
  - Remember-me checkbox toggles persistent session storage behavior.
- Link:
  - `Create account` navigates to `/signup`.

## Images & Media
- No media assets used.

## Extra Notes / Metadata
- SEO:
  - No page-specific metadata in component.
- Accessibility:
  - Inputs are paired with visible labels.
  - Submit button uses disabled state while loading.
- Responsive:
  - Card remains full-width with max width constraint and edge padding on small screens.
