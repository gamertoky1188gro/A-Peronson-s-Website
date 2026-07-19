import {
  o as Me,
  r as o,
  d as S,
  g as E,
  _ as Pe,
  k as De,
  n as Ae,
  j as e,
  N as we,
  S as M,
  ak as Ee,
  W as qe,
  l as Be,
  aj as Te,
} from "./index-CNnTWoea.js";
import { u as Oe } from "./useAnalyticsDashboard-IgRh5kub.js";
import { L as $e, S as He } from "./ScaleIn-CXJI3CKy.js";
import { C as Re } from "./CountUp-BnQavvVv.js";
import { S as Le, a as ae } from "./StaggerContainer-WchD9d0t.js";
import { H as Ie } from "./HoverCard-CJ0AVagV.js";
import { C as ze } from "./CardStack-DRC4jBKM.js";
import Ve from "./VerificationPage-glkUhyKG.js";
import Ue from "./OrgSettings-VCvspWg4.js";
import "./UploadProgressBar-D72lm7cT.js";
import "./useSecureUser-DoQht3Qe.js";
import "./ProfileImageUpload-BTimer5k.js";
const We = [
  "Discovered",
  "Matched",
  "Contacted",
  "Meeting scheduled",
  "Negotiating",
  "Contract drafted",
  "Contract signed",
  "Closed",
];
function Qe(t) {
  var x;
  const l = t.lifecycle_status || "draft",
    d = ((x = t.artifact) == null ? void 0 : x.status) || "draft",
    i =
      l === "archived" || d === "locked"
        ? "Archived"
        : l === "signed"
          ? "Lock pending"
          : t.buyer_signature_state === "signed" &&
              t.factory_signature_state === "signed"
            ? "Generate PDF"
            : t.buyer_signature_state === "signed" ||
                t.factory_signature_state === "signed"
              ? "Other party sign"
              : "Awaiting signatures",
    k =
      l === "draft"
        ? "Draft"
        : l === "pending_signature"
          ? "Pending"
          : l === "signed"
            ? "Signed"
            : "Archived",
    q = d === "generated" || d === "locked" ? "ready" : "pending",
    V = t.buyer_signature_state || "pending",
    A = t.factory_signature_state || "pending",
    Q =
      l === "archived"
        ? 7
        : l === "signed"
          ? 6
          : l === "pending_signature"
            ? 5
            : 2;
  return {
    id: t.id,
    contract_number: t.contract_number || t.id,
    status: k,
    title: t.title || "",
    buyer: t.buyer_name || "",
    factory: t.factory_name || "",
    date: t.created_at ? new Date(t.created_at).toLocaleDateString() : "",
    next: i,
    buyerSign: V,
    factorySign: A,
    pdf: q,
    timeline: We,
    timelineIdx: Q,
    raw: t,
  };
}
function _(...t) {
  return t.filter(Boolean).join(" ");
}
function w({ path: t, className: l = "", viewBox: d = "0 0 24 24" }) {
  return e.jsx("svg", {
    viewBox: d,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: l,
    children: e.jsx("path", { d: t }),
  });
}
const m = {
  vault: (t) =>
    e.jsx(w, {
      ...t,
      path: "M4 7.5 12 3l8 4.5v9L12 21l-8-4.5zM12 12v9M4 7.5l8 4.5 8-4.5",
    }),
  dashboard: (t) =>
    e.jsx(w, {
      ...t,
      path: "M4 5h7v7H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 14h7v5H4z",
    }),
  bell: (t) =>
    e.jsx(w, {
      ...t,
      path: "M15 17H5l1.6-1.6A2 2 0 0 0 7 14v-3a5 5 0 0 1 10 0v3a2 2 0 0 0 .4 1.2L19 17h-4m-4 2a2 2 0 0 0 4 0",
    }),
  plus: (t) => e.jsx(w, { ...t, path: "M12 5v14M5 12h14" }),
  refresh: (t) =>
    e.jsx(w, { ...t, path: "M20 12a8 8 0 1 1-2.34-5.66M20 4v6h-6" }),
  search: (t) =>
    e.jsx(w, {
      ...t,
      path: "M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
    }),
  chat: (t) =>
    e.jsx(w, {
      ...t,
      path: "M21 15a4 4 0 0 1-4 4H9l-5 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4Z",
    }),
  lock: (t) =>
    e.jsx(w, { ...t, path: "M7 11V8a5 5 0 0 1 10 0v3m-11 0h12v10H6z" }),
  download: (t) =>
    e.jsx(w, { ...t, path: "M12 3v10m0 0 4-4m-4 4-4-4M4 17v3h16v-3" }),
  shield: (t) =>
    e.jsx(w, { ...t, path: "M12 3 20 6v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z" }),
  check: (t) => e.jsx(w, { ...t, path: "M20 6 9 17l-5-5" }),
  file: (t) =>
    e.jsx(w, {
      ...t,
      path: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5",
    }),
  phone: (t) =>
    e.jsx(w, {
      ...t,
      path: "M5 4h4l2 5-2 2c1.5 3 3.5 5 6 6l2-2 5 2v4c0 1.1-.9 2-2 2C10.5 21 3 13.5 3 5c0-1.1.9-2 2-2Z",
    }),
};
function z({ children: t, tone: l = "default" }) {
  const d = {
    default: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80",
    blue: "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-300",
    green:
      "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300",
    amber:
      "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300",
    violet:
      "bg-violet-500/10 text-violet-700 ring-1 ring-violet-500/20 dark:text-violet-300",
    red: "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300",
  };
  return e.jsx("span", {
    className: _(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
      d[l],
    ),
    children: t,
  });
}
function O({ title: t, subtitle: l, right: d, children: i }) {
  return e.jsxs("section", {
    className:
      "rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_20px_60px_rgba(2,8,23,0.4)]",
    children: [
      e.jsxs("div", {
        className: "mb-4 flex items-start justify-between gap-4",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h2", {
                className:
                  "text-base font-semibold text-slate-900 dark:text-white",
                children: t,
              }),
              l
                ? e.jsx("p", {
                    className:
                      "mt-1 text-sm text-slate-500 dark:text-slate-400",
                    children: l,
                  })
                : null,
            ],
          }),
          d,
        ],
      }),
      i,
    ],
  });
}
function Je({ label: t, active: l, done: d, last: i }) {
  return e.jsxs("div", {
    className: "flex items-start gap-3",
    children: [
      e.jsxs("div", {
        className: "flex flex-col items-center",
        children: [
          e.jsx("div", {
            className: _(
              "grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold",
              d
                ? "border-sky-500 bg-sky-500 text-white"
                : l
                  ? "border-sky-400 bg-sky-500/10 text-sky-600 dark:text-sky-300"
                  : "border-slate-300 bg-white text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-400",
            ),
            children: d
              ? e.jsx(m.check, { className: "h-4 w-4" })
              : l
                ? "•"
                : "○",
          }),
          i
            ? null
            : e.jsx("div", {
                className: _(
                  "mt-2 h-10 w-px",
                  d ? "bg-sky-400/80" : "bg-slate-200 dark:bg-white/10",
                ),
              }),
        ],
      }),
      e.jsx("div", {
        className: "pb-4 pt-1",
        children: e.jsx("div", {
          className: _(
            "text-sm font-medium",
            l || d
              ? "text-slate-900 dark:text-white"
              : "text-slate-500 dark:text-slate-400",
          ),
          children: t,
        }),
      }),
    ],
  });
}
function te({ icon: t, label: l, count: d, active: i, onClick: k }) {
  return e.jsxs("button", {
    onClick: k,
    className: _(
      "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition",
      i
        ? "bg-sky-600 text-white shadow-lg shadow-sky-500/20"
        : "bg-slate-50 text-slate-700 hover:bg-sky-50 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10",
    ),
    children: [
      e.jsxs("span", {
        className: "flex items-center gap-3",
        children: [
          e.jsx("span", {
            className: _(
              "grid h-8 w-8 place-items-center rounded-xl",
              i ? "bg-white/15" : "bg-white dark:bg-white/10",
            ),
            children: t({ className: "h-4 w-4" }),
          }),
          l,
        ],
      }),
      d
        ? e.jsx("span", {
            className: _(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              i
                ? "bg-white/15 text-white"
                : "bg-sky-500/10 text-sky-600 dark:text-sky-300",
            ),
            children: d,
          })
        : null,
    ],
  });
}
function ye({ label: t, value: l }) {
  return e.jsxs("div", {
    className: "rounded-2xl bg-slate-100 px-3 py-2 dark:bg-white/5",
    children: [
      e.jsx("div", {
        className:
          "text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400",
        children: t,
      }),
      e.jsx("div", {
        className:
          "mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200",
        children: l,
      }),
    ],
  });
}
function Ne({ icon: t, title: l, body: d }) {
  return e.jsxs("div", {
    className:
      "rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5",
    children: [
      e.jsxs("div", {
        className:
          "flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white",
        children: [
          e.jsx("span", {
            className:
              "grid h-8 w-8 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300",
            children: t,
          }),
          l,
        ],
      }),
      e.jsx("div", { className: "mt-3", children: d }),
    ],
  });
}
function _e({ label: t, status: l }) {
  return e.jsxs("div", {
    className:
      "rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5",
    children: [
      e.jsx("div", {
        className:
          "text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400",
        children: t,
      }),
      e.jsx("div", {
        className:
          "mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white",
        children: e.jsx(z, { tone: "green", children: l }),
      }),
    ],
  });
}
function I({ icon: t, title: l, subtitle: d, disabled: i, onClick: k }) {
  return e.jsxs("button", {
    disabled: i,
    onClick: k,
    className: _(
      "rounded-2xl border p-4 text-left transition",
      i
        ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
        : "border-sky-500/20 bg-sky-500/5 text-slate-900 hover:-translate-y-0.5 dark:text-white",
    ),
    children: [
      e.jsxs("div", {
        className: "flex items-center gap-2 text-sm font-semibold",
        children: [
          e.jsx("span", {
            className:
              "grid h-7 w-7 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300",
            children: t,
          }),
          l,
        ],
      }),
      e.jsx("div", {
        className: "mt-2 text-xs text-slate-500 dark:text-slate-400",
        children: d,
      }),
    ],
  });
}
function j({ label: t, value: l }) {
  return e.jsxs("div", {
    className:
      "flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5",
    children: [
      e.jsx("span", {
        className: "text-slate-500 dark:text-slate-400",
        children: t,
      }),
      e.jsx("span", {
        className: "text-right font-medium text-slate-900 dark:text-white",
        children: l,
      }),
    ],
  });
}
function U({ label: t, value: l, placeholder: d, onChange: i }) {
  return e.jsxs("label", {
    className: "block",
    children: [
      e.jsx("span", {
        className:
          "mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400",
        children: t,
      }),
      e.jsx("input", {
        value: l,
        placeholder: d,
        onChange: i,
        className:
          "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500",
      }),
    ],
  });
}
function se({ step: t, done: l }) {
  return e.jsxs("div", {
    className:
      "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5",
    children: [
      e.jsx("span", {
        className: _(
          "grid h-6 w-6 place-items-center rounded-full text-xs font-bold",
          l
            ? "bg-emerald-500 text-white"
            : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400",
        ),
        children: l ? "✓" : "•",
      }),
      e.jsx("span", {
        className: "font-medium text-slate-900 dark:text-white",
        children: t,
      }),
    ],
  });
}
function Ge(t) {
  return (
    (t == null ? void 0 : t.role) === "owner" ||
    (t == null ? void 0 : t.role) === "admin"
  );
}
function Ze({ embedded: t = !1 }) {
  var ue, J, G, Z, K, Y, X, ee;
  const { theme: l, toggleTheme: d } = Me(),
    [i, k] = o.useState(""),
    [q, V] = o.useState(null),
    [A, Q] = o.useState("All"),
    [x, C] = o.useState(!1),
    [$, p] = o.useState([]),
    [re, y] = o.useState(!0),
    [g, L] = o.useState({
      type: "bank_transfer",
      transaction_reference: "",
      bank_name: "",
      sender_account_name: "",
      receiver_account_name: "",
      transaction_date: "",
      amount: "",
      currency: "USD",
      document_file: null,
    }),
    le = o.useRef(null),
    [ne, pe] = o.useState(null);
  (o.useEffect(() => {
    const s = le.current;
    if (!s || !t) return;
    const n = new ResizeObserver(([u]) => pe(u.contentRect.height));
    return (n.observe(s), () => n.disconnect());
  }, [t]),
    o.useEffect(() => {
      let s = !1,
        n = !1,
        u = !1;
      function T() {
        n && u && !s && y(!1);
      }
      return (
        (async () => {
          try {
            const a = await S("/documents/contracts", { token: E() });
            if (s) return;
            const f = (Array.isArray(a) ? a : []).map(Qe);
            (p(f), f.length > 0 && V(f[0].id));
          } catch (a) {
            console.warn("Failed to load contracts", a);
          } finally {
            ((n = !0), T());
          }
        })(),
        (async () => {
          try {
            await Pe(E());
          } finally {
            ((u = !0), T());
          }
        })(),
        () => {
          s = !0;
        }
      );
    }, []));
  const r = $.find((s) => s.id === q) || $[0] || null,
    ie = o.useMemo(() => De(), []),
    de = Ae(),
    fe = o.useMemo(
      () =>
        $.filter((s) => {
          const n = [
              s.id,
              s.contract_number,
              s.status,
              s.title,
              s.buyer,
              s.factory,
            ]
              .join(" ")
              .toLowerCase()
              .includes(i.toLowerCase()),
            u = A === "All" ? !0 : s.status.toLowerCase() === A.toLowerCase();
          return n && u;
        }),
      [i, A, $],
    ),
    ce = l === "dark" ? "dark" : "",
    P = async (s, n) => {
      C(!0);
      try {
        await s();
      } catch (u) {
        console.error(u.message || n);
      } finally {
        C(!1);
      }
    },
    h = (r == null ? void 0 : r.id) || "",
    c = async () => {
      const s = E();
      !s ||
        !h ||
        (await P(async () => {
          const n = await S(`/documents/contracts/${h}/sign-session`, {
            method: "POST",
            token: s,
          });
          n != null && n.signing_url && window.open(n.signing_url, "_blank");
        }, "Failed to create session"));
    },
    F = () => {
      var n, u;
      const s =
        (u = (n = r == null ? void 0 : r.raw) == null ? void 0 : n.artifact) ==
        null
          ? void 0
          : u.pdf_path;
      s && window.open(`${Ee}${s}`, "_blank");
    },
    H = async () => {
      const s = E();
      !s ||
        !h ||
        (await P(async () => {
          await S(`/documents/contracts/${h}/signatures`, {
            method: "PATCH",
            token: s,
            body: { buyer_signature_state: "signed", is_draft: !1 },
          });
        }, "Failed to sign"));
    },
    v = async () => {
      const s = E();
      !s ||
        !h ||
        (await P(async () => {
          await S(`/documents/contracts/${h}/signatures`, {
            method: "PATCH",
            token: s,
            body: { factory_signature_state: "signed", is_draft: !1 },
          });
        }, "Failed to sign"));
    },
    oe = async () => {
      const s = E();
      !s ||
        !h ||
        (await P(async () => {
          await S(`/documents/contracts/${h}/artifact`, {
            method: "PATCH",
            token: s,
            body: { status: "locked" },
          });
        }, "Failed to lock"));
    },
    B = async () => {
      const s = E();
      !s ||
        !h ||
        (await P(async () => {
          await S(`/documents/contracts/${h}/artifact`, {
            method: "PATCH",
            token: s,
            body: { status: "archived" },
          });
        }, "Failed to archive"));
    },
    xe = async () => {
      const s = E();
      !s ||
        !h ||
        (await P(async () => {
          await S("/payment-proofs", {
            method: "POST",
            token: s,
            body: {
              contract_id: h,
              type: g.type,
              transaction_reference: g.transaction_reference,
              bank_name: g.bank_name,
              sender_account_name: g.sender_account_name,
              receiver_account_name: g.receiver_account_name,
              transaction_date: g.transaction_date,
              amount: g.amount,
              currency: g.currency,
            },
          });
        }, "Failed to submit proof"));
    },
    R = ie && Ge(ie);
  if (re)
    return t
      ? e.jsx("div", {
          className: "flex items-center justify-center py-12",
          children: e.jsx(we, {}),
        })
      : e.jsx(we, { fill: !0 });
  if (!r)
    return t
      ? e.jsx("div", {
          className: "text-center py-12 text-slate-500 dark:text-slate-400",
          children: "No contracts found.",
        })
      : e.jsx("div", {
          className: ce,
          children: e.jsx("div", {
            className: "flex min-h-screen items-center justify-center",
            children: e.jsx("p", {
              className: "text-slate-500 dark:text-slate-400",
              children: "No contracts found.",
            }),
          }),
        });
  const me = e.jsxs("aside", {
      "data-lenis-prevent": !0,
      className:
        "flex flex-col overflow-y-auto scrollbar-hide max-h-full rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_20px_60px_rgba(2,8,23,0.4)]",
      children: [
        e.jsxs("div", {
          className: "flex items-center justify-between shrink-0",
          children: [
            e.jsxs("div", {
              children: [
                e.jsxs("div", {
                  className:
                    "inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-sky-600 dark:text-sky-300",
                  children: [e.jsx(m.vault, { className: "h-5 w-5" }), "Vault"],
                }),
                e.jsx("h1", {
                  className:
                    "mt-3 text-2xl font-semibold text-slate-900 dark:text-white",
                  children: "Contract Vault",
                }),
                e.jsx("p", {
                  className: "mt-1 text-sm text-slate-500 dark:text-slate-400",
                  children: "Draft → Sign → PDF artifact → Lock → Archive",
                }),
              ],
            }),
            !t &&
              e.jsx("button", {
                onClick: () => {
                  (d(), window.dispatchEvent(new Event("theme-change")));
                },
                className:
                  "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200",
                children: l === "dark" ? "Light" : "Dark",
              }),
          ],
        }),
        !t &&
          e.jsxs("div", {
            className: "mt-6 grid gap-2 shrink-0",
            children: [
              e.jsx(te, {
                icon: m.dashboard,
                label: "Dashboard",
                onClick: () => de("/owner"),
              }),
              e.jsx(te, {
                icon: m.bell,
                label: "Notifications",
                onClick: () => de("/notifications"),
              }),
              e.jsx(te, { icon: m.plus, label: "New draft" }),
              e.jsx(te, { icon: m.file, label: "Contracts", active: !0 }),
              e.jsx(te, { icon: m.refresh, label: "Refresh" }),
            ],
          }),
        e.jsxs("div", {
          className: "shrink-0",
          children: [
            e.jsx(M, {
              as: "section",
              children: e.jsxs("div", {
                className:
                  "mt-6 rounded-2xl border border-sky-500/15 bg-sky-500/5 p-4 dark:border-sky-400/20 dark:bg-sky-400/10",
                children: [
                  e.jsxs("div", {
                    className:
                      "flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-200",
                    children: [
                      e.jsx(m.search, { className: "h-4 w-4" }),
                      "Search by number, buyer, factory, title...",
                    ],
                  }),
                  e.jsxs("div", {
                    className:
                      "mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-slate-950",
                    children: [
                      e.jsx("input", {
                        value: i,
                        onChange: (s) => k(s.target.value),
                        placeholder: "Search contracts",
                        className:
                          "w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500",
                      }),
                      e.jsx("span", {
                        className:
                          "ml-3 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
                        children: "Ctrl K",
                      }),
                    ],
                  }),
                ],
              }),
            }),
            e.jsx(M, {
              as: "section",
              children: e.jsx("div", {
                className: "mt-6 flex flex-wrap gap-2",
                children: ["All", "Draft", "Pending", "Signed", "Archived"].map(
                  (s) =>
                    e.jsx(
                      "button",
                      {
                        onClick: () => Q(s),
                        className: _(
                          "rounded-full px-3 py-2 text-sm font-medium transition",
                          A === s
                            ? "bg-sky-600 text-white shadow-lg shadow-sky-500/20"
                            : "bg-slate-100 text-slate-700 hover:bg-sky-50 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10",
                        ),
                        children: s,
                      },
                      s,
                    ),
                ),
              }),
            }),
          ],
        }),
        e.jsx("div", {
          className: "flex-1 min-h-0 mt-6",
          children: e.jsx(Le, {
            className: "space-y-3",
            children: fe.map((s) =>
              e.jsx(
                ae,
                {
                  children: e.jsxs("button", {
                    layout: !0,
                    onClick: () => V(s.id),
                    className: _(
                      "w-full rounded-3xl border p-4 text-left transition hover:-translate-y-0.5",
                      q === s.id
                        ? "border-sky-500/40 bg-sky-500/10 shadow-lg shadow-sky-500/10 dark:bg-sky-400/10"
                        : "border-slate-200 bg-white/70 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8",
                    ),
                    children: [
                      e.jsxs("div", {
                        className: "flex items-start justify-between gap-3",
                        children: [
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", {
                                className:
                                  "text-sm font-semibold text-slate-900 dark:text-white",
                                children: s.id,
                              }),
                              e.jsxs("div", {
                                className: "mt-1 flex items-center gap-2",
                                children: [
                                  e.jsx(z, {
                                    tone: "green",
                                    children: s.status,
                                  }),
                                  e.jsx("span", {
                                    className:
                                      "text-sm font-medium text-slate-700 dark:text-slate-300",
                                    children: s.title,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className:
                              "text-right text-xs text-slate-500 dark:text-slate-400",
                            children: s.date,
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className:
                          "mt-3 text-sm text-slate-600 dark:text-slate-300",
                        children: [
                          "Buyer: ",
                          s.buyer,
                          " · Factory: ",
                          s.factory,
                        ],
                      }),
                      e.jsxs("div", {
                        className:
                          "mt-3 grid grid-cols-1 gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-3",
                        children: [
                          e.jsx(ye, { label: "Next", value: s.next }),
                          e.jsx(ye, { label: "Buyer", value: s.buyerSign }),
                          e.jsx(ye, { label: "Factory", value: s.factorySign }),
                        ],
                      }),
                    ],
                  }),
                },
                s.id,
              ),
            ),
          }),
        }),
      ],
    }),
    he = e.jsxs("div", {
      className: _(
        t
          ? "flex flex-col xl:flex-row max-h-full gap-4 items-start"
          : "grid max-h-full gap-4 xl:grid-cols-[280px_minmax(0,1fr)]",
      ),
      children: [
        t
          ? e.jsx("div", {
              className: "w-full xl:w-[280px] shrink-0",
              style: { maxHeight: ne ? `${ne}px` : void 0 },
              children: me,
            })
          : e.jsx(ze, { className: "h-full", children: me }),
        e.jsxs("main", {
          ref: le,
          "data-lenis-prevent": !0,
          className: _(
            t
              ? "flex-1 min-w-0 min-h-0 overflow-y-auto scrollbar-hide max-h-full"
              : "grid overflow-y-auto scrollbar-hide max-h-full xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]",
          ),
          children: [
            e.jsxs("div", {
              className: "space-y-4",
              children: [
                e.jsx(M, {
                  as: "section",
                  children: e.jsxs(O, {
                    title: r.id,
                    subtitle: `${r.status} · ${r.title}`,
                    right: e.jsx(z, { tone: "green", children: r.status }),
                    children: [
                      e.jsxs("div", {
                        className:
                          "flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300",
                        children: [
                          e.jsxs("span", { children: ["Buyer: ", r.buyer] }),
                          e.jsx("span", { children: "•" }),
                          e.jsxs("span", {
                            children: ["Factory: ", r.factory],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className:
                          "mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
                        children: [
                          e.jsxs("div", {
                            className:
                              "rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("div", {
                                        className:
                                          "text-sm font-semibold text-slate-900 dark:text-white",
                                        children: "Journey Timeline",
                                      }),
                                      e.jsx("div", {
                                        className:
                                          "mt-1 text-xs text-slate-500 dark:text-slate-400",
                                        children:
                                          "Video calls are recommended before finalizing contracts. No recorded call is linked to this contract yet.",
                                      }),
                                    ],
                                  }),
                                  e.jsx(z, { tone: "blue", children: "Help" }),
                                ],
                              }),
                              e.jsx("div", {
                                className: "mt-4 space-y-0",
                                children: r.timeline.map((s, n) =>
                                  e.jsx(
                                    Je,
                                    {
                                      label: s,
                                      done: n < r.timelineIdx,
                                      active: n === r.timelineIdx,
                                      last: n === r.timeline.length - 1,
                                    },
                                    s,
                                  ),
                                ),
                              }),
                              e.jsxs("button", {
                                onClick: () => de("/chat"),
                                className:
                                  "mt-2 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5",
                                children: [
                                  e.jsx(m.chat, { className: "h-4 w-4" }),
                                  "Open chat",
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "space-y-4",
                            children: [
                              e.jsx(Ne, {
                                icon: e.jsx(m.check, { className: "h-4 w-4" }),
                                title: "Signatures",
                                body: e.jsxs(e.Fragment, {
                                  children: [
                                    e.jsxs("div", {
                                      className: "grid gap-3 sm:grid-cols-2",
                                      children: [
                                        e.jsx(_e, {
                                          label: "Buyer",
                                          status: r.buyerSign,
                                        }),
                                        e.jsx(_e, {
                                          label: "Factory",
                                          status: r.factorySign,
                                        }),
                                      ],
                                    }),
                                    e.jsx("div", {
                                      className:
                                        "mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100",
                                      children:
                                        "Warning: No accepted payment proof yet. You may continue, but proof is strongly recommended for safety.",
                                    }),
                                    e.jsxs("div", {
                                      className:
                                        "mt-4 grid gap-3 sm:grid-cols-2",
                                      children: [
                                        e.jsx(I, {
                                          icon: e.jsx(m.check, {
                                            className: "h-4 w-4",
                                          }),
                                          title: "Buyer sign",
                                          subtitle: R
                                            ? "Sign as buyer"
                                            : "Already signed.",
                                          disabled:
                                            !R || r.buyerSign === "signed",
                                          onClick: H,
                                        }),
                                        e.jsx(I, {
                                          icon: e.jsx(m.shield, {
                                            className: "h-4 w-4",
                                          }),
                                          title: "Factory sign",
                                          subtitle: R
                                            ? "Sign as factory"
                                            : "Already signed.",
                                          disabled:
                                            !R || r.factorySign === "signed",
                                          onClick: v,
                                        }),
                                        e.jsx(I, {
                                          icon: e.jsx(m.check, {
                                            className: "h-4 w-4",
                                          }),
                                          title: "E-sign session",
                                          subtitle: "Create signing session",
                                          disabled: x,
                                          onClick: c,
                                        }),
                                        e.jsx(I, {
                                          icon: e.jsx(m.shield, {
                                            className: "h-4 w-4",
                                          }),
                                          title: "Lock PDF",
                                          subtitle: "Lock the PDF",
                                          disabled: x,
                                          onClick: oe,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              }),
                              e.jsx(Ne, {
                                icon: e.jsx(m.file, { className: "h-4 w-4" }),
                                title: "Artifact (PDF)",
                                body: e.jsxs("div", {
                                  children: [
                                    e.jsxs("div", {
                                      className:
                                        "flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300",
                                      children: [
                                        e.jsxs(z, {
                                          tone: "blue",
                                          children: ["Status: ", r.pdf],
                                        }),
                                        e.jsx("span", {
                                          children:
                                            "PDF generates automatically after both signatures.",
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      className: "mt-4 flex flex-wrap gap-3",
                                      children: [
                                        e.jsx(I, {
                                          icon: e.jsx(m.lock, {
                                            className: "h-4 w-4",
                                          }),
                                          title: "Lock PDF",
                                          subtitle: "Lock the PDF",
                                          disabled: x,
                                          onClick: oe,
                                        }),
                                        e.jsx(I, {
                                          icon: e.jsx(m.download, {
                                            className: "h-4 w-4",
                                          }),
                                          title: "Download PDF",
                                          subtitle: "Ready to export",
                                          onClick: F,
                                        }),
                                        e.jsx(I, {
                                          icon: e.jsx(m.shield, {
                                            className: "h-4 w-4",
                                          }),
                                          title: "Archive",
                                          subtitle: "Archive contract",
                                          disabled: x,
                                          onClick: B,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                e.jsx(M, {
                  as: "section",
                  children: e.jsxs("div", {
                    className: "grid gap-4 lg:grid-cols-2",
                    children: [
                      e.jsx(O, {
                        title: "Banking references (optional)",
                        subtitle:
                          "For fraud prevention only. No direct payments are processed on-platform.",
                        right: e.jsx(z, {
                          tone: "violet",
                          children: "Visible",
                        }),
                        children: e.jsxs("div", {
                          className:
                            "grid gap-3 text-sm text-slate-700 dark:text-slate-300",
                          children: [
                            e.jsx(j, {
                              label: "Bank name",
                              value:
                                ((ue = r == null ? void 0 : r.raw) == null
                                  ? void 0
                                  : ue.bank_name) || "—",
                            }),
                            e.jsx(j, {
                              label: "Beneficiary",
                              value:
                                ((J = r == null ? void 0 : r.raw) == null
                                  ? void 0
                                  : J.beneficiary_name) || "—",
                            }),
                            e.jsx(j, {
                              label: "Transaction reference",
                              value:
                                ((G = r == null ? void 0 : r.raw) == null
                                  ? void 0
                                  : G.transaction_reference) || "—",
                            }),
                          ],
                        }),
                      }),
                      e.jsx(O, {
                        title: "Payment proof workflow",
                        subtitle:
                          "Submit bank transfer or LC documents. Seller review sets status, disputes trigger internal admin review.",
                        right: e.jsx("button", {
                          className:
                            "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200",
                          children: "Refresh",
                        }),
                        children: e.jsxs("div", {
                          className: "grid gap-3",
                          children: [
                            e.jsxs("div", {
                              className: "grid gap-3 sm:grid-cols-2",
                              children: [
                                e.jsx("label", {
                                  className:
                                    "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                  children: "Proof type",
                                }),
                                e.jsxs("select", {
                                  value: g.type,
                                  onChange: (s) =>
                                    L((n) => ({ ...n, type: s.target.value })),
                                  className:
                                    "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950",
                                  children: [
                                    e.jsx("option", {
                                      value: "bank_transfer",
                                      children: "Bank transfer",
                                    }),
                                    e.jsx("option", {
                                      value: "lc",
                                      children: "Letter of credit (LC)",
                                    }),
                                  ],
                                }),
                                e.jsx(U, {
                                  label: "Transaction reference",
                                  value: g.transaction_reference,
                                  placeholder: "Enter reference",
                                  onChange: (s) =>
                                    L((n) => ({
                                      ...n,
                                      transaction_reference: s.target.value,
                                    })),
                                }),
                                e.jsx(U, {
                                  label: "Bank name",
                                  value: g.bank_name,
                                  placeholder: "Bank name",
                                  onChange: (s) =>
                                    L((n) => ({
                                      ...n,
                                      bank_name: s.target.value,
                                    })),
                                }),
                                e.jsx(U, {
                                  label: "Sender account name",
                                  value: g.sender_account_name,
                                  placeholder: "Sender account",
                                  onChange: (s) =>
                                    L((n) => ({
                                      ...n,
                                      sender_account_name: s.target.value,
                                    })),
                                }),
                                e.jsx(U, {
                                  label: "Receiver/company account name",
                                  value: g.receiver_account_name,
                                  placeholder: "Receiver account",
                                  onChange: (s) =>
                                    L((n) => ({
                                      ...n,
                                      receiver_account_name: s.target.value,
                                    })),
                                }),
                                e.jsx(U, {
                                  label: "mm/dd/yyyy",
                                  value: g.transaction_date,
                                  placeholder: "Date",
                                  onChange: (s) =>
                                    L((n) => ({
                                      ...n,
                                      transaction_date: s.target.value,
                                    })),
                                }),
                                e.jsx(U, {
                                  label: "Amount",
                                  value: g.amount,
                                  placeholder: "USD",
                                  onChange: (s) =>
                                    L((n) => ({
                                      ...n,
                                      amount: s.target.value,
                                    })),
                                }),
                              ],
                            }),
                            e.jsxs("label", {
                              className:
                                "block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300",
                              children: [
                                e.jsx("span", {
                                  className: "mb-2 block font-medium",
                                  children: "Upload proof document",
                                }),
                                e.jsx("input", {
                                  type: "file",
                                  className: "block w-full text-sm",
                                }),
                              ],
                            }),
                            e.jsx("button", {
                              onClick: xe,
                              disabled: x,
                              className:
                                "rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:opacity-50",
                              children: "Submit proof",
                            }),
                            e.jsx("div", {
                              className:
                                "rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400",
                              children: "No proofs submitted yet.",
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
            e.jsx("div", {
              className: "space-y-4",
              children: e.jsxs(M, {
                as: "section",
                children: [
                  e.jsx(O, {
                    title: "Contract Snapshot",
                    subtitle: "Focused, premium, and ready for review",
                    right: e.jsx(z, { tone: "blue", children: "Premium" }),
                    children: e.jsxs("div", {
                      className:
                        "space-y-3 text-sm text-slate-700 dark:text-slate-300",
                      children: [
                        e.jsx(j, { label: "Status", value: r.status }),
                        e.jsx(j, { label: "Next", value: r.next }),
                        e.jsx(j, { label: "Buyer sign", value: r.buyerSign }),
                        e.jsx(j, {
                          label: "Factory sign",
                          value: r.factorySign,
                        }),
                        e.jsx(j, { label: "PDF", value: r.pdf }),
                        e.jsx(j, { label: "Date", value: r.date }),
                      ],
                    }),
                  }),
                  e.jsx(O, {
                    title: "Call recordings",
                    subtitle:
                      "Recorded calls are stored for dispute resolution and security (project.md).",
                    children: e.jsxs("div", {
                      className:
                        "rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5",
                      children: [
                        e.jsxs("div", {
                          className:
                            "flex items-center justify-between text-sm",
                          children: [
                            e.jsx("span", {
                              className:
                                "font-medium text-slate-900 dark:text-white",
                              children: "Call recordings",
                            }),
                            e.jsx(m.phone, {
                              className: "h-4 w-4 text-sky-500",
                            }),
                          ],
                        }),
                        e.jsx("p", {
                          className:
                            "mt-2 text-sm text-slate-500 dark:text-slate-400",
                          children: "No calls linked to this contract yet.",
                        }),
                      ],
                    }),
                  }),
                  e.jsx(O, {
                    title: "Artifact audit",
                    subtitle: "Generated, versioned, and traceable",
                    children: e.jsx("div", {
                      className:
                        "grid gap-3 text-sm text-slate-700 dark:text-slate-300",
                      children: (() => {
                        var T;
                        const s =
                            ((T = r == null ? void 0 : r.raw) == null
                              ? void 0
                              : T.artifact) || {},
                          n = s == null ? void 0 : s.signer_ids,
                          u = s == null ? void 0 : s.signature_timestamps;
                        return e.jsxs(e.Fragment, {
                          children: [
                            e.jsx(j, {
                              label: "Status",
                              value: (s == null ? void 0 : s.status) || "—",
                            }),
                            e.jsx(j, {
                              label: "Generated at",
                              value:
                                (s == null ? void 0 : s.generated_at) || "—",
                            }),
                            e.jsx(j, {
                              label: "Version",
                              value:
                                (s == null ? void 0 : s.version) != null
                                  ? String(s.version)
                                  : "—",
                            }),
                            e.jsx(j, {
                              label: "Hash",
                              value: (s == null ? void 0 : s.pdf_hash) || "—",
                            }),
                            e.jsx(j, {
                              label: "Signer IDs",
                              value: n
                                ? `Buyer ${n.buyer_id || "—"} · Factory ${n.factory_id || "—"}`
                                : "—",
                            }),
                            e.jsx(j, {
                              label: "Signature timestamps",
                              value: u
                                ? `Buyer ${u.buyer_signed_at || "—"} · Factory ${u.factory_signed_at || "—"}`
                                : "—",
                            }),
                          ],
                        });
                      })(),
                    }),
                  }),
                  e.jsx(O, {
                    title: "Contract Audit Trail",
                    subtitle: "Premium access gate",
                    children: e.jsxs("div", {
                      className:
                        "rounded-3xl border border-dashed border-sky-400/30 bg-sky-500/5 p-6 text-center",
                      children: [
                        e.jsx("div", {
                          className:
                            "mx-auto grid h-12 w-12 place-items-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-500/20",
                          children: e.jsx(m.lock, { className: "h-5 w-5" }),
                        }),
                        e.jsx("div", {
                          className:
                            "mt-4 text-lg font-semibold text-slate-900 dark:text-white",
                          children: "Premium",
                        }),
                        e.jsx("p", {
                          className:
                            "mt-2 text-sm text-slate-500 dark:text-slate-400",
                          children:
                            "Premium plan required to view the contract audit trail.",
                        }),
                        e.jsx("button", {
                          className:
                            "mt-4 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20",
                          children: "Upgrade to Premium",
                        }),
                      ],
                    }),
                  }),
                  e.jsx(O, {
                    title: "Workflow summary",
                    subtitle: "Every single thing in one place",
                    children: e.jsxs("div", {
                      className:
                        "space-y-3 text-sm text-slate-700 dark:text-slate-300",
                      children: [
                        e.jsx(se, { step: "Draft", done: !0 }),
                        e.jsx(se, {
                          step: "Buyer sign",
                          done: r.buyerSign === "signed",
                        }),
                        e.jsx(se, {
                          step: "Factory sign",
                          done: r.factorySign === "signed",
                        }),
                        e.jsx(se, {
                          step: "Lock PDF",
                          done:
                            ((K =
                              (Z = r == null ? void 0 : r.raw) == null
                                ? void 0
                                : Z.artifact) == null
                              ? void 0
                              : K.status) === "locked" ||
                            ((X =
                              (Y = r == null ? void 0 : r.raw) == null
                                ? void 0
                                : Y.artifact) == null
                              ? void 0
                              : X.status) === "archived",
                        }),
                        e.jsx(se, {
                          step: "Archive",
                          done:
                            ((ee = r == null ? void 0 : r.raw) == null
                              ? void 0
                              : ee.lifecycle_status) === "archived",
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            }),
          ],
        }),
      ],
    });
  return t
    ? he
    : e.jsx("div", {
        className: ce,
        children: e.jsx("div", {
          className:
            "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_24%),linear-gradient(180deg,#f8fbff_0%,#eef7ff_40%,#eaf3ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.24),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(125,211,252,0.12),_transparent_22%),linear-gradient(180deg,#020617_0%,#07111f_45%,#08111b_100%)] dark:text-white",
          children: e.jsx("div", {
            className: "mx-auto max-w-[1600px] px-4 py-4 md:px-6 lg:px-8",
            children: he,
          }),
        }),
      });
}
function W(...t) {
  return t.filter(Boolean).join(" ");
}
function Fe({ className: t = "" }) {
  return e.jsxs("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: t,
    children: [
      e.jsx("path", {
        d: "M13 2l1.8 5.4L20 9l-5.2 1.6L13 16l-1.8-5.4L6 9l5.2-1.6L13 2z",
      }),
      e.jsx("path", {
        d: "M5 14l.9 2.7L9 18l-3.1 1.3L5 22l-.9-2.7L1 18l3.1-1.3L5 14z",
      }),
    ],
  });
}
function be({ path: t, className: l = "" }) {
  return e.jsx("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: l,
    children: e.jsx("path", { d: t }),
  });
}
function ge({ value: t }) {
  return e.jsx("div", {
    className: "h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800",
    children: e.jsx("div", {
      className: "h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400",
      style: { width: `${Math.min(100, Math.max(0, t))}%` },
    }),
  });
}
const Ce = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function ve({ values: t }) {
  const l = Math.max(...t, 1);
  return e.jsx("div", {
    className:
      "flex h-44 items-end gap-2 rounded-2xl bg-gradient-to-b from-sky-50/70 to-white p-3 dark:from-sky-950/30 dark:to-slate-950/20",
    children: t.map((d, i) =>
      e.jsxs(
        "div",
        {
          className: "flex-1",
          children: [
            e.jsx("div", {
              className: "flex h-full items-end",
              children: e.jsx("div", {
                className:
                  "w-full rounded-t-xl bg-gradient-to-t from-sky-500 via-cyan-400 to-sky-300 shadow-sm",
                style: { height: `${(d / l) * 100}%` },
                title: `${Ce[i]}: ${d}`,
              }),
            }),
            e.jsx("div", {
              className:
                "mt-2 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500",
              children: Ce[i],
            }),
          ],
        },
        i,
      ),
    ),
  });
}
function b({
  title: t,
  subtitle: l,
  children: d,
  className: i = "",
  action: k,
}) {
  return e.jsxs("div", {
    className: W(
      "rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/80",
      i,
    ),
    children: [
      e.jsxs("div", {
        className: "mb-4 flex items-start justify-between gap-3",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h3", {
                className:
                  "text-base font-semibold text-slate-900 dark:text-white",
                children: t,
              }),
              l
                ? e.jsx("p", {
                    className:
                      "mt-1 text-sm text-slate-500 dark:text-slate-400",
                    children: l,
                  })
                : null,
            ],
          }),
          k,
        ],
      }),
      d,
    ],
  });
}
function N({
  label: t,
  value: l,
  sub: d,
  accent: i = "from-sky-500 to-cyan-400",
}) {
  const k = typeof l == "number" && !Number.isNaN(l);
  return e.jsxs(Ie, {
    className:
      "relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-5 shadow-[0_18px_45px_rgba(8,15,33,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/70",
    children: [
      e.jsx("div", {
        className: W("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", i),
      }),
      e.jsx("p", {
        className: "text-sm font-medium text-slate-500 dark:text-slate-400",
        children: t,
      }),
      e.jsxs("div", {
        className: "mt-3 flex items-end justify-between gap-3",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("div", {
                className:
                  "text-3xl font-semibold tracking-tight text-slate-950 dark:text-white",
                children: k
                  ? e.jsx(He, { children: e.jsx(Re, { value: l }) })
                  : l,
              }),
              e.jsx("p", {
                className: "mt-1 text-sm text-slate-500 dark:text-slate-400",
                children: d,
              }),
            ],
          }),
          e.jsx("div", {
            className: W(
              "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
              i,
            ),
            children: e.jsx(Fe, { className: "h-5 w-5" }),
          }),
        ],
      }),
    ],
  });
}
const Se = [
    { id: "home", label: "Dashboard Home", short: "Home" },
    { id: "requests", label: "Buyer Requests", short: "RFQs" },
    { id: "chats", label: "Chats", short: "Chats" },
    { id: "network", label: "Partner Network", short: "Network" },
    { id: "leads", label: "Leads (CRM)", short: "Leads" },
    { id: "members", label: "Member Management", short: "Members" },
    { id: "contracts", label: "Contracts Vault", short: "Contracts" },
    { id: "insights", label: "Insights & Analytics", short: "Insights" },
    { id: "subscription", label: "Subscription", short: "Billing" },
    { id: "verification", label: "Verification", short: "Verify" },
    { id: "settings", label: "Settings", short: "Settings" },
  ],
  Ke = [
    {
      label: "Buyer Requests",
      href: "/buyer-requests",
      desc: "View and manage RFQs",
    },
    {
      label: "Partners",
      href: "/partner-network",
      desc: "Manage supplier network",
    },
    { label: "Members", href: "/member-management", desc: "Add team agents" },
    { label: "Contracts", href: "/contracts", desc: "View all contracts" },
    { label: "Leads", href: "/leads", desc: "CRM pipeline" },
    { label: "Messages", href: "/chat", desc: "Chat with buyers" },
    { label: "Analytics", href: "/insights", desc: "View data insights" },
    { label: "Settings", href: "/org-settings", desc: "Account configuration" },
  ].filter((t) => Te(t.href));
function ot() {
  var J, G, Z, K, Y, X, ee, s, n, u, T;
  const t = Ae(),
    [l, d] = qe(),
    i = o.useMemo(() => {
      const a = l.get("tab") || "home";
      return Se.some((f) => f.id === a) ? a : "home";
    }, [l]),
    [k, q] = o.useState(!1),
    V = o.useCallback(
      (a) => {
        (d({ tab: a }, { replace: !0 }), q(!1));
      },
      [d],
    ),
    { theme: A, toggleTheme: Q } = Me(),
    {
      dashboard: x,
      subscription: C,
      isEnterprise: $,
      loading: p,
      error: re,
    } = Oe(),
    [y, g] = o.useState(null),
    [L, le] = o.useState([]),
    [ne, pe] = o.useState([]),
    [r, ie] = o.useState({ owners: 0, managers: 0, agents: 0, observers: 2 }),
    [de, fe] = o.useState(100),
    [ce, P] = o.useState(!0),
    h = o.useRef(0),
    c = (x == null ? void 0 : x.totals) || {},
    F =
      ((J = C == null ? void 0 : C.plan) == null ? void 0 : J.toUpperCase()) ||
      "FREE",
    H = o.useMemo(
      () =>
        F === "FREE" ? "Free" : F === "PREMIUM" ? "Premium" : "Enterprise",
      [F],
    );
  (o.useEffect(() => {
    p || ((h.current += 1), h.current >= 3 && P(!1));
  }, [p]),
    o.useEffect(() => {
      const a = E();
      a &&
        (Promise.all([
          S("/org/ops/policies", { token: a }).catch(() => null),
          S("/org/ops/escalations", { token: a }).catch(() => ({ items: [] })),
          S("/org/ops/workload", { token: a }).catch(() => ({ items: [] })),
          S("/org/members/counts", { token: a }).catch(() => ({})),
        ])
          .then(([f, je, ke, D]) => {
            (g(f),
              le((je == null ? void 0 : je.items) || []),
              pe((ke == null ? void 0 : ke.items) || []),
              D &&
                ie({
                  owners: D.owners ?? 0,
                  managers: D.managers ?? 0,
                  agents: D.agents ?? 0,
                  observers: D.observers ?? 2,
                }),
              (D == null ? void 0 : D.vault_health) !== void 0 &&
                fe(D.vault_health));
          })
          .catch(() => null)
          .finally(() => {
            ((h.current += 1), h.current >= 3 && P(!1));
          }),
        Pe(a).finally(() => {
          ((h.current += 1), h.current >= 3 && P(!1));
        }));
    }, []));
  const v = (a) => {
      t(a);
    },
    oe = () => {
      t("/login");
    },
    B = {
      assignmentStrategy:
        ((G = y == null ? void 0 : y.assignment_strategy) == null
          ? void 0
          : G.replace(/_/g, " ")) || "Round-robin with priority weighting",
      slaTarget:
        (Z = y == null ? void 0 : y.sla_targets_by_stage) != null && Z.new
          ? `${y.sla_targets_by_stage.new} minutes`
          : "15 minutes",
      escalationWindow:
        (Y =
          (K = y == null ? void 0 : y.escalation_rules) == null
            ? void 0
            : K.time_based) != null && Y.breach_minutes
          ? `${y.escalation_rules.time_based.breach_minutes} hours`
          : "2 hours",
    },
    xe = (L || [])
      .slice(0, 6)
      .map((a) => ({
        id: a.lead_id || a.id,
        reason: a.reason || "Needs attention",
        owner: a.owner || a.agent_name || "Unassigned",
      })),
    R = (ne || [])
      .slice(0, 6)
      .map((a) => ({
        name: a.agent_name || "Unknown",
        current: a.active_leads || 0,
        cap: a.capped_max_leads || 10,
      })),
    me = ((ee =
      (X = x == null ? void 0 : x.series) == null
        ? void 0
        : X.buyer_requests) == null
      ? void 0
      : ee.map((a) => a.count)) || [
      12, 18, 24, 20, 26, 31, 29, 34, 30, 37, 41, 48,
    ],
    he = ((n =
      (s = x == null ? void 0 : x.series) == null ? void 0 : s.chats) == null
      ? void 0
      : n.map((a) => a.count)) || [
      8, 11, 14, 18, 17, 22, 24, 23, 27, 30, 35, 39,
    ],
    ue = ((T =
      (u = x == null ? void 0 : x.series) == null ? void 0 : u.documents) ==
    null
      ? void 0
      : T.map((a) => a.count)) || [6, 7, 9, 10, 12, 15, 16, 18, 17, 20, 22, 26];
  return ce
    ? e.jsx(we, { fill: !0 })
    : e.jsx("div", {
        className: A === "dark" ? "dark" : "",
        children: e.jsxs("div", {
          style: { height: "100vh", overflow: "hidden" },
          className:
            "flex w-full bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.16),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#eef7ff_34%,_#f8fbff_100%)] text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.12),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#06111f_46%,_#040816_100%)] dark:text-slate-100",
          children: [
            e.jsx("aside", {
              "data-lenis-prevent": !0,
              className: W(
                "fixed inset-y-0 left-0 z-40 w-80 shrink-0 border-r border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-950/75 lg:relative lg:z-auto lg:translate-x-0 scrollbar-invisible",
                k ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
              ),
              style: { height: "100vh", overflow: "auto" },
              children: e.jsxs("div", {
                className:
                  "flex min-h-0 flex-col rounded-[2rem] border border-slate-200/70 bg-white/70 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-slate-950/65",
                children: [
                  e.jsxs("div", {
                    className:
                      "flex items-center justify-between gap-3 border-b border-slate-200/70 pb-4 dark:border-white/10",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx("div", {
                            className:
                              "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/20",
                            children: e.jsx(Fe, { className: "h-6 w-6" }),
                          }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", {
                                className:
                                  "text-lg font-semibold tracking-tight text-slate-900 dark:text-white",
                                children: "Owner Console",
                              }),
                              e.jsx("div", {
                                className:
                                  "text-xs text-slate-500 dark:text-slate-400",
                                children: "Premium control center",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsx("button", {
                        className:
                          "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-sky-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 lg:hidden",
                        onClick: () => q(!1),
                        "aria-label": "Close sidebar",
                        children: e.jsx(be, {
                          path: "M6 18L18 6M6 6l12 12",
                          className: "h-5 w-5",
                        }),
                      }),
                    ],
                  }),
                  e.jsx("nav", {
                    className: "mt-4 space-y-1 pr-1",
                    children: Se.map((a) =>
                      e.jsxs(
                        "button",
                        {
                          onClick: () => {
                            V(a.id);
                          },
                          className: W(
                            "group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-200",
                            i === a.id
                              ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/20"
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5",
                          ),
                          children: [
                            e.jsx("span", {
                              className: "font-medium",
                              children: a.label,
                            }),
                            e.jsx("span", {
                              className: W(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]",
                                i === a.id
                                  ? "bg-white/15 text-white"
                                  : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400",
                              ),
                              children: a.short,
                            }),
                          ],
                        },
                        a.id,
                      ),
                    ),
                  }),
                  e.jsxs("div", {
                    className:
                      "mt-4 space-y-3 border-t border-slate-200/70 pt-4 dark:border-white/10",
                    children: [
                      e.jsxs("button", {
                        onClick: Q,
                        className:
                          "flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200",
                        children: [
                          e.jsx("span", {
                            children: A === "dark" ? "Dark mode" : "Light mode",
                          }),
                          e.jsx("span", {
                            className:
                              "rounded-full bg-sky-100 px-2.5 py-1 text-xs text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
                            children: "Toggle",
                          }),
                        ],
                      }),
                      e.jsxs("button", {
                        onClick: oe,
                        className:
                          "flex w-full items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950",
                        children: [
                          e.jsx("span", { children: "Logout" }),
                          e.jsx(be, {
                            path: "M16 17l5-5-5-5M21 12H9M13 5v2.2A2.8 2.8 0 0 1 10.2 10H6",
                            className: "h-4 w-4",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            }),
            e.jsxs("div", {
              "data-lenis-prevent": !0,
              className: "flex flex-1 flex-col min-h-0",
              style: { overflowY: "auto" },
              children: [
                e.jsx("header", {
                  className:
                    "sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 sm:px-6 xl:px-8",
                  children: e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      e.jsx("button", {
                        onClick: () => q(!0),
                        className:
                          "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 lg:hidden",
                        "aria-label": "Open sidebar",
                        children: e.jsx(be, {
                          path: "M4 6h16M4 12h16M4 18h16",
                          className: "h-5 w-5",
                        }),
                      }),
                      e.jsx("div", {
                        className: "flex-1",
                        children: e.jsxs("div", {
                          className: "flex flex-wrap items-center gap-3",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx("h1", {
                                  className:
                                    "text-2xl font-semibold tracking-tight text-slate-950 dark:text-white",
                                  children: "Owner Page",
                                }),
                                e.jsx("p", {
                                  className:
                                    "text-sm text-slate-500 dark:text-slate-400",
                                  children:
                                    "Modern control center for requests, leads, partners, and operations.",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className:
                                "ml-auto hidden items-center gap-2 sm:flex",
                              children: [
                                e.jsx("span", {
                                  className:
                                    "rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300",
                                  children: H,
                                }),
                                e.jsx("span", {
                                  className:
                                    "rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300",
                                  children: "Blue-Sky Theme",
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                }),
                e.jsxs("main", {
                  className:
                    "flex flex-col flex-1 min-h-0 px-4 py-6 sm:px-6 xl:px-8",
                  children: [
                    p &&
                      e.jsx(Be, {
                        color: "#3b00ff",
                        size: "large",
                        style: { fontSize: "40px" },
                        text: "",
                        textColor: "",
                      }),
                    re &&
                      e.jsxs("div", {
                        className:
                          "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl p-4 flex items-center gap-3",
                        children: [
                          e.jsx("span", {
                            className: "text-xl",
                            children: "⚠️",
                          }),
                          e.jsx("span", { children: re }),
                        ],
                      }),
                    i === "home" &&
                      !p &&
                      e.jsxs("div", {
                        className: "space-y-6",
                        children: [
                          e.jsx(M, {
                            as: "section",
                            children: e.jsxs(Le, {
                              className:
                                "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
                              children: [
                                e.jsx(ae, {
                                  children: e.jsx(N, {
                                    label: "Requests",
                                    value: c.buyer_requests ?? 0,
                                    sub: `${c.open_buyer_requests ?? 0} open buyer requests`,
                                  }),
                                }),
                                e.jsx(ae, {
                                  children: e.jsx(N, {
                                    label: "Chats",
                                    value: c.chats ?? 0,
                                    sub: `${c.messages ?? 0} total messages`,
                                    accent: "from-cyan-500 to-sky-400",
                                  }),
                                }),
                                e.jsx(ae, {
                                  children: e.jsx(N, {
                                    label: "Partners",
                                    value: c.partner_network ?? 0,
                                    sub: `${c.factories ?? 0} connected factories`,
                                    accent: "from-blue-500 to-sky-400",
                                  }),
                                }),
                                e.jsx(ae, {
                                  children: e.jsx(N, {
                                    label: "Contracts",
                                    value: c.contracts ?? 0,
                                    sub: `${c.documents ?? 0} documents tracked`,
                                    accent: "from-sky-600 to-cyan-500",
                                  }),
                                }),
                              ],
                            }),
                          }),
                          e.jsx(M, {
                            as: "section",
                            children: e.jsxs("div", {
                              className: "grid gap-6 xl:grid-cols-3",
                              children: [
                                e.jsx(b, {
                                  title: "Quick Actions",
                                  subtitle:
                                    "Jump to the most common operational screens.",
                                  className: "xl:col-span-2",
                                  children: e.jsx("div", {
                                    className:
                                      "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
                                    children: Ke.map((a) =>
                                      e.jsxs(
                                        "button",
                                        {
                                          onClick: () => v(a.href),
                                          className:
                                            "group rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/50",
                                          children: [
                                            e.jsx("div", {
                                              className:
                                                "mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/15 transition group-hover:scale-105",
                                              children: e.jsx(be, {
                                                path: "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
                                                className: "h-5 w-5",
                                              }),
                                            }),
                                            e.jsx("div", {
                                              className:
                                                "font-semibold text-slate-900 dark:text-white",
                                              children: a.label,
                                            }),
                                            e.jsx("div", {
                                              className:
                                                "mt-1 text-xs text-slate-500 dark:text-slate-400",
                                              children: a.desc,
                                            }),
                                          ],
                                        },
                                        a.label,
                                      ),
                                    ),
                                  }),
                                }),
                                e.jsx(b, {
                                  title: "Current Plan",
                                  subtitle:
                                    "Subscription overview and next step.",
                                  action: e.jsx("span", {
                                    className:
                                      "rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
                                    children: H,
                                  }),
                                  children: e.jsxs("div", {
                                    className: "space-y-4",
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-4 text-white shadow-lg shadow-cyan-500/20",
                                        children: [
                                          e.jsx("div", {
                                            className: "text-sm opacity-90",
                                            children: "Current subscription",
                                          }),
                                          e.jsx("div", {
                                            className:
                                              "mt-1 text-2xl font-semibold",
                                            children: H,
                                          }),
                                          F !== "ENTERPRISE"
                                            ? e.jsx("div", {
                                                className:
                                                  "mt-2 text-sm opacity-90",
                                                children:
                                                  "Unlock larger limits and enterprise analytics.",
                                              })
                                            : e.jsx("div", {
                                                className:
                                                  "mt-2 text-sm opacity-90",
                                                children:
                                                  "Enterprise-grade limits and analytics enabled.",
                                              }),
                                        ],
                                      }),
                                      F !== "ENTERPRISE" &&
                                        e.jsx("button", {
                                          onClick: () => v("/pricing"),
                                          className:
                                            "w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950",
                                          children: "Upgrade Now",
                                        }),
                                    ],
                                  }),
                                }),
                              ],
                            }),
                          }),
                          e.jsx(M, {
                            as: "section",
                            children: e.jsxs("div", {
                              className: "grid gap-6 xl:grid-cols-3",
                              children: [
                                e.jsx(b, {
                                  title: "Platform Stats",
                                  subtitle: "Key totals across the workspace.",
                                  children: e.jsx("ul", {
                                    className: "space-y-3 text-sm",
                                    children: [
                                      ["Requests", c.buyer_requests ?? 0],
                                      ["Chats", c.chats ?? 0],
                                      ["Partners", c.partner_network ?? 0],
                                      ["Contracts", c.contracts ?? 0],
                                    ].map(([a, f]) =>
                                      e.jsxs(
                                        "li",
                                        {
                                          className:
                                            "flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5",
                                          children: [
                                            e.jsx("span", {
                                              className:
                                                "text-slate-600 dark:text-slate-300",
                                              children: a,
                                            }),
                                            e.jsx("span", {
                                              className:
                                                "font-semibold text-slate-950 dark:text-white",
                                              children: f,
                                            }),
                                          ],
                                        },
                                        a,
                                      ),
                                    ),
                                  }),
                                }),
                                e.jsx(b, {
                                  title: "Org Operations Policy",
                                  subtitle:
                                    "How the team handles new demand and escalation.",
                                  children: e.jsxs("div", {
                                    className: "space-y-4 text-sm",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsxs("div", {
                                            className:
                                              "mb-2 flex items-center justify-between",
                                            children: [
                                              e.jsx("span", {
                                                className:
                                                  "text-slate-500 dark:text-slate-400",
                                                children: "Assignment strategy",
                                              }),
                                              e.jsx("span", {
                                                className:
                                                  "font-medium text-slate-900 dark:text-white",
                                                children: B.assignmentStrategy,
                                              }),
                                            ],
                                          }),
                                          e.jsx(ge, { value: 78 }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsxs("div", {
                                            className:
                                              "mb-2 flex items-center justify-between",
                                            children: [
                                              e.jsx("span", {
                                                className:
                                                  "text-slate-500 dark:text-slate-400",
                                                children: "SLA target",
                                              }),
                                              e.jsx("span", {
                                                className:
                                                  "font-medium text-slate-900 dark:text-white",
                                                children: B.slaTarget,
                                              }),
                                            ],
                                          }),
                                          e.jsx(ge, { value: 64 }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsxs("div", {
                                            className:
                                              "mb-2 flex items-center justify-between",
                                            children: [
                                              e.jsx("span", {
                                                className:
                                                  "text-slate-500 dark:text-slate-400",
                                                children: "Escalation window",
                                              }),
                                              e.jsx("span", {
                                                className:
                                                  "font-medium text-slate-900 dark:text-white",
                                                children: B.escalationWindow,
                                              }),
                                            ],
                                          }),
                                          e.jsx(ge, { value: 42 }),
                                        ],
                                      }),
                                    ],
                                  }),
                                }),
                                e.jsx(b, {
                                  title: "At a glance",
                                  subtitle:
                                    "A compact view of the owner workspace.",
                                  children: e.jsxs("div", {
                                    className: "grid gap-3",
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50 to-cyan-50 p-4 dark:border-white/10 dark:from-sky-500/10 dark:to-cyan-500/10",
                                        children: [
                                          e.jsx("div", {
                                            className:
                                              "text-sm text-slate-500 dark:text-slate-400",
                                            children: "Buyer request health",
                                          }),
                                          e.jsx("div", {
                                            className:
                                              "mt-1 text-xl font-semibold text-slate-950 dark:text-white",
                                            children: "Stable pipeline",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className:
                                          "rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-white/10 dark:bg-slate-950/40",
                                        children: [
                                          e.jsx("div", {
                                            className:
                                              "text-sm text-slate-500 dark:text-slate-400",
                                            children: "Team coverage",
                                          }),
                                          e.jsxs("div", {
                                            className:
                                              "mt-1 text-xl font-semibold text-slate-950 dark:text-white",
                                            children: [
                                              (C == null
                                                ? void 0
                                                : C.member_limit) ?? 10,
                                              " seats",
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    i === "requests" &&
                      !p &&
                      e.jsxs("div", {
                        className: "space-y-6",
                        children: [
                          e.jsx(M, {
                            as: "section",
                            children: e.jsxs("div", {
                              className: "grid gap-4 md:grid-cols-3",
                              children: [
                                e.jsx(N, {
                                  label: "Total Requests",
                                  value: c.buyer_requests ?? 0,
                                  sub: "All buyer RFQs in the system",
                                }),
                                e.jsx(N, {
                                  label: "Open",
                                  value: c.open_buyer_requests ?? 0,
                                  sub: "Waiting for action",
                                  accent: "from-cyan-500 to-sky-400",
                                }),
                                e.jsx(N, {
                                  label: "Assigned",
                                  value: c.assigned_requests ?? 0,
                                  sub: "Handled by the team",
                                }),
                              ],
                            }),
                          }),
                          e.jsx(b, {
                            title: "All Buyer Requests",
                            subtitle:
                              "Status: Active · Category: All · Assigned vs unassigned overview",
                            action: e.jsx("button", {
                              onClick: () => v("/buyer-requests"),
                              className:
                                "rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/15",
                              children: "View All Requests",
                            }),
                            children: e.jsxs("div", {
                              className: "grid gap-4 md:grid-cols-3",
                              children: [
                                e.jsxs("div", {
                                  className:
                                    "rounded-2xl bg-slate-50 p-4 dark:bg-white/5",
                                  children: [
                                    e.jsx("div", {
                                      className:
                                        "text-sm text-slate-500 dark:text-slate-400",
                                      children: "Assigned",
                                    }),
                                    e.jsx("div", {
                                      className:
                                        "mt-1 text-2xl font-semibold text-slate-950 dark:text-white",
                                      children: c.assigned_requests ?? 0,
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className:
                                    "rounded-2xl bg-slate-50 p-4 dark:bg-white/5",
                                  children: [
                                    e.jsx("div", {
                                      className:
                                        "text-sm text-slate-500 dark:text-slate-400",
                                      children: "Unassigned",
                                    }),
                                    e.jsx("div", {
                                      className:
                                        "mt-1 text-2xl font-semibold text-slate-950 dark:text-white",
                                      children:
                                        (c.buyer_requests ?? 0) -
                                        (c.assigned_requests ?? 0),
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className:
                                    "rounded-2xl bg-gradient-to-br from-sky-500/10 to-cyan-400/10 p-4",
                                  children: [
                                    e.jsx("div", {
                                      className:
                                        "text-sm text-slate-500 dark:text-slate-400",
                                      children: "Open rate",
                                    }),
                                    e.jsxs("div", {
                                      className:
                                        "mt-1 text-2xl font-semibold text-slate-950 dark:text-white",
                                      children: [
                                        c.buyer_requests
                                          ? Math.round(
                                              (c.open_buyer_requests /
                                                c.buyer_requests) *
                                                100,
                                            )
                                          : 0,
                                        "%",
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    i === "chats" &&
                      !p &&
                      e.jsxs("div", {
                        className: "space-y-6",
                        children: [
                          e.jsx(M, {
                            as: "section",
                            children: e.jsxs("div", {
                              className: "grid gap-4 md:grid-cols-3",
                              children: [
                                e.jsx(N, {
                                  label: "Active Chats",
                                  value: c.chats ?? 0,
                                  sub: "Live buyer conversations",
                                }),
                                e.jsx(N, {
                                  label: "Messages Sent",
                                  value: c.messages ?? 0,
                                  sub: "Team and buyer messages",
                                  accent: "from-cyan-500 to-sky-400",
                                }),
                                e.jsx(N, {
                                  label: "Unread",
                                  value: c.unread_messages ?? 0,
                                  sub: "Needs attention",
                                }),
                              ],
                            }),
                          }),
                          e.jsx(b, {
                            title: "Conversations",
                            subtitle:
                              "Open the chat center and continue buyer communication.",
                            action: e.jsx("button", {
                              onClick: () => v("/chat"),
                              className:
                                "rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white",
                              children: "Open Chat",
                            }),
                            children: e.jsxs("div", {
                              className:
                                "flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 dark:bg-white/5",
                              children: [
                                e.jsx("div", {
                                  className:
                                    "text-sm text-slate-500 dark:text-slate-400",
                                  children: "Chat entry point",
                                }),
                                e.jsx("div", {
                                  className:
                                    "text-lg font-semibold text-slate-950 dark:text-white",
                                  children:
                                    "Start or resume buyer conversations with context and request history.",
                                }),
                                e.jsx("button", {
                                  onClick: () => v("/chat"),
                                  className:
                                    "w-fit text-sm font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-300",
                                  children: "Start a new conversation →",
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    i === "network" &&
                      !p &&
                      e.jsxs("div", {
                        className: "space-y-6",
                        children: [
                          e.jsx(M, {
                            as: "section",
                            children: e.jsxs("div", {
                              className: "grid gap-4 md:grid-cols-3",
                              children: [
                                e.jsx(N, {
                                  label: "Connected",
                                  value: c.partner_network ?? 0,
                                  sub: "Trusted partners online",
                                }),
                                e.jsx(N, {
                                  label: "Pending",
                                  value: c.pending_partners ?? 0,
                                  sub: "Awaiting approval",
                                  accent: "from-cyan-500 to-sky-400",
                                }),
                                e.jsx(N, {
                                  label: "Factories",
                                  value: c.factories ?? 0,
                                  sub: "Production capacity",
                                }),
                              ],
                            }),
                          }),
                          e.jsx(b, {
                            title: "Partner Network",
                            subtitle:
                              "Overview of partners, factories, and buying houses.",
                            action: e.jsx("button", {
                              onClick: () => v("/partner-network"),
                              className:
                                "rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white",
                              children: "Manage Partners",
                            }),
                            children: e.jsxs("div", {
                              className: "grid gap-4 md:grid-cols-3",
                              children: [
                                e.jsxs("div", {
                                  className:
                                    "rounded-2xl bg-slate-50 p-4 dark:bg-white/5",
                                  children: [
                                    e.jsx("div", {
                                      className:
                                        "text-sm text-slate-500 dark:text-slate-400",
                                      children: "Total partners",
                                    }),
                                    e.jsx("div", {
                                      className:
                                        "mt-1 text-2xl font-semibold text-slate-950 dark:text-white",
                                      children: c.partner_network ?? 0,
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className:
                                    "rounded-2xl bg-slate-50 p-4 dark:bg-white/5",
                                  children: [
                                    e.jsx("div", {
                                      className:
                                        "text-sm text-slate-500 dark:text-slate-400",
                                      children: "Factories",
                                    }),
                                    e.jsx("div", {
                                      className:
                                        "mt-1 text-2xl font-semibold text-slate-950 dark:text-white",
                                      children: c.factories ?? 0,
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className:
                                    "rounded-2xl bg-slate-50 p-4 dark:bg-white/5",
                                  children: [
                                    e.jsx("div", {
                                      className:
                                        "text-sm text-slate-500 dark:text-slate-400",
                                      children: "Buying houses",
                                    }),
                                    e.jsx("div", {
                                      className:
                                        "mt-1 text-2xl font-semibold text-slate-950 dark:text-white",
                                      children: c.buying_houses ?? 0,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    i === "leads" &&
                      !p &&
                      e.jsxs("div", {
                        className: "space-y-6",
                        children: [
                          e.jsxs("div", {
                            className: "grid gap-6 xl:grid-cols-3",
                            children: [
                              e.jsx(b, {
                                title: "Org Operations Policy",
                                subtitle:
                                  "Rules that govern assignment, response times, and escalation.",
                                children: e.jsxs("div", {
                                  className: "space-y-3 text-sm",
                                  children: [
                                    e.jsxs("div", {
                                      className:
                                        "rounded-2xl bg-slate-50 p-4 dark:bg-white/5",
                                      children: [
                                        e.jsx("div", {
                                          className:
                                            "text-slate-500 dark:text-slate-400",
                                          children: "Assignment strategy",
                                        }),
                                        e.jsx("div", {
                                          className:
                                            "mt-1 font-semibold text-slate-950 dark:text-white",
                                          children: B.assignmentStrategy,
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      className:
                                        "rounded-2xl bg-slate-50 p-4 dark:bg-white/5",
                                      children: [
                                        e.jsx("div", {
                                          className:
                                            "text-slate-500 dark:text-slate-400",
                                          children: "SLA target",
                                        }),
                                        e.jsx("div", {
                                          className:
                                            "mt-1 font-semibold text-slate-950 dark:text-white",
                                          children: B.slaTarget,
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      className:
                                        "rounded-2xl bg-slate-50 p-4 dark:bg-white/5",
                                      children: [
                                        e.jsx("div", {
                                          className:
                                            "text-slate-500 dark:text-slate-400",
                                          children: "Escalation breach window",
                                        }),
                                        e.jsx("div", {
                                          className:
                                            "mt-1 font-semibold text-slate-950 dark:text-white",
                                          children: B.escalationWindow,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              }),
                              e.jsx(b, {
                                title: "Escalation Queue",
                                subtitle:
                                  "Leads that need immediate attention.",
                                className: "xl:col-span-2",
                                children: e.jsx("div", {
                                  className: "space-y-3",
                                  children:
                                    xe.length === 0
                                      ? e.jsx("div", {
                                          className:
                                            "text-sm text-slate-500 dark:text-slate-400",
                                          children: "No active escalations.",
                                        })
                                      : xe.map((a) =>
                                          e.jsxs(
                                            "div",
                                            {
                                              className:
                                                "flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-white/5",
                                              children: [
                                                e.jsxs("div", {
                                                  children: [
                                                    e.jsx("div", {
                                                      className:
                                                        "font-semibold text-slate-950 dark:text-white",
                                                      children: a.id,
                                                    }),
                                                    e.jsx("div", {
                                                      className:
                                                        "text-sm text-slate-500 dark:text-slate-400",
                                                      children: a.reason,
                                                    }),
                                                  ],
                                                }),
                                                e.jsxs("div", {
                                                  className:
                                                    "text-sm font-medium text-sky-600 dark:text-sky-300",
                                                  children: [
                                                    "Owner: ",
                                                    a.owner,
                                                  ],
                                                }),
                                              ],
                                            },
                                            a.id,
                                          ),
                                        ),
                                }),
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "grid gap-6 xl:grid-cols-3",
                            children: [
                              e.jsx(b, {
                                title: "Agent Workload",
                                subtitle:
                                  "Current leads versus maximum capacity.",
                                children: e.jsx("div", {
                                  className: "space-y-4",
                                  children:
                                    R.length === 0
                                      ? e.jsx("div", {
                                          className:
                                            "text-sm text-slate-500 dark:text-slate-400",
                                          children: "No workload records.",
                                        })
                                      : R.map((a) => {
                                          const f =
                                            a.cap > 0
                                              ? (a.current / a.cap) * 100
                                              : 0;
                                          return e.jsxs(
                                            "div",
                                            {
                                              className: "space-y-2",
                                              children: [
                                                e.jsxs("div", {
                                                  className:
                                                    "flex items-center justify-between text-sm",
                                                  children: [
                                                    e.jsx("span", {
                                                      className:
                                                        "font-medium text-slate-900 dark:text-white",
                                                      children: a.name,
                                                    }),
                                                    e.jsxs("span", {
                                                      className:
                                                        "text-slate-500 dark:text-slate-400",
                                                      children: [
                                                        a.current,
                                                        "/",
                                                        a.cap,
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                                e.jsx(ge, { value: f }),
                                              ],
                                            },
                                            a.name,
                                          );
                                        }),
                                }),
                              }),
                              e.jsx("div", {
                                className: "xl:col-span-2",
                                children: e.jsx($e, {
                                  title: "LeadManager",
                                  allowAssign: !0,
                                  showOperations: !0,
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    i === "members" &&
                      !p &&
                      e.jsx("div", {
                        className: "space-y-6",
                        children: e.jsx(b, {
                          title: "Member Management",
                          subtitle:
                            "Team members, agents, and access control in one place.",
                          action: e.jsxs("div", {
                            className: "flex gap-2",
                            children: [
                              e.jsx("button", {
                                onClick: () => v("/member-management"),
                                className:
                                  "rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white",
                                children: "Manage Members",
                              }),
                              e.jsx("button", {
                                onClick: () => v("/member-management"),
                                className:
                                  "rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200",
                                children: "Go to Member Management",
                              }),
                            ],
                          }),
                          children: e.jsx("div", {
                            className: "grid gap-4 md:grid-cols-4",
                            children: [
                              "Owners",
                              "Managers",
                              "Agents",
                              "Observers",
                            ].map((a, f) =>
                              e.jsxs(
                                "div",
                                {
                                  className:
                                    "rounded-2xl bg-slate-50 p-4 dark:bg-white/5",
                                  children: [
                                    e.jsx("div", {
                                      className:
                                        "text-sm text-slate-500 dark:text-slate-400",
                                      children: a,
                                    }),
                                    e.jsx("div", {
                                      className:
                                        "mt-1 text-2xl font-semibold text-slate-950 dark:text-white",
                                      children: [
                                        r.owners,
                                        r.managers,
                                        r.agents,
                                        r.observers,
                                      ][f],
                                    }),
                                  ],
                                },
                                a,
                              ),
                            ),
                          }),
                        }),
                      }),
                    i === "contracts" &&
                      !p &&
                      e.jsx("div", {
                        className: "flex-1 min-h-0 space-y-6",
                        "data-lenis-prevent": !0,
                        children: e.jsx(Ze, { embedded: !0 }),
                      }),
                    i === "insights" &&
                      !p &&
                      e.jsxs("div", {
                        className: "space-y-6",
                        children: [
                          !$ &&
                            e.jsx(b, {
                              title: "Enterprise Analytics",
                              subtitle:
                                "Advanced analytics requires an Enterprise plan.",
                              children: e.jsxs("div", {
                                className:
                                  "flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between",
                                children: [
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("div", {
                                        className: "font-semibold",
                                        children: "Upgrade required",
                                      }),
                                      e.jsx("div", {
                                        className: "text-sm opacity-90",
                                        children:
                                          "Unlock advanced trend analysis, deeper attribution, and more accurate forecasting.",
                                      }),
                                    ],
                                  }),
                                  e.jsx("button", {
                                    onClick: () => v("/pricing"),
                                    className:
                                      "rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950",
                                    children: "Upgrade Now",
                                  }),
                                ],
                              }),
                            }),
                          e.jsxs("div", {
                            className: "grid gap-6 xl:grid-cols-3",
                            children: [
                              e.jsx(b, {
                                title: "Buyer Requests / Month",
                                subtitle: "Monthly bar chart visualization.",
                                children: e.jsx(ve, { values: me }),
                              }),
                              e.jsx(b, {
                                title: "Chats / Month",
                                subtitle: "Monthly bar chart visualization.",
                                children: e.jsx(ve, { values: he }),
                              }),
                              e.jsx(b, {
                                title: "Documents / Month",
                                subtitle: "Monthly bar chart visualization.",
                                children: e.jsx(ve, { values: ue }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    i === "verification" &&
                      !p &&
                      e.jsx("div", {
                        className: "flex-1 min-h-0 space-y-6",
                        "data-lenis-prevent": !0,
                        children: e.jsx(Ve, { embedded: !0 }),
                      }),
                    i === "settings" &&
                      !p &&
                      e.jsx("div", {
                        className: "flex-1 min-h-0",
                        "data-lenis-prevent": !0,
                        children: e.jsx(Ue, { embedded: !0 }),
                      }),
                    i === "subscription" &&
                      !p &&
                      e.jsxs("div", {
                        className: "space-y-6",
                        children: [
                          e.jsx(b, {
                            title: "Current Plan",
                            subtitle:
                              "Subscription, billing, and limits at a glance.",
                            action: e.jsx("span", {
                              className:
                                "rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
                              children: H,
                            }),
                            children: e.jsxs("div", {
                              className: "grid gap-4 md:grid-cols-3",
                              children: [
                                e.jsxs("div", {
                                  className:
                                    "rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-5 text-white shadow-lg shadow-cyan-500/20",
                                  children: [
                                    e.jsx("div", {
                                      className: "text-sm opacity-90",
                                      children: "Plan name",
                                    }),
                                    e.jsx("div", {
                                      className: "mt-1 text-3xl font-semibold",
                                      children: H,
                                    }),
                                    e.jsx("div", {
                                      className: "mt-2 text-sm opacity-90",
                                      children: "Status: Active",
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className:
                                    "rounded-2xl bg-slate-50 p-5 dark:bg-white/5",
                                  children: [
                                    e.jsx("div", {
                                      className:
                                        "text-sm text-slate-500 dark:text-slate-400",
                                      children: "Billing Settings",
                                    }),
                                    e.jsx("button", {
                                      onClick: () =>
                                        v("/org-settings?tab=billing"),
                                      className:
                                        "mt-2 text-lg font-semibold text-slate-950 hover:text-sky-600 dark:text-white dark:hover:text-sky-300",
                                      children: "Open billing →",
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className:
                                    "rounded-2xl bg-slate-50 p-5 dark:bg-white/5",
                                  children: [
                                    e.jsx("div", {
                                      className:
                                        "text-sm text-slate-500 dark:text-slate-400",
                                      children: "View Plans",
                                    }),
                                    e.jsx("button", {
                                      onClick: () => v("/pricing"),
                                      className:
                                        "mt-2 text-lg font-semibold text-slate-950 hover:text-sky-600 dark:text-white dark:hover:text-sky-300",
                                      children: "Compare plans →",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                          e.jsx(b, {
                            title: "Plan Features",
                            subtitle: "Limits and capability summary.",
                            children: e.jsx("div", {
                              className: "grid gap-4 md:grid-cols-4",
                              children: [
                                [
                                  "Agent seats",
                                  (C == null ? void 0 : C.member_limit) ?? 10,
                                ],
                                ["Analytics level", $ ? "Enterprise" : "Basic"],
                                [
                                  "Partner network",
                                  F === "FREE" ? "Limited" : "Enabled",
                                ],
                                [
                                  "Lead management",
                                  F === "FREE" ? "Limited" : "Enabled",
                                ],
                              ].map(([a, f]) =>
                                e.jsxs(
                                  "div",
                                  {
                                    className:
                                      "rounded-2xl bg-slate-50 p-4 dark:bg-white/5",
                                    children: [
                                      e.jsx("div", {
                                        className:
                                          "text-sm text-slate-500 dark:text-slate-400",
                                        children: a,
                                      }),
                                      e.jsx("div", {
                                        className:
                                          "mt-1 text-xl font-semibold text-slate-950 dark:text-white",
                                        children: f,
                                      }),
                                    ],
                                  },
                                  a,
                                ),
                              ),
                            }),
                          }),
                        ],
                      }),
                  ],
                }),
              ],
            }),
          ],
        }),
      });
}
export { ot as default };
