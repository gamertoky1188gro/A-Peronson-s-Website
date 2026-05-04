/**
 * Admin Panel Modular Components
 * 
 * This folder contains modular sections extracted from AdminPanel.jsx
 * for better maintainability.
 * 
 * Structure:
 * - sections/AdminHomeSection.jsx     - Dashboard overview
 * - sections/AdminPlatformSection.jsx - Users, verification, subscriptions
 * - sections/AdminInfraSection.jsx    - Infrastructure management
 * - sections/AdminNetworkSection.jsx  - Network monitoring
 * - sections/AdminServerSection.jsx  - Server management
 * - sections/AdminCMSSection.jsx      - Content management
 * - sections/AdminSecuritySection.jsx - Ultra security
 * - sections/AdminConfigSection.jsx   - Config editor
 * 
 * Usage:
 * Import the router component to use modular sections:
 * 
 * import { AdminSectionRouter } from './admin';
 * 
 * Then render: <AdminSectionRouter activeCategory={activeCategory} {...props} />
 * 
 * Note: The original AdminPanel.jsx still contains the full implementation.
 * These modular components can be progressively adopted for better maintainability.
 */

// Re-export all sections
export {
  AdminHomeSection,
  AdminPlatformSection,
  AdminInfraSection,
  AdminNetworkSection,
  AdminServerSection,
  AdminCMSSection,
  AdminSecuritySection,
  AdminConfigSection
} from './sections';

// Category constants
export const ADMIN_CATEGORIES = {
  HOME: 'home',
  PLATFORM: 'platform',
  INFRA: 'infra',
  NETWORK: 'network',
  SERVER_ADMIN: 'server-admin',
  CMS: 'cms',
  ULTRA_SECURITY: 'ultra-security',
  CONFIG: 'config'
};

export const CATEGORY_LABELS = {
  home: 'Dashboard',
  platform: 'Platform',
  infra: 'Infrastructure',
  network: 'Network',
  'server-admin': 'Server Admin',
  cms: 'CMS',
  'ultra-security': 'Ultra Security',
  config: 'Config'
};

// Default props for each section (to be used with original state)
export const getDefaultSectionProps = (adminDark = false) => ({
  adminDark,
  // Platform nav states
  platformNav: 'overview',
  setPlatformNav: () => {},
  // Infra nav states
  infraNav: 'overview',
  setInfraNav: () => {},
  // Network nav states
  networkNav: 'overview',
  setNetworkNav: () => {},
  // Server nav states
  serverNav: 'overview',
  setServerNav: () => {},
  // CMS nav states
  cmsNav: 'pages',
  setCmsNav: () => {},
  // Security nav states
  securityNav: 'overview',
  setSecurityNav: () => {},
  // Config editor states
  configEditorTab: 'inventory',
  setConfigEditorTab: () => {},
  // Data placeholders (would come from parent state)
  metricsData: [],
  recentActivity: [],
  systemAlerts: [],
  usersData: [],
  verificationData: [],
  subscriptionData: [],
  contractsData: [],
  moderationData: [],
  infraData: {},
  networkData: {},
  serverData: {},
  cmsData: {},
  securityData: {},
  configEditorData: {},
  configEditorLoading: false,
  configEditorError: '',
  configEditorNotice: '',
  configEditorSaving: false,
  setConfigEditorSaving: () => {},
  setConfigEditorNotice: () => {},
  setConfigEditorError: () => {}
});