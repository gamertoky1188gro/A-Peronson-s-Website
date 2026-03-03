import React, { useEffect, useMemo, useState } from 'react'
import FloatingAssistant from '../components/FloatingAssistant'
import { apiRequest, getToken } from '../lib/auth'

const DEFAULT_CREATE_FORM = {
  name: '',
  account_id: '',
  role: '',
  password: '',
  permissions: [],
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function MemberManagement() {
  const [search, setSearch] = useState('')
  const [members, setMembers] = useState([])
  const [constraints, setConstraints] = useState({ free_member_limit: 10, valid_permissions: [], permission_conflicts: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState(DEFAULT_CREATE_FORM)
  const [activePermissionMember, setActivePermissionMember] = useState(null)

  const token = getToken()

  async function loadMembers() {
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/members', { token })
      setMembers(data.members || [])
      setConstraints(data.constraints || constraints)
    } catch (err) {
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
    return members.filter((m) => [m.name, m.account_id, m.role, m.status].join(' ').toLowerCase().includes(q))
  }, [members, search])

  function getConflictMessage(permissions) {
    const conflict = constraints.permission_conflicts.find(([a, b]) => permissions.includes(a) && permissions.includes(b))
    if (!conflict) return ''
    return `Permission conflict: ${conflict[0]} cannot be combined with ${conflict[1]}.`
  }

  async function handleCreateMember(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const duplicateName = members.some((m) => m.name.toLowerCase() === createForm.name.trim().toLowerCase())
    if (duplicateName) {
      setError('Duplicate member name in this organization.')
      return
    }

    const duplicateId = members.some((m) => m.account_id.toLowerCase() === createForm.account_id.trim().toLowerCase())
    if (duplicateId) {
      setError('Account ID already exists.')
      return
    }

    const conflict = getConflictMessage(createForm.permissions)
    if (conflict) {
      setError(conflict)
      return
    }

    try {
      await apiRequest('/members', { method: 'POST', token, body: createForm })
      setSuccess('Member created.')
      setCreateForm(DEFAULT_CREATE_FORM)
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
      const data = await apiRequest(`/members/${memberId}/reset-password`, { method: 'POST', token })
      setSuccess(`Temporary password for ${data.member.name}: ${data.temporary_password}`)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeactivateOrRemove(memberId, remove = false) {
    setError('')
    setSuccess('')
    try {
      await apiRequest(`/members/${memberId}?remove=${remove ? 'true' : 'false'}`, { method: 'DELETE', token })
      setSuccess(remove ? 'Member removed.' : 'Member deactivated.')
      await loadMembers()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdatePermissions(memberId, permissions) {
    const conflict = getConflictMessage(permissions)
    if (conflict) {
      setError(conflict)
      return
    }

    setError('')
    setSuccess('')
    try {
      await apiRequest(`/members/${memberId}/permissions`, { method: 'PATCH', token, body: { permissions } })
      setSuccess('Permissions updated.')
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

        {!!error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        {!!success && <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{success}</div>}

        <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-sm border p-4">
          <div className="mb-4 flex items-center gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members" className="px-3 py-2 border rounded w-64" />
            <div className="text-sm text-[#5A5A5A]">Free plan limit: {constraints.free_member_limit} members</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[#5A5A5A]">
                  <th className="py-2 px-3">Member Name</th>
                  <th className="py-2 px-3">Member ID</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Assigned Requests</th>
                  <th className="py-2 px-3">Performance</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td className="py-4 px-3" colSpan={7}>Loading members...</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td className="py-4 px-3" colSpan={7}>No members found.</td></tr>
                )}
                {!loading && filtered.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="py-2 px-3">{m.name}</td>
                    <td className="py-2 px-3">{m.account_id}</td>
                    <td className="py-2 px-3">{m.role}</td>
                    <td className="py-2 px-3">{m.assigned_requests || 0}</td>
                    <td className="py-2 px-3">{m.performance_score || 0}</td>
                    <td className="py-2 px-3">{m.status}</td>
                    <td className="py-2 px-3">
                      <button className="px-2 py-1 bg-[#0A66C2] text-white rounded mr-2" onClick={() => setActivePermissionMember(m)}>Edit</button>
                      <button className="px-2 py-1 border rounded mr-2" onClick={() => handleResetPassword(m.id)}>Reset</button>
                      <button className="px-2 py-1 border rounded mr-2 text-amber-700" onClick={() => handleDeactivateOrRemove(m.id, false)}>Deactivate</button>
                      <button className="px-2 py-1 border rounded text-red-600" onClick={() => handleDeactivateOrRemove(m.id, true)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreate && (
        <Modal title="Create member" onClose={() => setShowCreate(false)}>
          <form className="space-y-3" onSubmit={handleCreateMember}>
            <input className="w-full border rounded px-3 py-2" placeholder="Member name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
            <input className="w-full border rounded px-3 py-2" placeholder="Unique account ID" value={createForm.account_id} onChange={(e) => setCreateForm({ ...createForm, account_id: e.target.value })} />
            <input className="w-full border rounded px-3 py-2" placeholder="Role" value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })} />
            <input className="w-full border rounded px-3 py-2" placeholder="Initial password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />

            <div>
              <div className="text-sm mb-1">Permissions</div>
              <div className="grid grid-cols-2 gap-2">
                {constraints.valid_permissions.map((perm) => (
                  <label key={perm} className="text-sm flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={createForm.permissions.includes(perm)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...createForm.permissions, perm]
                          : createForm.permissions.filter((p) => p !== perm)
                        setCreateForm({ ...createForm, permissions: next })
                      }}
                    />
                    {perm}
                  </label>
                ))}
              </div>
              {!!getConflictMessage(createForm.permissions) && <div className="text-red-600 text-sm mt-1">{getConflictMessage(createForm.permissions)}</div>}
            </div>

            <button type="submit" className="px-4 py-2 bg-[#0A66C2] text-white rounded">Create</button>
          </form>
        </Modal>
      )}

      {!!activePermissionMember && (
        <Modal title={`Edit permissions: ${activePermissionMember.name}`} onClose={() => setActivePermissionMember(null)}>
          <PermissionEditor
            member={activePermissionMember}
            validPermissions={constraints.valid_permissions}
            getConflictMessage={getConflictMessage}
            onSave={(permissions) => handleUpdatePermissions(activePermissionMember.id, permissions)}
          />
        </Modal>
      )}

      <FloatingAssistant />
    </div>
  )
}

function PermissionEditor({ member, validPermissions, getConflictMessage, onSave }) {
  const [permissions, setPermissions] = useState(member.permissions || [])
  const conflict = getConflictMessage(permissions)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {validPermissions.map((perm) => (
          <label key={perm} className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={permissions.includes(perm)}
              onChange={(e) => {
                const next = e.target.checked ? [...permissions, perm] : permissions.filter((p) => p !== perm)
                setPermissions(next)
              }}
            />
            {perm}
          </label>
        ))}
      </div>
      {!!conflict && <div className="text-red-600 text-sm">{conflict}</div>}
      <button className="px-4 py-2 bg-[#0A66C2] text-white rounded" onClick={() => onSave(permissions)}>Save permissions</button>
    </div>
  )
}
