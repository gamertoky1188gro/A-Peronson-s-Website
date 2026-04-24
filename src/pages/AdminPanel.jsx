import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Cloud,
  Inbox,
  ServerCog,
  Workflow,
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  Cpu,
  Database,
  Download,
  Eye,
  FileText,
  Globe,
  Globe2,
  Gauge,
  HardDrive,
  Layers3,
  LayoutDashboard,
  CircuitBoard,
  KeyRound,
  LockKeyhole,
  Loader2,
  Menu,
  MoonStar,
  PanelLeftClose,
  RefreshCw,
  Search,
  ShieldCheck,
  Filter,
  Sparkles,
  SlidersHorizontal,
  SunMedium,
  TerminalSquare,
  Trash2,
  UserCog,
  Users,
  Wifi,
  Wrench,
  ArrowUpRight,
  Network,
  Ticket,
  Mail,
  ShieldAlert,
  Moon,
  Sun,
  Shield,
  MonitorCog,
  Crown,
Home,
  Lock,
  Settings,
  Sparkle,
  Server,
  Sliders,
  XCircle
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { startAuthentication } from '@simplewebauthn/browser'
import AccessDeniedState from '../components/AccessDeniedState'
import { apiRequest, getCurrentUser, getToken, saveSession } from '../lib/auth'
import { useInventory, useUiConfig, useCapabilities, useActions, useActionGroups, useRoleConfig, INFRA_CAPABILITIES_DEFAULT, NETWORK_CAPABILITIES_DEFAULT, ULTRA_CAPABILITIES_DEFAULT, DEFAULT_PIE_PALETTE, DEFAULT_CMS_WEEKLY_TREND, DEFAULT_ULTRA_MINI_CHART_POINTS, DEFAULT_ULTRA_MINI_CHART_KPIS, DEFAULT_EMPTY_STATE_COPY, BUYER_BENEFITS_DEFAULT, FACTORY_BENEFITS_DEFAULT, BUYING_HOUSE_BENEFITS_DEFAULT } from '../hooks/useAdminConfig'

const KNOWN_ROLES = new Set(['buyer', 'factory', 'buying_house', 'owner', 'admin', 'agent'])
const DEFAULT_ADMIN_PANEL_ALLOWED_ROLES = ['owner', 'admin']
const DEFAULT_ADMIN_PANEL_FALLBACK_INVENTORY = [
  { id: 'platform', label: 'Core Platform & Business Control', icon_name: 'ShieldCheck', sections: [] },
  { id: 'infra', label: 'Server / System / Infrastructure Management', icon_name: 'Server', sections: [] },
  { id: 'network', label: 'Network Monitoring & Management', icon_name: 'Network', sections: [] },
  { id: 'server-admin', label: 'Server Admin + App Management', icon_name: 'Database', sections: [] },
  { id: 'cms', label: 'CMS + Content Management', icon_name: 'Settings', sections: [] },
  { id: 'ultra-security', label: 'Ultra Security Layer', icon_name: 'Lock', sections: [] },
  { id: 'config', label: 'Config Editor', icon_name: 'Sliders', sections: [] },
]

const ICON_REGISTRY = {
  ShieldCheck,
  Server,
  Network,
  Database,
  Settings,
  Lock,
  MonitorCog,
  Shield,
  LayoutDashboard,
  Sliders,
}

function normalizeRole(value = '') {
  return String(value || '').trim().toLowerCase()
}

function getAdminPanelAllowedRoles(config) {
  const raw = config?.ui?.admin_panel?.allowed_roles
  const list = Array.isArray(raw) ? raw.map(normalizeRole).filter(Boolean) : []
  const filtered = list.filter((role) => KNOWN_ROLES.has(role))
  if (!filtered.length) return DEFAULT_ADMIN_PANEL_ALLOWED_ROLES
  return filtered
}

function getAdminPanelFallbackInventory(config) {
  const raw = config?.ui?.admin_panel?.fallback_inventory
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_ADMIN_PANEL_FALLBACK_INVENTORY

  const rows = raw
    .map((row) => {
      const id = String(row?.id || '').trim()
      const label = String(row?.label || '').trim()
      const iconName = String(row?.icon_name || '').trim()
      if (!id || !label) return null
      return { id, label, icon_name: iconName, sections: [] }
    })
    .filter(Boolean)

  return rows.length ? rows : DEFAULT_ADMIN_PANEL_FALLBACK_INVENTORY
}

function getIconComponent(iconName = '', fallback = ShieldCheck) {
  const key = String(iconName || '').trim()
  return ICON_REGISTRY[key] || fallback
}

const INFRA_CAPABILITIES = [
  {
    title: 'System Health & Performance Monitoring',
    count: 5,
    icon: Activity,
    subtitle: 'Real-time signals, resource visibility, and operational pulse.',
  },
  {
    title: 'OS & Software Maintenance',
    count: 4,
    icon: Server,
    subtitle: 'Safe updates, package checks, and controlled maintenance flows.',
  },
  {
    title: 'User & Security Administration',
    count: 5,
    icon: UserCog,
    subtitle: 'Accounts, SSH keys, access, and permission hygiene.',
  },
  {
    title: 'Backup & Disaster Recovery',
    count: 3,
    icon: Database,
    subtitle: 'Retention, recovery posture, and scheduled protection.',
  },
  {
    title: 'Networking & System Settings',
    count: 2,
    icon: Wifi,
    subtitle: 'Firewall, SSL, DNS, timezone, and NTP coordination.',
  },
]

const NETWORK_CAPABILITIES = [
  {
    title: 'Real-Time Monitoring & Visibility',
    count: 4,
    items: ['Interface health', 'Packet loss', 'Latency heatmap', 'Topology map'],
  },
  {
    title: 'Configuration & Management',
    count: 5,
    items: ['Device templates', 'Change pushes', 'Versioned config', 'Rollback safety'],
  },
  {
    title: 'Security Management',
    count: 5,
    items: ['IDS/IPS feeds', 'Rogue AP detection', 'Policy drift', 'Threat posture'],
  },
  {
    title: 'Traffic & Bandwidth Analysis',
    count: 3,
    items: ['NetFlow insight', 'QoS review', 'Bandwidth trends'],
  },
  {
    title: 'Troubleshooting & Alerting',
    count: 3,
    items: ['Incident timeline', 'Anomaly triage', 'Auto-escalation'],
  },
  {
    title: 'Asset & User Management',
    count: 3,
    items: ['Inventory sync', 'Auth roles', 'Ownership tracking'],
  },
]

function listToTextarea(value) {
  return Array.isArray(value) ? value.join('\n') : ''
}

function textareaToList(value) {
  const raw = String(value || '').split(/[\n,]/)
  const cleaned = raw.map((entry) => entry.trim()).filter(Boolean)
  return [...new Set(cleaned)]
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const SECTION_METRICS = {
  users: [
    { label: 'Total', path: 'users.total' },
    { label: 'Premium', path: 'users.premium' },
    { label: 'Suspended', path: 'users.suspended' },
  ],
  orgs: [
    { label: 'Orgs', path: 'orgs.total' },
    { label: 'Staff', path: 'orgs.staff' },
    { label: 'Agents', path: 'orgs.agents' },
  ],
  verification: [
    { label: 'Pending', path: 'verification.pending' },
    { label: 'Expiring', path: 'verification.expiring' },
  ],
  finance: [
    { label: 'Subscriptions', path: 'finance.subscriptions' },
    { label: 'Failed renewals', path: 'finance.failed_renewals' },
    { label: 'Revenue est.', path: 'finance.revenue_estimate_usd', format: 'currency' },
  ],
  wallet: [
    { label: 'Balance', path: 'wallet.total_balance_usd', format: 'currency' },
    { label: 'Restricted', path: 'wallet.restricted_usd', format: 'currency' },
    { label: 'Redemptions', path: 'wallet.redemptions' },
  ],
  coupons: [
    { label: 'Total', path: 'coupons.total' },
    { label: 'Active', path: 'coupons.active' },
    { label: 'Redemptions', path: 'coupons.redemptions' },
  ],
  partners: [
    { label: 'Requests', path: 'partners.requests' },
    { label: 'Active', path: 'partners.active' },
  ],
  requests: [
    { label: 'Total', path: 'requests.total' },
    { label: 'Verified-only', path: 'requests.verified_only' },
    { label: 'Matches', path: 'requests.matches' },
  ],
  contracts: [
    { label: 'Contracts', path: 'contracts.total' },
    { label: 'Pending signatures', path: 'contracts.pending_signatures' },
    { label: 'Payment proofs', path: 'contracts.payment_proofs' },
  ],
  calls: [
    { label: 'Calls', path: 'calls.total' },
    { label: 'Recordings', path: 'calls.recordings' },
  ],
  messages: [
    { label: 'Messages', path: 'messages.total' },
    { label: 'Violations', path: 'messages.violations' },
    { label: 'Strikes', path: 'messages.strikes' },
  ],
  media: [
    { label: 'Video pending', path: 'media.videos_pending' },
    { label: 'Docs pending', path: 'media.docs_pending' },
  ],
  support: [
    { label: 'Tickets', path: 'support.tickets' },
    { label: 'Open', path: 'support.open' },
  ],
  notifications: [
    { label: 'Total', path: 'notifications.total' },
  ],
  analytics: [
    { label: 'Events', path: 'analytics.total_events' },
  ],
  search: [
    { label: 'Alerts', path: 'search.alerts' },
    { label: 'Abuse flags', path: 'search.abuse_flags' },
  ],
  ai: [
    { label: 'Knowledge', path: 'ai.knowledge_entries' },
    { label: 'Chatbot on', path: 'ai.chatbot_enabled' },
  ],
  system: [
    { label: 'Flags', path: 'system.feature_flags' },
    { label: 'Plans', path: 'system.plan_limits' },
  ],
  security: [
    { label: 'Audit entries', path: 'security.audit_entries' },
  ],
  integrations: [
    { label: 'Gateways', path: 'integrations.payment_gateways' },
    { label: 'Webhooks', path: 'integrations.webhooks' },
    { label: 'API keys', path: 'integrations.api_keys' },
  ],
  traffic: [
    { label: 'Clicks', path: 'traffic.clicks' },
    { label: 'Visits', path: 'traffic.visits' },
    { label: 'Spend', path: 'traffic.spend', format: 'currency' },
    { label: 'CPC', path: 'traffic.cpc', format: 'currency' },
  ],
  emails: [
    { label: 'Emails', path: 'emails.total' },
  ],
}

const ACTION_GROUPS = [
  {
    label: 'Platform Actions',
    actions: [
      { id: 'users.export_emails', label: 'Export email list', route: '/admin/actions', fields: [] },
      { id: 'notification.broadcast', label: 'Broadcast announcement', route: '/admin/actions', fields: [{ key: 'title', label: 'Title' }, { key: 'message', label: 'Message' }, { key: 'roles', label: 'Target roles (comma)' }, { key: 'premium_only', label: 'Premium only (true/false)' }, { key: 'verified_only', label: 'Verified only (true/false)' }] },
      { id: 'email.test_send', label: 'Send test email', route: '/admin/actions', fields: [{ key: 'to', label: 'Recipient email' }] },
      { id: 'partner.force_accept', label: 'Force accept partner request', route: '/admin/actions', fields: [{ key: 'request_id', label: 'Request ID' }] },
      { id: 'partner.force_reject', label: 'Force reject partner request', route: '/admin/actions', fields: [{ key: 'request_id', label: 'Request ID' }] },
      { id: 'partner.force_cancel', label: 'Force cancel partner request', route: '/admin/actions', fields: [{ key: 'request_id', label: 'Request ID' }] },
      { id: 'partner.blacklist.add', label: 'Add to partner blacklist', route: '/admin/actions', fields: [{ key: 'entry_id', label: 'User/Org ID' }] },
      { id: 'partner.blacklist.remove', label: 'Remove from blacklist', route: '/admin/actions', fields: [{ key: 'entry_id', label: 'User/Org ID' }] },
      { id: 'partner.whitelist.add', label: 'Add to partner whitelist', route: '/admin/actions', fields: [{ key: 'entry_id', label: 'User/Org ID' }] },
      { id: 'partner.whitelist.remove', label: 'Remove from whitelist', route: '/admin/actions', fields: [{ key: 'entry_id', label: 'User/Org ID' }] },
      { id: 'request.status', label: 'Update request status', route: '/admin/actions', fields: [{ key: 'requirement_id', label: 'Request ID' }, { key: 'status', label: 'Status' }] },
      { id: 'request.verified_only', label: 'Toggle verified-only', route: '/admin/actions', fields: [{ key: 'requirement_id', label: 'Request ID' }, { key: 'verified_only', label: 'true/false' }] },
      { id: 'request.expiry_override', label: 'Override request expiry', route: '/admin/actions', fields: [{ key: 'requirement_id', label: 'Request ID' }, { key: 'expires_at', label: 'Expires at (ISO)' }] },
      { id: 'request.spam.flag', label: 'Flag request as spam', route: '/admin/actions', fields: [{ key: 'requirement_id', label: 'Request ID' }, { key: 'reason', label: 'Reason' }] },
      { id: 'request.spam.filter.add', label: 'Add spam filter', route: '/admin/actions', fields: [{ key: 'pattern', label: 'Pattern' }, { key: 'action', label: 'Action' }] },
      { id: 'match.quality.update', label: 'Update match quality', route: '/admin/actions', fields: [{ key: 'match_id', label: 'Match ID' }, { key: 'score', label: 'Score' }, { key: 'note', label: 'Note' }] },
      { id: 'partner.connect', label: 'Force connect partner', route: '/admin/actions', fields: [{ key: 'request_id', label: 'Request ID' }] },
      { id: 'partner.override', label: 'Record partner override', route: '/admin/actions', fields: [{ key: 'request_id', label: 'Request ID' }, { key: 'override_action', label: 'Action' }, { key: 'note', label: 'Note' }] },
      { id: 'partner.free_tier_limit', label: 'Set free-tier partner limit', route: '/admin/actions', fields: [{ key: 'limit', label: 'Limit' }] },
      { id: 'featured.add', label: 'Add featured listing', route: '/admin/actions', fields: [{ key: 'entity_type', label: 'product/request' }, { key: 'entity_id', label: 'Entity ID' }, { key: 'label', label: 'Label (optional)' }] },
      { id: 'featured.remove', label: 'Remove featured listing', route: '/admin/actions', fields: [{ key: 'listing_id', label: 'Listing ID' }, { key: 'entity_id', label: 'Entity ID (optional)' }] },
    ],
  },
  {
    label: 'Org & Agents',
    actions: [
      { id: 'account.manager.assign', label: 'Assign account manager', route: '/admin/actions', fields: [
        { key: 'user_id', label: 'Org owner ID' },
        { key: 'account_manager_id', label: 'Manager user ID (optional)' },
        { key: 'account_manager_name', label: 'Manager name' },
        { key: 'account_manager_email', label: 'Manager email' },
        { key: 'account_manager_phone', label: 'Manager phone' },
      ] },
      { id: 'org.transfer', label: 'Transfer org ownership', route: '/admin/actions', fields: [{ key: 'from_owner_id', label: 'Current owner ID' }, { key: 'to_owner_id', label: 'New owner ID' }] },
      { id: 'org.merge', label: 'Merge orgs', route: '/admin/actions', fields: [{ key: 'source_owner_id', label: 'Source owner ID' }, { key: 'target_owner_id', label: 'Target owner ID' }, { key: 'archive_source', label: 'Archive source (true/false)' }] },
      { id: 'org.split', label: 'Split org staff', route: '/admin/actions', fields: [{ key: 'org_owner_id', label: 'Current owner ID' }, { key: 'new_owner_id', label: 'New owner ID' }, { key: 'member_ids', label: 'Member IDs (comma)' }] },
      { id: 'org.quota', label: 'Set org quota', route: '/admin/actions', fields: [{ key: 'org_owner_id', label: 'Org owner ID' }, { key: 'key', label: 'Quota key' }, { key: 'value', label: 'Value' }] },
      { id: 'org.staff_limit', label: 'Set staff limit', route: '/admin/actions', fields: [{ key: 'org_owner_id', label: 'Org owner ID' }, { key: 'limit', label: 'Staff limit' }] },
      { id: 'org.buying_house_staff.add', label: 'Add buying house staff ID', route: '/admin/actions', fields: [{ key: 'org_owner_id', label: 'Org owner ID' }, { key: 'staff_id', label: 'Staff ID' }] },
      { id: 'org.buying_house_staff.remove', label: 'Remove buying house staff ID', route: '/admin/actions', fields: [{ key: 'staff_id', label: 'Staff ID' }] },
      { id: 'org.permission_matrix', label: 'Update org permission matrix', route: '/admin/actions', fields: [{ key: 'org_owner_id', label: 'Org owner ID' }, { key: 'permission_matrix', label: 'Permission matrix JSON' }] },
      { id: 'agent.create', label: 'Create agent', route: '/admin/actions', fields: [{ key: 'org_owner_id', label: 'Org owner ID' }, { key: 'name', label: 'Name' }, { key: 'username', label: 'Username' }, { key: 'member_id', label: 'Agent ID' }, { key: 'email', label: 'Email' }, { key: 'permissions', label: 'Permissions (comma)' }, { key: 'password', label: 'Temp password' }] },
      { id: 'agent.activate', label: 'Activate agent', route: '/admin/actions', fields: [{ key: 'org_owner_id', label: 'Org owner ID' }, { key: 'member_id', label: 'Agent ID' }] },
      { id: 'agent.deactivate', label: 'Deactivate agent', route: '/admin/actions', fields: [{ key: 'org_owner_id', label: 'Org owner ID' }, { key: 'member_id', label: 'Agent ID' }] },
      { id: 'agent.reset_password', label: 'Reset agent password', route: '/admin/actions', fields: [{ key: 'org_owner_id', label: 'Org owner ID' }, { key: 'member_id', label: 'Agent ID' }] },
      { id: 'agent.permissions', label: 'Update agent permissions', route: '/admin/actions', fields: [{ key: 'org_owner_id', label: 'Org owner ID' }, { key: 'member_id', label: 'Agent ID' }, { key: 'permissions', label: 'Permissions (comma)' }, { key: 'permission_matrix_json', label: 'Permission matrix JSON' }] },
    ],
  },
  {
    label: 'Verification & Finance',
    actions: [
      { id: 'verification.approve', label: 'Approve verification', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }] },
      { id: 'verification.reject', label: 'Reject verification', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'reason', label: 'Reason' }] },
      { id: 'verification.remind_expiring', label: 'Remind expiring verifications', route: '/admin/actions', fields: [{ key: 'threshold_days', label: 'Threshold days' }] },
      { id: 'verification.revoke_expired', label: 'Revoke expired verifications', route: '/admin/actions', fields: [] },
      { id: 'verification.badge.revoke', label: 'Revoke badge', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'reason', label: 'Reason' }] },
      { id: 'verification.doc.review', label: 'Review verification doc', route: '/admin/actions', fields: [{ key: 'doc_id', label: 'Doc ID' }, { key: 'status', label: 'Status' }, { key: 'reason', label: 'Reason' }] },
      { id: 'verification.fraud.flag', label: 'Flag verification fraud', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'reason', label: 'Reason' }] },
      { id: 'order.certification.approve', label: 'Approve order certification', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'evidence_contract_ids', label: 'Evidence contract IDs (comma)' }, { key: 'note', label: 'Note' }] },
      { id: 'order.certification.revoke', label: 'Revoke order certification', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'note', label: 'Reason' }] },
      { id: 'order.certification.evidence', label: 'Attach certification evidence', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'evidence_contract_ids', label: 'Evidence contract IDs (comma)' }, { key: 'note', label: 'Note' }] },
      { id: 'subscription.set_plan', label: 'Set subscription plan', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'plan', label: 'free/premium' }, { key: 'auto_renew', label: 'Auto renew (true/false)' }] },
      { id: 'subscription.renew', label: 'Renew premium', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'auto_renew', label: 'Auto renew (true/false)' }] },
      { id: 'finance.invoice.add', label: 'Add invoice', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'amount_usd', label: 'Amount USD' }, { key: 'status', label: 'Status' }, { key: 'note', label: 'Note' }] },
      { id: 'finance.payout.add', label: 'Add payout', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'amount_usd', label: 'Amount USD' }, { key: 'status', label: 'Status' }, { key: 'note', label: 'Note' }] },
      { id: 'wallet.credit', label: 'Wallet credit', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'amount_usd', label: 'Amount (USD)' }, { key: 'reason', label: 'Reason' }, { key: 'restricted', label: 'Restricted (true/false)' }] },
      { id: 'wallet.debit', label: 'Wallet debit', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'amount_usd', label: 'Amount (USD)' }, { key: 'reason', label: 'Reason' }, { key: 'allow_restricted', label: 'Allow restricted (true/false)' }] },
      { id: 'wallet.refund', label: 'Wallet refund', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'amount_usd', label: 'Amount (USD)' }, { key: 'reason', label: 'Reason' }, { key: 'ref', label: 'Reference' }] },
      { id: 'wallet.auto_credit', label: 'Toggle auto-credit', route: '/admin/actions', fields: [{ key: 'enabled', label: 'true/false' }] },
      { id: 'coupon.create', label: 'Create coupon', route: '/admin/actions', fields: [{ key: 'code', label: 'Coupon code' }, { key: 'amount_usd', label: 'Amount (USD)' }, { key: 'expires_at', label: 'Expires at (ISO)' }, { key: 'max_redemptions', label: 'Max redemptions' }, { key: 'marketing_source', label: 'Marketing source' }, { key: 'campaign', label: 'Campaign tag' }, { key: 'role_restrictions', label: 'Role restrictions (comma)' }, { key: 'verification_free_months', label: 'Free months' }, { key: 'requires_card', label: 'Requires card (true/false)' }] },
      { id: 'coupon.disable', label: 'Disable coupon', route: '/admin/actions', fields: [{ key: 'code', label: 'Coupon code or ID' }] },
      { id: 'coupon.expire', label: 'Expire coupon', route: '/admin/actions', fields: [{ key: 'code', label: 'Coupon code or ID' }, { key: 'expires_at', label: 'Expires at (ISO)' }] },
      { id: 'coupon.redemption.add', label: 'Add coupon redemption', route: '/admin/actions', fields: [{ key: 'code_id', label: 'Coupon ID' }, { key: 'user_id', label: 'User ID' }, { key: 'amount_usd', label: 'Amount USD' }] },
      { id: 'coupon.campaign.add', label: 'Add coupon campaign', route: '/admin/actions', fields: [{ key: 'name', label: 'Campaign name' }, { key: 'type', label: 'Type' }, { key: 'status', label: 'Status' }] },
      { id: 'coupon.campaign.disable', label: 'Disable coupon campaign', route: '/admin/actions', fields: [{ key: 'campaign_id', label: 'Campaign ID' }] },
    ],
  },
  {
    label: 'Contracts & Disputes',
    actions: [
      { id: 'contract.lock', label: 'Lock contract', route: '/admin/actions', fields: [{ key: 'contract_id', label: 'Contract ID' }] },
      { id: 'contract.unlock', label: 'Unlock contract', route: '/admin/actions', fields: [{ key: 'contract_id', label: 'Contract ID' }] },
      { id: 'contract.archive', label: 'Archive contract', route: '/admin/actions', fields: [{ key: 'contract_id', label: 'Contract ID' }] },
      { id: 'contract.signatures', label: 'Update signatures', route: '/admin/actions', fields: [{ key: 'contract_id', label: 'Contract ID' }, { key: 'buyer_signature_state', label: 'buyer: signed/pending' }, { key: 'factory_signature_state', label: 'factory: signed/pending' }, { key: 'is_draft', label: 'Draft (true/false)' }] },
      { id: 'contract.audit.note', label: 'Add contract audit note', route: '/admin/actions', fields: [{ key: 'contract_id', label: 'Contract ID' }, { key: 'note', label: 'Note' }] },
      { id: 'contract.audit.export', label: 'Export contract audit', route: '/admin/actions', fields: [{ key: 'contract_id', label: 'Contract ID' }, { key: 'note', label: 'Note' }] },
      { id: 'payment_proof.review', label: 'Review payment proof', route: '/admin/actions', fields: [{ key: 'proof_id', label: 'Proof ID' }, { key: 'status', label: 'Status' }, { key: 'review_reason', label: 'Reason' }] },
      { id: 'dispute.open', label: 'Open dispute', route: '/admin/actions', fields: [{ key: 'contract_id', label: 'Contract ID' }, { key: 'reason', label: 'Reason' }] },
      { id: 'dispute.resolve', label: 'Resolve dispute', route: '/admin/actions', fields: [{ key: 'report_id', label: 'Report ID' }, { key: 'resolution_action', label: 'Action' }, { key: 'resolution_note', label: 'Notes' }] },
      { id: 'call.recording', label: 'Update call recording', route: '/admin/actions', fields: [{ key: 'call_id', label: 'Call ID' }, { key: 'recording_status', label: 'Status' }, { key: 'recording_url', label: 'Recording URL' }, { key: 'failure_reason', label: 'Failure reason' }] },
      { id: 'call.escalate', label: 'Escalate call', route: '/admin/actions', fields: [{ key: 'call_id', label: 'Call ID' }, { key: 'severity', label: 'Severity' }, { key: 'note', label: 'Note' }] },
      { id: 'call.proof.enforce', label: 'Enforce proof-of-call', route: '/admin/actions', fields: [{ key: 'call_id', label: 'Call ID' }] },
    ],
  },
  {
    label: 'Moderation & Support',
    actions: [
      { id: 'message.takedown', label: 'Takedown message', route: '/admin/actions', fields: [{ key: 'message_id', label: 'Message ID' }, { key: 'reason', label: 'Reason' }, { key: 'apply_strike', label: 'Apply strike (true/false)' }] },
      { id: 'message.redact', label: 'Redact message', route: '/admin/actions', fields: [{ key: 'message_id', label: 'Message ID' }, { key: 'reason', label: 'Reason' }] },
      { id: 'message.transfer.audit', label: 'Log chat transfer', route: '/admin/actions', fields: [{ key: 'thread_id', label: 'Thread ID' }, { key: 'from', label: 'From' }, { key: 'to', label: 'To' }, { key: 'note', label: 'Note' }] },
      { id: 'message.flag', label: 'Flag message as spam', route: '/admin/actions', fields: [{ key: 'message_id', label: 'Message ID' }, { key: 'reason', label: 'Reason' }] },
      { id: 'content.flag', label: 'Flag content', route: '/admin/actions', fields: [{ key: 'entity_type', label: 'Entity type' }, { key: 'entity_id', label: 'Entity ID' }, { key: 'reason', label: 'Reason' }] },
      { id: 'content.bulk_approve', label: 'Bulk approve content', route: '/admin/actions', fields: [] },
      { id: 'violation.strike', label: 'Manual strike', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'reason', label: 'Reason' }, { key: 'kind', label: 'Kind' }] },
      { id: 'support.ticket.create', label: 'Create support ticket', route: '/admin/actions', fields: [{ key: 'user_id', label: 'User ID' }, { key: 'subject', label: 'Subject' }, { key: 'priority', label: 'Priority' }, { key: 'note', label: 'Note' }] },
      { id: 'support.ticket.update', label: 'Update support ticket', route: '/admin/actions', fields: [{ key: 'ticket_id', label: 'Ticket ID' }, { key: 'status', label: 'Status' }, { key: 'priority', label: 'Priority' }, { key: 'note', label: 'Note' }] },
      { id: 'support.ticket.resolve', label: 'Resolve support ticket', route: '/admin/actions', fields: [{ key: 'ticket_id', label: 'Ticket ID' }] },
      { id: 'support.ticket.escalate', label: 'Escalate support ticket', route: '/admin/actions', fields: [{ key: 'ticket_id', label: 'Ticket ID' }, { key: 'note', label: 'Note' }] },
    ],
  },
  {
    label: 'Broadcast & AI',
    actions: [
      { id: 'ai.knowledge.create', label: 'Create knowledge entry', route: '/admin/actions', fields: [{ key: 'org_id', label: 'Org ID' }, { key: 'type', label: 'faq/fact' }, { key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer' }, { key: 'keywords', label: 'Keywords (comma)' }] },
      { id: 'ai.knowledge.update', label: 'Update knowledge entry', route: '/admin/actions', fields: [{ key: 'org_id', label: 'Org ID' }, { key: 'entry_id', label: 'Entry ID' }, { key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer' }, { key: 'keywords', label: 'Keywords (comma)' }] },
      { id: 'ai.knowledge.delete', label: 'Delete knowledge entry', route: '/admin/actions', fields: [{ key: 'org_id', label: 'Org ID' }, { key: 'entry_id', label: 'Entry ID' }] },
      { id: 'ai.response.flag', label: 'Flag AI response', route: '/admin/actions', fields: [{ key: 'response_id', label: 'Response ID' }, { key: 'reason', label: 'Reason' }] },
      { id: 'notification.template.create', label: 'Create notification template', route: '/admin/actions', fields: [{ key: 'name', label: 'Name' }, { key: 'subject', label: 'Subject' }, { key: 'body', label: 'Body' }, { key: 'channel', label: 'Channel' }] },
      { id: 'notification.template.update', label: 'Update notification template', route: '/admin/actions', fields: [{ key: 'template_id', label: 'Template ID' }, { key: 'name', label: 'Name' }, { key: 'subject', label: 'Subject' }, { key: 'body', label: 'Body' }] },
      { id: 'notification.batch.send', label: 'Send batch notification', route: '/admin/actions', fields: [{ key: 'template_id', label: 'Template ID' }, { key: 'recipients', label: 'Recipients' }, { key: 'scheduled_at', label: 'Scheduled at' }] },
      { id: 'notification.monthly.trigger', label: 'Add monthly summary trigger', route: '/admin/actions', fields: [{ key: 'name', label: 'Name' }, { key: 'schedule', label: 'Cron schedule' }, { key: 'enabled', label: 'true/false' }] },
    ],
  },
  {
    label: 'System Settings',
    actions: [
      { id: 'system.feature_flag', label: 'Toggle feature flag', route: '/admin/actions', fields: [{ key: 'key', label: 'Flag key' }, { key: 'value', label: 'true/false' }] },
      { id: 'system.plan_limit', label: 'Update plan limit', route: '/admin/actions', fields: [{ key: 'plan', label: 'free/premium' }, { key: 'key', label: 'Limit key' }, { key: 'value', label: 'Value' }] },
      { id: 'system.pricing', label: 'Update pricing', route: '/admin/actions', fields: [{ key: 'plan', label: 'free/premium' }, { key: 'usd', label: 'Price USD' }] },
      { id: 'system.policy', label: 'Update policy text', route: '/admin/actions', fields: [{ key: 'key', label: 'tos/privacy' }, { key: 'value', label: 'Policy text' }] },
      { id: 'system.retention', label: 'Update retention', route: '/admin/actions', fields: [{ key: 'audit_days', label: 'Audit days' }, { key: 'logs_days', label: 'Logs days' }] },
      { id: 'system.search_limits', label: 'Update search limits', route: '/admin/actions', fields: [{ key: 'advanced_filter_gate', label: 'Gate advanced (true/false)' }, { key: 'abusive_search_threshold', label: 'Abuse threshold' }] },
      { id: 'integrations.update', label: 'Update integrations', route: '/admin/actions', fields: [{ key: 'integrations', label: 'Integrations JSON' }] },
      { id: 'integrations.crm.export', label: 'Run CRM export', route: '/admin/actions', fields: [{ key: 'note', label: 'Note' }] },
      { id: 'traffic.record', label: 'Record traffic event', route: '/admin/actions', fields: [{ key: 'domain', label: 'Domain' }, { key: 'clicks', label: 'Clicks' }, { key: 'visits', label: 'Visits' }, { key: 'spend', label: 'Spend (USD)' }] },
      { id: 'email.segment.create', label: 'Create email segment', route: '/admin/actions', fields: [{ key: 'name', label: 'Segment name' }, { key: 'filter', label: 'Filter JSON' }] },
      { id: 'email.segment.update', label: 'Update email segment', route: '/admin/actions', fields: [{ key: 'segment_id', label: 'Segment ID' }, { key: 'name', label: 'Segment name' }, { key: 'filter', label: 'Filter JSON' }] },
      { id: 'email.segment.delete', label: 'Delete email segment', route: '/admin/actions', fields: [{ key: 'segment_id', label: 'Segment ID' }] },
    ],
  },
  {
    label: 'Infrastructure Actions',
    actions: [
      { id: 'service.restart', label: 'Restart service', route: '/infra/actions', fields: [{ key: 'service', label: 'Service name' }] },
      { id: 'service.stop', label: 'Stop service', route: '/infra/actions', fields: [{ key: 'service', label: 'Service name' }] },
      { id: 'service.start', label: 'Start service', route: '/infra/actions', fields: [{ key: 'service', label: 'Service name' }] },
      { id: 'process.kill', label: 'Kill process', route: '/infra/actions', fields: [{ key: 'pid', label: 'Process ID' }] },
      { id: 'backup.run', label: 'Run backup', route: '/infra/actions', fields: [] },
      { id: 'backup.restore', label: 'Restore backup', route: '/infra/actions', fields: [] },
      { id: 'package.install', label: 'Install package', route: '/infra/actions', fields: [{ key: 'package', label: 'Package name' }] },
      { id: 'package.remove', label: 'Remove package', route: '/infra/actions', fields: [{ key: 'package', label: 'Package name' }] },
      { id: 'os.user.create', label: 'Create OS user', route: '/infra/actions', fields: [{ key: 'username', label: 'Username' }, { key: 'role', label: 'Role' }] },
      { id: 'os.user.delete', label: 'Delete OS user', route: '/infra/actions', fields: [{ key: 'username', label: 'Username' }] },
      { id: 'os.user.sudo', label: 'Toggle sudo privileges', route: '/infra/actions', fields: [{ key: 'username', label: 'Username' }, { key: 'enabled', label: 'true/false' }] },
      { id: 'os.user.reset', label: 'Reset OS user password', route: '/infra/actions', fields: [{ key: 'username', label: 'Username' }] },
      { id: 'ssl.cert.issue', label: 'Issue SSL cert', route: '/infra/actions', fields: [{ key: 'domain', label: 'Domain' }] },
      { id: 'ssl.cert.renew', label: 'Renew SSL cert', route: '/infra/actions', fields: [{ key: 'domain', label: 'Domain' }] },
      { id: 'ssl.cert.revoke', label: 'Revoke SSL cert', route: '/infra/actions', fields: [{ key: 'domain', label: 'Domain' }] },
      { id: 'log.collect', label: 'Collect system logs', route: '/infra/actions', fields: [{ key: 'level', label: 'Level' }, { key: 'message', label: 'Message' }] },
      { id: 'system.timezone.set', label: 'Set timezone', route: '/infra/actions', fields: [{ key: 'timezone', label: 'Timezone' }] },
      { id: 'command.execute', label: 'Execute command', route: '/infra/actions', fields: [{ key: 'command', label: 'Command' }] },
    ],
  },
  {
    label: 'Network Actions',
    actions: [
      { id: 'diagnostic.ping', label: 'Ping target', route: '/network/actions', fields: [{ key: 'target', label: 'Host/IP' }] },
      { id: 'diagnostic.traceroute', label: 'Traceroute target', route: '/network/actions', fields: [{ key: 'target', label: 'Host/IP' }] },
      { id: 'diagnostic.snmp', label: 'SNMP walk', route: '/network/actions', fields: [{ key: 'target', label: 'Host/IP' }] },
      { id: 'security.ids.scan', label: 'IDS scan', route: '/network/actions', fields: [] },
      { id: 'security.rogue_scan', label: 'Rogue AP scan', route: '/network/actions', fields: [{ key: 'ssid', label: 'SSID' }, { key: 'mac', label: 'MAC' }] },
      { id: 'security.auth_server.add', label: 'Add RADIUS/TACACS server', route: '/network/actions', fields: [{ key: 'type', label: 'radius/tacacs' }, { key: 'host', label: 'Host' }] },
      { id: 'security.firewall.policy.add', label: 'Add firewall policy', route: '/network/actions', fields: [{ key: 'name', label: 'Name' }, { key: 'action', label: 'allow/deny' }, { key: 'source', label: 'Source' }, { key: 'destination', label: 'Destination' }] },
      { id: 'netflow.refresh', label: 'Refresh NetFlow/sFlow', route: '/network/actions', fields: [] },
      { id: 'config.deploy', label: 'Bulk config deploy', route: '/network/actions', fields: [{ key: 'name', label: 'Job name' }] },
      { id: 'config.restore', label: 'Restore config', route: '/network/actions', fields: [{ key: 'device_id', label: 'Device ID' }] },
      { id: 'device.discovery', label: 'Auto device discovery', route: '/network/actions', fields: [{ key: 'device_id', label: 'Device ID' }, { key: 'name', label: 'Name' }, { key: 'ip', label: 'IP' }] },
      { id: 'alert.integration.add', label: 'Add alert integration', route: '/network/actions', fields: [{ key: 'type', label: 'email/sms/slack' }, { key: 'target', label: 'Target' }] },
    ],
  },
  {
    label: 'Server Admin Actions',
    actions: [
      { id: 'webserver.update_config', label: 'Update web server config', route: '/admin/server-admin/actions', fields: [{ key: 'type', label: 'Type' }, { key: 'config', label: 'Config' }] },
      { id: 'webserver.restart', label: 'Restart web server', route: '/admin/server-admin/actions', fields: [] },
      { id: 'php.set_version', label: 'Set PHP version', route: '/admin/server-admin/actions', fields: [{ key: 'version', label: 'Version' }] },
      { id: 'db.add', label: 'Add database', route: '/admin/server-admin/actions', fields: [{ key: 'id', label: 'DB ID' }, { key: 'type', label: 'Type' }, { key: 'host', label: 'Host' }] },
      { id: 'db.backup', label: 'Backup database', route: '/admin/server-admin/actions', fields: [{ key: 'db_id', label: 'DB ID' }] },
      { id: 'db.admin.open', label: 'Open DB admin', route: '/admin/server-admin/actions', fields: [{ key: 'db_id', label: 'DB ID' }] },
      { id: 'domain.add', label: 'Add domain', route: '/admin/server-admin/actions', fields: [{ key: 'domain', label: 'Domain' }] },
      { id: 'dns.record.add', label: 'Add DNS record', route: '/admin/server-admin/actions', fields: [{ key: 'domain', label: 'Domain' }, { key: 'type', label: 'Type' }, { key: 'name', label: 'Name' }, { key: 'value', label: 'Value' }] },
      { id: 'app.install', label: 'Install app', route: '/admin/server-admin/actions', fields: [{ key: 'name', label: 'App name' }, { key: 'version', label: 'Version' }] },
      { id: 'file.write', label: 'Write file', route: '/admin/server-admin/actions', fields: [{ key: 'path', label: 'Path' }, { key: 'content', label: 'Content' }] },
      { id: 'rbac.role.create', label: 'Create RBAC role', route: '/admin/server-admin/actions', fields: [{ key: 'name', label: 'Role name' }, { key: 'permissions', label: 'Permissions (comma)' }] },
      { id: 'rbac.role.assign', label: 'Assign RBAC role', route: '/admin/server-admin/actions', fields: [{ key: 'role_id', label: 'Role ID' }, { key: 'user_id', label: 'User ID' }] },
      { id: 'queue.create', label: 'Create task queue', route: '/admin/server-admin/actions', fields: [{ key: 'name', label: 'Queue name' }] },
      { id: 'queue.enqueue', label: 'Enqueue task', route: '/admin/server-admin/actions', fields: [{ key: 'queue_id', label: 'Queue ID' }] },
      { id: 'automation.toggle_updates', label: 'Toggle auto updates', route: '/admin/server-admin/actions', fields: [{ key: 'enabled', label: 'true/false' }, { key: 'patch_window', label: 'Patch window' }] },
      { id: 'security.ids.scan', label: 'Run IDS scan', route: '/admin/server-admin/actions', fields: [] },
      { id: 'backup.provider.update', label: 'Update backup provider', route: '/admin/server-admin/actions', fields: [{ key: 'id', label: 'Provider ID' }, { key: 'bucket', label: 'Bucket' }, { key: 'enabled', label: 'true/false' }] },
      { id: 'backup.restore', label: 'Restore backup', route: '/admin/server-admin/actions', fields: [] },
    ],
  },
  {
    label: 'Feed Page Settings',
    actions: [
      { id: 'feed_page_config.get', label: 'Get Feed Page Config', route: '/admin/actions', fields: [] },
      { id: 'feed_page_config.update', label: 'Update Feed Page Config', route: '/admin/actions', fields: [
        { key: 'feed_center', label: 'Feed Center Title' },
        { key: 'premium_badge', label: 'Premium Badge' },
        { key: 'quick_actions', label: 'Quick Actions Label' },
        { key: 'live_status', label: 'Live Status' },
        { key: 'search', label: 'Search Label' },
        { key: 'search_placeholder', label: 'Search Placeholder' },
        { key: 'categories', label: 'Categories Label' },
        { key: 'premium_experience', label: 'Premium Experience' },
        { key: 'hero_title', label: 'Hero Title' },
        { key: 'hero_description', label: 'Hero Description' },
        { key: 'stats_buyer_requests', label: 'Stats - Buyer Requests' },
        { key: 'stats_company_products', label: 'Stats - Company Products' },
        { key: 'stats_feed_posts', label: 'Stats - Feed Posts' },
        { key: 'tabs', label: 'Tabs (comma separated)' },
        { key: 'messages_share_copied', label: 'Msg - Share Copied' },
        { key: 'messages_report_submitted', label: 'Msg - Report Submitted' },
        { key: 'messages_interest_expressed', label: 'Msg - Interest Expressed' },
        { key: 'messages_rate_limited', label: 'Msg - Rate Limited' },
        { key: 'messages_all_caught_up', label: 'Msg - All Caught Up' },
        { key: 'messages_no_results', label: 'Msg - No Results' },
        { key: 'messages_load_failed', label: 'Msg - Load Failed' },
      ] },
    ],
  },
  {
    label: 'CMS Actions',
    actions: [
      { id: 'cms.article.create', label: 'Create article', route: '/admin/cms/actions', fields: [{ key: 'title', label: 'Title' }, { key: 'status', label: 'Status' }, { key: 'author', label: 'Author' }] },
      { id: 'cms.page.create', label: 'Create page', route: '/admin/cms/actions', fields: [{ key: 'title', label: 'Title' }, { key: 'slug', label: 'Slug' }, { key: 'status', label: 'Status' }] },
      { id: 'cms.media.upload', label: 'Upload media', route: '/admin/cms/actions', fields: [{ key: 'name', label: 'Name' }, { key: 'type', label: 'Type' }, { key: 'url', label: 'URL' }] },
      { id: 'cms.version.rollback', label: 'Rollback version', route: '/admin/cms/actions', fields: [{ key: 'content_id', label: 'Content ID' }, { key: 'version', label: 'Version' }] },
      { id: 'cms.theme.switch', label: 'Switch theme', route: '/admin/cms/actions', fields: [{ key: 'theme', label: 'Theme' }] },
      { id: 'cms.seo.update', label: 'Update SEO', route: '/admin/cms/actions', fields: [{ key: 'default_title', label: 'Default title' }, { key: 'meta_description', label: 'Meta description' }, { key: 'social_image', label: 'Social image' }] },
      { id: 'cms.cache.clear', label: 'Clear cache', route: '/admin/cms/actions', fields: [] },
      { id: 'cms.env.update', label: 'Update env vars', route: '/admin/cms/actions', fields: [{ key: 'vars', label: 'Vars JSON' }] },
      { id: 'cms.deploy.run', label: 'Run deployment', route: '/admin/cms/actions', fields: [{ key: 'branch', label: 'Branch' }] },
      { id: 'cms.backup.run', label: 'Run backup', route: '/admin/cms/actions', fields: [{ key: 'provider', label: 'Provider' }] },
      { id: 'cms.cron.add', label: 'Add cron script', route: '/admin/cms/actions', fields: [{ key: 'schedule', label: 'Schedule' }, { key: 'command', label: 'Command' }] },
    ],
  },
  {
    label: 'Ultra Security Actions',
    actions: [
      { id: 'security.zero_trust.toggle', label: 'Toggle zero-trust', route: '/admin/security/actions', fields: [{ key: 'enabled', label: 'true/false' }] },
      { id: 'security.mfa.require', label: 'Require MFA', route: '/admin/security/actions', fields: [{ key: 'required', label: 'true/false' }, { key: 'methods', label: 'Methods (comma)' }] },
      { id: 'security.session.timeout', label: 'Set session timeout', route: '/admin/security/actions', fields: [{ key: 'timeout_minutes', label: 'Minutes' }] },
      { id: 'security.device_fingerprint', label: 'Toggle device fingerprinting', route: '/admin/security/actions', fields: [{ key: 'enabled', label: 'true/false' }] },
      { id: 'security.ip.allowlist', label: 'Update IP allowlist', route: '/admin/security/actions', fields: [{ key: 'ip_whitelist', label: 'IPs (comma)' }] },
      { id: 'security.geo_fence', label: 'Update geo-fence', route: '/admin/security/actions', fields: [{ key: 'enabled', label: 'true/false' }, { key: 'countries', label: 'Countries (comma)' }] },
      { id: 'security.encryption.rotate', label: 'Rotate encryption keys', route: '/admin/security/actions', fields: [] },
      { id: 'security.incident.create', label: 'Create incident', route: '/admin/security/actions', fields: [{ key: 'title', label: 'Title' }, { key: 'severity', label: 'Severity' }] },
      { id: 'security.incident.resolve', label: 'Resolve incident', route: '/admin/security/actions', fields: [{ key: 'id', label: 'Incident ID' }] },
      { id: 'security.export.request', label: 'Request data export', route: '/admin/security/actions', fields: [{ key: 'dataset', label: 'Dataset' }] },
      { id: 'security.export.approve', label: 'Approve data export', route: '/admin/security/actions', fields: [{ key: 'id', label: 'Request ID' }] },
      { id: 'security.forensic.log', label: 'Add forensic log', route: '/admin/security/actions', fields: [{ key: 'message', label: 'Message' }] },
      { id: 'security.immutable.snapshot', label: 'Create immutable backup', route: '/admin/security/actions', fields: [] },
    ],
  },
]

function statusBadge() {
  return 'bg-emerald-400/20 text-emerald-200'
}

function formatNumber(value) {
  const num = Number(value || 0)
  return Number.isFinite(num) ? num.toLocaleString() : '0'
}

function formatCurrency(value) {
  const num = Number(value || 0)
  return Number.isFinite(num) ? `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '$0'
}

function resolvePath(source, path) {
  if (!source || !path) return undefined
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), source)
}

function exportEmailsCsv(rows = []) {
  const emails = rows.map((u) => u.email).filter(Boolean)
  const csv = ['email', ...emails].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'gartexhub_emails.csv'
  link.click()
  URL.revokeObjectURL(url)
}

const DEFAULT_CONTRACT_NO_DATA_LABEL = 'No Data'

function isHexColor(value) {
  const v = String(value || '').trim()
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)
}

function getAdminPanelPiePalette(config) {
  const raw = config?.ui?.admin_panel?.theme?.pie_palette
  const list = Array.isArray(raw) ? raw.map((c) => String(c || '').trim()).filter(Boolean) : []
  const filtered = list.filter(isHexColor)
  const safe = filtered.length >= 2 ? filtered.slice(0, 12) : DEFAULT_PIE_PALETTE
  return safe
}

function getCmsWeeklyTrendFallback(config) {
  const raw = config?.ui?.admin_panel?.fallbacks?.cms?.weekly_trend
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_CMS_WEEKLY_TREND
  const rows = raw
    .map((row) => {
      const name = String(row?.name || row?.day || row?.label || '').trim()
      const value = Number(row?.value ?? row?.count ?? row?.users ?? 0)
      if (!name || !Number.isFinite(value)) return null
      return { name, value }
    })
    .filter(Boolean)
  return rows.length ? rows.slice(0, 31) : DEFAULT_CMS_WEEKLY_TREND
}

function getUltraMiniChartPoints(config) {
  const raw = config?.ui?.admin_panel?.fallbacks?.ultra_security?.mini_chart_points
  if (!Array.isArray(raw) || raw.length < 3) return DEFAULT_ULTRA_MINI_CHART_POINTS
  const points = raw.map((n) => Number(n)).filter((n) => Number.isFinite(n))
  return points.length >= 3 ? points.slice(0, 60) : DEFAULT_ULTRA_MINI_CHART_POINTS
}

function getUltraMiniChartKpis(config) {
  const raw = config?.ui?.admin_panel?.fallbacks?.ultra_security?.mini_chart_kpis
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_ULTRA_MINI_CHART_KPIS
  const rows = raw
    .map((row) => {
      const label = String(row?.label || '').trim()
      const value = String(row?.value || '').trim()
      if (!label || !value) return null
      return { label, value }
    })
    .filter(Boolean)
  return rows.length ? rows.slice(0, 6) : DEFAULT_ULTRA_MINI_CHART_KPIS
}

function getUltraSecurityCapabilities(config) {
  const raw = config?.ui?.admin_panel?.fallbacks?.ultra_security?.capabilities
  const list = Array.isArray(raw) ? raw.map((v) => String(v || '').trim()).filter(Boolean) : []
  const unique = [...new Set(list)]
  return unique.length ? unique.slice(0, 30) : ULTRA_CAPABILITIES_DEFAULT
}

function getContractNoDataLabel(config) {
  const raw = config?.ui?.admin_panel?.fallbacks?.contract_status?.no_data_label
  const value = String(raw || '').trim()
  return value || DEFAULT_CONTRACT_NO_DATA_LABEL
}

function getEmptyStateCopy(config, key, fallback) {
  const k = String(key || '').trim()
  const raw = config?.ui?.admin_panel?.copy?.empty_states?.[k]
  const value = String(raw || '').trim()
  if (value) return value
  if (DEFAULT_EMPTY_STATE_COPY[k]) return DEFAULT_EMPTY_STATE_COPY[k]
  return fallback
}

const buyerBenefits = [
  "Advanced Search Filters",
  "Priority Buyer Request Placement",
  "Dedicated Support",
  "Contract History & Audit Trail",
  "Early Access to New Verified Factories",
  "Buying Pattern Analysis",
  "Order Completion Certification",
  "AI Auto-reply Customization",
  "Smart Supplier Matching",
  "Request Performance Insights",
  "Profile, product boost & increased reach",
];

const factoryBenefits = [
  "Profile, product boost & increased reach",
  "Advanced analytics (who viewed, inquiry rate)",
  "Priority in search results & filters",
  "AI auto-reply customization",
  "Dedicated account manager",
  "Custom branding on profile",
  "Enterprise analytics dashboard",
  "Unlimited agent/sub-ID creation",
  "Buying Pattern Analysis",
  "Order Completion Certification",
  "Dedicated Support",
  "Contract history & audit trail",
];

const buyingHouseBenefits = [
  "Profile, product boost & increased reach",
  "Advanced analytics (who viewed, inquiry rate)",
  "Priority in search results & filters",
  "AI auto-reply customization",
  "Dedicated account manager",
  "Custom branding on profile",
  "Enterprise analytics dashboard",
  "Unlimited agent/sub-ID creation",
  "Request Buying House performance insights",
  "Buyer interest analytics",
  "Agent performance analytics & reporting",
  "More product/video posting capacity",
  "Lead distribution across agents",
  "Buyer communication insights",
  "Buyer Request Priority Access",
  "Buyer Conversion Insights",
  "Unlimited Partner Network access",
];

function SkeletonChart({ height = 320 }) {
  return (
    <div style={{ height }} className="flex flex-col gap-4">
      <div className="flex-1 rounded-2xl bg-slate-100/50 dark:bg-white/5 animate-pulse" />
      <div className="flex justify-between gap-4">
        <div className="h-4 w-12 rounded bg-slate-100/50 dark:bg-white/5 animate-pulse" />
        <div className="h-4 w-12 rounded bg-slate-100/50 dark:bg-white/5 animate-pulse" />
        <div className="h-4 w-12 rounded bg-slate-100/50 dark:bg-white/5 animate-pulse" />
      </div>
    </div>
  )
}

function SectionTitle({ title, subtitle, icon: TitleIcon }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-2 text-sky-300 shadow-lg shadow-sky-500/10">
            <TitleIcon className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, hint, icon: CardIcon, loading = false }) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <SkeletonLine className="h-4 w-24 opacity-50" />
            <SkeletonLine className="mt-3 h-8 w-20" />
            <SkeletonLine className="mt-3 h-3 w-32 opacity-40" />
          </div>
          <SkeletonLine className="h-11 w-11 rounded-2xl opacity-30" />
        </div>
      </div>
    )
  }
  return (
    <div className="group rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.35)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-sky-300/70 hover:shadow-[0_24px_80px_-28px_rgba(14,165,233,0.45)] dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {value}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
        </div>
        <div className="rounded-2xl border border-sky-400/15 bg-gradient-to-br from-sky-400/20 to-blue-500/10 p-3 text-sky-500 shadow-lg shadow-sky-500/10 dark:text-sky-300">
          <CardIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/15 bg-sky-500/8 px-3 py-1 text-xs font-medium text-sky-700 shadow-sm shadow-sky-500/5 dark:text-sky-300">
      {children}
    </span>
  );
}

function BenefitCard({ title, items, accent = "sky" }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-30px_rgba(59,130,246,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Premium capability stack and operational advantages.
          </p>
        </div>
        <div className={`rounded-2xl border border-${accent}-400/20 bg-${accent}-400/10 p-2 text-${accent}-400`}>
          <Sparkles className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/90 p-3 text-sm text-slate-700 dark:border-white/5 dark:bg-white/5 dark:text-slate-300"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSecurityGate({
  open,
  message,
  mfaCode,
  setMfaCode,
  stepUpCode,
  setStepUpCode,
  passkeyBusy,
  notice,
  onPasskeyAuth,
  onUnlock,
  onDecline,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/90 p-6 backdrop-blur-md">
      <div className="admin-panel admin-sweep w-full max-w-lg rounded-3xl p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white">Security verification required</h2>
        <p className="mt-2 text-sm text-slate-300">
          {message || 'Admin security verification required. Use any one of the following methods to unlock the panel.'}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3">
          <label className="text-xs text-slate-400">
            MFA code
            <input
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-900/90 px-3 py-2 text-sm text-white outline-none ring-1 ring-slate-700 focus:ring-sky-500"
              placeholder="Enter MFA code"
            />
          </label>
          <label className="text-xs text-slate-400">
            Passkey
            <button
              type="button"
              onClick={onPasskeyAuth}
              disabled={passkeyBusy}
              className="mt-1 w-full rounded-xl bg-indigo-500/80 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {passkeyBusy ? 'Opening passkey...' : 'Verify with passkey'}
            </button>
          </label>
          <label className="text-xs text-slate-400">
            Setup/step-up code
            <input
              value={stepUpCode}
              onChange={(e) => setStepUpCode(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-900/90 px-3 py-2 text-sm text-white outline-none ring-1 ring-slate-700 focus:ring-sky-500"
              placeholder="Enter setup code"
            />
          </label>
        </div>

        {notice ? <p className="mt-3 text-xs text-sky-200">{notice}</p> : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onUnlock}
            disabled={passkeyBusy}
            className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            Unlock access
          </button>
          <button
            type="button"
            onClick={onDecline}
            disabled={passkeyBusy}
            className="rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 disabled:opacity-60"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}

function SkeletonLine({ className = '' }) {
  return <div className={`skeleton rounded-xl ${className}`} />
}

function Badge({ children, tone = 'default', darkMode = true }) {
  const base = darkMode
    ? {
        default: 'border-slate-800 bg-slate-900 text-slate-300',
        live: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
        info: 'border-sky-400/30 bg-sky-500/10 text-sky-300',
        danger: 'border-rose-400/30 bg-rose-500/10 text-rose-300',
      }
    : {
        default: 'border-slate-200 bg-slate-50 text-slate-700',
        live: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        info: 'border-sky-200 bg-sky-50 text-sky-700',
        danger: 'border-rose-200 bg-rose-50 text-rose-700',
      }

  return <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium', base[tone])}>{children}</span>
}

function StatCard({ icon: Icon, title, value, meta, tone = 'sky', darkMode }) {
  const toneClasses = darkMode
    ? {
        sky: 'border-sky-400/20 bg-slate-950/70 text-sky-300',
        blue: 'border-blue-400/20 bg-slate-950/70 text-blue-300',
        emerald: 'border-emerald-400/20 bg-slate-950/70 text-emerald-300',
        amber: 'border-amber-400/20 bg-slate-950/70 text-amber-300',
      }
    : {
        sky: 'border-sky-200 bg-white text-sky-600',
        blue: 'border-blue-200 bg-white text-blue-600',
        emerald: 'border-emerald-200 bg-white text-emerald-600',
        amber: 'border-amber-200 bg-white text-amber-600',
      }

  const shell = darkMode
    ? 'border-slate-800 bg-slate-950/70 shadow-[0_18px_60px_-30px_rgba(2,132,199,0.35)]'
    : 'border-slate-200 bg-white shadow-sm'

  return (
    <div className={cn('rounded-3xl border p-5 transition hover:-translate-y-0.5', shell)}>
      <div className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium', toneClasses[tone])}>
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className={cn('mt-4 text-2xl font-semibold tracking-tight', darkMode ? 'text-white' : 'text-slate-900')}>{value}</div>
      <p className={cn('mt-1 text-sm', darkMode ? 'text-slate-400' : 'text-slate-500')}>{meta}</p>
    </div>
  )
}

function SectionCard({
  title,
  subtitle,
  icon: Icon,
  children,
  actionLabel,
  actionIcon: ActionIcon = RefreshCw,
  onAction,
  darkMode,
}) {
  const shell = darkMode
    ? 'border-slate-800 bg-slate-950/70 shadow-[0_22px_80px_-38px_rgba(15,23,42,0.35)]'
    : 'border-slate-200 bg-white shadow-sm'
  const titleClass = darkMode ? 'text-white' : 'text-slate-900'
  const subClass = darkMode ? 'text-slate-400' : 'text-slate-500'
  const buttonClass = darkMode
    ? 'border-sky-400/20 bg-sky-500/10 text-sky-200 hover:bg-sky-500/15'
    : 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
  const iconShell = darkMode
    ? 'border-sky-400/20 bg-sky-500/10 text-sky-300'
    : 'border-sky-200 bg-sky-50 text-sky-600'

  return (
    <section className={cn('rounded-[28px] border p-5 transition', shell)}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn('rounded-2xl border p-3', iconShell)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className={cn('text-lg font-semibold tracking-tight', titleClass)}>{title}</h3>
            <p className={cn('mt-1 max-w-2xl text-sm', subClass)}>{subtitle}</p>
          </div>
        </div>
        {actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            disabled={!onAction}
            className={cn(
              'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
              buttonClass
            )}
          >
            <ActionIcon className="h-4 w-4" />
            {actionLabel}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function cmsChipClass(dark, active = false) {
  return [
    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition',
    dark
      ? active
        ? 'border-sky-400/30 bg-sky-400/15 text-sky-100 shadow-[0_0_0_1px_rgba(56,189,248,0.12)]'
        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
      : active
        ? 'border-sky-500/20 bg-sky-50 text-sky-700 shadow-sm'
        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
  ].join(' ')
}

function CmsMiniBadge({ dark, children }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium',
        dark ? 'border-sky-400/20 bg-sky-400/10 text-sky-200' : 'border-sky-200 bg-sky-50 text-sky-700',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

function CmsStatCard({ dark, icon: Icon, label, value, meta, trend }) {
  return (
    <div
      className={[
        'group relative overflow-hidden rounded-3xl border p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5',
        dark
          ? 'border-white/10 bg-slate-950/70 text-white shadow-[0_12px_40px_rgba(2,8,23,0.35)]'
          : 'border-slate-200/80 bg-white text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.06)]',
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-blue-500/5 opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className={dark ? 'text-xs uppercase tracking-[0.28em] text-slate-400' : 'text-xs uppercase tracking-[0.28em] text-slate-500'}>
            {label}
          </p>
          <div className="mt-2 flex items-end gap-3">
            <h3 className="text-3xl font-semibold tracking-tight">{value}</h3>
            {trend ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-500">
                <ArrowUpRight className="h-3 w-3" /> {trend}
              </span>
            ) : null}
          </div>
          <p className={dark ? 'mt-2 text-sm text-slate-400' : 'mt-2 text-sm text-slate-600'}>{meta}</p>
        </div>
        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-3 text-sky-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function CmsSectionCard({ dark, title, subtitle, icon: Icon, action, children, accent = 'sky' }) {
  return (
    <section
      className={[
        'overflow-hidden rounded-3xl border backdrop-blur-xl',
        dark
          ? 'border-white/10 bg-slate-950/70 shadow-[0_18px_55px_rgba(2,8,23,0.4)]'
          : 'border-slate-200/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]',
      ].join(' ')}
    >
      <div className={['flex flex-wrap items-start justify-between gap-4 border-b p-5', dark ? 'border-white/10' : 'border-slate-100'].join(' ')}>
        <div className="flex items-start gap-4">
          <div
            className={[
              'rounded-2xl p-3',
              accent === 'sky'
                ? dark
                  ? 'bg-sky-400/10 text-sky-300'
                  : 'bg-sky-50 text-sky-600'
                : dark
                  ? 'bg-blue-400/10 text-blue-300'
                  : 'bg-blue-50 text-blue-600',
            ].join(' ')}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className={dark ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-slate-900'}>{title}</h2>
            <p className={dark ? 'mt-1 text-sm text-slate-400' : 'mt-1 text-sm text-slate-600'}>{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

function ultraMetricShell(dark) {
  return dark
    ? 'bg-white/5 border-white/10 text-slate-100 shadow-[0_20px_60px_rgba(2,8,23,0.35)]'
    : 'bg-white border-slate-200 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)]'
}

function UltraPill({ dark, active = false, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium',
        active
          ? dark
            ? 'border-cyan-400/30 bg-cyan-500/15 text-cyan-200'
            : 'border-cyan-300 bg-cyan-50 text-cyan-700'
          : dark
            ? 'border-white/10 bg-white/5 text-slate-300'
            : 'border-slate-200 bg-slate-100 text-slate-700'
      )}
    >
      {children}
    </span>
  )
}

function UltraStatCard({ dark, label, value, sub, icon: Icon, tone = 'default' }) {
  const toneClass =
    tone === 'good'
      ? 'from-cyan-500/20 to-sky-500/10 ring-cyan-400/30'
      : tone === 'warn'
        ? 'from-amber-500/20 to-orange-500/10 ring-amber-400/30'
        : tone === 'danger'
          ? 'from-rose-500/20 to-red-500/10 ring-rose-400/30'
          : 'from-sky-500/20 to-blue-500/10 ring-sky-400/30'

  return (
    <div className={cn(ultraMetricShell(dark), 'relative overflow-hidden rounded-3xl border p-5 backdrop-blur-xl')}>
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-80', toneClass)} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className={cn('text-sm font-medium', dark ? 'text-slate-300' : 'text-slate-600')}>{label}</p>
          <div className="mt-2 flex items-end gap-2">
            <h3 className="text-3xl font-semibold tracking-tight">{value}</h3>
            {sub ? <span className={cn('pb-1 text-xs', dark ? 'text-slate-400' : 'text-slate-500')}>{sub}</span> : null}
          </div>
        </div>
        <div className={cn('rounded-2xl p-3', dark ? 'bg-slate-950/30' : 'bg-slate-100')}>
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
      </div>
    </div>
  )
}

function UltraSectionCard({ dark, title, subtitle, children, right }) {
  return (
    <section className={cn(ultraMetricShell(dark), 'relative overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl')}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={cn('text-xl font-semibold tracking-tight', dark ? 'text-white' : 'text-slate-900')}>{title}</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              live
            </span>
          </div>
          {subtitle ? <p className={cn('mt-2 max-w-2xl text-sm leading-6', dark ? 'text-slate-400' : 'text-slate-600')}>{subtitle}</p> : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  )
}

function UltraToggle({ dark, on, label, hint, onToggle }) {
  return (
    <div className={cn('flex items-center justify-between gap-4 rounded-2xl border p-4', dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
      <div>
        <p className={cn('font-medium', dark ? 'text-white' : 'text-slate-900')}>{label}</p>
        {hint ? <p className={cn('mt-1 text-sm', dark ? 'text-slate-400' : 'text-slate-500')}>{hint}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <span className={cn('text-sm', on ? 'text-cyan-300' : dark ? 'text-slate-400' : 'text-slate-500')}>{on ? 'On' : 'Off'}</span>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'flex h-10 w-20 items-center rounded-full border px-1 transition',
            on ? 'border-cyan-400/40 bg-cyan-500/20' : dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
          )}
          aria-pressed={on}
        >
          <div className={cn('h-8 w-8 rounded-full shadow-md transition-transform', on ? 'translate-x-10 bg-cyan-400' : dark ? 'bg-slate-400' : 'bg-slate-500')} />
        </button>
      </div>
    </div>
  )
}

function UltraTinyChart({ dark, points = DEFAULT_ULTRA_MINI_CHART_POINTS, kpis = DEFAULT_ULTRA_MINI_CHART_KPIS }) {
  const safePoints = Array.isArray(points) && points.length >= 3 ? points : DEFAULT_ULTRA_MINI_CHART_POINTS
  const width = 640
  const height = 180
  const max = Math.max(...safePoints)
  const min = Math.min(...safePoints)
  const range = max - min || 1
  const pad = 16
  const step = (width - pad * 2) / (safePoints.length - 1)
  const y = (v) => height - pad - ((v - min) / range) * (height - pad * 2)
  const path = safePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${pad + i * step} ${y(p)}`)
    .join(' ')
  const area = `${path} L ${width - pad} ${height - pad} L ${pad} ${height - pad} Z`
  const safeKpis = Array.isArray(kpis) && kpis.length ? kpis.slice(0, 6) : DEFAULT_ULTRA_MINI_CHART_KPIS

  return (
    <div className={cn('rounded-[24px] border p-4', dark ? 'border-white/10 bg-slate-950/25' : 'border-slate-200 bg-white')}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className={cn('text-sm font-medium', dark ? 'text-white' : 'text-slate-900')}>Live Metrics</p>
          <p className={cn('text-xs', dark ? 'text-slate-400' : 'text-slate-500')}>Metrics coming from live feeds.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-cyan-300">
          <Activity className="h-4 w-4" />
          streaming
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full">
        <defs>
          <linearGradient id="ultraSkyFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(56,189,248,0.38)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0)" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#ultraSkyFill)" />
        <path d={path} fill="none" stroke="currentColor" strokeWidth="3" className="text-cyan-300" />
        {safePoints.map((p, i) => (
          <circle key={i} cx={pad + i * step} cy={y(p)} r="4.2" className="fill-cyan-300 text-cyan-300" />
        ))}
      </svg>
      <div className="mt-2 grid grid-cols-3 gap-3 text-center text-xs">
        {safeKpis.slice(0, 3).map((row) => (
          <div key={row.label} className={cn('rounded-2xl border p-3', dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
            <div className={cn('font-semibold', dark ? 'text-white' : 'text-slate-900')}>{row.value}</div>
            <div className={dark ? 'text-slate-400' : 'text-slate-500'}>{row.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminPanel() {
const user = getCurrentUser()
  const userRole = normalizeRole(user?.role)
  const [adminDark, setAdminDark] = useState(() => {
    const stored = localStorage.getItem('admin_theme')
    if (stored === 'light') return false
    if (stored === 'dark') return true
    return true
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
const [master, setMaster] = useState(null)
  const [catalog, setCatalog] = useState(null)
  const [infra, setInfra] = useState(null)
  const [network, setNetwork] = useState(null)
  const [infraState, setInfraState] = useState(null)
  const [networkInventory, setNetworkInventory] = useState(null)
  const [serverAdminState, setServerAdminState] = useState(null)
  const [cmsState, setCmsState] = useState(null)
  const [securityState, setSecurityState] = useState(null)
  const [integrationStatus, setIntegrationStatus] = useState(null)
  const [couponReport, setCouponReport] = useState(null)
  const [signups, setSignups] = useState([])
  const [strikeHistory, setStrikeHistory] = useState([])
  const [fraudReview, setFraudReview] = useState({ items: [], duplicates: [] })
const [orgOwnership, setOrgOwnership] = useState({ orgs: [], staff_list: [] })

  const { inventory: dynamicInventory } = useInventory()
  const { piePalette: dynamicPiePalette, emptyStates: dynamicEmptyStates } = useUiConfig()
  const { capabilities: _infraCapabilities } = useCapabilities('infra')
  const { capabilities: _networkCapabilities } = useCapabilities('network')
  const { capabilities: _ultraCapabilities } = useCapabilities('ultra-security')
  const { actions: _adminActions } = useActions()
  const { groups: dynamicActionGroups } = useActionGroups()
  const _roleConfig = useRoleConfig()
  const [walletLedger, setWalletLedger] = useState([])
  const [featuredForm, setFeaturedForm] = useState({ entity_type: 'product', entity_id: '', label: '' })
  const [audit, setAudit] = useState([])
  const [infraSearch, setInfraSearch] = useState('')
  const [networkQuery, setNetworkQuery] = useState('')
  const [networkAuditQuery, setNetworkAuditQuery] = useState('')
  const [networkNav, setNetworkNav] = useState('overview')
  const [serverAdminAuditQuery, setServerAdminAuditQuery] = useState('')
  const [cmsTab, setCmsTab] = useState('cms')
  const [cmsAuditQuery, setCmsAuditQuery] = useState('')
  const [ultraAuditQuery, setUltraAuditQuery] = useState('')
  const [users, setUsers] = useState([])
  const [verificationQueue, setVerificationQueue] = useState([])
  const [contractsVault, setContractsVault] = useState([])
  const [disputes, setDisputes] = useState([])
  const [supportTickets, setSupportTickets] = useState([])
  const [supportLoading, setSupportLoading] = useState(false)
  const [supportFilters, setSupportFilters] = useState({ status: 'all', priority: 'all', assigned_to: '' })
  const [moderationPending, setModerationPending] = useState([])
  const [moderationRejected, setModerationRejected] = useState([])
  const [policyQueueItems, setPolicyQueueItems] = useState([])
  const [policyReviewRows, setPolicyReviewRows] = useState([])
  const [policyMetrics, setPolicyMetrics] = useState(null)
  const [reputationSenderId, setReputationSenderId] = useState('')
  const [reputationDelta, setReputationDelta] = useState('0')

  const [emailConfig, setEmailConfig] = useState({
    enabled: false,
    provider: 'smtp',
    from_name: 'GarTexHub',
    from_email: '',
    test_recipient: '',
  })
  const [emailConfigBusy, setEmailConfigBusy] = useState(false)
  const [emailConfigNotice, setEmailConfigNotice] = useState('')
  const [emailConfigError, setEmailConfigError] = useState('')
  const [openSearchConfig, setOpenSearchConfig] = useState({
    enabled: false,
    url: '',
    username: '',
    password: '',
    index_prefix: 'gartexhub_',
    timeout_ms: 3000,
    verify_tls: true,
  })
  const [openSearchStatus, setOpenSearchStatus] = useState(null)
  const [openSearchOrgId, setOpenSearchOrgId] = useState('')
  const [openSearchReset, setOpenSearchReset] = useState(false)
  const [openSearchConfigBusy, setOpenSearchConfigBusy] = useState(false)
  const [openSearchActionBusy, setOpenSearchActionBusy] = useState('')
  const [openSearchNotice, setOpenSearchNotice] = useState('')
  const [openSearchError, setOpenSearchError] = useState('')
  const [clothingRulesForm, setClothingRulesForm] = useState({
    forbidden_terms: '',
    flag_terms: '',
    allowed_terms: '',
    context_exceptions: '',
    reason_rejected: '',
    reason_pending: '',
    reason_fix: '',
  })
  const [clothingRulesBusy, setClothingRulesBusy] = useState(false)
  const [clothingRulesNotice, setClothingRulesNotice] = useState('')
  const [clothingRulesError, setClothingRulesError] = useState('')

const [adminUiSettingsForm, setAdminUiSettingsForm] = useState({
    allowed_roles: '',
    fallback_inventory_json: '',
    pie_palette: '',
    cms_weekly_trend_json: '',
    ultra_mini_points_json: '',
    ultra_mini_kpis_json: '',
    ultra_capabilities: '',
    contract_no_data_label: '',
    empty_states_json: '',
  })
const [adminUiSettingsDirty, setAdminUiSettingsDirty] = useState(false)
  const [adminUiSettingsBusy, setAdminUiSettingsBusy] = useState(false)
  const [adminUiSettingsNotice, setAdminUiSettingsNotice] = useState('')
  const [adminUiSettingsError, setAdminUiSettingsError] = useState('')
  const [systemReports, setSystemReports] = useState([])
  const [productAppealReports, setProductAppealReports] = useState([])
  const [contentReports, setContentReports] = useState([])
  const [partnerRequests, setPartnerRequests] = useState([])
  const [paymentProofs, setPaymentProofs] = useState([])
  const [userQuery, setUserQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [verificationFilter, setVerificationFilter] = useState('all')
  const [premiumFilter, setPremiumFilter] = useState('all')
  const [userDrafts, setUserDrafts] = useState({})
  const [mfaCode, setMfaCode] = useState(() => localStorage.getItem('admin_mfa_code') || '')
  const [deviceId, setDeviceId] = useState(() => localStorage.getItem('admin_device_id') || '')
  const [passkeyValue] = useState(() => localStorage.getItem('admin_passkey') || '')
  const [stepUpCode, setStepUpCode] = useState(() => localStorage.getItem('admin_stepup_code') || '')
  const [passkeyBusy, setPasskeyBusy] = useState(false)
  const [securityGateOpen, setSecurityGateOpen] = useState(false)
  const [securityGateMessage, setSecurityGateMessage] = useState('')
  const [securityGateNotice, setSecurityGateNotice] = useState('')
  const [activeCategory, setActiveCategory] = useState('home')
  const [actionBusy, setActionBusy] = useState('')

  const [configEditorTab, setConfigEditorTab] = useState('inventory')
  const [configEditorData, setConfigEditorData] = useState({ inventory: [], actions: [], ui: {} })
  const [configEditorLoading, setConfigEditorLoading] = useState(false)
  const [configEditorSaving, setConfigEditorSaving] = useState(false)
  const [configEditorNotice, setConfigEditorNotice] = useState('')
  const [configEditorError, setConfigEditorError] = useState('')

const adminPanelAllowedRoles = useMemo(() => getAdminPanelAllowedRoles(master?.config), [master?.config])
  const isAllowedAdminViewer = adminPanelAllowedRoles.includes(userRole)

  const actionGroups = useMemo(() => {
    const staticGroups = ACTION_GROUPS
    if (dynamicActionGroups && dynamicActionGroups.length > 0) {
      const merged = []
      const seen = new Map()
      for (const group of staticGroups) {
        merged.push(group)
        seen.set(group.label, true)
      }
      for (const group of dynamicActionGroups) {
        if (!seen.has(group.label)) {
          merged.push(group)
        }
      }
      return merged
    }
    return staticGroups
  }, [dynamicActionGroups])

  const actionOptions = useMemo(() => {
    return actionGroups.flatMap((group) => group.actions.map((action) => ({
      ...action,
      group: group.label,
    })))
  }, [actionGroups])
  const [selectedActionId, setSelectedActionId] = useState(actionOptions[0]?.id || '')
  const selectedAction = actionOptions.find((action) => action.id === selectedActionId)
  const [actionForm, setActionForm] = useState({})
  const [firewallForm, setFirewallForm] = useState({ action: 'allow', port: '', protocol: 'tcp', description: '' })
  const [packageForm, setPackageForm] = useState({ mode: 'check', apply: false })
  const [cronForm, setCronForm] = useState({ name: '', schedule: '', command: '' })
  const [osUserForm, setOsUserForm] = useState({ username: '', role: 'user' })
  const [sshKeyForm, setSshKeyForm] = useState({ label: '', fingerprint: '' })
  const [sslForm, setSslForm] = useState({ domain: '' })
  const [infraBackupForm, setInfraBackupForm] = useState({ retention_days: '' })
  const [timeForm, setTimeForm] = useState({ timezone: '' })
  const [vlanForm, setVlanForm] = useState({ vlan_id: '', name: '', subnet: '', gateway: '' })
  const [ipamForm, setIpamForm] = useState({ ip: '', owner: '' })
  const [backupForm, setBackupForm] = useState({ device_id: '' })

  useEffect(() => {
    if (!selectedAction) return
    const defaults = {}
    selectedAction.fields.forEach((field) => {
      defaults[field.key] = ''
    })
    setActionForm(defaults)
  }, [selectedAction])

  useEffect(() => {
    if (!mfaCode) return
    localStorage.setItem('admin_mfa_code', mfaCode)
  }, [mfaCode])

  useEffect(() => {
    const root = document.documentElement
    if (adminDark) {
      root.classList.add('dark')
      localStorage.setItem('admin_theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('admin_theme', 'light')
    }
  }, [adminDark])

  useEffect(() => {
    if (!deviceId) return
    localStorage.setItem('admin_device_id', deviceId)
  }, [deviceId])

  useEffect(() => {
    if (deviceId) return
    const fallback = `device-${Math.random().toString(36).slice(2, 10)}`
    setDeviceId(fallback)
  }, [deviceId])

  useEffect(() => {
    if (!passkeyValue) return
    localStorage.setItem('admin_passkey', passkeyValue)
  }, [passkeyValue])

  useEffect(() => {
    if (!stepUpCode) return
    localStorage.setItem('admin_stepup_code', stepUpCode)
  }, [stepUpCode])

  useEffect(() => {
    const rules = master?.config?.moderation?.clothing_rules
    if (rules) {
      setClothingRulesForm({
        forbidden_terms: listToTextarea(rules.forbidden_terms),
        flag_terms: listToTextarea(rules.flag_terms),
        allowed_terms: listToTextarea(rules.allowed_terms),
        context_exceptions: listToTextarea(rules.context_exceptions),
        reason_rejected: rules?.reason_templates?.rejected || '',
        reason_pending: rules?.reason_templates?.pending_review || '',
        reason_fix: rules?.reason_templates?.fix_guidance || '',
      })
    }

    const email = master?.config?.notifications?.email
    if (email) {
      setEmailConfig({
        enabled: Boolean(email.enabled),
        provider: email.provider || 'smtp',
        from_name: email.from_name || 'GarTexHub',
        from_email: email.from_email || '',
        test_recipient: email.test_recipient || '',
      })
    }

    const opensearch = master?.config?.integrations?.opensearch
    if (opensearch) {
      setOpenSearchConfig({
        enabled: Boolean(opensearch.enabled),
        url: opensearch.url || '',
        username: opensearch.username || '',
        password: opensearch.password || '',
        index_prefix: opensearch.index_prefix || 'gartexhub_',
        timeout_ms: Number(opensearch.timeout_ms || 3000),
        verify_tls: opensearch.verify_tls !== false,
      })
    }

    if (!adminUiSettingsDirty) {
      const allowedRoles = getAdminPanelAllowedRoles(master?.config)
      const fallbackInventory = getAdminPanelFallbackInventory(master?.config).map((row) => ({
        id: row.id,
        label: row.label,
        icon_name: row.icon_name || '',
      }))
      const piePalette = getAdminPanelPiePalette(master?.config)
      const cmsWeeklyTrend = getCmsWeeklyTrendFallback(master?.config)
      const ultraPoints = getUltraMiniChartPoints(master?.config)
      const ultraKpis = getUltraMiniChartKpis(master?.config)
      const ultraCapabilities = getUltraSecurityCapabilities(master?.config)
      const contractNoDataLabel = getContractNoDataLabel(master?.config)
      const rawEmptyStates = master?.config?.ui?.admin_panel?.copy?.empty_states
      const sanitizedEmptyStates = rawEmptyStates && typeof rawEmptyStates === 'object' && !Array.isArray(rawEmptyStates)
        ? Object.fromEntries(
            Object.entries(rawEmptyStates).map(([key, value]) => [String(key || '').trim(), String(value || '').trim()]).filter(([k, v]) => k && v)
          )
        : {}
      const emptyStates = { ...DEFAULT_EMPTY_STATE_COPY, ...sanitizedEmptyStates }

      setAdminUiSettingsForm({
        allowed_roles: allowedRoles.join(', '),
        fallback_inventory_json: JSON.stringify(fallbackInventory, null, 2),
        pie_palette: listToTextarea(piePalette),
        cms_weekly_trend_json: JSON.stringify(cmsWeeklyTrend, null, 2),
        ultra_mini_points_json: JSON.stringify(ultraPoints, null, 2),
        ultra_mini_kpis_json: JSON.stringify(ultraKpis, null, 2),
        ultra_capabilities: listToTextarea(ultraCapabilities),
        contract_no_data_label: contractNoDataLabel,
        empty_states_json: JSON.stringify(emptyStates, null, 2),
      })
      setAdminUiSettingsNotice('')
      setAdminUiSettingsError('')
    }
  }, [master?.config, adminUiSettingsDirty])

  const buildAdminHeaders = useCallback(({ stepUp = false } = {}) => {
    const headers = {}
    if (mfaCode) headers['x-admin-mfa'] = mfaCode
    if (deviceId) headers['x-admin-device'] = deviceId
    if (passkeyValue) headers['x-admin-passkey'] = passkeyValue
    if (stepUp && stepUpCode) {
      headers['x-admin-stepup'] = stepUpCode
      headers['x-admin-stepup-at'] = new Date().toISOString()
    }
    return headers
  }, [mfaCode, deviceId, stepUpCode, passkeyValue])

  const handleSecurityFailure = useCallback((err) => {
    if (Number(err?.status) !== 403) return false
    setSecurityGateOpen(true)
    setSecurityGateMessage(err?.message || 'Admin security verification failed.')
    return true
  }, [])

  async function refreshAudit() {
    const token = getToken()
    if (!token) return
    try {
      const auditData = await apiRequest('/admin/audit?limit=40', { token, headers: buildAdminHeaders() })
      setAudit(Array.isArray(auditData?.items) ? auditData.items : [])
    } catch {
      // ignore
    }
  }

  const loadAdminData = useCallback(async () => {
    if (!isAllowedAdminViewer) return
    const token = getToken()
    if (!token) return

    setLoading(true)
    setError('')
    const headers = buildAdminHeaders()

    try {
      const [
        masterData, userRows, infraData, infraStateData, networkData, networkInventoryData, auditData, verificationData,
        contractsData, disputesData, partnersData, proofsData, catalogData, couponReportData, serverAdminData, cmsData,
        securityData, integrationData, signupsData, strikesData, fraudData, orgOwnershipData, walletLedgerData,
      ] = await Promise.all([
        apiRequest('/admin/master', { token, headers }),
        apiRequest('/admin/users', { token, headers }),
        apiRequest('/infra/overview', { token, headers }),
        apiRequest('/infra/state', { token, headers }),
        apiRequest('/network/overview', { token, headers }),
        apiRequest('/network/inventory', { token, headers }),
        apiRequest('/admin/audit?limit=40', { token, headers }),
        apiRequest('/verification/admin/queue', { token, headers }),
        apiRequest('/admin/contracts', { token, headers }),
        apiRequest('/admin/disputes', { token, headers }),
        apiRequest('/admin/partner-requests', { token, headers }),
        apiRequest('/admin/payment-proofs', { token, headers }),
        apiRequest('/admin/catalog', { token, headers }),
        apiRequest('/admin/coupons/report', { token, headers }),
        apiRequest('/admin/server-admin/state', { token, headers }),
        apiRequest('/admin/cms/state', { token, headers }),
        apiRequest('/admin/security/state', { token, headers }),
        apiRequest('/admin/integrations/status', { token, headers }),
        apiRequest('/admin/signups', { token, headers }),
        apiRequest('/admin/strikes', { token, headers }),
        apiRequest('/admin/fraud/verification', { token, headers }),
        apiRequest('/admin/orgs/ownership', { token, headers }),
        apiRequest('/admin/wallet/ledger', { token, headers }),
      ])
      setMaster(masterData || null)
      setUsers(Array.isArray(userRows) ? userRows : [])
      setInfra(infraData || null)
      setInfraState(infraStateData || null)
      setNetwork(networkData || null)
      setNetworkInventory(networkInventoryData || null)
      setAudit(Array.isArray(auditData?.items) ? auditData.items : [])
      setVerificationQueue(Array.isArray(verificationData) ? verificationData : (Array.isArray(verificationData?.items) ? verificationData.items : []))
      setContractsVault(Array.isArray(contractsData?.items) ? contractsData.items : [])
      setDisputes(Array.isArray(disputesData?.items) ? disputesData.items : [])
      setPartnerRequests(Array.isArray(partnersData?.items) ? partnersData.items : [])
      setPaymentProofs(Array.isArray(proofsData?.items) ? proofsData.items : [])
      setCatalog(catalogData || null)
      setCouponReport(couponReportData || null)
      setServerAdminState(serverAdminData || null)
      setCmsState(cmsData || null)
      setSecurityState(securityData || null)
      setIntegrationStatus(integrationData || null)
      setSignups(Array.isArray(signupsData?.items) ? signupsData.items : [])
      setStrikeHistory(Array.isArray(strikesData?.items) ? strikesData.items : [])
      setFraudReview({
        items: Array.isArray(fraudData?.items) ? fraudData.items : [],
        duplicates: Array.isArray(fraudData?.duplicates) ? fraudData.duplicates : [],
      })
      setOrgOwnership(orgOwnershipData || { orgs: [], staff_list: [] })
      setWalletLedger(Array.isArray(walletLedgerData?.items) ? walletLedgerData.items : [])
      setSecurityGateOpen(false)
      setSecurityGateMessage('')
      setSecurityGateNotice('')
    } catch (err) {
      if (!handleSecurityFailure(err)) {
        setError(err.message || 'Failed to load admin data')
      }
    } finally {
      setLoading(false)
    }
  }, [isAllowedAdminViewer, buildAdminHeaders, handleSecurityFailure])

  useEffect(() => {
    loadAdminData()
  }, [loadAdminData])

const summary = master?.summary || {}
  const uiFallbackInventory = useMemo(() => getAdminPanelFallbackInventory(master?.config), [master?.config])
  const inventory = useMemo(() => {
    const inv = Array.isArray(master?.inventory) ? master.inventory : []
    if (inv.length) return inv
    if (dynamicInventory && dynamicInventory.length > 0) return dynamicInventory
    return uiFallbackInventory
  }, [master?.inventory, uiFallbackInventory, dynamicInventory])
  const securityContext = master?.security_context || {}
  const premiumUsers = useMemo(() => users.filter((u) => String(u.subscription_status || '').toLowerCase() === 'premium'), [users])
  const regionOptions = useMemo(() => {
    const set = new Set()
    users.forEach((u) => {
      const country = String(u.profile?.country || '').trim()
      if (country) set.add(country)
    })
    return ['all', ...Array.from(set).sort()]
  }, [users])
  const filteredUsers = useMemo(() => {
    const query = userQuery.trim().toLowerCase()
    return users.filter((u) => {
      const matchesQuery = !query || [u.name, u.email, u.role, u.id].some((value) => String(value || '').toLowerCase().includes(query))
      if (!matchesQuery) return false
      if (roleFilter !== 'all' && String(u.role || '').toLowerCase() !== roleFilter) return false
      if (statusFilter !== 'all' && String(u.status || '').toLowerCase() !== statusFilter) return false
      if (regionFilter !== 'all' && String(u.profile?.country || '').trim() !== regionFilter) return false
      if (verificationFilter !== 'all') {
        const isVerified = Boolean(u.verified)
        if (verificationFilter === 'verified' && !isVerified) return false
        if (verificationFilter === 'unverified' && isVerified) return false
      }
      if (premiumFilter !== 'all') {
        const plan = String(u.subscription_status || '').toLowerCase()
        if (premiumFilter === 'premium' && plan !== 'premium') return false
        if (premiumFilter === 'free' && plan === 'premium') return false
      }
      return true
    })
  }, [users, userQuery, roleFilter, statusFilter, regionFilter, verificationFilter, premiumFilter])

  const filteredInfraAuditRows = useMemo(() => {
    const query = infraSearch.trim().toLowerCase()
    if (!query) return audit
    return audit.filter((entry) => {
      const haystack = [
        entry?.action,
        entry?.path,
        entry?.actor,
        entry?.actor_id,
        entry?.ip,
        entry?.device_id,
        entry?.status,
      ]
        .map((value) => String(value || '').toLowerCase())
        .join(' ')
      return haystack.includes(query)
    })
  }, [audit, infraSearch])

  const filteredNetworkDevices = useMemo(() => {
    const devices = Array.isArray(networkInventory?.devices) ? networkInventory.devices : []
    const query = networkQuery.trim().toLowerCase()
    if (!query) return devices
    return devices.filter((device) => {
      const value = `${device?.name || ''} ${device?.id || ''} ${device?.status || ''}`.toLowerCase()
      return value.includes(query)
    })
  }, [networkInventory?.devices, networkQuery])

  const filteredNetworkAuditRows = useMemo(() => {
    const query = networkAuditQuery.trim().toLowerCase()
    if (!query) return audit
    return audit.filter((entry) => {
      const haystack = [
        entry?.action,
        entry?.path,
        entry?.actor,
        entry?.actor_id,
        entry?.ip,
        entry?.device_id,
        entry?.status,
      ]
        .map((value) => String(value || '').toLowerCase())
        .join(' ')
      return haystack.includes(query)
    })
  }, [audit, networkAuditQuery])

  const filteredServerAdminAuditRows = useMemo(() => {
    const query = serverAdminAuditQuery.trim().toLowerCase()
    if (!query) return audit
    return audit.filter((entry) => {
      const haystack = [
        entry?.action,
        entry?.path,
        entry?.actor,
        entry?.actor_id,
        entry?.ip,
        entry?.device_id,
        entry?.status,
      ]
        .map((value) => String(value || '').toLowerCase())
        .join(' ')
      return haystack.includes(query)
    })
  }, [audit, serverAdminAuditQuery])

  const filteredCmsAuditRows = useMemo(() => {
    const query = cmsAuditQuery.trim().toLowerCase()
    if (!query) return audit
    return audit.filter((entry) => {
      const haystack = [
        entry?.action,
        entry?.path,
        entry?.actor,
        entry?.actor_id,
        entry?.ip,
        entry?.device_id,
        entry?.status,
      ]
        .map((value) => String(value || '').toLowerCase())
        .join(' ')
      return haystack.includes(query)
    })
  }, [audit, cmsAuditQuery])

  const filteredUltraAuditRows = useMemo(() => {
    const query = ultraAuditQuery.trim().toLowerCase()
    if (!query) return audit
    return audit.filter((entry) => {
      const haystack = [
        entry?.action,
        entry?.path,
        entry?.actor,
        entry?.actor_id,
        entry?.ip,
        entry?.device_id,
        entry?.status,
      ]
        .map((value) => String(value || '').toLowerCase())
        .join(' ')
      return haystack.includes(query)
    })
  }, [audit, ultraAuditQuery])

const piePalette = useMemo(() => {
    const existing = getAdminPanelPiePalette(master?.config)
    if (existing && existing.length >= 2) return existing
    if (dynamicPiePalette && dynamicPiePalette.length >= 2) return dynamicPiePalette
    return existing
  }, [master?.config, dynamicPiePalette])
  const cmsWeeklyTrendFallback = useMemo(() => getCmsWeeklyTrendFallback(master?.config), [master?.config])
  const ultraMiniChartPoints = useMemo(() => getUltraMiniChartPoints(master?.config), [master?.config])
  const ultraMiniChartKpis = useMemo(() => getUltraMiniChartKpis(master?.config), [master?.config])
  const contractNoDataLabel = useMemo(() => getContractNoDataLabel(master?.config), [master?.config])
  const emptyCopy = useCallback((key, fallback) => {
    const existing = getEmptyStateCopy(master?.config, key, fallback)
    if (existing && existing !== fallback) return existing
    return dynamicEmptyStates?.[key] || fallback
  }, [master?.config, dynamicEmptyStates])

const analyticsOverview = catalog?.analytics || {}
  const activeUsersTrend = useMemo(() => {
    const trend = analyticsOverview.active_users_trend
    return Array.isArray(trend) ? trend : []
  }, [analyticsOverview?.active_users_trend])
  const buyerRequestTrend = useMemo(() => {
    const trend = analyticsOverview.buyer_request_trend
    return Array.isArray(trend) ? trend : []
  }, [analyticsOverview?.buyer_request_trend])
  const cmsTrendData = useMemo(() => {
    if (activeUsersTrend.length) {
      return activeUsersTrend.slice(-7).map((row, idx) => ({
        name: row?.name || row?.day || row?.label || `D${idx + 1}`,
        value: Number(row?.value ?? row?.count ?? row?.users ?? 0) || 0,
      }))
    }
    return cmsWeeklyTrendFallback
  }, [activeUsersTrend, cmsWeeklyTrendFallback])

  const ultraSecurityCapabilities = useMemo(() => getUltraSecurityCapabilities(master?.config), [master?.config])
  const contractStatusData = useMemo(() => {
    const counts = { signed: 0, pending: 0, dispute: 0 }
    contractsVault.forEach((row) => {
      const status = String(row?.lifecycle_status || '').toLowerCase()
      if (status.includes('signed')) counts.signed += 1
      else if (status.includes('dispute')) counts.dispute += 1
      else counts.pending += 1
    })

    const total = counts.signed + counts.pending + counts.dispute
    if (total === 0) {
      return [
        { name: contractNoDataLabel, value: 1 }
      ]
    }

    return [
      { name: 'Signed', value: counts.signed },
      { name: 'Pending', value: counts.pending },
      { name: 'Dispute', value: counts.dispute },
    ]
  }, [contractsVault, contractNoDataLabel])

  function updateDraft(id, field, value) {
    setUserDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  async function saveUserEdits(userId) {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders({ stepUp: true })
    const draft = userDrafts[userId] || {}

    const body = {
      role: draft.role,
      status: draft.status,
      verified: draft.verified,
      subscription_status: draft.subscription_status,
      policy_strikes: draft.policy_strikes,
      fraud_flags: draft.fraud_flags
        ? String(draft.fraud_flags)
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)
        : undefined,
      admin_notes: draft.admin_notes,
      mfa_setup_code: draft.mfa_setup_code,
      stepup_setup_code: draft.stepup_setup_code,
    }

    const cleaned = Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined))
    try {
      await apiRequest(`/users/${userId}`, { method: 'PATCH', token, headers, body: cleaned })
      setUserDrafts((prev) => {
        const next = { ...prev }
        delete next[userId]
        return next
      })
      const updatedUsers = await apiRequest('/admin/users', { token, headers })
      setUsers(Array.isArray(updatedUsers) ? updatedUsers : [])
    } catch (err) {
      setError(err.message || 'Failed to update user')
    }
  }

  async function resetPassword(userId) {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders({ stepUp: true })
    const newPassword = window.prompt('Enter a new password (min 6 chars):')
    if (!newPassword) return
    try {
      await apiRequest(`/users/${userId}/reset-password`, { method: 'POST', token, headers, body: { new_password: newPassword } })
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    }
  }

  async function forceLogout(userId) {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders({ stepUp: true })
    if (!window.confirm('Force logout this user?')) return
    try {
      await apiRequest(`/users/${userId}/force-logout`, { method: 'POST', token, headers })
    } catch (err) {
      setError(err.message || 'Failed to force logout')
    }
  }

  async function lockMessaging(userId, hours = 24) {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders({ stepUp: true })
    try {
      await apiRequest(`/users/${userId}/lock-messaging`, { method: 'POST', token, headers, body: { lock_hours: hours } })
    } catch (err) {
      setError(err.message || 'Failed to lock messaging')
    }
  }

  async function runAction(actionConfig) {
    if (!actionConfig) return
    const token = getToken()
    if (!token) return
    setActionBusy(actionConfig.id)
    const headers = buildAdminHeaders({ stepUp: true })
    try {
      await apiRequest(actionConfig.route, {
        method: 'POST',
        token,
        headers,
        body: {
          action: actionConfig.id,
          payload: actionForm,
        },
      })
      await refreshAudit()
    } catch (err) {
      setError(err.message || 'Failed to run admin action')
    } finally {
      setActionBusy('')
    }
  }

  async function runInlineAdminAction(actionId, payload = {}) {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders({ stepUp: true })
    try {
      await apiRequest('/admin/actions', {
        method: 'POST',
        token,
        headers,
        body: { action: actionId, payload },
      })
      await refreshAudit()
    } catch (err) {
      setError(err.message || 'Failed to run admin action')
    }
  }

  async function refreshVerificationQueue() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/verification/admin/queue', { token, headers })
    setVerificationQueue(Array.isArray(data?.items) ? data.items : [])
  }

  async function refreshContractsVault() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/contracts', { token, headers })
    setContractsVault(Array.isArray(data?.items) ? data.items : [])
  }

  async function refreshDisputes() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/disputes', { token, headers })
    setDisputes(Array.isArray(data?.items) ? data.items : [])
  }

  const refreshSupportTickets = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setSupportLoading(true)
    const headers = buildAdminHeaders()
    try {
      const params = new URLSearchParams()
      if (supportFilters.status && supportFilters.status !== 'all') params.set('status', supportFilters.status)
      if (supportFilters.priority && supportFilters.priority !== 'all') params.set('priority', supportFilters.priority)
      if (supportFilters.assigned_to) params.set('assigned_to', supportFilters.assigned_to)
      const query = params.toString()
      const path = query ? `/admin/support/tickets?${query}` : '/admin/support/tickets'
      const data = await apiRequest(path, { token, headers })
      setSupportTickets(Array.isArray(data?.items) ? data.items : [])
    } catch (err) {
      setSupportTickets([])
      setError(err.message || 'Failed to load support tickets')
    } finally {
      setSupportLoading(false)
    }
  }, [buildAdminHeaders, supportFilters])

  const refreshModerationQueues = useCallback(async () => {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const [pendingData, rejectedData] = await Promise.all([
      apiRequest('/admin/moderation/products?status=pending_review', { token, headers }),
      apiRequest('/admin/moderation/products?status=rejected', { token, headers }),
    ])
    setModerationPending(Array.isArray(pendingData?.items) ? pendingData.items : [])
    setModerationRejected(Array.isArray(rejectedData?.items) ? rejectedData.items : [])
  }, [buildAdminHeaders])

  const refreshReportQueues = useCallback(async () => {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const [systemData, appealData, contentData] = await Promise.all([
      apiRequest('/admin/reports/system', { token, headers }),
      apiRequest('/admin/reports/product-appeals', { token, headers }),
      apiRequest('/admin/reports/content', { token, headers }),
    ])
    setSystemReports(Array.isArray(systemData?.items) ? systemData.items : [])
    setProductAppealReports(Array.isArray(appealData?.items) ? appealData.items : [])
    setContentReports(Array.isArray(contentData?.items) ? contentData.items : [])
  }, [buildAdminHeaders])


  const refreshMessagePolicyOps = useCallback(async () => {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    try {
      const [queueData, reviewData, metricsData] = await Promise.all([
        apiRequest('/messages/policy/queue-inspector?status=queued', { token, headers }),
        apiRequest('/messages/policy/review-queue', { token, headers }),
        apiRequest('/messages/policy/reports/weekly-decision-quality', { token, headers }),
      ])
      setPolicyQueueItems(Array.isArray(queueData?.rows) ? queueData.rows : [])
      setPolicyReviewRows(Array.isArray(reviewData?.rows) ? reviewData.rows : [])
      setPolicyMetrics(metricsData || null)
    } catch (err) {
      setPolicyQueueItems([])
      setPolicyReviewRows([])
      setPolicyMetrics(null)
      setError(err.message || 'Failed to load communication policy queues')
    }
  }, [buildAdminHeaders])

  async function saveClothingRules() {
    const token = getToken()
    if (!token) return
    setClothingRulesBusy(true)
    setClothingRulesNotice('')
    setClothingRulesError('')
    try {
      const patch = {
        moderation: {
          clothing_rules: {
            forbidden_terms: textareaToList(clothingRulesForm.forbidden_terms),
            flag_terms: textareaToList(clothingRulesForm.flag_terms),
            allowed_terms: textareaToList(clothingRulesForm.allowed_terms),
            context_exceptions: textareaToList(clothingRulesForm.context_exceptions),
            reason_templates: {
              rejected: String(clothingRulesForm.reason_rejected || '').trim(),
              pending_review: String(clothingRulesForm.reason_pending || '').trim(),
              fix_guidance: String(clothingRulesForm.reason_fix || '').trim(),
            },
          },
        },
      }
      const updated = await apiRequest('/admin/config', {
        method: 'PATCH',
        token,
        headers: buildAdminHeaders({ stepUp: true }),
        body: patch,
      })
      setMaster((prev) => (prev ? { ...prev, config: updated } : prev))
      setClothingRulesNotice('Clothing moderation rules updated.')
    } catch (err) {
      setClothingRulesError(err.message || 'Unable to update rules.')
    } finally {
      setClothingRulesBusy(false)
    }
  }

  async function saveEmailConfig() {
    const token = getToken()
    if (!token) return
    setEmailConfigBusy(true)
    setEmailConfigNotice('')
    setEmailConfigError('')
    try {
      const patch = {
        notifications: {
          email: {
            enabled: Boolean(emailConfig.enabled),
            provider: emailConfig.provider || 'smtp',
            from_name: String(emailConfig.from_name || '').trim(),
            from_email: String(emailConfig.from_email || '').trim(),
            test_recipient: String(emailConfig.test_recipient || '').trim(),
          },
        },
      }
      const updated = await apiRequest('/admin/config', {
        method: 'PATCH',
        token,
        headers: buildAdminHeaders({ stepUp: true }),
        body: patch,
      })
      setMaster((prev) => (prev ? { ...prev, config: updated } : prev))
      setEmailConfigNotice('Email configuration saved.')
    } catch (err) {
      setEmailConfigError(err.message || 'Unable to update email settings.')
    } finally {
      setEmailConfigBusy(false)
    }
  }

  async function saveOpenSearchConfig() {
    const token = getToken()
    if (!token) return
    setOpenSearchConfigBusy(true)
    setOpenSearchNotice('')
    setOpenSearchError('')
    try {
      const patch = {
        integrations: {
          opensearch: {
            enabled: Boolean(openSearchConfig.enabled),
            url: String(openSearchConfig.url || '').trim(),
            username: String(openSearchConfig.username || '').trim(),
            password: String(openSearchConfig.password || ''),
            index_prefix: String(openSearchConfig.index_prefix || '').trim(),
            timeout_ms: Math.max(500, Math.min(60000, Number(openSearchConfig.timeout_ms || 3000))),
            verify_tls: Boolean(openSearchConfig.verify_tls),
          },
        },
      }
      const updated = await apiRequest('/admin/config', {
        method: 'PATCH',
        token,
        headers: buildAdminHeaders({ stepUp: true }),
        body: patch,
      })
      setMaster((prev) => (prev ? { ...prev, config: updated } : prev))
      setOpenSearchNotice('OpenSearch configuration saved.')
      await refreshIntegrationStatus()
      await refreshOpenSearchStatus()
    } catch (err) {
      setOpenSearchError(err.message || 'Unable to update OpenSearch settings.')
    } finally {
      setOpenSearchConfigBusy(false)
    }
  }

  async function saveAdminUiSettings() {
    const token = getToken()
    if (!token) return

    setAdminUiSettingsBusy(true)
    setAdminUiSettingsNotice('')
    setAdminUiSettingsError('')

    try {
      const roles = textareaToList(adminUiSettingsForm.allowed_roles).map(normalizeRole).filter((r) => KNOWN_ROLES.has(r))
      if (!roles.length) throw new Error('Allowed roles cannot be empty.')

      let inventory = []
      try {
        const parsed = JSON.parse(adminUiSettingsForm.fallback_inventory_json || '[]')
        if (!Array.isArray(parsed)) throw new Error('fallback_inventory must be a JSON array.')
        inventory = parsed
          .map((row) => {
            const id = String(row?.id || '').trim()
            const label = String(row?.label || '').trim()
            const iconName = String(row?.icon_name || '').trim()
            if (!id || !label) return null
            return { id, label, icon_name: iconName }
          })
          .filter(Boolean)
      } catch (err) {
        throw new Error(`Invalid fallback inventory JSON: ${err.message || 'parse error'}`)
      }

      if (!inventory.length) throw new Error('Fallback inventory cannot be empty.')

      const piePalette = textareaToList(adminUiSettingsForm.pie_palette).map((c) => String(c || '').trim()).filter(isHexColor)
      if (piePalette.length < 2) throw new Error('Pie palette must include at least 2 valid hex colors.')

      let cmsWeeklyTrend = []
      try {
        const parsed = JSON.parse(adminUiSettingsForm.cms_weekly_trend_json || '[]')
        if (!Array.isArray(parsed)) throw new Error('cms weekly trend must be a JSON array.')
        cmsWeeklyTrend = parsed
          .map((row) => {
            const name = String(row?.name || row?.day || row?.label || '').trim()
            const value = Number(row?.value ?? row?.count ?? row?.users ?? 0)
            if (!name || !Number.isFinite(value)) return null
            return { name, value }
          })
          .filter(Boolean)
      } catch (err) {
        throw new Error(`Invalid CMS weekly trend JSON: ${err.message || 'parse error'}`)
      }
      if (!cmsWeeklyTrend.length) throw new Error('CMS weekly trend fallback cannot be empty.')

      let ultraMiniPoints = []
      try {
        const parsed = JSON.parse(adminUiSettingsForm.ultra_mini_points_json || '[]')
        if (!Array.isArray(parsed)) throw new Error('ultra mini chart points must be a JSON array.')
        ultraMiniPoints = parsed.map((n) => Number(n)).filter((n) => Number.isFinite(n))
      } catch (err) {
        throw new Error(`Invalid Ultra mini-chart points JSON: ${err.message || 'parse error'}`)
      }
      if (ultraMiniPoints.length < 3) throw new Error('Ultra mini-chart points must include at least 3 numbers.')

      let ultraMiniKpis = []
      try {
        const parsed = JSON.parse(adminUiSettingsForm.ultra_mini_kpis_json || '[]')
        if (!Array.isArray(parsed)) throw new Error('ultra mini chart KPIs must be a JSON array.')
        ultraMiniKpis = parsed
          .map((row) => {
            const label = String(row?.label || '').trim()
            const value = String(row?.value || '').trim()
            if (!label || !value) return null
            return { label, value }
          })
          .filter(Boolean)
      } catch (err) {
        throw new Error(`Invalid Ultra mini-chart KPIs JSON: ${err.message || 'parse error'}`)
      }
      if (!ultraMiniKpis.length) throw new Error('Ultra mini-chart KPIs cannot be empty.')

      const ultraCapabilities = textareaToList(adminUiSettingsForm.ultra_capabilities).map((v) => String(v || '').trim()).filter(Boolean)
      if (!ultraCapabilities.length) throw new Error('Ultra Security capabilities cannot be empty.')

      const contractNoDataLabel = String(adminUiSettingsForm.contract_no_data_label || '').trim() || DEFAULT_CONTRACT_NO_DATA_LABEL

      let emptyStates = {}
      try {
        const parsed = JSON.parse(adminUiSettingsForm.empty_states_json || '{}')
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('empty_states must be a JSON object.')
        emptyStates = Object.fromEntries(
          Object.entries(parsed).map(([k, v]) => [String(k || '').trim(), String(v || '').trim()]).filter(([k, v]) => k && v)
        )
      } catch (err) {
        throw new Error(`Invalid empty-state copy JSON: ${err.message || 'parse error'}`)
      }

      const patch = {
        ui: {
          admin_panel: {
            allowed_roles: roles,
            fallback_inventory: inventory,
            theme: {
              pie_palette: piePalette.slice(0, 12),
            },
            fallbacks: {
              cms: {
                weekly_trend: cmsWeeklyTrend.slice(0, 31),
              },
              ultra_security: {
                mini_chart_points: ultraMiniPoints.slice(0, 60),
                mini_chart_kpis: ultraMiniKpis.slice(0, 6),
                capabilities: ultraCapabilities.slice(0, 30),
              },
              contract_status: {
                no_data_label: contractNoDataLabel,
              },
            },
            copy: {
              empty_states: emptyStates,
            },
          },
        },
      }

      const updated = await apiRequest('/admin/config', {
        method: 'PATCH',
        token,
        headers: buildAdminHeaders({ stepUp: true }),
        body: patch,
      })

      setMaster((prev) => (prev ? { ...prev, config: updated } : prev))
      setAdminUiSettingsDirty(false)
      setAdminUiSettingsNotice('Admin UI settings saved.')
    } catch (err) {
      setAdminUiSettingsError(err.message || 'Unable to save Admin UI settings.')
    } finally {
      setAdminUiSettingsBusy(false)
    }
  }

  async function runOpenSearchAction(action, payload = {}) {
    const token = getToken()
    if (!token) return
    const safeAction = String(action || '').trim()
    if (!safeAction) return
    setOpenSearchActionBusy(safeAction)
    setOpenSearchNotice('')
    setOpenSearchError('')
    try {
      const result = await apiRequest('/admin/integrations/actions', {
        method: 'POST',
        token,
        headers: buildAdminHeaders({ stepUp: true }),
        body: {
          action: safeAction,
          payload,
        },
      })
      if (!result?.ok) throw new Error(result?.error || result?.result?.error || 'OpenSearch action failed.')

      const detail = result?.result || result?.status || null
      const suffix = (detail?.products !== undefined || detail?.requirements !== undefined)
        ? ` (${detail?.products ?? 0} products, ${detail?.requirements ?? 0} requirements)`
        : ''
      setOpenSearchNotice(`${safeAction.replace('opensearch.', '').replace(/_/g, ' ')} ok${suffix}`)
      await refreshIntegrationStatus()
      await refreshOpenSearchStatus()
    } catch (err) {
      setOpenSearchError(err.message || 'OpenSearch action failed.')
    } finally {
      setOpenSearchActionBusy('')
    }
  }

  async function sendEmailTest() {
    const token = getToken()
    if (!token) return
    setEmailConfigNotice('')
    setEmailConfigError('')
    try {
      const result = await apiRequest('/admin/actions', {
        method: 'POST',
        token,
        headers: buildAdminHeaders({ stepUp: true }),
        body: {
          action: 'email.test_send',
          to: emailConfig.test_recipient,
        },
      })
      const status = result?.result?.status || 'queued'
      setEmailConfigNotice(`Test email sent (${status}).`)
    } catch (err) {
      setEmailConfigError(err.message || 'Unable to send test email.')
    }
  }

  async function resolveReportAdmin(reportId, action = 'reviewed') {
    const token = getToken()
    if (!token || !reportId) return
    const headers = buildAdminHeaders({ stepUp: true })
    const note = window.prompt('Resolution note (optional):') || ''
    await apiRequest(`/admin/reports/${encodeURIComponent(reportId)}/resolve`, {
      method: 'POST',
      token,
      headers,
      body: { action, note },
    })
    await refreshReportQueues()
    await refreshAudit()
  }

  async function assignSupportTicketAdmin(ticketId) {
    const token = getToken()
    if (!token || !ticketId) return
    const assigneeId = window.prompt('Assign to user ID (leave blank to clear):') ?? ''
    if (assigneeId === null) return
    const headers = buildAdminHeaders({ stepUp: true })
    await apiRequest('/admin/support/assign', {
      method: 'POST',
      token,
      headers,
      body: { ticket_id: ticketId, assignee_id: assigneeId },
    })
    await refreshSupportTickets()
    await refreshAudit()
  }

  async function updateSupportTicketAdmin(ticketId, patch = {}) {
    const token = getToken()
    if (!token || !ticketId) return
    const headers = buildAdminHeaders({ stepUp: true })
    await apiRequest(`/admin/support/${encodeURIComponent(ticketId)}`, {
      method: 'PATCH',
      token,
      headers,
      body: patch,
    })
    await refreshSupportTickets()
    await refreshAudit()
  }

  async function refreshPartnerRequests() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/partner-requests', { token, headers })
    setPartnerRequests(Array.isArray(data?.items) ? data.items : [])
  }

  async function refreshInfraState() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/infra/state', { token, headers })
    setInfraState(data || null)
  }

  async function refreshInfraAll() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const [overviewData, stateData] = await Promise.all([
      apiRequest('/infra/overview', { token, headers }),
      apiRequest('/infra/state', { token, headers }),
    ])
    setInfra(overviewData || null)
    setInfraState(stateData || null)
  }

  async function refreshNetworkInventory() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/network/inventory', { token, headers })
    setNetworkInventory(data || null)
  }

  async function refreshCatalog() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const [catalogData, couponData] = await Promise.all([
      apiRequest('/admin/catalog', { token, headers }),
      apiRequest('/admin/coupons/report', { token, headers }),
    ])
    setCatalog(catalogData || null)
    setCouponReport(couponData || null)
  }

  async function refreshServerAdminState() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/server-admin/state', { token, headers })
    setServerAdminState(data || null)
  }

  async function refreshCmsState() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/cms/state', { token, headers })
    setCmsState(data || null)
  }

  async function refreshSecurityState() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/security/state', { token, headers })
    setSecurityState(data || null)
  }

  async function refreshIntegrationStatus() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/integrations/status', { token, headers })
    setIntegrationStatus(data || null)
  }

  const refreshOpenSearchStatus = useCallback(async () => {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/integrations/opensearch/status', { token, headers })
    setOpenSearchStatus(data || null)
  }, [buildAdminHeaders])

  useEffect(() => {
    if (activeCategory !== 'platform') return
    refreshSupportTickets()
    refreshModerationQueues()
    refreshReportQueues()
    refreshMessagePolicyOps()
  }, [activeCategory, refreshSupportTickets, refreshModerationQueues, refreshReportQueues, refreshMessagePolicyOps])

useEffect(() => {
    if (activeCategory !== 'server-admin') return
    if (!isAllowedAdminViewer) return
    refreshOpenSearchStatus()
  }, [activeCategory, isAllowedAdminViewer, refreshOpenSearchStatus])

  useEffect(() => {
    if (activeCategory !== 'config') return
    async function fetchConfigData() {
      setConfigEditorLoading(true)
      setConfigEditorNotice('')
      setConfigEditorError('')
      try {
        const [inventory, actions, ui] = await Promise.all([
          apiRequest('/admin/config/inventory', { method: 'GET' }),
          apiRequest('/admin/config/actions/groups', { method: 'GET' }),
          apiRequest('/admin/config/ui', { method: 'GET' }),
        ])
        setConfigEditorData({
          inventory: inventory || [],
          actions: actions || [],
          ui: ui || {},
        })
      } catch (err) {
        setConfigEditorError('Failed to load config: ' + err.message)
      } finally {
        setConfigEditorLoading(false)
      }
    }
    fetchConfigData()
  }, [activeCategory])

  async function refreshSignups() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/signups', { token, headers })
    setSignups(Array.isArray(data?.items) ? data.items : [])
  }

  async function refreshStrikeHistory() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/strikes', { token, headers })
    setStrikeHistory(Array.isArray(data?.items) ? data.items : [])
  }

  async function refreshFraudReview() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/fraud/verification', { token, headers })
    setFraudReview({
      items: Array.isArray(data?.items) ? data.items : [],
      duplicates: Array.isArray(data?.duplicates) ? data.duplicates : [],
    })
  }

  async function refreshOrgOwnership() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/orgs/ownership', { token, headers })
    setOrgOwnership(data || { orgs: [], staff_list: [] })
  }

  async function refreshWalletLedger() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const data = await apiRequest('/admin/wallet/ledger', { token, headers })
    setWalletLedger(Array.isArray(data?.items) ? data.items : [])
  }

  async function downloadCsv(path, filename) {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const res = await fetch(`/api${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Export failed')
    }
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  function downloadJson(filename, data) {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  async function runInfraAction(action, payload = {}) {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders({ stepUp: true })
    try {
      await apiRequest('/infra/actions', {
        method: 'POST',
        token,
        headers,
        body: { action, payload },
      })
      await refreshInfraState()
      await refreshAudit()
    } catch (err) {
      setError(err.message || 'Failed to run infra action')
    }
  }

  async function runNetworkAction(action, payload = {}) {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders({ stepUp: true })
    try {
      await apiRequest('/network/actions', {
        method: 'POST',
        token,
        headers,
        body: { action, payload },
      })
      await refreshNetworkInventory()
      await refreshAudit()
    } catch (err) {
      setError(err.message || 'Failed to run network action')
    }
  }


  async function runSecurityAction(action, payload = {}) {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders({ stepUp: true })
    try {
      await apiRequest('/admin/security/actions', {
        method: 'POST',
        token,
        headers,
        body: { action, payload },
      })
      await refreshSecurityState()
      await refreshAudit()
    } catch (err) {
      setError(err.message || 'Failed to run security action')
    }
  }

  async function handleSecurityUnlock() {
    await loadAdminData()
  }

  async function handleGatePasskeyAuth() {
    const current = getCurrentUser()
    const identifier = current?.email || current?.member_id
    if (!identifier) {
      setSecurityGateNotice('Unable to resolve current account for passkey verification.')
      return
    }
    setPasskeyBusy(true)
    setSecurityGateNotice('')
    try {
      const optionsRes = await apiRequest('/auth/passkey/login/options', {
        method: 'POST',
        body: { identifier, purpose: 'admin_security' },
      })
      const assertion = await startAuthentication(optionsRes.options)
      const verify = await apiRequest('/auth/passkey/login/verify', {
        method: 'POST',
        body: { identifier, credential: assertion, purpose: 'admin_security' },
      })
      saveSession(verify.user, verify.token)
      setSecurityGateNotice('Passkey verified. Reloading admin panel…')
      await loadAdminData()
    } catch (err) {
      setSecurityGateNotice(err?.message || 'Passkey verification failed.')
    } finally {
      setPasskeyBusy(false)
    }
  }

  function handleSecurityDecline() {
    setSecurityGateOpen(false)
    setSecurityGateMessage('')
    setSecurityGateNotice('')
  }

  const theme = useMemo(() => {
    return adminDark
      ? {
          shell: "bg-slate-950 text-slate-100",
          background: "bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.22),_transparent_45%),linear-gradient(to_bottom_right,_#020617,_#07111f_55%,_#081221)]",
          panel: "bg-white/5 border-white/10 backdrop-blur-xl",
          muted: "text-slate-400",
          soft: "text-slate-300",
          item: "hover:bg-white/6 hover:border-cyan-400/20",
          itemActive:
            "bg-gradient-to-r from-cyan-500/18 to-sky-500/12 border-cyan-300/20",
          glow: "shadow-[0_0_32px_rgba(56,189,248,0.14)]",
          chip: "bg-cyan-400/10 text-cyan-200 border-cyan-300/15",
          accentText: "text-cyan-200",
        }
      : {
          shell: "bg-slate-50 text-slate-900",
          background: "bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.16),_transparent_45%),linear-gradient(to_bottom_right,_#f8fbff,_#eef6ff_55%,_#f7fbff)]",
          panel: "bg-white border-slate-200",
          muted: "text-slate-500",
          soft: "text-slate-600",
          item: "hover:bg-sky-50 hover:border-sky-200",
          itemActive:
            "bg-gradient-to-r from-sky-100 to-cyan-50 border-sky-200",
          glow: "shadow-[0_0_24px_rgba(59,130,246,0.10)]",
          chip: "bg-sky-100 text-sky-700 border-sky-200",
          accentText: "text-sky-700",
        };
  }, [adminDark]);

  const sidebarItems = useMemo(() => {
    const uiById = new Map(uiFallbackInventory.map((row) => [row.id, row]))
    const items = [
      { id: 'home', label: 'HomeCore', icon: LayoutDashboard, sub: 'Platform & Business Control', accent: true },
    ]
    
    inventory.forEach(item => {
      let sub = 'Management'
      const ui = uiById.get(item.id)
      const label = ui?.label || item.label
      const iconName = ui?.icon_name || item.icon_name || ''
      let icon = getIconComponent(iconName, ShieldCheck)
      let accent = false
      
      if (item.id === 'platform') {
         return
      } else if (item.id === 'infra') {
         sub = 'Management'
         icon = getIconComponent(iconName, Server)
      } else if (item.id === 'network') {
         sub = 'Enterprise Level'
         icon = getIconComponent(iconName, Network)
      } else if (item.id === 'server-admin') {
         sub = 'Full Stack'
         icon = getIconComponent(iconName, MonitorCog)
      } else if (item.id === 'cms') {
         sub = 'Powerful publishing flow'
         icon = getIconComponent(iconName, Database)
      } else if (item.id === 'ultra-security') {
         sub = 'Advanced'
         icon = getIconComponent(iconName, Shield)
      }
      
      items.push({ ...item, label, icon, sub, accent })
    })

    return items
  }, [inventory, uiFallbackInventory])

  const activeData = useMemo(() => {
    if (activeCategory === 'home') return { label: 'HomeCore', sub: 'Platform & Business Control', sections: [] }
    const cat = inventory.find((row) => row.id === activeCategory) || inventory[0]
    if (!cat) return { label: 'Admin', sub: '', sections: [] }
    const ui = uiFallbackInventory.find((row) => row.id === cat.id)
    return { ...cat, label: ui?.label || cat.label }
  }, [activeCategory, inventory, uiFallbackInventory])

  const CategoryIcon = useMemo(() => {
     const item = sidebarItems.find(i => i.id === activeCategory)
     return item?.icon || ShieldCheck
  }, [activeCategory, sidebarItems])

  const infraInputClass = adminDark
    ? 'w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400/60'
    : 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400/60'

  const infraFieldPanel = adminDark
    ? 'rounded-2xl border border-slate-800 bg-slate-900/60 p-4'
    : 'rounded-2xl border border-slate-200 bg-slate-50 p-4'

  if (!isAllowedAdminViewer) {
    const roles = adminPanelAllowedRoles.join(', ')
    return <AccessDeniedState message={`Admin panel access is limited to: ${roles || 'owner, admin'}.`} />
  }

  return (
    <>
      <AdminSecurityGate
        open={securityGateOpen}
        message={securityGateMessage}
        mfaCode={mfaCode}
        setMfaCode={setMfaCode}
        stepUpCode={stepUpCode}
        setStepUpCode={setStepUpCode}
        passkeyBusy={passkeyBusy}
        notice={securityGateNotice}
        onPasskeyAuth={handleGatePasskeyAuth}
        onUnlock={handleSecurityUnlock}
        onDecline={handleSecurityDecline}
      />
      <div className={`admin-shell h-screen w-screen ${theme.shell} ${theme.background} flex overflow-hidden transition-colors`}>
        <div className="admin-plasma" />
        <div className="admin-current" />
        <div className="admin-noise" />
        
        <aside
          className={`fixed left-0 top-0 z-20 h-full w-[320px] overflow-hidden border-r border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl ${adminDark ? "bg-cyan-500/18" : "bg-sky-300/35"}`} />
            <div className={`absolute -bottom-24 -left-16 h-56 w-56 rounded-full blur-3xl ${adminDark ? "bg-blue-500/12" : "bg-cyan-300/25"}`} />
          </div>

          <div className="relative flex h-full flex-col p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${adminDark ? "bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600" : "bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500"} shadow-[0_0_24px_rgba(56,189,248,0.25)]`}>
                  <span className="text-lg font-black tracking-tight text-white">G</span>
                </div>
                <div>
                  <div className={`text-lg font-semibold tracking-tight ${theme.soft}`}>GarTexHub</div>
                  <div className={`mt-0.5 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${theme.chip}`}>
                    <Crown className="h-3.5 w-3.5" />
                    Admin Matrix
                  </div>
                </div>
              </div>

              <button
                onClick={() => setAdminDark((v) => !v)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 ${
                  adminDark
                    ? "border-white/10 bg-white/5 hover:bg-white/10"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                {adminDark ? <SunMedium className="h-5 w-5 text-cyan-200" /> : <Moon className="h-5 w-5 text-sky-700" />}
              </button>
            </div>

            {/* Navigation */}
            <nav className="mt-6 space-y-2 overflow-y-auto overflow-x-hidden pr-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = activeCategory === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveCategory(item.id)}
                    className={`group relative flex w-full items-center gap-3 rounded-[16px] border px-4 py-3 text-left transition-all duration-300 ${
                      isActive ? theme.itemActive : theme.item
                    } ${isActive ? 'border-cyan-300/20' : 'border-transparent'}`}
                  >
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-all duration-300 ${
                        isActive
                          ? adminDark
                            ? "border-cyan-300/20 bg-cyan-400/12"
                            : "border-sky-200 bg-sky-100"
                          : adminDark
                            ? "border-white/10 bg-white/5 group-hover:border-cyan-300/15"
                            : "border-slate-200 bg-slate-50 group-hover:border-sky-200"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? theme.accentText : theme.soft}`} />
                    </div>

                    {/* Tooltip */}
                    <div className="absolute left-[70px] z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-5px] group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg ${adminDark ? "bg-slate-900 text-white border border-white/10" : "bg-white text-slate-900 border border-slate-200"}`}>
                        {item.label}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`truncate text-sm font-medium ${adminDark ? "text-white" : "text-slate-900"}`}>
                          {item.label}
                        </span>
                        {item.accent && (
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${theme.chip}`}>
                            Core
                          </span>
                        )}
                      </div>
                      <p className={`mt-0.5 truncate text-xs ${theme.muted}`}>{item.sub}</p>
                    </div>

                    <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${isActive ? theme.accentText : theme.muted}`} />
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        <main className={`relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden pr-4 py-4 sm:pr-6 sm:py-6 ${sidebarOpen ? 'pl-[320px]' : 'pl-0'} lg:pl-[320px]`}>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="admin-panel admin-sweep flex min-w-[220px] flex-1 items-center gap-2 rounded-full px-4 py-2 text-xs text-slate-200 md:max-w-md">
              <Search className="h-4 w-4 text-sky-200/80" />
              <input
                className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none"
                placeholder="Search accounts, contracts, proofs..."
              />
            </div>
            <button
              type="button"
              onClick={() => setAdminDark((prev) => !prev)}
              className="admin-panel flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white/90"
            >
              {adminDark ? <Sun className="h-4 w-4 text-yellow-300" /> : <Moon className="h-4 w-4 text-slate-700" />}
              {adminDark ? 'Light' : 'Dark'}
            </button>
          </div>

          {/* Mobile backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex-1 overflow-y-auto pb-6 pr-2">
            <div className="space-y-8">
              {error ? (
                <div className="admin-panel admin-sweep rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              {activeCategory === 'home' ? (
                <>
                  <div className="mb-6 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/75 p-5 shadow-[0_24px_80px_-35px_rgba(14,165,233,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="rounded-[1.4rem] border border-sky-400/20 bg-gradient-to-br from-sky-400 to-blue-500 p-3 text-white shadow-lg shadow-sky-500/25">
                          <ShieldCheck className="h-7 w-7" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                              Owner Admin
                            </h1>
                            <Pill>
                              {loading ? (
                                <>
                                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.15)]" />
                                  Checking...
                                </>
                              ) : error ? (
                                <>
                                  <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_0_4px_rgba(251,113,113,0.15)]" />
                                  Degraded
                                </>
                              ) : (
                                <>
                                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)]" />
                                  Live
                                </>
                              )}
                            </Pill>
                            <Pill>
                              <LockKeyhole className="h-3.5 w-3.5" />
                              MFA {securityContext.mfa_required ? 'Required' : 'Optional'}
                            </Pill>
                            <Pill>
                              <Sparkles className="h-3.5 w-3.5" />
                              Exec {securityContext.exec_enabled ? 'Enabled' : 'Simulated'}
                            </Pill>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <LayoutDashboard className="h-4 w-4 text-sky-500" />
                            <span className="font-medium text-slate-700 dark:text-slate-200">Command Deck</span>
                            <span>• Real-time control for platform, infra, and network operations. Everything is tracked and auditable.</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Pill>
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Owner Access
                            </Pill>
                            <Pill>
                              <ClipboardList className="h-3.5 w-3.5" />
                              Audit logs enabled
                            </Pill>
                            <Pill>
                              <Activity className="h-3.5 w-3.5" />
                              System Pulse
                            </Pill>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setAdminDark((v) => !v)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                        >
                          {adminDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                          {adminDark ? "Light mode" : "Dark mode"}
                        </button>
                        <button 
                          onClick={() => downloadCsv('/admin/exports/run?dataset=full_system&format=pdf', 'system_audit.pdf').catch(e => setError(e.message))}
                          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_40px_-16px_rgba(14,165,233,0.85)] transition hover:-translate-y-0.5"
                        >
                          <Download className="h-4 w-4" />
                          Export report
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard loading={loading} label="Total accounts" value={formatNumber(summary?.users?.total)} hint="Owner access enabled" icon={Users} />
                    <MetricCard loading={loading} label="Pending verifications" value={formatNumber(summary?.verification?.pending)} hint="Audit gate clear" icon={ShieldCheck} />
                    <MetricCard loading={loading} label="Infra alerts" value={formatNumber(network?.alert_count)} hint="System pulse live" icon={Bell} />
                    <MetricCard loading={loading} label="Open tickets" value={formatNumber(summary?.support?.open)} hint="Support queue empty" icon={Ticket} />
                  </div>

                  <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
                    <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.3)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                      <SectionTitle
                        title="Platform Snapshot"
                        subtitle="Core platform health, account state, and audience flow at a glance."
                        icon={Globe}
                      />
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Total accounts</p>
                          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                            {loading ? <SkeletonLine className="h-8 w-20" /> : formatNumber(summary?.users?.total)}
                          </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Verification pending</p>
                          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                            {loading ? <SkeletonLine className="h-8 w-16" /> : formatNumber(summary?.verification?.pending)}
                          </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Reports open</p>
                          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                            {loading ? <SkeletonLine className="h-8 w-16" /> : formatNumber(summary?.support?.open)}
                          </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Domain clicks / visits</p>
                          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                            {loading ? (
                              <SkeletonLine className="h-8 w-32" />
                            ) : (
                              `${formatNumber(summary?.traffic?.clicks)} / ${formatNumber(summary?.traffic?.visits)}`
                            )}
                          </div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {loading ? (
                              <SkeletonLine className="h-4 w-36" />
                            ) : (
                              <>
                                Spend: {formatCurrency(summary?.traffic?.spend || 0)} · CPC:{' '}
                                {summary?.traffic?.cpc ? formatCurrency(summary.traffic.cpc) : '--'}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Infra + Network Health</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Live system stats from infra and network controllers.</p>
                            </div>
                            <div className="rounded-2xl bg-sky-500/10 p-2 text-sky-500 dark:text-sky-300">
                              <Network className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 dark:border-white/5 dark:bg-slate-950/50">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">CPU usage (%)</p>
                                  <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                                    {loading ? <SkeletonLine className="h-7 w-12" /> : `${infra?.cpu?.usage_percent?.toFixed?.(0) || '0'}%`}
                                  </div>
                                </div>
                                <Cpu className="h-4 w-4 text-sky-500" />
                              </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 dark:border-white/5 dark:bg-slate-950/50">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Memory used</p>
                                  <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                                    {loading ? (
                                      <SkeletonLine className="h-7 w-20" />
                                    ) : (
                                      `${infra?.memory?.used_bytes ? formatNumber(Math.round(infra.memory.used_bytes / (1024 * 1024))) : '0'} MB`
                                    )}
                                  </div>
                                </div>
                                <Layers3 className="h-4 w-4 text-sky-500" />
                              </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 dark:border-white/5 dark:bg-slate-950/50">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Devices up/down</p>
                                  <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                                    {loading ? (
                                      <SkeletonLine className="h-7 w-24" />
                                    ) : (
                                      `${formatNumber(network?.device_up)} / ${formatNumber(network?.device_down)}`
                                    )}
                                  </div>
                                </div>
                                <Network className="h-4 w-4 text-sky-500" />
                              </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 dark:border-white/5 dark:bg-slate-950/50">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Network alerts</p>
                                  <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                                    {loading ? <SkeletonLine className="h-7 w-12" /> : formatNumber(network?.alert_count)}
                                  </div>
                                </div>
                                <AlertTriangle className="h-4 w-4 text-sky-500" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">System Pulse</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Operational readiness and administrative controls.</p>
                            </div>
                            <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-500 dark:text-emerald-300">
                              <Activity className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 dark:border-white/5 dark:bg-slate-950/50">
                              <span className="text-sm text-slate-600 dark:text-slate-300">Live status</span>
                              {loading ? (
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-500 dark:text-amber-300">
                                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" /> Checking...
                                </span>
                              ) : !error ? (
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-500 dark:text-emerald-300">
                                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-rose-500 dark:text-rose-300">
                                  <span className="h-2 w-2 rounded-full bg-rose-400" /> Degraded
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 dark:border-white/5 dark:bg-slate-950/50">
                              <span className="text-sm text-slate-600 dark:text-slate-300">Premium users</span>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                {loading ? <SkeletonLine className="h-5 w-12" /> : formatNumber(premiumUsers.length)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 dark:border-white/5 dark:bg-slate-950/50">
                              <span className="text-sm text-slate-600 dark:text-slate-300">Suspended</span>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                {loading ? <SkeletonLine className="h-5 w-12" /> : formatNumber(summary?.users?.suspended)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.3)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                      <SectionTitle
                        title="Action Console"
                        subtitle="Run platform, infra, and network actions with full audit logging."
                        icon={Wrench}
                      />
                      <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200">
                        Step-up required for destructive actions
                      </div>
                      <div className="mt-4 space-y-4">
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Action</span>
                          <div className="relative">
                            <select
                              value={selectedActionId}
                              onChange={(e) => setSelectedActionId(e.target.value)}
                              className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                            >
                              {actionGroups.map((group) => (
                                <optgroup key={group.label} label={group.label}>
                                  {group.actions.map((action) => (
                                    <option key={action.id} value={action.id}>{action.label}</option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
                          </div>
                        </label>

                        {selectedAction?.fields?.length ? (
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                             {selectedAction.fields.map((field) => (
                               <label key={field.key} className="flex flex-col gap-1 text-xs">
                                 <span className="text-[10px] font-semibold uppercase text-slate-500">{field.label}</span>
                                 <input
                                   value={actionForm[field.key] || ''}
                                   onChange={(event) => setActionForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                                   className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs dark:bg-slate-950"
                                   placeholder={field.label}
                                 />
                               </label>
                             ))}
                          </div>
                        ) : (
                          <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
                            <div className="flex items-center gap-3">
                              <div className="rounded-2xl bg-sky-500/10 p-2 text-sky-500 dark:text-sky-300">
                                {selectedAction?.icon ? <selectedAction.icon className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedAction?.label}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">No parameters required.</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <button 
                          onClick={() => runAction(selectedAction)}
                          disabled={actionBusy === selectedAction?.id}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 px-4 py-3 font-semibold text-white shadow-[0_20px_60px_-18px_rgba(14,165,233,0.9)] transition hover:-translate-y-0.5"
                        >
                          {actionBusy === selectedAction?.id ? 'Running...' : 'Run action'}
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 xl:grid-cols-3">
                    <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 xl:col-span-2">
                      <SectionTitle
                        title="Active Users"
                        subtitle="Last 14 days unique logins"
                        icon={Users}
                      />
                      <div className="h-[320px]">
                        {loading ? (
                          <SkeletonChart height={320} />
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activeUsersTrend}>
                              <defs>
                                <linearGradient id="activeUsersFill" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.14} />
                              <XAxis dataKey="day" tickLine={false} axisLine={false} />
                              <YAxis tickLine={false} axisLine={false} />
                              <Tooltip />
                              <Area type="monotone" dataKey="count" stroke="#0ea5e9" fill="url(#activeUsersFill)" strokeWidth={3} />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                      <SectionTitle
                        title="Contract Status"
                        subtitle="Signed vs pending vs disputes"
                        icon={ShieldCheck}
                      />
                      <div className="h-[320px]">
                        {loading ? (
                          <SkeletonChart height={320} />
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={contractStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={72}
                                outerRadius={110}
                                paddingAngle={4}
                                dataKey="value"
                              >
                                {contractStatusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={piePalette[index % piePalette.length]} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: adminDark ? '#020617' : '#ffffff',
                                  border: 'none',
                                  borderRadius: '16px',
                                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)'
                                }}
                              />
                              <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 xl:grid-cols-2">
                    <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                      <SectionTitle
                        title="Buyer Requests"
                        subtitle="Demand flow over time"
                        icon={Search}
                      />
                      <div className="h-[280px]">
                        {loading ? (
                          <SkeletonChart height={280} />
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={buyerRequestTrend}>
                              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.14} />
                              <XAxis dataKey="day" tickLine={false} axisLine={false} />
                              <YAxis tickLine={false} axisLine={false} />
                              <Tooltip />
                              <Area type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                      <SectionTitle
                        title="Infra Overview"
                        subtitle="CPU, memory, and network stability in one view"
                        icon={Cpu}
                      />
                      <div className="h-[280px]">
                        {loading ? (
                          <SkeletonChart height={280} />
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { label: "CPU", value: infra?.cpu?.usage_percent ?? (infra?.cpu?.load_1m || 0) },
                              { label: "Memory", value: infra?.memory?.used_bytes ? Math.round((infra.memory.used_bytes / infra.memory.total_bytes) * 100) : 0 },
                              { label: "Devices", value: network?.device_total || 0 },
                              { label: "Alerts", value: network?.alert_count || 0 },
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.14} />
                              <XAxis dataKey="label" tickLine={false} axisLine={false} />
                              <YAxis tickLine={false} axisLine={false} />
                              <Tooltip />
                              <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                                {[
                                  "#38bdf8",
                                  "#60a5fa",
                                  "#0ea5e9",
                                  "#93c5fd",
                                ].map((fill) => (
                                  <Cell key={fill} fill={fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                    <SectionTitle
                      title="Premium Capability Matrix"
                      subtitle="Buyer, Factory, and Buying House premium feature sets"
                      icon={Sparkles}
                    />
                    <div className="grid gap-4 xl:grid-cols-3">
                      <BenefitCard title="Buyer (Premium)" items={buyerBenefits} />
                      <BenefitCard title="Factory (Premium)" items={factoryBenefits} />
                      <BenefitCard title="Buying House (Premium)" items={buyingHouseBenefits} />
                    </div>
                  </div>
                </>
              ) : null}

              {activeCategory !== 'home' ? (
                <>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">

          <section className="space-y-4">
            <div className="admin-card admin-sweep rounded-3xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CategoryIcon className="h-5 w-5 text-orange-200/80" />
                  <div>
                    <p className="text-sm font-bold">{activeData?.label || 'Module'}</p>
                    <p className="text-xs text-slate-500">{activeData?.sections?.length || 0} sections</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold${statusBadge('live')}`}>live</span>
              </div>
            </div>

            {activeCategory === 'platform' ? (
              <div className="admin-card admin-sweep rounded-3xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">User Management</p>
                    <p className="text-xs text-slate-500">Search users and apply role, verification, plan, or trust controls.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={userQuery}
                      onChange={(event) => setUserQuery(event.target.value)}
                      className="w-56 rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs dark:bg-slate-950"
                      placeholder="Search name/email/role"
                    />
                    <button
                      type="button"
                      onClick={() => exportEmailsCsv(users)}
                      className="rounded-full shadow-borderless dark:shadow-borderlessDark bg-black/40 px-3 py-2 text-xs font-semibold text-orange-100 hover:bg-[#13171E]"
                    >
                      Export CSV
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs dark:bg-slate-950"
                  >
                    <option value="all">All roles</option>
                    <option value="buyer">buyer</option>
                    <option value="factory">factory</option>
                    <option value="buying_house">buying_house</option>
                    <option value="agent">agent</option>
                    <option value="admin">admin</option>
                    <option value="owner">owner</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs dark:bg-slate-950"
                  >
                    <option value="all">All statuses</option>
                    <option value="active">active</option>
                    <option value="suspended">suspended</option>
                    <option value="inactive">inactive</option>
                    <option value="banned">banned</option>
                  </select>
                  <select
                    value={verificationFilter}
                    onChange={(event) => setVerificationFilter(event.target.value)}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs dark:bg-slate-950"
                  >
                    <option value="all">All verification</option>
                    <option value="verified">verified</option>
                    <option value="unverified">unverified</option>
                  </select>
                  <select
                    value={premiumFilter}
                    onChange={(event) => setPremiumFilter(event.target.value)}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs dark:bg-slate-950"
                  >
                    <option value="all">All plans</option>
                    <option value="premium">premium</option>
                    <option value="free">free</option>
                  </select>
                  <select
                    value={regionFilter}
                    onChange={(event) => setRegionFilter(event.target.value)}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs dark:bg-slate-950"
                  >
                    {regionOptions.map((region) => (
                      <option key={region} value={region}>{region === 'all' ? 'All regions' : region}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 space-y-3">
                  {filteredUsers.slice(0, 20).map((u) => {
                    const draft = userDrafts[u.id] || {}
                    const roleValue = draft.role ?? u.role ?? 'buyer'
                    const statusValue = draft.status ?? u.status ?? 'active'
                    const verifiedValue = draft.verified ?? u.verified ?? false
                    const subValue = draft.subscription_status ?? u.subscription_status ?? 'free'
                    const strikeValue = draft.policy_strikes ?? u.policy_strikes ?? 0
                    const fraudValue = draft.fraud_flags ?? (Array.isArray(u.profile?.fraud_flags) ? u.profile.fraud_flags.join(', ') : '')
                    const notesValue = draft.admin_notes ?? u.profile?.admin_notes ?? ''
                    const mfaSetupCode = draft.mfa_setup_code ?? u.profile?.mfa_setup_code ?? ''
                    const stepupSetupCode = draft.stepup_setup_code ?? u.profile?.stepup_setup_code ?? ''

                    return (
                      <div key={u.id} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{u.name || 'Unnamed'} ({u.email || 'no email'})</p>
                            <p className="text-[11px] text-slate-500">Role: {u.role} / Status: {u.status} / Verified: {String(u.verified)} / Plan: {u.subscription_status || 'free'}</p>
                            <p className="text-[11px] text-slate-400">
                              Created: {u.created_at ? new Date(u.created_at).toLocaleString() : '--'}
                              {' '}| Country: {u.profile?.country || 'N/A'}
                              {u.org_owner_id ? ` | Org owner: ${u.org_owner_id}` : ''}
                              {u.member_id ? ` | Agent ID: ${u.member_id}` : ''}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => forceLogout(u.id)}
                              className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                            >
                              Force logout
                            </button>
                            <button
                              type="button"
                              onClick={() => resetPassword(u.id)}
                              className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                            >
                              Reset password
                            </button>
                            <button
                              type="button"
                              onClick={() => lockMessaging(u.id, 24)}
                              className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                            >
                              Lock messaging 24h
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase text-slate-500">Role</span>
                            <select
                              value={roleValue}
                              onChange={(event) => updateDraft(u.id, 'role', event.target.value)}
                              className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                            >
                              <option value="buyer">buyer</option>
                              <option value="factory">factory</option>
                              <option value="buying_house">buying_house</option>
                              <option value="agent">agent</option>
                              <option value="admin">admin</option>
                              <option value="owner">owner</option>
                            </select>
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase text-slate-500">Status</span>
                            <select
                              value={statusValue}
                              onChange={(event) => updateDraft(u.id, 'status', event.target.value)}
                              className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                            >
                              <option value="active">active</option>
                              <option value="suspended">suspended</option>
                            </select>
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase text-slate-500">Verified</span>
                            <select
                              value={String(verifiedValue)}
                              onChange={(event) => updateDraft(u.id, 'verified', event.target.value === 'true')}
                              className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                            >
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase text-slate-500">Plan</span>
                            <select
                              value={subValue}
                              onChange={(event) => updateDraft(u.id, 'subscription_status', event.target.value)}
                              className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                            >
                              <option value="free">free</option>
                              <option value="premium">premium</option>
                            </select>
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase text-slate-500">Strikes</span>
                            <input
                              type="number"
                              min="0"
                              value={strikeValue}
                              onChange={(event) => updateDraft(u.id, 'policy_strikes', Number(event.target.value))}
                              className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase text-slate-500">Fraud flags</span>
                            <input
                              value={fraudValue}
                              onChange={(event) => updateDraft(u.id, 'fraud_flags', event.target.value)}
                              className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                              placeholder="flag1, flag2"
                            />
                          </label>
                        </div>
                        <label className="mt-3 flex flex-col gap-1">
                          <span className="text-[10px] font-semibold uppercase text-slate-500">Admin notes</span>
                          <textarea
                            rows="2"
                            value={notesValue}
                            onChange={(event) => updateDraft(u.id, 'admin_notes', event.target.value)}
                            className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                            placeholder="Internal notes visible to admins only"
                          />
                        </label>
                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase text-slate-500">MFA setup code</span>
                            <input
                              value={mfaSetupCode}
                              onChange={(event) => updateDraft(u.id, 'mfa_setup_code', event.target.value)}
                              className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                              placeholder="Per-account MFA setup code"
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase text-slate-500">Step-up setup code</span>
                            <input
                              value={stepupSetupCode}
                              onChange={(event) => updateDraft(u.id, 'stepup_setup_code', event.target.value)}
                              className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                              placeholder="Per-account step-up setup code"
                            />
                          </label>
                        </div>
                        <div className="mt-3 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => saveUserEdits(u.id)}
                            className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
                          >
                            Save changes
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  {!loading && filteredUsers.length === 0 ? <p className="text-xs text-slate-500">No users match the filter.</p> : null}
                </div>
              </div>
            ) : null}

            {activeCategory === 'platform' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Signup + Email Export</p>
                      <p className="text-xs text-slate-500">Live signup feed with CSV exports.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshSignups()}
                      className="rounded-full shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => downloadCsv('/admin/emails/export', 'gartexhub_emails.csv').catch((err) => setError(err.message || 'Export failed'))}
                      className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white"
                    >
                      Download email CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadCsv('/admin/exports/run?dataset=users&format=csv', 'users.csv').catch((err) => setError(err.message || 'Export failed'))}
                      className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Export users CSV
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {signups.slice(0, 4).map((row) => (
                      <div key={row.id} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-2 py-1">
                        {row.name || row.email || row.id} · {row.role || 'role'} · {row.created_at ? new Date(row.created_at).toLocaleDateString() : '--'}
                      </div>
                    ))}
                    {signups.length === 0 ? <div className="text-[11px] text-slate-400">No signups yet.</div> : null}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Fraud Review</p>
                      <p className="text-xs text-slate-500">Flagged verification records + duplicates.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshFraudReview()}
                      className="rounded-full shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500">Duplicates detected: {fraudReview.duplicates?.length || 0}</div>
                  <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {fraudReview.items.slice(0, 4).map((row) => (
                      <div key={row.user_id || row.id} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-2 py-1">
                        {row.company_name || row.user_id} · Flag: {row.fraud_flag ? 'Yes' : 'No'}
                      </div>
                    ))}
                    {fraudReview.items.length === 0 ? <div className="text-[11px] text-slate-400">No fraud flags.</div> : null}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Strike History</p>
                      <p className="text-xs text-slate-500">Audit of policy violations & escalations.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshStrikeHistory()}
                      className="rounded-full shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {strikeHistory.slice(0, 4).map((row) => (
                      <div key={row.id} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-2 py-1">
                        {row.user?.name || row.actor_id} · {row.reason} · Strikes {row.strikes}
                      </div>
                    ))}
                    {strikeHistory.length === 0 ? <div className="text-[11px] text-slate-400">No strikes yet.</div> : null}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Org Ownership</p>
                      <p className="text-xs text-slate-500">Live org registry + staff limits.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshOrgOwnership()}
                      className="rounded-full shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(orgOwnership.orgs || []).slice(0, 4).map((org) => (
                      <div key={org.org_owner_id} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-2 py-1">
                        {org.org_name} · Staff {org.staff_count}/{org.staff_limit}
                      </div>
                    ))}
                    {(orgOwnership.orgs || []).length === 0 ? <div className="text-[11px] text-slate-400">No orgs found.</div> : null}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Wallet Ledger</p>
                      <p className="text-xs text-slate-500">Unified credits, debits, and refunds.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshWalletLedger()}
                      className="rounded-full shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {walletLedger.slice(0, 4).map((row) => (
                      <div key={row.id || row.created_at} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-2 py-1">
                        {row.entry_type || row.type} · ${row.amount_usd || 0} · {row.reason || row.note || '--'}
                      </div>
                    ))}
                    {walletLedger.length === 0 ? <div className="text-[11px] text-slate-400">No ledger entries.</div> : null}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Email Segments</p>
                      <p className="text-xs text-slate-500">Targeted lists with CSV export.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshCatalog()}
                      className="rounded-full shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(catalog?.emails?.segments || []).slice(0, 4).map((segment) => (
                      <div key={segment.id} className="flex items-center justify-between rounded-xl shadow-borderless dark:shadow-borderlessDark px-2 py-1">
                        <span>{segment.name || segment.id}</span>
                        <button
                          type="button"
                          onClick={() => downloadCsv(`/admin/emails/segments/export?segment_id=${encodeURIComponent(segment.id)}`, `segment_${segment.id}.csv`).catch((err) => setError(err.message || 'Export failed'))}
                          className="rounded-full shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-[10px] font-semibold text-slate-600"
                        >
                          Export
                        </button>
                      </div>
                    ))}
                    {(catalog?.emails?.segments || []).length === 0 ? <div className="text-[11px] text-slate-400">No segments yet.</div> : null}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Featured Listings</p>
                      <p className="text-xs text-slate-500">Control marketplace highlights.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshCatalog()}
                      className="rounded-full shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <select
                      value={featuredForm.entity_type}
                      onChange={(event) => setFeaturedForm((prev) => ({ ...prev, entity_type: event.target.value }))}
                      className="w-full rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                    >
                      <option value="product">Product</option>
                      <option value="request">Buyer request</option>
                    </select>
                    <input
                      value={featuredForm.entity_id}
                      onChange={(event) => setFeaturedForm((prev) => ({ ...prev, entity_id: event.target.value }))}
                      placeholder="Entity ID"
                      className="w-full rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                    />
                    <input
                      value={featuredForm.label}
                      onChange={(event) => setFeaturedForm((prev) => ({ ...prev, label: event.target.value }))}
                      placeholder="Label (optional)"
                      className="w-full rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        await runInlineAdminAction('featured.add', featuredForm)
                        await refreshCatalog()
                        setFeaturedForm((prev) => ({ ...prev, entity_id: '', label: '' }))
                      }}
                      className="w-full rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white"
                    >
                      Add featured
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(catalog?.featured?.listings || []).slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-xl shadow-borderless dark:shadow-borderlessDark px-2 py-1">
                        <span>{item.title} · {item.entity_type}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            await runInlineAdminAction('featured.remove', { listing_id: item.id })
                            await refreshCatalog()
                          }}
                          className="rounded-full shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-[10px] font-semibold text-slate-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {(catalog?.featured?.listings || []).length === 0 ? <div className="text-[11px] text-slate-400">No featured listings.</div> : null}
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'platform' ? (
              <div className="admin-card admin-sweep rounded-3xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">Verification Queue</p>
                    <p className="text-xs text-slate-500">Review compliance documents, duplicates, and credibility scores.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => refreshVerificationQueue()}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh queue
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  {verificationQueue.slice(0, 20).map((row) => (
                    <details key={row.user_id} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{row.user?.name || row.user_id}</p>
                          <p className="text-[11px] text-slate-500">
                            {row.user?.email || 'no email'} · {row.user?.role || 'role'} · Status: {row.review_status}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                            Credibility {row.credibility?.score ?? '--'}
                          </span>
                          {row.expiring_soon ? (
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">Expiring</span>
                          ) : null}
                        </div>
                      </summary>
                      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_1fr]">
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold uppercase text-slate-500">Required Checklist</p>
                          <div className="flex flex-wrap gap-2">
                            {row.required_checklist?.map((item) => (
                              <span key={item.key} className={`rounded-full px-2 py-1 text-[10px] font-semibold${item.submitted ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {item.label}
                              </span>
                            ))}
                          </div>
                          {row.duplicate_flags?.length ? (
                            <div className="mt-2 text-[11px] text-rose-600">
                              Possible duplicates: {row.duplicate_flags.map((flag) => `${flag.field}`).join(', ')}
                            </div>
                          ) : null}
                          <div className="mt-2 text-[11px] text-slate-500">
                            Subscription remaining: {row.subscription_remaining_days ?? '--'} days
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold uppercase text-slate-500">Documents</p>
                          <div className="space-y-1">
                            {row.uploaded_documents?.length ? row.uploaded_documents.map((doc) => (
                              <a key={doc.id} href={doc.public_url || '#'} className="block truncate text-[11px] text-indigo-600">
                                {doc.type || 'document'} {doc.public_url ? 'view' : ''}
                              </a>
                            )) : <p className="text-[11px] text-slate-400">No uploaded documents.</p>}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            await runInlineAdminAction('verification.approve', { user_id: row.user_id })
                            await refreshVerificationQueue()
                          }}
                          className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const reason = window.prompt('Reject reason?') || 'rejected_by_admin'
                            await runInlineAdminAction('verification.reject', { user_id: row.user_id, reason })
                            await refreshVerificationQueue()
                          }}
                          className="rounded-full bg-rose-600 px-3 py-1 text-[11px] font-semibold text-white"
                        >
                          Reject
                        </button>
                      </div>
                    </details>
                  ))}
                  {verificationQueue.length === 0 ? (
                    <p className="text-xs text-slate-500">{emptyCopy('verification.pending.short', 'No pending verifications.')}</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {activeCategory === 'platform' ? (
              <div className="admin-card admin-sweep rounded-3xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">Contracts Vault</p>
                    <p className="text-xs text-slate-500">Lifecycle, signatures, payment proofs, and disputes.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => refreshContractsVault()}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh contracts
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  {contractsVault.slice(0, 12).map((contract) => {
                    const proofs = paymentProofs.filter((proof) => String(proof.contract_id) === String(contract.id))
                    return (
                      <details key={contract.id} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{contract.title || 'Contract'}</p>
                            <p className="text-[11px] text-slate-500">
                              {contract.contract_number || contract.id} · {contract.lifecycle_status || contract.status}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">Buyer: {contract.buyer_signature_state}</span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">Factory: {contract.factory_signature_state}</span>
                          </div>
                        </summary>
                        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_1fr]">
                          <div className="space-y-1 text-[11px]">
                            <p>Buyer: {contract.buyer_name || contract.buyer_id || 'N/A'}</p>
                            <p>Factory: {contract.factory_name || contract.factory_id || 'N/A'}</p>
                            <p>Status: {contract.lifecycle_status || 'unknown'}</p>
                            {contract.artifact?.pdf_path ? (
                              <a href={contract.artifact.pdf_path} className="text-indigo-600">View artifact</a>
                            ) : (
                              <p className="text-slate-400">No artifact generated</p>
                            )}
                          </div>
                          <div className="space-y-1 text-[11px]">
                            <p className="text-[10px] font-semibold uppercase text-slate-500">Payment Proofs</p>
                            {proofs.length ? proofs.map((proof) => (
                              <div key={proof.id} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-2 py-1">
                                {proof.type} ? {proof.status} ? {proof.amount || '--'} {proof.currency || ''}{proof.lc_type ? ` ? ${String(proof.lc_type).toUpperCase()}${proof.lc_type === 'usance' && proof.usance_days ? ` (${proof.usance_days}d)` : ''}` : ''}
                              </div>
                            )) : <p className="text-slate-400">No payment proofs.</p>}
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              await runInlineAdminAction('contract.lock', { contract_id: contract.id })
                              await refreshContractsVault()
                            }}
                            className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white"
                          >
                            Lock
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await runInlineAdminAction('contract.unlock', { contract_id: contract.id })
                              await refreshContractsVault()
                            }}
                            className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                          >
                            Unlock
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await runInlineAdminAction('contract.archive', { contract_id: contract.id })
                              await refreshContractsVault()
                            }}
                            className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                          >
                            Archive
                          </button>
                        </div>
                      </details>
                    )
                  })}
                  {contractsVault.length === 0 ? <p className="text-xs text-slate-500">No contracts available.</p> : null}
                </div>
              </div>
            ) : null}

            {activeCategory === 'platform' ? (
              <div className="admin-card admin-sweep rounded-3xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">Disputes</p>
                    <p className="text-xs text-slate-500">Review and resolve contract disputes.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => refreshDisputes()}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh disputes
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  {disputes.slice(0, 12).map((dispute) => (
                    <div key={dispute.id} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{dispute.entity_id}</p>
                          <p className="text-[11px] text-slate-500">{dispute.reason}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{dispute.status}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            const resolutionAction = window.prompt('Resolution action?') || 'resolved'
                            const resolutionNote = window.prompt('Resolution note?') || ''
                            await runInlineAdminAction('dispute.resolve', { report_id: dispute.id, resolution_action: resolutionAction, resolution_note: resolutionNote })
                            await refreshDisputes()
                          }}
                          className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))}
                  {disputes.length === 0 ? <p className="text-xs text-slate-500">No disputes found.</p> : null}
                </div>
              </div>
            ) : null}

              {activeCategory === 'platform' ? (
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">Product Moderation Queue</p>
                    <p className="text-xs text-slate-500">Pending review and rejected product listings.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => refreshModerationQueues()}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh queue
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Pending Review</p>
                    <div className="mt-2 space-y-2">
                      {moderationPending.slice(0, 6).map((row) => (
                        <div key={row.id} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2">
                          <p className="text-sm font-semibold text-slate-900">{row.title || 'Product'}</p>
                          <p className="text-[11px] text-slate-500">Owner: {row.owner?.name || row.company_id}</p>
                          <p className="text-[11px] text-slate-500">{row.content_review_reason || 'Pending review'}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                await apiRequest(`/admin/moderation/products/${encodeURIComponent(row.id)}`, {
                                  method: 'PATCH',
                                  token: getToken(),
                                  headers: buildAdminHeaders({ stepUp: true }),
                                  body: { status: 'approved' },
                                })
                                await refreshModerationQueues()
                              }}
                              className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const reason = window.prompt('Reject reason (neutral language):') || ''
                                await apiRequest(`/admin/moderation/products/${encodeURIComponent(row.id)}`, {
                                  method: 'PATCH',
                                  token: getToken(),
                                  headers: buildAdminHeaders({ stepUp: true }),
                                  body: { status: 'rejected', reason },
                                })
                                await refreshModerationQueues()
                              }}
                              className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                      {!moderationPending.length ? <p className="text-[11px] text-slate-500">No pending products.</p> : null}
                    </div>
                  </div>
                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Rejected</p>
                    <div className="mt-2 space-y-2">
                      {moderationRejected.slice(0, 6).map((row) => (
                        <div key={row.id} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2">
                          <p className="text-sm font-semibold text-slate-900">{row.title || 'Product'}</p>
                          <p className="text-[11px] text-slate-500">Owner: {row.owner?.name || row.company_id}</p>
                          <p className="text-[11px] text-slate-500">{row.content_review_reason || 'Rejected'}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                await apiRequest(`/admin/moderation/products/${encodeURIComponent(row.id)}`, {
                                  method: 'PATCH',
                                  token: getToken(),
                                  headers: buildAdminHeaders({ stepUp: true }),
                                  body: { status: 'approved' },
                                })
                                await refreshModerationQueues()
                              }}
                              className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white"
                            >
                              Restore
                            </button>
                          </div>
                        </div>
                      ))}
                      {!moderationRejected.length ? <p className="text-[11px] text-slate-500">No rejected products.</p> : null}
                    </div>
                  </div>
                  </div>
                </div>
              ) : null}



              {activeCategory === 'platform' ? (
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">Communication Policy Queue Inspector</p>
                      <p className="text-xs text-slate-500">Inspect queued messages, mark false positives, and adjust sender reputation.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshMessagePolicyOps()}
                      className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-semibold text-slate-600"
                    >
                      Refresh policy queue
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3 text-xs">
                    <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 lg:col-span-2">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Queued Items</p>
                      <div className="mt-2 space-y-2">
                        {policyQueueItems.slice(0, 8).map((row) => (
                          <div key={row.id} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2">
                            <p className="text-[11px] text-slate-500">{row.match_id} · {row.sender_id}</p>
                            <p className="text-sm font-semibold text-slate-900">{row.queue_priority_label || row.queue_rank} ({row.queue_score})</p>
                            <p className="text-[11px] text-slate-500">Reason: {row.policy_reason}</p>
                          </div>
                        ))}
                        {!policyQueueItems.length ? <p className="text-[11px] text-slate-500">No queued policy items.</p> : null}
                      </div>
                    </div>
                    <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Metrics</p>
                      <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                        <p>Blocked rate: {Number(policyMetrics?.policy_metrics?.blocked_rate || 0).toFixed(4)}</p>
                        <p>Queue→Sent: {Number(policyMetrics?.policy_metrics?.queued_to_sent_conversion || 0).toFixed(4)}</p>
                        <p>False-positive ratio: {Number(policyMetrics?.policy_metrics?.spam_false_positive_ratio || 0).toFixed(4)}</p>
                      </div>
                      <p className="mt-3 text-[11px] font-semibold uppercase text-slate-500">Sender reputation adjustment</p>
                      <div className="mt-2 flex flex-col gap-2">
                        <input className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2" placeholder="Sender ID" value={reputationSenderId} onChange={(e) => setReputationSenderId(e.target.value)} />
                        <input className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2" placeholder="Delta (e.g., -5 or 4)" value={reputationDelta} onChange={(e) => setReputationDelta(e.target.value)} />
                        <button
                          type="button"
                          onClick={async () => {
                            if (!reputationSenderId.trim()) return
                            await apiRequest(`/messages/policy/reputation/${encodeURIComponent(reputationSenderId.trim())}/adjust`, {
                              method: 'POST',
                              token: getToken(),
                              headers: buildAdminHeaders({ stepUp: true }),
                              body: { delta: Number(reputationDelta || 0), notes: 'Admin panel adjustment' },
                            })
                            await refreshMessagePolicyOps()
                          }}
                          className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white"
                        >
                          Apply adjustment
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">False-positive override candidates</p>
                    <div className="mt-2 space-y-2">
                      {policyReviewRows.slice(0, 6).map((row) => (
                        <div key={row.id} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2">
                          <p className="text-[11px] text-slate-500">{row.sender_id} · {row.action} · spam {Number(row.spam_score || 0).toFixed(3)}</p>
                          <button
                            type="button"
                            onClick={async () => {
                              await apiRequest(`/messages/policy/review-queue/${encodeURIComponent(row.id)}/false-positive`, {
                                method: 'POST',
                                token: getToken(),
                                headers: buildAdminHeaders({ stepUp: true }),
                                body: { notes: 'Admin override: false positive' },
                              })
                              await refreshMessagePolicyOps()
                            }}
                            className="mt-1 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white"
                          >
                            Mark false-positive
                          </button>
                        </div>
                      ))}
                      {!policyReviewRows.length ? <p className="text-[11px] text-slate-500">No candidates.</p> : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeCategory === 'platform' ? (
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">Clothing Moderation Rules</p>
                      <p className="text-xs text-slate-500">Edit moderation terms and neutral reason templates (no halal/haram language).</p>
                    </div>
                    <button
                      type="button"
                      onClick={saveClothingRules}
                      disabled={clothingRulesBusy}
                      className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {clothingRulesBusy ? 'Saving...' : 'Save rules'}
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 text-xs">
                    <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Forbidden Terms (Auto Reject)</p>
                      <textarea
                        rows={6}
                        value={clothingRulesForm.forbidden_terms}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, forbidden_terms: e.target.value }))}
                        placeholder="One term per line"
                        className="mt-2 w-full rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Flag Terms (Pending Review)</p>
                      <textarea
                        rows={6}
                        value={clothingRulesForm.flag_terms}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, flag_terms: e.target.value }))}
                        placeholder="One term per line"
                        className="mt-2 w-full rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Allowed Terms (Safe Signal)</p>
                      <textarea
                        rows={6}
                        value={clothingRulesForm.allowed_terms}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, allowed_terms: e.target.value }))}
                        placeholder="One term per line"
                        className="mt-2 w-full rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Context Exceptions</p>
                      <textarea
                        rows={6}
                        value={clothingRulesForm.context_exceptions}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, context_exceptions: e.target.value }))}
                        placeholder="e.g., innerwear, lining, undershirt"
                        className="mt-2 w-full rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 text-xs">
                    <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Rejected Reason</p>
                      <textarea
                        rows={4}
                        value={clothingRulesForm.reason_rejected}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, reason_rejected: e.target.value }))}
                        className="mt-2 w-full rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Pending Review Reason</p>
                      <textarea
                        rows={4}
                        value={clothingRulesForm.reason_pending}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, reason_pending: e.target.value }))}
                        className="mt-2 w-full rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Fix Guidance</p>
                      <textarea
                        rows={4}
                        value={clothingRulesForm.reason_fix}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, reason_fix: e.target.value }))}
                        className="mt-2 w-full rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                  {clothingRulesError ? <p className="mt-3 text-xs text-rose-600">{clothingRulesError}</p> : null}
                  {clothingRulesNotice ? <p className="mt-3 text-xs text-emerald-700">{clothingRulesNotice}</p> : null}
                </div>
              ) : null}

              {activeCategory === 'platform' ? (
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">Report Queues</p>
                    <p className="text-xs text-slate-500">System/support, product appeals, and public content reports.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => refreshReportQueues()}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh reports
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 text-xs">
                  {[{ title: 'System & Support', items: systemReports }, { title: 'Product Appeals', items: productAppealReports }, { title: 'Content Reports', items: contentReports }].map((group) => (
                    <div key={group.title} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">{group.title}</p>
                      <div className="mt-2 space-y-2">
                        {group.items.slice(0, 6).map((row) => (
                          <div key={row.id} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2">
                            <p className="text-sm font-semibold text-slate-900">{row.reason || 'Report'}</p>
                            <p className="text-[11px] text-slate-500">{row.entity_id}</p>
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => resolveReportAdmin(row.id, 'reviewed')}
                                className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                              >
                                Mark reviewed
                              </button>
                            </div>
                          </div>
                        ))}
                        {!group.items.length ? <p className="text-[11px] text-slate-500">No reports.</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeCategory === 'platform' ? (
              <div className="admin-card admin-sweep rounded-3xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">Support Queue</p>
                    <p className="text-xs text-slate-500">Dedicated support tickets with SLA tracking.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => refreshSupportTickets()}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh tickets
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-xs text-slate-600 sm:grid-cols-4">
                  <select
                    value={supportFilters.status}
                    onChange={(event) => setSupportFilters((prev) => ({ ...prev, status: event.target.value }))}
                    className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs"
                  >
                    <option value="all">All status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <select
                    value={supportFilters.priority}
                    onChange={(event) => setSupportFilters((prev) => ({ ...prev, priority: event.target.value }))}
                    className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs"
                  >
                    <option value="all">All priority</option>
                    <option value="standard">Standard</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="priority">Priority</option>
                  </select>
                  <input
                    value={supportFilters.assigned_to}
                    onChange={(event) => setSupportFilters((prev) => ({ ...prev, assigned_to: event.target.value }))}
                    placeholder="Assigned user ID"
                    className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => refreshSupportTickets()}
                    className="rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white"
                  >
                    Apply filters
                  </button>
                </div>

                <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  {supportLoading ? <p className="text-xs text-slate-500">Loading tickets...</p> : null}
                  {!supportLoading && supportTickets.length === 0 ? <p className="text-xs text-slate-500">No support tickets.</p> : null}
                  {supportTickets.slice(0, 15).map((ticket) => (
                    <div key={ticket.id} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{ticket.subject || 'Support ticket'}</p>
                          <p className="text-[11px] text-slate-500">
                            User: {ticket.user?.name || ticket.user_id} - {ticket.user?.email || 'no email'}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Status: {ticket.status || 'open'} - Priority: {ticket.priority || 'standard'}
                          </p>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          SLA: {ticket.sla_response_due_at ? new Date(ticket.sla_response_due_at).toLocaleString() : '--'} /
                          {ticket.sla_resolution_due_at ? new Date(ticket.sla_resolution_due_at).toLocaleString() : '--'}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => assignSupportTicketAdmin(ticket.id)}
                          className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Assign
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSupportTicketAdmin(ticket.id, { status: 'in_progress' })}
                          className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Mark in progress
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSupportTicketAdmin(ticket.id, { status: 'resolved' })}
                          className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white"
                        >
                          Resolve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSupportTicketAdmin(ticket.id, { priority: 'priority' })}
                          className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Escalate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeCategory === 'platform' ? (
              <div className="admin-card admin-sweep rounded-3xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">Partner Requests</p>
                    <p className="text-xs text-slate-500">Force accept/reject/cancel and monitor factory connections.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => refreshPartnerRequests()}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh requests
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  {partnerRequests.slice(0, 12).map((request) => (
                    <div key={request.id} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{request.requester_id || request.buyer_id}</p>
                          <p className="text-[11px] text-slate-500">Factory: {request.factory_id || request.receiver_id}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{request.status}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            await runInlineAdminAction('partner.force_accept', { request_id: request.id })
                            await refreshPartnerRequests()
                          }}
                          className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white"
                        >
                          Force accept
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await runInlineAdminAction('partner.force_reject', { request_id: request.id })
                            await refreshPartnerRequests()
                          }}
                          className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Force reject
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await runInlineAdminAction('partner.force_cancel', { request_id: request.id })
                            await refreshPartnerRequests()
                          }}
                          className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Force cancel
                        </button>
                      </div>
                    </div>
                  ))}
                  {partnerRequests.length === 0 ? <p className="text-xs text-slate-500">No partner requests.</p> : null}
                </div>
              </div>
            ) : null}

            {activeCategory === 'platform' ? (
              <div className="admin-card admin-sweep rounded-3xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">Platform Master Lists</p>
                    <p className="text-xs text-slate-500">Every remaining platform module with live list/detail previews.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => refreshCatalog()}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh catalog
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Org Directory + Staff Limits</p>
                    <div className="mt-2 space-y-2">
                      {(catalog?.orgs?.list || []).slice(0, 4).map((org) => (
                        <div key={org.org_owner_id} className="flex items-center justify-between">
                          <span>{org.org_name} · {org.role}</span>
                          <span className="font-semibold">Staff {org.staff_count}/{org.staff_limit}</span>
                        </div>
                      ))}
                      {(catalog?.orgs?.staff_list || []).slice(0, 2).map((staff) => (
                        <div key={staff.id} className="text-[11px] text-slate-500">Staff: {staff.name || staff.id} · {staff.role}</div>
                      ))}
                      {(catalog?.orgs?.buying_house_staff_ids || []).slice(0, 2).map((row) => (
                        <div key={row.id} className="text-[11px] text-slate-500">Buying house staff: {row.staff_id}</div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Verification Compliance</p>
                    <div className="mt-2 space-y-2">
                      {(catalog?.verification?.docs_queue || []).slice(0, 3).map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between">
                          <span>{doc.user_id || doc.owner_id} · {doc.status}</span>
                          <span className="text-[10px] text-slate-500">{doc.type || 'doc'}</span>
                        </div>
                      ))}
                      {(catalog?.verification?.badge_audit || []).slice(0, 2).map((entry) => (
                        <div key={entry.id} className="text-[11px] text-slate-500">Badge {entry.action} · {entry.user_id}</div>
                      ))}
                      <div className="text-[11px] text-slate-500">Fraud flags: {(catalog?.verification?.fraud_flags || []).length}</div>
                      {(catalog?.verification?.duplicates || []).slice(0, 1).map((dup) => (
                        <div key={`${dup.field}:${dup.value}`} className="text-[11px] text-rose-500">Duplicate {dup.field}: {dup.value}</div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Finance Ledgers</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Failed renewals: {(catalog?.finance?.failed_renewals || []).length}</div>
                      <div className="text-[11px] text-slate-500">History entries: {(catalog?.finance?.upgrade_history || []).length}</div>
                      {(catalog?.finance?.revenue_summary || []).slice(0, 1).map((row) => (
                        <div key={row.plan} className="text-[11px] text-slate-500">Plan {row.plan}: {row.subscribers} subs</div>
                      ))}
                      {(catalog?.finance?.invoices || []).slice(0, 2).map((row) => (
                        <div key={row.id} className="flex items-center justify-between">
                          <span>Invoice {row.user_id}</span>
                          <span>${row.amount_usd}</span>
                        </div>
                      ))}
                      {(catalog?.finance?.payouts || []).slice(0, 2).map((row) => (
                        <div key={row.id} className="flex items-center justify-between">
                          <span>Payout {row.user_id}</span>
                          <span>${row.amount_usd}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Wallet + Coupons</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Transactions: {(catalog?.wallet?.ledger || []).length}</div>
                      <div className="text-[11px] text-slate-500">Redemptions: {(catalog?.wallet?.redemptions || []).length}</div>
                      {(catalog?.wallet?.ledger || []).slice(0, 1).map((row) => (
                        <div key={row.id} className="text-[11px] text-slate-500">Txn {row.user_id} · ${row.amount_usd}</div>
                      ))}
                      {(catalog?.wallet?.redemptions || []).slice(0, 1).map((row) => (
                        <div key={row.id} className="text-[11px] text-slate-500">Redeem {row.user_id} · ${row.amount_usd}</div>
                      ))}
                      {(catalog?.coupons?.campaigns || []).slice(0, 2).map((row) => (
                        <div key={row.id} className="text-[11px] text-slate-500">Campaign {row.name} · {row.status}</div>
                      ))}
                      {(couponReport?.campaigns || []).slice(0, 2).map((row) => (
                        <div key={row.campaign} className="text-[11px] text-slate-500">
                          Perf {row.campaign} · {row.redemption_count} reds · ${row.redeemed_total_usd}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Partner Network</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Requests: {(catalog?.partners?.requests || []).length}</div>
                      <div className="text-[11px] text-slate-500">Connected: {(catalog?.partners?.connected_factories || []).length}</div>
                      <div className="text-[11px] text-slate-500">Free-tier limit: {catalog?.partners?.free_tier_limit}</div>
                      <div className="text-[11px] text-slate-500">Overrides: {(catalog?.partners?.overrides || []).length}</div>
                      {(catalog?.partners?.connected_factories || []).slice(0, 1).map((row) => (
                        <div key={row.id || row.requester_id} className="text-[11px] text-slate-500">Factory: {row.factory_id || row.target_id}</div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Requests + Matching</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Requests: {(catalog?.requests?.list || []).length}</div>
                      <div className="text-[11px] text-slate-500">Matches: {(catalog?.requests?.matches || []).length}</div>
                      <div className="text-[11px] text-slate-500">Spam filters: {(catalog?.requests?.spam_filters || []).length}</div>
                      <div className="text-[11px] text-slate-500">Match quality entries: {(catalog?.requests?.match_quality || []).length}</div>
                      {(catalog?.requests?.spam_filters || []).slice(0, 1).map((row) => (
                        <div key={row.id} className="text-[11px] text-slate-500">Filter: {row.pattern}</div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Contracts + Proofs</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Contracts: {(catalog?.contracts?.vault || []).length}</div>
                      <div className="text-[11px] text-slate-500">Payment proofs: {(catalog?.contracts?.payment_proofs || []).length}</div>
                      <div className="text-[11px] text-slate-500">Audit entries: {(catalog?.contracts?.audit_trail || []).length}</div>
                      {(catalog?.contracts?.audit_trail || []).slice(0, 1).map((row) => (
                        <div key={row.id} className="text-[11px] text-slate-500">Audit {row.action}</div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Calls + Moderation</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Call logs: {(catalog?.calls?.logs || []).length}</div>
                      <div className="text-[11px] text-slate-500">Escalations: {(catalog?.calls?.escalations || []).length}</div>
                      <div className="text-[11px] text-slate-500">Violations: {(catalog?.moderation?.violations || []).length}</div>
                      <div className="text-[11px] text-slate-500">Chat transfers: {(catalog?.moderation?.chat_transfers || []).length}</div>
                      <div className="text-[11px] text-slate-500">Auto spam flags: {(catalog?.moderation?.auto_spam_flags || []).length}</div>
                      {(catalog?.calls?.logs || []).slice(0, 1).map((row) => (
                        <div key={row.id} className="text-[11px] text-slate-500">
                          Call {row.id} · {row.recording_status || 'pending'}{row.failure_reason ? ` (${row.failure_reason})` : ''}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Content Review</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Video queue: {(catalog?.content?.product_videos || []).length}</div>
                      <div className="text-[11px] text-slate-500">Docs: {(catalog?.content?.documents || []).length}</div>
                      <div className="text-[11px] text-slate-500">Flags: {(catalog?.content?.flags || []).length}</div>
                      {(catalog?.content?.documents || []).filter((doc) => String(doc.moderation_status || '').toLowerCase() === 'pending_review').slice(0, 1).map((doc) => (
                        <div key={doc.id} className="text-[11px] text-slate-500">Pending doc {doc.id}</div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Support + Notifications</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Tickets: {(catalog?.support?.tickets || []).length}</div>
                      <div className="text-[11px] text-slate-500">Reports: {(catalog?.support?.reports || []).length}</div>
                      <div className="text-[11px] text-slate-500">SLA: {catalog?.support?.sla_targets?.response_minutes || '--'}m / {catalog?.support?.sla_targets?.resolution_hours || '--'}h</div>
                      <div className="text-[11px] text-slate-500">Templates: {(catalog?.notifications?.templates || []).length}</div>
                      <div className="text-[11px] text-slate-500">Batch sends: {(catalog?.notifications?.batches || []).length}</div>
                      <div className="text-[11px] text-slate-500">Monthly triggers: {(catalog?.notifications?.monthly_triggers || []).length}</div>
                      {(catalog?.support?.tickets || []).slice(0, 1).map((ticket) => (
                        <div key={ticket.id} className="text-[11px] text-slate-500">Ticket {ticket.subject}</div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Analytics + Search</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Funnel: {catalog?.analytics?.funnel?.signup || 0} → {catalog?.analytics?.funnel?.deal || 0}</div>
                      <div className="text-[11px] text-slate-500">Buying house analytics: {(catalog?.analytics?.buying_house || []).length}</div>
                      <div className="text-[11px] text-slate-500">Agent performance: {(catalog?.analytics?.agent_performance || []).length}</div>
                      <div className="text-[11px] text-slate-500">Avg response: {catalog?.analytics?.response_speed?.avg_minutes || 0} min</div>
                      <div className="text-[11px] text-slate-500">Active users (14d): {catalog?.analytics?.active_users?.last_14_days || 0} · Today {catalog?.analytics?.active_users?.last_day || 0}</div>
                      <div className="text-[11px] text-slate-500">Login events (14d): {catalog?.analytics?.login_summary?.total || 0}</div>
                      <div className="text-[11px] text-slate-500">Buyer requests (14d): {catalog?.analytics?.buyer_request_summary?.total || 0}</div>
                      <div className="text-[11px] text-slate-500">Factory uploads (14d): {catalog?.analytics?.factory_performance_summary?.total || 0}</div>
                      {(catalog?.analytics?.factory_top || []).slice(0, 1).map((row) => (
                        <div key={row.company_id} className="text-[11px] text-slate-500">Top factory: {row.company_name} · {row.products}</div>
                      ))}
                      <div className="text-[11px] text-slate-500">Search alerts: {(catalog?.search?.alerts || []).length}</div>
                      <div className="text-[11px] text-slate-500">Abuse records: {(catalog?.search?.usage || []).length}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">AI + System Settings</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Knowledge entries: {(catalog?.ai?.knowledge_entries || []).length}</div>
                      <div className="text-[11px] text-slate-500">AI audit logs: {(catalog?.ai?.response_audit || []).length}</div>
                      <div className="text-[11px] text-slate-500">Feature flags: {Object.keys(catalog?.system?.feature_flags || {}).length}</div>
                      <div className="text-[11px] text-slate-500">Integrations: {Object.keys(catalog?.system?.integrations || {}).length}</div>
                      {(catalog?.ai?.summary_logs || []).slice(0, 1).map((log) => (
                        <div key={log.id} className="text-[11px] text-slate-500">AI log {log.id}</div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Traffic + Email Segments</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Clicks: {catalog?.traffic?.summary?.clicks || 0}</div>
                      <div className="text-[11px] text-slate-500">Visits: {catalog?.traffic?.summary?.visits || 0}</div>
                      <div className="text-[11px] text-slate-500">Spend: {formatCurrency(catalog?.traffic?.summary?.spend || 0)}</div>
                      <div className="text-[11px] text-slate-500">CPC: {catalog?.traffic?.summary?.cpc ? formatCurrency(catalog.traffic.summary.cpc) : '--'}</div>
                      <div className="text-[11px] text-slate-500">Sources: {(catalog?.traffic?.sources || []).length}</div>
                      <div className="text-[11px] text-slate-500">Email segments: {(catalog?.emails?.segments || []).length}</div>
                      {(catalog?.emails?.segments || []).slice(0, 1).map((seg) => (
                        <div key={seg.id} className="text-[11px] text-slate-500">Segment: {seg.name}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'infra' ? (
              <div
                className={cn(
                  'rounded-[32px] border p-4 sm:p-5',
                  adminDark ? 'border-slate-800/70 bg-slate-950/50' : 'border-slate-200 bg-white/75'
                )}
              >
                <div
                  className={cn(
                    'rounded-[28px] p-4 sm:p-5',
                    adminDark
                      ? 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_38%),linear-gradient(180deg,#07111f_0%,#020617_100%)] text-slate-100'
                      : 'bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.22),_transparent_36%),linear-gradient(180deg,#f8fdff_0%,#eef7ff_100%)] text-slate-900'
                  )}
                >
                  <div className="mx-auto max-w-[1700px]">
                    <header
                      className={cn(
                        'sticky top-3 z-30 mb-6 rounded-[28px] border px-4 py-4 lg:px-6',
                        adminDark
                          ? 'border-slate-800 bg-slate-950/75 shadow-[0_18px_70px_-34px_rgba(15,23,42,0.4)]'
                          : 'border-slate-200 bg-white shadow-sm'
                      )}
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30">
                            <LayoutDashboard className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h1 className={cn('text-xl font-semibold tracking-tight sm:text-2xl', adminDark ? 'text-white' : 'text-slate-900')}>
                                Server / System / Infrastructure Management
                              </h1>
                              <Badge tone="live" darkMode={adminDark}>
                                live
                              </Badge>
                            </div>
                            <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-500')}>
                              Professional operations console with auditability, safety guards, and premium status surfaces.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col gap-3 xl:max-w-3xl xl:flex-row xl:items-center xl:justify-end">
                          <div className="relative w-full xl:max-w-xl">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              value={infraSearch}
                              onChange={(event) => setInfraSearch(event.target.value)}
                              placeholder="Search users, logs, rules, services, APIs..."
                              className={cn(infraInputClass, 'pl-11')}
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setAdminDark((v) => !v)}
                              className={cn(
                                'inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition',
                                adminDark
                                  ? 'border-sky-400/20 bg-sky-500/10 text-sky-200 hover:bg-sky-500/15'
                                  : 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
                              )}
                            >
                              {adminDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                              {adminDark ? 'Light mode' : 'Dark mode'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </header>

                    <div className="mb-6 grid gap-4 lg:grid-cols-4">
                      <StatCard
                        icon={Server}
                        title="CPU"
                        value={`${infra?.cpu?.cores || '--'} cores`}
                        meta={`Usage: ${infra?.cpu?.usage_percent?.toFixed?.(0) || '0'}%`}
                        tone="sky"
                        darkMode={adminDark}
                      />
                      <StatCard
                        icon={Database}
                        title="Memory"
                        value={`${infra?.memory?.used_bytes ? formatNumber(Math.round(infra.memory.used_bytes / (1024 * 1024))) : '--'} MB used`}
                        meta={`Free: ${infra?.memory?.free_bytes ? formatNumber(Math.round(infra.memory.free_bytes / (1024 * 1024))) : '--'} MB`}
                        tone="blue"
                        darkMode={adminDark}
                      />
                      <StatCard
                        icon={Users}
                        title="Services"
                        value={`${formatNumber(infra?.services?.length)}`}
                        meta={`Processes: ${formatNumber(infra?.processes?.length)}`}
                        tone="emerald"
                        darkMode={adminDark}
                      />
                      <StatCard
                        icon={Database}
                        title="Storage + I/O"
                        value={`${formatNumber(infra?.storage?.length)} mounts`}
                        meta={`Disk IOPS: ${infra?.io?.disk_iops ?? '--'} · Bandwidth: ${infra?.network?.bandwidth_mbps ?? '--'} Mbps`}
                        tone="amber"
                        darkMode={adminDark}
                      />
                    </div>

                    <div className="grid gap-6 xl:grid-cols-12">
                      <div className="space-y-6 xl:col-span-8">
                        <SectionCard
                          title="System Overview"
                          subtitle="CPU, memory, storage, and services pulled from infra adapters."
                          icon={Activity}
                          actionLabel="Refresh"
                          onAction={() => refreshInfraAll()}
                          darkMode={adminDark}
                        >
                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {[
                              ['CPU', `${infra?.cpu?.cores || '--'} cores`, `Usage: ${infra?.cpu?.usage_percent?.toFixed?.(0) || '0'}%`],
                              [
                                'Memory',
                                `${infra?.memory?.used_bytes ? formatNumber(Math.round(infra.memory.used_bytes / (1024 * 1024))) : '--'} MB used`,
                                `Free: ${infra?.memory?.free_bytes ? formatNumber(Math.round(infra.memory.free_bytes / (1024 * 1024))) : '--'} MB`,
                              ],
                              ['Services', `${formatNumber(infra?.services?.length)}`, `Processes: ${formatNumber(infra?.processes?.length)}`],
                              [
                                'Storage + I/O',
                                `${formatNumber(infra?.storage?.length)} mounts`,
                                `Disk IOPS: ${infra?.io?.disk_iops ?? '--'} · Bandwidth: ${infra?.network?.bandwidth_mbps ?? '--'} Mbps`,
                              ],
                            ].map(([label, value, meta]) => (
                              <div key={label} className={infraFieldPanel}>
                                <div className={adminDark ? 'text-slate-400' : 'text-slate-500'}>{label}</div>
                                <div className={cn('mt-2 text-2xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>{value}</div>
                                <div className={adminDark ? 'mt-1 text-sm text-slate-400' : 'mt-1 text-sm text-slate-500'}>{meta}</div>
                              </div>
                            ))}
                          </div>
                        </SectionCard>

                        <div className="grid gap-6 md:grid-cols-2">
                          <SectionCard
                            title="Verification Queue"
                            subtitle="EU/USA docs pending review."
                            icon={ShieldCheck}
                            actionLabel="Refresh"
                            actionIcon={RefreshCw}
                            onAction={() => refreshVerificationQueue()}
                            darkMode={adminDark}
                          >
                            <div className="space-y-3">
                              {verificationQueue.slice(0, 3).map((row) => (
                                <div
                                  key={row.id || row.user_id}
                                  className={cn('rounded-3xl border px-4 py-3 text-sm', adminDark ? 'border-slate-800 bg-slate-900/70 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600')}
                                >
                                  <div className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{row.user_name || row.user_email || row.user_id}</div>
                                  <div className={adminDark ? 'mt-1 text-xs text-slate-400' : 'mt-1 text-xs text-slate-500'}>
                                    Doc: {row.doc_type || row.type || 'business'} · Status: {row.status || 'pending'}
                                  </div>
                                </div>
                              ))}
                              {!verificationQueue.length ? (
                                <div className={cn('rounded-3xl border border-dashed p-5 text-sm', adminDark ? 'border-slate-800 bg-slate-900/70 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500')}>
                                  {emptyCopy('verification.pending', 'No pending verifications in queue.')}
                                </div>
                              ) : null}
                            </div>
                          </SectionCard>

                          <SectionCard
                            title="Dispute Radar"
                            subtitle="Contracts with open issues."
                            icon={AlertTriangle}
                            actionLabel="Sync"
                            actionIcon={RefreshCw}
                            onAction={() => refreshDisputes()}
                            darkMode={adminDark}
                          >
                            <div className="space-y-3">
                              {disputes.slice(0, 3).map((dispute) => (
                                <div
                                  key={dispute.id}
                                  className={cn('rounded-3xl border px-4 py-3 text-sm', adminDark ? 'border-slate-800 bg-slate-900/70 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600')}
                                >
                                  <div className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{dispute.title || dispute.contract_id || 'Dispute'}</div>
                                  <div className={adminDark ? 'mt-1 text-xs text-slate-400' : 'mt-1 text-xs text-slate-500'}>
                                    Status: {dispute.status || 'open'} · Priority: {dispute.priority || 'normal'}
                                  </div>
                                </div>
                              ))}
                              {!disputes.length ? (
                                <div className={cn('rounded-3xl border border-dashed p-5 text-sm', adminDark ? 'border-slate-800 bg-slate-900/70 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500')}>
                                  {emptyCopy('disputes.none', 'No active disputes.')}
                                </div>
                              ) : null}
                            </div>
                          </SectionCard>
                        </div>

                        <SectionCard
                          title="Audit Pulse"
                          subtitle="Most recent admin actions."
                          icon={ShieldCheck}
                          actionLabel="Refresh"
                          actionIcon={RefreshCw}
                          onAction={() => refreshAudit()}
                          darkMode={adminDark}
                        >
                          <div className="space-y-3">
                            {filteredInfraAuditRows.slice(0, 5).map((entry) => (
                              <div
                                key={entry.id || entry.at}
                                className={cn('flex items-center justify-between rounded-2xl border px-4 py-3', adminDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white')}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-2xl', adminDark ? 'bg-sky-500/10 text-sky-300' : 'bg-sky-50 text-sky-600')}>
                                    <TerminalSquare className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{entry.action || entry.path || 'Admin action'}</div>
                                    <div className={adminDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>
                                      {entry.at ? new Date(entry.at).toLocaleString() : '--'} · {entry.actor || 'system'}
                                    </div>
                                  </div>
                                </div>
                                <Badge tone="info" darkMode={adminDark}>
                                  {entry.status ?? 200}
                                </Badge>
                              </div>
                            ))}
                            {!filteredInfraAuditRows.length ? (
                              <div className={cn('rounded-3xl border border-dashed p-5 text-sm', adminDark ? 'border-slate-800 bg-slate-900/70 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500')}>
                                No recent activity.
                              </div>
                            ) : null}
                          </div>
                        </SectionCard>

                        <div className="grid gap-6 md:grid-cols-2">
                          <SectionCard
                            title="Firewall Rules"
                            subtitle="Safe presets for allow/deny."
                            icon={Shield}
                            actionLabel="Refresh"
                            onAction={() => refreshInfraState()}
                            darkMode={adminDark}
                          >
                            <div className="space-y-3">
                              <div>
                                <label className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.18em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>
                                  Preset
                                </label>
                                <div className="relative">
                                  <select
                                    value={`${firewallForm.action}:${firewallForm.port || ''}`}
                                    onChange={(event) => {
                                      const [actionValue, portValue] = event.target.value.split(':')
                                      setFirewallForm((prev) => ({ ...prev, action: actionValue, port: portValue || '', protocol: 'tcp' }))
                                    }}
                                    className={cn(infraInputClass, 'appearance-none pr-10')}
                                  >
                                    <option value="allow:">Preset (select)</option>
                                    <option value="allow:22">Allow SSH 22</option>
                                    <option value="allow:80">Allow HTTP 80</option>
                                    <option value="allow:443">Allow HTTPS 443</option>
                                    <option value="block:25">Block SMTP 25</option>
                                  </select>
                                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.18em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>
                                    Port
                                  </label>
                                  <input
                                    value={firewallForm.port}
                                    onChange={(event) => setFirewallForm((prev) => ({ ...prev, port: event.target.value }))}
                                    placeholder="22"
                                    className={infraInputClass}
                                  />
                                </div>
                                <div>
                                  <label className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.18em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>
                                    Protocol
                                  </label>
                                  <select
                                    value={firewallForm.protocol}
                                    onChange={(event) => setFirewallForm((prev) => ({ ...prev, protocol: event.target.value }))}
                                    className={infraInputClass}
                                  >
                                    <option value="tcp">tcp</option>
                                    <option value="udp">udp</option>
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.18em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>
                                  Description
                                </label>
                                <input
                                  value={firewallForm.description}
                                  onChange={(event) => setFirewallForm((prev) => ({ ...prev, description: event.target.value }))}
                                  placeholder="Allow ingress from trusted host"
                                  className={infraInputClass}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  runInfraAction(`firewall.${firewallForm.action}_port`, {
                                    port: firewallForm.port,
                                    protocol: firewallForm.protocol,
                                    description: firewallForm.description,
                                  })
                                }
                                className={cn(
                                  'w-full rounded-2xl px-4 py-3.5 text-sm font-semibold text-white transition',
                                  adminDark ? 'bg-gradient-to-r from-sky-500 to-cyan-400 shadow-lg shadow-sky-500/25' : 'bg-sky-600 hover:bg-sky-500'
                                )}
                              >
                                Apply rule
                              </button>
                              <div className="space-y-2">
                                {(infraState?.firewall_rules || []).slice(0, 6).map((rule) => (
                                  <div
                                    key={rule.id}
                                    className={cn('flex items-center justify-between rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white')}
                                  >
                                    <div className={cn('text-sm font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{rule.action} {rule.port}/{rule.protocol}</div>
                                    <button
                                      type="button"
                                      onClick={() => runInfraAction('firewall.remove_rule', { rule_id: rule.id })}
                                      className={cn('inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold', adminDark ? 'border-rose-400/20 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700')}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" /> Remove
                                    </button>
                                  </div>
                                ))}
                                {(infraState?.firewall_rules || []).length === 0 ? (
                                  <div className={cn('rounded-2xl border border-dashed p-4 text-sm', adminDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500')}>
                                    {emptyCopy('firewall.rules.none', 'No rules yet.')}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </SectionCard>

                          <SectionCard
                            title="Package Updates"
                            subtitle="Safe presets for update checks and installs."
                            icon={Server}
                            actionLabel="Run package action"
                            actionIcon={Download}
                            onAction={() => runInfraAction('package.update', { mode: packageForm.mode, apply: packageForm.mode !== 'check' })}
                            darkMode={adminDark}
                          >
                            <div className="space-y-3">
                              <div className="relative">
                                <select
                                  value={packageForm.mode}
                                  onChange={(event) => setPackageForm((prev) => ({ ...prev, mode: event.target.value, apply: event.target.value !== 'check' }))}
                                  className={cn(infraInputClass, 'appearance-none pr-10')}
                                >
                                  <option value="check">Check updates (safe)</option>
                                  <option value="security">Apply security updates</option>
                                  <option value="all">Apply all updates</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className={infraFieldPanel}>
                                  <div className={cn('flex items-center gap-2 text-sm font-medium', adminDark ? 'text-white' : 'text-slate-900')}>
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Safe check
                                  </div>
                                  <p className={adminDark ? 'mt-2 text-sm text-slate-400' : 'mt-2 text-sm text-slate-500'}>
                                    Run controlled update scans without auto-installing risky packages.
                                  </p>
                                </div>
                                <div className={infraFieldPanel}>
                                  <div className={cn('flex items-center gap-2 text-sm font-medium', adminDark ? 'text-white' : 'text-slate-900')}>
                                    <ShieldCheck className="h-4 w-4 text-sky-500" /> Admin guard
                                  </div>
                                  <p className={adminDark ? 'mt-2 text-sm text-slate-400' : 'mt-2 text-sm text-slate-500'}>
                                    Only verified operators may apply changes on production nodes.
                                  </p>
                                </div>
                              </div>
                              <div className={cn('rounded-2xl border border-dashed p-4 text-sm', adminDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500')}>
                                Last updates: {(infraState?.updates || []).slice(0, 3).map((row) => row.mode).join(', ') || 'none'}
                              </div>
                            </div>
                          </SectionCard>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <SectionCard
                            title="Cron Manager"
                            subtitle="Schedule safe recurring tasks."
                            icon={Clock3}
                            actionLabel="Add cron job"
                            actionIcon={ArrowRight}
                            onAction={() => runInfraAction('cron.add', cronForm)}
                            darkMode={adminDark}
                          >
                            <div className="space-y-3">
                              <div className="relative">
                                <select
                                  value={cronForm.schedule}
                                  onChange={(event) => {
                                    const value = event.target.value
                                    if (value === '0 2 * * *') {
                                      setCronForm({ name: 'Daily backup', schedule: value, command: 'backup.run' })
                                    } else if (value === '0 0 * * 0') {
                                      setCronForm({ name: 'Weekly cleanup', schedule: value, command: 'log.rotate' })
                                    } else {
                                      setCronForm((prev) => ({ ...prev, schedule: value }))
                                    }
                                  }}
                                  className={cn(infraInputClass, 'appearance-none pr-10')}
                                >
                                  <option value="">Preset (select)</option>
                                  <option value="0 2 * * *">Daily backup at 2am</option>
                                  <option value="0 0 * * 0">Weekly cleanup (Sunday)</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              </div>
                              <input value={cronForm.name} onChange={(event) => setCronForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Job name" className={infraInputClass} />
                              <input value={cronForm.schedule} onChange={(event) => setCronForm((prev) => ({ ...prev, schedule: event.target.value }))} placeholder="Cron schedule" className={infraInputClass} />
                              <input value={cronForm.command} onChange={(event) => setCronForm((prev) => ({ ...prev, command: event.target.value }))} placeholder="Command" className={infraInputClass} />
                              <div className="space-y-2">
                                {(infraState?.cron_jobs || []).slice(0, 4).map((job) => (
                                  <div
                                    key={job.id}
                                    className={cn('flex items-center justify-between rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white')}
                                  >
                                    <div className={cn('text-sm font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{job.name} · {job.schedule}</div>
                                    <button
                                      type="button"
                                      onClick={() => runInfraAction('cron.remove', { job_id: job.id })}
                                      className={cn('inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold', adminDark ? 'border-rose-400/20 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700')}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" /> Remove
                                    </button>
                                  </div>
                                ))}
                                {(infraState?.cron_jobs || []).length === 0 ? (
                                  <div className={cn('rounded-2xl border border-dashed p-4 text-sm', adminDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500')}>
                                    {emptyCopy('cron.jobs.none', 'No cron jobs yet.')}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </SectionCard>

                          <SectionCard
                            title="System Logs + Zombie Scan"
                            subtitle="Syslog snapshots and zombie detection."
                            icon={AlertTriangle}
                            actionLabel="Collect logs"
                            actionIcon={RefreshCw}
                            onAction={() => runInfraAction('log.collect', { level: 'info', message: 'Manual log snapshot' })}
                            darkMode={adminDark}
                          >
                            <div className="space-y-3">
                              <button
                                type="button"
                                onClick={() => runInfraAction('process.scan_zombies')}
                                className={cn(
                                  'w-full rounded-2xl px-4 py-3 text-sm font-semibold transition',
                                  adminDark ? 'border border-sky-400/20 bg-sky-500/10 text-sky-200 hover:bg-sky-500/15' : 'border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
                                )}
                              >
                                Scan zombies
                              </button>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className={infraFieldPanel}>
                                  <div className={adminDark ? 'text-xs uppercase tracking-[0.2em] text-slate-400' : 'text-xs uppercase tracking-[0.2em] text-slate-500'}>
                                    Log integrity
                                  </div>
                                  <div className={cn('mt-2 flex items-center gap-2 text-sm font-medium', adminDark ? 'text-white' : 'text-slate-900')}>
                                    <Lock className="h-4 w-4 text-emerald-500" /> Tamper-evident
                                  </div>
                                </div>
                                <div className={infraFieldPanel}>
                                  <div className={adminDark ? 'text-xs uppercase tracking-[0.2em] text-slate-400' : 'text-xs uppercase tracking-[0.2em] text-slate-500'}>
                                    Zombie scan
                                  </div>
                                  <div className={cn('mt-2 flex items-center gap-2 text-sm font-medium', adminDark ? 'text-white' : 'text-slate-900')}>
                                    {(infraState?.zombie_processes || []).length ? (
                                      <>
                                        <XCircle className="h-4 w-4 text-rose-500" /> {(infraState?.zombie_processes || []).length} anomalies
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 className="h-4 w-4 text-sky-500" /> No anomalies
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {(infraState?.logs || []).slice(0, 4).map((log) => (
                                  <div key={log.id} className={cn('rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-slate-800 bg-slate-900/60 text-slate-300' : 'border-slate-200 bg-white text-slate-700')}>
                                    {log.level || 'info'} · {log.message}
                                  </div>
                                ))}
                                {(infraState?.zombie_processes || []).slice(0, 2).map((proc) => (
                                  <div key={proc.pid} className={cn('rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-rose-400/20 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700')}>
                                    Zombie: {proc.name} ({proc.pid})
                                  </div>
                                ))}
                                {(infraState?.logs || []).length === 0 ? (
                                  <div className={cn('rounded-2xl border border-dashed p-4 text-sm', adminDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500')}>
                                    No logs collected yet.
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </SectionCard>
                        </div>
                      </div>

                      <div className="space-y-6 xl:col-span-4">
                        <SectionCard
                          title="OS Users + SSH Keys"
                          subtitle="Create/delete accounts and manage keys."
                          icon={Users}
                          actionLabel="Manage access"
                          actionIcon={Shield}
                          onAction={() => refreshInfraState()}
                          darkMode={adminDark}
                        >
                          <div className="space-y-3">
                            <input value={osUserForm.username} onChange={(event) => setOsUserForm((prev) => ({ ...prev, username: event.target.value }))} placeholder="Username" className={infraInputClass} />
                            <button
                              type="button"
                              onClick={() => runInfraAction('os.user.create', { username: osUserForm.username, role: osUserForm.role })}
                              className={cn('w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white', adminDark ? 'bg-gradient-to-r from-sky-500 to-blue-500' : 'bg-sky-600')}
                            >
                              Create OS user
                            </button>
                            <input value={sshKeyForm.label} onChange={(event) => setSshKeyForm((prev) => ({ ...prev, label: event.target.value }))} placeholder="SSH key label" className={infraInputClass} />
                            <input value={sshKeyForm.fingerprint} onChange={(event) => setSshKeyForm((prev) => ({ ...prev, fingerprint: event.target.value }))} placeholder="Fingerprint" className={infraInputClass} />
                            <button
                              type="button"
                              onClick={() => runInfraAction('ssh.key.add', sshKeyForm)}
                              className={cn('w-full rounded-2xl border px-4 py-3 text-sm font-semibold', adminDark ? 'border-sky-400/20 bg-sky-500/10 text-sky-200' : 'border-sky-200 bg-sky-50 text-sky-700')}
                            >
                              Add SSH key
                            </button>

                            <div className="space-y-2 pt-2">
                              {(infraState?.os_users || []).slice(0, 4).map((userRow) => (
                                <div
                                  key={userRow.id}
                                  className={cn('flex items-center justify-between rounded-2xl border px-4 py-3', adminDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white')}
                                >
                                  <div className={cn('flex items-center gap-2 text-sm font-medium', adminDark ? 'text-white' : 'text-slate-900')}>
                                    <Shield className="h-4 w-4 text-sky-500" /> {userRow.username}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => runInfraAction('os.user.delete', { username: userRow.username })}
                                    className={cn('inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold', adminDark ? 'border-rose-400/20 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700')}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                  </button>
                                </div>
                              ))}
                              {(infraState?.ssh_keys || []).slice(0, 3).map((key) => (
                                <div
                                  key={key.id}
                                  className={cn('flex items-center justify-between rounded-2xl border px-4 py-3', adminDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white')}
                                >
                                  <div className={cn('flex items-center gap-2 text-sm font-medium', adminDark ? 'text-white' : 'text-slate-900')}>
                                    <LockKeyhole className="h-4 w-4 text-sky-500" /> {key.label}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => runInfraAction('ssh.key.remove', { key_id: key.id })}
                                    className={cn('inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold', adminDark ? 'border-rose-400/20 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700')}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" /> Remove
                                  </button>
                                </div>
                              ))}
                              {(infraState?.os_users || []).length === 0 && (infraState?.ssh_keys || []).length === 0 ? (
                                <div className={cn('rounded-2xl border border-dashed p-4 text-sm', adminDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500')}>
                                  No OS users or SSH keys found.
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </SectionCard>

                        <SectionCard
                          title="SSL + Backups + Network Settings"
                          subtitle="Certificates, retention, DNS, timezone."
                          icon={Wifi}
                          actionLabel="Save settings"
                          actionIcon={SlidersHorizontal}
                          onAction={async () => {
                            if (sslForm.domain) await runInfraAction('ssl.cert.issue', { domain: sslForm.domain })
                            if (infraBackupForm.retention_days) await runInfraAction('backup.retention', { retention_days: infraBackupForm.retention_days })
                            if (timeForm.timezone) await runInfraAction('system.timezone.set', { timezone: timeForm.timezone })
                          }}
                          darkMode={adminDark}
                        >
                          <div className="space-y-3">
                            <input value={sslForm.domain} onChange={(event) => setSslForm((prev) => ({ ...prev, domain: event.target.value }))} placeholder="Domain" className={infraInputClass} />
                            <button
                              type="button"
                              onClick={() => runInfraAction('ssl.cert.issue', { domain: sslForm.domain })}
                              className={cn('w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white', adminDark ? 'bg-gradient-to-r from-sky-500 to-cyan-400' : 'bg-sky-600')}
                            >
                              Issue SSL cert
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                value={infraBackupForm.retention_days}
                                onChange={(event) => setInfraBackupForm((prev) => ({ ...prev, retention_days: event.target.value }))}
                                placeholder="Retention days"
                                className={infraInputClass}
                              />
                              <button
                                type="button"
                                onClick={() => runInfraAction('backup.retention', { retention_days: infraBackupForm.retention_days })}
                                className={cn('rounded-2xl border px-4 py-3 text-sm font-semibold', adminDark ? 'border-sky-400/20 bg-sky-500/10 text-sky-200' : 'border-sky-200 bg-sky-50 text-sky-700')}
                              >
                                Update retention
                              </button>
                            </div>
                            <input value={timeForm.timezone} onChange={(event) => setTimeForm((prev) => ({ ...prev, timezone: event.target.value }))} placeholder="Timezone (e.g. UTC)" className={infraInputClass} />
                            <button
                              type="button"
                              onClick={() => runInfraAction('system.timezone.set', { timezone: timeForm.timezone })}
                              className={cn('w-full rounded-2xl border px-4 py-3 text-sm font-semibold', adminDark ? 'border-sky-400/20 bg-sky-500/10 text-sky-200' : 'border-sky-200 bg-sky-50 text-sky-700')}
                            >
                              Set timezone
                            </button>
                            <div className={cn('rounded-2xl p-4 text-sm', adminDark ? 'border border-slate-800 bg-slate-900/60 text-slate-400' : 'border border-slate-200 bg-slate-50 text-slate-600')}>
                              <div className="flex items-center justify-between gap-4">
                                <span>Retention: {infraState?.backups?.retention_days || 0} days · SSLs: {(infraState?.ssl_certs || []).length}</span>
                                <span className={adminDark ? 'font-medium text-white' : 'font-medium text-slate-900'}>
                                  Timezone: {infraState?.time_settings?.timezone || 'unset'}
                                </span>
                              </div>
                              <div className="mt-2 text-xs">NTP sync: {infraState?.time_settings?.last_sync_at || 'never'}</div>
                            </div>
                          </div>
                        </SectionCard>

                        <SectionCard
                          title="Admin Audit Log"
                          subtitle="Immutable, tamper-evident audit trail for every admin action."
                          icon={ShieldCheck}
                          actionLabel="Refresh log"
                          actionIcon={RefreshCw}
                          onAction={() => refreshAudit()}
                          darkMode={adminDark}
                        >
                          <div className="space-y-3">
                            {filteredInfraAuditRows.slice(0, 8).map((entry) => (
                              <div key={entry.id || entry.at} className={cn('rounded-2xl border p-4', adminDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white')}>
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{entry.action || entry.path || 'Admin action'}</div>
                                    <div className={adminDark ? 'mt-1 text-xs text-slate-400' : 'mt-1 text-xs text-slate-500'}>{entry.at ? new Date(entry.at).toLocaleString() : '--'} · {entry.actor || 'system'}</div>
                                  </div>
                                  <Badge tone="live" darkMode={adminDark}>
                                    {entry.status ?? 200}
                                  </Badge>
                                </div>
                                <div className={adminDark ? 'mt-3 grid gap-1 text-xs text-slate-400' : 'mt-3 grid gap-1 text-xs text-slate-500'}>
                                  <div>Actor: {entry.actor_id || entry.actor || 'system'}</div>
                                  <div>IP: {entry.ip || '--'} / Device: {entry.device_id || '--'}</div>
                                </div>
                              </div>
                            ))}
                            {!filteredInfraAuditRows.length ? (
                              <div className={cn('rounded-2xl border border-dashed p-4 text-sm', adminDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500')}>
                                No audit entries yet.
                              </div>
                            ) : null}
                          </div>
                        </SectionCard>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 xl:grid-cols-5">
                      {INFRA_CAPABILITIES.map((cap) => {
                        const Icon = cap.icon
                        return (
                          <div
                            key={cap.title}
                            className={cn(
                              'rounded-[26px] border p-5',
                              adminDark ? 'border-slate-800 bg-slate-950/70 shadow-[0_18px_70px_-36px_rgba(15,23,42,0.35)]' : 'border-slate-200 bg-white shadow-sm'
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className={cn('rounded-2xl border p-3', adminDark ? 'border-sky-400/20 bg-sky-500/10 text-sky-300' : 'border-sky-200 bg-sky-50 text-sky-600')}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <Badge tone="live" darkMode={adminDark}>
                                live
                              </Badge>
                            </div>
                            <div className={cn('mt-4 text-base font-semibold tracking-tight', adminDark ? 'text-white' : 'text-slate-900')}>{cap.title}</div>
                            <div className={cn('mt-2 text-3xl font-semibold', adminDark ? 'text-sky-300' : 'text-sky-600')}>{cap.count}</div>
                            <p className={adminDark ? 'mt-2 text-sm text-slate-400' : 'mt-2 text-sm text-slate-500'}>{cap.subtitle}</p>
                          </div>
                        )
                      })}
                    </div>

                    <footer
                      className={cn(
                        'mt-6 rounded-[28px] border px-5 py-4 text-sm',
                        adminDark ? 'border-slate-800 bg-slate-950/70 text-slate-400 shadow-[0_18px_70px_-36px_rgba(15,23,42,0.3)]' : 'border-slate-200 bg-white text-slate-500 shadow-sm'
                      )}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-sky-500" /> Premium infrastructure control surface
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-cyan-400" /> Blue-sky themed • audit-first • responsive
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'network' ? (
              <div className={cn('relative overflow-hidden rounded-[32px] border p-4 sm:p-5', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/75')}>
                <div className="absolute inset-0 -z-10 overflow-hidden">
                  <div className={cn('absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl', adminDark ? 'bg-sky-500/20' : 'bg-sky-400/20')} />
                  <div className={cn('absolute top-40 -left-20 h-72 w-72 rounded-full blur-3xl', adminDark ? 'bg-blue-500/15' : 'bg-blue-300/25')} />
                  <div className={cn('absolute bottom-0 right-0 h-96 w-96 rounded-full blur-3xl', adminDark ? 'bg-cyan-500/10' : 'bg-cyan-300/20')} />
                </div>

                <div className="mx-auto max-w-[1600px] space-y-6">
                  <section className={cn('rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/75')}>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                          <CircuitBoard className="h-6 w-6" />
                        </div>
                        <div>
                          <h1 className={cn('text-2xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Network Control</h1>
                          <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>Enterprise monitoring, configuration, security, and audit</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setAdminDark(adminDark ? false : true)}
                        className={cn('inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}
                      >
                        {adminDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        Toggle Theme
                      </button>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                      {[
                        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                        { id: 'inventory', label: 'Inventory', icon: Wifi },
                        { id: 'security', label: 'Security', icon: Lock },
                        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                        { id: 'audit', label: 'Audit', icon: ShieldCheck },
                        { id: 'users', label: 'Users', icon: Users },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setNetworkNav(id)}
                          className={cn(
                            'flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                            networkNav === id
                              ? 'bg-sky-500 text-white'
                              : adminDark
                                ? 'bg-white/5 text-slate-100 hover:bg-white/10'
                                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {label}
                          </span>
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {['SLA 99.98%', 'Security Green', 'Latency Stable', 'Infra Healthy'].map((item) => (
                        <div key={item} className={cn('rounded-2xl p-4 text-sm', adminDark ? 'bg-white/5 text-slate-200' : 'bg-slate-100 text-slate-800')}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className={cn('rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/75')}>
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                      <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-sky-400 shadow-sm backdrop-blur-xl">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                          Network Monitoring &amp; Management
                          <span className={cn('rounded-full px-2 py-0.5', adminDark ? 'bg-white/10 text-slate-200' : 'bg-slate-100 text-slate-700')}>Enterprise Level</span>
                        </div>
                        <h2 className={cn('mt-4 text-3xl font-semibold tracking-tight sm:text-4xl', adminDark ? 'text-white' : 'text-slate-900')}>Network Overview</h2>
                        <p className={cn('mt-3 max-w-2xl text-sm leading-7 sm:text-base', adminDark ? 'text-slate-300' : 'text-slate-600')}>
                          Topology status, alerts, and real-time diagnostics with premium visibility across devices, security, traffic, and audit history.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setAdminDark((v) => !v)}
                          className={cn(
                            'inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all',
                            adminDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-50'
                          )}
                        >
                          {adminDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                          {adminDark ? 'Light mode' : 'Dark mode'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            downloadJson('network_report.json', {
                              generated_at: new Date().toISOString(),
                              overview: network,
                              inventory: networkInventory,
                              audit: audit.slice(0, 100),
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition-transform hover:-translate-y-0.5"
                        >
                          <Download className="h-4 w-4" />
                          Export report
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[
                          { label: 'Devices', value: formatNumber(network?.device_total), sub: `Up: ${formatNumber(network?.device_up)} / Down: ${formatNumber(network?.device_down)}`, icon: Network },
                          { label: 'Alerts', value: formatNumber(network?.alert_count), sub: `Latency: ${network?.traffic_summary?.latency_ms ?? '--'} ms`, icon: AlertTriangle },
                          { label: 'Jitter', value: `${network?.traffic_summary?.jitter_ms ?? '--'} ms`, sub: `Bandwidth: ${network?.traffic_summary?.bandwidth_mbps ?? '--'} Mbps`, icon: Activity },
                          { label: 'Loss', value: `${network?.traffic_summary?.packet_loss_pct ?? '--'}%`, sub: 'Topologies stable', icon: ShieldCheck },
                        ].map((card) => {
                          const Icon = card.icon
                          return (
                            <div
                              key={card.label}
                              className={cn(
                                'group rounded-[24px] border p-5 transition-all hover:-translate-y-0.5',
                                adminDark ? 'border-white/10 bg-slate-900/50 hover:bg-slate-900/70' : 'border-slate-200 bg-white hover:shadow-lg'
                              )}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-500')}>{card.label}</p>
                                  <div className="mt-2 flex items-end gap-2">
                                    <h3 className={cn('text-3xl font-semibold tracking-tight', adminDark ? 'text-white' : 'text-slate-900')}>{card.value}</h3>
                                  </div>
                                  <p className={cn('mt-2 text-sm', adminDark ? 'text-slate-300' : 'text-slate-600')}>{card.sub}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 ring-1 ring-inset ring-sky-400/20">
                                  <Icon className="h-5 w-5" />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>

                    <div className="mt-6 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
                        <div className={cn('rounded-[28px] border p-5', adminDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white')}>
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.22em] text-sky-400">Device Inventory</p>
                              <h3 className={cn('mt-1 text-xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Realtime device status</h3>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => refreshNetworkInventory()}
                                className={cn('inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium', adminDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200')}
                              >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                              </button>
                              <div className={cn('flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm', adminDark ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700')}>
                                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                                Live data
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="relative">
                              <Search className={cn('pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2', adminDark ? 'text-slate-500' : 'text-slate-400')} />
                              <input
                                value={networkQuery}
                                onChange={(event) => setNetworkQuery(event.target.value)}
                                placeholder="Search devices..."
                                className={cn(
                                  'w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition-all',
                                  adminDark
                                    ? 'border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-500 focus:border-sky-400/60'
                                    : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                                )}
                              />
                            </div>
                          </div>

                          <div className="mt-4 space-y-3">
                            {filteredNetworkDevices.map((device) => {
                              const status = String(device?.status || '').toLowerCase()
                              const isUp = status === 'up' || status === 'online' || status === 'healthy'
                              return (
                                <div
                                  key={device.id}
                                  className={cn(
                                    'flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between',
                                    adminDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', adminDark ? 'bg-sky-500/15 text-sky-400' : 'bg-sky-100 text-sky-600')}>
                                      <HardDrive className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{device.name || device.id}</p>
                                      <div className="mt-1 flex items-center gap-2 text-sm">
                                        <span
                                          className={cn(
                                            'inline-flex items-center gap-1 rounded-full px-2.5 py-1',
                                            isUp
                                              ? 'bg-emerald-500/10 text-emerald-400'
                                              : adminDark
                                                ? 'bg-rose-500/10 text-rose-300'
                                                : 'bg-rose-50 text-rose-700'
                                          )}
                                        >
                                          <span className={cn('h-1.5 w-1.5 rounded-full', isUp ? 'bg-emerald-400' : 'bg-rose-500')} />
                                          {device.status || 'unknown'}
                                        </span>
                                        <span className={adminDark ? 'text-slate-400' : 'text-slate-500'}>Stable link</span>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => runNetworkAction('device.reboot', { device_id: device.id })}
                                    className={cn(
                                      'inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all',
                                      adminDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-100'
                                    )}
                                  >
                                    Reboot
                                    <ArrowRight className="h-4 w-4" />
                                  </button>
                                </div>
                              )
                            })}
                            {filteredNetworkDevices.length === 0 ? (
                              <div className={cn('rounded-2xl border border-dashed p-4 text-sm', adminDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500')}>
                                No devices found.
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className={cn('rounded-[28px] border p-5', adminDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white')}>
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-sky-400">Quick Actions</p>
                            <h3 className={cn('mt-1 text-xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Operations toolkit</h3>
                          </div>
                          <div className="mt-4 space-y-3">
                            {[
                              { label: 'VLAN Management', icon: Globe2, desc: 'Create and retire VLANs.' },
                              { label: 'IPAM + Config Backups', icon: Database, desc: 'Reserve IPs and capture configs.' },
                              { label: 'IDS/IPS + Rogue AP', icon: ShieldCheck, desc: 'Security monitoring feeds.' },
                              { label: 'NetFlow + Alert Integrations', icon: Activity, desc: 'Traffic analytics and alert sinks.' },
                              { label: 'Client Monitoring + Auth Servers', icon: Users, desc: 'Connected clients and RADIUS/TACACS.' },
                            ].map((item) => {
                              const Icon = item.icon
                              return (
                                <div key={item.label} className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50')}>
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{item.label}</p>
                                      <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{item.desc}</p>
                                    </div>
                                    <ArrowUpRight className={cn('h-4 w-4', adminDark ? 'text-slate-500' : 'text-slate-400')} />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                    </div>
                  </section>

                  <section className="grid gap-6 xl:grid-cols-2">
                      <div className={cn('rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/75')}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-sky-400">VLAN Management</p>
                            <h3 className={cn('mt-1 text-2xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Create and retire VLANs</h3>
                          </div>
                          <BadgeCheck className="h-6 w-6 text-sky-400" />
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          {[
                            ['VLAN ID', vlanForm.vlan_id, (value) => setVlanForm((prev) => ({ ...prev, vlan_id: value }))],
                            ['Name', vlanForm.name, (value) => setVlanForm((prev) => ({ ...prev, name: value }))],
                            ['Subnet', vlanForm.subnet, (value) => setVlanForm((prev) => ({ ...prev, subnet: value }))],
                            ['Gateway', vlanForm.gateway, (value) => setVlanForm((prev) => ({ ...prev, gateway: value }))],
                          ].map(([label, value, setter]) => (
                            <div key={label} className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-slate-50')}>
                              <p className={cn('text-xs uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>{label}</p>
                              <input
                                value={value}
                                onChange={(event) => setter(event.target.value)}
                                className={cn(
                                  'mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none',
                                  adminDark ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/60' : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                                )}
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => runNetworkAction('vlan.create', vlanForm)}
                          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30"
                        >
                          Add VLAN
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <div className="mt-4 space-y-2">
                          {(networkInventory?.vlans || []).slice(0, 6).map((vlan) => (
                            <div key={vlan.id} className={cn('flex items-center justify-between rounded-2xl border px-4 py-3', adminDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white')}>
                              <div className={cn('text-sm font-medium', adminDark ? 'text-white' : 'text-slate-900')}>VLAN {vlan.id} · {vlan.subnet}</div>
                              <button
                                type="button"
                                onClick={() => runNetworkAction('vlan.delete', { vlan_id: vlan.id })}
                                className={cn('rounded-xl border px-3 py-1.5 text-xs font-semibold', adminDark ? 'border-rose-400/20 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700')}
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                          {(networkInventory?.vlans || []).length === 0 ? (
                            <div className={cn('rounded-2xl border border-dashed p-4 text-sm', adminDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500')}>
                              No VLANs yet.
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className={cn('rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/75')}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-sky-400">IPAM + Config Backups</p>
                            <h3 className={cn('mt-1 text-2xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Reserve IPs and capture configs</h3>
                          </div>
                          <Lock className="h-6 w-6 text-sky-400" />
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          {[
                            ['IP address', ipamForm.ip, (value) => setIpamForm((prev) => ({ ...prev, ip: value }))],
                            ['Owner', ipamForm.owner, (value) => setIpamForm((prev) => ({ ...prev, owner: value }))],
                            ['Device ID for backup', backupForm.device_id, (value) => setBackupForm({ device_id: value })],
                          ].map(([label, value, setter]) => (
                            <div key={label} className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-slate-50')}>
                              <p className={cn('text-xs uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>{label}</p>
                              <input
                                value={value}
                                onChange={(event) => setter(event.target.value)}
                                className={cn(
                                  'mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none',
                                  adminDark ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/60' : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                                )}
                              />
                            </div>
                          ))}
                          <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-slate-50')}>
                            <p className={cn('text-xs uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Backup target</p>
                            <p className={cn('mt-2 font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Encrypted vault</p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => runNetworkAction('ipam.reserve', ipamForm)}
                            className={cn('rounded-2xl px-4 py-3 text-sm font-semibold', adminDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900')}
                          >
                            Reserve IP
                          </button>
                          <button
                            type="button"
                            onClick={() => runNetworkAction('config.backup', backupForm)}
                            className="rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30"
                          >
                            Run config backup
                          </button>
                        </div>
                        <div className="mt-4 space-y-2">
                          {(networkInventory?.ipam_reservations || []).slice(0, 4).map((row) => (
                            <div key={row.id} className={cn('flex items-center justify-between rounded-2xl border px-4 py-3', adminDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white')}>
                              <div className={cn('text-sm font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{row.ip} · {row.owner || 'reserved'}</div>
                              <button
                                type="button"
                                onClick={() => runNetworkAction('ipam.release', { ip: row.ip })}
                                className={cn('rounded-xl border px-3 py-1.5 text-xs font-semibold', adminDark ? 'border-rose-400/20 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700')}
                              >
                                Release
                              </button>
                            </div>
                          ))}
                          {(networkInventory?.config_backups || []).slice(0, 3).map((row) => (
                            <div key={row.id} className={cn('rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-300' : 'border-slate-200 bg-white text-slate-700')}>
                              Backup {row.device_id || 'device'} · {row.created_at}
                            </div>
                          ))}
                          {(networkInventory?.ipam_reservations || []).length === 0 && (networkInventory?.config_backups || []).length === 0 ? (
                            <div className={cn('rounded-2xl border border-dashed p-4 text-sm', adminDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500')}>
                              No reservations or backups yet.
                            </div>
                          ) : null}
                        </div>
                      </div>
                  </section>

                  <section className={cn('rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/75')}>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-sky-400">Operational Surfaces</p>
                          <h3 className={cn('mt-1 text-2xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Security • Analytics • Users</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => refreshNetworkInventory()}
                          className={cn('inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium', adminDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200')}
                        >
                          <RefreshCw className="h-4 w-4" />
                          Refresh
                        </button>
                      </div>
                      <div className="mt-5 grid gap-4 md:grid-cols-3">
                        <div className={cn('rounded-[24px] border p-5', adminDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white')}>
                          <p className="text-xs uppercase tracking-[0.22em] text-sky-400">IDS/IPS + Rogue AP</p>
                          <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>Security monitoring feeds.</p>
                          <div className={cn('mt-4 space-y-2 text-sm', adminDark ? 'text-slate-300' : 'text-slate-700')}>
                            {(networkInventory?.ids_alerts || []).slice(0, 3).map((alert) => (
                              <div key={alert.id} className={cn('rounded-2xl border px-4 py-3', adminDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50')}>
                                {alert.severity} · {alert.message}
                              </div>
                            ))}
                            {(networkInventory?.rogue_aps || []).slice(0, 2).map((ap) => (
                              <div key={ap.id} className={cn('rounded-2xl border px-4 py-3', adminDark ? 'border-rose-400/20 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700')}>
                                Rogue AP: {ap.ssid}
                              </div>
                            ))}
                            <div className={cn('rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700')}>
                              Firmware jobs: {(networkInventory?.firmware_jobs || []).length} · Bulk config jobs: {(networkInventory?.bulk_config_jobs || []).length}
                            </div>
                          </div>
                        </div>

                        <div className={cn('rounded-[24px] border p-5', adminDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white')}>
                          <p className="text-xs uppercase tracking-[0.22em] text-sky-400">NetFlow + Alert Integrations</p>
                          <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>Traffic analytics and alert sinks.</p>
                          <div className={cn('mt-4 space-y-2 text-sm', adminDark ? 'text-slate-300' : 'text-slate-700')}>
                            {(networkInventory?.flow_stats || []).slice(0, 2).map((flow) => (
                              <div key={flow.id} className={cn('rounded-2xl border px-4 py-3', adminDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50')}>
                                Flows: {flow.total_flows}
                              </div>
                            ))}
                            {(networkInventory?.alert_integrations || []).slice(0, 2).map((integration) => (
                              <div key={integration.id} className={cn('rounded-2xl border px-4 py-3', adminDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50')}>
                                {integration.type}: {integration.target}
                              </div>
                            ))}
                            <div className={cn('rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700')}>
                              Config audits: {(networkInventory?.config_audit || []).length} · QoS policies: {(networkInventory?.qos_policies || []).length}
                            </div>
                            <div className={cn('rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700')}>
                              Traffic shaping: {(networkInventory?.traffic_shapes || []).length} · Restore jobs: {(networkInventory?.config_restore_jobs || []).length}
                            </div>
                          </div>
                        </div>

                        <div className={cn('rounded-[24px] border p-5', adminDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white')}>
                          <p className="text-xs uppercase tracking-[0.22em] text-sky-400">Client Monitoring + Auth Servers</p>
                          <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>Connected clients and RADIUS/TACACS.</p>
                          <div className={cn('mt-4 space-y-2 text-sm', adminDark ? 'text-slate-300' : 'text-slate-700')}>
                            {(networkInventory?.clients || []).slice(0, 3).map((client) => (
                              <div key={client.id} className={cn('rounded-2xl border px-4 py-3', adminDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50')}>
                                {client.ip || client.mac} · {client.status || 'online'}
                              </div>
                            ))}
                            {(networkInventory?.auth_servers || []).slice(0, 2).map((srv) => (
                              <div key={srv.id} className={cn('rounded-2xl border px-4 py-3', adminDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50')}>
                                {srv.type}: {srv.host}
                              </div>
                            ))}
                            <div className={cn('rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700')}>
                              Active tunnels: {(networkInventory?.tunnels || []).length} · VPN tunnels: {(networkInventory?.vpn_tunnels || []).length}
                            </div>
                            <div className={cn('rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700')}>
                              Firewall policies: {(networkInventory?.firewall_policies || []).length}
                            </div>
                          </div>
                        </div>
                      </div>
                  </section>

                  <section className={cn('rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/75')}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-sky-400">Network Capabilities</p>
                        <h3 className={cn('mt-1 text-2xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>6 capability groups</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn('flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium', adminDark ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700')}>
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          live
                        </div>
                        <button type="button" className={cn('inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium', adminDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200')}>
                          <Filter className="h-4 w-4" />
                          Filter
                        </button>
                        <button type="button" className={cn('inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium', adminDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200')}>
                          <SlidersHorizontal className="h-4 w-4" />
                          Sort
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {NETWORK_CAPABILITIES.map((section) => (
                        <div key={section.title} className={cn('rounded-[24px] border p-5', adminDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white')}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-sky-400">live</p>
                              <h4 className={cn('mt-1 text-lg font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>{section.title}</h4>
                            </div>
                            <div className={cn('rounded-2xl px-3 py-1.5 text-sm font-semibold', adminDark ? 'bg-sky-500/10 text-sky-300' : 'bg-sky-50 text-sky-700')}>
                              {section.count} capabilities
                            </div>
                          </div>
                          <ul className={cn('mt-4 space-y-2 text-sm', adminDark ? 'text-slate-300' : 'text-slate-600')}>
                            {section.items.map((item) => (
                              <li key={item} className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-sky-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                        <div className={cn('rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/75')}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.22em] text-sky-400">Verification Queue</p>
                              <h3 className={cn('mt-1 text-2xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>EU/USA docs pending review</h3>
                            </div>
                            <Bell className="h-6 w-6 text-sky-400" />
                          </div>
                          <div className={cn('mt-5 rounded-[24px] border p-5', adminDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white')}>
                            {verificationQueue.length ? (
                              <div className="space-y-2">
                                {verificationQueue.slice(0, 4).map((row) => (
                                  <div key={row.id || row.user_id} className={cn('rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50')}>
                                    <div className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{row.user_name || row.user_email || row.user_id}</div>
                                    <div className={cn('mt-1 text-xs', adminDark ? 'text-slate-400' : 'text-slate-600')}>Doc: {row.doc_type || row.type || 'business'} · Status: {row.status || 'pending'}</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className={cn('text-sm', adminDark ? 'text-slate-300' : 'text-slate-600')}>
                                {emptyCopy('verification.pending', 'No pending verifications in queue.')}
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={() => refreshVerificationQueue()}
                              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30"
                            >
                              Refresh
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 space-y-3">
                            <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50')}>
                              <div className="flex items-center justify-between gap-3">
                                <h4 className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>Dispute Radar</h4>
                                <button type="button" onClick={() => refreshDisputes()} className="inline-flex items-center gap-2 text-sm text-sky-400">
                                  Sync
                                  <ArrowRight className="h-4 w-4" />
                                </button>
                              </div>
                              {disputes.length ? (
                                <div className="mt-2 space-y-2">
                                  {disputes.slice(0, 3).map((dispute) => (
                                    <div key={dispute.id} className={cn('rounded-2xl border px-4 py-3 text-sm', adminDark ? 'border-white/10 bg-slate-900/50 text-slate-300' : 'border-slate-200 bg-white text-slate-700')}>
                                      {dispute.title || dispute.contract_id || 'Dispute'} · {dispute.status || 'open'}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className={cn('mt-2 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                                  {emptyCopy('disputes.none', 'No active disputes.')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={cn('rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/75')}>
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.22em] text-sky-400">Audit Pulse</p>
                              <h3 className={cn('mt-1 text-2xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Most recent admin actions</h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => refreshAudit()}
                              className={cn('inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium', adminDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200')}
                            >
                              <RefreshCw className="h-4 w-4" />
                              Refresh
                            </button>
                          </div>
                          <div className="mt-5 grid gap-3 lg:grid-cols-2">
                            {filteredNetworkAuditRows.slice(0, 6).map((entry) => (
                              <div key={entry.id || entry.at} className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white')}>
                                <div className="flex items-center justify-between gap-3">
                                  <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{entry.path || entry.action || 'Admin action'}</p>
                                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">{entry.status ?? 200}</span>
                                </div>
                                <p className={cn('mt-2 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{entry.at ? new Date(entry.at).toLocaleString() : '--'} · system</p>
                              </div>
                            ))}
                            {!filteredNetworkAuditRows.length ? (
                              <div className={cn('rounded-2xl border border-dashed p-4 text-sm', adminDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500')}>
                                No recent activity.
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </section>

                      <section className={cn('rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/75')}>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-sky-400">Admin Audit Log</p>
                            <h3 className={cn('mt-1 text-2xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Immutable, tamper-evident audit trail</h3>
                          </div>
                          <div className="relative w-full max-w-md">
                            <Search className={cn('pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2', adminDark ? 'text-slate-500' : 'text-slate-400')} />
                            <input
                              value={networkAuditQuery}
                              onChange={(event) => setNetworkAuditQuery(event.target.value)}
                              placeholder="Search audit..."
                              className={cn(
                                'w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition-all',
                                adminDark
                                  ? 'border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-500 focus:border-sky-400/60'
                                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                              )}
                            />
                          </div>
                        </div>

                        <div className={cn('mt-5 overflow-hidden rounded-[24px] border', adminDark ? 'border-white/10' : 'border-slate-200')}>
                          <div
                            className={cn(
                              'grid grid-cols-[1.4fr_0.9fr_1.4fr_0.8fr] gap-3 border-b px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em]',
                              adminDark ? 'border-white/10 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
                            )}
                          >
                            <div>Endpoint</div>
                            <div>Time</div>
                            <div>Actor / Device</div>
                            <div>Status</div>
                          </div>
                          <div className={cn('divide-y', adminDark ? 'divide-white/10' : 'divide-slate-200')}>
                            {filteredNetworkAuditRows.slice(0, 30).map((entry) => (
                              <div
                                key={entry.id || entry.at}
                                className={cn('grid grid-cols-[1.4fr_0.9fr_1.4fr_0.8fr] gap-3 px-4 py-4 text-sm', adminDark ? 'bg-slate-950/30' : 'bg-white')}
                              >
                                <div className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{entry.path || entry.action || '--'}</div>
                                <div className={adminDark ? 'text-slate-400' : 'text-slate-600'}>{entry.at ? new Date(entry.at).toLocaleString() : '--'}</div>
                                <div className={adminDark ? 'text-slate-300' : 'text-slate-700'}>
                                  <div className="truncate">Actor: {entry.actor_id || entry.actor || 'system'}</div>
                                  <div className={adminDark ? 'text-slate-500' : 'text-slate-500'}>IP: {entry.ip || '--'} / Device: {entry.device_id || '--'}</div>
                                </div>
                                <div>
                                  <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">{entry.status ?? 200}</span>
                                </div>
                              </div>
                            ))}
                            {!filteredNetworkAuditRows.length ? (
                              <div className={cn('px-4 py-4 text-sm', adminDark ? 'text-slate-400' : 'text-slate-500')}>No audit entries found.</div>
                            ) : null}
                          </div>
                        </div>
                  </section>
                </div>
              </div>
            ) : null}

            {activeCategory === 'server-admin' ? (
              <div className={cn('relative overflow-hidden rounded-[32px] border p-4 sm:p-6', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/75')}>
                <div className="absolute inset-0 -z-10 overflow-hidden">
                  <div className={cn('absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl', adminDark ? 'bg-sky-500/20' : 'bg-sky-400/20')} />
                  <div className={cn('absolute top-40 -left-20 h-72 w-72 rounded-full blur-3xl', adminDark ? 'bg-blue-500/15' : 'bg-blue-300/25')} />
                  <div className={cn('absolute bottom-0 right-0 h-96 w-96 rounded-full blur-3xl', adminDark ? 'bg-cyan-500/10' : 'bg-cyan-300/20')} />
                </div>

                <div className="mx-auto max-w-7xl space-y-6">
                  <header
                    className={cn(
                      'flex flex-col gap-4 rounded-[2rem] border p-5 shadow-2xl shadow-sky-900/10 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between',
                      adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/70'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'rounded-3xl border bg-gradient-to-br p-4 shadow-lg',
                          adminDark
                            ? 'border-sky-400/20 from-sky-400/20 to-blue-500/10 text-sky-200 shadow-sky-500/10'
                            : 'border-sky-200 from-sky-100 to-blue-50 text-sky-700 shadow-sky-200/40'
                        )}
                      >
                        <Sparkles className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className={cn('text-2xl font-semibold tracking-tight sm:text-3xl', adminDark ? 'text-white' : 'text-slate-900')}>
                            Server Admin + App Management
                          </h1>
                          <Pill>Full Stack</Pill>
                          <Pill>
                            <span
                              className={cn(
                                'h-2 w-2 rounded-full',
                                adminDark
                                  ? 'bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
                                  : 'bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]'
                              )}
                            />
                            live
                          </Pill>
                        </div>
                        <p className={cn('mt-2 max-w-3xl text-sm leading-6', adminDark ? 'text-slate-300' : 'text-slate-600')}>
                          Premium control plane for servers, apps, security, backups, search, and audit operations with a blue-sky themed surface.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdminDark((v) => !v)}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg transition hover:-translate-y-0.5',
                          adminDark
                            ? 'border-white/10 bg-white/10 text-white shadow-sky-950/20 hover:bg-white/15'
                            : 'border-slate-200 bg-white text-slate-700 shadow-slate-200/40 hover:bg-slate-50'
                        )}
                      >
                        {adminDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                        {adminDark ? 'Light mode' : 'Dark mode'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          refreshServerAdminState()
                          refreshIntegrationStatus()
                          refreshOpenSearchStatus()
                          refreshAudit()
                        }}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition',
                          adminDark
                            ? 'border-sky-400/20 bg-sky-500/10 text-sky-200 hover:bg-sky-500/15'
                            : 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
                        )}
                      >
                        <RefreshCw className="h-4 w-4" /> Refresh
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          downloadJson('server_admin_snapshot.json', {
                            at: new Date().toISOString(),
                            server_admin: serverAdminState,
                            integrations: integrationStatus,
                            opensearch: { config: openSearchConfig, status: openSearchStatus },
                            email: emailConfig,
                            audit: audit.slice(0, 40),
                          })
                        }
                        className={cn(
                          'inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition',
                          adminDark ? 'border-white/10 bg-white/10 text-white hover:bg-white/15' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <Download className="h-4 w-4" /> Export
                      </button>
                    </div>
                  </header>

                  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard loading={loading} label="Total accounts" value={formatNumber(users.length)} hint="Owner access enabled" icon={Users} />
                    <MetricCard loading={loading} label="Pending verifications" value={formatNumber(verificationQueue.length)} hint="Audit gate clear" icon={ShieldCheck} />
                    <MetricCard loading={loading} label="Infra alerts" value={formatNumber((infraState?.zombie_processes || []).length)} hint="System pulse live" icon={Bell} />
                    <MetricCard loading={loading} label="Open tickets" value={formatNumber(supportTickets.length)} hint="Support queue view" icon={Inbox} />
                  </section>

                  <section className="grid gap-4 xl:grid-cols-3">
                    <div className={cn('xl:col-span-2 rounded-[2rem] border p-5 shadow-xl shadow-sky-900/10 backdrop-blur-xl', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/70')}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className={cn('text-xs uppercase tracking-[0.22em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>4 sections</p>
                          <h2 className={cn('mt-1 text-xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Live operations overview</h2>
                        </div>
                        <Pill>24/7 active</Pill>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {[
                          {
                            title: 'Web Server + PHP',
                            description: 'Config editor and version manager.',
                            icon: Server,
                            onRefresh: refreshServerAdminState,
                            lines: [`Web: ${serverAdminState?.web_server?.type || '--'} · ${serverAdminState?.web_server?.status || '--'}`, `PHP ${serverAdminState?.php?.version || '--'}`],
                            accent: 'from-sky-500/20 via-cyan-500/10 to-blue-500/10',
                          },
                          {
                            title: 'Domains + Apps',
                            description: 'DNS, installers, and file manager.',
                            icon: Globe2,
                            onRefresh: refreshServerAdminState,
                            lines: [
                              ...((serverAdminState?.domains || []).slice(0, 2).map((domain) => `${domain.domain} · ${domain.status}`) || []),
                              ...((serverAdminState?.apps || []).slice(0, 1).map((app) => `${app.name} · ${app.version}`) || []),
                              `Files: ${(serverAdminState?.files || []).length}`,
                            ],
                            accent: 'from-cyan-500/20 via-sky-500/10 to-blue-500/10',
                          },
                          {
                            title: 'RBAC + Queues + Backups',
                            description: 'Admin roles and task queues.',
                            icon: Lock,
                            onRefresh: refreshServerAdminState,
                            lines: [
                              `IDS status: ${serverAdminState?.security?.ids_status || 'idle'}`,
                              `DB admin sessions: ${(serverAdminState?.db_admin_sessions || []).length}`,
                              `Backup providers: ${(serverAdminState?.backups?.providers || []).length}`,
                              `Auto updates: ${serverAdminState?.automation?.auto_updates ? 'On' : 'Off'} · Window ${serverAdminState?.automation?.patch_window || '--'}`,
                            ],
                            accent: 'from-blue-500/20 via-indigo-500/10 to-sky-500/10',
                          },
                          {
                            title: 'Integrations + Installers',
                            description: 'Provider wiring and tooling status.',
                            icon: Workflow,
                            onRefresh: refreshIntegrationStatus,
                            lines: [
                              `Signature: ${integrationStatus?.signature?.provider || '--'} · ${integrationStatus?.signature?.status || 'missing'}`,
                              `Bank validation: ${integrationStatus?.bank_validation?.provider || '--'} · ${integrationStatus?.bank_validation?.status || 'missing'}`,
                              `IDS/IPS: ${integrationStatus?.ids_ips?.status || 'missing'}`,
                              `Alert delivery: Slack ${integrationStatus?.alerts?.slack ? 'on' : 'off'} · SMS ${integrationStatus?.alerts?.sms ? 'on' : 'off'} · Email ${integrationStatus?.alerts?.email ? 'on' : 'off'}`,
                              `Backups: S3 ${integrationStatus?.backups?.s3 ? 'on' : 'off'} · GCS ${integrationStatus?.backups?.gcs ? 'on' : 'off'} · Spaces ${integrationStatus?.backups?.spaces ? 'on' : 'off'}`,
                              `Installer: ${integrationStatus?.installer?.provider || 'winget'} · ${integrationStatus?.installer?.platform || 'windows'}`,
                            ],
                            accent: 'from-sky-500/20 via-blue-500/10 to-cyan-500/10',
                          },
                        ].map((card) => {
                          const Icon = card.icon
                          return (
                            <div key={card.title} className={cn('rounded-3xl border p-5 shadow-lg shadow-sky-950/10', adminDark ? `border-white/10 bg-gradient-to-br ${card.accent}` : 'border-slate-200 bg-white')}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <div className={cn('rounded-2xl border p-3 backdrop-blur-md', adminDark ? 'border-white/10 bg-slate-950/30 text-sky-100' : 'border-sky-200 bg-sky-50 text-sky-700')}>
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>{card.title}</h3>
                                      <Pill>live</Pill>
                                    </div>
                                    <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-300' : 'text-slate-600')}>{card.description}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={card.onRefresh}
                                  className={cn(
                                    'inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition',
                                    adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                                  )}
                                >
                                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                                </button>
                              </div>

                              <div className="mt-4 space-y-2">
                                {card.lines.filter(Boolean).slice(0, 6).map((line) => (
                                  <div
                                    key={line}
                                    className={cn(
                                      'rounded-2xl border px-4 py-3 text-sm shadow-sm',
                                      adminDark ? 'border-white/10 bg-slate-950/35 text-slate-200' : 'border-slate-200 bg-white text-slate-700'
                                    )}
                                  >
                                    {line}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className={cn('rounded-[2rem] border p-5 shadow-xl shadow-sky-900/10 backdrop-blur-xl', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/70')}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={cn('text-xs uppercase tracking-[0.22em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Platform Snapshot</p>
                          <h2 className={cn('mt-1 text-xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>System health</h2>
                        </div>
                        <Shield className={cn('h-5 w-5', adminDark ? 'text-sky-300' : 'text-sky-600')} />
                      </div>

                      <div className="mt-5 space-y-3">
                        {[
                          ['MFA Required', securityContext.mfa_required ? 'On' : 'Off'],
                          ['Exec Enabled', securityContext.exec_enabled ? 'On' : 'Simulated'],
                          ['OpenSearch', openSearchConfig.enabled ? 'On' : 'Off'],
                          ['Email delivery', emailConfig.enabled ? 'Enabled' : 'Skipped if not configured'],
                          ['Backup providers', `${(serverAdminState?.backups?.providers || []).length} configured`],
                        ].map(([label, value]) => (
                          <div key={label} className={cn('rounded-2xl border px-4 py-3', adminDark ? 'border-white/10 bg-slate-950/35' : 'border-slate-200 bg-white')}>
                            <div className="flex items-center justify-between gap-3">
                              <span className={cn('text-sm', adminDark ? 'text-slate-300' : 'text-slate-600')}>{label}</span>
                              <Pill>{value}</Pill>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className={cn('mt-5 rounded-3xl border p-4', adminDark ? 'border-sky-400/20 bg-sky-500/10' : 'border-sky-200 bg-sky-50')}>
                        <div className="flex items-start gap-3">
                          <TerminalSquare className={cn('mt-0.5 h-5 w-5', adminDark ? 'text-sky-300' : 'text-sky-600')} />
                          <div>
                            <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>OpenSearch control</p>
                            <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-300' : 'text-slate-600')}>
                              Enable search only when reachable, then save settings, ensure indices, and reindex.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOpenSearchConfig((prev) => ({ ...prev, enabled: true }))}
                          className={cn(
                            'mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px]',
                            adminDark ? 'bg-sky-500 shadow-sky-500/25' : 'bg-sky-600 shadow-sky-500/20'
                          )}
                        >
                          Enable OpenSearch <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </section>

                  <section className={cn('rounded-[2rem] border p-5 shadow-xl shadow-sky-900/10 backdrop-blur-xl', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/70')}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className={cn('text-xs uppercase tracking-[0.22em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Configuration surfaces</p>
                        <h2 className={cn('mt-1 text-xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>OpenSearch + Email Notifications</h2>
                      </div>
                      <Pill>Premium controls</Pill>
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-2">
                      <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                        <div className="flex items-center gap-3">
                          <Search className={cn('h-5 w-5', adminDark ? 'text-sky-300' : 'text-sky-600')} />
                          <div>
                            <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>OpenSearch</h3>
                            <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>Faceted search engine + fast estimates.</p>
                          </div>
                        </div>
                        <div className={cn('mt-2 text-sm', adminDark ? 'text-slate-300' : 'text-slate-600')}>
                          Enabled: {openSearchConfig.enabled ? 'On' : 'Off'} · Configured: {openSearchStatus?.configured ? 'yes' : 'no'} · Reachable: {openSearchStatus?.reachable ? 'yes' : 'no'}
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <label className="md:col-span-2">
                            <span className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>OpenSearch URL</span>
                            <input
                              value={openSearchConfig.url}
                              onChange={(e) => setOpenSearchConfig((prev) => ({ ...prev, url: e.target.value }))}
                              placeholder="http://localhost:9200"
                              className={cn(
                                'w-full rounded-2xl border px-4 py-3 text-sm outline-none',
                                adminDark
                                  ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                              )}
                            />
                          </label>
                          <label>
                            <span className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Username (optional)</span>
                            <input
                              value={openSearchConfig.username}
                              onChange={(e) => setOpenSearchConfig((prev) => ({ ...prev, username: e.target.value }))}
                              placeholder="username"
                              className={cn(
                                'w-full rounded-2xl border px-4 py-3 text-sm outline-none',
                                adminDark
                                  ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                              )}
                            />
                          </label>
                          <label>
                            <span className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Password (optional)</span>
                            <input
                              value={openSearchConfig.password}
                              onChange={(e) => setOpenSearchConfig((prev) => ({ ...prev, password: e.target.value }))}
                              placeholder="••••••••"
                              className={cn(
                                'w-full rounded-2xl border px-4 py-3 text-sm outline-none',
                                adminDark
                                  ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                              )}
                            />
                          </label>
                          <label>
                            <span className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Index prefix</span>
                            <input
                              value={openSearchConfig.index_prefix}
                              onChange={(e) => setOpenSearchConfig((prev) => ({ ...prev, index_prefix: e.target.value }))}
                              placeholder="app"
                              className={cn(
                                'w-full rounded-2xl border px-4 py-3 text-sm outline-none',
                                adminDark
                                  ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                              )}
                            />
                          </label>
                          <label>
                            <span className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Timeout (ms)</span>
                            <input
                              type="number"
                              value={openSearchConfig.timeout_ms}
                              onChange={(e) => setOpenSearchConfig((prev) => ({ ...prev, timeout_ms: e.target.value }))}
                              placeholder="3000"
                              className={cn(
                                'w-full rounded-2xl border px-4 py-3 text-sm outline-none',
                                adminDark
                                  ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                              )}
                            />
                          </label>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <label className={cn('inline-flex items-center gap-2 text-sm', adminDark ? 'text-slate-300' : 'text-slate-700')}>
                            <input
                              type="checkbox"
                              checked={openSearchConfig.enabled}
                              onChange={(e) => setOpenSearchConfig((prev) => ({ ...prev, enabled: e.target.checked }))}
                              className="h-4 w-4"
                            />
                            Enabled
                          </label>
                          <label className={cn('inline-flex items-center gap-2 text-sm', adminDark ? 'text-slate-300' : 'text-slate-700')}>
                            <input
                              type="checkbox"
                              checked={openSearchConfig.verify_tls}
                              onChange={(e) => setOpenSearchConfig((prev) => ({ ...prev, verify_tls: e.target.checked }))}
                              className="h-4 w-4"
                            />
                            Verify TLS certificate
                          </label>
                          <button
                            type="button"
                            onClick={refreshOpenSearchStatus}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition',
                              adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            )}
                          >
                            <RefreshCw className="h-4 w-4" /> Refresh status
                          </button>
                        </div>

                        {openSearchNotice ? <div className="mt-3 text-sm text-emerald-400">{openSearchNotice}</div> : null}
                        {openSearchError ? <div className="mt-3 text-sm text-rose-300">{openSearchError}</div> : null}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={saveOpenSearchConfig}
                            disabled={openSearchConfigBusy}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-60',
                              adminDark ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:translate-y-[-1px]' : 'bg-sky-600 text-white shadow-lg shadow-sky-500/20 hover:translate-y-[-1px]'
                            )}
                          >
                            {openSearchConfigBusy ? 'Saving...' : 'Save settings'}
                          </button>
                          <button
                            type="button"
                            onClick={() => runOpenSearchAction('opensearch.test_connection')}
                            disabled={Boolean(openSearchActionBusy)}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition disabled:opacity-60',
                              adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            )}
                          >
                            {openSearchActionBusy === 'opensearch.test_connection' ? 'Testing...' : 'Test connection'}
                          </button>
                          <button
                            type="button"
                            onClick={() => runOpenSearchAction('opensearch.ensure_indices')}
                            disabled={Boolean(openSearchActionBusy)}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition disabled:opacity-60',
                              adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            )}
                          >
                            Ensure indices
                          </button>
                          <button
                            type="button"
                            onClick={() => runOpenSearchAction('opensearch.reindex_all', { reset: openSearchReset })}
                            disabled={Boolean(openSearchActionBusy)}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition disabled:opacity-60',
                              adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            )}
                          >
                            Reindex all
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <label className={cn('inline-flex items-center gap-2 text-sm', adminDark ? 'text-slate-300' : 'text-slate-700')}>
                            <input type="checkbox" checked={openSearchReset} onChange={(e) => setOpenSearchReset(e.target.checked)} className="h-4 w-4" />
                            Reset
                          </label>
                          <input
                            value={openSearchOrgId}
                            onChange={(e) => setOpenSearchOrgId(e.target.value)}
                            placeholder="Org ID (reindex org)"
                            className={cn(
                              'flex-1 rounded-2xl border px-4 py-3 text-sm outline-none',
                              adminDark
                                ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                                : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => runOpenSearchAction('opensearch.reindex_org', { org_id: openSearchOrgId })}
                            disabled={Boolean(openSearchActionBusy) || !String(openSearchOrgId || '').trim()}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition disabled:opacity-60',
                              adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            )}
                          >
                            Reindex org
                          </button>
                        </div>

                        <p className={cn('mt-3 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                          Save settings → Ensure indices → Reindex (all or org). Search uses OpenSearch only when enabled + reachable.
                        </p>
                      </div>

                      <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                        <div className="flex items-center gap-3">
                          <Mail className={cn('h-5 w-5', adminDark ? 'text-sky-300' : 'text-sky-600')} />
                          <div>
                            <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Email Notifications</h3>
                            <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>SMTP or Gmail API delivery for reminders.</p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <label className="md:col-span-2">
                            <span className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Enabled</span>
                            <label className={cn('inline-flex items-center gap-2 text-sm', adminDark ? 'text-slate-200' : 'text-slate-700')}>
                              <input type="checkbox" checked={emailConfig.enabled} onChange={(e) => setEmailConfig((prev) => ({ ...prev, enabled: e.target.checked }))} className="h-4 w-4" />
                              {emailConfig.enabled ? 'On' : 'Off'}
                            </label>
                          </label>

                          <label>
                            <span className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Provider</span>
                            <select
                              value={emailConfig.provider}
                              onChange={(e) => setEmailConfig((prev) => ({ ...prev, provider: e.target.value }))}
                              className={cn(
                                'w-full rounded-2xl border px-4 py-3 text-sm outline-none',
                                adminDark ? 'border-white/10 bg-white/5 text-white focus:border-sky-400/40' : 'border-slate-200 bg-white text-slate-900 focus:border-sky-400'
                              )}
                            >
                              <option value="smtp">SMTP</option>
                              <option value="gmail_api">Gmail API</option>
                            </select>
                          </label>

                          <label>
                            <span className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>From name</span>
                            <input
                              value={emailConfig.from_name}
                              onChange={(e) => setEmailConfig((prev) => ({ ...prev, from_name: e.target.value }))}
                              placeholder="Admin Team"
                              className={cn(
                                'w-full rounded-2xl border px-4 py-3 text-sm outline-none',
                                adminDark
                                  ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                              )}
                            />
                          </label>

                          <label>
                            <span className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>From email</span>
                            <input
                              value={emailConfig.from_email}
                              onChange={(e) => setEmailConfig((prev) => ({ ...prev, from_email: e.target.value }))}
                              placeholder="admin@example.com"
                              className={cn(
                                'w-full rounded-2xl border px-4 py-3 text-sm outline-none',
                                adminDark
                                  ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                              )}
                            />
                          </label>

                          <label className="md:col-span-2">
                            <span className={cn('mb-2 block text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Test recipient</span>
                            <input
                              value={emailConfig.test_recipient}
                              onChange={(e) => setEmailConfig((prev) => ({ ...prev, test_recipient: e.target.value }))}
                              placeholder="recipient@example.com"
                              className={cn(
                                'w-full rounded-2xl border px-4 py-3 text-sm outline-none',
                                adminDark
                                  ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                              )}
                            />
                          </label>
                        </div>

                        {emailConfigNotice ? <div className="mt-3 text-sm text-emerald-400">{emailConfigNotice}</div> : null}
                        {emailConfigError ? <div className="mt-3 text-sm text-rose-300">{emailConfigError}</div> : null}

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={saveEmailConfig}
                            disabled={emailConfigBusy}
                            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:translate-y-[-1px] disabled:opacity-60"
                          >
                            {emailConfigBusy ? 'Saving...' : 'Save settings'}
                          </button>
                          <button
                            type="button"
                            onClick={sendEmailTest}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition',
                              adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            )}
                          >
                            Send test
                          </button>
                        </div>

                        <div className={cn('mt-4 rounded-2xl border p-4 text-sm', adminDark ? 'border-amber-500/20 bg-amber-500/10 text-amber-100' : 'border-amber-200 bg-amber-50 text-amber-800')}>
                          Secrets remain in env vars. If provider is not configured, email is skipped silently.
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className={cn('mt-6 rounded-[2rem] border p-5 shadow-xl shadow-sky-900/10 backdrop-blur-xl', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/70')}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className={cn('text-xs uppercase tracking-[0.22em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Admin UI Settings</p>
                        <h2 className={cn('mt-1 text-xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Role gating + UI fallbacks + copy</h2>
                        <p className={cn('mt-2 max-w-3xl text-sm', adminDark ? 'text-slate-300' : 'text-slate-600')}>
                          These settings control what the Admin Panel UI shows when backend inventory is unavailable, and which roles may view the admin panel UI.
                          Backend security still enforces access for all <span className="font-medium">/api/admin</span> routes.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={saveAdminUiSettings}
                        disabled={adminUiSettingsBusy}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition disabled:opacity-60',
                          adminDark ? 'bg-sky-500 shadow-sky-500/25 hover:translate-y-[-1px]' : 'bg-sky-600 shadow-sky-500/20 hover:translate-y-[-1px]'
                        )}
                      >
                        {adminUiSettingsBusy ? 'Saving...' : 'Save settings'}
                      </button>
                    </div>

                    {adminUiSettingsNotice ? <div className="mt-3 text-sm text-emerald-400">{adminUiSettingsNotice}</div> : null}
                    {adminUiSettingsError ? <div className="mt-3 text-sm text-rose-300">{adminUiSettingsError}</div> : null}

                    <div className="mt-5 grid gap-5 lg:grid-cols-2">
                      <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                        <div className="flex items-center gap-3">
                          <ShieldCheck className={cn('h-5 w-5', adminDark ? 'text-sky-300' : 'text-sky-600')} />
                          <div>
                            <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Allowed roles</h3>
                            <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>Comma or newline separated. Known roles: buyer, factory, buying_house, owner, admin, agent.</p>
                          </div>
                        </div>
                        <textarea
                          value={adminUiSettingsForm.allowed_roles}
                          onChange={(e) => {
                            setAdminUiSettingsDirty(true)
                            setAdminUiSettingsForm((prev) => ({ ...prev, allowed_roles: e.target.value }))
                          }}
                          placeholder="owner, admin"
                          rows={3}
                          className={cn(
                            'mt-4 w-full resize-y rounded-2xl border px-4 py-3 text-sm outline-none',
                            adminDark
                              ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                              : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                          )}
                        />
                      </div>

                      <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                        <div className="flex items-center gap-3">
                          <LayoutDashboard className={cn('h-5 w-5', adminDark ? 'text-sky-300' : 'text-sky-600')} />
                          <div>
                            <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Fallback inventory</h3>
                            <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>JSON array of objects: id, label, icon_name (optional).</p>
                          </div>
                        </div>
                        <textarea
                          value={adminUiSettingsForm.fallback_inventory_json}
                          onChange={(e) => {
                            setAdminUiSettingsDirty(true)
                            setAdminUiSettingsForm((prev) => ({ ...prev, fallback_inventory_json: e.target.value }))
                          }}
                          rows={10}
                          className={cn(
                            'mt-4 w-full resize-y rounded-2xl border px-4 py-3 font-mono text-xs outline-none',
                            adminDark
                              ? 'border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-sky-400/40'
                              : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                          )}
                        />
                        <div className={cn('mt-3 text-xs', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                          Icon names are resolved via a safe registry (e.g. <span className={cn('font-mono', adminDark ? 'text-slate-200' : 'text-slate-800')}>ShieldCheck</span>, <span className={cn('font-mono', adminDark ? 'text-slate-200' : 'text-slate-800')}>Server</span>, <span className={cn('font-mono', adminDark ? 'text-slate-200' : 'text-slate-800')}>Network</span>, <span className={cn('font-mono', adminDark ? 'text-slate-200' : 'text-slate-800')}>Database</span>, <span className={cn('font-mono', adminDark ? 'text-slate-200' : 'text-slate-800')}>Settings</span>, <span className={cn('font-mono', adminDark ? 'text-slate-200' : 'text-slate-800')}>Lock</span>).
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-2">
                      <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                        <div className="flex items-center gap-3">
                          <BarChart3 className={cn('h-5 w-5', adminDark ? 'text-sky-300' : 'text-sky-600')} />
                          <div>
                            <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Chart theme</h3>
                            <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>Pie palette + chart fallback labels.</p>
                          </div>
                        </div>

                        <label className="mt-4 block">
                          <div className={cn('mb-2 text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-600')}>Pie palette (hex colors)</div>
                          <textarea
                            value={adminUiSettingsForm.pie_palette}
                            onChange={(e) => {
                              setAdminUiSettingsDirty(true)
                              setAdminUiSettingsForm((prev) => ({ ...prev, pie_palette: e.target.value }))
                            }}
                            rows={4}
                            placeholder="#38bdf8\n#60a5fa\n#0f172a"
                            className={cn(
                              'w-full resize-y rounded-2xl border px-4 py-3 font-mono text-xs outline-none',
                              adminDark
                                ? 'border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-sky-400/40'
                                : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                            )}
                          />
                        </label>

                        <label className="mt-4 block">
                          <div className={cn('mb-2 text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-600')}>Contract status “no data” label</div>
                          <input
                            value={adminUiSettingsForm.contract_no_data_label}
                            onChange={(e) => {
                              setAdminUiSettingsDirty(true)
                              setAdminUiSettingsForm((prev) => ({ ...prev, contract_no_data_label: e.target.value }))
                            }}
                            placeholder="No Data"
                            className={cn(
                              'w-full rounded-2xl border px-4 py-3 text-sm outline-none',
                              adminDark
                                ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                                : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                            )}
                          />
                        </label>
                      </div>

                      <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                        <div className="flex items-center gap-3">
                          <Gauge className={cn('h-5 w-5', adminDark ? 'text-sky-300' : 'text-sky-600')} />
                          <div>
                            <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>CMS weekly trend fallback</h3>
                            <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>Used when analytics trend data is unavailable.</p>
                          </div>
                        </div>
                        <textarea
                          value={adminUiSettingsForm.cms_weekly_trend_json}
                          onChange={(e) => {
                            setAdminUiSettingsDirty(true)
                            setAdminUiSettingsForm((prev) => ({ ...prev, cms_weekly_trend_json: e.target.value }))
                          }}
                          rows={10}
                          className={cn(
                            'mt-4 w-full resize-y rounded-2xl border px-4 py-3 font-mono text-xs outline-none',
                            adminDark
                              ? 'border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-sky-400/40'
                              : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-2">
                      <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                        <div className="flex items-center gap-3">
                          <ShieldAlert className={cn('h-5 w-5', adminDark ? 'text-sky-300' : 'text-sky-600')} />
                          <div>
                            <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Ultra Security demo data</h3>
                            <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>Mini-chart points, KPI tiles, and capabilities list.</p>
                          </div>
                        </div>

                        <label className="mt-4 block">
                          <div className={cn('mb-2 text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-600')}>Mini-chart points (JSON array)</div>
                          <textarea
                            value={adminUiSettingsForm.ultra_mini_points_json}
                            onChange={(e) => {
                              setAdminUiSettingsDirty(true)
                              setAdminUiSettingsForm((prev) => ({ ...prev, ultra_mini_points_json: e.target.value }))
                            }}
                            rows={6}
                            className={cn(
                              'w-full resize-y rounded-2xl border px-4 py-3 font-mono text-xs outline-none',
                              adminDark
                                ? 'border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-sky-400/40'
                                : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                            )}
                          />
                        </label>

                        <label className="mt-4 block">
                          <div className={cn('mb-2 text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-600')}>Mini-chart KPIs (JSON array)</div>
                          <textarea
                            value={adminUiSettingsForm.ultra_mini_kpis_json}
                            onChange={(e) => {
                              setAdminUiSettingsDirty(true)
                              setAdminUiSettingsForm((prev) => ({ ...prev, ultra_mini_kpis_json: e.target.value }))
                            }}
                            rows={6}
                            className={cn(
                              'w-full resize-y rounded-2xl border px-4 py-3 font-mono text-xs outline-none',
                              adminDark
                                ? 'border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-sky-400/40'
                                : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                            )}
                          />
                        </label>

                        <label className="mt-4 block">
                          <div className={cn('mb-2 text-xs font-medium uppercase tracking-[0.2em]', adminDark ? 'text-slate-400' : 'text-slate-600')}>Capabilities (newline/comma list)</div>
                          <textarea
                            value={adminUiSettingsForm.ultra_capabilities}
                            onChange={(e) => {
                              setAdminUiSettingsDirty(true)
                              setAdminUiSettingsForm((prev) => ({ ...prev, ultra_capabilities: e.target.value }))
                            }}
                            rows={6}
                            className={cn(
                              'w-full resize-y rounded-2xl border px-4 py-3 text-sm outline-none',
                              adminDark
                                ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400/40'
                                : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                            )}
                          />
                        </label>
                      </div>

                      <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                        <div className="flex items-center gap-3">
                          <FileText className={cn('h-5 w-5', adminDark ? 'text-sky-300' : 'text-sky-600')} />
                          <div>
                            <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Empty-state copy</h3>
                            <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>JSON object keyed by id (e.g. verification.pending).</p>
                          </div>
                        </div>
                        <textarea
                          value={adminUiSettingsForm.empty_states_json}
                          onChange={(e) => {
                            setAdminUiSettingsDirty(true)
                            setAdminUiSettingsForm((prev) => ({ ...prev, empty_states_json: e.target.value }))
                          }}
                          rows={16}
                          className={cn(
                            'mt-4 w-full resize-y rounded-2xl border px-4 py-3 font-mono text-xs outline-none',
                            adminDark
                              ? 'border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-sky-400/40'
                              : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400'
                          )}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="mt-6 grid gap-4 lg:grid-cols-2">
                    <div className={cn('rounded-[2rem] border p-5 shadow-xl shadow-sky-900/10 backdrop-blur-xl', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/70')}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={cn('text-xs uppercase tracking-[0.22em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Capabilities</p>
                          <h2 className={cn('mt-1 text-xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Live modules</h2>
                        </div>
                        <Pill>7 groups</Pill>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                          { title: 'Real-Time Monitoring & Analytics', count: 4, icon: Activity },
                          { title: 'Security Management', count: 4, icon: ShieldCheck },
                          { title: 'Server Config & Optimization', count: 4, icon: ServerCog },
                          { title: 'Backup & Data Protection', count: 3, icon: Cloud },
                          { title: 'Website/App Management', count: 3, icon: LayoutDashboard },
                          { title: 'User Account Management (System Admin)', count: 2, icon: Users },
                          { title: 'Automation', count: 2, icon: Workflow },
                        ].map((item) => {
                          const Icon = item.icon
                          return (
                            <div key={item.title} className={cn('rounded-3xl border p-4', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <div className={cn('rounded-2xl border p-2.5', adminDark ? 'border-sky-400/20 bg-sky-500/10 text-sky-300' : 'border-sky-200 bg-sky-50 text-sky-600')}>
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{item.title}</p>
                                    <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{item.count} capabilities</p>
                                  </div>
                                </div>
                                <Pill>live</Pill>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className={cn('rounded-[2rem] border p-5 shadow-xl shadow-sky-900/10 backdrop-blur-xl', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/70')}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className={cn('text-xs uppercase tracking-[0.22em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Audit trail</p>
                          <h2 className={cn('mt-1 text-xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Admin Audit Log</h2>
                        </div>
                        <button
                          type="button"
                          onClick={refreshAudit}
                          className={cn(
                            'rounded-2xl border px-4 py-2 text-sm font-medium transition',
                            adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                          )}
                        >
                          Refresh log
                        </button>
                      </div>

                      <div className={cn('mt-4 flex items-center gap-3 rounded-2xl border px-4 py-3', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                        <Search className={cn('h-4 w-4', adminDark ? 'text-slate-400' : 'text-slate-500')} />
                        <input
                          value={serverAdminAuditQuery}
                          onChange={(e) => setServerAdminAuditQuery(e.target.value)}
                          placeholder="Filter logs by route or actor"
                          className={cn('w-full bg-transparent text-sm outline-none', adminDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400')}
                        />
                      </div>

                      <div className="mt-4 space-y-3">
                        {filteredServerAdminAuditRows.slice(0, 6).map((item) => (
                          <div key={`${item.id || item.at}`} className={cn('rounded-3xl border p-4', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{item.path || item.action || '--'}</p>
                                <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                                  {item.at ? new Date(item.at).toLocaleString() : '--'} · system
                                </p>
                              </div>
                              <Pill>Status: {item.status ?? 200}</Pill>
                            </div>
                            <div className={cn('mt-3 grid gap-2 text-xs sm:grid-cols-3', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                              <div>Actor: {item.actor_id || item.actor || 'system'}</div>
                              <div>IP: {item.ip || '--'}</div>
                              <div>Device: {item.device_id || '--'}</div>
                            </div>
                          </div>
                        ))}
                        {filteredServerAdminAuditRows.length === 0 ? (
                          <div className={cn('rounded-3xl border border-dashed p-5 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600')}>
                            No audit entries found.
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </section>

                  <section className={cn('rounded-[2rem] border p-5 shadow-xl shadow-sky-900/10 backdrop-blur-xl', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/70')}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className={cn('text-xs uppercase tracking-[0.22em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Design system</p>
                        <h2 className={cn('mt-1 text-xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>Blue-sky premium admin experience</h2>
                      </div>
                      <Pill>Responsive</Pill>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {[
                        ['Clean surface', 'Large rounded cards, soft borders, and glassy depth.'],
                        ['Fast scanning', 'Strong hierarchy, compact labels, and clear live states.'],
                        ['Dual mode', 'Dark and light themes tuned for blue-sky visuals.'],
                      ].map(([title, text]) => (
                        <div key={title} className={cn('rounded-3xl border p-4', adminDark ? 'border-white/10 bg-slate-950/30' : 'border-slate-200 bg-white')}>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={cn('h-4 w-4', adminDark ? 'text-sky-300' : 'text-sky-600')} />
                            <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{title}</p>
                          </div>
                          <p className={cn('mt-2 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{text}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            ) : null}

            {activeCategory === 'cms' ? (
              <div
                className={cn(
                  'rounded-[32px] border p-4 sm:p-5',
                  adminDark ? 'border-slate-800/70 bg-slate-950/50' : 'border-slate-200 bg-white/75'
                )}
              >
                <div
                  className={cn(
                    'rounded-[28px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6',
                    adminDark
                      ? 'border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_32%),linear-gradient(180deg,#020617_0%,#07111f_50%,#030712_100%)] text-white'
                      : 'border-slate-200/80 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef7ff_48%,#f8fafc_100%)] text-slate-900'
                  )}
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-3xl">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <CmsMiniBadge dark={adminDark}>CMS + Content Management</CmsMiniBadge>
                        <span className={cmsChipClass(adminDark, true)}>
                          <span className="h-2 w-2 rounded-full bg-sky-400" /> live
                        </span>
                        <span className={cmsChipClass(adminDark)}>
                          <ShieldCheck className="h-3.5 w-3.5" /> secured
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'rounded-2xl border p-3',
                            adminDark ? 'border-sky-400/20 bg-sky-400/10 text-sky-300' : 'border-sky-200 bg-sky-50 text-sky-600'
                          )}
                        >
                          <LayoutDashboard className="h-6 w-6" />
                        </div>
                        <div>
                          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Admin Command Center</h1>
                          <p className={cn('mt-2 max-w-2xl text-sm sm:text-base', adminDark ? 'text-slate-300' : 'text-slate-700')}>
                            A premium control surface for headless CMS, frontend configuration, automation, deployment, verification, and audit telemetry.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className={cn('flex items-center gap-2 rounded-2xl border px-3 py-2', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200/80 bg-white/80')}>
                        <Search className="h-4 w-4 text-sky-400" />
                        <input
                          value={cmsAuditQuery}
                          onChange={(e) => setCmsAuditQuery(e.target.value)}
                          placeholder="Search logs..."
                          className={cn(
                            'w-44 bg-transparent text-sm outline-none',
                            adminDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                          )}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdminDark((v) => !v)}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5',
                          adminDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200/80 bg-white hover:bg-slate-50'
                        )}
                      >
                        {adminDark ? <SunMedium className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-slate-700" />}
                        {adminDark ? 'Light mode' : 'Dark mode'}
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5"
                      >
                        <Sparkles className="h-4 w-4" /> Premium Action
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <CmsStatCard
                      dark={adminDark}
                      icon={BookOpen}
                      label="Content items"
                      value={String((cmsState?.articles || []).length + (cmsState?.pages || []).length)}
                      meta={`Articles: ${(cmsState?.articles || []).length} · Pages: ${(cmsState?.pages || []).length}`}
                      trend={cmsState?.articles?.length ? `+${Math.min(2, cmsState.articles.length)} this week` : ''}
                    />
                    <CmsStatCard
                      dark={adminDark}
                      icon={HardDrive}
                      label="Media items"
                      value={String((cmsState?.media || []).length)}
                      meta="Assets and uploads tracked"
                    />
                    <CmsStatCard
                      dark={adminDark}
                      icon={Workflow}
                      label="Deployments"
                      value={String((cmsState?.deployments || []).length)}
                      meta={`Cron scripts: ${(cmsState?.cron_scripts || []).length}`}
                    />
                    <CmsStatCard
                      dark={adminDark}
                      icon={FileText}
                      label="Versions"
                      value={String((cmsState?.versions || []).length)}
                      meta={`Theme: ${cmsState?.theme?.active || '--'}`}
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setCmsTab('cms')} className={cmsChipClass(adminDark, cmsTab === 'cms')}>
                    <BookOpen className="h-3.5 w-3.5" /> CMS
                  </button>
                  <button type="button" onClick={() => setCmsTab('frontend')} className={cmsChipClass(adminDark, cmsTab === 'frontend')}>
                    <Globe2 className="h-3.5 w-3.5" /> Frontend
                  </button>
                  <button type="button" onClick={() => setCmsTab('deploy')} className={cmsChipClass(adminDark, cmsTab === 'deploy')}>
                    <Workflow className="h-3.5 w-3.5" /> Deployment
                  </button>
                  <button type="button" onClick={() => setCmsTab('audit')} className={cmsChipClass(adminDark, cmsTab === 'audit')}>
                    <ShieldCheck className="h-3.5 w-3.5" /> Audit
                  </button>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                  <div className="space-y-6 lg:col-span-8">
                    {cmsTab === 'cms' || cmsTab === 'frontend' || cmsTab === 'deploy' ? (
                      <CmsSectionCard
                        dark={adminDark}
                        icon={Layers3}
                        title="CMS + Content Management"
                        subtitle="3 sections · live"
                        action={
                          <button
                            type="button"
                            onClick={() => refreshCmsState()}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                              adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            )}
                          >
                            <RefreshCw className="h-4 w-4" /> Refresh
                          </button>
                        }
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          {[
                            {
                              title: 'Articles + Pages',
                              desc: 'Headless CMS editor output.',
                              meta: `Media items: ${(cmsState?.media || []).length}`,
                            },
                            {
                              title: 'Theme + SEO + Cache',
                              desc: 'Frontend configuration.',
                              meta: `Cache cleared: ${cmsState?.cache?.last_cleared_at || 'never'}`,
                            },
                            {
                              title: 'Deployments + Backups',
                              desc: 'Automation and cron scripts.',
                              meta: `Versions: ${(cmsState?.versions || []).length}`,
                            },
                          ].map((card) => (
                            <div
                              key={card.title}
                              className={cn(
                                'rounded-2xl border p-4',
                                adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70'
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>{card.title}</h3>
                                <ChevronRight className={cn('h-4 w-4', adminDark ? 'text-slate-400' : 'text-slate-500')} />
                              </div>
                              <p className={cn('mt-2 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{card.desc}</p>
                              <div className="mt-4 flex items-center justify-between gap-3">
                                <span className={cn('text-xs', adminDark ? 'text-slate-400' : 'text-slate-500')}>{card.meta}</span>
                                <span className={cmsChipClass(adminDark)}>
                                  <Clock3 className="h-3.5 w-3.5" /> synced
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CmsSectionCard>
                    ) : null}

                    {(cmsTab === 'cms' || cmsTab === 'frontend') ? (
                      <div className="grid gap-6 xl:grid-cols-2">
                        <CmsSectionCard
                          dark={adminDark}
                          icon={LockKeyhole}
                          title="Headless CMS Integration"
                          subtitle="3 capabilities · live"
                          action={<CmsMiniBadge dark={adminDark}>Ready</CmsMiniBadge>}
                        >
                          <div className="space-y-3">
                            {[
                              ['Content API', 'Deliver structured data to every surface.'],
                              ['Media pipeline', 'Image transforms, upload tracking, and delivery.'],
                              ['Role-safe publishing', 'Approval gates and audit attribution.'],
                            ].map(([title, desc]) => (
                              <div
                                key={title}
                                className={cn(
                                  'flex items-start gap-3 rounded-2xl border p-4',
                                  adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70'
                                )}
                              >
                                <div className="mt-1 rounded-xl bg-sky-400/10 p-2 text-sky-400">
                                  <Database className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{title}</p>
                                  <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CmsSectionCard>

                        <CmsSectionCard
                          dark={adminDark}
                          icon={Globe2}
                          title="Frontend Configuration"
                          subtitle="4 capabilities · live"
                          action={
                            <button
                              type="button"
                              onClick={() => refreshCmsState()}
                              className={cn(
                                'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                                adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              )}
                            >
                              <RefreshCw className="h-4 w-4" /> Refresh
                            </button>
                          }
                        >
                          <div className="space-y-3">
                            {[
                              ['Theme', cmsState?.theme?.active ? `Active: ${cmsState.theme.active}` : 'Not configured'],
                              ['SEO title', cmsState?.seo?.default_title || 'Not set'],
                              ['Cache', cmsState?.cache?.last_cleared_at ? `Cleared: ${cmsState.cache.last_cleared_at}` : 'Clearable from the dashboard'],
                              ['Env vars', `${Object.keys(cmsState?.env?.vars || {}).length} active values exposed`],
                            ].map(([label, value]) => (
                              <div
                                key={label}
                                className={cn(
                                  'flex items-center justify-between rounded-2xl border px-4 py-3',
                                  adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
                                )}
                              >
                                <div>
                                  <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{label}</p>
                                  <p className={cn('mt-0.5 font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{value}</p>
                                </div>
                                <CmsMiniBadge dark={adminDark}>{label === 'Cache' ? 'mutable' : 'set'}</CmsMiniBadge>
                              </div>
                            ))}
                          </div>
                        </CmsSectionCard>
                      </div>
                    ) : null}

                    {(cmsTab === 'deploy' || cmsTab === 'cms') ? (
                      <CmsSectionCard
                        dark={adminDark}
                        icon={Workflow}
                        title="Deployment & Automation"
                        subtitle="3 capabilities · live"
                        action={<CmsMiniBadge dark={adminDark}>Cron-enabled</CmsMiniBadge>}
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          {[
                            ['Build orchestration', 'Versioned deploys with clear audit roots.'],
                            ['Backup jobs', 'Automated snapshots and restore paths.'],
                            ['Schedulers', 'Cron scripts for recurring admin tasks.'],
                          ].map(([title, desc]) => (
                            <div
                              key={title}
                              className={cn(
                                'rounded-2xl border p-4',
                                adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>{title}</h3>
                                <TerminalSquare className="h-4 w-4 text-sky-400" />
                              </div>
                              <p className={cn('mt-2 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{desc}</p>
                              <div className="mt-4 flex items-center gap-2 text-xs text-sky-400">
                                <ArrowRight className="h-3.5 w-3.5" /> operational
                              </div>
                            </div>
                          ))}
                        </div>
                      </CmsSectionCard>
                    ) : null}

                    {cmsTab === 'audit' ? (
                      <CmsSectionCard
                        dark={adminDark}
                        icon={ShieldCheck}
                        title="Audit Pulse"
                        subtitle="Most recent admin actions"
                        action={
                          <button
                            type="button"
                            onClick={() => refreshAudit()}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                              adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            )}
                          >
                            <RefreshCw className="h-4 w-4" /> Refresh
                          </button>
                        }
                      >
                        <div className="space-y-3">
                          {filteredCmsAuditRows.slice(0, 5).map((item) => (
                            <div
                              key={`${item.id || item.at || item.path}`}
                              className={cn(
                                'flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between',
                                adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70'
                              )}
                            >
                              <div>
                                <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{item.path || item.action || '--'}</p>
                                <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                                  {item.at ? new Date(item.at).toLocaleString() : '--'} · system
                                </p>
                              </div>
                              <span className={cmsChipClass(adminDark)}>
                                <Activity className="h-3.5 w-3.5" /> {item.status ?? 200}
                              </span>
                            </div>
                          ))}
                          {filteredCmsAuditRows.length === 0 ? (
                            <div className={cn('rounded-2xl border border-dashed p-5 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600')}>
                              No audit entries found.
                            </div>
                          ) : null}
                        </div>
                      </CmsSectionCard>
                    ) : null}
                  </div>

                  <div className="space-y-6 lg:col-span-4">
                    <CmsSectionCard
                      dark={adminDark}
                      icon={Gauge}
                      title="Platform Snapshot"
                      subtitle="Live signal and trend"
                      action={<CmsMiniBadge dark={adminDark}>Realtime</CmsMiniBadge>}
                    >
                      <div className={cn('rounded-3xl border p-4', adminDark ? 'border-white/10 bg-slate-950/80' : 'border-slate-200 bg-white')}>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>Command health</p>
                            <p className={cn('mt-1 text-2xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>98.7%</p>
                          </div>
                          <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-400">
                            <Activity className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cmsTrendData}>
                              <defs>
                                <linearGradient id="cmsFillSky" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={adminDark ? 0.35 : 0.25} />
                                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={adminDark ? 'rgba(148,163,184,0.18)' : 'rgba(148,163,184,0.25)'}
                                vertical={false}
                              />
                              <XAxis
                                dataKey="name"
                                tick={{ fill: adminDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <YAxis
                                tick={{ fill: adminDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                width={24}
                              />
                              <Tooltip
                                contentStyle={{
                                  background: adminDark ? 'rgba(2,6,23,0.95)' : 'rgba(255,255,255,0.98)',
                                  border: adminDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(226,232,240,1)',
                                  borderRadius: 16,
                                  color: adminDark ? '#fff' : '#0f172a',
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke={adminDark ? 'rgba(186,230,253,0.95)' : 'rgba(2,132,199,0.92)'}
                                strokeWidth={3}
                                fill="url(#cmsFillSky)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CmsSectionCard>

                    <CmsSectionCard
                      dark={adminDark}
                      icon={BadgeCheck}
                      title="Verification Queue"
                      subtitle="EU/USA docs pending review"
                      action={
                        <button
                          type="button"
                          onClick={() => refreshVerificationQueue()}
                          className={cn(
                            'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                            adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          <RefreshCw className="h-4 w-4" /> Refresh
                        </button>
                      }
                    >
                      <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70')}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>
                              {verificationQueue.length
                                ? `${verificationQueue.length} items pending review.`
                                : emptyCopy('verification.pending', 'No pending verifications in queue.')}
                            </p>
                            <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                              All onboarding documents are currently in a clean state.
                            </p>
                          </div>
                          <span className={cmsChipClass(adminDark)}>
                            <BadgeCheck className="h-3.5 w-3.5" /> {verificationQueue.length ? 'pending' : 'clear'}
                          </span>
                        </div>
                      </div>
                    </CmsSectionCard>

                    <CmsSectionCard
                      dark={adminDark}
                      icon={FileText}
                      title="Dispute Radar"
                      subtitle="Contracts with open issues"
                      action={
                        <button
                          type="button"
                          onClick={() => refreshDisputes()}
                          className={cn(
                            'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                            adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          <RefreshCw className="h-4 w-4" /> Sync
                        </button>
                      }
                    >
                      <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70')}>
                        <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>
                          {disputes.length ? `${disputes.length} open disputes.` : emptyCopy('disputes.none', 'No active disputes.')}
                        </p>
                        <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                          Contract review and escalation feeds are currently idle.
                        </p>
                      </div>
                    </CmsSectionCard>

                    <CmsSectionCard
                      dark={adminDark}
                      icon={Clock3}
                      title="Admin Audit Log"
                      subtitle="Immutable, tamper-evident audit trail for every admin action."
                      action={
                        <button
                          type="button"
                          onClick={() => refreshAudit()}
                          className={cn(
                            'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                            adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          <RefreshCw className="h-4 w-4" /> Refresh log
                        </button>
                      }
                    >
                      <div className="max-h-[540px] space-y-3 overflow-auto pr-1">
                        {filteredCmsAuditRows.map((log) => (
                          <div
                            key={`${log.id || log.at}-${log.path || log.action}`}
                            className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{log.path || log.action || '--'}</p>
                                <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                                  {log.at ? new Date(log.at).toLocaleString() : '--'}
                                </p>
                              </div>
                              <span className={cmsChipClass(adminDark)}>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" /> {log.status ?? 200}
                              </span>
                            </div>
                            <div className={cn('mt-3 grid gap-2 text-xs sm:grid-cols-2', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                              <div>Actor: {log.actor_id || log.actor || 'system'}</div>
                              <div>IP: {log.ip || '--'} / Device: {log.device_id || '--'}</div>
                            </div>
                          </div>
                        ))}
                        {filteredCmsAuditRows.length === 0 ? (
                          <div className={cn('rounded-2xl border border-dashed p-5 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600')}>
                            No audit entries found.
                          </div>
                        ) : null}
                      </div>
                    </CmsSectionCard>
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'ultra-security' ? (
              <div
                className={cn(
                  'rounded-[32px] border p-4 sm:p-5',
                  adminDark ? 'border-slate-800/70 bg-slate-950/50' : 'border-slate-200 bg-white/75'
                )}
              >
                <div
                  className={cn(
                    'rounded-[32px] border p-5 backdrop-blur-xl',
                    adminDark
                      ? 'border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.24),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#07111f_55%,_#050b16_100%)] text-slate-100'
                      : 'border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.10),_transparent_22%),linear-gradient(180deg,_#eff8ff_0%,_#f8fbff_55%,_#eef6ff_100%)] text-slate-900'
                  )}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                          <ShieldCheck className="h-4 w-4" /> ultra security layer
                        </span>
                        <UltraPill dark={adminDark} active>
                          Advanced
                        </UltraPill>
                        <UltraPill dark={adminDark}>Live</UltraPill>
                      </div>
                      <h1 className={cn('mt-4 text-3xl font-semibold tracking-tight sm:text-4xl', adminDark ? 'text-white' : 'text-slate-900')}>
                        Zero Trust, incident response, and immutable audit control in one command deck.
                      </h1>
                      <p className={cn('mt-3 max-w-3xl text-sm leading-6 sm:text-base', adminDark ? 'text-slate-300' : 'text-slate-700')}>
                        A premium admin surface for secure operations, session governance, forensic logs, and tamper-evident oversight.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdminDark((v) => !v)}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition hover:-translate-y-0.5',
                          adminDark ? 'border-white/10 bg-white/10 text-white' : 'border-slate-200 bg-white text-slate-900'
                        )}
                      >
                        {adminDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        {adminDark ? 'Light mode' : 'Dark mode'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          refreshSecurityState()
                          refreshAudit()
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5"
                      >
                        <RefreshCw className="h-4 w-4" /> Refresh
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 xl:grid-cols-12">
                    <div className="space-y-5 xl:col-span-8">
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <UltraStatCard
                          dark={adminDark}
                          label="Zero-trust"
                          value={securityState?.zero_trust?.enabled ? 'On' : 'Off'}
                          icon={Shield}
                          tone={securityState?.zero_trust?.enabled ? 'good' : 'warn'}
                        />
                        <UltraStatCard
                          dark={adminDark}
                          label="MFA required"
                          value={securityState?.mfa?.required ? 'Yes' : 'No'}
                          icon={BadgeCheck}
                          tone={securityState?.mfa?.required ? 'good' : 'warn'}
                        />
                        <UltraStatCard
                          dark={adminDark}
                          label="Session timeout"
                          value={String(securityState?.session?.timeout_minutes ?? 30)}
                          sub="min"
                          icon={Clock3}
                        />
                        <UltraStatCard
                          dark={adminDark}
                          label="IP allowlist"
                          value={String((securityState?.ip_whitelist || []).length)}
                          icon={Globe2}
                          tone="good"
                        />
                      </div>

                      <UltraSectionCard
                        dark={adminDark}
                        title="Zero Trust + MFA"
                        subtitle="Session control and device fingerprints."
                        right={
                          <div className="flex items-center gap-2 text-sm text-cyan-300">
                            <LockKeyhole className="h-4 w-4" />
                            hardened access
                          </div>
                        }
                      >
                        <div className="grid gap-4 lg:grid-cols-2">
                          <div className="space-y-4">
                            <UltraToggle
                              dark={adminDark}
                              on={Boolean(securityState?.zero_trust?.enabled)}
                              label="Toggle zero-trust"
                              hint="Strict session validation and conditional access."
                              onToggle={() =>
                                runSecurityAction('security.zero_trust.toggle', { enabled: !securityState?.zero_trust?.enabled })
                              }
                            />

                            <div className={cn('grid gap-4 rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>Rotate keys</p>
                                  <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-500')}>Encryption keys and session secrets.</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => runSecurityAction('security.encryption.rotate')}
                                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white"
                                >
                                  <KeyRound className="h-4 w-4" /> Rotate
                                </button>
                              </div>

                              <div className={cn('grid gap-3 sm:grid-cols-2', adminDark ? 'text-slate-200' : 'text-slate-800')}>
                                <div className={cn('rounded-xl border p-3', adminDark ? 'border-white/10 bg-black/10' : 'border-slate-200 bg-white')}>
                                  <p className={cn('text-xs uppercase tracking-[0.18em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Session fingerprint</p>
                                  <p className="mt-1 font-medium">{securityState?.device_fingerprinting?.enabled ? 'Enabled' : 'Off'}</p>
                                </div>
                                <div className={cn('rounded-xl border p-3', adminDark ? 'border-white/10 bg-black/10' : 'border-slate-200 bg-white')}>
                                  <p className={cn('text-xs uppercase tracking-[0.18em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Geo-fence</p>
                                  <p className="mt-1 font-medium">{securityState?.geo_fence?.enabled ? 'On' : 'Off'}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-4">
                            <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                              <div className="mb-3 flex items-center justify-between">
                                <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>Current security state</p>
                                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300">
                                  <ShieldCheck className="h-3.5 w-3.5" /> active
                                </span>
                              </div>
                              <div className="space-y-3 text-sm">
                                {[
                                  ['Zero-trust', securityState?.zero_trust?.enabled ? 'On' : 'Off'],
                                  ['MFA required', securityState?.mfa?.required ? 'Yes' : 'No'],
                                  ['Session timeout', `${securityState?.session?.timeout_minutes ?? 30} min`],
                                  ['IP allowlist', String((securityState?.ip_whitelist || []).length)],
                                  ['Geo-fence', securityState?.geo_fence?.enabled ? 'On' : 'Off'],
                                ].map(([key, value]) => (
                                  <div
                                    key={key}
                                    className={cn('flex items-center justify-between border-b border-dashed pb-2 last:border-0 last:pb-0', adminDark ? 'border-white/10' : 'border-slate-200')}
                                  >
                                    <span className={adminDark ? 'text-slate-400' : 'text-slate-600'}>{key}</span>
                                    <span className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>Incident Response</p>
                                  <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-500')}>Incident dashboard and approvals.</p>
                                </div>
                                <AlertTriangle className="h-5 w-5 text-amber-400" />
                              </div>
                              <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => runSecurityAction('security.export.request', { dataset: 'full' })}
                                  className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200"
                                >
                                  Approvals queue
                                </button>
                                <button
                                  type="button"
                                  onClick={() => runSecurityAction('security.incident.create', { title: 'Lockdown', severity: 'high' })}
                                  className={cn('rounded-xl border px-4 py-2 text-sm font-medium', adminDark ? 'border-white/10 text-slate-200' : 'border-slate-200 text-slate-800')}
                                >
                                  Lockdown playbook
                                </button>
                              </div>
                              <div className={cn('mt-4 space-y-2 text-[11px]', adminDark ? 'text-slate-300' : 'text-slate-700')}>
                                {(securityState?.incidents || []).slice(0, 3).map((incident) => (
                                  <div key={incident.id} className={cn('rounded-xl border px-3 py-2', adminDark ? 'border-white/10 bg-slate-950/25' : 'border-slate-200 bg-white')}>
                                    {incident.title} · {incident.status}
                                  </div>
                                ))}
                                {(securityState?.data_exports?.pending || []).slice(0, 2).map((req) => (
                                  <div key={req.id} className={cn('text-[11px]', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                                    Export {req.dataset} · {req.status}
                                  </div>
                                ))}
                                {!securityState?.incidents?.length && !(securityState?.data_exports?.pending || []).length ? (
                                  <div className={adminDark ? 'text-slate-400' : 'text-slate-600'}>No active incidents.</div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </UltraSectionCard>

                      <UltraSectionCard
                        dark={adminDark}
                        title="Forensic + Immutable Backups"
                        subtitle="Tamper-proof logs and snapshots."
                        right={<UltraPill dark={adminDark} active>Immutable</UltraPill>}
                      >
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                          <UltraStatCard dark={adminDark} label="Forensic logs" value={String((securityState?.forensic_logs || []).length)} icon={BookOpen} />
                          <UltraStatCard dark={adminDark} label="Immutable snapshots" value={securityState?.immutable_backups?.last_snapshot_at || 'none'} icon={Database} tone="warn" />
                          <UltraStatCard dark={adminDark} label="Last key rotation" value={securityState?.encryption?.last_rotated_at || 'never'} icon={KeyRound} tone="warn" />
                          <UltraStatCard dark={adminDark} label="Tamper-proof logs" value={securityState?.tamper_proof_logs?.enabled ? 'On' : 'Off'} icon={ShieldAlert} tone={securityState?.tamper_proof_logs?.enabled ? 'good' : 'warn'} />
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-3">
                          <div className={cn('rounded-2xl border p-4 lg:col-span-2', adminDark ? 'border-white/10 bg-slate-950/25' : 'border-slate-200 bg-white')}>
                            <div className="mb-3 flex items-center justify-between">
                              <div>
                                <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>Zero-Trust &amp; Incident Response</p>
                                <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-500')}>{ultraSecurityCapabilities.length} capabilities</p>
                              </div>
                              <Sparkles className="h-5 w-5 text-cyan-300" />
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {ultraSecurityCapabilities.map((cap) => (
                                <div key={cap} className={cn('flex items-start gap-2 rounded-xl border p-3 text-sm', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-cyan-300" />
                                  <span className={cn(adminDark ? 'text-slate-200' : 'text-slate-800')}>{cap}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                            <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>Risk posture</p>
                            <div className="mt-4 space-y-4">
                              {[
                                ['Access risk', 'Low', 'w-2/5', 'from-sky-500 to-cyan-400', 'text-cyan-300'],
                                ['Backup integrity', 'High', 'w-4/5', 'from-cyan-400 to-sky-500', 'text-cyan-300'],
                                ['Response readiness', 'Review', 'w-3/5', 'from-amber-400 to-orange-400', 'text-amber-300'],
                              ].map(([label, value, widthClass, gradient, valueClass]) => (
                                <div key={label}>
                                  <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className={adminDark ? 'text-slate-300' : 'text-slate-700'}>{label}</span>
                                    <span className={valueClass}>{value}</span>
                                  </div>
                                  <div className={cn('h-2 rounded-full', adminDark ? 'bg-white/10' : 'bg-slate-200')}>
                                    <div className={cn('h-2 rounded-full bg-gradient-to-r', widthClass, gradient)} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </UltraSectionCard>
                    </div>

                    <div className="space-y-5 xl:col-span-4">
                      <UltraTinyChart dark={adminDark} points={ultraMiniChartPoints} kpis={ultraMiniChartKpis} />

                      <UltraSectionCard
                        dark={adminDark}
                        title="Verification Queue"
                        subtitle="EU/USA docs pending review."
                        right={
                          <button
                            type="button"
                            onClick={() => refreshVerificationQueue()}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm',
                              adminDark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-white text-slate-900'
                            )}
                          >
                            <RefreshCw className="h-4 w-4" /> Refresh
                          </button>
                        }
                      >
                        <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                          <div className="space-y-2 text-xs">
                            {verificationQueue.slice(0, 3).map((row) => (
                              <div key={row.id || row.user_id} className={cn('rounded-2xl border px-3 py-2', adminDark ? 'border-white/10 bg-slate-950/25' : 'border-slate-200 bg-white')}>
                                <p className={cn('text-[11px] font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>{row.user_name || row.user_email || row.user_id}</p>
                                <p className={cn('text-[10px]', adminDark ? 'text-slate-400' : 'text-slate-600')}>Doc: {row.doc_type || row.type || 'business'} · Status: {row.status || 'pending'}</p>
                              </div>
                            ))}
                            {!verificationQueue.length ? (
                              <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                                {emptyCopy('verification.pending', 'No pending verifications in queue.')}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </UltraSectionCard>

                      <UltraSectionCard
                        dark={adminDark}
                        title="Dispute Radar"
                        subtitle="Contracts with open issues."
                        right={
                          <button
                            type="button"
                            onClick={() => refreshDisputes()}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm',
                              adminDark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-white text-slate-900'
                            )}
                          >
                            <RefreshCw className="h-4 w-4" /> Sync
                          </button>
                        }
                      >
                        <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                          <div className="space-y-2 text-xs">
                            {disputes.slice(0, 3).map((dispute) => (
                              <div key={dispute.id} className={cn('rounded-2xl border px-3 py-2', adminDark ? 'border-white/10 bg-slate-950/25' : 'border-slate-200 bg-white')}>
                                <p className={cn('text-[11px] font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>{dispute.title || dispute.contract_id || 'Dispute'}</p>
                                <p className={cn('text-[10px]', adminDark ? 'text-slate-400' : 'text-slate-600')}>Status: {dispute.status || 'open'} · Priority: {dispute.priority || 'normal'}</p>
                              </div>
                            ))}
                            {!disputes.length ? (
                              <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{emptyCopy('disputes.none', 'No active disputes.')}</p>
                            ) : null}
                          </div>
                        </div>
                      </UltraSectionCard>

                      <UltraSectionCard
                        dark={adminDark}
                        title="Audit Pulse"
                        subtitle="Most recent admin actions."
                        right={
                          <button
                            type="button"
                            onClick={() => refreshAudit()}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm',
                              adminDark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-white text-slate-900'
                            )}
                          >
                            <RefreshCw className="h-4 w-4" /> Refresh
                          </button>
                        }
                      >
                        <div className="space-y-3">
                          {audit.slice(0, 5).map((entry) => (
                            <div key={entry.id || entry.at} className={cn('rounded-2xl border p-3', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{entry.path || entry.action || 'Admin action'}</p>
                                  <p className={cn('mt-1 text-xs', adminDark ? 'text-slate-400' : 'text-slate-600')}>{entry.at ? new Date(entry.at).toLocaleString() : '--'} · system</p>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-cyan-300" />
                              </div>
                              <div className={cn('mt-3 text-xs', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                                Actor: {entry.actor_id || entry.actor || 'system'} / Status: {entry.status ?? 200}
                                <br />
                                IP: {entry.ip || '--'} / Device: {entry.device_id || '--'}
                              </div>
                            </div>
                          ))}
                          {!audit.length ? <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>No recent activity.</p> : null}
                        </div>
                      </UltraSectionCard>
                    </div>
                  </div>

                  <section className={cn('mt-5 rounded-[32px] border p-6 backdrop-blur-xl', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/80')}>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className={cn('text-xl font-semibold tracking-tight', adminDark ? 'text-white' : 'text-slate-900')}>Admin Audit Log</h2>
                        <p className={cn('mt-2 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                          Immutable, tamper-evident audit trail for every admin action.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className={cn('flex items-center gap-2 rounded-2xl border px-3 py-2', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}>
                          <Search className={cn('h-4 w-4', adminDark ? 'text-slate-400' : 'text-slate-500')} />
                          <input
                            value={ultraAuditQuery}
                            onChange={(e) => setUltraAuditQuery(e.target.value)}
                            placeholder="Search audit..."
                            className={cn('w-44 bg-transparent text-sm outline-none', adminDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400')}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => refreshAudit()}
                          className={cn(
                            'inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium',
                            adminDark ? 'border-white/10 bg-white/10 text-white' : 'border-slate-200 bg-white text-slate-900'
                          )}
                        >
                          <RefreshCw className="h-4 w-4" /> Refresh log
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {filteredUltraAuditRows.slice(0, 10).map((entry) => (
                        <div
                          key={`${entry.id || entry.at}-${entry.path || entry.action}`}
                          className={cn(
                            'grid gap-2 rounded-2xl border p-4 md:grid-cols-[1.4fr_0.8fr_1fr] md:items-center',
                            adminDark ? 'border-white/10 bg-slate-950/25' : 'border-slate-200 bg-slate-50'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-cyan-500/10 p-2 text-cyan-300">
                              <ShieldAlert className="h-4 w-4" />
                            </div>
                            <div>
                              <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{entry.path || entry.action || '--'}</p>
                              <p className={cn('text-xs', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                                Actor: {entry.actor_id || entry.actor || 'system'} / Status: {entry.status ?? 200}
                              </p>
                            </div>
                          </div>
                          <div className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                            {entry.at ? new Date(entry.at).toLocaleString() : '--'}
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <div className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                              IP: {entry.ip || '--'} / Device: {entry.device_id || '--'}
                            </div>
                            <ChevronRight className={cn('h-4 w-4', adminDark ? 'text-slate-500' : 'text-slate-400')} />
                          </div>
                        </div>
                      ))}
                      {filteredUltraAuditRows.length === 0 ? (
                        <div className={cn('rounded-2xl border border-dashed p-5 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600')}>
                          No audit entries found.
                        </div>
                      ) : null}
                    </div>
                  </section>
                </div>
              </div>
            ) : null}

            {activeCategory === 'ultra-security' ? null : (
              <div className="space-y-4">
                {activeData?.sections?.map((section) => {
                  const metrics = SECTION_METRICS[section.id] || []
                  const features = Array.isArray(section.features) ? section.features : []
                  return (
                    <details key={section.id} className="admin-card admin-sweep rounded-3xl p-6">
                      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold">{section.title}</p>
                          <p className="text-xs text-slate-500">{features.length} capabilities</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold${statusBadge('live')}`}>live</span>
                      </summary>
                      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {features.map((item) => (
                            <div key={item} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-[11px] text-slate-600 dark:text-slate-300">
                              {item}
                            </div>
                          ))}
                        </div>
                        <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark p-4 text-xs text-slate-600 dark:text-slate-300">
                          <p className="text-[10px] font-semibold uppercase text-slate-500">Live Metrics</p>
                          <div className="mt-2 space-y-2">
                            {metrics.length ? metrics.map((metric) => {
                              const value = resolvePath(summary, metric.path)
                              const display = metric.format === 'currency' ? formatCurrency(value) : formatNumber(value)
                              return (
                                <div key={metric.label} className="flex items-center justify-between">
                                  <span>{metric.label}</span>
                                  <span className="font-semibold text-slate-900 dark:text-white">{value === undefined ? '--' : display}</span>
                                </div>
                              )
                            }) : <div className="text-xs text-slate-500">Metrics coming from live feeds.</div>}
                          </div>
                        </div>
                      </div>
                    </details>
                  )
                })}
              </div>
            )}
          </section>

          {activeCategory === 'ultra-security' ? null : (
          <aside className="space-y-4">
              <div className="admin-card admin-sweep rounded-3xl p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">Verification Queue</p>
                    <p className="text-[11px] text-slate-400">EU/USA docs pending review.</p>
                  </div>
                <button
                  type="button"
                  onClick={() => refreshVerificationQueue()}
                  className="rounded-full shadow-borderless dark:shadow-borderlessDark bg-black/40 px-3 py-1 text-[10px] font-semibold text-sky-100 hover:bg-[#13171E]"
                >
                  Refresh
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                {verificationQueue.slice(0, 3).map((row) => (
                  <div key={row.id || row.user_id} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark px-3 py-2">
                    <p className="text-[11px] font-semibold">{row.user_name || row.user_email || row.user_id}</p>
                    <p className="text-[10px] text-slate-400">Doc: {row.doc_type || row.type || 'business'} · Status: {row.status || 'pending'}</p>
                  </div>
                ))}
                {!verificationQueue.length ? (
                  <p className="text-[11px] text-slate-400">{emptyCopy('verification.pending', 'No pending verifications in queue.')}</p>
                ) : null}
              </div>
            </div>

              <div className="admin-card admin-sweep rounded-3xl p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">Dispute Radar</p>
                    <p className="text-[11px] text-slate-400">Contracts with open issues.</p>
                  </div>
                <button
                  type="button"
                  onClick={() => refreshDisputes()}
                  className="rounded-full shadow-borderless dark:shadow-borderlessDark bg-black/40 px-3 py-1 text-[10px] font-semibold text-sky-100 hover:bg-[#13171E]"
                >
                  Sync
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                {disputes.slice(0, 3).map((dispute) => (
                  <div key={dispute.id} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark px-3 py-2">
                    <p className="text-[11px] font-semibold">{dispute.title || dispute.contract_id || 'Dispute'}</p>
                    <p className="text-[10px] text-slate-400">Status: {dispute.status || 'open'} · Priority: {dispute.priority || 'normal'}</p>
                  </div>
                ))}
                {!disputes.length ? (
                  <p className="text-[11px] text-slate-400">{emptyCopy('disputes.none', 'No active disputes.')}</p>
                ) : null}
              </div>
            </div>

              <div className="admin-card admin-sweep rounded-3xl p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">Audit Pulse</p>
                    <p className="text-[11px] text-slate-400">Most recent admin actions.</p>
                  </div>
                <button
                  type="button"
                  onClick={() => refreshAudit()}
                  className="rounded-full shadow-borderless dark:shadow-borderlessDark bg-black/40 px-3 py-1 text-[10px] font-semibold text-sky-100 hover:bg-[#13171E]"
                >
                  Refresh
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                {audit.slice(0, 5).map((entry) => (
                  <div key={entry.id || entry.at} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark px-3 py-2">
                    <p className="text-[11px] font-semibold">{entry.action || 'Admin action'}</p>
                    <p className="text-[10px] text-slate-400">{entry.at ? new Date(entry.at).toLocaleString() : '--'} · {entry.actor || 'system'}</p>
                  </div>
                ))}
                {!audit.length ? (
                  <p className="text-[11px] text-slate-400">No recent activity.</p>
                ) : null}
              </div>
            </div>
          </aside>
          )}
        </div>
                {activeCategory === 'ultra-security' ? null : (
                  <div className="admin-card admin-sweep rounded-3xl p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold">Admin Audit Log</p>
                        <p className="text-xs text-slate-500">Immutable, tamper-evident audit trail for every admin action.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => refreshAudit()}
                        className="rounded-full shadow-borderless dark:shadow-borderlessDark bg-black/40 px-3 py-1 text-xs font-semibold text-sky-100 hover:bg-[#13171E]"
                      >
                        Refresh log
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-2">
                      {audit.slice(0, 10).map((entry) => (
                        <div key={entry.id} className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-semibold text-slate-900 dark:text-white">{entry.action || entry.path}</div>
                            <div>{entry.at ? new Date(entry.at).toLocaleString() : '--'}</div>
                          </div>
                          <div className="mt-1 text-[10px] text-slate-500">Actor: {entry.actor_id || 'system'} / Status: {entry.status}</div>
                          <div className="mt-1 text-[10px] text-slate-500">IP: {entry.ip || '--'} / Device: {entry.device_id || '--'}</div>
                        </div>
                      ))}
                      {audit.length === 0 ? <p className="text-xs text-slate-500">No audit entries yet.</p> : null}
                    </div>
                  </div>
                )}
                </>
) : null}
            </div>

            {activeCategory === 'config' ? (
              <div className="admin-card admin-sweep rounded-3xl p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold">Dynamic Configuration Editor</h2>
                  <p className="text-sm text-slate-500">Edit admin panel configuration from the database.</p>
                </div>

                <div className="mb-4 flex gap-2">
                  {['inventory', 'actions', 'ui'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setConfigEditorTab(tab)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        configEditorTab === tab
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {tab === 'inventory' ? 'Inventory' : tab === 'actions' ? 'Actions' : 'UI Settings'}
                    </button>
                  ))}
                </div>

                {configEditorLoading ? (
                  <div className="py-8 text-center text-slate-500">Loading...</div>
                ) : configEditorError ? (
                  <div className="py-8 text-center text-rose-500">{configEditorError}</div>
                ) : configEditorTab === 'inventory' ? (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={async () => {
                          setConfigEditorSaving(true)
                          setConfigEditorNotice('')
                          try {
                            await apiRequest('/admin/config/inventory', {
                              method: 'PUT',
                              body: { data: { modules: configEditorData.inventory } },
                            })
                            setConfigEditorNotice('Inventory saved!')
                          } catch (err) {
                            setConfigEditorError(err.message)
                          } finally {
                            setConfigEditorSaving(false)
                          }
                        }}
                        disabled={configEditorSaving}
                        className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {configEditorSaving ? 'Saving...' : 'Save Inventory'}
                      </button>
                    </div>
                    <div className="grid gap-3">
                      {configEditorData.inventory.map((mod, idx) => (
                        <div key={mod.id || idx} className="rounded-xl border p-4 dark:border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{mod.label}</span>
                            <span className="text-xs text-slate-500">({mod.id})</span>
                          </div>
                          <div className="mt-2 text-xs text-slate-500">
                            {mod.sections?.length || 0} sections
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : configEditorTab === 'actions' ? (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={async () => {
                          setConfigEditorSaving(true)
                          setConfigEditorNotice('')
                          try {
                            const flatActions = configEditorData.actions.flatMap((g) => g.actions || [])
                            await apiRequest('/api/admin/config/actions', {
                              method: 'PUT',
                              body: { data: { actions: flatActions } },
                            })
                            setConfigEditorNotice('Actions saved!')
                          } catch (err) {
                            setConfigEditorError(err.message)
                          } finally {
                            setConfigEditorSaving(false)
                          }
                        }}
                        disabled={configEditorSaving}
                        className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {configEditorSaving ? 'Saving...' : 'Save Actions'}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {configEditorData.actions.map((group, gIdx) => (
                        <div key={gIdx} className="rounded-xl border p-4 dark:border-white/10">
                          <div className="font-semibold">{group.label}</div>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {(group.actions || []).map((action, aIdx) => (
                              <div key={aIdx} className="text-xs text-slate-600 dark:text-slate-300">
                                {action.label} <span className="text-slate-400">({action.id})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={async () => {
                          setConfigEditorSaving(true)
                          setConfigEditorNotice('')
                          try {
                            await apiRequest('/api/admin/config/ui', {
                              method: 'PUT',
                              body: { data: configEditorData.ui },
                            })
                            setConfigEditorNotice('UI settings saved!')
                          } catch (err) {
                            setConfigEditorError(err.message)
                          } finally {
                            setConfigEditorSaving(false)
                          }
                        }}
                        disabled={configEditorSaving}
                        className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {configEditorSaving ? 'Saving...' : 'Save UI Settings'}
                      </button>
                    </div>
                    <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-200">
                      {JSON.stringify(configEditorData.ui, null, 2)}
                    </pre>
                  </div>
                )}

                {configEditorNotice ? (
                  <div className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                    {configEditorNotice}
                  </div>
                ) : null}
                {configEditorError ? (
                  <div className="mt-4 rounded-lg bg-rose-500/10 px-4 py-2 text-sm text-rose-400">
                    {configEditorError}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </>
  )
}


