# frontend-pages

- **Parent**: (none — under `src/`)
- **Purpose**: One component per route — feed, messaging, dashboards, profiles, admin, auth, marketing. 65 files.
- **Key Files**: `src/pages/MainFeed.jsx`, `src/pages/ChatInterface.jsx`, `src/pages/OwnerDashboard.jsx`, `src/pages/AdminPanel.jsx`, `src/pages/Settings.jsx`, `src/pages/ContractVault.jsx`, `src/pages/SearchResults.jsx`, `src/pages/AdminPanel.helpers.js`, `src/pages/AdminPanel.utils.js`, `src/pages/searchFiltersConfig.js`, `src/pages/auth/Login.jsx`, `src/pages/chat/*`, `src/pages/admin/sections/*`, `src/pages/admin/shared/index.jsx`
- **Dependencies**: frontend-components, frontend-lib, frontend-store, frontend-hooks, frontend-offline, frontend-theme
- **Dependents**: frontend-app
- **Exposes**: Route-level screens. `OwnerDashboard` embeds `VerificationPage` + `Settings` via the `embedded` prop.

## Internal Structure
- **Social core**: `MainFeed.jsx` (dynamic-imports `src/offline/db.js` + `syncEngine.runSync`), `FeedManagement`, `SharedPost`, `SearchResults`, `NotificationsCenter`, `JoinRequestPage`.
- **Messaging**: `ChatInterface.jsx` + `chat/` (ThreadList, MessageArea, RightPanel, ChatSidebar, chatUtils, GrantTransferModal), `CallInterface`.
- **Business**: `OwnerDashboard`, `ContractVault`, `OrderManagement`, `ProductManagement`, `BuyerRequestManagement`, `AgentDashboard`, `TaskTracker`, `BoostDetailsPage`.
- **Profiles**: `ProfilePage`, `BuyerProfile`, `FactoryProfile`, `BuyingHouseProfile`, `PartnerNetwork`, `MemberManagement`, `VerificationPage`, `Settings`, `IndustryPage`.
- **Platform**: `AdminPanel.jsx` + `admin/sections/*` (12 sections) + `admin/shared/index.jsx`, `AdminGovernance`, `Insights`, `SupportReports`.
- **Marketing/legal/auth**: `TexHub` (landing), `Pricing`, `About`, `HelpCenter`, `FeedbackPage`, `RatingFeedback`, `Terms`, `Privacy`, `NotFound`, `AccessDenied`, `auth/{Login,Signup,SignupUltra,OnboardingPage}`.

## Gotchas
- **`Settings.jsx` replaced `OrgSettings.jsx`** (commit c1f5bbd). `/org-settings` redirects to `/settings`. `Settings` also renders `OfflineStorageSection` at line ~2223.
- **`MainFeed.jsx` infinite-render guard**: `loadFeedPage` and `loadUser` read from a `liveRef` updated every render, and are defined with `[markLoaded]` / `[]` deps — never change those references. Feed effect deps are `[loadFeedPage, activeCategory, activeType, unique, feedConfig]`. Using `loadUser`/`getCurrentUser()` state in `loadFeedPage` deps previously created a cascade loop.
- `useFallbackCover` must be declared **above** any early `return` (React error 310).
- NavBar has a `userId` TDZ crash guard and a deduped settings entry in the mobile drawer.