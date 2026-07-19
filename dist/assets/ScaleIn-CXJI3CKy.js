import {
  r as m,
  g as ue,
  k as ge,
  n as he,
  d as h,
  j as e,
  l as pe,
  m as E,
  b as be,
} from "./index-CNnTWoea.js";
const fe = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "negotiating", label: "Negotiating" },
  { key: "sample_sent", label: "Sample Sent" },
  { key: "order_confirmed", label: "Order Confirmed" },
  { key: "closed", label: "Closed" },
];
function v(x) {
  if (!x) return "";
  const p = new Date(x);
  return Number.isNaN(p.getTime()) ? String(x) : p.toLocaleString();
}
function ne(x = "") {
  return x === "breached"
    ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200"
    : x === "warning"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200";
}
function ie(x) {
  if (!x) return "No SLA";
  const p = new Date(x).getTime();
  if (Number.isNaN(p)) return "No SLA";
  const g = Math.floor((p - Date.now()) / 6e4);
  return g >= 0 ? `${g}m left` : `${Math.abs(g)}m overdue`;
}
function je({
  title: x = "Leads (CRM)",
  allowAssign: p = !0,
  showOperations: g = !0,
}) {
  var z, H, Q, Y, V, G, J, K, W, X, Z, ee;
  const r = m.useMemo(() => ue(), []),
    L = !!(
      (Q =
        (H = (z = ge()) == null ? void 0 : z.capabilities) == null
          ? void 0
          : H.leads) != null && Q.assign
    ),
    R = he(),
    [N, I] = m.useState(!1),
    [A, o] = m.useState(""),
    [B, M] = m.useState([]),
    [l, re] = m.useState(""),
    [t, y] = m.useState(null),
    [S, T] = m.useState({}),
    [F, D] = m.useState(""),
    [w, u] = m.useState(!1),
    [k, $] = m.useState({
      queue: [],
      team_queues: [],
      assignments: [],
      agent_capacity: [],
      escalations: [],
      workload: [],
    }),
    _ = m.useCallback(async () => {
      if (r) {
        (I(!0), o(""));
        try {
          const s = await h("/leads", { token: r }),
            a = Array.isArray(s == null ? void 0 : s.items) ? s.items : [];
          let i = [];
          if (g)
            try {
              const [n, j, f] = await Promise.all([
                h("/org/ops/queue", { token: r }),
                h("/org/ops/escalations", { token: r }).catch(() => ({
                  items: [],
                })),
                h("/org/ops/workload", { token: r }).catch(() => ({
                  items: [],
                })),
              ]);
              ((i = Array.isArray(n == null ? void 0 : n.queue) ? n.queue : []),
                $({
                  queue: i,
                  team_queues: (n == null ? void 0 : n.team_queues) || [],
                  assignments: (n == null ? void 0 : n.assignments) || [],
                  agent_capacity: (n == null ? void 0 : n.agent_capacity) || [],
                  escalations: (j == null ? void 0 : j.items) || [],
                  workload: (f == null ? void 0 : f.items) || [],
                }));
            } catch {
              $({
                queue: [],
                team_queues: [],
                assignments: [],
                agent_capacity: [],
                escalations: [],
                workload: [],
              });
            }
          const c = new Map(i.map((n) => [n.id, n]));
          M(a.map((n) => ({ ...n, ...(c.get(n.id) || {}) })));
          const b = new Set();
          if (
            (a.forEach((n) => {
              (n.counterparty_id && b.add(String(n.counterparty_id)),
                n.assigned_agent_id && b.add(String(n.assigned_agent_id)));
            }),
            b.size > 0)
          ) {
            const n = await h("/users/lookup", {
                method: "POST",
                token: r,
                body: { ids: [...b] },
              }),
              j = ((n == null ? void 0 : n.users) || []).reduce(
                (f, C) => ((f[C.id] = C), f),
                {},
              );
            T(j);
          } else T({});
        } catch (s) {
          (M([]), T({}), o(s.message || "Failed to load leads"));
        } finally {
          I(!1);
        }
      }
    }, [g, r]),
    q = m.useCallback(
      async (s) => {
        if (!(!r || !s)) {
          (u(!0), o(""));
          try {
            const a = await h(`/leads/${encodeURIComponent(s)}`, { token: r });
            y(a);
          } catch (a) {
            (y(null), o(a.message || "Failed to load lead details"));
          } finally {
            u(!1);
          }
        }
      },
      [r],
    );
  (m.useEffect(() => {
    _();
  }, [_]),
    m.useEffect(() => {
      if (!l) {
        (y(null), D(""));
        return;
      }
      q(l);
    }, [q, l]));
  async function P(s) {
    if (!(!r || !l)) {
      (u(!0), o(""));
      try {
        const a = await h(`/leads/${encodeURIComponent(l)}`, {
          method: "PATCH",
          token: r,
          body: s,
        });
        (M((i) => i.map((c) => (c.id === a.id ? { ...c, ...a } : c))),
          y((i) => i && { ...i, ...a }));
      } catch (a) {
        o(a.message || "Failed to update lead");
      } finally {
        u(!1);
      }
    }
  }
  async function le() {
    if (!r || !l) return;
    const s = F.trim();
    if (s) {
      (u(!0), o(""));
      try {
        const a = await h(`/leads/${encodeURIComponent(l)}/notes`, {
          method: "POST",
          token: r,
          body: { note: s },
        });
        (y((i) => i && { ...i, notes: [a, ...(i.notes || [])] }), D(""));
      } catch (a) {
        o(a.message || "Failed to add note");
      } finally {
        u(!1);
      }
    }
  }
  async function de() {
    if (!r || !l) return;
    const s = window.prompt(
      "Reminder date/time (ISO or YYYY-MM-DD HH:mm)",
      new Date(Date.now() + 1440 * 60 * 1e3).toISOString(),
    );
    if (!s) return;
    const a =
      window.prompt("Reminder note (optional)", "Follow up") || "Follow up";
    (u(!0), o(""));
    try {
      const i = await h(`/leads/${encodeURIComponent(l)}/reminders`, {
        method: "POST",
        token: r,
        body: { remind_at: s, message: a },
      });
      y((c) => c && { ...c, reminders: [...(c.reminders || []), i] });
    } catch (i) {
      o(i.message || "Failed to create reminder");
    } finally {
      u(!1);
    }
  }
  async function oe() {
    if (r) {
      (u(!0), o(""));
      try {
        (await h("/org/ops/rebalance", {
          method: "POST",
          token: r,
          body: { strategy: "least_loaded" },
        }),
          await _(),
          l && (await q(l)));
      } catch (s) {
        o(s.message || "Failed to rebalance queue");
      } finally {
        u(!1);
      }
    }
  }
  async function ce(s) {
    if (!r || !s) return;
    const a = window.prompt("Escalation reason", "SLA risk") || "SLA risk";
    (u(!0), o(""));
    try {
      const i = await h(`/org/ops/escalate/${encodeURIComponent(s)}`, {
        method: "POST",
        token: r,
        body: { reason: a },
      });
      (M((c) => c.map((b) => (b.id === i.id ? { ...b, ...i } : b))),
        y((c) => c && { ...c, ...i }),
        await _());
    } catch (i) {
      o(i.message || "Failed to escalate lead");
    } finally {
      u(!1);
    }
  }
  async function me(s) {
    if (!(!r || !s)) {
      (u(!0), o(""));
      try {
        (await h(`/org/ops/escalations/${encodeURIComponent(s)}/resolve`, {
          method: "POST",
          token: r,
          body: { resolution_note: "Resolved from CRM dashboard" },
        }),
          await _());
      } catch (a) {
        o(a.message || "Failed to resolve escalation");
      } finally {
        u(!1);
      }
    }
  }
  const O = m.useMemo(
      () =>
        (k.assignments || [])
          .filter((s) => String(s.lead_id || "") === String(l || ""))
          .slice(0, 8),
      [k.assignments, l],
    ),
    xe = m.useMemo(
      () =>
        (k.escalations || []).find(
          (s) => String(s.lead_id || "") === String(l || "") && !s.resolved_at,
        ),
      [k.escalations, l],
    ),
    d = t != null && t.counterparty_id ? S[t.counterparty_id] : null,
    U = t != null && t.assigned_agent_id ? S[t.assigned_agent_id] : null;
  return e.jsx("div", {
    className:
      "rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10",
    children: e.jsxs("div", {
      className: "flex flex-col gap-4 lg:flex-row",
      children: [
        e.jsxs("div", {
          className: "lg:w-2/5",
          children: [
            e.jsxs("div", {
              className: "flex items-center justify-between gap-3 mb-3",
              children: [
                e.jsx("h3", { className: "font-semibold", children: x }),
                e.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    g
                      ? e.jsx("button", {
                          type: "button",
                          onClick: oe,
                          className:
                            "px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98]",
                          disabled: N || w,
                          children: "Rebalance",
                        })
                      : null,
                    e.jsx("button", {
                      type: "button",
                      onClick: _,
                      className:
                        "px-3 py-1.5 text-sm rounded-md bg-white shadow-borderless ring-1 ring-slate-200/60 hover:bg-slate-50 active:scale-[0.98] dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10 dark:hover:bg-white/8",
                      disabled: N,
                      children: "Refresh",
                    }),
                  ],
                }),
              ],
            }),
            N
              ? e.jsx(pe, {
                  color: "#3b00ff",
                  size: "large",
                  style: { fontSize: "40px" },
                  text: "",
                  textColor: "",
                })
              : null,
            A
              ? e.jsx("div", {
                  className: "mt-2 text-sm text-rose-600",
                  children: A,
                })
              : null,
            e.jsxs("div", {
              "data-lenis-prevent": !0,
              className: "mt-3 space-y-2 max-h-[520px] overflow-auto pr-1",
              children: [
                B.length === 0 && !N
                  ? e.jsx("div", {
                      className: "text-sm text-slate-500",
                      children:
                        "No leads yet. Leads are created automatically when chats start.",
                    })
                  : null,
                B.map((s) => {
                  var n, j, f, C, se, te, ae;
                  const a = s.counterparty_id ? S[s.counterparty_id] : null,
                    i =
                      (a == null ? void 0 : a.name) ||
                      s.counterparty_id ||
                      "Counterparty",
                    c = s.id === l,
                    b =
                      ((n = a == null ? void 0 : a.profile) == null
                        ? void 0
                        : n.profile_image) ||
                      (a == null ? void 0 : a.avatar_url) ||
                      (a == null ? void 0 : a.avatar) ||
                      "";
                  return e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => re(s.id),
                      className: [
                        "w-full text-left rounded-lg bg-white shadow-borderless ring-1 ring-slate-200/60 px-3 py-2 transition dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10",
                        c
                          ? "bg-gtBlue/10 ring-gtBlue/40 dark:bg-gtBlue/15 dark:ring-gtBlue/40"
                          : "hover:bg-slate-50 dark:hover:bg-white/8",
                      ].join(" "),
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between gap-2",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-2 min-w-0",
                              children: [
                                b
                                  ? e.jsx(E.div, {
                                      initial: { opacity: 0, scale: 0.9 },
                                      whileInView: { opacity: 1, scale: 1 },
                                      viewport: { once: !0 },
                                      transition: {
                                        duration: 0.35,
                                        ease: [0.16, 1, 0.3, 1],
                                      },
                                      className: "h-8 w-8 shrink-0",
                                      children: e.jsx("img", {
                                        src: b,
                                        alt: i,
                                        className:
                                          "h-8 w-8 rounded-full object-cover",
                                      }),
                                    })
                                  : e.jsx("div", {
                                      className:
                                        "h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200",
                                      children: String(i)
                                        .slice(0, 2)
                                        .toUpperCase(),
                                    }),
                                e.jsx("p", {
                                  className: "font-medium truncate",
                                  children: i,
                                }),
                              ],
                            }),
                            e.jsx("span", {
                              className:
                                "text-[11px] uppercase tracking-widest text-slate-500",
                              children: (s.status || "new").replace(/_/g, " "),
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "mt-1 flex items-center gap-2",
                          children: [
                            ((j = s == null ? void 0 : s.sla) != null &&
                              j.status) ||
                            ((f = s == null ? void 0 : s.sla) != null &&
                              f.deadline_at)
                              ? e.jsxs("span", {
                                  className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${ne(((C = s == null ? void 0 : s.sla) == null ? void 0 : C.status) || "healthy")}`,
                                  children: [
                                    "SLA ",
                                    ((se = s == null ? void 0 : s.sla) == null
                                      ? void 0
                                      : se.status) || "active",
                                    " ·",
                                    " ",
                                    ie(
                                      (te = s == null ? void 0 : s.sla) == null
                                        ? void 0
                                        : te.deadline_at,
                                    ),
                                  ],
                                })
                              : null,
                            s != null && s.queue_owner_id
                              ? e.jsxs("span", {
                                  className: "text-[10px] text-slate-500",
                                  children: [
                                    "Queue:",
                                    " ",
                                    ((ae = S[s.queue_owner_id]) == null
                                      ? void 0
                                      : ae.name) || s.queue_owner_id,
                                  ],
                                })
                              : null,
                          ],
                        }),
                        e.jsxs("p", {
                          className: "mt-1 text-xs text-slate-500",
                          children: [
                            "Last:",
                            " ",
                            v(s.last_interaction_at || s.updated_at),
                          ],
                        }),
                      ],
                    },
                    s.id,
                  );
                }),
              ],
            }),
          ],
        }),
        e.jsx("div", {
          className: "lg:w-3/5",
          children: l
            ? e.jsxs("div", {
                className:
                  "rounded-xl shadow-borderless dark:shadow-borderlessDark p-4",
                children: [
                  e.jsxs("div", {
                    className:
                      "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
                    children: [
                      e.jsxs("div", {
                        className: "min-w-0",
                        children: [
                          e.jsx("p", {
                            className:
                              "text-xs uppercase tracking-widest text-slate-500",
                            children: "Counterparty",
                          }),
                          e.jsxs("div", {
                            className: "mt-2 flex items-center gap-3",
                            children: [
                              (Y = d == null ? void 0 : d.profile) != null &&
                              Y.profile_image
                                ? e.jsx(E.div, {
                                    initial: { opacity: 0, scale: 0.9 },
                                    whileInView: { opacity: 1, scale: 1 },
                                    viewport: { once: !0 },
                                    transition: {
                                      duration: 0.35,
                                      ease: [0.16, 1, 0.3, 1],
                                    },
                                    className: "h-10 w-10 shrink-0",
                                    children: e.jsx("img", {
                                      src: d.profile.profile_image,
                                      alt: d == null ? void 0 : d.name,
                                      className:
                                        "h-10 w-10 rounded-full object-cover",
                                    }),
                                  })
                                : e.jsx("div", {
                                    className:
                                      "h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600",
                                    children: String(
                                      (d == null ? void 0 : d.name) ||
                                        (t == null
                                          ? void 0
                                          : t.counterparty_id) ||
                                        "--",
                                    )
                                      .slice(0, 2)
                                      .toUpperCase(),
                                  }),
                              e.jsxs("div", {
                                className: "min-w-0",
                                children: [
                                  e.jsx("p", {
                                    className: "font-semibold truncate",
                                    children:
                                      (d == null ? void 0 : d.name) ||
                                      (t == null
                                        ? void 0
                                        : t.counterparty_id) ||
                                      "--",
                                  }),
                                  e.jsx("p", {
                                    className: "text-xs text-slate-500",
                                    children:
                                      ((V = d == null ? void 0 : d.profile) ==
                                      null
                                        ? void 0
                                        : V.organization_name) ||
                                      ((G = d == null ? void 0 : d.profile) ==
                                      null
                                        ? void 0
                                        : G.organization) ||
                                      "",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("p", {
                            className: "text-xs text-slate-500",
                            children: [
                              "Match: ",
                              (t == null ? void 0 : t.match_id) || "--",
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex flex-col gap-2",
                        children: [
                          e.jsx("label", {
                            className:
                              "text-xs uppercase tracking-widest text-slate-500",
                            children: "Status",
                          }),
                          e.jsx("select", {
                            value: (t == null ? void 0 : t.status) || "new",
                            onChange: (s) => P({ status: s.target.value }),
                            className:
                              "rounded-md shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-sm",
                            disabled: w,
                            children: fe.map((s) =>
                              e.jsx(
                                "option",
                                { value: s.key, children: s.label },
                                s.key,
                              ),
                            ),
                          }),
                          e.jsx("button", {
                            type: "button",
                            className:
                              "rounded-md shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50",
                            disabled: !(t != null && t.match_id),
                            onClick: () => {
                              t != null &&
                                t.match_id &&
                                R("/chat", {
                                  state: {
                                    matchId: t.match_id,
                                    notice: "Opening the lead conversation.",
                                  },
                                });
                            },
                            children: "Message",
                          }),
                          g
                            ? e.jsx("button", {
                                type: "button",
                                className:
                                  "rounded-md bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-400",
                                disabled: w || !l,
                                onClick: () => ce(l),
                                children: "Escalate",
                              })
                            : null,
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3",
                    children: [
                      e.jsxs("div", {
                        className: "rounded-lg bg-slate-50 p-3",
                        children: [
                          e.jsx("p", {
                            className:
                              "text-xs uppercase tracking-widest text-slate-500",
                            children: "Assigned agent",
                          }),
                          e.jsx("p", {
                            className: "mt-1 text-sm font-medium",
                            children:
                              (U == null ? void 0 : U.name) ||
                              (t == null ? void 0 : t.assigned_agent_id) ||
                              "Unassigned",
                          }),
                          !p || !L
                            ? null
                            : e.jsx("button", {
                                type: "button",
                                onClick: () => {
                                  const s =
                                      window.prompt(
                                        "Assign/reassign to agent id (user id)",
                                        (t == null
                                          ? void 0
                                          : t.assigned_agent_id) || "",
                                      ) || "",
                                    a =
                                      window.prompt(
                                        "Assignment reason (audit trail)",
                                        "manual_reassignment",
                                      ) || "manual_reassignment";
                                  P({
                                    assigned_agent_id: s,
                                    assignment_reason: a,
                                  });
                                },
                                className:
                                  "mt-2 text-sm text-gtBlue hover:underline",
                                disabled: w,
                                children: "Assign / Reassign",
                              }),
                          p && !L
                            ? e.jsx("p", {
                                className: "mt-2 text-xs text-slate-500",
                                children:
                                  "Lead assignment is restricted by your role policy.",
                              })
                            : null,
                        ],
                      }),
                      e.jsxs("div", {
                        className: "rounded-lg bg-slate-50 p-3",
                        children: [
                          e.jsx("p", {
                            className:
                              "text-xs uppercase tracking-widest text-slate-500",
                            children: "Updated",
                          }),
                          e.jsx("p", {
                            className: "mt-1 text-sm font-medium",
                            children:
                              v((t == null ? void 0 : t.updated_at) || "") ||
                              "--",
                          }),
                          ((J = t == null ? void 0 : t.sla) != null &&
                            J.status) ||
                          ((K = t == null ? void 0 : t.sla) != null &&
                            K.deadline_at)
                            ? e.jsxs("p", {
                                className: `mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${ne(((W = t == null ? void 0 : t.sla) == null ? void 0 : W.status) || "healthy")}`,
                                children: [
                                  "SLA ",
                                  ((X = t == null ? void 0 : t.sla) == null
                                    ? void 0
                                    : X.status) || "active",
                                  " ·",
                                  " ",
                                  ie(
                                    (Z = t == null ? void 0 : t.sla) == null
                                      ? void 0
                                      : Z.deadline_at,
                                  ),
                                ],
                              })
                            : null,
                          xe
                            ? e.jsx("button", {
                                type: "button",
                                onClick: () => me(l),
                                className:
                                  "mt-2 text-xs rounded bg-emerald-600 px-2 py-1 text-white",
                                disabled: w,
                                children: "Resolve escalation",
                              })
                            : null,
                          t != null && t.queue_owner_id
                            ? e.jsxs("p", {
                                className: "mt-1 text-xs text-slate-600",
                                children: [
                                  "Queue owner:",
                                  " ",
                                  ((ee = S[t.queue_owner_id]) == null
                                    ? void 0
                                    : ee.name) || t.queue_owner_id,
                                ],
                              })
                            : null,
                          e.jsx("button", {
                            type: "button",
                            onClick: de,
                            className:
                              "mt-2 text-sm text-gtBlue hover:underline",
                            disabled: w,
                            children: "Set reminder",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "mt-5",
                    children: [
                      g
                        ? e.jsxs("div", {
                            className: "mb-4 rounded-lg bg-slate-50 p-3",
                            children: [
                              e.jsx("p", {
                                className:
                                  "text-xs uppercase tracking-widest text-slate-500",
                                children: "Team queue snapshot",
                              }),
                              e.jsx("div", {
                                className: "mt-2 grid gap-2 md:grid-cols-2",
                                children: (k.team_queues || [])
                                  .slice(0, 4)
                                  .map((s) =>
                                    e.jsxs(
                                      "div",
                                      {
                                        className:
                                          "rounded-md shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs",
                                        children: [
                                          e.jsx("div", {
                                            className: "font-medium",
                                            children:
                                              s.agent_name || s.agent_id,
                                          }),
                                          e.jsxs("div", {
                                            className: "text-slate-500",
                                            children: [
                                              "Load: ",
                                              s.current_load,
                                              " leads",
                                            ],
                                          }),
                                        ],
                                      },
                                      s.agent_id,
                                    ),
                                  ),
                              }),
                              e.jsx("p", {
                                className:
                                  "mt-3 text-xs uppercase tracking-widest text-slate-500",
                                children: "Escalation queue",
                              }),
                              e.jsx("div", {
                                className: "mt-2 space-y-1",
                                children: (k.escalations || [])
                                  .slice(0, 5)
                                  .map((s) =>
                                    e.jsxs(
                                      "div",
                                      {
                                        className:
                                          "rounded-md shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs flex items-center justify-between gap-2",
                                        children: [
                                          e.jsxs("span", {
                                            className: "truncate",
                                            children: [
                                              "Lead ",
                                              s.lead_id,
                                              " · ",
                                              s.reason,
                                            ],
                                          }),
                                          e.jsx("span", {
                                            className: "text-slate-500",
                                            children: v(s.triggered_at),
                                          }),
                                        ],
                                      },
                                      s.id,
                                    ),
                                  ),
                              }),
                            ],
                          })
                        : null,
                      e.jsx("p", {
                        className:
                          "text-xs uppercase tracking-widest text-slate-500",
                        children: "Internal notes",
                      }),
                      e.jsxs("div", {
                        className: "mt-2 flex items-center gap-2",
                        children: [
                          e.jsx("input", {
                            value: F,
                            onChange: (s) => D(s.target.value),
                            placeholder: "Add a note for your team...",
                            className:
                              "flex-1 rounded-md shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-sm",
                            disabled: w,
                          }),
                          e.jsx("button", {
                            type: "button",
                            onClick: le,
                            className:
                              "px-3 py-2 rounded-md bg-gtBlue text-white text-sm font-medium hover:bg-gtBlueHover active:scale-[0.98]",
                            disabled: w,
                            children: "Add",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        "data-lenis-prevent": !0,
                        className:
                          "mt-3 space-y-2 max-h-[260px] overflow-auto pr-1",
                        children: [
                          ((t == null ? void 0 : t.notes) || []).length === 0
                            ? e.jsx("div", {
                                className: "text-sm text-slate-500",
                                children: "No notes yet.",
                              })
                            : null,
                          ((t == null ? void 0 : t.notes) || []).map((s) =>
                            e.jsxs(
                              "div",
                              {
                                className:
                                  "rounded-lg shadow-borderless dark:shadow-borderlessDark p-3",
                                children: [
                                  e.jsx("p", {
                                    className: "text-sm text-slate-900",
                                    children: s.note,
                                  }),
                                  e.jsx("p", {
                                    className: "mt-1 text-xs text-slate-500",
                                    children: v(s.created_at),
                                  }),
                                ],
                              },
                              s.id,
                            ),
                          ),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "mt-5",
                    children: [
                      O.length
                        ? e.jsxs("div", {
                            className: "mb-4",
                            children: [
                              e.jsx("p", {
                                className:
                                  "text-xs uppercase tracking-widest text-slate-500",
                                children: "Assignment audit trail",
                              }),
                              e.jsx("div", {
                                className: "mt-2 space-y-1",
                                children: O.map((s) =>
                                  e.jsxs(
                                    "div",
                                    {
                                      className:
                                        "rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs",
                                      children: [
                                        e.jsx("span", {
                                          className: "font-medium",
                                          children: s.reason || "assignment",
                                        }),
                                        e.jsxs("span", {
                                          className: "text-slate-500",
                                          children: [
                                            " ",
                                            "· ",
                                            v(s.assigned_at || s.created_at),
                                          ],
                                        }),
                                      ],
                                    },
                                    s.id,
                                  ),
                                ),
                              }),
                            ],
                          })
                        : null,
                      e.jsx("p", {
                        className:
                          "text-xs uppercase tracking-widest text-slate-500",
                        children: "Reminders",
                      }),
                      e.jsxs("div", {
                        className: "mt-2 space-y-2",
                        children: [
                          ((t == null ? void 0 : t.reminders) || []).length ===
                          0
                            ? e.jsx("div", {
                                className: "text-sm text-slate-500",
                                children: "No reminders yet.",
                              })
                            : null,
                          ((t == null ? void 0 : t.reminders) || []).map((s) =>
                            e.jsx(
                              "div",
                              {
                                className:
                                  "rounded-lg shadow-borderless dark:shadow-borderlessDark p-3",
                                children: e.jsxs("div", {
                                  className:
                                    "flex items-center justify-between gap-2",
                                  children: [
                                    e.jsx("p", {
                                      className: "text-sm font-medium",
                                      children: s.message,
                                    }),
                                    e.jsx("p", {
                                      className: "text-xs text-slate-500",
                                      children: v(s.remind_at),
                                    }),
                                  ],
                                }),
                              },
                              s.id,
                            ),
                          ),
                        ],
                      }),
                    ],
                  }),
                ],
              })
            : e.jsx("div", {
                className:
                  "rounded-xl shadow-borderless dark:shadow-borderlessDark p-6 text-sm text-slate-500",
                children:
                  "Select a lead to view details, notes, and reminders.",
              }),
        }),
      ],
    }),
  });
}
function Ne({
  children: x,
  className: p = "",
  as: g = "div",
  delay: r = 0,
  duration: L = 0.5,
  scale: R = 0.92,
  ...N
}) {
  if (be()) {
    const o = g;
    return e.jsx(o, { className: p, ...N, children: x });
  }
  const A = E[g];
  return e.jsx(A, {
    className: p,
    initial: { opacity: 0, scale: R },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: !0, margin: "-40px" },
    transition: { duration: L, delay: r, ease: [0.16, 1, 0.3, 1] },
    ...N,
    children: x,
  });
}
export { je as L, Ne as S };
