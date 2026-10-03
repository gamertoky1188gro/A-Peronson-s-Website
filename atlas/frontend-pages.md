# frontend-pages

- **Purpose**: One component per route — feed, messaging, dashboards, profiles, admin, auth, marketing.
- **Key Files**: `src/pages/MainFeed.jsx`, `src/pages/ChatInterface.jsx`, `src/pages/OwnerDashboard.jsx`, `src/pages/AdminPanel.jsx`, `src/pages/ContractVault.jsx`, `src/pages/SearchResults.jsx`, `src/pages/auth/Login.jsx`, `src/pages/chat/*`, `src/pages/admin/sections/*`
- **Dependencies**: frontend-components, frontend-lib, frontend-store, frontend-hooks
- **Dependents**: frontend-app
- **Exposes**: Route-level screens; OwnerDashboard embeds VerificationPage + OrgSettings (`embedded` prop).

## Internal Structure
- **Social core**: MainFeed, FeedManagement, SharedPost, SearchResults, NotificationsCenter.
- **Messaging**: ChatInterface + chat/ (ThreadList, MessageArea, RightPanel, chatUtils), CallInterface.
- **Business**: OwnerDashboard, ContractVault, OrderManagement, LeadManager (components/leads), ProductManagement, BuyerRequestManagement, AgentDashboard, TaskTracker.
- **Profiles**: BuyerProfile, FactoryProfile, BuyingHouseProfile, ProfilePage, PartnerNetwork, MemberManagement, OrgSettings, VerificationPage.
- **Platform**: AdminPanel + admin/sections/* (12 sections), AdminGovernance, Insights, TexHub (landing), Pricing, About, HelpCenter, auth/*.
