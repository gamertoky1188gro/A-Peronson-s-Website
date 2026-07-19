import {
  k as ae,
  a9 as re,
  r as x,
  g as le,
  j as e,
  N as ne,
  S as ie,
  l as de,
  d as v,
} from "./index-CNnTWoea.js";
import { A as oe } from "./AccessDeniedState-CLpnljeA.js";
const N = "/org/members";
function me(a = []) {
  const t = a
      .map((d) => {
        const m = String(d.member_id || "").match(/^AGT-?(\d+)$/i);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter((d) => d > 0),
    o = t.length ? Math.max(...t) + 1 : 1;
  return `AGT-${String(o).padStart(3, "0")}`;
}
const q = {
  name: "",
  username: "",
  member_id: "",
  role: "agent",
  password: "",
  permissions: [],
  permission_matrix: {},
};
function V(...a) {
  return a.filter(Boolean).join(" ");
}
function ce(a) {
  return a === "active"
    ? "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-300"
    : "bg-rose-500/15 text-rose-600 ring-1 ring-rose-500/20 dark:text-rose-300";
}
function R(a = []) {
  return a.reduce((t, o) => ({ ...t, [o]: { view: !1, edit: !1 } }), {});
}
function xe({ permissions: a }) {
  return e.jsx("div", {
    className: "flex flex-wrap gap-1.5",
    children: a.length
      ? a.map((t) =>
          e.jsx(
            "span",
            {
              className:
                "rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:text-sky-200",
              children: t,
            },
            t,
          ),
        )
      : e.jsx("span", { className: "text-xs text-slate-400", children: "—" }),
  });
}
function G({ title: a, children: t, onClose: o, footer: d }) {
  return e.jsx("div", {
    className:
      "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm",
    children: e.jsxs("div", {
      className:
        "w-full max-w-4xl rounded-3xl border border-white/10 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950",
      children: [
        e.jsxs("div", {
          className:
            "flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800",
          children: [
            e.jsx("h3", {
              className: "text-xl font-semibold text-slate-900 dark:text-white",
              children: a,
            }),
            e.jsx("button", {
              type: "button",
              onClick: o,
              className:
                "rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white",
              "aria-label": "Close modal",
              children: "✕",
            }),
          ],
        }),
        e.jsx("div", {
          "data-lenis-prevent": !0,
          className: "max-h-[75vh] overflow-y-auto px-6 py-5",
          children: t,
        }),
        d
          ? e.jsx("div", {
              className:
                "border-t border-slate-200 px-6 py-4 dark:border-slate-800",
              children: d,
            })
          : null,
      ],
    }),
  });
}
function A({ title: a, value: t }) {
  return e.jsxs("div", {
    className:
      "rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40",
    children: [
      e.jsx("div", {
        className:
          "text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300",
        children: a,
      }),
      e.jsx("div", {
        className: "mt-2 text-sm font-medium text-slate-900 dark:text-white",
        children: t,
      }),
    ],
  });
}
function S({ label: a, onClick: t, variant: o = "default" }) {
  const d = {
    default:
      "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:text-sky-300",
    warning:
      "border-amber-500/20 bg-amber-500/10 text-amber-800 hover:border-amber-500/40 dark:text-amber-100",
    danger:
      "border-rose-500/20 bg-rose-500/10 text-rose-800 hover:border-rose-500/40 dark:text-rose-100",
  };
  return e.jsx("button", {
    type: "button",
    onClick: t,
    className: V(
      "rounded-xl border px-3.5 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md",
      d[o],
    ),
    children: a,
  });
}
function he() {
  var z, B;
  const a = ae(),
    t = re(a, "team_access_management"),
    o =
      ((B =
        (z = a == null ? void 0 : a.capabilities) == null
          ? void 0
          : z.members) == null
        ? void 0
        : B.manage) !== !1,
    [d, m] = x.useState(""),
    [i, l] = x.useState([]),
    [n, k] = x.useState({
      free_member_limit: 10,
      valid_permissions: [],
      permission_conflicts: [],
      permission_matrix_sections: [],
    }),
    [u, T] = x.useState(!1),
    [E, J] = x.useState(!0),
    [L, p] = x.useState(""),
    [K, D] = x.useState(!1),
    [U, h] = x.useState(""),
    [Q, w] = x.useState(!1),
    [b, f] = x.useState(q),
    [_, C] = x.useState(null),
    y = le(),
    P = x.useRef(null);
  async function M() {
    (T(!0), p(""), D(!1));
    try {
      const s = await v(N, { token: y }),
        r = s.constraints || n;
      (k(r),
        l(s.members || []),
        f((c) => ({
          ...c,
          permission_matrix: Object.keys(c.permission_matrix || {}).length
            ? c.permission_matrix
            : R(r.permission_matrix_sections || []),
        })));
    } catch (s) {
      (D(s.status === 403), p(s.message));
    } finally {
      T(!1);
    }
  }
  (x.useEffect(() => {
    M();
  }, []),
    x.useEffect(() => {
      E && !u && J(!1);
    }, [E, u]));
  const $ = x.useMemo(() => {
      const s = d.toLowerCase().trim();
      return s
        ? i.filter((r) =>
            [r.name, r.username, r.member_id, r.role, r.status]
              .join(" ")
              .toLowerCase()
              .includes(s),
          )
        : i;
    }, [i, d]),
    W = String(n.plan || "free").toUpperCase(),
    F = Number(n.premium_member_limit),
    X = Number.isFinite(F)
      ? F >= 999
        ? "Unlimited"
        : n.premium_member_limit
      : "--";
  function j(s) {
    const r = n.permission_conflicts.find(
      ([c, g]) => s.includes(c) && s.includes(g),
    );
    return r
      ? `Permission conflict: ${r[0]} cannot be combined with ${r[1]}.`
      : "";
  }
  async function I(s) {
    if ((s.preventDefault(), p(""), h(""), t)) {
      const r = j(b.permissions);
      if (r) {
        p(r);
        return;
      }
    }
    try {
      const r = t
          ? b
          : Object.fromEntries(
              Object.entries(b).filter(
                ([te]) => !["permissions", "permission_matrix"].includes(te),
              ),
            ),
        c = await v(N, { method: "POST", token: y, body: r }),
        g = (c == null ? void 0 : c.member) || null,
        se =
          g != null && g.temporary_password
            ? ` Temporary password: ${g.temporary_password}`
            : "";
      (h(`Member created.${se}`),
        f({ ...q, permission_matrix: R(n.permission_matrix_sections) }),
        w(!1),
        await M());
    } catch (r) {
      p(r.message);
    }
  }
  async function Z(s) {
    (p(""), h(""));
    try {
      const r = await v(`${N}/${s}/reset-password`, {
        method: "POST",
        token: y,
      });
      h(`Temporary password for ${r.member.name}: ${r.temporary_password}`);
    } catch (r) {
      p(r.message);
    }
  }
  async function O(s, r = !1) {
    (p(""), h(""));
    try {
      (await v(`${N}/${s}?remove=${r ? "true" : "false"}`, {
        method: "DELETE",
        token: y,
      }),
        h(r ? "Member removed." : "Member deactivated."),
        await M());
    } catch (c) {
      p(c.message);
    }
  }
  async function ee(s, r) {
    if (t) {
      const c = j(r.permissions);
      if (c) {
        p(c);
        return;
      }
    }
    (p(""), h(""));
    try {
      const c = t
        ? r
        : Object.fromEntries(
            Object.entries(r).filter(
              ([g]) => !["permissions", "permission_matrix"].includes(g),
            ),
          );
      (await v(`${N}/${s}`, { method: "PUT", token: y, body: c }),
        h("Member updated."),
        C(null),
        await M());
    } catch (c) {
      p(c.message);
    }
  }
  return E
    ? e.jsx(ne, { fill: !0 })
    : K || !o
      ? e.jsx("div", {
          className:
            "min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-sky-950/40 dark:text-white",
          children: e.jsx("div", {
            className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
            children: e.jsx(oe, {
              message:
                "You do not have permission to manage members for this organization.",
            }),
          }),
        })
      : e.jsxs("div", {
          className:
            "min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-sky-950/40 dark:text-white",
          children: [
            e.jsx("div", {
              className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
              children: e.jsxs("div", {
                className:
                  "rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/80",
                children: [
                  e.jsxs("div", {
                    className:
                      "flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsx("div", {
                            className:
                              "mb-2 inline-flex rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-200",
                            children: "/member-management",
                          }),
                          e.jsx("h1", {
                            className:
                              "text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl",
                            children: "Member Management",
                          }),
                          e.jsx("p", {
                            className:
                              "mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base",
                            children: "Manage sub-accounts and permissions",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex flex-col gap-3 sm:flex-row",
                        children: [
                          e.jsxs("div", {
                            className: "relative w-full sm:w-80",
                            children: [
                              e.jsx("input", {
                                value: d,
                                onChange: (s) => m(s.target.value),
                                placeholder: "Search members",
                                className:
                                  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white",
                              }),
                              e.jsx("span", {
                                className:
                                  "pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400",
                                children: "⌕",
                              }),
                            ],
                          }),
                          e.jsx("button", {
                            type: "button",
                            onClick: () => {
                              (p(""),
                                h(""),
                                f((s) => ({ ...s, member_id: me(i) })),
                                w(!0));
                            },
                            className:
                              "inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110",
                            children: "+ Add New Member",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "mt-6 grid gap-3 md:grid-cols-3",
                    children: [
                      e.jsx(A, {
                        title: "Plan",
                        value: `${W} • Free limit: ${n.free_member_limit} • Premium limit: ${X}`,
                      }),
                      e.jsx(A, {
                        title: "Team access",
                        value: t
                          ? "Premium permissions enabled"
                          : "Premium permissions locked",
                      }),
                      e.jsx(A, {
                        title: "Members",
                        value: `${$.length} shown / ${i.length} total`,
                      }),
                    ],
                  }),
                  t
                    ? null
                    : e.jsx("div", {
                        className:
                          "mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100",
                        children:
                          "Team/agent access management is a Premium feature. Upgrade to edit permissions and access controls.",
                      }),
                  L
                    ? e.jsx("div", {
                        className:
                          "mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-800 dark:text-rose-100",
                        children: L,
                      })
                    : null,
                  U
                    ? e.jsx("div", {
                        className:
                          "mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-100",
                        children: U,
                      })
                    : null,
                  e.jsx(ie, {
                    as: "section",
                    children: e.jsx("div", {
                      className:
                        "mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
                      children: e.jsx("div", {
                        className: "overflow-x-auto",
                        children: e.jsxs("table", {
                          className:
                            "min-w-full divide-y divide-slate-200 dark:divide-slate-800",
                          children: [
                            e.jsx("thead", {
                              className: "bg-slate-50 dark:bg-slate-900/70",
                              children: e.jsx("tr", {
                                children: [
                                  "Name",
                                  "Username",
                                  "Member ID",
                                  "Role",
                                  "Status",
                                  "Actions",
                                ].map((s) =>
                                  e.jsx(
                                    "th",
                                    {
                                      className:
                                        "px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400",
                                      children: s,
                                    },
                                    s,
                                  ),
                                ),
                              }),
                            }),
                            e.jsx("tbody", {
                              className:
                                "divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950",
                              children: u
                                ? e.jsx("tr", {
                                    children: e.jsx("td", {
                                      colSpan: 6,
                                      className: "px-6 py-12 text-center",
                                      children: e.jsx(de, {
                                        color: "#3b00ff",
                                        size: "large",
                                        style: { fontSize: "40px" },
                                        text: "",
                                        textColor: "",
                                      }),
                                    }),
                                  })
                                : $.length
                                  ? $.map((s) =>
                                      e.jsxs(
                                        "tr",
                                        {
                                          className:
                                            "transition hover:bg-sky-50/50 dark:hover:bg-slate-900/60",
                                          children: [
                                            e.jsx("td", {
                                              className: "px-6 py-5",
                                              children: e.jsxs("div", {
                                                children: [
                                                  e.jsx("div", {
                                                    className:
                                                      "font-semibold text-slate-900 dark:text-white",
                                                    children: s.name,
                                                  }),
                                                  e.jsx("div", {
                                                    className: "mt-1",
                                                    children: e.jsx(xe, {
                                                      permissions:
                                                        s.permissions || [],
                                                    }),
                                                  }),
                                                ],
                                              }),
                                            }),
                                            e.jsx("td", {
                                              className:
                                                "px-6 py-5 text-sm text-slate-700 dark:text-slate-200",
                                              children: s.username,
                                            }),
                                            e.jsx("td", {
                                              className:
                                                "px-6 py-5 text-sm font-medium text-slate-700 dark:text-slate-200",
                                              children:
                                                s.member_id || s.account_id,
                                            }),
                                            e.jsx("td", {
                                              className:
                                                "px-6 py-5 text-sm text-slate-700 dark:text-slate-200",
                                              children: s.role,
                                            }),
                                            e.jsx("td", {
                                              className: "px-6 py-5",
                                              children: e.jsx("span", {
                                                className: V(
                                                  "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
                                                  ce(s.status),
                                                ),
                                                children: s.status,
                                              }),
                                            }),
                                            e.jsx("td", {
                                              className: "px-6 py-5",
                                              children: e.jsxs("div", {
                                                className:
                                                  "flex flex-wrap gap-2",
                                                children: [
                                                  e.jsx(S, {
                                                    label: "Edit",
                                                    onClick: () => C(s),
                                                  }),
                                                  e.jsx(S, {
                                                    label: "Reset",
                                                    onClick: () => Z(s.id),
                                                  }),
                                                  e.jsx(S, {
                                                    label: "Deactivate",
                                                    onClick: () => O(s.id, !1),
                                                    variant: "warning",
                                                  }),
                                                  e.jsx(S, {
                                                    label: "Remove",
                                                    onClick: () => O(s.id, !0),
                                                    variant: "danger",
                                                  }),
                                                ],
                                              }),
                                            }),
                                          ],
                                        },
                                        s.id,
                                      ),
                                    )
                                  : e.jsx("tr", {
                                      children: e.jsx("td", {
                                        colSpan: 6,
                                        className:
                                          "px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400",
                                        children: "No members found.",
                                      }),
                                    }),
                            }),
                          ],
                        }),
                      }),
                    }),
                  }),
                ],
              }),
            }),
            Q &&
              e.jsx(G, {
                title: "Create member",
                onClose: () => w(!1),
                footer: e.jsxs("div", {
                  className: "flex flex-col gap-3 sm:flex-row sm:justify-end",
                  children: [
                    e.jsx("button", {
                      type: "button",
                      onClick: () => w(!1),
                      className:
                        "rounded-2xl border border-slate-200 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900",
                      children: "Close",
                    }),
                    e.jsx("button", {
                      type: "button",
                      onClick: I,
                      className:
                        "rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110",
                      children: "Create",
                    }),
                  ],
                }),
                children: e.jsxs("form", {
                  className: "space-y-6",
                  onSubmit: I,
                  children: [
                    e.jsxs("div", {
                      className: "grid gap-4 md:grid-cols-2",
                      children: [
                        e.jsxs("label", {
                          className: "space-y-2",
                          children: [
                            e.jsx("span", {
                              className:
                                "text-sm font-medium text-slate-700 dark:text-slate-200",
                              children: "Member name",
                            }),
                            e.jsx("input", {
                              value: b.name,
                              onChange: (s) =>
                                f({ ...b, name: s.target.value }),
                              className:
                                "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white",
                              placeholder: "Enter member name",
                            }),
                          ],
                        }),
                        e.jsxs("label", {
                          className: "space-y-2",
                          children: [
                            e.jsx("span", {
                              className:
                                "text-sm font-medium text-slate-700 dark:text-slate-200",
                              children: "Unique username",
                            }),
                            e.jsx("input", {
                              value: b.username,
                              onChange: (s) =>
                                f({ ...b, username: s.target.value }),
                              className:
                                "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white",
                              placeholder: "Enter username",
                            }),
                          ],
                        }),
                        e.jsxs("label", {
                          className: "space-y-2",
                          children: [
                            e.jsx("span", {
                              className:
                                "text-sm font-medium text-slate-700 dark:text-slate-200",
                              children: "Member ID (auto-generated)",
                            }),
                            e.jsx("div", {
                              className:
                                "w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-mono text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
                              children: b.member_id || "AGT-001",
                            }),
                          ],
                        }),
                        e.jsxs("label", {
                          className: "space-y-2",
                          children: [
                            e.jsx("span", {
                              className:
                                "text-sm font-medium text-slate-700 dark:text-slate-200",
                              children: "Initial password (optional)",
                            }),
                            e.jsx("input", {
                              value: b.password,
                              onChange: (s) =>
                                f({ ...b, password: s.target.value }),
                              className:
                                "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white",
                              placeholder: "Leave empty to auto-generate",
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className:
                        "rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/40",
                      children: [
                        e.jsx("p", {
                          className:
                            "text-sm font-medium text-slate-700 dark:text-slate-200",
                          children:
                            "Role is fixed to Agent. Agents login using their Member ID.",
                        }),
                        e.jsx("p", {
                          className:
                            "mt-1 text-sm text-slate-500 dark:text-slate-400",
                          children: "Role: Agent (fixed)",
                        }),
                        t
                          ? null
                          : e.jsx("div", {
                              className:
                                "mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100",
                              children:
                                "Team/agent access management is a Premium feature. Upgrade to edit permissions and access controls.",
                            }),
                      ],
                    }),
                    e.jsxs("div", {
                      children: [
                        e.jsxs("div", {
                          className: "mb-3 flex items-center justify-between",
                          children: [
                            e.jsx("h4", {
                              className:
                                "text-base font-semibold text-slate-900 dark:text-white",
                              children: "Permission matrix",
                            }),
                            e.jsx("span", {
                              className:
                                "text-sm text-slate-500 dark:text-slate-400",
                              children: "view/edit per module",
                            }),
                          ],
                        }),
                        e.jsx(H, {
                          matrix: b.permission_matrix,
                          sections: n.permission_matrix_sections,
                          onChange: (s) => f({ ...b, permission_matrix: s }),
                          disabled: !t,
                        }),
                      ],
                    }),
                    e.jsx(Y, {
                      permissions: b.permissions,
                      validPermissions: n.valid_permissions,
                      onChange: (s) => f({ ...b, permissions: s }),
                      conflict: j(b.permissions),
                      disabled: !t,
                    }),
                    j(b.permissions)
                      ? e.jsx("div", {
                          className:
                            "rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-800 dark:text-rose-100",
                          children: j(b.permissions),
                        })
                      : null,
                  ],
                }),
              }),
            !!_ &&
              e.jsx(G, {
                title: `Edit member: ${_.name}`,
                onClose: () => C(null),
                footer: e.jsxs("div", {
                  className: "flex flex-col gap-3 sm:flex-row sm:justify-end",
                  children: [
                    e.jsx("button", {
                      type: "button",
                      onClick: () => C(null),
                      className:
                        "rounded-2xl border border-slate-200 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900",
                      children: "Close",
                    }),
                    e.jsx("button", {
                      type: "button",
                      onClick: () => {
                        P.current && ee(_.id, P.current);
                      },
                      className:
                        "rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110",
                      children: "Save changes",
                    }),
                  ],
                }),
                children: e.jsx(be, {
                  ref: P,
                  member: _,
                  constraints: n,
                  getConflictMessage: j,
                  canTeamAccess: t,
                }),
              }),
          ],
        });
}
function Y({
  permissions: a,
  validPermissions: t,
  onChange: o,
  conflict: d,
  disabled: m = !1,
}) {
  return e.jsxs("div", {
    className: m ? " opacity-60" : "",
    children: [
      e.jsx("div", {
        className:
          "mb-3 text-base font-semibold text-slate-900 dark:text-white",
        children: "Permissions",
      }),
      e.jsx("div", {
        className: "grid grid-cols-2 gap-3",
        children: t.map((i) =>
          e.jsxs(
            "label",
            {
              className:
                "flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-sky-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200",
              children: [
                e.jsx("input", {
                  type: "checkbox",
                  checked: a.includes(i),
                  disabled: m,
                  onChange: (l) => {
                    const n = l.target.checked
                      ? [...a, i]
                      : a.filter((k) => k !== i);
                    o(n);
                  },
                  className:
                    "h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500",
                }),
                i,
              ],
            },
            i,
          ),
        ),
      }),
      !!d &&
        e.jsx("div", {
          className:
            "mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-800 dark:text-rose-100",
          children: d,
        }),
    ],
  });
}
function H({ matrix: a, sections: t, onChange: o, disabled: d = !1 }) {
  return e.jsx("div", {
    className: d ? " opacity-60" : "",
    children: e.jsx("div", {
      className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
      children: t.map((m) => {
        const i = (a == null ? void 0 : a[m]) || { view: !1, edit: !1 },
          l = m === "members";
        return e.jsxs(
          "div",
          {
            className:
              "rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60",
            children: [
              e.jsxs("div", {
                className: "mb-3 flex items-center justify-between",
                children: [
                  e.jsx("span", {
                    className:
                      "text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200",
                    children: m,
                  }),
                  l
                    ? e.jsx("span", {
                        className:
                          "rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                        children: "Forced false",
                      })
                    : null,
                ],
              }),
              e.jsxs("div", {
                className: "grid grid-cols-2 gap-2",
                children: [
                  e.jsxs("label", {
                    className:
                      "flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-sky-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200",
                    children: [
                      e.jsx("input", {
                        type: "checkbox",
                        checked: l ? !1 : !!i.view,
                        disabled: d || l,
                        onChange: (n) =>
                          o({ ...a, [m]: { ...i, view: n.target.checked } }),
                        className:
                          "h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500",
                      }),
                      "View",
                    ],
                  }),
                  e.jsxs("label", {
                    className:
                      "flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-sky-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200",
                    children: [
                      e.jsx("input", {
                        type: "checkbox",
                        checked: l ? !1 : !!i.edit,
                        disabled: d || l,
                        onChange: (n) =>
                          o({ ...a, [m]: { ...i, edit: n.target.checked } }),
                        className:
                          "h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500",
                      }),
                      "Edit",
                    ],
                  }),
                ],
              }),
            ],
          },
          m,
        );
      }),
    }),
  });
}
const be = x.forwardRef(function (
  { member: t, constraints: o, getConflictMessage: d, canTeamAccess: m },
  i,
) {
  const [l, n] = x.useState({
      name: t.name || "",
      username: t.username || "",
      member_id: t.member_id || t.account_id || "",
      role: "agent",
      status: t.status || "active",
      permissions: t.permissions || [],
      permission_matrix: t.permission_matrix || R(o.permission_matrix_sections),
    }),
    k = d(l.permissions);
  return (
    x.useEffect(() => {
      i && (typeof i == "function" ? i(l) : (i.current = l));
    }, [l, i]),
    e.jsxs("div", {
      className: "space-y-6",
      children: [
        e.jsxs("div", {
          className: "grid gap-4 md:grid-cols-2",
          children: [
            e.jsxs("label", {
              className: "space-y-2",
              children: [
                e.jsx("span", {
                  className:
                    "text-sm font-medium text-slate-700 dark:text-slate-200",
                  children: "Member name",
                }),
                e.jsx("input", {
                  value: l.name,
                  onChange: (u) => n({ ...l, name: u.target.value }),
                  className:
                    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white",
                  placeholder: "Enter member name",
                }),
              ],
            }),
            e.jsxs("label", {
              className: "space-y-2",
              children: [
                e.jsx("span", {
                  className:
                    "text-sm font-medium text-slate-700 dark:text-slate-200",
                  children: "Username",
                }),
                e.jsx("input", {
                  value: l.username,
                  onChange: (u) => n({ ...l, username: u.target.value }),
                  className:
                    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white",
                  placeholder: "Enter username",
                }),
              ],
            }),
            e.jsxs("label", {
              className: "space-y-2",
              children: [
                e.jsx("span", {
                  className:
                    "text-sm font-medium text-slate-700 dark:text-slate-200",
                  children: "Member ID",
                }),
                e.jsx("input", {
                  value: l.member_id,
                  onChange: (u) => n({ ...l, member_id: u.target.value }),
                  className:
                    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white",
                  placeholder: "Enter member ID",
                }),
              ],
            }),
            e.jsxs("label", {
              className: "space-y-2",
              children: [
                e.jsx("span", {
                  className:
                    "text-sm font-medium text-slate-700 dark:text-slate-200",
                  children: "Status",
                }),
                e.jsxs("select", {
                  value: l.status,
                  onChange: (u) => n({ ...l, status: u.target.value }),
                  className:
                    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white",
                  children: [
                    e.jsx("option", { value: "active", children: "active" }),
                    e.jsx("option", {
                      value: "inactive",
                      children: "inactive",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        e.jsxs("div", {
          className:
            "rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/40",
          children: [
            e.jsx("p", {
              className:
                "text-sm font-medium text-slate-700 dark:text-slate-200",
              children: "Role: Agent (fixed)",
            }),
            m
              ? null
              : e.jsx("div", {
                  className:
                    "mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100",
                  children:
                    "Team/agent access management is a Premium feature. Upgrade to edit permissions and access controls.",
                }),
          ],
        }),
        e.jsxs("div", {
          children: [
            e.jsxs("div", {
              className: "mb-3 flex items-center justify-between",
              children: [
                e.jsx("h4", {
                  className:
                    "text-base font-semibold text-slate-900 dark:text-white",
                  children: "Permission matrix",
                }),
                e.jsx("span", {
                  className: "text-sm text-slate-500 dark:text-slate-400",
                  children: "view/edit per module",
                }),
              ],
            }),
            e.jsx(H, {
              matrix: l.permission_matrix,
              sections: o.permission_matrix_sections,
              onChange: (u) => n({ ...l, permission_matrix: u }),
              disabled: !m,
            }),
          ],
        }),
        e.jsx(Y, {
          permissions: l.permissions,
          validPermissions: o.valid_permissions,
          onChange: (u) => n({ ...l, permissions: u }),
          conflict: k,
          disabled: !m,
        }),
        k
          ? e.jsx("div", {
              className:
                "rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-800 dark:text-rose-100",
              children: k,
            })
          : null,
      ],
    })
  );
});
export { he as default };
