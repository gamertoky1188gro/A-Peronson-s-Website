# MvpDashboard — Complete Page Specification

## Page Title & Description
- **Page title:** `MvpDashboard`
- **Primary route(s):** `/mvp`
- **Purpose:** This page is implemented by `src/pages/MvpDashboard.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<button>`, `<form>`, `<header>`, `<input>`, `<main>`, `<section>`.
- **Approximate placement model (desktop):**
  - Header / top controls: `x: 0-100%`, `y: 0-15%` (if present).
  - Primary content zone: `x: 5-95%`, `y: 12-88%`.
  - Sidebars/panels: left and/or right columns where `aside` blocks are present.
  - Footer/trailing actions: lower area of the page card/container.

## Theme & Styling
- **Theme system:** Tailwind utility classes and app-level dark/light behavior.
- **Explicit color tokens found in implementation:** `No explicit hex values; inherited palette/classes`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `GarTexHub Enterprise UX MVP`
- `Behavioral architecture for trust-first B2B textile commerce.`
- `Logout`
- `Register`
- `Buyer`
- `Factory`
- `Buying House`
- `Admin`
- `Create Account`
- `Login`
- `) : (`
- `Onboarding (3 Steps)`
- `Save Onboarding`
- `Role:`
- `Submit Verification Bundle`
- `Refresh Verification / Subscription / Analytics`
- `Post Buyer Request`
- `Publish Request`
- `Post Company Product`
- `Shirts`
- `Knitwear`
- `Denim`
- `Women`
- `Kids`
- `Publish Product`
- `Combined Feed (Buyer Requests + Company Products)`
- `Unique Toggle`
- `All`
- `Buyer Requests`
- `Company Products`
- `Load Feed`
- `Conversation Lock`
- `Start Conversation / Claim & Respond`
- `Grant Access`
- `Rule-Based AI Guidance`
- `Ask Assistant`
- `react`
- `GET`
- `:`
- `Request failed`
- `jwt`
- `user`
- `, email:`
- `, password:`
- `, role:`
- `, categories:`
- `, material:`
- `, category:`
- `, moq:`
- `, lead_time_days:`
- `, video_url:`
- `all`
- `|| user.role ===`
- `/auth/register`
- `POST`
- `Registered`
- `,`
- `Logged out`
- `Buyer request posted`
- `/products`
- `submitted`
- `feedback`
- `grid two-col`
- `card stack`
- `Name`
- `Email`
- `email`
- `Password`
- `password`
- `buyer`
- **Button labels detected:** `Ask Assistant`, `Create Account`, `Grant Access`, `Load Feed`, `Login`, `Logout`, `Publish Product`, `Publish Request`, `Refresh Verification / Subscription / Analytics`, `Save Onboarding`, `Start Conversation / Claim & Respond`, `Submit Verification Bundle`
- **Input placeholders detected:** `1) Profile Image URL`, `2) Organization Name`, `3) Category Selection (comma separated)`, `Ask about setup, verification, premium, help`, `Category`, `Certifications (comma separated)`, `Custom Description`, `Description`, `Email`, `Lead Time Days`, `MOQ`, `Material`, `Name`, `Password`, `Price Range`, `Quantity`, `Request ID to claim`, `Request ID to grant`, `Shipping Terms`, `Target Agent User ID`, `Timeline Days`, `Title`, `Video URL (for gallery/reels)`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `(e) => setAssistantQuestion(e.target.value)`
  - `(e) => setClaimRequestId(e.target.value)`
  - `(e) => setFeedType(e.target.value)`
  - `(e) => setGrantRequestId(e.target.value)`
  - `(e) => setLoginForm({ ...loginForm, email: e.target.value`
  - `(e) => setLoginForm({ ...loginForm, password: e.target.value`
  - `(e) => setOnboarding({ ...onboarding, categories: e.target.value`
  - `(e) => setOnboarding({ ...onboarding, organization_name: e.target.value`
  - `(e) => setOnboarding({ ...onboarding, profile_image: e.target.value`
  - `(e) => setProductForm({ ...productForm, category: e.target.value`
  - `(e) => setProductForm({ ...productForm, description: e.target.value`
  - `(e) => setProductForm({ ...productForm, lead_time_days: e.target.value`
  - `(e) => setProductForm({ ...productForm, material: e.target.value`
  - `(e) => setProductForm({ ...productForm, moq: e.target.value`
  - `(e) => setProductForm({ ...productForm, title: e.target.value`
  - `(e) => setProductForm({ ...productForm, video_url: e.target.value`
  - `(e) => setRegisterForm({ ...registerForm, email: e.target.value`
  - `(e) => setRegisterForm({ ...registerForm, name: e.target.value`
  - `(e) => setRegisterForm({ ...registerForm, password: e.target.value`
  - `(e) => setRegisterForm({ ...registerForm, role: e.target.value`
  - `(e) => setRequestForm({ ...requestForm, category: e.target.value`
  - `(e) => setRequestForm({ ...requestForm, certifications_required: e.target.value`
  - `(e) => setRequestForm({ ...requestForm, custom_description: e.target.value`
  - `(e) => setRequestForm({ ...requestForm, material: e.target.value`
  - `(e) => setRequestForm({ ...requestForm, price_range: e.target.value`
  - `(e) => setRequestForm({ ...requestForm, quantity: e.target.value`
  - `(e) => setRequestForm({ ...requestForm, shipping_terms: e.target.value`
  - `(e) => setRequestForm({ ...requestForm, timeline_days: e.target.value`
  - `(e) => setTargetAgentId(e.target.value)`
  - `(e) => setUnique(e.target.checked)`
  - `askAssistant`
  - `claimConversation`
  - `completeOnboarding`
  - `createProduct`
  - `createRequest`
  - `grantConversation`
  - `loadFeed`
  - `login`
  - `logout`
  - `refreshStatus`
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
