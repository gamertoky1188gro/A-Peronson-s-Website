    1 | import { readJson } from '../utils/jsonStore.js'
    2 | import { readLocalJson } from '../utils/localStore.js'
    3 | import { getAdminConfig } from './adminConfigService.js'
    4 | import { getAdminAuthConfig } from './securityService.js'
    5 | import { readAuditLog } from '../utils/auditStore.js'
    6 | import { getDashboardAnalytics } from './analyticsService.js'
    7 | 
    8 | const ADMIN_INVENTORY = [
    9 |   {
   10 |     id: 'platform',
   11 |     label: 'Core Platform & Business Control',
   12 |     sections: [
   13 |       {
   14 |         id: 'users',
   15 |         title: 'User & Account Oversight',
   16 |         features: [
   17 |           'Buyer / Factory / Buying House list',
   18 |           'Search + filter by role, status, region, verification, premium',
   19 |           'Role change, premium override, verify/unverify',
   20 |           'Suspend/reactivate, force logout, lock messaging',
   21 |           'Reset password, strike counts, fraud flags',
   22 |           'Signup list + email list export',
   23 |         ],
   24 |       },
   25 |       {
   26 |         id: 'orgs',
   27 |         title: 'Org & Ownership',
   28 |         features: [
   29 |           'Org ownership transfer',
   30 |           'Merge accounts / split orgs',
   31 |           'Org staff list + staff limits',
   32 |           'Buying house staff IDs',
   33 |           'Agent create/deactivate',
   34 |           'Permission matrix + org quotas',
   35 |         ],
   36 |       },
   37 |       {
   38 |         id: 'verification',
   39 |         title: 'Verification & Compliance',
   40 |         features: [
   41 |           'EU/USA doc review (Business registration, VAT/EIN, EORI, Bank proof)',
   42 |           'Approve / reject with reasons',
   43 |           'Badge lifecycle + audit trail',
   44 |           'Duplicate/fraud detection',
   45 |           'Expiring verification reminders',
   46 |           'Subscription-verification sync enforcement',
   47 |         ],
   48 |       },
   49 |       {
   50 |         id: 'finance',
   51 |         title: 'Financial Management',
   52 |         features: [
   53 |           'Subscription overview + renewal tracking',
   54 |           'Failed renewals list',
   55 |           'Upgrade/downgrade history',
   56 |           'Invoice log (future)',
   57 |           'Revenue summary + earnings per plan',
   58 |           'Payout ledger (future)',
   59 |         ],
   60 |       },
   61 |       {
   62 |         id: 'wallet',
   63 |         title: 'Wallet & Credits',
   64 |         features: [
   65 |           'Wallet balances (cash + restricted)',
   66 |           'Coupon redemptions ledger',
   67 |           'Transaction history',
   68 |           'Auto-credit toggle',
   69 |           'Manual credit/debit (future)',
   70 |           'Refund log (future)',
   71 |         ],
   72 |       },
   73 |       {
   74 |         id: 'coupons',
   75 |         title: 'Coupons & Campaigns',
   76 |         features: [
   77 |           'Create/disable/expire codes',
   78 |           'Marketing attribution + redemption caps',
   79 |           'Early adopter campaigns',
   80 |           'Per-role coupons',
   81 |           'Campaign performance report',
   82 |         ],
   83 |       },
   84 |       {
   85 |         id: 'partners',
   86 |         title: 'Partner Network',
   87 |         features: [
   88 |           'View all requests',
   89 |           'Force accept/reject/cancel',
   90 |           'Connected factory list',
   91 |           'Free-tier enforcement (5 limit)',
   92 |           'Manual overrides',
   93 |           'Blacklist/whitelist',
   94 |         ],
   95 |       },
   96 |       {
   97 |         id: 'requests',
   98 |         title: 'Requests & Matching',
   99 |         features: [
  100 |           'Buyer request moderation',
  101 |           'Verified-only flags',
  102 |           'Request lifecycle control',
  103 |           'Match quality audit',
  104 |           'Spam filters + expiry overrides',
  105 |         ],
  106 |       },
  107 |       {
  108 |         id: 'contracts',
  109 |         title: 'Contracts & Proofs',
  110 |         features: [
  111 |           'Contract vault',
  112 |           'Signature status',
  113 |           'Lock/unlock contracts',
  114 |           'Bank transfer / LC proof review',
  115 |           'Dispute review',
  116 |           'Full audit trail + export',
  117 |         ],
  118 |       },
  119 |       {
  120 |         id: 'calls',
  121 |         title: 'Calls & Recordings',
  122 |         features: [
  123 |           'Call logs + recording status',
  124 |           'Failure reasons',
  125 |           'Escalation notes',
  126 |           'Proof-of-call enforcement',
  127 |         ],
  128 |       },
  129 |       {
  130 |         id: 'messages',
  131 |         title: 'Messages & Moderation',
  132 |         features: [
  133 |           'Takedown tools',
  134 |           'Violation log',
  135 |           'Strike escalation',
  136 |           'Chat transfer audit',
  137 |           'Spam/irrelevant flags',
  138 |           'Content redaction',
  139 |         ],
  140 |       },
  141 |       {
  142 |         id: 'media',
  143 |         title: 'Content & Media Review',
  144 |         features: [
  145 |           'Product video review',
  146 |           'Document/media review',
  147 |           'Content flags + re-review',
  148 |           'Bulk approval',
  149 |         ],
  150 |       },
  151 |       {
  152 |         id: 'support',
  153 |         title: 'Reports & Support',
  154 |         features: [
  155 |           'Support tickets + user reports',
  156 |           'Resolution tracking',
  157 |           'Internal notes',
  158 |           'SLA targets (future)',
  159 |           'Priority escalation',
  160 |         ],
  161 |       },
  162 |       {
  163 |         id: 'notifications',
  164 |         title: 'Notifications & Broadcasts',
  165 |         features: [
  166 |           'System announcements',
  167 |           'Targeted alerts',
  168 |           'Monthly summary triggers',
  169 |           'Batch sends',
  170 |           'Template library',
  171 |         ],
  172 |       },
  173 |       {
  174 |         id: 'analytics',
  175 |         title: 'Analytics & KPIs',
  176 |         features: [
  177 |           'Platform metrics',
  178 |           'Buying house analytics',
  179 |           'Funnel stats (signup -> request -> match -> deal)',
  180 |           'Agent performance report',
  181 |           'Conversion trends + response speed',
  182 |         ],
  183 |       },
  184 |       {
  185 |         id: 'search',
  186 |         title: 'Search & Filters',
  187 |         features: [
  188 |           'Advanced filter gating',
  189 |           'Daily quota limits',
  190 |           'Search alert audit',
  191 |           'Abusive search detection',
  192 |         ],
  193 |       },
  194 |       {
  195 |         id: 'ai',
  196 |         title: 'AI & Knowledge Base',
  197 |         features: [
  198 |           'Assistant knowledge entries',
  199 |           'Chatbot toggles',
  200 |           'AI summary/negotiation logs',
  201 |           'AI response audit',
  202 |         ],
  203 |       },
  204 |       {
  205 |         id: 'system',
  206 |         title: 'System Settings',
  207 |         features: [
  208 |           'Feature flags',
  209 |           'Plan limits',
  210 |           'Pricing tables',
  211 |           'Policy text editor',
  212 |           'TOS/privacy publishing',
  213 |         ],
  214 |       },
  215 |       {
  216 |         id: 'security',
  217 |         title: 'Security & Audit',
  218 |         features: [
  219 |           'Admin action logs',
  220 |           'Access history + IP/device logs',
  221 |           'Data export',
  222 |           'Retention controls',
  223 |         ],
  224 |       },
  225 |       {
  226 |         id: 'integrations',
  227 |         title: 'Integrations',
  228 |         features: [
  229 |           'Payment gateways',
  230 |           'Webhooks',
  231 |           'API keys',
  232 |           'CRM export',
  233 |         ],
  234 |       },
  235 |       {
  236 |         id: 'traffic',
  237 |         title: 'Domain + Traffic',
  238 |         features: [
  239 |           'Domain clicks',
  240 |           'Site visits',
  241 |           'Traffic source analytics',
  242 |         ],
  243 |       },
  244 |       {
  245 |         id: 'emails',
  246 |         title: 'Email List',
  247 |         features: [
  248 |           'Full email export CSV',
  249 |           'Segmented email lists (future)',
  250 |         ],
  251 |       },
  252 |     ],
  253 |   },
  254 |   {
  255 |     id: 'infra',
  256 |     label: 'Server / System / Infrastructure Management',
  257 |     sections: [
  258 |       {
  259 |         id: 'health',
  260 |         title: 'System Health & Performance Monitoring (Real-Time)',
  261 |         features: [
  262 |           'CPU load, RAM usage, disk I/O, bandwidth',
  263 |           'Storage visualization (partitions, mount points)',
  264 |           'Running process list + kill/restart',
  265 |           'Service/daemon control (Nginx, MySQL, SSH, etc.)',
  266 |           'Zombie process detection',
  267 |         ],
  268 |       },
  269 |       {
  270 |         id: 'maintenance',
  271 |         title: 'OS & Software Maintenance',
  272 |         features: [
  273 |           'OS update/patch manager',
  274 |           'Package install/upgrade/remove (apt/yum)',
  275 |           'Centralized system logs (syslog/auth/error)',
  276 |           'Cron job scheduler + monitoring',
  277 |         ],
  278 |       },
  279 |       {
  280 |         id: 'sys-security',
  281 |         title: 'User & Security Administration (System-Level)',
  282 |         features: [
  283 |           'OS user accounts (create/delete/reset)',
  284 |           'Firewall rules (iptables/ufw/firewalld)',
  285 |           'Security audit log (who changed what)',
  286 |           'SSH key management + sudo privileges',
  287 |           "SSL certificate management (Let's Encrypt)",
  288 |         ],
  289 |       },
  290 |       {
  291 |         id: 'backup',
  292 |         title: 'Backup & Disaster Recovery',
  293 |         features: [
  294 |           'Automated backups (daily/weekly)',
  295 |           'Backup retention rules',
  296 |           'One-click restore',
  297 |         ],
  298 |       },
  299 |       {
  300 |         id: 'networking',
  301 |         title: 'Networking & System Settings',
  302 |         features: [
  303 |           'Interface/IP/VLAN/DNS management',
  304 |           'System time/timezone (NTP)',
  305 |         ],
  306 |       },
  307 |     ],
  308 |   },
  309 |   {
  310 |     id: 'network',
  311 |     label: 'Network Monitoring & Management (Enterprise Level)',
  312 |     sections: [
  313 |       {
  314 |         id: 'visibility',
  315 |         title: 'Real-Time Monitoring & Visibility',
  316 |         features: [
  317 |           'Network dashboard + alerts',
  318 |           'Topology map (routers/switches/APs)',
  319 |           'Device up/down status',
  320 |           'Bandwidth, latency, jitter, packet loss',
  321 |         ],
  322 |       },
  323 |       {
  324 |         id: 'config',
  325 |         title: 'Configuration & Management',
  326 |         features: [
  327 |           'Config backup/restore',
  328 |           'Bulk config deploy',
  329 |           'Firmware/patch management',
  330 |           'VLAN management',
  331 |           'IPAM + DHCP control',
  332 |         ],
  333 |       },
  334 |       {
  335 |         id: 'net-security',
  336 |         title: 'Security Management',
  337 |         features: [
  338 |           'Firewall policy manager',
  339 |           'IDS/IPS monitoring',
  340 |           'RADIUS/TACACS+ access control',
  341 |           'Rogue AP detection',
  342 |           'VPN configuration',
  343 |         ],
  344 |       },
  345 |       {
  346 |         id: 'traffic',
  347 |         title: 'Traffic & Bandwidth Analysis',
  348 |         features: [
  349 |           'NetFlow/sFlow analyzer',
  350 |           'QoS policies',
  351 |           'Traffic shaping',
  352 |         ],
  353 |       },
  354 |       {
  355 |         id: 'alerting',
  356 |         title: 'Troubleshooting & Alerting',
  357 |         features: [
  358 |           'Alert center (email/SMS/Slack)',
  359 |           'Audit log of config changes',
  360 |           'Diagnostic tools (Ping/Traceroute/SNMP)',
  361 |         ],
  362 |       },
  363 |       {
  364 |         id: 'assets',
  365 |         title: 'Asset & User Management',
  366 |         features: [
  367 |           'Inventory of devices + versions + locations',
  368 |           'Auto device discovery',
  369 |           'Client monitoring (IP/MAC/connected users)',
  370 |         ],
  371 |       },
  372 |     ],
  373 |   },
  374 |   {
  375 |     id: 'server-admin',
  376 |     label: 'Server Admin + App Management (Full Stack)',
  377 |     sections: [
  378 |       {
  379 |         id: 'srv-monitor',
  380 |         title: 'Real-Time Monitoring & Analytics',
  381 |         features: [
  382 |           'Resource dashboards',
  383 |           'Service monitoring (Apache/Nginx/MySQL/PHP)',
  384 |           'Log + alert center',
  385 |           'Process tracking',
  386 |         ],
  387 |       },
  388 |       {
  389 |         id: 'srv-security',
  390 |         title: 'Security Management',
  391 |         features: [
  392 |           'Firewall GUI',
  393 |           'SSL/TLS manager',
  394 |           'IDS (Fail2ban/malware scan)',
  395 |           'RBAC + MFA + SSH key control',
  396 |         ],
  397 |       },
  398 |       {
  399 |         id: 'srv-config',
  400 |         title: 'Server Config & Optimization',
  401 |         features: [
  402 |           'Web server config editor',
  403 |           'PHP version manager',
  404 |           'Database admin (phpMyAdmin)',
  405 |           'Cron job UI',
  406 |         ],
  407 |       },
  408 |       {
  409 |         id: 'srv-backup',
  410 |         title: 'Backup & Data Protection',
  411 |         features: [
  412 |           'Automated backups',
  413 |           'Cloud storage (S3/GCS/Spaces)',
  414 |           'One-click restore',
  415 |         ],
  416 |       },
  417 |       {
  418 |         id: 'srv-apps',
  419 |         title: 'Website/App Management',
  420 |         features: [
  421 |           'Domain & DNS management',
  422 |           'One-click app installers',
  423 |           'File manager + editor',
  424 |         ],
  425 |       },
  426 |       {
  427 |         id: 'srv-users',
  428 |         title: 'User Account Management (System Admin)',
  429 |         features: [
  430 |           'RBAC roles (Admin/Manager/Viewer)',
  431 |           'Audit logs',
  432 |         ],
  433 |       },
  434 |       {
  435 |         id: 'srv-auto',
  436 |         title: 'Automation',
  437 |         features: [
  438 |           'Auto updates + patches',
  439 |           'Task queues',
  440 |         ],
  441 |       },
  442 |     ],
  443 |   },
  444 |   {
  445 |     id: 'cms',
  446 |     label: 'CMS + Content Management',
  447 |     sections: [
  448 |       {
  449 |         id: 'cms-headless',
  450 |         title: 'Headless CMS Integration',
  451 |         features: [
  452 |           'Article/page editor',
  453 |           'Media uploads + gallery',
  454 |           'Version control + rollback',
  455 |         ],
  456 |       },
  457 |       {
  458 |         id: 'cms-frontend',
  459 |         title: 'Frontend Configuration',
  460 |         features: [
  461 |           'Theme switcher',
  462 |           'SEO/meta tags',
  463 |           'Cache clearing',
  464 |           'Environment variable manager',
  465 |         ],
  466 |       },
  467 |       {
  468 |         id: 'cms-deploy',
  469 |         title: 'Deployment & Automation',
  470 |         features: [
  471 |           'One-click deployments',
  472 |           'Backup/restore automation',
  473 |           'Cron scripts',
  474 |         ],
  475 |       },
  476 |     ],
  477 |   },
  478 |   {
  479 |     id: 'ultra-security',
  480 |     label: 'Ultra Security Layer (Advanced)',
  481 |     sections: [
  482 |       {
  483 |         id: 'zero-trust',
  484 |         title: 'Zero-Trust & Incident Response',
  485 |         features: [
  486 |           'Zero-trust access controls',
  487 |           'Mandatory MFA for admin',
  488 |           'Session timeout + device fingerprinting',
  489 |           'IP whitelisting + geo-fencing',
  490 |           'Tamper-proof audit logs',
  491 |           'Encryption key rotation',
  492 |           'Incident response dashboard',
  493 |           'Data-export approvals with dual confirmation',
  494 |           'Forensic logs + immutable backups',
  495 |         ],
  496 |       },
  497 |     ],
  498 |   },
  499 | ]
  500 | 
  501 | function countBy(items = [], key = 'role') {
  502 |   return items.reduce((acc, item) => {
  503 |     const value = String(item?.[key] || 'unknown')
  504 |     acc[value] = (acc[value] || 0) + 1
  505 |     return acc
  506 |   }, {})
  507 | }
  508 | 
  509 | function isPendingVerification(row) {
  510 |   const status = String(row?.review_status || row?.verification_status || '').toLowerCase()
  511 |   return status.includes('pending')
  512 | }
  513 | 
  514 | export async function getAdminMasterSummary(user) {
  515 |     const [
  516 |       users,
  517 |       verifications,
  518 |       subscriptions,
  519 |       walletHistory,
  520 |       couponCodes,
  521 |       couponRedemptions,
  522 |       partnerRequests,
  523 |       requirements,
  524 |       matches,
  525 |       documents,
  526 |       paymentProofs,
  527 |       callSessions,
  528 |       messages,
  529 |       violations,
  530 |       notifications,
  531 |       searchAlerts,
  532 |       searchUsage,
  533 |     assistantKnowledge,
  534 |     products,
  535 |     analytics,
  536 |     subscriptionHistory,
  537 |     refundLog,
  538 |     supportTickets,
  539 |   ] = await Promise.all([
  540 |     readJson('users.json'),
  541 |     readJson('verification.json'),
  542 |     readJson('subscriptions.json'),
  543 |     readJson('wallet_history.json'),
  544 |     readJson('coupon_codes.json'),
  545 |     readJson('coupon_redemptions.json'),
  546 |     readJson('partner_requests.json'),
  547 |     readJson('requirements.json'),
  548 |     readJson('matches.json'),
  549 |     readJson('documents.json'),
  550 |     readJson('payment_proofs.json'),
  551 |       readJson('call_sessions.json'),
  552 |       readJson('messages.json'),
  553 |       readJson('violations.json'),
  554 |       readJson('notifications.json'),
  555 |       readJson('search_alerts.json'),
  556 |       readJson('search_usage_counters.json'),
  557 |     readJson('assistant_knowledge.json'),
  558 |     readJson('company_products.json'),
  559 |     readJson('analytics.json'),
  560 |     readLocalJson('subscription_history.json', []),
  561 |     readLocalJson('refund_log.json', []),
  562 |     readJson('support_tickets.json'),
  563 |   ])
  564 | 
  565 |   const userRows = Array.isArray(users) ? users : []
  566 |   const verificationRows = Array.isArray(verifications) ? verifications : []
  567 |   const subscriptionRows = Array.isArray(subscriptions) ? subscriptions : []
  568 |   const walletRows = Array.isArray(walletHistory) ? walletHistory : []
  569 |   const couponRows = Array.isArray(couponCodes) ? couponCodes : []
  570 |   const couponRedemptionsRows = Array.isArray(couponRedemptions) ? couponRedemptions : []
  571 |   const partnerRows = Array.isArray(partnerRequests) ? partnerRequests : []
  572 |   const requirementRows = Array.isArray(requirements) ? requirements : []
  573 |   const matchRows = Array.isArray(matches) ? matches : []
  574 |   const documentRows = Array.isArray(documents) ? documents : []
  575 |   const paymentProofRows = Array.isArray(paymentProofs) ? paymentProofs : []
  576 |   const callRows = Array.isArray(callSessions) ? callSessions : []
  577 |   const messageRows = Array.isArray(messages) ? messages : []
  578 |   const violationRows = Array.isArray(violations) ? violations : []
  579 |   const notificationRows = Array.isArray(notifications) ? notifications : []
  580 |   const searchAlertRows = Array.isArray(searchAlerts) ? searchAlerts : []
  581 |   const searchUsageRows = Array.isArray(searchUsage) ? searchUsage : []
  582 |   const knowledgeRows = Array.isArray(assistantKnowledge) ? assistantKnowledge : []
  583 |   const productRows = Array.isArray(products) ? products : []
  584 |   const historyRows = Array.isArray(subscriptionHistory) ? subscriptionHistory : []
  585 |   const refundRows = Array.isArray(refundLog) ? refundLog : []
  586 |   const supportTicketRows = Array.isArray(supportTickets) ? supportTickets : []
  587 | 
  588 |   const roleCounts = countBy(userRows, 'role')
  589 |   const premiumUsers = userRows.filter((u) => String(u.subscription_status || '').toLowerCase() === 'premium').length
  590 |   const suspendedUsers = userRows.filter((u) => String(u.status || '').toLowerCase() === 'suspended').length
  591 |   const pendingVerifications = verificationRows.filter(isPendingVerification).length
  592 |   const expiringVerifications = verificationRows.filter((v) => Boolean(v.expiring_soon)).length
  593 |   const activeSubscriptions = subscriptionRows.filter((s) => {
  594 |     const end = new Date(s.end_date || 0).getTime()
  595 |     return Number.isFinite(end) && end >= Date.now()
  596 |   }).length
  597 |   const failedRenewals = subscriptionRows.filter((s) => {
  598 |     const end = new Date(s.end_date || 0).getTime()
  599 |     return Number.isFinite(end) && end < Date.now() && Boolean(s.auto_renew)
  600 |   }).length
  601 | 
  602 |   const contractDocs = documentRows.filter((d) => String(d.entity_type || '').toLowerCase().includes('contract') || Boolean(d.contract_number))
  603 |   const pendingSignatures = contractDocs.filter((d) => String(d.buyer_signature_state || '').toLowerCase() !== 'signed' || String(d.factory_signature_state || '').toLowerCase() !== 'signed').length
  604 | 
  605 |   const walletBalance = userRows.reduce((sum, u) => sum + Number(u.wallet_balance_usd || 0), 0)
  606 |   const walletRestricted = userRows.reduce((sum, u) => sum + Number(u.wallet_restricted_usd || 0), 0)
  607 |   const totalCreditsIssued = walletRows.reduce((sum, w) => sum + Number(w.amount_usd || 0), 0)
  608 | 
  609 |   const config = await getAdminConfig()
  610 |   const abuseThreshold = Number(config?.search_limits?.abusive_search_threshold || 100)
  611 |   const searchAbuse = searchUsageRows.filter((row) => Number(row.count || 0) >= abuseThreshold).length
  612 |   const auditLog = await readAuditLog()
  613 | 
  614 |   let dashboard = null
  615 |   try {
  616 |     dashboard = await getDashboardAnalytics(user)
  617 |   } catch {
  618 |     dashboard = null
  619 |   }
  620 | 
  621 |   const clicks = dashboard?.interaction_summary?.total_clicks || 0
  622 |   const visits = dashboard?.interaction_summary?.total_page_views || 0
  623 | 
  624 |     const adminAuth = await getAdminAuthConfig()
  625 |     return {
  626 |       generated_at: new Date().toISOString(),
  627 |       security_context: {
  628 |         mfa_required: Boolean(String(adminAuth.mfa_code || '').trim()),
  629 |         ip_allowlist: Array.isArray(adminAuth.ip_allowlist) ? adminAuth.ip_allowlist : [],
  630 |         device_allowlist: Array.isArray(adminAuth.device_allowlist) ? adminAuth.device_allowlist : [],
  631 |         step_up_required: Boolean(String(process.env.ADMIN_STEPUP_CODE || '').trim()),
  632 |         export_dual_confirm: Boolean(String(process.env.ADMIN_EXPORT_CODE_PRIMARY || '').trim()) || Boolean(String(process.env.ADMIN_EXPORT_CODE_SECONDARY || '').trim()),
  633 |         exec_enabled: ['true', '1', 'yes'].includes(String(process.env.ADMIN_EXEC_ENABLED || '').toLowerCase()),
  634 |       },
  635 |     summary: {
  636 |       users: {
  637 |         total: userRows.length,
  638 |         premium: premiumUsers,
  639 |         suspended: suspendedUsers,
  640 |         role_counts: roleCounts,
  641 |       },
  642 |       orgs: {
  643 |         total: userRows.filter((u) => ['buyer', 'factory', 'buying_house'].includes(String(u.role || '').toLowerCase())).length,
  644 |         staff: userRows.filter((u) => Boolean(u.org_owner_id)).length,
  645 |         agents: userRows.filter((u) => String(u.role || '').toLowerCase() === 'agent').length,
  646 |       },
  647 |       verification: {
  648 |         total: verificationRows.length,
  649 |         pending: pendingVerifications,
  650 |         expiring: expiringVerifications,
  651 |       },
  652 |       finance: {
  653 |         subscriptions: subscriptionRows.length,
  654 |         active_subscriptions: activeSubscriptions,
  655 |         failed_renewals: failedRenewals,
  656 |         revenue_estimate_usd: premiumUsers * Number(config.pricing?.premium_usd || 0),
  657 |         upgrade_events: historyRows.filter((row) => row.action === 'upgrade').length,
  658 |         downgrade_events: historyRows.filter((row) => row.action === 'downgrade').length,
  659 |       },
  660 |       wallet: {
  661 |         total_balance_usd: Math.round(walletBalance * 100) / 100,
  662 |         restricted_usd: Math.round(walletRestricted * 100) / 100,
  663 |         credits_issued_usd: Math.round(totalCreditsIssued * 100) / 100,
  664 |         redemptions: couponRedemptionsRows.length,
  665 |         refunds: refundRows.length,
  666 |       },
  667 |       coupons: {
  668 |         total: couponRows.length,
  669 |         active: couponRows.filter((c) => Boolean(c.active)).length,
  670 |         redemptions: couponRedemptionsRows.length,
  671 |       },
  672 |       partners: {
  673 |         requests: partnerRows.length,
  674 |         active: partnerRows.filter((r) => String(r.status || '').toLowerCase() === 'active').length,
  675 |       },
  676 |       requests: {
  677 |         total: requirementRows.length,
  678 |         verified_only: requirementRows.filter((r) => Boolean(r.verified_only)).length,
  679 |         matches: matchRows.length,
  680 |       },
  681 |       contracts: {
  682 |         total: contractDocs.length,
  683 |         pending_signatures: pendingSignatures,
  684 |         payment_proofs: paymentProofRows.length,
  685 |       },
  686 |       calls: {
  687 |         total: callRows.length,
  688 |         recordings: callRows.filter((c) => Boolean(c.recording_url) || String(c.recording_status || '').toLowerCase() === 'available').length,
  689 |       },
  690 |       messages: {
  691 |         total: messageRows.length,
  692 |         violations: violationRows.length,
  693 |         strikes: userRows.reduce((sum, u) => sum + Number(u.policy_strikes || 0), 0),
  694 |       },
  695 |       media: {
  696 |         videos_pending: productRows.filter((p) => Boolean(p.video_url) && String(p.video_review_status || '').toLowerCase() !== 'approved').length,
  697 |         docs_pending: documentRows.filter((d) => String(d.moderation_status || '').toLowerCase() === 'pending_review').length,
  698 |       },
  699 |       support: {
  700 |         tickets: supportTicketRows.length,
  701 |         open: supportTicketRows.filter((r) => String(r.status || '').toLowerCase() !== 'resolved').length,
  702 |       },
  703 |       notifications: {
  704 |         total: notificationRows.length,
  705 |       },
  706 |       analytics: {
  707 |         total_events: Array.isArray(analytics) ? analytics.length : 0,
  708 |       },
  709 |       search: {
  710 |         alerts: searchAlertRows.length,
  711 |         abuse_flags: searchAbuse,
  712 |       },
  713 |       ai: {
  714 |         knowledge_entries: knowledgeRows.length,
  715 |         chatbot_enabled: userRows.filter((u) => Boolean(u.chatbot_enabled)).length,
  716 |       },
  717 |       system: {
  718 |         feature_flags: Object.keys(config.feature_flags || {}).length,
  719 |         plan_limits: Object.keys(config.plan_limits || {}).length,
  720 |       },
  721 |       security: {
  722 |         audit_entries: auditLog.length,
  723 |       },
  724 |       integrations: {
  725 |         payment_gateways: (config.integrations?.payment_gateways || []).length,
  726 |         webhooks: (config.integrations?.webhooks || []).length,
  727 |         api_keys: (config.integrations?.api_keys || []).length,
  728 |       },
  729 |       traffic: {
  730 |         clicks,
  731 |         visits,
  732 |       },
  733 |       emails: {
  734 |         total: userRows.length,
  735 |       },
  736 |     },
  737 |     dashboard,
  738 |     config,
  739 |     inventory: ADMIN_INVENTORY,
  740 |   }
  741 | }
  742 | 
  743 | export { ADMIN_INVENTORY }
  744 | 