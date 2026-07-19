import {
  r as c,
  g as P,
  W as U,
  d as y,
  j as e,
  N as F,
  S as D,
  f as O,
  a2 as $,
} from "./index-CNnTWoea.js";
import { S as _ } from "./sparkles-DVBGTjg1.js";
import { M as E } from "./message-square-text-BHby1laP.js";
import { U as I } from "./user-round-Bh67XmZR.js";
import { C as G } from "./circle-check-CcIEJQvk.js";
const H = [1, 2, 3, 4, 5],
  W = 500;
function B(s) {
  var i, m, b, u;
  const a = [];
  return (
    a.push(
      (i = s == null ? void 0 : s.signals) != null && i.contract_signed
        ? "Contract signed"
        : "No contract",
    ),
    a.push(
      (m = s == null ? void 0 : s.signals) != null && m.recorded_call
        ? "Recorded call"
        : "No call",
    ),
    ((b = s == null ? void 0 : s.signals) == null
      ? void 0
      : b.avg_response_hours) !== null &&
      ((u = s == null ? void 0 : s.signals) == null
        ? void 0
        : u.avg_response_hours) !== void 0 &&
      a.push(`Avg response ${s.signals.avg_response_hours}h`),
    a
  );
}
function K({ value: s, onChange: a }) {
  return e.jsx("div", {
    className: "flex items-center gap-1",
    children: H.map((i) => {
      const m = i <= s;
      return e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${i} star`,
          onClick: () => a(i),
          className: [
            "group inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-transparent",
            m
              ? "border-sky-400/60 bg-sky-500/10 text-sky-300 shadow-sm shadow-sky-500/10"
              : "border-slate-200/70 bg-white/70 text-slate-300 hover:border-sky-300/60 hover:text-sky-400 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-600 dark:hover:border-sky-400/50 dark:hover:text-sky-300",
          ].join(" "),
          children: e.jsx($, {
            className: `h-5 w-5 ${m ? "fill-current" : ""}`,
          }),
        },
        i,
      );
    }),
  });
}
function X({ icon: s, label: a, value: i }) {
  return e.jsxs("div", {
    className:
      "inline-flex items-center gap-2 rounded-full border border-sky-500/15 bg-sky-500/5 px-3 py-1.5 text-sm text-slate-600 shadow-sm dark:text-slate-300",
    children: [
      e.jsx(s, { className: "h-4 w-4 text-sky-400" }),
      e.jsxs("span", { className: "font-medium", children: [a, ":"] }),
      e.jsx("span", { children: i }),
    ],
  });
}
function z(s) {
  if (!s) return "recently";
  const a = new Date(s);
  return Number.isNaN(a.getTime()) ? "recently" : a.toLocaleDateString();
}
function ee() {
  const s = c.useMemo(() => P(), []),
    [a] = U(),
    i = a.get("profile_key") || "",
    [m, b] = c.useState(!0),
    [u, L] = c.useState(!0),
    [j, N] = c.useState(!1),
    [v, S] = c.useState(""),
    [w, h] = c.useState([]),
    [M, p] = c.useState({}),
    [C, R] = c.useState({}),
    [T, f] = c.useState("");
  (c.useEffect(() => {
    s &&
      y("/ratings/feedback-requests", { token: s })
        .then((t) => {
          S("");
          const r = Array.isArray(t == null ? void 0 : t.items) ? t.items : [];
          (h(r),
            R((n) => {
              const d = { ...n };
              return (
                r.forEach((o) => {
                  if (!d[o.id]) {
                    const g = Number(
                      (o == null ? void 0 : o.suggested_score) || 0,
                    );
                    d[o.id] = {
                      score: g >= 1 ? Math.round(g) : 4,
                      comment: "",
                    };
                  }
                }),
                d
              );
            }));
          const l = r
            .map((n) => String(n.profile_key || "").replace(/^user:/, ""))
            .filter(Boolean);
          l.length
            ? y("/users/lookup", { method: "POST", token: s, body: { ids: l } })
                .then((n) => {
                  const d = ((n == null ? void 0 : n.users) || []).reduce(
                    (o, g) => ((o[g.id] = g), o),
                    {},
                  );
                  p(d);
                })
                .catch(() => p({}))
                .finally(() => N(!0))
            : (p({}), N(!0));
        })
        .catch((t) => {
          (S(t.message || "Unable to load feedback requests"), h([]));
        })
        .finally(() => b(!1));
  }, [s]),
    c.useEffect(() => {
      u && !m && j && L(!1);
    }, [u, m, j]));
  function k(t, r) {
    R((l) => ({ ...l, [t]: { ...l[t], ...r } }));
  }
  async function q(t) {
    const r = C[t.id];
    if (r != null && r.score) {
      f("");
      try {
        (await y(`/ratings/profiles/${encodeURIComponent(t.profile_key)}`, {
          method: "POST",
          token: s,
          body: {
            score: r.score,
            comment: r.comment,
            interaction_type: t.interaction_type || "deal",
          },
        }),
          h((l) => l.filter((n) => n.id !== t.id)),
          f("Rating submitted. Thank you!"));
      } catch (l) {
        f(l.message || "Unable to submit rating");
      }
    }
  }
  return u
    ? e.jsx(F, { fill: !0 })
    : v
      ? e.jsx("div", {
          className:
            "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(to_bottom,_#f8fbff,_#eef7ff_48%,_#f8fafc)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(to_bottom,_#020617,_#07111f_55%,_#020617)]",
          children: e.jsx("div", {
            className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
            children: e.jsx("div", {
              className:
                "rounded-[2rem] border border-red-500/20 bg-white/80 p-6 shadow-[0_10px_40px_rgba(239,68,68,0.08)] dark:bg-slate-950/70",
              children: e.jsx("p", {
                className: "text-sm font-medium text-red-600 dark:text-red-300",
                children: v,
              }),
            }),
          }),
        })
      : e.jsx("div", {
          className:
            "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(to_bottom,_#f8fbff,_#eef7ff_48%,_#f8fafc)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(to_bottom,_#020617,_#07111f_55%,_#020617)] dark:text-white",
          children: e.jsxs("div", {
            className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
            children: [
              e.jsx(D, {
                as: "section",
                children: e.jsx("div", {
                  className:
                    "mb-6 rounded-[2rem] border border-sky-500/15 bg-white/75 p-6 shadow-[0_10px_40px_rgba(56,189,248,0.08)] backdrop-blur-xl dark:bg-slate-950/70",
                  children: e.jsx("div", {
                    className:
                      "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
                    children: e.jsxs("div", {
                      className: "max-w-3xl space-y-3",
                      children: [
                        e.jsxs("div", {
                          className:
                            "inline-flex items-center gap-2 rounded-full border border-sky-500/15 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-700 dark:text-sky-300",
                          children: [
                            e.jsx(_, { className: "h-3.5 w-3.5" }),
                            "GarTexHub / Ratings",
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("h1", {
                              className:
                                "text-3xl font-bold tracking-tight sm:text-4xl",
                              children: "Rate recent interactions",
                            }),
                            e.jsx("p", {
                              className:
                                "mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base",
                              children:
                                "Feedback helps strengthen trust signals across GarTexHub.",
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                }),
              }),
              T
                ? e.jsx("div", {
                    className:
                      "mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
                    children: T,
                  })
                : null,
              w.length === 0
                ? e.jsxs("div", {
                    className:
                      "rounded-[2rem] border border-slate-200/70 bg-white/80 p-10 text-center shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-slate-950/70",
                    children: [
                      e.jsx("div", {
                        className:
                          "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/15 bg-sky-500/10",
                        children: e.jsx(E, {
                          className: "h-7 w-7 text-sky-500",
                        }),
                      }),
                      e.jsx("h2", {
                        className:
                          "text-lg font-semibold text-slate-900 dark:text-white",
                        children: "No pending rating requests right now.",
                      }),
                      e.jsx("p", {
                        className:
                          "mt-2 text-sm text-slate-500 dark:text-slate-400",
                        children:
                          "New requests will appear here after qualifying interactions are completed.",
                      }),
                    ],
                  })
                : null,
              e.jsx(D, {
                as: "section",
                children: e.jsx("div", {
                  className: "space-y-5",
                  children: w.map((t) => {
                    const r = String(t.profile_key || "").replace(/^user:/, ""),
                      l = M[r] || {},
                      n = C[t.id] || { score: 4, comment: "" },
                      d =
                        t != null && t.suggested_score
                          ? Number(t.suggested_score)
                          : null,
                      o = i && t.profile_key === i,
                      g = B(t),
                      A = Array.isArray(t.suggested_reasons)
                        ? t.suggested_reasons
                        : [];
                    return e.jsxs(
                      "div",
                      {
                        className: [
                          "relative overflow-hidden rounded-3xl border p-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)] transition-all",
                          "bg-white/85 backdrop-blur-xl dark:bg-slate-950/70",
                          o
                            ? "border-sky-400/70 ring-2 ring-sky-400/30 shadow-sky-500/10"
                            : "border-slate-200/70 dark:border-white/10",
                        ].join(" "),
                        children: [
                          e.jsx("div", {
                            className:
                              "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 opacity-80",
                          }),
                          e.jsxs("div", {
                            className:
                              "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
                            children: [
                              e.jsxs("div", {
                                className: "space-y-3",
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "flex flex-wrap items-center gap-2",
                                    children: [
                                      e.jsx("h3", {
                                        className:
                                          "text-lg font-semibold tracking-tight text-slate-900 dark:text-white",
                                        children: l.name || "Counterparty",
                                      }),
                                      e.jsx("span", {
                                        className:
                                          "rounded-full border border-sky-500/15 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-600 dark:text-sky-300",
                                        children: l.role || "User",
                                      }),
                                      o
                                        ? e.jsxs("span", {
                                            className:
                                              "inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300",
                                            children: [
                                              e.jsx(_, {
                                                className: "h-3.5 w-3.5",
                                              }),
                                              "Focused",
                                            ],
                                          })
                                        : null,
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className:
                                      "grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 xl:grid-cols-4",
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/5",
                                        children: [
                                          e.jsx(I, {
                                            className: "h-4 w-4 text-sky-500",
                                          }),
                                          e.jsx("span", {
                                            className: "truncate",
                                            children: l.email || "--",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className:
                                          "inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/5",
                                        children: [
                                          e.jsx(O, {
                                            className: "h-4 w-4 text-sky-500",
                                          }),
                                          e.jsx("span", {
                                            children:
                                              t.interaction_type || "deal",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className:
                                          "inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/5",
                                        children: [
                                          e.jsx(E, {
                                            className: "h-4 w-4 text-sky-500",
                                          }),
                                          e.jsx("span", {
                                            children: z(t.created_at),
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className:
                                          "inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/5",
                                        children: [
                                          e.jsx(G, {
                                            className: "h-4 w-4 text-sky-500",
                                          }),
                                          e.jsxs("span", {
                                            children: [
                                              "profile_key: ",
                                              t.profile_key || "—",
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsx("div", {
                                    className: "flex flex-wrap gap-2",
                                    children: g.map((x) =>
                                      e.jsx(
                                        X,
                                        { icon: _, label: "Signal", value: x },
                                        x,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "w-full max-w-[360px] rounded-3xl border border-sky-500/15 bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-transparent p-4 dark:from-sky-500/15 dark:via-sky-500/5 dark:to-transparent",
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "mb-2 flex items-center justify-between gap-2",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx("p", {
                                            className:
                                              "text-sm font-semibold text-slate-900 dark:text-white",
                                            children: "Suggested rating",
                                          }),
                                          e.jsx("p", {
                                            className:
                                              "text-xs text-slate-500 dark:text-slate-400",
                                            children:
                                              d !== null
                                                ? `Score ${d.toFixed(1)}`
                                                : "Default score 4",
                                          }),
                                        ],
                                      }),
                                      d !== null
                                        ? e.jsx("button", {
                                            type: "button",
                                            onClick: () =>
                                              k(t.id, { score: Math.round(d) }),
                                            className:
                                              "rounded-full border border-sky-500/20 bg-white px-3 py-1.5 text-xs font-medium text-sky-600 shadow-sm transition hover:border-sky-400/40 hover:bg-sky-50 dark:bg-slate-950 dark:text-sky-300 dark:hover:bg-slate-900",
                                            children: "Use suggested",
                                          })
                                        : null,
                                    ],
                                  }),
                                  d !== null
                                    ? e.jsxs("div", {
                                        className:
                                          "mb-3 rounded-2xl border border-sky-500/10 bg-white/80 p-3 text-sm text-slate-600 dark:bg-slate-950/60 dark:text-slate-300",
                                        children: [
                                          e.jsx("div", {
                                            className:
                                              "mb-1 font-medium text-slate-800 dark:text-slate-100",
                                            children: "Why this score?",
                                          }),
                                          e.jsx("div", {
                                            className: "flex flex-wrap gap-2",
                                            children:
                                              A.length > 0
                                                ? A.map((x) =>
                                                    e.jsx(
                                                      "span",
                                                      {
                                                        className:
                                                          "rounded-full bg-sky-500/10 px-2.5 py-1 text-xs text-sky-700 dark:text-sky-300",
                                                        children: x,
                                                      },
                                                      x,
                                                    ),
                                                  )
                                                : e.jsx("span", {
                                                    className:
                                                      "text-xs text-slate-500 dark:text-slate-400",
                                                    children:
                                                      "No suggested reasons available.",
                                                  }),
                                          }),
                                        ],
                                      })
                                    : null,
                                  e.jsxs("div", {
                                    className: "space-y-3",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx("label", {
                                            className:
                                              "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200",
                                            children: "Rating",
                                          }),
                                          e.jsx(K, {
                                            value: n.score,
                                            onChange: (x) =>
                                              k(t.id, { score: x }),
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx("label", {
                                            className:
                                              "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200",
                                            children: "Comment",
                                          }),
                                          e.jsx("textarea", {
                                            rows: 3,
                                            value: n.comment,
                                            onChange: (x) =>
                                              k(t.id, {
                                                comment: x.target.value,
                                              }),
                                            placeholder:
                                              "Optional comment for this interaction...",
                                            className:
                                              "w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500",
                                          }),
                                          e.jsxs("div", {
                                            className:
                                              "mt-1 text-right text-xs text-slate-500 dark:text-slate-400",
                                            children: [
                                              n.comment.length,
                                              "/",
                                              W,
                                            ],
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className:
                                          "rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
                                        children: [
                                          e.jsx("span", {
                                            className:
                                              "font-medium text-slate-800 dark:text-slate-100",
                                            children: "Signals:",
                                          }),
                                          " ",
                                          g.join(" · "),
                                        ],
                                      }),
                                      e.jsx("button", {
                                        type: "button",
                                        onClick: () => q(t),
                                        className:
                                          "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-blue-400",
                                        children: "Submit rating",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      },
                      t.id,
                    );
                  }),
                }),
              }),
            ],
          }),
        });
}
export { ee as default };
