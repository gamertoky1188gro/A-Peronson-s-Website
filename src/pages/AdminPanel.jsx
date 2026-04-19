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
  link.remove()
  URL.revokeObjectURL(url)
}

function AdminSecurityOverlay({ error, onResolve }) {
  const [mfa, setMfa] = useState(() => localStorage.getItem('admin_mfa_code') || '')
  const [passkey, setPasskey] = useState(() => localStorage.getItem('admin_passkey') || '')
  const [stepup, setStepup] = useState(() => localStorage.getItem('admin_stepup_code') || '')
  const [deviceId, setDeviceId] = useState(() => localStorage.getItem('admin_device_id') || 'CCM')
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState('')

  async function handleUnlock() {
    localStorage.setItem('admin_mfa_code', mfa)
    localStorage.setItem('admin_passkey', passkey)
    localStorage.setItem('admin_stepup_code', stepup)
    localStorage.setItem('admin_device_id', deviceId)
    onResolve()
  }

  async function handleRegisterDevice() {
    setBusy(true)
    setLocalError('')
    try {
      const token = getToken()
      const res = await apiRequest('/admin/security/actions', {
        method: 'POST',
        token,
        body: {
          action: 'security.admin.device.add',
          payload: { device_id: deviceId }
        }
      })
      if (res.ok || res.status === 200) {
        localStorage.setItem('admin_device_id', deviceId)
        onResolve()
      } else {
        setLocalError(res.error || 'Failed to register device. Ensure MFA/Passkey is correct.')
      }
    } catch (err) {
      setLocalError(err.message || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
      <div className="admin-panel admin-sweep w-full max-w-md rounded-[32px] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
          <Activity className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Security Access Required</h2>
        <p className="mt-2 text-sm text-slate-400">
          {error || 'Your device is not registered or security credentials are required to unlock the Admin Matrix.'}
        </p>

        <div className="mt-8 space-y-4 text-left">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">MFA Code</span>
            <input
              type="text"
              value={mfa}
              onChange={(e) => setMfa(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-slate-900 border-none px-4 py-3 text-sm text-white placeholder:text-slate-700 shadow-borderless focus:ring-2 focus:ring-sky-500/50 transition-all"
              placeholder="Enter MFA code"
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Admin Passkey</span>
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-slate-900 border-none px-4 py-3 text-sm text-white placeholder:text-slate-700 shadow-borderless focus:ring-2 focus:ring-sky-500/50 transition-all"
              placeholder="Enter security passkey"
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Device ID</span>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-slate-900 border-none px-4 py-3 text-sm text-white placeholder:text-slate-700 shadow-borderless focus:ring-2 focus:ring-sky-500/50 transition-all"
              placeholder="Device identifier (e.g. CCM)"
            />
          </label>

          {localError && (
            <p className="text-xs font-semibold text-rose-400 mt-2 bg-rose-400/10 py-2 px-3 rounded-xl">
              {localError}
            </p>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleUnlock}
            className="rounded-2xl bg-slate-800 py-3 text-sm font-bold text-white hover:bg-slate-700 transition-colors"
          >
            Unlock Session
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleRegisterDevice}
            className="rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {busy ? 'Registering...' : 'Register Device'}
          </button>
        </div>

        <p className="mt-6 text-[10px] text-slate-600">
          Ultra Security Layer: All access attempts are logged and tied to device hardware fingerprints.
        </p>
      </div>
    </div>
  )
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
  const [securityDenied, setSecurityDenied] = useState(false)
  const [securityError, setSecurityError] = useState('')
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
    const rules = master?.config?.moderation?.clothing_rules
    if (rules) {
      setClothingRulesForm({
        forbidden_terms: listToTextarea(rules.forbidden_terms),
        flag_terms: listToTextarea(rules.flag_terms),
        allowed_terms: listToTextarea(rules.allowed_terms),
        context_exceptions: listToTextarea(rules.context_exceptions),
        reason_templates: {
          rejected: String(rules?.reason_templates?.rejected || '').trim(),
          pending_review: String(rules?.reason_templates?.pending_review || '').trim(),
          fix_guidance: String(rules?.reason_templates?.fix_guidance || '').trim(),
        },
      })
    }

    const email = master?.config?.notifications?.email
    if (email) {
      setEmailConfig({
        enabled: Boolean(email.enabled),
        provider: email.provider || 'smtp',
        from_name: String(email.from_name || '').trim(),
        from_email: String(email.from_email || '').trim(),
        test_recipient: String(email.test_recipient || '').trim(),
      })
    }

    const opensearch = master?.config?.integrations?.opensearch
    if (opensearch) {
      setOpenSearchConfig({
        enabled: Boolean(opensearch.enabled),
        url: String(opensearch.url || '').trim(),
        username: String(opensearch.username || '').trim(),
        password: String(opensearch.password || ''),
        index_prefix: String(opensearch.index_prefix || '').trim(),
        timeout_ms: Math.max(500, Math.min(60000, Number(opensearch.timeout_ms || 3000))),
        verify_tls: Boolean(opensearch.verify_tls),
      })
    }
  }, [master?.config])

  const refreshAudit = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const auditData = await apiRequest('/admin/audit?limit=40', { token })
      setAudit(Array.isArray(auditData?.items) ? auditData.items : [])
    } catch (err) {
      if (err.status === 403) setSecurityDenied(true)
    }
  }, [])

  const loadAllData = useCallback(async () => {
    const token = getToken()
    if (!token) return

    setLoading(true)
    setSecurityError('')
    
    try {
      const [masterData, userRows, infraData, infraStateData, networkData, networkInventoryData, auditData, verificationData, contractsData, disputesData, partnersData, proofsData, catalogData, couponReportData, serverAdminData, cmsData, securityData, integrationData, signupsData, strikesData, fraudData, orgOwnershipData, walletLedgerData] = await Promise.all([
        apiRequest('/admin/master', { token }),
        apiRequest('/admin/users', { token }),
        apiRequest('/infra/overview', { token }),
        apiRequest('/infra/state', { token }),
        apiRequest('/network/overview', { token }),
        apiRequest('/network/inventory', { token }),
        apiRequest('/admin/audit?limit=40', { token }),
        apiRequest('/verification/admin/queue', { token }),
        apiRequest('/admin/contracts', { token }),
        apiRequest('/admin/disputes', { token }),
        apiRequest('/admin/partner-requests', { token }),
        apiRequest('/admin/payment-proofs', { token }),
        apiRequest('/admin/catalog', { token }),
        apiRequest('/admin/coupons/report', { token }),
        apiRequest('/admin/server-admin/state', { token }),
        apiRequest('/admin/cms/state', { token }),
        apiRequest('/admin/security/state', { token }),
        apiRequest('/admin/integrations/status', { token }),
        apiRequest('/admin/signups', { token }),
        apiRequest('/admin/strikes', { token }),
        apiRequest('/admin/fraud/verification', { token }),
        apiRequest('/admin/orgs/ownership', { token }),
        apiRequest('/admin/wallet/ledger', { token }),
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
      
      setSecurityDenied(false)
    } catch (err) {
      if (err.status === 403) {
        setSecurityDenied(true)
      } else {
        setError(err.message || 'Failed to load panel data')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isOwner) return
    loadAllData()
  }, [isOwner, loadAllData])
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
      await apiRequest(`/users/${userId}`, { method: 'PATCH', token, body: cleaned })
      setUserDrafts((prev) => {
        const next = { ...prev }
        delete next[userId]
        return next
      })
      const updatedUsers = await apiRequest('/admin/users', { token })
      setUsers(Array.isArray(updatedUsers) ? updatedUsers : [])
    } catch (err) {
      setError(err.message || 'Failed to update user')
    }
  }

  async function resetPassword(userId) {
    const token = getToken()
    if (!token) return
    const newPassword = window.prompt('Enter a new password (min 6 chars):')
    if (!newPassword) return
    try {
      await apiRequest(`/users/${userId}/reset-password`, { method: 'POST', token, body: { new_password: newPassword } })
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    }
  }

  async function forceLogout(userId) {
    const token = getToken()
    if (!token) return
    if (!window.confirm('Force logout this user?')) return
    try {
      await apiRequest(`/users/${userId}/force-logout`, { method: 'POST', token })
    } catch (err) {
      setError(err.message || 'Failed to force logout')
    }
  }

  async function lockMessaging(userId, hours = 24) {
    const token = getToken()
    if (!token) return
    try {
      await apiRequest(`/users/${userId}/lock-messaging`, { method: 'POST', token, body: { lock_hours: hours } })
    } catch (err) {
      setError(err.message || 'Failed to lock messaging')
    }
  }

  async function runAction(actionConfig) {
    if (!actionConfig) return
    const token = getToken()
    if (!token) return
    setActionBusy(actionConfig.id)
    try {
      await apiRequest(actionConfig.route, {
        method: 'POST',
        token,
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
    try {
      await apiRequest('/admin/actions', {
        method: 'POST',
        token,
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
    const data = await apiRequest('/verification/admin/queue', { token })
    setVerificationQueue(Array.isArray(data?.items) ? data.items : [])
  }

  async function refreshContractsVault() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/contracts', { token })
    setContractsVault(Array.isArray(data?.items) ? data.items : [])
  }

  async function refreshDisputes() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/disputes', { token })
    setDisputes(Array.isArray(data?.items) ? data.items : [])
  }

  const refreshSupportTickets = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setSupportLoading(true)
    try {
      const params = new URLSearchParams()
      if (supportFilters.status && supportFilters.status !== 'all') params.set('status', supportFilters.status)
      if (supportFilters.priority && supportFilters.priority !== 'all') params.set('priority', supportFilters.priority)
      if (supportFilters.assigned_to) params.set('assigned_to', supportFilters.assigned_to)
      const query = params.toString()
      const path = query ? `/admin/support/tickets?${query}` : '/admin/support/tickets'
      const data = await apiRequest(path, { token })
      setSupportTickets(Array.isArray(data?.items) ? data.items : [])
    } catch (err) {
      setSupportTickets([])
      setError(err.message || 'Failed to load support tickets')
    } finally {
      setSupportLoading(false)
    }
  }, [supportFilters])

  const refreshModerationQueues = useCallback(async () => {
    const token = getToken()
    if (!token) return
    const [pendingData, rejectedData] = await Promise.all([
      apiRequest('/admin/moderation/products?status=pending_review', { token }),
      apiRequest('/admin/moderation/products?status=rejected', { token }),
    ])
    setModerationPending(Array.isArray(pendingData?.items) ? pendingData.items : [])
    setModerationRejected(Array.isArray(rejectedData?.items) ? rejectedData.items : [])
  }, [])

  const refreshReportQueues = useCallback(async () => {
    const token = getToken()
    if (!token) return
    const [systemData, appealData, contentData] = await Promise.all([
      apiRequest('/admin/reports/system', { token }),
      apiRequest('/admin/reports/product-appeals', { token }),
      apiRequest('/admin/reports/content', { token }),
    ])
    setSystemReports(Array.isArray(systemData?.items) ? systemData.items : [])
    setProductAppealReports(Array.isArray(appealData?.items) ? appealData.items : [])
    setContentReports(Array.isArray(contentData?.items) ? contentData.items : [])
  }, [])


  const refreshMessagePolicyOps = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const [queueData, reviewData, metricsData] = await Promise.all([
        apiRequest('/messages/policy/queue-inspector?status=queued', { token }),
        apiRequest('/messages/policy/review-queue', { token }),
        apiRequest('/messages/policy/reports/weekly-decision-quality', { token }),
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
  }, [])

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
    const note = window.prompt('Resolution note (optional):') || ''
    await apiRequest(`/admin/reports/${encodeURIComponent(reportId)}/resolve`, {
      method: 'POST',
      token,
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
    await apiRequest('/admin/support/assign', {
      method: 'POST',
      token,
      body: { ticket_id: ticketId, assignee_id: assigneeId },
    })
    await refreshSupportTickets()
    await refreshAudit()
  }

  async function updateSupportTicketAdmin(ticketId, patch = {}) {
    const token = getToken()
    if (!token || !ticketId) return
    await apiRequest(`/admin/support/${encodeURIComponent(ticketId)}`, {
      method: 'PATCH',
      token,
      body: patch,
    })
    await refreshSupportTickets()
    await refreshAudit()
  }

  async function refreshPartnerRequests() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/partner-requests', { token })
    setPartnerRequests(Array.isArray(data?.items) ? data.items : [])
  }

  async function refreshInfraState() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/infra/state', { token })
    setInfraState(data || null)
  }

  async function refreshNetworkInventory() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/network/inventory', { token })
    setNetworkInventory(data || null)
  }

  async function refreshCatalog() {
    const token = getToken()
    if (!token) return
    const [catalogData, couponData] = await Promise.all([
      apiRequest('/admin/catalog', { token }),
      apiRequest('/admin/coupons/report', { token }),
    ])
    setCatalog(catalogData || null)
    setCouponReport(couponData || null)
  }

  async function refreshServerAdminState() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/server-admin/state', { token })
    setServerAdminState(data || null)
  }

  async function refreshCmsState() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/cms/state', { token })
    setCmsState(data || null)
  }

  async function refreshSecurityState() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/security/state', { token })
    setSecurityState(data || null)
  }

  async function refreshIntegrationStatus() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/integrations/status', { token })
    setIntegrationStatus(data || null)
  }

  const refreshOpenSearchStatus = useCallback(async () => {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/integrations/opensearch/status', { token })
    setOpenSearchStatus(data || null)
  }, [])

  useEffect(() => {
    if (activeCategory !== 'platform') return
    refreshSupportTickets()
    refreshModerationQueues()
    refreshReportQueues()
    refreshMessagePolicyOps()
  }, [activeCategory, refreshSupportTickets, refreshModerationQueues, refreshReportQueues, refreshMessagePolicyOps])

  useEffect(() => {
    if (activeCategory !== 'server-admin') return
    if (!isOwner) return
    refreshOpenSearchStatus()
  }, [activeCategory, isOwner, refreshOpenSearchStatus])

  async function refreshSignups() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/signups', { token })
    setSignups(Array.isArray(data?.items) ? data.items : [])
  }

  async function refreshStrikeHistory() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/strikes', { token })
    setStrikeHistory(Array.isArray(data?.items) ? data.items : [])
  }

  async function refreshFraudReview() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/fraud/verification', { token })
    setFraudReview({
      items: Array.isArray(data?.items) ? data.items : [],
      duplicates: Array.isArray(data?.duplicates) ? data.duplicates : [],
    })
  }

  async function refreshOrgOwnership() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/orgs/ownership', { token })
    setOrgOwnership(data || { orgs: [], staff_list: [] })
  }

  async function refreshWalletLedger() {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/admin/wallet/ledger', { token })
    setWalletLedger(Array.isArray(data?.items) ? data.items : [])
  }

  async function downloadCsv(path, filename) {
    const token = getToken()
    if (!token) return
    const res = await fetch(`/api${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
    try {
      await apiRequest('/infra/actions', {
        method: 'POST',
        token,
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
    try {
      await apiRequest('/network/actions', {
        method: 'POST',
        token,
        body: { action, payload },
      })
      await refreshNetworkInventory()
      await refreshAudit()
    } catch (err) {
      setError(err.message || 'Failed to run network action')
    }
  }
}
