import React, { useEffect, useMemo, useState } from 'react'
import AccessDeniedState from '../components/AccessDeniedState'
import { apiRequest, getCurrentUser, getToken, hasEntitlement } from '../lib/auth'

const MEMBER_API_BASE = '/org/members'

const DEFAULT_CREATE_FORM = {
  name: '',
  username: '',
  member_id: '',
  // Phase 2: "members" are enterprise sub-accounts (agents). Role is fixed server-side.
  role: 'agent',
  password: '',
  permissions: [],
  permission_matrix: {},
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function createBlankMatrix(sections = []) {
  return sections.reduce((acc, section) => ({ ...acc, [section]: { view: false, edit: false } }), {})
}

export default function MemberManagement() {
  const sessionUser = getCurrentUser()
  const canTeamAccess = hasEntitlement(sessionUser, 'team_access_management')
  const [search, setSearch] = useState('')
  const [members, setMembers] = useState([])
  const [constraints, setConstraints] = useState({
    free_member_limit: 10,
    valid_permissions: [],
    permission_conflicts: [],
    permission_matrix_sections: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forbidden, setForbidden] = useState(false)
  const [success, setSuccess] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState(DEFAULT_CREATE_FORM)
  const [activePermissionMember, setActivePermissionMember] = useState(null)

  const token = getToken()

  async function loadMembers() {
    setLoading(true)
    setError('')
    setForbidden(false)
    try {
      const data = await apiRequest(MEMBER_API_BASE, { token })
      const nextConstraints = data.constraints || constraints
      setConstraints(nextConstraints)
      setMembers(data.members || [])
      setCreateForm((prev) => ({
        ...prev,
        permission_matrix: Object.keys(prev.permission_matrix || {}).length
          ? prev.permission_matrix
          : createBlankMatrix(nextConstraints.permission_matrix_sections || []),
      }))
    } catch (err) {
      setForbidden(err.status === 403)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return members
    return members.filter((m) => [m.name, m.username, m.member_id, m.role, m.status].join(' ').toLowerCase().includes(q))
  }, [members, search])

  const planLabel = String(constraints.plan || 'free').toUpperCase()
  const premiumLimitValue = Number(constraints.premium_member_limit)
  const premiumLimitLabel = Number.isFinite(premiumLimitValue)
    ? (premiumLimitValue >= 999 ? 'Unlimited' : constraints.premium_member_limit)
    : '--'

  function getConflictMessage(permissions) {
    const conflict = constraints.permission_conflicts.find(([a, b]) => permissions.includes(a) && permissions.includes(b))
    if (!conflict) return ''
    return `Permission conflict: ${conflict[0]} cannot be combined with ${conflict[1]}.`
  }

  async function handleCreateMember(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (canTeamAccess) {
      const conflict = getConflictMessage(createForm.permissions)
      if (conflict) {
        setError(conflict)
        return
      }
    }

    try {
      const payload = canTeamAccess
        ? createForm
        : Object.fromEntries(Object.entries(createForm).filter(([key]) => !['permissions', 'permission_matrix'].includes(key)))
      const data = await apiRequest(MEMBER_API_BASE, { method: 'POST', token, body: payload })
      const created = data?.member || null
      // If the UI didn't provide a password, server may return a generated temp password to share with the agent.
      const temp = created?.temporary_password ? ` Temporary password: ${created.temporary_password}` : ''
      setSuccess(`Member created.${temp}`)
      setCreateForm({
        ...DEFAULT_CREATE_FORM,
        permission_matrix: createBlankMatrix(constraints.permission_matrix_sections),
      })
      setShowCreate(false)
      await loadMembers()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleResetPassword(memberId) {
    setError('')
    setSuccess('')
    try {
      const data = await apiRequest(`${MEMBER_API_BASE}/${memberId}/reset-password`, { method: 'POST', token })
      setSuccess(`Temporary password for ${data.member.name}: ${data.temporary_password}`)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeactivateOrRemove(memberId, remove = false) {
    setError('')
    setSuccess('')
    try {
      await apiRequest(`${MEMBER_API_BASE}/${memberId}?remove=${remove ? 'true' : 'false'}`, { method: 'DELETE', token })
      setSuccess(remove ? 'Member removed.' : 'Member deactivated.')
      await loadMembers()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdateMember(memberId, payload) {
    if (canTeamAccess) {
      const conflict = getConflictMessage(payload.permissions)
      if (conflict) {
        setError(conflict)
        return
      }
    }

    setError('')
    setSuccess('')
    try {
      const nextPayload = canTeamAccess
        ? payload
        : Object.fromEntries(Object.entries(payload).filter(([key]) => !['permissions', 'permission_matrix'].includes(key)))
      await apiRequest(`${MEMBER_API_BASE}/${memberId}`, { method: 'PUT', token, body: nextPayload })
      setSuccess('Member updated.')
      setActivePermissionMember(null)
      await loadMembers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Member Management</h1>
            <p className="text-sm text-[#5A5A5A]">Manage sub-accounts and permissions</p>
          </div>
          <button className="px-4 py-2 bg-[#0A66C2] text-white rounded-md" onClick={() => setShowCreate(true)}>+ Add New Member</button>
        </div>

        {!!error && <div className="mb-3 text-sm text-red-700 bg-red-50 borderless-shadow rounded p-2">{error}</div>}
        {!!success && <div className="mb-3 text-sm text-green-700 bg-green-50 borderless-shadow rounded p-2">{success}</div>}

        {forbidden ? <AccessDeniedState message="You do not have permission to manage members for this organization." /> : null}

        {forbidden ? null : (
          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-sm borderless-shadow p-4">
            <div className="mb-4 flex items-center gap-3">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members" className="px-3 py-2 borderless-shadow rounded w-64" />
              <div className="text-sm text-[#5A5A5A]">
                Plan: {planLabel} • Free limit: {constraints.free_member_limit} • Premium limit: {premiumLimitLabel}
              </div>
            </div>
            {!canTeamAccess ? (
              <div className="mb-3 rounded-lg borderless-shadow bg-amber-50 p-3 text-xs text-amber-900">
                Team/agent access management is a Premium feature. Upgrade to edit permissions and access controls.
              </div>
            ) : null}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[#5A5A5A]">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Username</th>
                    <th className="py-2 px-3">Member ID</th>
                    <th className="py-2 px-3">Role</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td className="py-4 px-3" colSpan={6}>Loading members...</td></tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr><td className="py-4 px-3" colSpan={6}>No members found.</td></tr>
                  )}
                  {!loading && filtered.map((m) => (
                    <tr key={m.id} className="borderless-divider-t">
                      <td className="py-2 px-3">{m.name}</td>
                      <td className="py-2 px-3">{m.username}</td>
                      <td className="py-2 px-3">{m.member_id || m.account_id}</td>
                      <td className="py-2 px-3">{m.role}</td>
                      <td className="py-2 px-3">{m.status}</td>
                      <td className="py-2 px-3">
                        <button className="px-2 py-1 bg-[#0A66C2] text-white rounded mr-2" onClick={() => setActivePermissionMember(m)}>Edit</button>
                        <button className="px-2 py-1 borderless-shadow rounded mr-2" onClick={() => handleResetPassword(m.id)}>Reset</button>
                        <button className="px-2 py-1 borderless-shadow rounded mr-2 text-amber-700" onClick={() => handleDeactivateOrRemove(m.id, false)}>Deactivate</button>
                        <button className="px-2 py-1 borderless-shadow rounded text-red-600" onClick={() => handleDeactivateOrRemove(m.id, true)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Create member" onClose={() => setShowCreate(false)}>
          <form className="space-y-3" onSubmit={handleCreateMember}>
            <input className="w-full borderless-shadow rounded px-3 py-2" placeholder="Member name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
            <input className="w-full borderless-shadow rounded px-3 py-2" placeholder="Unique username" value={createForm.username} onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} />
            <input className="w-full borderless-shadow rounded px-3 py-2" placeholder="Unique member ID" value={createForm.member_id} onChange={(e) => setCreateForm({ ...createForm, member_id: e.target.value })} />
            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              Role is fixed to <span className="font-semibold">Agent</span>. Agents login using their <span className="font-semibold">Member ID</span>.
            </div>
            <input className="w-full borderless-shadow rounded px-3 py-2" placeholder="Initial password (optional -- auto-generate if empty)" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />

            <PermissionMatrixEditor
              matrix={createForm.permission_matrix}
              sections={constraints.permission_matrix_sections}
              onChange={(permission_matrix) => setCreateForm({ ...createForm, permission_matrix })}
              disabled={!canTeamAccess}
            />

            <PermissionSelector
              permissions={createForm.permissions}
              validPermissions={constraints.valid_permissions}
              onChange={(permissions) => setCreateForm({ ...createForm, permissions })}
              conflict={getConflictMessage(createForm.permissions)}
              disabled={!canTeamAccess}
            />

            <button type="submit" className="px-4 py-2 bg-[#0A66C2] text-white rounded">Create</button>
          </form>
        </Modal>
      )}

      {!!activePermissionMember && (
        <Modal title={`Edit member: ${activePermissionMember.name}`} onClose={() => setActivePermissionMember(null)}>
          <MemberEditor
            member={activePermissionMember}
            constraints={constraints}
            getConflictMessage={getConflictMessage}
            onSave={(payload) => handleUpdateMember(activePermissionMember.id, payload)}
            canTeamAccess={canTeamAccess}
          />
        </Modal>
      )}

    </div>
  )
}

function PermissionSelector({ permissions, validPermissions, onChange, conflict, disabled = false }) {
  return (
    <div>
      <div className="text-sm mb-1">Permissions</div>
      <div className={`grid grid-cols-2 gap-2${disabled ? ' opacity-60' : ''}`}>
        {validPermissions.map((perm) => (
          <label key={perm} className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={permissions.includes(perm)}
              disabled={disabled}
              onChange={(e) => {
                const next = e.target.checked ? [...permissions, perm] : permissions.filter((p) => p !== perm)
                onChange(next)
              }}
            />
            {perm}
          </label>
        ))}
      </div>
      {!!conflict && <div className="text-red-600 text-sm mt-1">{conflict}</div>}
    </div>
  )
}

function PermissionMatrixEditor({ matrix, sections, onChange, disabled = false }) {
  return (
    <div>
      <div className="text-sm mb-1">Permission matrix (view/edit per module)</div>
      <div className={`space-y-2${disabled ? ' opacity-60' : ''}`}>
        {sections.map((section) => (
          <div key={section} className="flex items-center justify-between borderless-shadow rounded px-3 py-2">
            <span className="text-sm font-medium capitalize">{section}</span>
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={Boolean(matrix?.[section]?.view)}
                  disabled={disabled}
                  onChange={(e) =>
                    onChange({
                      ...matrix,
                      [section]: { ...matrix?.[section], view: e.target.checked },
                    })
                  }
                />
                View
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={Boolean(matrix?.[section]?.edit)}
                  disabled={disabled}
                  onChange={(e) =>
                    onChange({
                      ...matrix,
                      [section]: { ...matrix?.[section], edit: e.target.checked },
                    })
                  }
                />
                Edit
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MemberEditor({ member, constraints, getConflictMessage, onSave, canTeamAccess }) {
  const [form, setForm] = useState({
    name: member.name || '',
    username: member.username || '',
    member_id: member.member_id || member.account_id || '',
    // Role is fixed to agent; keep in payload for backwards compatibility but prevent editing.
    role: 'agent',
    status: member.status || 'active',
    permissions: member.permissions || [],
    permission_matrix: member.permission_matrix || createBlankMatrix(constraints.permission_matrix_sections),
  })

  const conflict = getConflictMessage(form.permissions)

  return (
    <div className="space-y-3">
      <input className="w-full borderless-shadow rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Member name" />
      <input className="w-full borderless-shadow rounded px-3 py-2" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
      <input className="w-full borderless-shadow rounded px-3 py-2" value={form.member_id} onChange={(e) => setForm({ ...form, member_id: e.target.value })} placeholder="Member ID" />
      <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
        Role: <span className="font-semibold">Agent</span> (fixed)
      </div>

      <select className="w-full borderless-shadow rounded px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option value="active">active</option>
        <option value="inactive">inactive</option>
      </select>

      <PermissionMatrixEditor
        matrix={form.permission_matrix}
        sections={constraints.permission_matrix_sections}
        onChange={(permission_matrix) => setForm({ ...form, permission_matrix })}
        disabled={!canTeamAccess}
      />

      <PermissionSelector
        permissions={form.permissions}
        validPermissions={constraints.valid_permissions}
        onChange={(permissions) => setForm({ ...form, permissions })}
        conflict={conflict}
        disabled={!canTeamAccess}
      />

      <button className="px-4 py-2 bg-[#0A66C2] text-white rounded" onClick={() => onSave(form)}>Save changes</button>
    </div>
  )
}

