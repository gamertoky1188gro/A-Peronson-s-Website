import NeonAtom from "../components/ui/NeonAtom";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import AccessDeniedState from "../components/AccessDeniedState";
import ScrollReveal from "../components/ScrollReveal";
import {
  apiRequest,
  getCurrentUser,
  getToken,
  hasEntitlement,
} from "../lib/auth";

const MEMBER_API_BASE = "/org/members";

function generateMemberId(existingMembers = []) {
  const nums = existingMembers
    .map((m) => {
      const match = String(m.member_id || "").match(/^AGT-?(\d+)$/i);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => n > 0);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `AGT-${String(next).padStart(3, "0")}`;
}

const DEFAULT_CREATE_FORM = {
  name: "",
  username: "",
  member_id: "",
  role: "agent",
  password: "",
  permissions: [],
  permission_matrix: {},
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function badgeClass(status) {
  return status === "active"
    ? "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-300"
    : "bg-rose-500/15 text-rose-600 ring-1 ring-rose-500/20 dark:text-rose-300";
}

function createBlankMatrix(sections = []) {
  return sections.reduce(
    (acc, section) => ({ ...acc, [section]: { view: false, edit: false } }),
    {},
  );
}

function PermissionChips({ permissions }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {permissions.length ? (
        permissions.map((perm) => (
          <span
            key={perm}
            className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:text-sky-200"
          >
            {perm}
          </span>
        ))
      ) : (
        <span className="text-xs text-slate-400">—</span>
      )}
    </div>
  );
}

function Modal({ title, children, onClose, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <div className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">{title}</div>
      <div className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

function ActionButton({ label, onClick, variant = "default" }) {
  const styles = {
    default:
      "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:text-sky-300",
    warning:
      "border-amber-500/20 bg-amber-500/10 text-amber-800 hover:border-amber-500/40 dark:text-amber-100",
    danger:
      "border-rose-500/20 bg-rose-500/10 text-rose-800 hover:border-rose-500/40 dark:text-rose-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "rounded-xl border px-3.5 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md",
        styles[variant],
      )}
    >
      {label}
    </button>
  );
}

export default function MemberManagement() {
  const sessionUser = getCurrentUser();
  const canTeamAccess = hasEntitlement(sessionUser, "team_access_management");
  const canManageMembers = sessionUser?.capabilities?.members?.manage !== false;
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [constraints, setConstraints] = useState({
    free_member_limit: 10,
    valid_permissions: [],
    permission_conflicts: [],
    permission_matrix_sections: [],
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const [success, setSuccess] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(DEFAULT_CREATE_FORM);
  const [activePermissionMember, setActivePermissionMember] = useState(null);

  const token = getToken();
  const editFormRef = useRef(null);

  async function loadMembers() {
    setLoading(true);
    setError("");
    setForbidden(false);
    try {
      const data = await apiRequest(MEMBER_API_BASE, { token });
      const nextConstraints = data.constraints || constraints;
      setConstraints(nextConstraints);
      setMembers(data.members || []);
      setCreateForm((prev) => ({
        ...prev,
        permission_matrix: Object.keys(prev.permission_matrix || {}).length
          ? prev.permission_matrix
          : createBlankMatrix(nextConstraints.permission_matrix_sections || []),
      }));
    } catch (err) {
      setForbidden(err.status === 403);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pageLoading && !loading) {
      setPageLoading(false);
    }
  }, [pageLoading, loading]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return members;
    return members.filter((m) =>
      [m.name, m.username, m.member_id, m.role, m.status]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [members, search]);

  const planLabel = String(constraints.plan || "free").toUpperCase();
  const premiumLimitValue = Number(constraints.premium_member_limit);
  const premiumLimitLabel = Number.isFinite(premiumLimitValue)
    ? premiumLimitValue >= 999
      ? "Unlimited"
      : constraints.premium_member_limit
    : "--";

  function getConflictMessage(permissions) {
    const conflict = constraints.permission_conflicts.find(
      ([a, b]) => permissions.includes(a) && permissions.includes(b),
    );
    if (!conflict) return "";
    return `Permission conflict: ${conflict[0]} cannot be combined with ${conflict[1]}.`;
  }

  async function handleCreateMember(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (canTeamAccess) {
      const conflict = getConflictMessage(createForm.permissions);
      if (conflict) {
        setError(conflict);
        return;
      }
    }

    try {
      const payload = canTeamAccess
        ? createForm
        : Object.fromEntries(
            Object.entries(createForm).filter(
              ([key]) => !["permissions", "permission_matrix"].includes(key),
            ),
          );
      const data = await apiRequest(MEMBER_API_BASE, {
        method: "POST",
        token,
        body: payload,
      });
      const created = data?.member || null;
      const temp = created?.temporary_password
        ? ` Temporary password: ${created.temporary_password}`
        : "";
      setSuccess(`Member created.${temp}`);
      setCreateForm({
        ...DEFAULT_CREATE_FORM,
        permission_matrix: createBlankMatrix(
          constraints.permission_matrix_sections,
        ),
      });
      setShowCreate(false);
      await loadMembers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleResetPassword(memberId) {
    setError("");
    setSuccess("");
    try {
      const data = await apiRequest(
        `${MEMBER_API_BASE}/${memberId}/reset-password`,
        { method: "POST", token },
      );
      setSuccess(
        `Temporary password for ${data.member.name}: ${data.temporary_password}`,
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeactivateOrRemove(memberId, remove = false) {
    setError("");
    setSuccess("");
    try {
      await apiRequest(
        `${MEMBER_API_BASE}/${memberId}?remove=${remove ? "true" : "false"}`,
        { method: "DELETE", token },
      );
      setSuccess(remove ? "Member removed." : "Member deactivated.");
      await loadMembers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateMember(memberId, payload) {
    if (canTeamAccess) {
      const conflict = getConflictMessage(payload.permissions);
      if (conflict) {
        setError(conflict);
        return;
      }
    }

    setError("");
    setSuccess("");
    try {
      const nextPayload = canTeamAccess
        ? payload
        : Object.fromEntries(
            Object.entries(payload).filter(
              ([key]) => !["permissions", "permission_matrix"].includes(key),
            ),
          );
      await apiRequest(`${MEMBER_API_BASE}/${memberId}`, {
        method: "PUT",
        token,
        body: nextPayload,
      });
      setSuccess("Member updated.");
      setActivePermissionMember(null);
      await loadMembers();
    } catch (err) {
      setError(err.message);
    }
  }

  if (pageLoading) {
    return <NeonAtom fill />;
  }

  if (forbidden || !canManageMembers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-sky-950/40 dark:text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <AccessDeniedState message="You do not have permission to manage members for this organization." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-sky-950/40 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-200">
                /member-management
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Member Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                Manage sub-accounts and permissions
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-80">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search members"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">⌕</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setCreateForm((prev) => ({
                    ...prev,
                    member_id: generateMemberId(members),
                  }));
                  setShowCreate(true);
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110"
              >
                + Add New Member
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <InfoCard title="Plan" value={`${planLabel} • Free limit: ${constraints.free_member_limit} • Premium limit: ${premiumLimitLabel}`} />
            <InfoCard title="Team access" value={canTeamAccess ? "Premium permissions enabled" : "Premium permissions locked"} />
            <InfoCard title="Members" value={`${filtered.length} shown / ${members.length} total`} />
          </div>

          {!canTeamAccess ? (
            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
              Team/agent access management is a Premium feature. Upgrade to edit permissions and access controls.
            </div>
          ) : null}

          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-800 dark:text-rose-100">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-100">
              {success}
            </div>
          ) : null}

          <ScrollReveal as="section">
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-900/70">
                  <tr>
                    {["Name", "Username", "Member ID", "Role", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <NeonAtom size={40} text="Loading members..." />
                      </td>
                    </tr>
                  ) : filtered.length ? (
                    filtered.map((m) => (
                      <tr key={m.id} className="transition hover:bg-sky-50/50 dark:hover:bg-slate-900/60">
                        <td className="px-6 py-5">
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{m.name}</div>
                            <div className="mt-1">
                              <PermissionChips permissions={m.permissions || []} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-200">{m.username}</td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-700 dark:text-slate-200">{m.member_id || m.account_id}</td>
                        <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-200">{m.role}</td>
                        <td className="px-6 py-5">
                          <span className={classNames("inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize", badgeClass(m.status))}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            <ActionButton label="Edit" onClick={() => setActivePermissionMember(m)} />
                            <ActionButton label="Reset" onClick={() => handleResetPassword(m.id)} />
                            <ActionButton label="Deactivate" onClick={() => handleDeactivateOrRemove(m.id, false)} variant="warning" />
                            <ActionButton label="Remove" onClick={() => handleDeactivateOrRemove(m.id, true)} variant="danger" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                        No members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </div>

      {showCreate && (
        <Modal
          title="Create member"
          onClose={() => setShowCreate(false)}
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-2xl border border-slate-200 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCreateMember}
                className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110"
              >
                Create
              </button>
            </div>
          }
        >
          <form className="space-y-6" onSubmit={handleCreateMember}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Member name</span>
                <input
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="Enter member name"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Unique username</span>
                <input
                  value={createForm.username}
                  onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="Enter username"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Member ID (auto-generated)</span>
                <div className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-mono text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  {createForm.member_id || "AGT-001"}
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Initial password (optional)</span>
                <input
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="Leave empty to auto-generate"
                />
              </label>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Role is fixed to Agent. Agents login using their Member ID.</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Role: Agent (fixed)</p>
              {!canTeamAccess ? (
                <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100">
                  Team/agent access management is a Premium feature. Upgrade to edit permissions and access controls.
                </div>
              ) : null}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">Permission matrix</h4>
                <span className="text-sm text-slate-500 dark:text-slate-400">view/edit per module</span>
              </div>
              <PermissionMatrixEditor
                matrix={createForm.permission_matrix}
                sections={constraints.permission_matrix_sections}
                onChange={(permission_matrix) =>
                  setCreateForm({ ...createForm, permission_matrix })
                }
                disabled={!canTeamAccess}
              />
            </div>

            <PermissionSelector
              permissions={createForm.permissions}
              validPermissions={constraints.valid_permissions}
              onChange={(permissions) =>
                setCreateForm({ ...createForm, permissions })
              }
              conflict={getConflictMessage(createForm.permissions)}
              disabled={!canTeamAccess}
            />

            {getConflictMessage(createForm.permissions) ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-800 dark:text-rose-100">
                {getConflictMessage(createForm.permissions)}
              </div>
            ) : null}
          </form>
        </Modal>
      )}

      {!!activePermissionMember && (
        <Modal
          title={`Edit member: ${activePermissionMember.name}`}
          onClose={() => setActivePermissionMember(null)}
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setActivePermissionMember(null)}
                className="rounded-2xl border border-slate-200 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editFormRef.current) {
                    handleUpdateMember(activePermissionMember.id, editFormRef.current);
                  }
                }}
                className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110"
              >
                Save changes
              </button>
            </div>
          }
        >
          <MemberEditor
            ref={editFormRef}
            member={activePermissionMember}
            constraints={constraints}
            getConflictMessage={getConflictMessage}
            canTeamAccess={canTeamAccess}
          />
        </Modal>
      )}
    </div>
  );
}

function PermissionSelector({
  permissions,
  validPermissions,
  onChange,
  conflict,
  disabled = false,
}) {
  return (
    <div className={disabled ? " opacity-60" : ""}>
      <div className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Permissions</div>
      <div className="grid grid-cols-2 gap-3">
        {validPermissions.map((perm) => (
          <label key={perm} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-sky-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
            <input
              type="checkbox"
              checked={permissions.includes(perm)}
              disabled={disabled}
              onChange={(e) => {
                const next = e.target.checked
                  ? [...permissions, perm]
                  : permissions.filter((p) => p !== perm);
                onChange(next);
              }}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            {perm}
          </label>
        ))}
      </div>
      {!!conflict && (
        <div className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-800 dark:text-rose-100">
          {conflict}
        </div>
      )}
    </div>
  );
}

function PermissionMatrixEditor({
  matrix,
  sections,
  onChange,
  disabled = false,
}) {
  return (
    <div className={disabled ? " opacity-60" : ""}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const current = matrix?.[section] || { view: false, edit: false };
          const isMembers = section === "members";
          return (
            <div
              key={section}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                  {section}
                </span>
                {isMembers ? (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Forced false
                  </span>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-sky-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={isMembers ? false : !!current.view}
                    disabled={disabled || isMembers}
                    onChange={(e) =>
                      onChange({
                        ...matrix,
                        [section]: { ...current, view: e.target.checked },
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  View
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-sky-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={isMembers ? false : !!current.edit}
                    disabled={disabled || isMembers}
                    onChange={(e) =>
                      onChange({
                        ...matrix,
                        [section]: { ...current, edit: e.target.checked },
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Edit
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MemberEditor = forwardRef(function MemberEditor(
  { member, constraints, getConflictMessage, canTeamAccess },
  ref,
) {
  const [form, setForm] = useState({
    name: member.name || "",
    username: member.username || "",
    member_id: member.member_id || member.account_id || "",
    role: "agent",
    status: member.status || "active",
    permissions: member.permissions || [],
    permission_matrix:
      member.permission_matrix ||
      createBlankMatrix(constraints.permission_matrix_sections),
  });

  const conflict = getConflictMessage(form.permissions);

  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") ref(form);
      else ref.current = form;
    }
  }, [form, ref]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Member name</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            placeholder="Enter member name"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Username</span>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            placeholder="Enter username"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Member ID</span>
          <input
            value={form.member_id}
            onChange={(e) => setForm({ ...form, member_id: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            placeholder="Enter member ID"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </label>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Role: Agent (fixed)</p>
        {!canTeamAccess ? (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100">
            Team/agent access management is a Premium feature. Upgrade to edit permissions and access controls.
          </div>
        ) : null}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">Permission matrix</h4>
          <span className="text-sm text-slate-500 dark:text-slate-400">view/edit per module</span>
        </div>
        <PermissionMatrixEditor
          matrix={form.permission_matrix}
          sections={constraints.permission_matrix_sections}
          onChange={(permission_matrix) =>
            setForm({ ...form, permission_matrix })
          }
          disabled={!canTeamAccess}
        />
      </div>

      <PermissionSelector
        permissions={form.permissions}
        validPermissions={constraints.valid_permissions}
        onChange={(permissions) => setForm({ ...form, permissions })}
        conflict={conflict}
        disabled={!canTeamAccess}
      />

      {conflict ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-800 dark:text-rose-100">
          {conflict}
        </div>
      ) : null}
    </div>
  );
});
