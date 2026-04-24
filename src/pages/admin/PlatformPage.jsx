import React from 'react'
import {
  Download,
} from 'lucide-react'

const PlatformPage = function PlatformPage({
  adminDark,
  activeCategory,
  userQuery,
  setUserQuery,
  userDrafts,
  setUserDrafts,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  verificationFilter,
  setVerificationFilter,
  premiumFilter,
  setPremiumFilter,
  regionFilter,
  setRegionFilter,
  filteredUsers,
  users,
  exportEmailsCsv,
  formatNumber,
  emptyCopy,
  refreshSignups,
  signups,
  downloadCsv,
  setError,
  refreshFraudReview,
  fraudReview,
  refreshStrikeHistory,
  strikeHistory,
  refreshOrgOwnership,
  orgOwnership,
  refreshWalletLedger,
  walletLedger,
  refreshCatalog,
  catalog,
  featuredForm,
  setFeaturedForm,
  runInlineAdminAction,
  refreshVerificationQueue,
  verificationQueue,
  refreshContractsVault,
  contractsVault,
  paymentProofs,
  refreshDisputes,
  disputes,
  refreshModerationQueues,
  moderationPending,
  moderationRejected,
  apiRequest,
  getToken,
  buildAdminHeaders,
  refreshMessagePolicyOps,
  policyQueueItems,
  setPolicyQueueItems,
  policyReviewRows,
  setPolicyReviewRows,
  policyMetrics,
  updateDraft,
  forceLogout,
  resetPassword,
  lockMessaging,
  saveUserEdits,
  regionOptions,
  loading,
  reputationSenderId,
  setReputationSenderId,
  reputationDelta,
  setReputationDelta,
  saveClothingRules,
  clothingRulesBusy,
  clothingRulesForm,
  setClothingRulesForm,
  clothingRulesError,
  refreshSupportTickets,
  supportTickets,
  supportLoading,
  supportFilters,
  setSupportFilters,
  assignSupportTicketAdmin,
  updateSupportTicketAdmin,
  refreshPartnerRequests,
  partnerRequests,
  couponReport,
  formatCurrency,
}) {
  refreshModerationQueues,
  moderationPending,
  moderationRejected,
  apiRequest,
  getToken,
  buildAdminHeaders,
  refreshMessagePolicyOps,
  policyQueueItems,
  setPolicyQueueItems,
  policyReviewRows,
  setPolicyReviewRows,
  policyMetrics,
  updateDraft,
  forceLogout,
  resetPassword,
  lockMessaging,
  saveUserEdits,
  regionOptions,
  refreshPartnerRequests,
  partnerRequests,
  couponReport,
  saveClothingRules,
  clothingRulesBusy,
  clothingRulesForm,
  setClothingRulesForm,
  clothingRulesError,
  formatCurrency,
}) {
  return (
    <div className="space-y-6">
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
                          {proof.type} · {proof.status} · {proof.amount || '--'} {proof.currency || ''}{proof.lc_type ? ` · ${String(proof.lc_type).toUpperCase()}${proof.lc_type === 'usance' && proof.usance_days ? ` (${proof.usance_days}d)` : ''}` : ''}
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
              className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-semibold text-slate-600"
            >
              {clothingRulesBusy ? 'Saving...' : 'Save rules'}
            </button>
          </div>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-[11px] font-semibold uppercase text-slate-500">Banned terms (comma-separated)</p>
              <textarea
                rows="2"
                value={clothingRulesForm.banned_terms || ''}
                onChange={(event) => setClothingRulesForm((prev) => ({ ...prev, banned_terms: event.target.value }))}
                className="mt-1 w-full rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                placeholder="term1, term2"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase text-slate-500">Neutral rejection reason template</p>
              <input
                value={clothingRulesForm.neutral_reason_template || ''}
                onChange={(event) => setClothingRulesForm((prev) => ({ ...prev, neutral_reason_template: event.target.value }))}
                className="mt-1 w-full rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs dark:bg-slate-950"
                placeholder="Your listing was flagged for review"
              />
            </div>
            {clothingRulesError ? <p className="text-xs text-rose-600">{clothingRulesError}</p> : null}
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
                <div className="text-[11px] text-slate-500">Subscriptions: {(catalog?.finance?.subscriptions || []).length}</div>
                {(catalog?.finance?.failed_renewals || []).slice(0, 1).map((row) => (
                  <div key={row.id} className="text-[11px] text-slate-500">Failed renewal: {row.user_id}</div>
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
    </div>
  )
}

export default PlatformPage