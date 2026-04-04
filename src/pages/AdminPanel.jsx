import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Activity, Database, Home, Lock, Network, Search, Server, Settings, ShieldCheck, Sparkles, Sun, Moon } from 'lucide-react'
import { Area, AreaChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import AccessDeniedState from '../components/AccessDeniedState'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'

const OWNER_ROLES = new Set(['owner', 'admin'])

const FALLBACK_INVENTORY = [
  { id: 'platform', label: 'Core Platform & Business Control', sections: [] },
  { id: 'infra', label: 'Server / System / Infrastructure Management', sections: [] },
  { id: 'network', label: 'Network Monitoring & Management', sections: [] },
  { id: 'server-admin', label: 'Server Admin + App Management', sections: [] },
  { id: 'cms', label: 'CMS + Content Management', sections: [] },
  { id: 'ultra-security', label: 'Ultra Security Layer', sections: [] },
]

const CATEGORY_ICONS = {
  platform: ShieldCheck,
  infra: Server,
  network: Network,
  'server-admin': Database,
  cms: Settings,
  'ultra-security': Lock,
}

function listToTextarea(value) {
  return Array.isArray(value) ? value.join('\n') : ''
}

function textareaToList(value) {
  const raw = String(value || '').split(/[\n,]/)
  const cleaned = raw.map((entry) => entry.trim()).filter(Boolean)
  return [...new Set(cleaned)]
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
      { id: 'traffic.record', label: 'Record traffic event', route: '/admin/actions', fields: [{ key: 'domain', label: 'Domain' }, { key: 'clicks', label: 'Clicks' }, { key: 'visits', label: 'Visits' }] },
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

export default function AdminPanel() {
  const user = getCurrentUser()
  const isOwner = OWNER_ROLES.has(String(user?.role || '').toLowerCase())
  const [adminDark, setAdminDark] = useState(() => {
    const stored = localStorage.getItem('admin_theme')
    if (stored === 'light') return false
    if (stored === 'dark') return true
    return true
  })

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
  const [walletLedger, setWalletLedger] = useState([])
  const [featuredForm, setFeaturedForm] = useState({ entity_type: 'product', entity_id: '', label: '' })
  const [audit, setAudit] = useState([])
  const [users, setUsers] = useState([])
  const [verificationQueue, setVerificationQueue] = useState([])
  const [contractsVault, setContractsVault] = useState([])
  const [disputes, setDisputes] = useState([])
  const [supportTickets, setSupportTickets] = useState([])
  const [supportLoading, setSupportLoading] = useState(false)
  const [supportFilters, setSupportFilters] = useState({ status: 'all', priority: 'all', assigned_to: '' })
  const [moderationPending, setModerationPending] = useState([])
  const [moderationRejected, setModerationRejected] = useState([])
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
  const [passkeyValue, setPasskeyValue] = useState(() => localStorage.getItem('admin_passkey') || '')
  const [stepUpCode, setStepUpCode] = useState('')
  const [activeCategory, setActiveCategory] = useState('home')
  const [actionBusy, setActionBusy] = useState('')

  const actionOptions = useMemo(() => {
    return ACTION_GROUPS.flatMap((group) => group.actions.map((action) => ({
      ...action,
      group: group.label,
    })))
  }, [])
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
    if (!passkeyValue) return
    localStorage.setItem('admin_passkey', passkeyValue)
  }, [passkeyValue])

  useEffect(() => {
    if (activeCategory !== 'platform') return
    refreshSupportTickets()
    refreshModerationQueues()
    refreshReportQueues()
  }, [activeCategory])

  useEffect(() => {
    const rules = master?.config?.moderation?.clothing_rules
    if (!rules) return
    setClothingRulesForm({
      forbidden_terms: listToTextarea(rules.forbidden_terms),
      flag_terms: listToTextarea(rules.flag_terms),
      allowed_terms: listToTextarea(rules.allowed_terms),
      context_exceptions: listToTextarea(rules.context_exceptions),
      reason_rejected: rules?.reason_templates?.rejected || '',
      reason_pending: rules?.reason_templates?.pending_review || '',
      reason_fix: rules?.reason_templates?.fix_guidance || '',
    })
  }, [master?.config])

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

  useEffect(() => {
    if (!isOwner) return
    const token = getToken()
    if (!token) return

    setLoading(true)
    setError('')
    const headers = buildAdminHeaders()

    Promise.all([
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
      .then(([masterData, userRows, infraData, infraStateData, networkData, networkInventoryData, auditData, verificationData, contractsData, disputesData, partnersData, proofsData, catalogData, couponReportData, serverAdminData, cmsData, securityData, integrationData, signupsData, strikesData, fraudData, orgOwnershipData, walletLedgerData]) => {
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
      })
      .catch((err) => setError(err.message || 'Failed to load admin data'))
      .finally(() => setLoading(false))
  }, [isOwner, mfaCode, deviceId, buildAdminHeaders])

  const summary = master?.summary || {}
  const inventory = master?.inventory || FALLBACK_INVENTORY
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

  const analyticsOverview = catalog?.analytics || {}
  const activeUsersTrend = Array.isArray(analyticsOverview.active_users_trend) ? analyticsOverview.active_users_trend : []
  const buyerRequestTrend = Array.isArray(analyticsOverview.buyer_request_trend) ? analyticsOverview.buyer_request_trend : []
  const contractStatusData = useMemo(() => {
    const counts = { signed: 0, pending: 0, dispute: 0 }
    contractsVault.forEach((row) => {
      const status = String(row?.lifecycle_status || '').toLowerCase()
      if (status.includes('signed')) counts.signed += 1
      else if (status.includes('dispute')) counts.dispute += 1
      else counts.pending += 1
    })
    return [
      { name: 'Signed', value: counts.signed },
      { name: 'Pending', value: counts.pending },
      { name: 'Dispute', value: counts.dispute },
    ]
  }, [contractsVault])
  const chartPalette = ['#4B9DFB', '#6366f1', '#22c55e']
  const premiumBundles = [
    {
      title: 'Buyer (Premium)',
      highlights: [
        'Advanced Search Filters',
        'Priority Buyer Request Placement',
        'Dedicated Support',
        'Contract History & Audit Trail',
        'Early Access to New Verified Factories',
        'Buying Pattern Analysis',
        'Order Completion Certification',
        'AI Auto-reply Customization',
        'Smart Supplier Matching',
        'Request Performance Insights',
        'Profile, product boost & increased reach',
      ],
    },
    {
      title: 'Factory (Premium)',
      highlights: [
        'Profile, product boost & increased reach',
        'Advanced analytics (who viewed, inquiry rate)',
        'Priority in search results & filters',
        'AI auto-reply customization',
        'Dedicated account manager',
        'Custom branding on profile',
        'Enterprise analytics dashboard',
        'Unlimited agent/sub-ID creation',
        'Buying Pattern Analysis',
        'Order Completion Certification',
        'Dedicated Support',
        'Contract history & audit trail',
        'Multi-agent management',
        'Multiple team/agent access controls',
        'Request & factory performance insights',
        'Buyer interest analytics',
        'Agent performance analytics & reporting',
        'More product/video posting capacity',
        'Lead distribution across agents',
        'Buyer communication insights',
        'Buyer Request Priority Access',
        'Buyer Conversion Insights',
        'Unlimited Partner Network request acceptance',
      ],
    },
    {
      title: 'Buying House (Premium)',
      highlights: [
        'Profile, product boost & increased reach',
        'Advanced analytics (who viewed, inquiry rate)',
        'Priority in search results & filters',
        'AI auto-reply customization',
        'Dedicated account manager',
        'Custom branding on profile',
        'Enterprise analytics dashboard',
        'Unlimited agent/sub-ID creation',
        'Buying Pattern Analysis',
        'Order Completion Certification',
        'Dedicated Support',
        'Contract history & audit trail',
        'Multi-agent management',
        'Multiple team/agent access controls',
        'Request Buying House performance insights',
        'Buyer interest analytics',
        'Agent performance analytics & reporting',
        'More product/video posting capacity',
        'Lead distribution across agents',
        'Buyer communication insights',
        'Buyer Request Priority Access',
        'Buyer Conversion Insights',
        'Unlimited Partner Network access',
      ],
    },
  ]

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

  async function refreshSupportTickets() {
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
  }

  async function refreshModerationQueues() {
    const token = getToken()
    if (!token) return
    const headers = buildAdminHeaders()
    const [pendingData, rejectedData] = await Promise.all([
      apiRequest('/admin/moderation/products?status=pending_review', { token, headers }),
      apiRequest('/admin/moderation/products?status=rejected', { token, headers }),
    ])
    setModerationPending(Array.isArray(pendingData?.items) ? pendingData.items : [])
    setModerationRejected(Array.isArray(rejectedData?.items) ? rejectedData.items : [])
  }

  async function refreshReportQueues() {
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
  }

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

  const activeData = inventory.find((cat) => cat.id === activeCategory) || inventory[0]
  const CategoryIcon = CATEGORY_ICONS[activeCategory] || ShieldCheck
  const sidebarItems = useMemo(() => {
    return [
      { id: 'home', label: 'Home', icon: Home },
      ...inventory.map((item) => ({ ...item, icon: CATEGORY_ICONS[item.id] || ShieldCheck })),
    ]
  }, [inventory])

  if (!isOwner) {
    return <AccessDeniedState message="Only owner/admin can access the admin panel." />
  }

  return (
    <div className="admin-shell h-screen">
      <div className="admin-plasma" />
      <div className="admin-current" />
      <div className="admin-noise" />
      <div className="relative z-10 flex h-full w-full gap-6 px-0 py-0">
        <aside className="admin-sidebar admin-panel flex w-[250px] flex-col gap-6 rounded-none px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/80 to-indigo-500/60 text-white shadow-[0_0_18px_rgba(75,157,251,0.6)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-sky-200/80">GarTexHub</p>
              <p className="text-base font-semibold text-slate-900 dark:text-white">Admin Matrix</p>
            </div>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = activeCategory === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveCategory(item.id)}
                  className={`admin-sidebar-item${isActive ? 'is-active' : ''}`}
                >
                  <span className="admin-sidebar-rail" />
                  <Icon className="h-4 w-4" />
                  <span className="admin-sidebar-label">{item.label}</span>
                </button>
              )
            })}
          </div>
          <div className="mt-auto admin-card admin-sweep rounded-3xl p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Upgrade</p>
            <p className="mt-2 text-xs text-slate-300">Unlock premium monitoring surfaces.</p>
            <button
              type="button"
              className="mt-3 w-full rounded-full bg-gradient-to-r from-sky-500/80 to-indigo-500/70 px-3 py-2 text-xs font-semibold text-white shadow-[0_0_18px_rgba(75,157,251,0.45)]"
            >
              Upgrade Now
            </button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
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

          <div className="flex-1 overflow-y-auto pb-6 pr-2">
            <div className="space-y-8">
              {error ? (
                <div className="admin-panel admin-sweep rounded-2xl borderless-shadow bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              {activeCategory === 'home' ? (
                <>
                  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="admin-card admin-sweep p-6">
                      <div className="flex flex-col gap-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Owner Admin</p>
                        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                          Command Deck
                        </h1>
                        <p className="max-w-xl text-sm text-slate-300">
                          Real-time control for platform, infra, and network operations. Everything is tracked and auditable.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-2 rounded-full bg-[#13171E] px-4 py-1.5 text-xs font-semibold text-white">
                            <ShieldCheck className="h-4 w-4 text-cyan-300" />
                            Owner Access
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-[#13171E] px-4 py-1.5 text-xs font-semibold text-slate-200">
                            Audit logs enabled
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="admin-card admin-float admin-sweep relative overflow-hidden p-6">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(75,157,251,0.25),transparent_55%),radial-gradient(circle_at_85%_10%,rgba(129,140,248,0.2),transparent_50%)] opacity-80" />
                      <div className="flex items-center justify-between text-xs text-slate-200">
                        <span className="font-semibold uppercase tracking-[0.2em]">System Pulse</span>
                        <span className="rounded-full bg-[#13171E] px-3 py-1 text-[10px] font-semibold text-white">Live</span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-white">
                        <div>
                          <p className="text-[11px] uppercase text-slate-300">Total accounts</p>
                          <p className="mt-1 text-2xl font-semibold">{formatNumber(summary?.users?.total)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase text-slate-300">Pending verifications</p>
                          <p className="mt-1 text-2xl font-semibold">{formatNumber(summary?.verification?.pending)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase text-slate-300">Infra alerts</p>
                          <p className="mt-1 text-2xl font-semibold">{formatNumber(network?.alert_count)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase text-slate-300">Open tickets</p>
                          <p className="mt-1 text-2xl font-semibold">{formatNumber(summary?.support?.open)}</p>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-3 text-xs text-slate-200">
                        <span className="rounded-full bg-[#13171E] px-3 py-1">MFA {securityContext.mfa_required ? 'Required' : 'Optional'}</span>
                        <span className="rounded-full bg-[#13171E] px-3 py-1">Exec {securityContext.exec_enabled ? 'Enabled' : 'Simulated'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="admin-card admin-sweep rounded-3xl p-6">
                      <p className="text-sm font-bold">Admin Security</p>
                      <p className="mt-1 text-xs text-slate-500">MFA, device binding, and step-up codes are enforced on destructive actions.</p>
                      <div className="mt-4 space-y-3 text-xs">
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold uppercase text-slate-500">MFA Code</span>
                          <input
                            value={mfaCode}
                            onChange={(event) => setMfaCode(event.target.value)}
                            className="w-full rounded-full borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                            placeholder="Enter MFA code"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold uppercase text-slate-500">Device ID</span>
                          <input
                            value={deviceId}
                            onChange={(event) => setDeviceId(event.target.value)}
                            className="w-full rounded-full borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                            placeholder="Bind this device ID"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold uppercase text-slate-500">Step-up Code</span>
                          <input
                            value={stepUpCode}
                            onChange={(event) => setStepUpCode(event.target.value)}
                            className="w-full rounded-full borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                            placeholder="Required for destructive actions"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold uppercase text-slate-500">Admin Passkey</span>
                          <input
                            value={passkeyValue}
                            onChange={(event) => setPasskeyValue(event.target.value)}
                            className="w-full rounded-full borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                            placeholder="Set a passkey"
                          />
                        </label>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => runSecurityAction('security.admin.mfa.set', { code: mfaCode })}
                          className="rounded-full borderless-shadow bg-black/40 px-3 py-1 text-[10px] font-semibold text-sky-100 hover:bg-white/10"
                        >
                          Save MFA
                        </button>
                        <button
                          type="button"
                          onClick={() => runSecurityAction('security.admin.device.add', { device_id: deviceId })}
                          className="rounded-full borderless-shadow bg-black/40 px-3 py-1 text-[10px] font-semibold text-sky-100 hover:bg-white/10"
                        >
                          Register Device
                        </button>
                        <button
                          type="button"
                          onClick={() => runSecurityAction('security.admin.passkey.add', { passkey: passkeyValue })}
                          className="rounded-full borderless-shadow bg-black/40 px-3 py-1 text-[10px] font-semibold text-sky-100 hover:bg-white/10"
                        >
                          Save Passkey
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                          MFA {securityContext.mfa_required ? 'Required' : 'Optional'}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                          IP allowlist {securityContext.ip_allowlist?.length ? 'On' : 'Off'}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                          Device allowlist {securityContext.device_allowlist?.length ? 'On' : 'Off'}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                          Exec {securityContext.exec_enabled ? 'Enabled' : 'Simulated'}
                        </span>
                      </div>
                    </div>

                    <div className="admin-card admin-sweep rounded-3xl p-6">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        Platform Snapshot
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                        <div>
                          <p className="text-[10px] uppercase text-slate-500">Total accounts</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatNumber(summary?.users?.total)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-slate-500">Verification pending</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatNumber(summary?.verification?.pending)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-slate-500">Reports open</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatNumber(summary?.support?.open)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-slate-500">Domain clicks / visits</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">
                            {formatNumber(summary?.traffic?.clicks)} / {formatNumber(summary?.traffic?.visits)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-slate-500">
                        Premium users: {formatNumber(premiumUsers.length)}. Suspended: {formatNumber(summary?.users?.suspended)}.
                      </div>
                    </div>

                    <div className="admin-card admin-sweep rounded-3xl p-6">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Server className="h-4 w-4 text-indigo-500" />
                        Infra + Network Health
                      </div>
                      <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center justify-between">
                          <span>CPU load (1m)</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{infra?.cpu?.load_1m?.toFixed?.(2) || '--'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Memory used</span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {infra?.memory?.used_bytes ? formatNumber(Math.round(infra.memory.used_bytes / (1024 * 1024))) : '--'} MB
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Devices up/down</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{formatNumber(network?.device_up)} / {formatNumber(network?.device_down)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Network alerts</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{formatNumber(network?.alert_count)}</span>
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-slate-500">Live system stats from infra and network controllers.</p>
                    </div>
                  </div>

                  <div className="admin-card admin-sweep rounded-3xl p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold">Action Console</p>
                        <p className="text-xs text-slate-500">Run platform, infra, and network actions with full audit logging.</p>
                      </div>
                      <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                        <Lock className="h-4 w-4" />
                        Step-up required for destructive actions
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_1fr]">
                      <label className="flex flex-col gap-1 text-xs">
                        <span className="text-[10px] font-semibold uppercase text-slate-500">Action</span>
                        <select
                          value={selectedActionId}
                          onChange={(event) => setSelectedActionId(event.target.value)}
                          className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                        >
                          {ACTION_GROUPS.map((group) => (
                            <optgroup key={group.label} label={group.label}>
                              {group.actions.map((action) => (
                                <option key={action.id} value={action.id}>{action.label}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {selectedAction?.fields?.length ? selectedAction.fields.map((field) => (
                          <label key={field.key} className="flex flex-col gap-1 text-xs">
                            <span className="text-[10px] font-semibold uppercase text-slate-500">{field.label}</span>
                            <input
                              value={actionForm[field.key] || ''}
                              onChange={(event) => setActionForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                              className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                              placeholder={field.label}
                            />
                          </label>
                        )) : (
                          <div className="text-xs text-slate-500">No parameters required.</div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => runAction(selectedAction)}
                      className="admin-glow rounded-full bg-gradient-to-r from-sky-500/80 to-indigo-500/70 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_18px_rgba(75,157,251,0.5)] hover:brightness-110"
                        disabled={actionBusy === selectedAction?.id}
                      >
                        {actionBusy === selectedAction?.id ? 'Running...' : 'Run action'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="admin-card admin-sweep rounded-3xl p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">Active Users</p>
                      <div className="mt-4 h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={activeUsersTrend}>
                            <Line type="monotone" dataKey="count" stroke="#4B9DFB" strokeWidth={2.5} dot={false} isAnimationActive animationDuration={900} />
                            <Tooltip contentStyle={{ background: '#0f0f12', boxShadow: '0 0 0 1px rgba(255,140,30,0.3), 0 14px 30px rgba(0,0,0,0.35)', borderRadius: 12 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="mt-3 text-xs text-slate-300">Last 14 days unique logins</p>
                    </div>
                    <div className="admin-card admin-sweep rounded-3xl p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">Buyer Requests</p>
                      <div className="mt-4 h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={buyerRequestTrend}>
                            <defs>
                              <linearGradient id="reqGlow" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#4B9DFB" stopOpacity={0.6} />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="count" stroke="#4B9DFB" fill="url(#reqGlow)" strokeWidth={2.2} isAnimationActive animationDuration={950} />
                            <Tooltip contentStyle={{ background: '#0f0f12', boxShadow: '0 0 0 1px rgba(255,140,30,0.3), 0 14px 30px rgba(0,0,0,0.35)', borderRadius: 12 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="mt-3 text-xs text-slate-300">Demand flow over time</p>
                    </div>
                    <div className="admin-card admin-sweep rounded-3xl p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">Contract Status</p>
                      <div className="mt-4 h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={contractStatusData} dataKey="value" innerRadius={40} outerRadius={62} paddingAngle={4} isAnimationActive animationDuration={900}>
                              {contractStatusData.map((entry, index) => (
                                <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#0f0f12', boxShadow: '0 0 0 1px rgba(255,140,30,0.3), 0 14px 30px rgba(0,0,0,0.35)', borderRadius: 12 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="mt-3 text-xs text-slate-300">Signed vs pending vs disputes</p>
                    </div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    {premiumBundles.map((bundle) => (
                      <div key={bundle.title} className="admin-card admin-sweep rounded-3xl p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">{bundle.title}</p>
                        <ul className="mt-4 space-y-2 text-xs text-slate-200">
                          {bundle.highlights.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-slate-200">
                              <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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
                      className="w-56 rounded-full borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                      placeholder="Search name/email/role"
                    />
                    <button
                      type="button"
                      onClick={() => exportEmailsCsv(users)}
                      className="rounded-full borderless-shadow bg-black/40 px-3 py-2 text-xs font-semibold text-orange-100 hover:bg-[#13171E]"
                    >
                      Export CSV
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                    className="rounded-full borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
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
                    className="rounded-full borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
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
                    className="rounded-full borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                  >
                    <option value="all">All verification</option>
                    <option value="verified">verified</option>
                    <option value="unverified">unverified</option>
                  </select>
                  <select
                    value={premiumFilter}
                    onChange={(event) => setPremiumFilter(event.target.value)}
                    className="rounded-full borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                  >
                    <option value="all">All plans</option>
                    <option value="premium">premium</option>
                    <option value="free">free</option>
                  </select>
                  <select
                    value={regionFilter}
                    onChange={(event) => setRegionFilter(event.target.value)}
                    className="rounded-full borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
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

                    return (
                      <div key={u.id} className="rounded-2xl borderless-shadow p-4 text-xs">
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
                              className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
                            >
                              Force logout
                            </button>
                            <button
                              type="button"
                              onClick={() => resetPassword(u.id)}
                              className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
                            >
                              Reset password
                            </button>
                            <button
                              type="button"
                              onClick={() => lockMessaging(u.id, 24)}
                              className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
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
                              className="rounded-lg borderless-shadow px-2 py-1 text-xs dark:bg-slate-950"
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
                              className="rounded-lg borderless-shadow px-2 py-1 text-xs dark:bg-slate-950"
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
                              className="rounded-lg borderless-shadow px-2 py-1 text-xs dark:bg-slate-950"
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
                              className="rounded-lg borderless-shadow px-2 py-1 text-xs dark:bg-slate-950"
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
                              className="rounded-lg borderless-shadow px-2 py-1 text-xs dark:bg-slate-950"
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase text-slate-500">Fraud flags</span>
                            <input
                              value={fraudValue}
                              onChange={(event) => updateDraft(u.id, 'fraud_flags', event.target.value)}
                              className="rounded-lg borderless-shadow px-2 py-1 text-xs dark:bg-slate-950"
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
                            className="rounded-lg borderless-shadow px-2 py-1 text-xs dark:bg-slate-950"
                            placeholder="Internal notes visible to admins only"
                          />
                        </label>
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
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
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
                      className="rounded-full borderless-shadow px-3 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Export users CSV
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {signups.slice(0, 4).map((row) => (
                      <div key={row.id} className="rounded-xl borderless-shadow px-2 py-1">
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
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500">Duplicates detected: {fraudReview.duplicates?.length || 0}</div>
                  <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {fraudReview.items.slice(0, 4).map((row) => (
                      <div key={row.user_id || row.id} className="rounded-xl borderless-shadow px-2 py-1">
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
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {strikeHistory.slice(0, 4).map((row) => (
                      <div key={row.id} className="rounded-xl borderless-shadow px-2 py-1">
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
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(orgOwnership.orgs || []).slice(0, 4).map((org) => (
                      <div key={org.org_owner_id} className="rounded-xl borderless-shadow px-2 py-1">
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
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {walletLedger.slice(0, 4).map((row) => (
                      <div key={row.id || row.created_at} className="rounded-xl borderless-shadow px-2 py-1">
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
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(catalog?.emails?.segments || []).slice(0, 4).map((segment) => (
                      <div key={segment.id} className="flex items-center justify-between rounded-xl borderless-shadow px-2 py-1">
                        <span>{segment.name || segment.id}</span>
                        <button
                          type="button"
                          onClick={() => downloadCsv(`/admin/emails/segments/export?segment_id=${encodeURIComponent(segment.id)}`, `segment_${segment.id}.csv`).catch((err) => setError(err.message || 'Export failed'))}
                          className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
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
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <select
                      value={featuredForm.entity_type}
                      onChange={(event) => setFeaturedForm((prev) => ({ ...prev, entity_type: event.target.value }))}
                      className="w-full rounded-lg borderless-shadow px-2 py-1 text-xs dark:bg-slate-950"
                    >
                      <option value="product">Product</option>
                      <option value="request">Buyer request</option>
                    </select>
                    <input
                      value={featuredForm.entity_id}
                      onChange={(event) => setFeaturedForm((prev) => ({ ...prev, entity_id: event.target.value }))}
                      placeholder="Entity ID"
                      className="w-full rounded-lg borderless-shadow px-2 py-1 text-xs dark:bg-slate-950"
                    />
                    <input
                      value={featuredForm.label}
                      onChange={(event) => setFeaturedForm((prev) => ({ ...prev, label: event.target.value }))}
                      placeholder="Label (optional)"
                      className="w-full rounded-lg borderless-shadow px-2 py-1 text-xs dark:bg-slate-950"
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
                      <div key={item.id} className="flex items-center justify-between rounded-xl borderless-shadow px-2 py-1">
                        <span>{item.title} · {item.entity_type}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            await runInlineAdminAction('featured.remove', { listing_id: item.id })
                            await refreshCatalog()
                          }}
                          className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
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
                    className="rounded-full borderless-shadow px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh queue
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  {verificationQueue.slice(0, 20).map((row) => (
                    <details key={row.user_id} className="rounded-2xl borderless-shadow p-4">
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
                  {verificationQueue.length === 0 ? <p className="text-xs text-slate-500">No pending verifications.</p> : null}
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
                    className="rounded-full borderless-shadow px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh contracts
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  {contractsVault.slice(0, 12).map((contract) => {
                    const proofs = paymentProofs.filter((proof) => String(proof.contract_id) === String(contract.id))
                    return (
                      <details key={contract.id} className="rounded-2xl borderless-shadow p-4">
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
                              <div key={proof.id} className="rounded-xl borderless-shadow px-2 py-1">
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
                            className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
                          >
                            Unlock
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await runInlineAdminAction('contract.archive', { contract_id: contract.id })
                              await refreshContractsVault()
                            }}
                            className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
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
                    className="rounded-full borderless-shadow px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh disputes
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  {disputes.slice(0, 12).map((dispute) => (
                    <div key={dispute.id} className="rounded-2xl borderless-shadow p-4">
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
                    className="rounded-full borderless-shadow px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh queue
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Pending Review</p>
                    <div className="mt-2 space-y-2">
                      {moderationPending.slice(0, 6).map((row) => (
                        <div key={row.id} className="rounded-xl borderless-shadow px-3 py-2">
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
                              className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                      {!moderationPending.length ? <p className="text-[11px] text-slate-500">No pending products.</p> : null}
                    </div>
                  </div>
                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Rejected</p>
                    <div className="mt-2 space-y-2">
                      {moderationRejected.slice(0, 6).map((row) => (
                        <div key={row.id} className="rounded-xl borderless-shadow px-3 py-2">
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
                    <div className="rounded-2xl borderless-shadow p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Forbidden Terms (Auto Reject)</p>
                      <textarea
                        rows={6}
                        value={clothingRulesForm.forbidden_terms}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, forbidden_terms: e.target.value }))}
                        placeholder="One term per line"
                        className="mt-2 w-full rounded-xl borderless-shadow px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="rounded-2xl borderless-shadow p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Flag Terms (Pending Review)</p>
                      <textarea
                        rows={6}
                        value={clothingRulesForm.flag_terms}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, flag_terms: e.target.value }))}
                        placeholder="One term per line"
                        className="mt-2 w-full rounded-xl borderless-shadow px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="rounded-2xl borderless-shadow p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Allowed Terms (Safe Signal)</p>
                      <textarea
                        rows={6}
                        value={clothingRulesForm.allowed_terms}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, allowed_terms: e.target.value }))}
                        placeholder="One term per line"
                        className="mt-2 w-full rounded-xl borderless-shadow px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="rounded-2xl borderless-shadow p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Context Exceptions</p>
                      <textarea
                        rows={6}
                        value={clothingRulesForm.context_exceptions}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, context_exceptions: e.target.value }))}
                        placeholder="e.g., innerwear, lining, undershirt"
                        className="mt-2 w-full rounded-xl borderless-shadow px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 text-xs">
                    <div className="rounded-2xl borderless-shadow p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Rejected Reason</p>
                      <textarea
                        rows={4}
                        value={clothingRulesForm.reason_rejected}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, reason_rejected: e.target.value }))}
                        className="mt-2 w-full rounded-xl borderless-shadow px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="rounded-2xl borderless-shadow p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Pending Review Reason</p>
                      <textarea
                        rows={4}
                        value={clothingRulesForm.reason_pending}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, reason_pending: e.target.value }))}
                        className="mt-2 w-full rounded-xl borderless-shadow px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="rounded-2xl borderless-shadow p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">Fix Guidance</p>
                      <textarea
                        rows={4}
                        value={clothingRulesForm.reason_fix}
                        onChange={(e) => setClothingRulesForm((prev) => ({ ...prev, reason_fix: e.target.value }))}
                        className="mt-2 w-full rounded-xl borderless-shadow px-3 py-2 text-xs"
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
                    className="rounded-full borderless-shadow px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh reports
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 text-xs">
                  {[{ title: 'System & Support', items: systemReports }, { title: 'Product Appeals', items: productAppealReports }, { title: 'Content Reports', items: contentReports }].map((group) => (
                    <div key={group.title} className="rounded-2xl borderless-shadow p-4">
                      <p className="text-[11px] font-semibold uppercase text-slate-500">{group.title}</p>
                      <div className="mt-2 space-y-2">
                        {group.items.slice(0, 6).map((row) => (
                          <div key={row.id} className="rounded-xl borderless-shadow px-3 py-2">
                            <p className="text-sm font-semibold text-slate-900">{row.reason || 'Report'}</p>
                            <p className="text-[11px] text-slate-500">{row.entity_id}</p>
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => resolveReportAdmin(row.id, 'reviewed')}
                                className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
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
                    className="rounded-full borderless-shadow px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh tickets
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-xs text-slate-600 sm:grid-cols-4">
                  <select
                    value={supportFilters.status}
                    onChange={(event) => setSupportFilters((prev) => ({ ...prev, status: event.target.value }))}
                    className="rounded-lg borderless-shadow px-3 py-2 text-xs"
                  >
                    <option value="all">All status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <select
                    value={supportFilters.priority}
                    onChange={(event) => setSupportFilters((prev) => ({ ...prev, priority: event.target.value }))}
                    className="rounded-lg borderless-shadow px-3 py-2 text-xs"
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
                    className="rounded-lg borderless-shadow px-3 py-2 text-xs"
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
                    <div key={ticket.id} className="rounded-2xl borderless-shadow p-4">
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
                          className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Assign
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSupportTicketAdmin(ticket.id, { status: 'in_progress' })}
                          className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
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
                          className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
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
                    className="rounded-full borderless-shadow px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh requests
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  {partnerRequests.slice(0, 12).map((request) => (
                    <div key={request.id} className="rounded-2xl borderless-shadow p-4">
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
                          className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Force reject
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await runInlineAdminAction('partner.force_cancel', { request_id: request.id })
                            await refreshPartnerRequests()
                          }}
                          className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600"
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
                    className="rounded-full borderless-shadow px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    Refresh catalog
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
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

                  <div className="rounded-2xl borderless-shadow p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">Traffic + Email Segments</p>
                    <div className="mt-2 space-y-2">
                      <div className="text-[11px] text-slate-500">Clicks: {catalog?.traffic?.summary?.clicks || 0}</div>
                      <div className="text-[11px] text-slate-500">Visits: {catalog?.traffic?.summary?.visits || 0}</div>
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
              <div className="admin-card admin-sweep rounded-3xl p-6">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-sm font-bold">System Overview</p>
                    <p className="text-xs text-slate-500">CPU, memory, storage, and services pulled from infra adapters.</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="rounded-2xl borderless-shadow p-3">
                    <p className="text-[10px] uppercase text-slate-500">CPU</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{infra?.cpu?.cores || '--'} cores</p>
                    <p>Load 1m: {infra?.cpu?.load_1m?.toFixed?.(2) || '--'}</p>
                  </div>
                  <div className="rounded-2xl borderless-shadow p-3">
                    <p className="text-[10px] uppercase text-slate-500">Memory</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {infra?.memory?.used_bytes ? formatNumber(Math.round(infra.memory.used_bytes / (1024 * 1024))) : '--'} MB used
                    </p>
                    <p>Free: {infra?.memory?.free_bytes ? formatNumber(Math.round(infra.memory.free_bytes / (1024 * 1024))) : '--'} MB</p>
                  </div>
                  <div className="rounded-2xl borderless-shadow p-3">
                    <p className="text-[10px] uppercase text-slate-500">Services</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatNumber(infra?.services?.length)}</p>
                    <p>Processes: {formatNumber(infra?.processes?.length)}</p>
                  </div>
                  <div className="rounded-2xl borderless-shadow p-3">
                    <p className="text-[10px] uppercase text-slate-500">Storage + I/O</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatNumber(infra?.storage?.length)} mounts</p>
                    <p>Disk IOPS: {infra?.io?.disk_iops ?? '--'}</p>
                    <p>Bandwidth: {infra?.network?.bandwidth_mbps ?? '--'} Mbps</p>
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'infra' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Firewall Rules</p>
                      <p className="text-xs text-slate-500">Safe presets for allow/deny.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshInfraState()}
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-xs">
                    <select
                      value={`${firewallForm.action}:${firewallForm.port || ''}`}
                      onChange={(event) => {
                        const [actionValue, portValue] = event.target.value.split(':')
                        setFirewallForm((prev) => ({ ...prev, action: actionValue, port: portValue || '', protocol: 'tcp' }))
                      }}
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    >
                      <option value="allow:">Preset (select)</option>
                      <option value="allow:22">Allow SSH 22</option>
                      <option value="allow:80">Allow HTTP 80</option>
                      <option value="allow:443">Allow HTTPS 443</option>
                      <option value="block:25">Block SMTP 25</option>
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={firewallForm.port}
                        onChange={(event) => setFirewallForm((prev) => ({ ...prev, port: event.target.value }))}
                        placeholder="Port"
                        className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                      />
                      <select
                        value={firewallForm.protocol}
                        onChange={(event) => setFirewallForm((prev) => ({ ...prev, protocol: event.target.value }))}
                        className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                      >
                        <option value="tcp">tcp</option>
                        <option value="udp">udp</option>
                      </select>
                    </div>
                    <input
                      value={firewallForm.description}
                      onChange={(event) => setFirewallForm((prev) => ({ ...prev, description: event.target.value }))}
                      placeholder="Description"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => runInfraAction(`firewall.${firewallForm.action}_port`, { port: firewallForm.port, protocol: firewallForm.protocol, description: firewallForm.description })}
                        className="rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white"
                      >
                        Apply rule
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(infraState?.firewall_rules || []).slice(0, 6).map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between rounded-xl borderless-shadow px-2 py-1">
                        <span>{rule.action} {rule.port}/{rule.protocol}</span>
                        <button
                          type="button"
                          onClick={() => runInfraAction('firewall.remove_rule', { rule_id: rule.id })}
                          className="text-[10px] font-semibold text-rose-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {(infraState?.firewall_rules || []).length === 0 ? <p className="text-slate-400">No rules yet.</p> : null}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">Package Updates</p>
                    <p className="text-xs text-slate-500">Safe presets for update checks and installs.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <select
                      value={packageForm.mode}
                      onChange={(event) => setPackageForm((prev) => ({ ...prev, mode: event.target.value, apply: event.target.value !== 'check' }))}
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    >
                      <option value="check">Check updates (safe)</option>
                      <option value="security">Apply security updates</option>
                      <option value="all">Apply all updates</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => runInfraAction('package.update', { mode: packageForm.mode, apply: packageForm.mode !== 'check' })}
                      className="w-full rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white"
                    >
                      Run package action
                    </button>
                  </div>
                  <div className="mt-4 text-[11px] text-slate-500">
                    Last updates: {(infraState?.updates || []).slice(0, 3).map((row) => row.mode).join(', ') || 'none'}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">Cron Manager</p>
                    <p className="text-xs text-slate-500">Schedule safe recurring tasks.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
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
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    >
                      <option value="">Preset (select)</option>
                      <option value="0 2 * * *">Daily backup at 2am</option>
                      <option value="0 0 * * 0">Weekly cleanup (Sunday)</option>
                    </select>
                    <input
                      value={cronForm.name}
                      onChange={(event) => setCronForm((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Job name"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <input
                      value={cronForm.schedule}
                      onChange={(event) => setCronForm((prev) => ({ ...prev, schedule: event.target.value }))}
                      placeholder="Cron schedule"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <input
                      value={cronForm.command}
                      onChange={(event) => setCronForm((prev) => ({ ...prev, command: event.target.value }))}
                      placeholder="Command"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => runInfraAction('cron.add', cronForm)}
                      className="w-full rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white"
                    >
                      Add cron job
                    </button>
                  </div>
                  <div className="mt-4 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(infraState?.cron_jobs || []).slice(0, 4).map((job) => (
                      <div key={job.id} className="flex items-center justify-between rounded-xl borderless-shadow px-2 py-1">
                        <span>{job.name} · {job.schedule}</span>
                        <button
                          type="button"
                          onClick={() => runInfraAction('cron.remove', { job_id: job.id })}
                          className="text-[10px] font-semibold text-rose-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {(infraState?.cron_jobs || []).length === 0 ? <p className="text-slate-400">No cron jobs yet.</p> : null}
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'infra' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">System Logs + Zombie Scan</p>
                      <p className="text-xs text-slate-500">Syslog snapshots and zombie detection.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => runInfraAction('log.collect', { level: 'info', message: 'Manual log snapshot' })}
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Collect logs
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(infraState?.logs || []).slice(0, 4).map((log) => (
                      <div key={log.id} className="rounded-xl borderless-shadow px-2 py-1">
                        {log.level || 'info'} · {log.message}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => runInfraAction('process.scan_zombies')}
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Scan zombies
                    </button>
                    {(infraState?.zombie_processes || []).slice(0, 2).map((proc) => (
                      <div key={proc.pid} className="text-[10px] text-rose-500">Zombie: {proc.name} ({proc.pid})</div>
                    ))}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">OS Users + SSH Keys</p>
                    <p className="text-xs text-slate-500">Create/delete accounts and manage keys.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <input
                      value={osUserForm.username}
                      onChange={(event) => setOsUserForm((prev) => ({ ...prev, username: event.target.value }))}
                      placeholder="Username"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => runInfraAction('os.user.create', { username: osUserForm.username, role: osUserForm.role })}
                      className="w-full rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white"
                    >
                      Create OS user
                    </button>
                    <input
                      value={sshKeyForm.label}
                      onChange={(event) => setSshKeyForm((prev) => ({ ...prev, label: event.target.value }))}
                      placeholder="SSH key label"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <input
                      value={sshKeyForm.fingerprint}
                      onChange={(event) => setSshKeyForm((prev) => ({ ...prev, fingerprint: event.target.value }))}
                      placeholder="Fingerprint"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => runInfraAction('ssh.key.add', sshKeyForm)}
                      className="w-full rounded-full borderless-shadow px-3 py-2 text-[11px] font-semibold text-slate-600"
                    >
                      Add SSH key
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(infraState?.os_users || []).slice(0, 3).map((userRow) => (
                      <div key={userRow.id} className="flex items-center justify-between rounded-xl borderless-shadow px-2 py-1">
                        <span>{userRow.username}</span>
                        <button
                          type="button"
                          onClick={() => runInfraAction('os.user.delete', { username: userRow.username })}
                          className="text-[10px] font-semibold text-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {(infraState?.ssh_keys || []).slice(0, 2).map((key) => (
                      <div key={key.id} className="flex items-center justify-between rounded-xl borderless-shadow px-2 py-1">
                        <span>{key.label}</span>
                        <button
                          type="button"
                          onClick={() => runInfraAction('ssh.key.remove', { key_id: key.id })}
                          className="text-[10px] font-semibold text-rose-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">SSL + Backups + Network Settings</p>
                    <p className="text-xs text-slate-500">Certificates, retention, DNS, timezone.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <input
                      value={sslForm.domain}
                      onChange={(event) => setSslForm((prev) => ({ ...prev, domain: event.target.value }))}
                      placeholder="Domain"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => runInfraAction('ssl.cert.issue', { domain: sslForm.domain })}
                      className="w-full rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white"
                    >
                      Issue SSL cert
                    </button>
                    <input
                      value={infraBackupForm.retention_days}
                      onChange={(event) => setInfraBackupForm((prev) => ({ ...prev, retention_days: event.target.value }))}
                      placeholder="Retention days"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => runInfraAction('backup.retention', { retention_days: infraBackupForm.retention_days })}
                      className="w-full rounded-full borderless-shadow px-3 py-2 text-[11px] font-semibold text-slate-600"
                    >
                      Update retention
                    </button>
                    <input
                      value={timeForm.timezone}
                      onChange={(event) => setTimeForm((prev) => ({ ...prev, timezone: event.target.value }))}
                      placeholder="Timezone (e.g. UTC)"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => runInfraAction('system.timezone.set', { timezone: timeForm.timezone })}
                      className="w-full rounded-full borderless-shadow px-3 py-2 text-[11px] font-semibold text-slate-600"
                    >
                      Set timezone
                    </button>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-300">
                    Retention: {infraState?.backups?.retention_days || 0} days · SSLs: {(infraState?.ssl_certs || []).length}
                    <div>Timezone: {infraState?.time_settings?.timezone || 'unset'}</div>
                    <div>NTP sync: {infraState?.time_settings?.last_sync_at || 'never'}</div>
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'network' ? (
              <div className="admin-card admin-sweep rounded-3xl p-6">
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-bold">Network Overview</p>
                    <p className="text-xs text-slate-500">Topology status, alerts, and real-time diagnostics.</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="rounded-2xl borderless-shadow p-3">
                    <p className="text-[10px] uppercase text-slate-500">Devices</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatNumber(network?.device_total)}</p>
                    <p>Up: {formatNumber(network?.device_up)} / Down: {formatNumber(network?.device_down)}</p>
                  </div>
                  <div className="rounded-2xl borderless-shadow p-3">
                    <p className="text-[10px] uppercase text-slate-500">Alerts</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatNumber(network?.alert_count)}</p>
                    <p>Latency: {network?.traffic_summary?.latency_ms ?? '--'} ms</p>
                    <p>Jitter: {network?.traffic_summary?.jitter_ms ?? '--'} ms</p>
                  </div>
                  <div className="rounded-2xl borderless-shadow p-3">
                    <p className="text-[10px] uppercase text-slate-500">Bandwidth</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{network?.traffic_summary?.bandwidth_mbps ?? '--'} Mbps</p>
                    <p>Loss: {network?.traffic_summary?.packet_loss_pct ?? '--'}%</p>
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'network' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Device Inventory</p>
                      <p className="text-xs text-slate-500">Realtime device status.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshNetworkInventory()}
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(networkInventory?.devices || []).slice(0, 6).map((device) => (
                      <div key={device.id} className="flex items-center justify-between rounded-xl borderless-shadow px-2 py-1">
                        <span>{device.name || device.id} · {device.status}</span>
                        <button
                          type="button"
                          onClick={() => runNetworkAction('device.reboot', { device_id: device.id })}
                          className="text-[10px] font-semibold text-indigo-600"
                        >
                          Reboot
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">VLAN Management</p>
                    <p className="text-xs text-slate-500">Create and retire VLANs.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <input
                      value={vlanForm.vlan_id}
                      onChange={(event) => setVlanForm((prev) => ({ ...prev, vlan_id: event.target.value }))}
                      placeholder="VLAN ID"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <input
                      value={vlanForm.name}
                      onChange={(event) => setVlanForm((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Name"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <input
                      value={vlanForm.subnet}
                      onChange={(event) => setVlanForm((prev) => ({ ...prev, subnet: event.target.value }))}
                      placeholder="Subnet"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <input
                      value={vlanForm.gateway}
                      onChange={(event) => setVlanForm((prev) => ({ ...prev, gateway: event.target.value }))}
                      placeholder="Gateway"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => runNetworkAction('vlan.create', vlanForm)}
                      className="w-full rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white"
                    >
                      Add VLAN
                    </button>
                  </div>
                  <div className="mt-4 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(networkInventory?.vlans || []).slice(0, 4).map((vlan) => (
                      <div key={vlan.id} className="flex items-center justify-between rounded-xl borderless-shadow px-2 py-1">
                        <span>VLAN {vlan.id} · {vlan.subnet}</span>
                        <button
                          type="button"
                          onClick={() => runNetworkAction('vlan.delete', { vlan_id: vlan.id })}
                          className="text-[10px] font-semibold text-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">IPAM + Config Backups</p>
                    <p className="text-xs text-slate-500">Reserve IPs and capture configs.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <input
                      value={ipamForm.ip}
                      onChange={(event) => setIpamForm((prev) => ({ ...prev, ip: event.target.value }))}
                      placeholder="IP address"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <input
                      value={ipamForm.owner}
                      onChange={(event) => setIpamForm((prev) => ({ ...prev, owner: event.target.value }))}
                      placeholder="Owner"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => runNetworkAction('ipam.reserve', ipamForm)}
                      className="w-full rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white"
                    >
                      Reserve IP
                    </button>
                    <input
                      value={backupForm.device_id}
                      onChange={(event) => setBackupForm({ device_id: event.target.value })}
                      placeholder="Device ID for backup"
                      className="rounded-lg borderless-shadow px-3 py-2 text-xs dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => runNetworkAction('config.backup', backupForm)}
                      className="w-full rounded-full borderless-shadow px-3 py-2 text-[11px] font-semibold text-slate-600"
                    >
                      Run config backup
                    </button>
                  </div>
                  <div className="mt-4 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(networkInventory?.ipam_reservations || []).slice(0, 3).map((row) => (
                      <div key={row.id} className="flex items-center justify-between rounded-xl borderless-shadow px-2 py-1">
                        <span>{row.ip} · {row.owner || 'reserved'}</span>
                        <button
                          type="button"
                          onClick={() => runNetworkAction('ipam.release', { ip: row.ip })}
                          className="text-[10px] font-semibold text-rose-600"
                        >
                          Release
                        </button>
                      </div>
                    ))}
                    {(networkInventory?.config_backups || []).slice(0, 2).map((row) => (
                      <div key={row.id} className="text-[11px] text-slate-500">Backup {row.device_id || 'device'} · {row.created_at}</div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'network' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">IDS/IPS + Rogue AP</p>
                    <p className="text-xs text-slate-500">Security monitoring feeds.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(networkInventory?.ids_alerts || []).slice(0, 3).map((alert) => (
                      <div key={alert.id} className="rounded-xl borderless-shadow px-2 py-1">
                        {alert.severity} · {alert.message}
                      </div>
                    ))}
                    {(networkInventory?.rogue_aps || []).slice(0, 2).map((ap) => (
                      <div key={ap.id} className="text-[11px] text-rose-500">Rogue AP: {ap.ssid}</div>
                    ))}
                    <div className="text-[11px] text-slate-500">Firmware jobs: {(networkInventory?.firmware_jobs || []).length}</div>
                    <div className="text-[11px] text-slate-500">Bulk config jobs: {(networkInventory?.bulk_config_jobs || []).length}</div>
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">NetFlow + Alert Integrations</p>
                    <p className="text-xs text-slate-500">Traffic analytics and alert sinks.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(networkInventory?.flow_stats || []).slice(0, 2).map((flow) => (
                      <div key={flow.id} className="rounded-xl borderless-shadow px-2 py-1">
                        Flows: {flow.total_flows}
                      </div>
                    ))}
                    {(networkInventory?.alert_integrations || []).slice(0, 2).map((integration) => (
                      <div key={integration.id} className="text-[11px] text-slate-500">{integration.type}: {integration.target}</div>
                    ))}
                    <div className="text-[11px] text-slate-500">Config audits: {(networkInventory?.config_audit || []).length}</div>
                    <div className="text-[11px] text-slate-500">QoS policies: {(networkInventory?.qos_policies || []).length}</div>
                    <div className="text-[11px] text-slate-500">Traffic shaping: {(networkInventory?.traffic_shapes || []).length}</div>
                    <div className="text-[11px] text-slate-500">Restore jobs: {(networkInventory?.config_restore_jobs || []).length}</div>
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">Client Monitoring + Auth Servers</p>
                    <p className="text-xs text-slate-500">Connected clients and RADIUS/TACACS.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(networkInventory?.clients || []).slice(0, 3).map((client) => (
                      <div key={client.id} className="rounded-xl borderless-shadow px-2 py-1">
                        {client.ip || client.mac} · {client.status || 'online'}
                      </div>
                    ))}
                    {(networkInventory?.auth_servers || []).slice(0, 2).map((srv) => (
                      <div key={srv.id} className="text-[11px] text-slate-500">{srv.type}: {srv.host}</div>
                    ))}
                    <div className="text-[11px] text-slate-500">Active tunnels: {(networkInventory?.tunnels || []).length}</div>
                    <div className="text-[11px] text-slate-500">VPN tunnels: {(networkInventory?.vpn_tunnels || []).length}</div>
                    <div className="text-[11px] text-slate-500">Firewall policies: {(networkInventory?.firewall_policies || []).length}</div>
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'server-admin' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Web Server + PHP</p>
                      <p className="text-xs text-slate-500">Config editor and version manager.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshServerAdminState()}
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-300">
                    Web: {serverAdminState?.web_server?.type} · {serverAdminState?.web_server?.status}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300">
                    PHP {serverAdminState?.php?.version}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">Domains + Apps</p>
                    <p className="text-xs text-slate-500">DNS, installers, and file manager.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(serverAdminState?.domains || []).slice(0, 3).map((domain) => (
                      <div key={domain.id} className="rounded-xl borderless-shadow px-2 py-1">
                        {domain.domain} · {domain.status}
                      </div>
                    ))}
                    {(serverAdminState?.apps || []).slice(0, 2).map((app) => (
                      <div key={app.id} className="text-[11px] text-slate-500">{app.name} · {app.version}</div>
                    ))}
                    <div className="text-[11px] text-slate-500">Files: {(serverAdminState?.files || []).length}</div>
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">RBAC + Queues + Backups</p>
                    <p className="text-xs text-slate-500">Admin roles and task queues.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(serverAdminState?.rbac_roles || []).slice(0, 3).map((role) => (
                      <div key={role.id} className="rounded-xl borderless-shadow px-2 py-1">
                        {role.name} · {role.permissions?.length || 0} perms
                      </div>
                    ))}
                    {(serverAdminState?.task_queues || []).slice(0, 2).map((queue) => (
                      <div key={queue.id} className="text-[11px] text-slate-500">{queue.name} · {queue.pending} pending</div>
                    ))}
                    <div className="text-[11px] text-slate-500">IDS status: {serverAdminState?.security?.ids_status || 'idle'}</div>
                    <div className="text-[11px] text-slate-500">DB admin sessions: {(serverAdminState?.db_admin_sessions || []).length}</div>
                    <div className="text-[11px] text-slate-500">Backup providers: {(serverAdminState?.backups?.providers || []).length}</div>
                    <div className="text-[11px] text-slate-500">Auto updates: {serverAdminState?.automation?.auto_updates ? 'On' : 'Off'} · Window {serverAdminState?.automation?.patch_window || '--'}</div>
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Integrations + Installers</p>
                      <p className="text-xs text-slate-500">Provider wiring and tooling status.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshIntegrationStatus()}
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="text-[11px] text-slate-500">Signature: {integrationStatus?.signature?.provider || '--'} · {integrationStatus?.signature?.configured ? 'configured' : 'missing'}</div>
                    <div className="text-[11px] text-slate-500">Bank validation: {integrationStatus?.bank_validation?.provider || '--'} · {integrationStatus?.bank_validation?.configured ? 'configured' : 'missing'}</div>
                    <div className="text-[11px] text-slate-500">IDS/IPS: {integrationStatus?.ids_ips?.source || '--'} · {integrationStatus?.ids_ips?.configured ? 'configured' : 'missing'}</div>
                    <div className="text-[11px] text-slate-500">RADIUS/TACACS: {(integrationStatus?.radius?.configured || integrationStatus?.tacacs?.configured) ? 'configured' : 'missing'}</div>
                    <div className="text-[11px] text-slate-500">Rogue AP: {integrationStatus?.rogue_ap?.configured ? 'configured' : 'missing'} · NetFlow: {integrationStatus?.netflow?.configured ? 'configured' : 'missing'}</div>
                    <div className="text-[11px] text-slate-500">Alert delivery: Slack {integrationStatus?.alert_delivery?.slack ? 'on' : 'off'} · SMS {integrationStatus?.alert_delivery?.sms ? 'on' : 'off'} · Email {integrationStatus?.alert_delivery?.email ? 'on' : 'off'}</div>
                    <div className="text-[11px] text-slate-500">Backups: S3 {integrationStatus?.backups?.s3 ? 'on' : 'off'} · GCS {integrationStatus?.backups?.gcs ? 'on' : 'off'} · Spaces {integrationStatus?.backups?.spaces ? 'on' : 'off'}</div>
                    <div className="text-[11px] text-slate-500">Installer: {integrationStatus?.installers?.source || 'unknown'} · {integrationStatus?.installers?.os || '--'}</div>
                    <div className="text-[11px] text-slate-500">Registrar: {integrationStatus?.registrar?.provider || '--'} · {integrationStatus?.registrar?.configured ? 'configured' : 'missing'}</div>
                    {serverAdminState?.db_admin_ui?.configured ? (
                      <a
                        href={serverAdminState.db_admin_ui.phpmyadmin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-slate-700 underline"
                      >
                        Open phpMyAdmin
                      </a>
                    ) : (
                      <div className="text-[11px] text-slate-500">phpMyAdmin: not configured</div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'cms' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Articles + Pages</p>
                      <p className="text-xs text-slate-500">Headless CMS editor output.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshCmsState()}
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(cmsState?.articles || []).slice(0, 3).map((article) => (
                      <div key={article.id} className="rounded-xl borderless-shadow px-2 py-1">
                        {article.title} · {article.status}
                      </div>
                    ))}
                    {(cmsState?.pages || []).slice(0, 2).map((page) => (
                      <div key={page.id} className="text-[11px] text-slate-500">{page.title}</div>
                    ))}
                    <div className="text-[11px] text-slate-500">Media items: {(cmsState?.media || []).length}</div>
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">Theme + SEO + Cache</p>
                    <p className="text-xs text-slate-500">Frontend configuration.</p>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-300">
                    Theme: {cmsState?.theme?.active}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300">
                    SEO title: {cmsState?.seo?.default_title}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300">
                    Cache cleared: {cmsState?.cache?.last_cleared_at || 'never'}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300">
                    Env vars: {Object.keys(cmsState?.env?.vars || {}).length}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">Deployments + Backups</p>
                    <p className="text-xs text-slate-500">Automation and cron scripts.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(cmsState?.deployments || []).slice(0, 2).map((deploy) => (
                      <div key={deploy.id} className="rounded-xl borderless-shadow px-2 py-1">
                        {deploy.branch} · {deploy.status}
                      </div>
                    ))}
                    <div className="text-[11px] text-slate-500">Versions: {(cmsState?.versions || []).length}</div>
                    {(cmsState?.cron_scripts || []).slice(0, 2).map((job) => (
                      <div key={job.id} className="text-[11px] text-slate-500">{job.command} · {job.schedule}</div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {activeCategory === 'ultra-security' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">Zero Trust + MFA</p>
                      <p className="text-xs text-slate-500">Session control and device fingerprints.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshSecurityState()}
                      className="rounded-full borderless-shadow px-2 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <div>Zero-trust: {securityState?.zero_trust?.enabled ? 'On' : 'Off'}</div>
                    <div>MFA required: {securityState?.mfa?.required ? 'Yes' : 'No'}</div>
                    <div>Session timeout: {securityState?.session?.timeout_minutes} min</div>
                    <div>IP allowlist: {(securityState?.ip_whitelist || []).length}</div>
                    <div>Geo-fence: {securityState?.geo_fence?.enabled ? 'On' : 'Off'}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => runSecurityAction('security.zero_trust.toggle', { enabled: !securityState?.zero_trust?.enabled })}
                      className="rounded-full borderless-shadow px-3 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Toggle zero-trust
                    </button>
                    <button
                      type="button"
                      onClick={() => runSecurityAction('security.encryption.rotate')}
                      className="rounded-full borderless-shadow px-3 py-1 text-[10px] font-semibold text-slate-600"
                    >
                      Rotate keys
                    </button>
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">Incident Response</p>
                    <p className="text-xs text-slate-500">Incident dashboard and approvals.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {(securityState?.incidents || []).slice(0, 3).map((incident) => (
                      <div key={incident.id} className="rounded-xl borderless-shadow px-2 py-1">
                        {incident.title} · {incident.status}
                      </div>
                    ))}
                    {(securityState?.data_exports?.pending || []).slice(0, 2).map((req) => (
                      <div key={req.id} className="text-[11px] text-slate-500">Export {req.dataset} · {req.status}</div>
                    ))}
                  </div>
                </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div>
                    <p className="text-sm font-bold">Forensic + Immutable Backups</p>
                    <p className="text-xs text-slate-500">Tamper-proof logs and snapshots.</p>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <div>Forensic logs: {(securityState?.forensic_logs || []).length}</div>
                    <div>Immutable snapshots: {securityState?.immutable_backups?.last_snapshot_at || 'none'}</div>
                    <div>Last key rotation: {securityState?.encryption?.last_rotated_at || 'never'}</div>
                    <div>Tamper-proof logs: {securityState?.tamper_proof_logs?.enabled ? 'On' : 'Off'}</div>
                    <div>System events: {(securityState?.system_events || []).length}</div>
                    {(securityState?.system_events || []).slice(0, 2).map((evt) => (
                      <div key={evt.id} className="text-[11px] text-slate-500">{evt.level || 'event'} · {evt.message}</div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

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
                          <div key={item} className="rounded-xl borderless-shadow px-3 py-2 text-[11px] text-slate-600 dark:text-slate-300">
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="rounded-2xl borderless-shadow p-4 text-xs text-slate-600 dark:text-slate-300">
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
          </section>

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
                  className="rounded-full borderless-shadow bg-black/40 px-3 py-1 text-[10px] font-semibold text-sky-100 hover:bg-[#13171E]"
                >
                  Refresh
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                {verificationQueue.slice(0, 3).map((row) => (
                  <div key={row.id || row.user_id} className="rounded-2xl borderless-shadow px-3 py-2">
                    <p className="text-[11px] font-semibold">{row.user_name || row.user_email || row.user_id}</p>
                    <p className="text-[10px] text-slate-400">Doc: {row.doc_type || row.type || 'business'} · Status: {row.status || 'pending'}</p>
                  </div>
                ))}
                {!verificationQueue.length ? (
                  <p className="text-[11px] text-slate-400">No pending verifications in queue.</p>
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
                  className="rounded-full borderless-shadow bg-black/40 px-3 py-1 text-[10px] font-semibold text-sky-100 hover:bg-[#13171E]"
                >
                  Sync
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                {disputes.slice(0, 3).map((dispute) => (
                  <div key={dispute.id} className="rounded-2xl borderless-shadow px-3 py-2">
                    <p className="text-[11px] font-semibold">{dispute.title || dispute.contract_id || 'Dispute'}</p>
                    <p className="text-[10px] text-slate-400">Status: {dispute.status || 'open'} · Priority: {dispute.priority || 'normal'}</p>
                  </div>
                ))}
                {!disputes.length ? (
                  <p className="text-[11px] text-slate-400">No active disputes.</p>
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
                  className="rounded-full borderless-shadow bg-black/40 px-3 py-1 text-[10px] font-semibold text-sky-100 hover:bg-[#13171E]"
                >
                  Refresh
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                {audit.slice(0, 5).map((entry) => (
                  <div key={entry.id || entry.at} className="rounded-2xl borderless-shadow px-3 py-2">
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
        </div>

                <div className="admin-card admin-sweep rounded-3xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">Admin Audit Log</p>
                      <p className="text-xs text-slate-500">Immutable, tamper-evident audit trail for every admin action.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshAudit()}
                    className="rounded-full borderless-shadow bg-black/40 px-3 py-1 text-xs font-semibold text-sky-100 hover:bg-[#13171E]"
                    >
                      Refresh log
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {audit.slice(0, 10).map((entry) => (
                      <div key={entry.id} className="rounded-xl borderless-shadow px-3 py-2 text-[11px] text-slate-600 dark:text-slate-300">
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
                </>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


