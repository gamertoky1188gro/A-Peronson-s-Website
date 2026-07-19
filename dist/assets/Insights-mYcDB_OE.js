import {
  z as Y,
  r as y,
  k as Me,
  g as G,
  j as e,
  N as Le,
  S as k,
  a4 as D,
  a3 as z,
  y as he,
  h as De,
  q as B,
  d as V,
  f as ze,
  a7 as Be,
} from "./index-CNnTWoea.js";
import { A as Ve } from "./AccessDeniedState-CLpnljeA.js";
import { u as Ie } from "./useAnalyticsDashboard-IgRh5kub.js";
import { S as pe } from "./sparkles-DVBGTjg1.js";
import { G as N } from "./gauge-ChpNUbMO.js";
import { L as H } from "./link-2-BXQn7VZ0.js";
import { A as I } from "./activity-DvCTaWCd.js";
import { E as K } from "./eye-DfSxjFuN.js";
import { T as w } from "./trending-up-Bc9_vjVo.js";
import { a as ge, C as Oe } from "./crown-By7IU0CC.js";
import { A as Ue } from "./arrow-up-right-DHoBJ02c.js";
import { D as Fe } from "./download--z997xKH.js";
import { L as Ge } from "./lock-CS3nVAcE.js";
import { C as He } from "./circle-check-CcIEJQvk.js";
import { B as ye } from "./badge-info-9rvP24vr.js";
import { E as Ke } from "./earth-BxQecZ9e.js";
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const We = [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
        key: "1oefj6",
      },
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
    ["path", { d: "M12 18v-6", key: "17g6i2" }],
    ["path", { d: "m9 15 3 3 3-3", key: "1npd3o" }],
  ],
  Ye = Y("file-down", We);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Je = [
    ["path", { d: "M14 4.1 12 6", key: "ita8i4" }],
    ["path", { d: "m5.1 8-2.9-.8", key: "1go3kf" }],
    ["path", { d: "m6 12-1.9 2", key: "mnht97" }],
    ["path", { d: "M7.2 2.2 8 5.1", key: "1cfko1" }],
    [
      "path",
      {
        d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
        key: "s0h3yz",
      },
    ],
  ],
  ke = Y("mouse-pointer-click", Je);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Qe = [
    ["path", { d: "M19.07 4.93A10 10 0 0 0 6.99 3.34", key: "z3du51" }],
    ["path", { d: "M4 6h.01", key: "oypzma" }],
    ["path", { d: "M2.29 9.62A10 10 0 1 0 21.31 8.35", key: "qzzz0" }],
    ["path", { d: "M16.24 7.76A6 6 0 1 0 8.23 16.67", key: "1yjesh" }],
    ["path", { d: "M12 18h.01", key: "mhygvu" }],
    ["path", { d: "M17.99 11.66A6 6 0 0 1 15.77 16.67", key: "1u2y91" }],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
    ["path", { d: "m13.41 10.59 5.66-5.66", key: "mhq4k0" }],
  ],
  Xe = Y("radar", Qe);
function U(...l) {
  return l.filter(Boolean).join(" ");
}
function i(l) {
  if (l == null || l === "") return "--";
  const t = Number(l);
  return Number.isNaN(t) ? String(l) : new Intl.NumberFormat().format(t);
}
function C(l) {
  if (l == null || l === "") return "--";
  const t = Number(l);
  return Number.isNaN(t) ? `${l}%` : `${t}%`;
}
function Ze(l) {
  if (l == null || l === "") return "--";
  const t = Number(l);
  return Number.isNaN(t) ? `${l}s` : `${t}s`;
}
function je(l) {
  if (!l) return "--";
  const t = new Date(l);
  return Number.isNaN(t.getTime()) ? String(l) : t.toLocaleString();
}
function W(l) {
  return String(l ?? "").replaceAll(/_/g, " ");
}
function et(l, t, r) {
  const a = new Blob([l], { type: t }),
    d = URL.createObjectURL(a),
    c = document.createElement("a");
  ((c.href = d),
    (c.download = r),
    document.body.appendChild(c),
    c.click(),
    c.remove(),
    URL.revokeObjectURL(d));
}
function tt(l = {}) {
  const t = [];
  (t.push("# Totals"), t.push("metric,value"));
  const r = l.totals || {};
  return (
    Object.keys(r).forEach((a) => t.push(`${a},${String(r[a] ?? "")}`)),
    t.push(""),
    Array.isArray(l.monthly_demand_trend) &&
      (t.push("# Monthly Demand Trend"),
      t.push("month,count"),
      l.monthly_demand_trend.forEach((a) =>
        t.push(`${a.month || ""},${Number(a.count || 0)}`),
      ),
      t.push("")),
    Array.isArray(l.top_categories_global) &&
      (t.push("# Top Categories (Global)"),
      t.push("category,count"),
      l.top_categories_global.forEach((a) =>
        t.push(`${a.label || ""},${Number(a.count || 0)}`),
      ),
      t.push("")),
    Array.isArray(l.price_range_demand) &&
      (t.push("# Price Range Demand"),
      t.push("bucket,count"),
      l.price_range_demand.forEach((a) =>
        t.push(`${a.bucket || ""},${Number(a.count || 0)}`),
      ),
      t.push("")),
    Array.isArray(l.top_search_categories_global) &&
      (t.push("# Top Search Categories (Global)"),
      t.push("label,count"),
      l.top_search_categories_global.forEach((a) =>
        t.push(`${a.label || ""},${Number(a.count || 0)}`),
      ),
      t.push("")),
    Array.isArray(l.top_categories_by_country) &&
      (t.push("# Top Categories By Country"),
      t.push("country,category,count"),
      l.top_categories_by_country.forEach((a) => {
        const d = a.country || "";
        (Array.isArray(a.categories) ? a.categories : []).forEach((T) =>
          t.push(`${d},${T.label || ""},${Number(T.count || 0)}`),
        );
      }),
      t.push("")),
    t.join(`
`)
  );
}
function st(l = {}) {
  const t = (d) =>
    String(d || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  let r =
    '<html><head><meta charset="utf-8"><title>Analytics Export</title></head><body style="font-family:system-ui,Arial,Helvetica,sans-serif;padding:24px;">';
  ((r += "<h1>Analytics Export</h1>"), (r += "<h2>Totals</h2><ul>"));
  const a = l.totals || {};
  return (
    Object.keys(a).forEach((d) => {
      r += `<li><strong>${t(d)}:</strong> ${t(a[d])}</li>`;
    }),
    (r += "</ul>"),
    Array.isArray(l.monthly_demand_trend) &&
      ((r +=
        '<h2>Monthly Demand Trend</h2><table border="1" cellpadding="6" cellspacing="0"><tr><th>Month</th><th>Count</th></tr>'),
      l.monthly_demand_trend.forEach((d) => {
        r += `<tr><td>${t(d.month)}</td><td>${t(d.count)}</td></tr>`;
      }),
      (r += "</table>")),
    Array.isArray(l.top_categories_global) &&
      ((r += "<h2>Top Categories (Global)</h2><ul>"),
      l.top_categories_global.forEach((d) => {
        r += `<li>${t(d.label)} — ${t(d.count)}</li>`;
      }),
      (r += "</ul>")),
    (r += `<p>Generated at ${new Date().toISOString()}</p>`),
    (r += "</body></html>"),
    r
  );
}
function n({
  icon: l,
  label: t,
  value: r,
  hint: a = "",
  subtle: d = !1,
  className: c = "",
}) {
  return e.jsxs("div", {
    className: U(
      "group rounded-3xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
      d
        ? "border-sky-200/70 bg-white/80 backdrop-blur dark:border-sky-500/20 dark:bg-slate-950/70"
        : "border-sky-200/70 bg-gradient-to-br from-white to-sky-50/80 dark:border-sky-500/20 dark:from-slate-950 dark:to-slate-900",
      c,
    ),
    children: [
      e.jsxs("div", {
        className: "mb-4 flex items-start justify-between gap-3",
        children: [
          e.jsx("div", {
            className:
              "flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 shadow-sm dark:bg-sky-500/10 dark:text-sky-300",
            children: l ? e.jsx(l, { className: "h-5 w-5" }) : null,
          }),
          e.jsx("div", {
            className:
              "rounded-full border border-sky-200/70 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 shadow-sm dark:border-sky-500/20 dark:bg-slate-950 dark:text-slate-300",
            children: a || "Analytics",
          }),
        ],
      }),
      e.jsx("div", {
        className:
          "text-2xl font-semibold tracking-tight text-slate-900 dark:text-white",
        children: r,
      }),
      e.jsx("div", {
        className: "mt-1 text-sm text-slate-500 dark:text-slate-400",
        children: t,
      }),
    ],
  });
}
function O({ icon: l, title: t, right: r }) {
  return e.jsxs("div", {
    className: "mb-4 flex items-center justify-between gap-4",
    children: [
      e.jsxs("div", {
        className: "flex items-center gap-3",
        children: [
          e.jsx("div", {
            className:
              "flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-200 bg-white text-sky-700 shadow-sm dark:border-sky-500/20 dark:bg-slate-950 dark:text-sky-300",
            children: l ? e.jsx(l, { className: "h-5 w-5" }) : null,
          }),
          e.jsxs("div", {
            children: [
              e.jsx("h2", {
                className:
                  "text-lg font-semibold tracking-tight text-slate-900 dark:text-white",
                children: t,
              }),
              e.jsx("div", {
                className: "text-xs text-slate-500 dark:text-slate-400",
                children: "Premium analytics and platform intelligence",
              }),
            ],
          }),
        ],
      }),
      r || null,
    ],
  });
}
function m({ children: l, tone: t = "default", className: r = "" }) {
  const a = {
    default:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300",
    green:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    rose: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300",
    amber:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
    slate:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  };
  return e.jsx("span", {
    className: U(
      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
      a[t],
      r,
    ),
    children: l,
  });
}
function rt({ icon: l, title: t, description: r }) {
  return e.jsxs("div", {
    className:
      "rounded-3xl border border-dashed border-sky-200 bg-white/70 p-6 text-center shadow-sm dark:border-sky-500/20 dark:bg-slate-950/60",
    children: [
      e.jsx("div", {
        className:
          "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
        children: l ? e.jsx(l, { className: "h-5 w-5" }) : null,
      }),
      e.jsx("div", {
        className: "text-base font-semibold text-slate-900 dark:text-white",
        children: t,
      }),
      e.jsx("div", {
        className: "mt-1 text-sm text-slate-500 dark:text-slate-400",
        children: r,
      }),
    ],
  });
}
function S({ label: l, value: t }) {
  return e.jsxs("div", {
    className:
      "rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/70",
    children: [
      e.jsx("div", {
        className:
          "text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400",
        children: l,
      }),
      e.jsx("div", {
        className: "mt-0.5 font-medium text-slate-900 dark:text-white",
        children: t,
      }),
    ],
  });
}
function p({ title: l, items: t, emptyText: r, renderItem: a }) {
  return e.jsxs("div", {
    className:
      "rounded-3xl border border-sky-200/70 bg-slate-50/70 p-5 dark:border-sky-500/20 dark:bg-slate-900/60",
    children: [
      e.jsxs("div", {
        className: "mb-4 flex items-center justify-between gap-3",
        children: [
          e.jsx("h3", {
            className: "text-sm font-semibold text-slate-900 dark:text-white",
            children: l,
          }),
          e.jsx(Be, { className: "h-4 w-4 text-slate-400" }),
        ],
      }),
      e.jsx("div", {
        className: "space-y-2",
        children:
          Array.isArray(t) && t.length
            ? t.map((d, c) =>
                e.jsx(
                  "div",
                  {
                    className:
                      "rounded-2xl border border-slate-200/80 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950/60",
                    children: typeof a == "function" ? a(d) : String(d),
                  },
                  d.id ||
                    d.label ||
                    d.product_id ||
                    d.country ||
                    d.source_type ||
                    d.page ||
                    c,
                ),
              )
            : e.jsx("div", {
                className: "text-sm text-slate-500 dark:text-slate-400",
                children: r,
              }),
      }),
    ],
  });
}
function jt() {
  var de, oe, ce, me, xe;
  const {
      dashboard: l,
      companyAnalytics: t,
      platformAnalytics: r,
      premiumInsights: a,
      subscription: d,
      isEnterprise: c,
      loading: T,
      error: F,
      forbidden: fe,
    } = Ie(),
    b = y.useMemo(() => Me(), []),
    [J, Q] = y.useState([]),
    [X, Z] = y.useState([]),
    [ee, te] = y.useState(!1),
    h = (l == null ? void 0 : l.totals) || {},
    se =
      ((de = l == null ? void 0 : l.analytics_events) == null
        ? void 0
        : de.by_type) || {},
    f = (l == null ? void 0 : l.interaction_summary) || {},
    re = Array.isArray(l == null ? void 0 : l.top_metrics) ? l.top_metrics : [],
    v = (t == null ? void 0 : t.totals) || {},
    ve = Array.isArray(t == null ? void 0 : t.top_products)
      ? t.top_products
      : [],
    _e = Array.isArray(t == null ? void 0 : t.profile_visits_by_country)
      ? t.profile_visits_by_country
      : [],
    Ne = Array.isArray(t == null ? void 0 : t.top_lead_sources)
      ? t.top_lead_sources
      : [],
    ae = (r == null ? void 0 : r.totals) || {},
    we = Array.isArray(r == null ? void 0 : r.top_categories_global)
      ? r.top_categories_global
      : [],
    Ce = Array.isArray(r == null ? void 0 : r.top_categories_by_country)
      ? r.top_categories_by_country
      : [],
    Se = Array.isArray(r == null ? void 0 : r.price_range_demand)
      ? r.price_range_demand
      : [],
    Te = Array.isArray(r == null ? void 0 : r.monthly_demand_trend)
      ? r.monthly_demand_trend
      : [],
    Ae = Array.isArray(r == null ? void 0 : r.top_search_categories_global)
      ? r.top_search_categories_global
      : [],
    Pe = Array.isArray(r == null ? void 0 : r.top_search_categories_by_country)
      ? r.top_search_categories_by_country
      : [],
    Re = Array.isArray(r == null ? void 0 : r.trending_search_categories)
      ? r.trending_search_categories
      : [],
    Ee = (r == null ? void 0 : r.search_event_count) ?? 0,
    qe = (r == null ? void 0 : r.search_data_ready) ?? !0,
    $e = (r == null ? void 0 : r.search_min_events) ?? 25,
    x = String((r == null ? void 0 : r.scope_level) || "not_available"),
    A = Array.isArray(r == null ? void 0 : r.suppressed_fields)
      ? r.suppressed_fields
      : [],
    le = !!(r != null && r.privacy_threshold_applied),
    P = (a == null ? void 0 : a.role) || "",
    u =
      ((ce =
        (oe = b == null ? void 0 : b.capabilities) == null
          ? void 0
          : oe.leads) == null
        ? void 0
        : ce.export) !== !1,
    [g, R] = y.useState(!1),
    [ie, E] = y.useState("");
  y.useEffect(() => {
    const s = String(P || "").toLowerCase();
    if (!["factory", "buying_house"].includes(s)) return;
    const o = G();
    if (!o || !(b != null && b.id)) return;
    async function _() {
      var j, q;
      te(!0);
      try {
        const $ =
            ((q =
              (j = t == null ? void 0 : t.top_products) == null
                ? void 0
                : j[0]) == null
              ? void 0
              : q.product_id) || "",
          ue = [
            V(
              `/analytics/viewers?entity=profile&id=${encodeURIComponent(b.id)}&limit=8`,
              { token: o },
            ),
          ];
        $ &&
          ue.push(
            V(
              `/analytics/viewers?entity=product&id=${encodeURIComponent($)}&limit=8`,
              { token: o },
            ),
          );
        const be = await Promise.all(ue),
          M = be[0],
          L = be[1];
        (Q(Array.isArray(M == null ? void 0 : M.items) ? M.items : []),
          Z(Array.isArray(L == null ? void 0 : L.items) ? L.items : []));
      } catch {
        (Q([]), Z([]));
      } finally {
        te(!1);
      }
    }
    _();
  }, [P, b == null ? void 0 : b.id, t == null ? void 0 : t.top_products]);
  const ne = we
    .slice(0, 3)
    .map((s) => s.label)
    .filter(Boolean);
  return T
    ? e.jsx(Le, { fill: !0, size: 64, text: "Loading analytics..." })
    : fe
      ? e.jsx("div", {
          className:
            "min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900",
          children: e.jsx(Ve, { message: F }),
        })
      : e.jsx("div", {
          className:
            "min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white",
          children: e.jsx("div", {
            className: "mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8",
            children: e.jsxs("div", {
              className:
                "relative overflow-hidden rounded-[2rem] border border-sky-200/80 bg-white/85 p-6 shadow-[0_20px_80px_-30px_rgba(14,165,233,0.35)] backdrop-blur dark:border-sky-500/20 dark:bg-slate-950/70 lg:p-8",
              children: [
                e.jsx("div", {
                  className:
                    "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%)]",
                }),
                F
                  ? e.jsx("div", {
                      className:
                        "relative mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200",
                      children: F,
                    })
                  : null,
                e.jsxs("div", {
                  className:
                    "relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between",
                  children: [
                    e.jsxs("div", {
                      children: [
                        e.jsxs("div", {
                          className:
                            "mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300",
                          children: [
                            e.jsx(pe, { className: "h-3.5 w-3.5" }),
                            "Insights & Analytics",
                          ],
                        }),
                        e.jsx("h1", {
                          className:
                            "text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl",
                          children: "Insights & Analytics",
                        }),
                        e.jsx("p", {
                          className:
                            "mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300",
                          children:
                            "Owner/admin intelligence dashboard for KPIs, interaction metrics, company analytics, platform analytics, and premium insights.",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "flex flex-wrap items-center gap-2",
                      children: [
                        e.jsx(m, {
                          tone: c ? "green" : "slate",
                          children: c ? "Enterprise Plan" : "Free Plan",
                        }),
                        e.jsxs(m, {
                          tone:
                            x === "platform_admin_full_detail"
                              ? "green"
                              : "amber",
                          children: ["Scope: ", W(x)],
                        }),
                        e.jsx(m, {
                          tone: u ? "green" : "rose",
                          children: u ? "Export enabled" : "Export blocked",
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsx(k, {
                  as: "section",
                  children: e.jsx("div", {
                    className:
                      "relative mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
                    children: (re.length
                      ? re
                      : [
                          {
                            key: "buyer_requests",
                            label: "Buyer Requests",
                            value: String(h.buyer_requests ?? 0),
                            hint: "",
                          },
                          {
                            key: "chats",
                            label: "Active Chats",
                            value: String(h.chats ?? 0),
                            hint: "",
                          },
                          {
                            key: "partners",
                            label: "Partner Network",
                            value: String(h.partner_network ?? 0),
                            hint: "",
                          },
                          {
                            key: "contracts",
                            label: "Contracts",
                            value: String(h.contracts ?? 0),
                            hint: "",
                          },
                          {
                            key: "documents",
                            label: "Documents",
                            value: String(h.documents ?? 0),
                            hint: "",
                          },
                        ]
                    )
                      .slice(0, 5)
                      .map((s, o) =>
                        e.jsx(
                          n,
                          {
                            icon: [N, D, H, z, he][o % 5],
                            label: s.label,
                            value: i(s.value),
                            hint: s.hint || "Top metric",
                          },
                          s.key || o,
                        ),
                      ),
                  }),
                }),
                e.jsx(k, {
                  as: "section",
                  children: e.jsxs("div", {
                    className:
                      "relative mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4",
                    children: [
                      e.jsx(n, {
                        icon: D,
                        label: "Total Buyer Requests",
                        value: i(h.buyer_requests ?? 0),
                        hint: "Requests",
                        subtle: !0,
                      }),
                      e.jsx(n, {
                        icon: I,
                        label: "Active Chats",
                        value: i(h.chats ?? 0),
                        hint: "Chats",
                        subtle: !0,
                      }),
                      e.jsx(n, {
                        icon: H,
                        label: "Connected Partners",
                        value: i(h.partner_network ?? 0),
                        hint: "Partners",
                        subtle: !0,
                      }),
                      e.jsx(n, {
                        icon: z,
                        label: "Contracts / Documents",
                        value: `${i(h.contracts ?? 0)} / ${i(h.documents ?? 0)}`,
                        hint: "Docs",
                        subtle: !0,
                      }),
                    ],
                  }),
                }),
                e.jsx(k, {
                  as: "section",
                  children: e.jsxs("div", {
                    className: "relative mt-7 grid gap-4 xl:grid-cols-4",
                    children: [
                      e.jsx(n, {
                        icon: K,
                        label: "Total Page Views",
                        value: i(f.total_page_views ?? 0),
                        hint: "Views",
                        subtle: !0,
                      }),
                      e.jsx(n, {
                        icon: ke,
                        label: "Total Clicks",
                        value: i(f.total_clicks ?? 0),
                        hint: "Clicks",
                        subtle: !0,
                      }),
                      e.jsx(n, {
                        icon: w,
                        label: "Avg Session Duration",
                        value: Ze(f.avg_session_duration_seconds ?? 0),
                        hint: "Seconds",
                        subtle: !0,
                      }),
                      e.jsxs("div", {
                        className:
                          "rounded-3xl border border-sky-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-sky-500/20 dark:bg-slate-950/70",
                        children: [
                          e.jsxs("div", {
                            className: "mb-4 flex items-center justify-between",
                            children: [
                              e.jsx("div", {
                                className:
                                  "flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
                                children: e.jsx(De, { className: "h-5 w-5" }),
                              }),
                              e.jsx(m, {
                                tone: "default",
                                children: "Top Pages",
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "space-y-2",
                            children: (f.top_pages || []).length
                              ? f.top_pages.map((s) =>
                                  e.jsxs(
                                    "div",
                                    {
                                      className:
                                        "flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/60",
                                      children: [
                                        e.jsx("span", {
                                          className:
                                            "truncate text-slate-700 dark:text-slate-300",
                                          children: s.page,
                                        }),
                                        e.jsx("span", {
                                          className:
                                            "ml-3 font-medium text-slate-950 dark:text-white",
                                          children: i(s.count),
                                        }),
                                      ],
                                    },
                                    s.page,
                                  ),
                                )
                              : e.jsx("div", {
                                  className:
                                    "text-sm text-slate-500 dark:text-slate-400",
                                  children: "No page view data yet.",
                                }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                e.jsx(k, {
                  as: "section",
                  children: e.jsxs("div", {
                    className:
                      "relative mt-7 rounded-[2rem] border border-sky-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-sky-500/20 dark:bg-slate-950/70",
                    children: [
                      e.jsx(O, {
                        icon: ge,
                        title: "Analytics Panel",
                        right: e.jsx(m, {
                          tone: c ? "green" : "amber",
                          children: c ? "Enterprise view" : "Free view",
                        }),
                      }),
                      c
                        ? e.jsxs("div", {
                            className: "grid gap-4 lg:grid-cols-2",
                            children: [
                              e.jsxs("div", {
                                className:
                                  "rounded-3xl border border-sky-200/70 bg-slate-50/70 p-5 dark:border-sky-500/20 dark:bg-slate-900/60",
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "mb-4 flex items-center justify-between",
                                    children: [
                                      e.jsx("h3", {
                                        className:
                                          "text-sm font-semibold text-slate-900 dark:text-white",
                                        children: "Analytics Events by Type",
                                      }),
                                      e.jsx(m, {
                                        tone: "default",
                                        children: "Live",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      Object.keys(se).length === 0
                                        ? e.jsx("div", {
                                            className:
                                              "text-sm text-slate-500 dark:text-slate-400",
                                            children:
                                              "No analytics events recorded yet.",
                                          })
                                        : null,
                                      Object.entries(se).map(([s, o]) =>
                                        e.jsxs(
                                          "div",
                                          {
                                            className:
                                              "flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950/60",
                                            children: [
                                              e.jsx("span", {
                                                className:
                                                  "truncate text-slate-700 dark:text-slate-300",
                                                children: s,
                                              }),
                                              e.jsx("span", {
                                                className:
                                                  "font-medium text-slate-950 dark:text-white",
                                                children: i(o),
                                              }),
                                            ],
                                          },
                                          s,
                                        ),
                                      ),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "rounded-3xl border border-sky-200/70 bg-gradient-to-br from-white to-sky-50/80 p-5 dark:border-sky-500/20 dark:from-slate-950 dark:to-slate-900",
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white",
                                    children: [
                                      e.jsx(Fe, {
                                        className:
                                          "h-4 w-4 text-sky-600 dark:text-sky-300",
                                      }),
                                      "Export Controls",
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "grid gap-3 sm:grid-cols-2",
                                    children: [
                                      e.jsxs("button", {
                                        title: u
                                          ? x !== "platform_admin_full_detail"
                                            ? "Export restricted to admin full-platform view"
                                            : "Export CSV"
                                          : "Export disabled by policy",
                                        disabled:
                                          !u ||
                                          x !== "platform_admin_full_detail" ||
                                          g,
                                        onClick: async () => {
                                          if (!(
                                            !u ||
                                            x !== "platform_admin_full_detail"
                                          )) {
                                            (E(""), R(!0));
                                            try {
                                              const s = G(),
                                                o = await V(
                                                  "/export/analytics",
                                                  { method: "POST", token: s },
                                                ),
                                                _ =
                                                  (o == null
                                                    ? void 0
                                                    : o.report) || {},
                                                j = tt(_);
                                              et(
                                                j,
                                                "text/csv;charset=utf-8;",
                                                `analytics_export_${Date.now()}.csv`,
                                              );
                                            } catch (s) {
                                              E(
                                                (s == null
                                                  ? void 0
                                                  : s.message) || String(s),
                                              );
                                            } finally {
                                              R(!1);
                                            }
                                          }
                                        },
                                        className: U(
                                          "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                                          !u ||
                                            x !==
                                              "platform_admin_full_detail" ||
                                            g
                                            ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
                                            : "bg-sky-600 text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500",
                                        ),
                                        children: [
                                          g
                                            ? e.jsx(B, {
                                                variant: "bounce",
                                                color: "#6100ff",
                                                size: "small",
                                                text: "",
                                                textColor: "",
                                              })
                                            : e.jsx(Ye, {
                                                className: "h-4 w-4",
                                              }),
                                          g ? "Exporting..." : "Export CSV",
                                        ],
                                      }),
                                      e.jsxs("button", {
                                        title: u
                                          ? x !== "platform_admin_full_detail"
                                            ? "Export restricted to admin full-platform view"
                                            : "Download PDF Report"
                                          : "Export disabled by policy",
                                        disabled:
                                          !u ||
                                          x !== "platform_admin_full_detail" ||
                                          g,
                                        onClick: async () => {
                                          if (!(
                                            !u ||
                                            x !== "platform_admin_full_detail"
                                          )) {
                                            (E(""), R(!0));
                                            try {
                                              const s = G(),
                                                o = await V(
                                                  "/export/analytics",
                                                  { method: "POST", token: s },
                                                ),
                                                _ =
                                                  (o == null
                                                    ? void 0
                                                    : o.report) || {},
                                                j = st(_),
                                                q = new Blob([j], {
                                                  type: "text/html",
                                                }),
                                                $ = URL.createObjectURL(q);
                                              window.open($, "_blank");
                                            } catch (s) {
                                              E(
                                                (s == null
                                                  ? void 0
                                                  : s.message) || String(s),
                                              );
                                            } finally {
                                              R(!1);
                                            }
                                          }
                                        },
                                        className: U(
                                          "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                                          !u ||
                                            x !==
                                              "platform_admin_full_detail" ||
                                            g
                                            ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
                                            : "border border-sky-200 bg-white text-sky-700 shadow-sm hover:bg-sky-50 dark:border-sky-500/20 dark:bg-slate-950 dark:text-sky-300 dark:hover:bg-slate-900",
                                        ),
                                        children: [
                                          g
                                            ? e.jsx(B, {
                                                variant: "bounce",
                                                color: "#6100ff",
                                                size: "small",
                                                text: "",
                                                textColor: "",
                                              })
                                            : e.jsx(z, {
                                                className: "h-4 w-4",
                                              }),
                                          g
                                            ? "Preparing..."
                                            : "Download PDF Report",
                                        ],
                                      }),
                                    ],
                                  }),
                                  ie
                                    ? e.jsx("div", {
                                        className:
                                          "mt-3 text-xs text-rose-600 dark:text-rose-300",
                                        children: ie,
                                      })
                                    : null,
                                  u
                                    ? null
                                    : e.jsx("div", {
                                        className:
                                          "mt-3 text-xs text-slate-500 dark:text-slate-400",
                                        children:
                                          "Export is disabled by organization policy.",
                                      }),
                                ],
                              }),
                            ],
                          })
                        : e.jsxs("div", {
                            className: "grid gap-4 lg:grid-cols-[1.4fr_0.8fr]",
                            children: [
                              e.jsx("div", {
                                className:
                                  "rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-500/20 dark:from-sky-500/10 dark:to-slate-950",
                                children: e.jsxs("div", {
                                  className: "flex items-start gap-4",
                                  children: [
                                    e.jsx("div", {
                                      className:
                                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
                                      children: e.jsx(ge, {
                                        className: "h-5 w-5",
                                      }),
                                    }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx("div", {
                                          className:
                                            "text-base font-semibold text-slate-950 dark:text-white",
                                          children:
                                            "Upgrade to unlock advanced analytics",
                                        }),
                                        e.jsxs("p", {
                                          className:
                                            "mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300",
                                          children: [
                                            "You are currently on ",
                                            e.jsx("strong", {
                                              children:
                                                (d == null ? void 0 : d.plan) ||
                                                "free",
                                            }),
                                            ". Upgrade to Premium/Enterprise to unlock unlimited advanced filters, expanded analytics, and exports.",
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              }),
                              e.jsx("div", {
                                className:
                                  "flex items-center justify-center rounded-3xl border border-dashed border-sky-200 bg-white/70 p-5 dark:border-sky-500/20 dark:bg-slate-950/60",
                                children: e.jsxs("button", {
                                  className:
                                    "inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-500",
                                  children: [
                                    "Upgrade to Enterprise ",
                                    e.jsx(Ue, { className: "h-4 w-4" }),
                                  ],
                                }),
                              }),
                            ],
                          }),
                    ],
                  }),
                }),
                e.jsx(k, {
                  as: "section",
                  children: e.jsxs("div", {
                    className:
                      "relative mt-7 rounded-[2rem] border border-sky-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-sky-500/20 dark:bg-slate-950/70",
                    children: [
                      e.jsx(O, {
                        icon: Xe,
                        title: "Premium Insights",
                        right: e.jsx(m, {
                          tone: a ? "green" : "amber",
                          children: P || "premium",
                        }),
                      }),
                      a
                        ? e.jsxs("div", {
                            className: "space-y-6",
                            children: [
                              e.jsxs("div", {
                                className:
                                  "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
                                children: [
                                  a.request_performance
                                    ? e.jsx(n, {
                                        icon: He,
                                        label: "Request Match Rate",
                                        value: C(
                                          a.request_performance
                                            .match_rate_pct ?? 0,
                                        ),
                                        hint: "Matched buyer requests",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.smart_matching_success_rate
                                    ? e.jsx(n, {
                                        icon: ze,
                                        label: "Smart Match Success",
                                        value: C(
                                          a.smart_matching_success_rate
                                            .match_rate_pct ?? 0,
                                        ),
                                        hint: "Matched requests converted",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.request_performance_insights
                                    ? e.jsx(n, {
                                        icon: I,
                                        label: "Open Requests",
                                        value: i(
                                          a.request_performance_insights
                                            .open_requests ?? 0,
                                        ),
                                        hint: "Requests still open",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.request_performance_insights
                                    ? e.jsx(n, {
                                        icon: N,
                                        label: "Response Speed",
                                        value:
                                          a.request_performance_insights
                                            .response_speed ||
                                          a.request_performance_insights
                                            .response_speed_hours ||
                                          "--",
                                        hint: "Avg response time",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.request_performance
                                    ? e.jsx(n, {
                                        icon: w,
                                        label: "Avg Response Time",
                                        value:
                                          a.request_performance
                                            .avg_response_time || "--",
                                        hint: "Premium response speed",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.buyer_conversion_insights
                                    ? e.jsx(n, {
                                        icon: w,
                                        label: "Conversion Rate",
                                        value: C(
                                          a.buyer_conversion_insights
                                            .conversion_rate_pct ?? 0,
                                        ),
                                        hint: "Deals closed",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.advanced_analytics
                                    ? e.jsx(n, {
                                        icon: K,
                                        label: "Product Views",
                                        value: i(
                                          a.advanced_analytics.product_views ??
                                            0,
                                        ),
                                        hint: "Premium visibility",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.advanced_analytics
                                    ? e.jsx(n, {
                                        icon: ke,
                                        label: "Inquiry Rate",
                                        value:
                                          a.advanced_analytics.inquiry_rate ??
                                          "--",
                                        hint: "Inbound inquiries per view",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.buyer_interest_analytics
                                    ? e.jsx(n, {
                                        icon: D,
                                        label: "Buyer Interest",
                                        value: i(
                                          a.buyer_interest_analytics
                                            .unique_buyers ?? 0,
                                        ),
                                        hint: "Unique buyers reached",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.buyer_interest_analytics
                                    ? e.jsx(n, {
                                        icon: H,
                                        label: "Matched Requests",
                                        value: i(
                                          a.buyer_interest_analytics
                                            .matched_requests ?? 0,
                                        ),
                                        hint: "Requests matched",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.buyer_communication_insights
                                    ? e.jsx(n, {
                                        icon: I,
                                        label: "Inbound Messages",
                                        value: i(
                                          a.buyer_communication_insights
                                            .inbound_messages ?? 0,
                                        ),
                                        hint: "Buyer communications",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.buyer_communication_insights
                                    ? e.jsx(n, {
                                        icon: z,
                                        label: "Total Messages",
                                        value: i(
                                          a.buyer_communication_insights
                                            .total_messages ?? 0,
                                        ),
                                        hint: "All thread messages",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.buyer_communication_insights
                                    ? e.jsx(n, {
                                        icon: N,
                                        label: "Avg Reply Time",
                                        value:
                                          a.buyer_communication_insights
                                            .avg_response_time || "--",
                                        hint: "Response speed",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.order_completion_certification
                                    ? e.jsx(n, {
                                        icon: ye,
                                        label: "Completion Cert",
                                        value:
                                          a.order_completion_certification
                                            .status || "pending",
                                        hint: "Order completion status",
                                        subtle: !0,
                                      })
                                    : null,
                                  a.buyer_conversion_insights
                                    ? e.jsx(n, {
                                        icon: Oe,
                                        label: "Contracts Signed",
                                        value: i(
                                          a.buyer_conversion_insights
                                            .contracts_signed ?? 0,
                                        ),
                                        hint: "Closed deals",
                                        subtle: !0,
                                      })
                                    : null,
                                ],
                              }),
                              (me =
                                a == null
                                  ? void 0
                                  : a.agent_performance_analytics) != null &&
                              me.length
                                ? e.jsxs("div", {
                                    className:
                                      "rounded-3xl border border-sky-200/70 bg-slate-50/70 p-5 dark:border-sky-500/20 dark:bg-slate-900/60",
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "mb-4 flex items-center justify-between",
                                        children: [
                                          e.jsx("h3", {
                                            className:
                                              "text-sm font-semibold text-slate-900 dark:text-white",
                                            children: "Agent Performance",
                                          }),
                                          e.jsx(m, {
                                            tone: "default",
                                            children: "Team view",
                                          }),
                                        ],
                                      }),
                                      e.jsx("div", {
                                        className: "space-y-2",
                                        children:
                                          a.agent_performance_analytics.map(
                                            (s) =>
                                              e.jsxs(
                                                "div",
                                                {
                                                  className:
                                                    "rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/60",
                                                  children: [
                                                    e.jsxs("div", {
                                                      className:
                                                        "flex flex-wrap items-center justify-between gap-3",
                                                      children: [
                                                        e.jsx("div", {
                                                          className:
                                                            "font-medium text-slate-950 dark:text-white",
                                                          children:
                                                            s.name ||
                                                            s.agent_id,
                                                        }),
                                                        e.jsxs("div", {
                                                          className:
                                                            "text-sm text-slate-600 dark:text-slate-300",
                                                          children: [
                                                            i(
                                                              s.assigned_leads ??
                                                                0,
                                                            ),
                                                            " leads",
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                    e.jsxs("div", {
                                                      className:
                                                        "mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4",
                                                      children: [
                                                        e.jsx(S, {
                                                          label: "Agent",
                                                          value:
                                                            s.agent_id || "--",
                                                        }),
                                                        e.jsx(S, {
                                                          label: "Assigned",
                                                          value: i(
                                                            s.assigned_leads ??
                                                              0,
                                                          ),
                                                        }),
                                                        e.jsx(S, {
                                                          label: "Closed",
                                                          value: i(
                                                            s.closed_leads ?? 0,
                                                          ),
                                                        }),
                                                        e.jsx(S, {
                                                          label: "Confirmed",
                                                          value: i(
                                                            s.orders_confirmed ??
                                                              0,
                                                          ),
                                                        }),
                                                        e.jsx(S, {
                                                          label: "Converted",
                                                          value: i(
                                                            s.conversions ?? 0,
                                                          ),
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                },
                                                s.agent_id,
                                              ),
                                          ),
                                      }),
                                    ],
                                  })
                                : null,
                              (xe =
                                a == null
                                  ? void 0
                                  : a.buying_pattern_analysis) != null &&
                              xe.length
                                ? e.jsxs("div", {
                                    className:
                                      "rounded-3xl border border-sky-200/70 bg-slate-50/70 p-5 dark:border-sky-500/20 dark:bg-slate-900/60",
                                    children: [
                                      e.jsx("h3", {
                                        className:
                                          "mb-4 text-sm font-semibold text-slate-900 dark:text-white",
                                        children: "Buying Pattern Analysis",
                                      }),
                                      e.jsx("div", {
                                        className: "flex flex-wrap gap-2",
                                        children: a.buying_pattern_analysis.map(
                                          (s) =>
                                            e.jsxs(
                                              m,
                                              {
                                                tone: "slate",
                                                children: [
                                                  s.label,
                                                  " - ",
                                                  i(s.count),
                                                ],
                                              },
                                              s.label,
                                            ),
                                        ),
                                      }),
                                    ],
                                  })
                                : null,
                              a != null && a.lead_distribution
                                ? e.jsxs("div", {
                                    className:
                                      "rounded-3xl border border-sky-200/70 bg-slate-50/70 p-5 dark:border-sky-500/20 dark:bg-slate-900/60",
                                    children: [
                                      e.jsx("h3", {
                                        className:
                                          "mb-4 text-sm font-semibold text-slate-900 dark:text-white",
                                        children: "Lead Distribution",
                                      }),
                                      e.jsx("div", {
                                        className:
                                          "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
                                        children: Object.entries(
                                          a.lead_distribution,
                                        ).map(([s, o]) =>
                                          e.jsxs(
                                            "div",
                                            {
                                              className:
                                                "rounded-2xl border border-slate-200/80 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950/60",
                                              children: [
                                                e.jsx("span", {
                                                  className:
                                                    "text-slate-600 dark:text-slate-300",
                                                  children: s,
                                                }),
                                                e.jsx("span", {
                                                  className:
                                                    "ml-2 font-semibold text-slate-950 dark:text-white",
                                                  children: i(o),
                                                }),
                                              ],
                                            },
                                            s,
                                          ),
                                        ),
                                      }),
                                    ],
                                  })
                                : null,
                              ["factory", "buying_house"].includes(
                                String(P || "").toLowerCase(),
                              )
                                ? e.jsxs("div", {
                                    className: "grid gap-4 lg:grid-cols-2",
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "rounded-3xl border border-sky-200/70 bg-slate-50/70 p-5 dark:border-sky-500/20 dark:bg-slate-900/60",
                                        children: [
                                          e.jsxs("div", {
                                            className:
                                              "mb-4 flex items-center justify-between",
                                            children: [
                                              e.jsx("h3", {
                                                className:
                                                  "text-sm font-semibold text-slate-900 dark:text-white",
                                                children:
                                                  "Recent Profile Viewers",
                                              }),
                                              e.jsx(m, {
                                                tone: "default",
                                                children: "Limit 8",
                                              }),
                                            ],
                                          }),
                                          ee
                                            ? e.jsx(B, {
                                                variant: "bounce",
                                                color: "#6100ff",
                                                size: "medium",
                                                style: { fontSize: "24px" },
                                                text: "",
                                                textColor: "",
                                              })
                                            : e.jsx("div", {
                                                className: "space-y-2",
                                                children: J.length
                                                  ? J.map((s) => {
                                                      var o;
                                                      return e.jsxs(
                                                        "div",
                                                        {
                                                          className:
                                                            "flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950/60",
                                                          children: [
                                                            e.jsx("span", {
                                                              className:
                                                                "truncate text-slate-700 dark:text-slate-300",
                                                              children:
                                                                ((o =
                                                                  s.viewer) ==
                                                                null
                                                                  ? void 0
                                                                  : o.name) ||
                                                                s.viewer_id,
                                                            }),
                                                            e.jsx("span", {
                                                              className:
                                                                "ml-3 shrink-0 text-xs text-slate-500 dark:text-slate-400",
                                                              children: je(
                                                                s.viewed_at,
                                                              ),
                                                            }),
                                                          ],
                                                        },
                                                        s.viewer_id,
                                                      );
                                                    })
                                                  : e.jsx("div", {
                                                      className:
                                                        "text-sm text-slate-500 dark:text-slate-400",
                                                      children:
                                                        "No viewers yet.",
                                                    }),
                                              }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className:
                                          "rounded-3xl border border-sky-200/70 bg-slate-50/70 p-5 dark:border-sky-500/20 dark:bg-slate-900/60",
                                        children: [
                                          e.jsxs("div", {
                                            className:
                                              "mb-4 flex items-center justify-between",
                                            children: [
                                              e.jsx("h3", {
                                                className:
                                                  "text-sm font-semibold text-slate-900 dark:text-white",
                                                children:
                                                  "Recent Product Viewers",
                                              }),
                                              e.jsx(m, {
                                                tone: "default",
                                                children: "Limit 8",
                                              }),
                                            ],
                                          }),
                                          ee
                                            ? e.jsx(B, {
                                                variant: "bounce",
                                                color: "#6100ff",
                                                size: "medium",
                                                style: { fontSize: "24px" },
                                                text: "",
                                                textColor: "",
                                              })
                                            : e.jsx("div", {
                                                className: "space-y-2",
                                                children: X.length
                                                  ? X.map((s) => {
                                                      var o;
                                                      return e.jsxs(
                                                        "div",
                                                        {
                                                          className:
                                                            "flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950/60",
                                                          children: [
                                                            e.jsx("span", {
                                                              className:
                                                                "truncate text-slate-700 dark:text-slate-300",
                                                              children:
                                                                ((o =
                                                                  s.viewer) ==
                                                                null
                                                                  ? void 0
                                                                  : o.name) ||
                                                                s.viewer_id,
                                                            }),
                                                            e.jsx("span", {
                                                              className:
                                                                "ml-3 shrink-0 text-xs text-slate-500 dark:text-slate-400",
                                                              children: je(
                                                                s.viewed_at,
                                                              ),
                                                            }),
                                                          ],
                                                        },
                                                        s.viewer_id,
                                                      );
                                                    })
                                                  : e.jsx("div", {
                                                      className:
                                                        "text-sm text-slate-500 dark:text-slate-400",
                                                      children:
                                                        "No viewers yet.",
                                                    }),
                                              }),
                                        ],
                                      }),
                                    ],
                                  })
                                : null,
                            ],
                          })
                        : e.jsx(rt, {
                            icon: Ge,
                            title: "Premium analytics locked",
                            description:
                              "Premium analytics unlock buying patterns, conversion insights, and agent performance. Upgrade to Premium to view.",
                          }),
                    ],
                  }),
                }),
                e.jsx(k, {
                  as: "section",
                  children: t
                    ? e.jsxs("div", {
                        className:
                          "relative mt-7 rounded-[2rem] border border-sky-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-sky-500/20 dark:bg-slate-950/70",
                        children: [
                          e.jsx(O, {
                            icon: he,
                            title: "Company Analytics",
                            right: t.limited
                              ? e.jsx(m, { tone: "amber", children: "Limited" })
                              : e.jsx(m, { tone: "green", children: "Full" }),
                          }),
                          t.limited
                            ? e.jsx("div", {
                                className:
                                  "mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200",
                                children:
                                  "Advanced analytics (who viewed, inquiry rate, conversion metrics) are available on Premium. Upgrade to unlock full company analytics.",
                              })
                            : null,
                          e.jsxs("div", {
                            className:
                              "grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
                            children: [
                              e.jsx(n, {
                                icon: K,
                                label: "Profile Visits",
                                value: i(v.profile_visits ?? 0),
                                hint: "Profiles",
                                subtle: !0,
                              }),
                              e.jsx(n, {
                                icon: N,
                                label: "Product Views",
                                value: i(v.product_views ?? 0),
                                hint: "Products",
                                subtle: !0,
                              }),
                              e.jsx(n, {
                                icon: I,
                                label: "Inbound Messages",
                                value: i(v.inbound_messages ?? 0),
                                hint: "Messages",
                                subtle: !0,
                              }),
                              e.jsx(n, {
                                icon: w,
                                label: "Conversion Rate",
                                value: C(v.conversion_rate_pct ?? 0),
                                hint: "Percent",
                                subtle: !0,
                              }),
                              e.jsx(n, {
                                icon: N,
                                label: "Avg Response Time",
                                value: v.avg_response_time || "--",
                                hint: "Response",
                                subtle: !0,
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "mt-5 grid gap-4 lg:grid-cols-3",
                            children: [
                              e.jsx(p, {
                                title: "Top Viewed Products",
                                items: ve,
                                emptyText: "No product views yet.",
                                renderItem: (s) =>
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center justify-between",
                                    children: [
                                      e.jsx("span", {
                                        className: "truncate",
                                        children: s.title,
                                      }),
                                      e.jsx("span", {
                                        className:
                                          "ml-3 font-semibold text-slate-950 dark:text-white",
                                        children: i(s.views),
                                      }),
                                    ],
                                  }),
                              }),
                              e.jsx(p, {
                                title: "Profile Visits by Country",
                                items: _e,
                                emptyText: "No visits yet.",
                                renderItem: (s) =>
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center justify-between",
                                    children: [
                                      e.jsx("span", {
                                        className: "truncate",
                                        children: s.country,
                                      }),
                                      e.jsx("span", {
                                        className:
                                          "ml-3 font-semibold text-slate-950 dark:text-white",
                                        children: i(s.count),
                                      }),
                                    ],
                                  }),
                              }),
                              e.jsx(p, {
                                title: "Top Lead Sources",
                                items: Ne,
                                emptyText: "No lead source data yet.",
                                renderItem: (s) =>
                                  e.jsxs("div", {
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "flex items-center justify-between",
                                        children: [
                                          e.jsx("span", {
                                            className: "truncate",
                                            children: s.label,
                                          }),
                                          e.jsx("span", {
                                            className:
                                              "ml-3 font-semibold text-slate-950 dark:text-white",
                                            children: i(s.count),
                                          }),
                                        ],
                                      }),
                                      s.source_type
                                        ? e.jsx("div", {
                                            className:
                                              "text-[10px] text-slate-400",
                                            children: W(s.source_type),
                                          })
                                        : null,
                                    ],
                                  }),
                              }),
                            ],
                          }),
                        ],
                      })
                    : null,
                }),
                e.jsx(k, {
                  as: "section",
                  children: r
                    ? e.jsxs("div", {
                        className:
                          "relative mt-7 rounded-[2rem] border border-sky-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-sky-500/20 dark:bg-slate-950/70",
                        children: [
                          e.jsx(O, {
                            icon: Ke,
                            title: "Platform Analytics",
                            right: e.jsx(m, {
                              tone: "default",
                              children: "Privacy-aware",
                            }),
                          }),
                          e.jsxs("div", {
                            className: "mb-4 grid gap-3 lg:grid-cols-3",
                            children: [
                              e.jsxs("div", {
                                className:
                                  "rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200",
                                children: [
                                  e.jsxs("div", {
                                    className: "font-semibold",
                                    children: ["Scope: ", W(x)],
                                  }),
                                  e.jsxs("div", {
                                    className: "mt-1 text-xs",
                                    children: [
                                      "Privacy thresholds: ",
                                      le ? "applied" : "not applied",
                                      ".",
                                      A.length
                                        ? ` Suppressed controls: ${A.join(", ")}.`
                                        : " No suppressed slices in this snapshot.",
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                className:
                                  "rounded-2xl border border-sky-200 bg-white p-4 text-sm text-slate-700 shadow-sm dark:border-sky-500/20 dark:bg-slate-950 dark:text-slate-300",
                                children: A.length
                                  ? e.jsxs(e.Fragment, {
                                      children: [
                                        e.jsx("div", {
                                          className: "font-semibold",
                                          children: "Suppressed controls",
                                        }),
                                        e.jsx("div", {
                                          className: "mt-1 text-xs",
                                          children: A.join(", "),
                                        }),
                                      ],
                                    })
                                  : e.jsx("div", {
                                      children:
                                        "No suppressed slices in this snapshot.",
                                    }),
                              }),
                              e.jsx("div", {
                                className:
                                  "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
                                children: le
                                  ? e.jsxs("div", {
                                      title:
                                        "Anonymized platform data: identifiers removed/suppressed according to privacy policy",
                                      children: [
                                        e.jsxs("span", {
                                          className:
                                            "inline-flex items-center gap-2 font-semibold",
                                          children: [
                                            e.jsx(ye, { className: "h-4 w-4" }),
                                            " Anonymized platform data",
                                          ],
                                        }),
                                        e.jsx("div", {
                                          className: "mt-1 text-xs",
                                          children:
                                            "Identifiers removed/suppressed according to privacy policy",
                                        }),
                                      ],
                                    })
                                  : e.jsx("div", {
                                      children:
                                        "No anonymization threshold active.",
                                    }),
                              }),
                            ],
                          }),
                          qe
                            ? null
                            : e.jsxs("div", {
                                className:
                                  "mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200",
                                children: [
                                  "Search trends are still warming up. We need more search activity to show reliable demand insights. Current events: ",
                                  Ee,
                                  "/",
                                  $e,
                                  ". Showing proxy demand from buyer requests.",
                                ],
                              }),
                          e.jsxs("div", {
                            className:
                              "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
                            children: [
                              e.jsx(n, {
                                icon: D,
                                label: "Total Buyer Requests",
                                value: i(ae.buyer_requests ?? 0),
                                hint: "Platform",
                                subtle: !0,
                              }),
                              e.jsx(n, {
                                icon: w,
                                label: "Repeat Buyer Rate",
                                value: C(ae.repeat_buyer_rate ?? 0),
                                hint: "Retention",
                                subtle: !0,
                              }),
                              e.jsx(n, {
                                icon: pe,
                                label: "Top Categories",
                                value: ne.length ? ne.join(", ") : "--",
                                hint: "Global",
                                subtle: !0,
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "mt-5 grid gap-4 lg:grid-cols-2",
                            children:
                              x !== "platform_summary_aggregated"
                                ? e.jsxs("div", {
                                    className:
                                      "grid gap-4 lg:grid-cols-2 lg:col-span-2",
                                    children: [
                                      e.jsx(p, {
                                        title: "Top Categories by Country",
                                        items: Ce,
                                        emptyText: "No data yet.",
                                        renderItem: (s) =>
                                          e.jsxs("div", {
                                            children: [
                                              e.jsx("div", {
                                                className:
                                                  "font-medium text-slate-900 dark:text-white",
                                                children: s.country,
                                              }),
                                              e.jsx("div", {
                                                className:
                                                  "text-xs text-slate-500 dark:text-slate-400",
                                                children:
                                                  (s.categories || [])
                                                    .map((o) => o.label)
                                                    .join(", ") || "--",
                                              }),
                                            ],
                                          }),
                                      }),
                                      e.jsx(p, {
                                        title: "Price Range Demand",
                                        items: Se,
                                        emptyText: "No price-range data yet.",
                                        renderItem: (s) =>
                                          e.jsxs("div", {
                                            className:
                                              "flex items-center justify-between",
                                            children: [
                                              e.jsx("span", {
                                                className: "truncate",
                                                children: s.bucket,
                                              }),
                                              e.jsx("span", {
                                                className:
                                                  "ml-3 font-semibold text-slate-950 dark:text-white",
                                                children: i(s.count),
                                              }),
                                            ],
                                          }),
                                      }),
                                    ],
                                  })
                                : e.jsx("div", {
                                    className:
                                      "rounded-3xl border border-dashed border-sky-200 bg-white/70 p-6 text-sm text-slate-600 shadow-sm dark:border-sky-500/20 dark:bg-slate-950/60 dark:text-slate-300 lg:col-span-2",
                                    children:
                                      "Detailed geography and segment breakdowns are hidden for this role. Switch to organization-scoped or admin scope for deeper cuts.",
                                  }),
                          }),
                          e.jsxs("div", {
                            className: "mt-5 grid gap-4 lg:grid-cols-2",
                            children: [
                              e.jsx(p, {
                                title: "Top Search Categories",
                                items: Ae,
                                emptyText: "No search data yet.",
                                renderItem: (s) =>
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center justify-between",
                                    children: [
                                      e.jsx("span", {
                                        className: "truncate",
                                        children: s.label,
                                      }),
                                      e.jsx("span", {
                                        className:
                                          "ml-3 font-semibold text-slate-950 dark:text-white",
                                        children: i(s.count),
                                      }),
                                    ],
                                  }),
                              }),
                              e.jsx(p, {
                                title: "Trending Searches (30d)",
                                items: Re,
                                emptyText: "No trend data yet.",
                                renderItem: (s) =>
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center justify-between",
                                    children: [
                                      e.jsx("span", {
                                        className: "truncate",
                                        children: s.label,
                                      }),
                                      e.jsx("span", {
                                        className:
                                          "ml-3 font-semibold text-slate-950 dark:text-white",
                                        children: s.delta,
                                      }),
                                    ],
                                  }),
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "mt-5 grid gap-4 lg:grid-cols-2",
                            children: [
                              e.jsx(p, {
                                title: "Search Categories by Country",
                                items: Pe,
                                emptyText: "No search data yet.",
                                renderItem: (s) =>
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("div", {
                                        className:
                                          "font-medium text-slate-900 dark:text-white",
                                        children: s.country,
                                      }),
                                      e.jsx("div", {
                                        className:
                                          "text-xs text-slate-500 dark:text-slate-400",
                                        children:
                                          (s.categories || [])
                                            .map((o) => o.label)
                                            .join(", ") || "--",
                                      }),
                                    ],
                                  }),
                              }),
                              e.jsx(p, {
                                title: "Monthly Demand Trend",
                                items: Te,
                                emptyText: "No monthly data yet.",
                                renderItem: (s) =>
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center justify-between",
                                    children: [
                                      e.jsx("span", {
                                        className: "truncate",
                                        children: s.month,
                                      }),
                                      e.jsx("span", {
                                        className:
                                          "ml-3 font-semibold text-slate-950 dark:text-white",
                                        children: i(s.count),
                                      }),
                                    ],
                                  }),
                              }),
                            ],
                          }),
                        ],
                      })
                    : null,
                }),
              ],
            }),
          }),
        });
}
export { jt as default };
