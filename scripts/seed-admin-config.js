import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const INVENTORY_DATA = [
  {
    id: "platform",
    label: "Core Platform & Business Control",
    icon_name: "ShieldCheck",
    sections: [
      {
        id: "users",
        title: "User & Account Oversight",
        features: [
          "Buyer / Factory / Buying House list",
          "Search + filter by role, status, region, verification, premium",
          "Role change, premium override, verify/unverify",
          "Suspend/reactivate, force logout, lock messaging",
          "Reset password, strike counts, fraud flags",
          "Signup list + email list export",
        ],
      },
      {
        id: "orgs",
        title: "Org & Ownership",
        features: [
          "Org ownership transfer",
          "Merge accounts / split orgs",
          "Org staff list + staff limits",
          "Buying house staff IDs",
          "Agent create/deactivate",
          "Permission matrix + org quotas",
        ],
      },
      {
        id: "verification",
        title: "Verification & Compliance",
        features: [
          "EU/USA doc review (Business registration, VAT/EIN, EORI, Bank proof)",
          "Approve / reject with reasons",
          "Badge lifecycle + audit trail",
          "Duplicate/fraud detection",
          "Expiring verification reminders",
          "Subscription-verification sync enforcement",
        ],
      },
      {
        id: "finance",
        title: "Financial Management",
        features: [
          "Subscription overview + renewal tracking",
          "Failed renewals list",
          "Upgrade/downgrade history",
          "Invoice log (future)",
          "Revenue summary + earnings per plan",
          "Payout ledger (future)",
        ],
      },
      {
        id: "wallet",
        title: "Wallet & Credits",
        features: [
          "Wallet balances (cash + restricted)",
          "Coupon redemptions ledger",
          "Transaction history",
          "Auto-credit toggle",
          "Manual credit/debit (future)",
          "Refund log (future)",
        ],
      },
      {
        id: "coupons",
        title: "Coupons & Campaigns",
        features: [
          "Create/disable/expire codes",
          "Marketing attribution + redemption caps",
          "Early adopter campaigns",
          "Per-role coupons",
          "Campaign performance report",
        ],
      },
      {
        id: "partners",
        title: "Partner Network",
        features: [
          "View all requests",
          "Force accept/reject/cancel",
          "Connected factory list",
          "Free-tier enforcement (5 limit)",
          "Manual overrides",
          "Blacklist/whitelist",
        ],
      },
      {
        id: "requests",
        title: "Requests & Matching",
        features: [
          "Buyer request moderation",
          "Verified-only flags",
          "Request lifecycle control",
          "Match quality audit",
          "Spam filters + expiry overrides",
        ],
      },
      {
        id: "contracts",
        title: "Contracts & Proofs",
        features: [
          "Contract vault",
          "Signature status",
          "Lock/unlock contracts",
          "Bank transfer / LC proof review",
          "Dispute review",
          "Full audit trail + export",
        ],
      },
      {
        id: "calls",
        title: "Calls & Recordings",
        features: [
          "Call logs + recording status",
          "Failure reasons",
          "Escalation notes",
          "Proof-of-call enforcement",
        ],
      },
      {
        id: "messages",
        title: "Messages & Moderation",
        features: [
          "Takedown tools",
          "Violation log",
          "Strike escalation",
          "Chat transfer audit",
          "Spam/irrelevant flags",
          "Content redaction",
        ],
      },
      {
        id: "media",
        title: "Content & Media Review",
        features: [
          "Product video review",
          "Document/media review",
          "Content flags + re-review",
          "Bulk approval",
        ],
      },
      {
        id: "support",
        title: "Reports & Support",
        features: [
          "Support tickets + user reports",
          "Resolution tracking",
          "Internal notes",
          "SLA targets (future)",
          "Priority escalation",
        ],
      },
      {
        id: "notifications",
        title: "Notifications & Broadcasts",
        features: [
          "System announcements",
          "Targeted alerts",
          "Monthly summary triggers",
          "Batch sends",
          "Template library",
        ],
      },
      {
        id: "analytics",
        title: "Analytics & KPIs",
        features: [
          "Platform metrics",
          "Buying house analytics",
          "Funnel stats (signup -> request -> match -> deal)",
          "Agent performance report",
          "Conversion trends + response speed",
        ],
      },
      {
        id: "search",
        title: "Search & Filters",
        features: [
          "Advanced filter gating",
          "Daily quota limits",
          "Search alert audit",
          "Abusive search detection",
        ],
      },
      {
        id: "ai",
        title: "AI & Knowledge Base",
        features: [
          "Assistant knowledge entries",
          "Chatbot toggles",
          "AI summary/negotiation logs",
          "AI response audit",
        ],
      },
      {
        id: "system",
        title: "System Settings",
        features: [
          "Feature flags",
          "Plan limits",
          "Pricing tables",
          "Policy text editor",
          "TOS/privacy publishing",
        ],
      },
      {
        id: "security",
        title: "Security & Audit",
        features: [
          "Admin action logs",
          "Access history + IP/device logs",
          "Data export",
          "Retention controls",
        ],
      },
      {
        id: "integrations",
        title: "Integrations",
        features: ["Payment gateways", "Webhooks", "API keys", "CRM export"],
      },
      {
        id: "traffic",
        title: "Domain + Traffic",
        features: ["Domain clicks", "Site visits", "Traffic source analytics"],
      },
      {
        id: "emails",
        title: "Email List",
        features: ["Full email export CSV", "Segmented email lists (future)"],
      },
    ],
  },
  {
    id: "infra",
    label: "Server / System / Infrastructure Management",
    icon_name: "Server",
    sections: [
      {
        id: "health",
        title: "System Health & Performance Monitoring (Real-Time)",
        features: [
          "CPU load, RAM usage, disk I/O, bandwidth",
          "Storage visualization (partitions, mount points)",
          "Running process list + kill/restart",
          "Service/daemon control (Nginx, MySQL, SSH, etc.)",
          "Zombie process detection",
        ],
      },
      {
        id: "maintenance",
        title: "OS & Software Maintenance",
        features: [
          "OS update/patch manager",
          "Package install/upgrade/remove (apt/yum)",
          "Centralized system logs (syslog/auth/error)",
          "Cron job scheduler + monitoring",
        ],
      },
      {
        id: "sys-security",
        title: "User & Security Administration (System-Level)",
        features: [
          "OS user accounts (create/delete/reset)",
          "Firewall rules (iptables/ufw/firewalld)",
          "Security audit log (who changed what)",
          "SSH key management + sudo privileges",
          "SSL certificate management (Let's Encrypt)",
        ],
      },
      {
        id: "backup",
        title: "Backup & Disaster Recovery",
        features: [
          "Automated backups (daily/weekly)",
          "Backup retention rules",
          "One-click restore",
        ],
      },
    ],
  },
  {
    id: "network",
    label: "Network Monitoring & Management",
    icon_name: "Network",
    sections: [
      {
        id: "monitoring",
        title: "Real-Time Monitoring",
        features: [
          "Interface health",
          "Packet loss",
          "Latency heatmap",
          "Topology map",
        ],
      },
      {
        id: "config",
        title: "Configuration",
        features: [
          "Device templates",
          "Change pushes",
          "Versioned config",
          "Rollback safety",
        ],
      },
    ],
  },
  {
    id: "server-admin",
    label: "Server Admin + App Management",
    icon_name: "Database",
    sections: [
      {
        id: "app",
        title: "Application",
        features: ["App restart", "Config reload", "Log viewing"],
      },
    ],
  },
  {
    id: "cms",
    label: "CMS + Content Management",
    icon_name: "Settings",
    sections: [
      {
        id: "content",
        title: "Content",
        features: ["Pages", "Blog posts", "Media library"],
      },
    ],
  },
  {
    id: "ultra-security",
    label: "Ultra Security Layer",
    icon_name: "Lock",
    sections: [
      {
        id: "zero-trust",
        title: "Zero-Trust Access",
        features: [
          "Zero-trust access controls",
          "Mandatory MFA for admin",
          "Session timeout + device fingerprinting",
        ],
      },
      {
        id: "audit",
        title: "Audit & Compliance",
        features: [
          "Tamper-proof audit logs",
          "Encryption key rotation",
          "Forensic logs + immutable backups",
        ],
      },
    ],
  },
  {
    id: "config",
    label: "Config Editor",
    icon_name: "Sliders",
    sections: [
      {
        id: "inventory",
        title: "Inventory",
        features: ["Manage modules", "Manage sections"],
      },
      {
        id: "actions",
        title: "Actions",
        features: ["Manage action groups", "Manage action fields"],
      },
      {
        id: "ui",
        title: "UI Settings",
        features: [
          "Manage chart palette",
          "Manage empty states",
          "Manage section metrics",
        ],
      },
    ],
  },
];

const ACTIONS_DATA = [
  {
    label: "Platform Actions",
    actions: [
      {
        id: "users.export_emails",
        label: "Export email list",
        category: "users",
        fields: [],
      },
      {
        id: "notification.broadcast",
        label: "Broadcast announcement",
        category: "notifications",
        fields: [
          { key: "title", label: "Title" },
          { key: "message", label: "Message" },
          { key: "roles", label: "Target roles (comma)" },
          { key: "premium_only", label: "Premium only (true/false)" },
          { key: "verified_only", label: "Verified only (true/false)" },
        ],
      },
      {
        id: "email.test_send",
        label: "Send test email",
        category: "email",
        fields: [{ key: "to", label: "Recipient email" }],
      },
      {
        id: "partner.force_accept",
        label: "Force accept partner request",
        category: "partners",
        fields: [{ key: "request_id", label: "Request ID" }],
      },
      {
        id: "partner.force_reject",
        label: "Force reject partner request",
        category: "partners",
        fields: [{ key: "request_id", label: "Request ID" }],
      },
      {
        id: "partner.force_cancel",
        label: "Force cancel partner request",
        category: "partners",
        fields: [{ key: "request_id", label: "Request ID" }],
      },
      {
        id: "partner.blacklist.add",
        label: "Add to partner blacklist",
        category: "partners",
        fields: [{ key: "entry_id", label: "User/Org ID" }],
      },
      {
        id: "partner.blacklist.remove",
        label: "Remove from blacklist",
        category: "partners",
        fields: [{ key: "entry_id", label: "User/Org ID" }],
      },
      {
        id: "partner.whitelist.add",
        label: "Add to partner whitelist",
        category: "partners",
        fields: [{ key: "entry_id", label: "User/Org ID" }],
      },
      {
        id: "partner.whitelist.remove",
        label: "Remove from whitelist",
        category: "partners",
        fields: [{ key: "entry_id", label: "User/Org ID" }],
      },
      {
        id: "request.status",
        label: "Update request status",
        category: "requests",
        fields: [
          { key: "requirement_id", label: "Request ID" },
          { key: "status", label: "Status" },
        ],
      },
      {
        id: "request.verified_only",
        label: "Toggle verified-only",
        category: "requests",
        fields: [
          { key: "requirement_id", label: "Request ID" },
          { key: "verified_only", label: "true/false" },
        ],
      },
      {
        id: "request.expiry_override",
        label: "Override request expiry",
        category: "requests",
        fields: [
          { key: "requirement_id", label: "Request ID" },
          { key: "expires_at", label: "Expires at (ISO)" },
        ],
      },
      {
        id: "request.spam.flag",
        label: "Flag request as spam",
        category: "requests",
        fields: [
          { key: "requirement_id", label: "Request ID" },
          { key: "reason", label: "Reason" },
        ],
      },
      {
        id: "request.spam.filter.add",
        label: "Add spam filter",
        category: "requests",
        fields: [
          { key: "pattern", label: "Pattern" },
          { key: "action", label: "Action" },
        ],
      },
      {
        id: "match.quality.update",
        label: "Update match quality",
        category: "requests",
        fields: [
          { key: "match_id", label: "Match ID" },
          { key: "score", label: "Score" },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "partner.connect",
        label: "Force connect partner",
        category: "partners",
        fields: [{ key: "request_id", label: "Request ID" }],
      },
      {
        id: "partner.override",
        label: "Record partner override",
        category: "partners",
        fields: [
          { key: "request_id", label: "Request ID" },
          { key: "override_action", label: "Action" },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "partner.free_tier_limit",
        label: "Set free-tier partner limit",
        category: "partners",
        fields: [{ key: "limit", label: "Limit" }],
      },
      {
        id: "featured.add",
        label: "Add featured listing",
        category: "content",
        fields: [
          { key: "entity_type", label: "product/request" },
          { key: "entity_id", label: "Entity ID" },
          { key: "label", label: "Label (optional)" },
        ],
      },
      {
        id: "featured.remove",
        label: "Remove featured listing",
        category: "content",
        fields: [
          { key: "listing_id", label: "Listing ID" },
          { key: "entity_id", label: "Entity ID (optional)" },
        ],
      },
    ],
  },
  {
    label: "Org & Agents",
    actions: [
      {
        id: "account.manager.assign",
        label: "Assign account manager",
        category: "orgs",
        fields: [
          { key: "user_id", label: "Org owner ID" },
          { key: "account_manager_id", label: "Manager user ID (optional)" },
          { key: "account_manager_name", label: "Manager name" },
          { key: "account_manager_email", label: "Manager email" },
          { key: "account_manager_phone", label: "Manager phone" },
        ],
      },
      {
        id: "org.transfer",
        label: "Transfer org ownership",
        category: "orgs",
        fields: [
          { key: "from_owner_id", label: "Current owner ID" },
          { key: "to_owner_id", label: "New owner ID" },
        ],
      },
      {
        id: "org.merge",
        label: "Merge orgs",
        category: "orgs",
        fields: [
          { key: "source_owner_id", label: "Source owner ID" },
          { key: "target_owner_id", label: "Target owner ID" },
          { key: "archive_source", label: "Archive source (true/false)" },
        ],
      },
      {
        id: "org.split",
        label: "Split org staff",
        category: "orgs",
        fields: [
          { key: "org_owner_id", label: "Current owner ID" },
          { key: "new_owner_id", label: "New owner ID" },
          { key: "member_ids", label: "Member IDs (comma)" },
        ],
      },
      {
        id: "org.quota",
        label: "Set org quota",
        category: "orgs",
        fields: [
          { key: "org_owner_id", label: "Org owner ID" },
          { key: "key", label: "Quota key" },
          { key: "value", label: "Value" },
        ],
      },
      {
        id: "org.staff_limit",
        label: "Set staff limit",
        category: "orgs",
        fields: [
          { key: "org_owner_id", label: "Org owner ID" },
          { key: "limit", label: "Staff limit" },
        ],
      },
      {
        id: "org.buying_house_staff.add",
        label: "Add buying house staff ID",
        category: "orgs",
        fields: [
          { key: "org_owner_id", label: "Org owner ID" },
          { key: "staff_id", label: "Staff ID" },
        ],
      },
      {
        id: "org.buying_house_staff.remove",
        label: "Remove buying house staff ID",
        category: "orgs",
        fields: [{ key: "staff_id", label: "Staff ID" }],
      },
      {
        id: "org.permission_matrix",
        label: "Update org permission matrix",
        category: "orgs",
        fields: [
          { key: "org_owner_id", label: "Org owner ID" },
          { key: "permission_matrix", label: "Permission matrix JSON" },
        ],
      },
      {
        id: "agent.create",
        label: "Create agent",
        category: "agents",
        fields: [
          { key: "org_owner_id", label: "Org owner ID" },
          { key: "name", label: "Name" },
          { key: "username", label: "Username" },
          { key: "member_id", label: "Agent ID" },
          { key: "email", label: "Email" },
          { key: "permissions", label: "Permissions (comma)" },
          { key: "password", label: "Temp password" },
        ],
      },
      {
        id: "agent.activate",
        label: "Activate agent",
        category: "agents",
        fields: [
          { key: "org_owner_id", label: "Org owner ID" },
          { key: "member_id", label: "Agent ID" },
        ],
      },
      {
        id: "agent.deactivate",
        label: "Deactivate agent",
        category: "agents",
        fields: [
          { key: "org_owner_id", label: "Org owner ID" },
          { key: "member_id", label: "Agent ID" },
        ],
      },
      {
        id: "agent.reset_password",
        label: "Reset agent password",
        category: "agents",
        fields: [
          { key: "org_owner_id", label: "Org owner ID" },
          { key: "member_id", label: "Agent ID" },
        ],
      },
      {
        id: "agent.permissions",
        label: "Update agent permissions",
        category: "agents",
        fields: [
          { key: "org_owner_id", label: "Org owner ID" },
          { key: "member_id", label: "Agent ID" },
          { key: "permissions", label: "Permissions (comma)" },
          { key: "permission_matrix_json", label: "Permission matrix JSON" },
        ],
      },
    ],
  },
  {
    label: "Verification & Finance",
    actions: [
      {
        id: "verification.approve",
        label: "Approve verification",
        category: "verification",
        fields: [{ key: "user_id", label: "User ID" }],
      },
      {
        id: "verification.reject",
        label: "Reject verification",
        category: "verification",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "reason", label: "Reason" },
        ],
      },
      {
        id: "verification.remind_expiring",
        label: "Remind expiring verifications",
        category: "verification",
        fields: [{ key: "threshold_days", label: "Threshold days" }],
      },
      {
        id: "verification.revoke_expired",
        label: "Revoke expired verifications",
        category: "verification",
        fields: [],
      },
      {
        id: "verification.badge.revoke",
        label: "Revoke badge",
        category: "verification",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "reason", label: "Reason" },
        ],
      },
      {
        id: "verification.doc.review",
        label: "Review verification doc",
        category: "verification",
        fields: [
          { key: "doc_id", label: "Doc ID" },
          { key: "status", label: "Status" },
          { key: "reason", label: "Reason" },
        ],
      },
      {
        id: "verification.fraud.flag",
        label: "Flag verification fraud",
        category: "verification",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "reason", label: "Reason" },
        ],
      },
      {
        id: "order.certification.approve",
        label: "Approve order certification",
        category: "verification",
        fields: [
          { key: "user_id", label: "User ID" },
          {
            key: "evidence_contract_ids",
            label: "Evidence contract IDs (comma)",
          },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "order.certification.revoke",
        label: "Revoke order certification",
        category: "verification",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "note", label: "Reason" },
        ],
      },
      {
        id: "order.certification.evidence",
        label: "Attach certification evidence",
        category: "verification",
        fields: [
          { key: "user_id", label: "User ID" },
          {
            key: "evidence_contract_ids",
            label: "Evidence contract IDs (comma)",
          },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "subscription.set_plan",
        label: "Set subscription plan",
        category: "finance",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "plan", label: "free/premium" },
          { key: "auto_renew", label: "Auto renew (true/false)" },
        ],
      },
      {
        id: "subscription.renew",
        label: "Renew premium",
        category: "finance",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "auto_renew", label: "Auto renew (true/false)" },
        ],
      },
      {
        id: "finance.invoice.add",
        label: "Add invoice",
        category: "finance",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "amount_usd", label: "Amount USD" },
          { key: "status", label: "Status" },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "finance.payout.add",
        label: "Add payout",
        category: "finance",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "amount_usd", label: "Amount USD" },
          { key: "status", label: "Status" },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "wallet.credit",
        label: "Wallet credit",
        category: "finance",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "amount_usd", label: "Amount (USD)" },
          { key: "reason", label: "Reason" },
          { key: "restricted", label: "Restricted (true/false)" },
        ],
      },
      {
        id: "wallet.debit",
        label: "Wallet debit",
        category: "finance",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "amount_usd", label: "Amount (USD)" },
          { key: "reason", label: "Reason" },
          { key: "allow_restricted", label: "Allow restricted (true/false)" },
        ],
      },
      {
        id: "wallet.refund",
        label: "Wallet refund",
        category: "finance",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "amount_usd", label: "Amount (USD)" },
          { key: "reason", label: "Reason" },
          { key: "ref", label: "Reference" },
        ],
      },
      {
        id: "wallet.auto_credit",
        label: "Toggle auto-credit",
        category: "finance",
        fields: [{ key: "enabled", label: "true/false" }],
      },
      {
        id: "coupon.create",
        label: "Create coupon",
        category: "coupons",
        fields: [
          { key: "code", label: "Coupon code" },
          { key: "amount_usd", label: "Amount (USD)" },
          { key: "expires_at", label: "Expires at (ISO)" },
          { key: "max_redemptions", label: "Max redemptions" },
          { key: "marketing_source", label: "Marketing source" },
          { key: "campaign", label: "Campaign tag" },
          { key: "role_restrictions", label: "Role restrictions (comma)" },
          { key: "verification_free_months", label: "Free months" },
          { key: "requires_card", label: "Requires card (true/false)" },
        ],
      },
      {
        id: "coupon.disable",
        label: "Disable coupon",
        category: "coupons",
        fields: [{ key: "code", label: "Coupon code or ID" }],
      },
      {
        id: "coupon.expire",
        label: "Expire coupon",
        category: "coupons",
        fields: [
          { key: "code", label: "Coupon code or ID" },
          { key: "expires_at", label: "Expires at (ISO)" },
        ],
      },
      {
        id: "coupon.redemption.add",
        label: "Add coupon redemption",
        category: "coupons",
        fields: [
          { key: "code_id", label: "Coupon ID" },
          { key: "user_id", label: "User ID" },
          { key: "amount_usd", label: "Amount USD" },
        ],
      },
      {
        id: "coupon.campaign.add",
        label: "Add coupon campaign",
        category: "coupons",
        fields: [
          { key: "name", label: "Campaign name" },
          { key: "type", label: "Type" },
          { key: "status", label: "Status" },
        ],
      },
      {
        id: "coupon.campaign.disable",
        label: "Disable coupon campaign",
        category: "coupons",
        fields: [{ key: "campaign_id", label: "Campaign ID" }],
      },
    ],
  },
  {
    label: "Contracts & Disputes",
    actions: [
      {
        id: "contract.lock",
        label: "Lock contract",
        category: "contracts",
        fields: [{ key: "contract_id", label: "Contract ID" }],
      },
      {
        id: "contract.unlock",
        label: "Unlock contract",
        category: "contracts",
        fields: [{ key: "contract_id", label: "Contract ID" }],
      },
      {
        id: "contract.archive",
        label: "Archive contract",
        category: "contracts",
        fields: [{ key: "contract_id", label: "Contract ID" }],
      },
      {
        id: "contract.signatures",
        label: "Update signatures",
        category: "contracts",
        fields: [
          { key: "contract_id", label: "Contract ID" },
          { key: "buyer_signature_state", label: "buyer: signed/pending" },
          { key: "factory_signature_state", label: "factory: signed/pending" },
          { key: "is_draft", label: "Draft (true/false)" },
        ],
      },
      {
        id: "contract.audit.note",
        label: "Add contract audit note",
        category: "contracts",
        fields: [
          { key: "contract_id", label: "Contract ID" },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "contract.audit.export",
        label: "Export contract audit",
        category: "contracts",
        fields: [
          { key: "contract_id", label: "Contract ID" },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "payment_proof.review",
        label: "Review payment proof",
        category: "contracts",
        fields: [
          { key: "proof_id", label: "Proof ID" },
          { key: "status", label: "Status" },
          { key: "review_reason", label: "Reason" },
        ],
      },
      {
        id: "dispute.open",
        label: "Open dispute",
        category: "disputes",
        fields: [
          { key: "contract_id", label: "Contract ID" },
          { key: "reason", label: "Reason" },
        ],
      },
      {
        id: "dispute.resolve",
        label: "Resolve dispute",
        category: "disputes",
        fields: [
          { key: "report_id", label: "Report ID" },
          { key: "resolution_action", label: "Action" },
          { key: "resolution_note", label: "Notes" },
        ],
      },
      {
        id: "call.recording",
        label: "Update call recording",
        category: "calls",
        fields: [
          { key: "call_id", label: "Call ID" },
          { key: "recording_status", label: "Status" },
          { key: "recording_url", label: "Recording URL" },
          { key: "failure_reason", label: "Failure reason" },
        ],
      },
      {
        id: "call.escalate",
        label: "Escalate call",
        category: "calls",
        fields: [
          { key: "call_id", label: "Call ID" },
          { key: "severity", label: "Severity" },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "call.proof.enforce",
        label: "Enforce proof-of-call",
        category: "calls",
        fields: [{ key: "call_id", label: "Call ID" }],
      },
    ],
  },
  {
    label: "Moderation & Support",
    actions: [
      {
        id: "message.takedown",
        label: "Takedown message",
        category: "moderation",
        fields: [
          { key: "message_id", label: "Message ID" },
          { key: "reason", label: "Reason" },
          { key: "apply_strike", label: "Apply strike (true/false)" },
        ],
      },
      {
        id: "message.redact",
        label: "Redact message",
        category: "moderation",
        fields: [
          { key: "message_id", label: "Message ID" },
          { key: "reason", label: "Reason" },
        ],
      },
      {
        id: "message.transfer.audit",
        label: "Log chat transfer",
        category: "moderation",
        fields: [
          { key: "thread_id", label: "Thread ID" },
          { key: "from", label: "From" },
          { key: "to", label: "To" },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "message.flag",
        label: "Flag message as spam",
        category: "moderation",
        fields: [
          { key: "message_id", label: "Message ID" },
          { key: "reason", label: "Reason" },
        ],
      },
      {
        id: "content.flag",
        label: "Flag content",
        category: "moderation",
        fields: [
          { key: "entity_type", label: "Entity type" },
          { key: "entity_id", label: "Entity ID" },
          { key: "reason", label: "Reason" },
        ],
      },
      {
        id: "content.bulk_approve",
        label: "Bulk approve content",
        category: "moderation",
        fields: [],
      },
      {
        id: "violation.strike",
        label: "Manual strike",
        category: "moderation",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "reason", label: "Reason" },
          { key: "kind", label: "Kind" },
        ],
      },
      {
        id: "support.ticket.create",
        label: "Create support ticket",
        category: "support",
        fields: [
          { key: "user_id", label: "User ID" },
          { key: "subject", label: "Subject" },
          { key: "priority", label: "Priority" },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "support.ticket.update",
        label: "Update support ticket",
        category: "support",
        fields: [
          { key: "ticket_id", label: "Ticket ID" },
          { key: "status", label: "Status" },
          { key: "priority", label: "Priority" },
          { key: "note", label: "Note" },
        ],
      },
      {
        id: "support.ticket.resolve",
        label: "Resolve support ticket",
        category: "support",
        fields: [{ key: "ticket_id", label: "Ticket ID" }],
      },
      {
        id: "support.ticket.escalate",
        label: "Escalate support ticket",
        category: "support",
        fields: [
          { key: "ticket_id", label: "Ticket ID" },
          { key: "note", label: "Note" },
        ],
      },
    ],
  },
  {
    label: "Broadcast & AI",
    actions: [
      {
        id: "ai.knowledge.create",
        label: "Create knowledge entry",
        category: "ai",
        fields: [
          { key: "org_id", label: "Org ID" },
          { key: "type", label: "faq/fact" },
          { key: "question", label: "Question" },
          { key: "answer", label: "Answer" },
          { key: "keywords", label: "Keywords (comma)" },
        ],
      },
      {
        id: "ai.knowledge.update",
        label: "Update knowledge entry",
        category: "ai",
        fields: [
          { key: "org_id", label: "Org ID" },
          { key: "entry_id", label: "Entry ID" },
          { key: "question", label: "Question" },
          { key: "answer", label: "Answer" },
          { key: "keywords", label: "Keywords (comma)" },
        ],
      },
      {
        id: "ai.knowledge.delete",
        label: "Delete knowledge entry",
        category: "ai",
        fields: [
          { key: "org_id", label: "Org ID" },
          { key: "entry_id", label: "Entry ID" },
        ],
      },
      {
        id: "ai.response.flag",
        label: "Flag AI response",
        category: "ai",
        fields: [
          { key: "response_id", label: "Response ID" },
          { key: "reason", label: "Reason" },
        ],
      },
      {
        id: "notification.template.create",
        label: "Create notification template",
        category: "notifications",
        fields: [
          { key: "name", label: "Name" },
          { key: "subject", label: "Subject" },
          { key: "body", label: "Body" },
          { key: "channel", label: "Channel" },
        ],
      },
      {
        id: "notification.template.update",
        label: "Update notification template",
        category: "notifications",
        fields: [
          { key: "template_id", label: "Template ID" },
          { key: "name", label: "Name" },
          { key: "subject", label: "Subject" },
          { key: "body", label: "Body" },
        ],
      },
      {
        id: "notification.batch.send",
        label: "Send batch notification",
        category: "notifications",
        fields: [
          { key: "template_id", label: "Template ID" },
          { key: "recipients", label: "Recipients" },
          { key: "scheduled_at", label: "Scheduled at" },
        ],
      },
      {
        id: "notification.monthly.trigger",
        label: "Add monthly summary trigger",
        category: "notifications",
        fields: [
          { key: "name", label: "Name" },
          { key: "schedule", label: "Cron schedule" },
          { key: "enabled", label: "true/false" },
        ],
      },
    ],
  },
  {
    label: "System Settings",
    actions: [
      {
        id: "system.feature_flag",
        label: "Toggle feature flag",
        category: "system",
        fields: [
          { key: "key", label: "Flag key" },
          { key: "value", label: "true/false" },
        ],
      },
      {
        id: "system.plan_limit",
        label: "Update plan limit",
        category: "system",
        fields: [
          { key: "plan", label: "free/premium" },
          { key: "key", label: "Limit key" },
          { key: "value", label: "Value" },
        ],
      },
      {
        id: "system.pricing",
        label: "Update pricing",
        category: "system",
        fields: [
          { key: "plan", label: "free/premium" },
          { key: "usd", label: "Price USD" },
        ],
      },
      {
        id: "system.policy",
        label: "Update policy text",
        category: "system",
        fields: [
          { key: "key", label: "tos/privacy" },
          { key: "value", label: "Policy text" },
        ],
      },
      {
        id: "system.retention",
        label: "Update retention",
        category: "system",
        fields: [
          { key: "audit_days", label: "Audit days" },
          { key: "logs_days", label: "Logs days" },
        ],
      },
      {
        id: "system.search_limits",
        label: "Update search limits",
        category: "system",
        fields: [
          { key: "advanced_filter_gate", label: "Gate advanced (true/false)" },
          { key: "abusive_search_threshold", label: "Abuse threshold" },
        ],
      },
      {
        id: "integrations.update",
        label: "Update integrations",
        category: "system",
        fields: [{ key: "integrations", label: "Integrations JSON" }],
      },
      {
        id: "integrations.crm.export",
        label: "Run CRM export",
        category: "system",
        fields: [{ key: "note", label: "Note" }],
      },
      {
        id: "traffic.record",
        label: "Record traffic event",
        category: "system",
        fields: [
          { key: "domain", label: "Domain" },
          { key: "clicks", label: "Clicks" },
          { key: "visits", label: "Visits" },
          { key: "spend", label: "Spend (USD)" },
        ],
      },
      {
        id: "email.segment.create",
        label: "Create email segment",
        category: "email",
        fields: [
          { key: "name", label: "Segment name" },
          { key: "filter", label: "Filter JSON" },
        ],
      },
      {
        id: "email.segment.update",
        label: "Update email segment",
        category: "email",
        fields: [
          { key: "segment_id", label: "Segment ID" },
          { key: "name", label: "Segment name" },
          { key: "filter", label: "Filter JSON" },
        ],
      },
      {
        id: "email.segment.delete",
        label: "Delete email segment",
        category: "email",
        fields: [{ key: "segment_id", label: "Segment ID" }],
      },
    ],
  },
  {
    label: "Infrastructure Actions",
    actions: [
      {
        id: "service.restart",
        label: "Restart service",
        category: "infra",
        fields: [{ key: "service", label: "Service name" }],
      },
      {
        id: "service.stop",
        label: "Stop service",
        category: "infra",
        fields: [{ key: "service", label: "Service name" }],
      },
      {
        id: "service.start",
        label: "Start service",
        category: "infra",
        fields: [{ key: "service", label: "Service name" }],
      },
      {
        id: "process.kill",
        label: "Kill process",
        category: "infra",
        fields: [{ key: "pid", label: "Process ID" }],
      },
      { id: "backup.run", label: "Run backup", category: "infra", fields: [] },
      {
        id: "backup.restore",
        label: "Restore backup",
        category: "infra",
        fields: [],
      },
      {
        id: "package.install",
        label: "Install package",
        category: "infra",
        fields: [{ key: "package", label: "Package name" }],
      },
      {
        id: "package.remove",
        label: "Remove package",
        category: "infra",
        fields: [{ key: "package", label: "Package name" }],
      },
      {
        id: "os.user.create",
        label: "Create OS user",
        category: "infra",
        fields: [
          { key: "username", label: "Username" },
          { key: "role", label: "Role" },
        ],
      },
      {
        id: "os.user.delete",
        label: "Delete OS user",
        category: "infra",
        fields: [{ key: "username", label: "Username" }],
      },
      {
        id: "os.user.sudo",
        label: "Toggle sudo privileges",
        category: "infra",
        fields: [
          { key: "username", label: "Username" },
          { key: "enabled", label: "true/false" },
        ],
      },
      {
        id: "os.user.reset",
        label: "Reset OS user password",
        category: "infra",
        fields: [{ key: "username", label: "Username" }],
      },
      {
        id: "ssl.cert.issue",
        label: "Issue SSL cert",
        category: "infra",
        fields: [{ key: "domain", label: "Domain" }],
      },
      {
        id: "ssl.cert.renew",
        label: "Renew SSL cert",
        category: "infra",
        fields: [{ key: "domain", label: "Domain" }],
      },
      {
        id: "ssl.cert.revoke",
        label: "Revoke SSL cert",
        category: "infra",
        fields: [{ key: "domain", label: "Domain" }],
      },
      {
        id: "log.collect",
        label: "Collect system logs",
        category: "infra",
        fields: [
          { key: "level", label: "Level" },
          { key: "message", label: "Message" },
        ],
      },
      {
        id: "system.timezone.set",
        label: "Set timezone",
        category: "infra",
        fields: [{ key: "timezone", label: "Timezone" }],
      },
      {
        id: "command.execute",
        label: "Execute command",
        category: "infra",
        fields: [{ key: "command", label: "Command" }],
      },
    ],
  },
  {
    label: "Network Actions",
    actions: [
      {
        id: "diagnostic.ping",
        label: "Ping target",
        category: "network",
        fields: [{ key: "target", label: "Host/IP" }],
      },
      {
        id: "diagnostic.traceroute",
        label: "Traceroute target",
        category: "network",
        fields: [{ key: "target", label: "Host/IP" }],
      },
      {
        id: "diagnostic.snmp",
        label: "SNMP walk",
        category: "network",
        fields: [{ key: "target", label: "Host/IP" }],
      },
      {
        id: "security.ids.scan",
        label: "IDS scan",
        category: "network",
        fields: [],
      },
      {
        id: "security.rogue_scan",
        label: "Rogue AP scan",
        category: "network",
        fields: [
          { key: "ssid", label: "SSID" },
          { key: "mac", label: "MAC" },
        ],
      },
      {
        id: "security.auth_server.add",
        label: "Add RADIUS/TACACS server",
        category: "network",
        fields: [
          { key: "type", label: "radius/tacacs" },
          { key: "host", label: "Host" },
        ],
      },
      {
        id: "security.firewall.policy.add",
        label: "Add firewall policy",
        category: "network",
        fields: [
          { key: "name", label: "Name" },
          { key: "action", label: "allow/deny" },
          { key: "source", label: "Source" },
          { key: "destination", label: "Destination" },
        ],
      },
      {
        id: "netflow.refresh",
        label: "Refresh NetFlow/sFlow",
        category: "network",
        fields: [],
      },
      {
        id: "config.deploy",
        label: "Bulk config deploy",
        category: "network",
        fields: [{ key: "name", label: "Job name" }],
      },
      {
        id: "config.restore",
        label: "Restore config",
        category: "network",
        fields: [{ key: "device_id", label: "Device ID" }],
      },
      {
        id: "device.discovery",
        label: "Auto device discovery",
        category: "network",
        fields: [
          { key: "device_id", label: "Device ID" },
          { key: "name", label: "Name" },
          { key: "ip", label: "IP" },
        ],
      },
      {
        id: "alert.integration.add",
        label: "Add alert integration",
        category: "network",
        fields: [
          { key: "type", label: "email/sms/slack" },
          { key: "target", label: "Target" },
        ],
      },
    ],
  },
  {
    label: "Server Admin Actions",
    actions: [
      {
        id: "webserver.update_config",
        label: "Update web server config",
        category: "server",
        fields: [
          { key: "type", label: "Type" },
          { key: "config", label: "Config" },
        ],
      },
      {
        id: "webserver.restart",
        label: "Restart web server",
        category: "server",
        fields: [],
      },
      {
        id: "php.set_version",
        label: "Set PHP version",
        category: "server",
        fields: [{ key: "version", label: "Version" }],
      },
      {
        id: "db.add",
        label: "Add database",
        category: "server",
        fields: [
          { key: "id", label: "DB ID" },
          { key: "type", label: "Type" },
          { key: "host", label: "Host" },
        ],
      },
      {
        id: "db.backup",
        label: "Backup database",
        category: "server",
        fields: [{ key: "db_id", label: "DB ID" }],
      },
      {
        id: "db.admin.open",
        label: "Open DB admin",
        category: "server",
        fields: [{ key: "db_id", label: "DB ID" }],
      },
      {
        id: "domain.add",
        label: "Add domain",
        category: "server",
        fields: [{ key: "domain", label: "Domain" }],
      },
      {
        id: "dns.record.add",
        label: "Add DNS record",
        category: "server",
        fields: [
          { key: "domain", label: "Domain" },
          { key: "type", label: "Type" },
          { key: "name", label: "Name" },
          { key: "value", label: "Value" },
        ],
      },
      {
        id: "app.install",
        label: "Install app",
        category: "server",
        fields: [
          { key: "name", label: "App name" },
          { key: "version", label: "Version" },
        ],
      },
      {
        id: "file.write",
        label: "Write file",
        category: "server",
        fields: [
          { key: "path", label: "Path" },
          { key: "content", label: "Content" },
        ],
      },
      {
        id: "rbac.role.create",
        label: "Create RBAC role",
        category: "server",
        fields: [
          { key: "name", label: "Role name" },
          { key: "permissions", label: "Permissions (comma)" },
        ],
      },
      {
        id: "rbac.role.assign",
        label: "Assign RBAC role",
        category: "server",
        fields: [
          { key: "role_id", label: "Role ID" },
          { key: "user_id", label: "User ID" },
        ],
      },
      {
        id: "queue.create",
        label: "Create task queue",
        category: "server",
        fields: [{ key: "name", label: "Queue name" }],
      },
      {
        id: "queue.enqueue",
        label: "Enqueue task",
        category: "server",
        fields: [{ key: "queue_id", label: "Queue ID" }],
      },
      {
        id: "automation.toggle_updates",
        label: "Toggle auto updates",
        category: "server",
        fields: [
          { key: "enabled", label: "true/false" },
          { key: "patch_window", label: "Patch window" },
        ],
      },
      {
        id: "security.ids.scan",
        label: "Run IDS scan",
        category: "server",
        fields: [],
      },
      {
        id: "backup.provider.update",
        label: "Update backup provider",
        category: "server",
        fields: [
          { key: "id", label: "Provider ID" },
          { key: "bucket", label: "Bucket" },
          { key: "enabled", label: "true/false" },
        ],
      },
      {
        id: "backup.restore",
        label: "Restore backup",
        category: "server",
        fields: [],
      },
    ],
  },
  {
    label: "CMS Actions",
    actions: [
      {
        id: "cms.article.create",
        label: "Create article",
        category: "cms",
        fields: [
          { key: "title", label: "Title" },
          { key: "status", label: "Status" },
          { key: "author", label: "Author" },
        ],
      },
      {
        id: "cms.page.create",
        label: "Create page",
        category: "cms",
        fields: [
          { key: "title", label: "Title" },
          { key: "slug", label: "Slug" },
          { key: "status", label: "Status" },
        ],
      },
      {
        id: "cms.media.upload",
        label: "Upload media",
        category: "cms",
        fields: [
          { key: "name", label: "Name" },
          { key: "type", label: "Type" },
          { key: "url", label: "URL" },
        ],
      },
      {
        id: "cms.version.rollback",
        label: "Rollback version",
        category: "cms",
        fields: [
          { key: "content_id", label: "Content ID" },
          { key: "version", label: "Version" },
        ],
      },
      {
        id: "cms.theme.switch",
        label: "Switch theme",
        category: "cms",
        fields: [{ key: "theme", label: "Theme" }],
      },
      {
        id: "cms.seo.update",
        label: "Update SEO",
        category: "cms",
        fields: [
          { key: "default_title", label: "Default title" },
          { key: "meta_description", label: "Meta description" },
          { key: "social_image", label: "Social image" },
        ],
      },
      {
        id: "cms.cache.clear",
        label: "Clear cache",
        category: "cms",
        fields: [],
      },
      {
        id: "cms.env.update",
        label: "Update env vars",
        category: "cms",
        fields: [{ key: "vars", label: "Vars JSON" }],
      },
      {
        id: "cms.deploy.run",
        label: "Run deployment",
        category: "cms",
        fields: [{ key: "branch", label: "Branch" }],
      },
      {
        id: "cms.backup.run",
        label: "Run backup",
        category: "cms",
        fields: [{ key: "provider", label: "Provider" }],
      },
      {
        id: "cms.cron.add",
        label: "Add cron script",
        category: "cms",
        fields: [
          { key: "schedule", label: "Schedule" },
          { key: "command", label: "Command" },
        ],
      },
    ],
  },
  {
    label: "Ultra Security Actions",
    actions: [
      {
        id: "security.zero_trust.toggle",
        label: "Toggle zero-trust",
        category: "security",
        fields: [{ key: "enabled", label: "true/false" }],
      },
      {
        id: "security.mfa.require",
        label: "Require MFA",
        category: "security",
        fields: [
          { key: "required", label: "true/false" },
          { key: "methods", label: "Methods (comma)" },
        ],
      },
      {
        id: "security.session.timeout",
        label: "Set session timeout",
        category: "security",
        fields: [{ key: "timeout_minutes", label: "Minutes" }],
      },
      {
        id: "security.device_fingerprint",
        label: "Toggle device fingerprinting",
        category: "security",
        fields: [{ key: "enabled", label: "true/false" }],
      },
      {
        id: "security.ip.allowlist",
        label: "Update IP allowlist",
        category: "security",
        fields: [{ key: "ip_whitelist", label: "IPs (comma)" }],
      },
      {
        id: "security.geo_fence",
        label: "Update geo-fence",
        category: "security",
        fields: [
          { key: "enabled", label: "true/false" },
          { key: "countries", label: "Countries (comma)" },
        ],
      },
      {
        id: "security.encryption.rotate",
        label: "Rotate encryption keys",
        category: "security",
        fields: [],
      },
      {
        id: "security.incident.create",
        label: "Create incident",
        category: "security",
        fields: [
          { key: "title", label: "Title" },
          { key: "severity", label: "Severity" },
        ],
      },
      {
        id: "security.incident.resolve",
        label: "Resolve incident",
        category: "security",
        fields: [{ key: "id", label: "Incident ID" }],
      },
      {
        id: "security.export.request",
        label: "Request data export",
        category: "security",
        fields: [{ key: "dataset", label: "Dataset" }],
      },
      {
        id: "security.export.approve",
        label: "Approve data export",
        category: "security",
        fields: [{ key: "id", label: "Request ID" }],
      },
      {
        id: "security.forensic.log",
        label: "Add forensic log",
        category: "security",
        fields: [{ key: "message", label: "Message" }],
      },
      {
        id: "security.immutable.snapshot",
        label: "Create immutable backup",
        category: "security",
        fields: [],
      },
    ],
  },
];

const CAPABILITIES_DATA = [
  {
    module_id: "infra",
    capability_id: "system_health",
    title: "System Health & Performance Monitoring",
    count: 5,
    icon_name: "Activity",
    subtitle: "Real-time signals, resource visibility, and operational pulse.",
  },
  {
    module_id: "infra",
    capability_id: "os_maintenance",
    title: "OS & Software Maintenance",
    count: 4,
    icon_name: "Server",
    subtitle: "Safe updates, package checks, and controlled maintenance flows.",
  },
  {
    module_id: "infra",
    capability_id: "user_security",
    title: "User & Security Administration",
    count: 5,
    icon_name: "UserCog",
    subtitle: "Accounts, SSH keys, access, and permission hygiene.",
  },
  {
    module_id: "infra",
    capability_id: "backup",
    title: "Backup & Disaster Recovery",
    count: 3,
    icon_name: "Database",
    subtitle: "Retention, recovery posture, and scheduled protection.",
  },
  {
    module_id: "infra",
    capability_id: "networking",
    title: "Networking & System Settings",
    count: 2,
    icon_name: "Wifi",
    subtitle: "Firewall, SSL, DNS, timezone, and NTP coordination.",
  },
  {
    module_id: "network",
    capability_id: "monitoring",
    title: "Real-Time Monitoring & Visibility",
    count: 4,
    icon_name: "Activity",
    subtitle: "Interface health, packet loss, latency heatmap.",
  },
  {
    module_id: "network",
    capability_id: "configuration",
    title: "Configuration & Management",
    count: 5,
    icon_name: "Settings",
    subtitle: "Device templates, change pushes, versioned config.",
  },
  {
    module_id: "network",
    capability_id: "security_mgmt",
    title: "Security Management",
    count: 5,
    icon_name: "Shield",
    subtitle: "IDS/IPS feeds, rogue AP detection, policy drift.",
  },
  {
    module_id: "network",
    capability_id: "traffic_analysis",
    title: "Traffic & Bandwidth Analysis",
    count: 3,
    icon_name: "BarChart",
    subtitle: "NetFlow insight, QoS review, bandwidth trends.",
  },
  {
    module_id: "ultra-security",
    capability_id: "zero_trust",
    title: "Zero-Trust Access Controls",
    count: 8,
    icon_name: "Lock",
    subtitle: "Mandatory MFA, session timeout, IP whitelisting.",
  },
  {
    module_id: "ultra-security",
    capability_id: "audit_logs",
    title: "Tamper-Proof Audit Logs",
    count: 4,
    icon_name: "FileText",
    subtitle: "Immutable logs, encryption key rotation.",
  },
];

const UI_CONFIG_DATA = {
  section_metrics: {
    users: [
      { label: "Total", path: "users.total" },
      { label: "Premium", path: "users.premium" },
      { label: "Suspended", path: "users.suspended" },
    ],
    orgs: [
      { label: "Orgs", path: "orgs.total" },
      { label: "Staff", path: "orgs.staff" },
      { label: "Agents", path: "orgs.agents" },
    ],
    verification: [
      { label: "Pending", path: "verification.pending" },
      { label: "Expiring", path: "verification.expiring" },
    ],
    finance: [
      { label: "Subscriptions", path: "finance.subscriptions" },
      { label: "Failed renewals", path: "finance.failed_renewals" },
      {
        label: "Revenue est.",
        path: "finance.revenue_estimate_usd",
        format: "currency",
      },
    ],
    wallet: [
      {
        label: "Balance",
        path: "wallet.total_balance_usd",
        format: "currency",
      },
      {
        label: "Restricted",
        path: "wallet.restricted_usd",
        format: "currency",
      },
      { label: "Redemptions", path: "wallet.redemptions" },
    ],
    coupons: [
      { label: "Total", path: "coupons.total" },
      { label: "Active", path: "coupons.active" },
      { label: "Redemptions", path: "coupons.redemptions" },
    ],
  },
  chart_palette: ["#38bdf8", "#60a5fa", "#0f172a"],
  empty_states: {
    "verification.pending.short": "No pending verifications.",
    "verification.pending": "No pending verifications in queue.",
    "disputes.none": "No active disputes.",
    "firewall.rules.none": "No rules yet.",
    "cron.jobs.none": "No cron jobs yet.",
  },
};

const MOCK_DATA = [
  {
    data_key: "cms_weekly_trend",
    data_type: "chart",
    payload: [
      { name: "Mon", value: 24 },
      { name: "Tue", value: 38 },
      { name: "Wed", value: 29 },
      { name: "Thu", value: 57 },
      { name: "Fri", value: 44 },
      { name: "Sat", value: 66 },
      { name: "Sun", value: 52 },
    ],
  },
  {
    data_key: "ultra_mini_chart_points",
    data_type: "sparkline",
    payload: [22, 28, 24, 34, 30, 46, 40, 54, 50, 66, 58, 72],
  },
  {
    data_key: "ultra_mini_chart_kpis",
    data_type: "kpi",
    payload: [
      { label: "Requests", value: "12.8k" },
      { label: "Integrity", value: "99.98%" },
      { label: "Latency", value: "148ms" },
    ],
  },
];

const ROLE_CONFIG_DATA = [
  {
    role_key: "buyer",
    label: "Buyer",
    is_admin_role: false,
    benefits: [
      "Access to factory network",
      "Request quotations",
      "Track orders",
    ],
  },
  {
    role_key: "factory",
    label: "Factory",
    is_admin_role: false,
    benefits: ["Receive RFQs", "Manage products", "Track shipments"],
  },
  {
    role_key: "buying_house",
    label: "Buying House",
    is_admin_role: false,
    benefits: [
      "Manage multiple buyers",
      "Commission tracking",
      "Supplier network",
    ],
  },
  {
    role_key: "owner",
    label: "Organization Owner",
    is_admin_role: true,
    benefits: ["Full org access", "Billing management", "Staff administration"],
  },
  {
    role_key: "admin",
    label: "Admin",
    is_admin_role: true,
    benefits: [
      "Platform administration",
      "User management",
      "Analytics access",
    ],
  },
  {
    role_key: "agent",
    label: "Agent",
    is_admin_role: false,
    benefits: [
      "Lead management",
      "Client communication",
      "Commission tracking",
    ],
  },
];

const GOVERNANCE_CONFIG_DATA = {
  initial_policy: null,
  initial_version: null,
  initial_simulation: null,
  initial_template: null,
  default_rules: { maxWarnings: 1 },
};

const BRANDING_DATA = {
  app_name: "GarTexHub",
  admin_title: "Admin Matrix",
  command_deck: "Command Deck",
};

const SECURITY_PURPOSES_DATA = {
  admin_security: "passkey",
};

async function seedAdminConfig() {
  console.log("[Seed] Starting admin dynamic config seed...");

  try {
    for (const mod of INVENTORY_DATA) {
      const savedModule = await prisma.adminModule.upsert({
        where: { module_id: mod.id },
        update: { label: mod.label, icon_name: mod.icon_name, active: true },
        create: {
          module_id: mod.id,
          label: mod.label,
          icon_name: mod.icon_name,
          active: true,
        },
      });

      for (let i = 0; i < mod.sections.length; i++) {
        const section = mod.sections[i];
        await prisma.adminSection.upsert({
          where: { section_id: section.id },
          update: {
            module_id: savedModule.id,
            title: section.title,
            features: section.features,
            sort_order: i,
            active: true,
          },
          create: {
            section_id: section.id,
            module_id: savedModule.id,
            title: section.title,
            features: section.features,
            sort_order: i,
            active: true,
          },
        });
      }
      console.log(`[Seed] Seeded module: ${mod.label}`);
    }

    for (const group of ACTIONS_DATA) {
      for (const action of group.actions) {
        await prisma.adminAction.upsert({
          where: { action_id: action.id },
          update: {
            label: action.label,
            category: action.category,
            group_label: group.label,
            fields: action.fields,
            active: true,
          },
          create: {
            action_id: action.id,
            label: action.label,
            category: action.category,
            group_label: group.label,
            fields: action.fields,
            active: true,
          },
        });
      }
    }
    console.log("[Seed] Seeded actions");

    for (const cap of CAPABILITIES_DATA) {
      await prisma.adminCapability.upsert({
        where: { capability_id: cap.capability_id },
        update: {
          module_id: cap.module_id,
          title: cap.title,
          count: cap.count,
          icon_name: cap.icon_name,
          subtitle: cap.subtitle,
          active: true,
        },
        create: {
          capability_id: cap.capability_id,
          module_id: cap.module_id,
          title: cap.title,
          count: cap.count,
          icon_name: cap.icon_name,
          subtitle: cap.subtitle,
          active: true,
        },
      });
    }
    console.log("[Seed] Seeded capabilities");

    await prisma.adminUiConfig.upsert({
      where: { id: "default" },
      update: UI_CONFIG_DATA,
      create: { id: "default", ...UI_CONFIG_DATA },
    });
    console.log("[Seed] Seeded UI config");

    for (const mock of MOCK_DATA) {
      await prisma.adminMockData.upsert({
        where: { data_key: mock.data_key },
        update: {
          data_type: mock.data_type,
          payload: mock.payload,
          active: true,
        },
        create: {
          data_key: mock.data_key,
          data_type: mock.data_type,
          payload: mock.payload,
          active: true,
        },
      });
    }
    console.log("[Seed] Seeded mock data");

    for (const role of ROLE_CONFIG_DATA) {
      await prisma.adminRoleConfig.upsert({
        where: { role_key: role.role_key },
        update: {
          label: role.label,
          is_admin_role: role.is_admin_role,
          benefits: role.benefits,
          active: true,
        },
        create: {
          role_key: role.role_key,
          label: role.label,
          is_admin_role: role.is_admin_role,
          benefits: role.benefits,
          active: true,
        },
      });
    }
    console.log("[Seed] Seeded role config");

    await prisma.governanceConfig.upsert({
      where: { id: "default" },
      update: GOVERNANCE_CONFIG_DATA,
      create: { id: "default", ...GOVERNANCE_CONFIG_DATA },
    });
    console.log("[Seed] Seeded governance config");

    for (const [key, value] of Object.entries(BRANDING_DATA)) {
      await prisma.adminBranding.upsert({
        where: { brand_key: key },
        update: { value, active: true },
        create: { brand_key: key, value, active: true },
      });
    }
    console.log("[Seed] Seeded branding");

    for (const [key, type] of Object.entries(SECURITY_PURPOSES_DATA)) {
      await prisma.adminSecurityPurpose.upsert({
        where: { purpose_key: key },
        update: { purpose_type: type, active: true },
        create: { purpose_key: key, purpose_type: type, active: true },
      });
    }
    console.log("[Seed] Seeded security purposes");

    console.log("[Seed] Admin dynamic config seeding complete!");
  } catch (error) {
    console.error("[Seed] Error seeding admin config:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminConfig()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
