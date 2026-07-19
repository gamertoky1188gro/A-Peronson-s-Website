import {
  z as tt,
  r as o,
  C as st,
  j as e,
  M as at,
  D as rt,
  E as lt,
  F as nt,
  G as ot,
  H as it,
  I as dt,
  J as ct,
  K as xt,
  O as ut,
  P as pt,
  Q as ht,
  T as mt,
  U as ft,
  n as Pe,
  L as Z,
  g as X,
  d as O,
  X as ze,
  q as ie,
  V as gt,
  W as bt,
  k as yt,
  b as kt,
  u as jt,
  e as Re,
  c as $e,
  Y as vt,
  Z as Nt,
  N as wt,
  m as de,
} from "./index-CNnTWoea.js";
import { r as _t } from "./leadSource-DB88KSZe.js";
import { E as Ue } from "./external-link-C36VE5bl.js";
import { B as Ct } from "./badge-check-CaFeTPUp.js";
import { Z as St } from "./zap-eQvd90E6.js";
import { E as Tt } from "./ellipsis-DW_F5lj4.js";
import { S as pe } from "./share-2-BwupXrv3.js";
import { L as At } from "./link-2-BXQn7VZ0.js";
import { F as he, M as Rt } from "./message-circle-CWAQ16tA.js";
import { M as me } from "./message-square-text-BHby1laP.js";
import { A as $t } from "./arrow-up-right-DHoBJ02c.js";
import { C as qt } from "./chevron-up-D98Ew_p5.js";
import { u as Mt } from "./usePageMeta-Bj0pssG4.js";
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bt = [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }],
  ],
  Et = tt("user", Bt);
function qe(t, l) {
  if (t == null || t === "") return l;
  try {
    return JSON.parse(t);
  } catch {
    return l;
  }
}
function It(t, l) {
  const a = o.useMemo(
      () => (t ? qe(window.localStorage.getItem(t), l) : l),
      [l, t],
    ),
    [n, d] = o.useState(a);
  o.useEffect(() => {
    t && d(qe(window.localStorage.getItem(t), l));
  }, [t]);
  const x = o.useCallback(
    (r) => {
      d((m) => {
        const i = typeof r == "function" ? r(m) : r;
        return (t && window.localStorage.setItem(t, JSON.stringify(i)), i);
      });
    },
    [t],
  );
  return [n, x];
}
function Lt({ content: t = "" }) {
  const l = String(t || ""),
    a = o.useMemo(() => {
      var d;
      const n = st || {};
      return {
        ...n,
        tagNames: [
          ...(n.tagNames || []),
          "img",
          "ins",
          "mark",
          "sup",
          "sub",
          "abbr",
          "dl",
          "dt",
          "dd",
        ],
        attributes: {
          ...(n.attributes || {}),
          img: [
            ...new Set([
              ...(((d = n.attributes) == null ? void 0 : d.img) || []),
              "src",
              "alt",
              "title",
              "width",
              "height",
              "loading",
            ]),
          ],
        },
      };
    }, []);
  return l.trim()
    ? e.jsx("div", {
        className:
          "prose prose-sm max-w-none prose-slate dark:prose-invert prose-headings:font-semibold prose-pre:rounded-xl prose-pre:bg-slate-900 prose-code:before:content-none prose-code:after:content-none",
        children: e.jsx(at, {
          remarkPlugins: [
            [nt, { singleTilde: !1 }],
            ot,
            it,
            dt,
            ct,
            xt,
            ut,
            pt,
            ht,
            mt,
          ],
          rehypePlugins: [rt, [lt, a]],
          components: {
            img({ src: n, alt: d, title: x, ...r }) {
              return e.jsx("img", {
                src: n,
                alt: d || "",
                title: x,
                loading: "lazy",
                className: "max-w-full rounded-xl",
                ...r,
              });
            },
            code({ inline: n, className: d, children: x, ...r }) {
              return n
                ? e.jsx("code", { className: d, ...r, children: x })
                : e.jsx(ft, { className: d, ...r, children: x });
            },
          },
          children: l,
        }),
      })
    : null;
}
function Pt(t) {
  try {
    return new URL(t).hostname.replace(/^www\./, "");
  } catch {
    return t;
  }
}
const zt = {};
function Ut({ url: t, preview: l }) {
  const [a, n] = o.useState(!1);
  if (!t) return null;
  const d = l || zt,
    x = d.domain || Pt(t),
    r = d.title || x,
    m = d.description || "",
    i = d.image && !a ? d.image : null,
    v = d.favicon || null;
  return e.jsxs("a", {
    href: t,
    target: "_blank",
    rel: "noreferrer",
    className:
      "group block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-shadow hover:shadow-md",
    children: [
      i
        ? e.jsx("div", {
            className:
              "aspect-[2/1] overflow-hidden bg-slate-100 dark:bg-slate-800",
            children: e.jsx("img", {
              src: i,
              alt: "",
              loading: "lazy",
              className:
                "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]",
              onError: () => n(!0),
            }),
          })
        : null,
      e.jsxs("div", {
        className: "p-3",
        children: [
          e.jsxs("div", {
            className:
              "flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1",
            children: [
              v
                ? e.jsx("img", {
                    src: v,
                    alt: "",
                    className: "h-4 w-4 rounded",
                    onError: (g) => {
                      g.target.style.display = "none";
                    },
                  })
                : null,
              e.jsx("span", { className: "truncate", children: x }),
            ],
          }),
          e.jsx("h4", {
            className:
              "text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-gtBlue transition-colors",
            children: r,
          }),
          m
            ? e.jsx("p", {
                className:
                  "mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2",
                children: m,
              })
            : null,
        ],
      }),
    ],
  });
}
function Dt(t) {
  return t ? t.trim().split(/\s+/).filter(Boolean).length : 0;
}
function De({ item: t }) {
  const l = Dt(t.descriptionMarkdown);
  return (
    t.entityType,
    e.jsxs("div", {
      className: "space-y-5",
      children: [
        e.jsxs("div", {
          children: [
            e.jsx("span", {
              className:
                "text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
              children: "Title *",
            }),
            e.jsx("h3", {
              className:
                "mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100",
              children: t.title || "Untitled",
            }),
          ],
        }),
        t.category
          ? e.jsxs("div", {
              children: [
                e.jsx("span", {
                  className:
                    "text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
                  children: "Category",
                }),
                e.jsx("div", {
                  className: "mt-1",
                  children: e.jsx("span", {
                    className:
                      "inline-flex rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300",
                    children: t.category,
                  }),
                }),
              ],
            })
          : null,
        t.content
          ? e.jsxs("div", {
              children: [
                e.jsx("span", {
                  className:
                    "text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
                  children: "Caption",
                }),
                e.jsx("p", {
                  className:
                    "mt-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed",
                  children: t.content,
                }),
              ],
            })
          : null,
        t.descriptionMarkdown
          ? e.jsxs("div", {
              children: [
                e.jsx("span", {
                  className:
                    "text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
                  children: "README / Longform",
                }),
                e.jsx("div", {
                  className:
                    "mt-1 rounded-xl bg-white p-3 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:ring-white/10",
                  children: e.jsx(Lt, { content: t.descriptionMarkdown }),
                }),
                e.jsxs("p", {
                  className: "mt-1 text-xs text-slate-400 dark:text-slate-500",
                  children: [l, " / 600 words"],
                }),
              ],
            })
          : null,
        t.ctaText && t.ctaUrl
          ? e.jsxs("div", {
              children: [
                e.jsx("span", {
                  className:
                    "text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
                  children: "CTA",
                }),
                e.jsxs("div", {
                  className: "mt-1 space-y-1",
                  children: [
                    e.jsx("p", {
                      className:
                        "text-sm font-medium text-slate-900 dark:text-slate-100",
                      children: t.ctaText,
                    }),
                    e.jsxs("a", {
                      href: t.ctaUrl,
                      target: "_blank",
                      rel: "noreferrer",
                      className:
                        "inline-flex items-center gap-1 text-xs text-gtBlue hover:underline break-all",
                      children: [t.ctaUrl, e.jsx(Ue, { size: 12 })],
                    }),
                  ],
                }),
              ],
            })
          : null,
        Array.isArray(t.tags) && t.tags.length
          ? e.jsxs("div", {
              children: [
                e.jsx("span", {
                  className:
                    "text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
                  children: "Hashtags",
                }),
                e.jsx("div", {
                  className: "mt-1 flex flex-wrap gap-2",
                  children: t.tags.map((a, n) =>
                    e.jsxs(
                      "span",
                      {
                        className:
                          "rounded-full bg-[#3b82f6]/10 px-3 py-1 text-[11px] font-semibold text-[#2563eb] dark:bg-[#38bdf8]/10 dark:text-[#38bdf8]",
                        children: ["#", a],
                      },
                      `tag-${n}`,
                    ),
                  ),
                }),
              ],
            })
          : null,
        Array.isArray(t.mentions) && t.mentions.length
          ? e.jsxs("div", {
              children: [
                e.jsx("span", {
                  className:
                    "text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
                  children: "Mentions",
                }),
                e.jsx("div", {
                  className: "mt-1 flex flex-wrap gap-2",
                  children: t.mentions.map((a, n) =>
                    e.jsxs(
                      "span",
                      {
                        className:
                          "rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300",
                        children: ["@", a],
                      },
                      `mention-${n}`,
                    ),
                  ),
                }),
              ],
            })
          : null,
        Array.isArray(t.links) && t.links.length
          ? e.jsxs("div", {
              children: [
                e.jsx("span", {
                  className:
                    "text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
                  children: "Links",
                }),
                e.jsx("div", {
                  className: "mt-2 grid gap-3",
                  children: t.links
                    .slice(0, 4)
                    .map((a, n) =>
                      e.jsx(
                        Ut,
                        {
                          url: a,
                          preview:
                            (t.link_previews && t.link_previews[n]) || null,
                        },
                        `link-${n}`,
                      ),
                    ),
                }),
              ],
            })
          : null,
        Array.isArray(t.productTags) && t.productTags.length
          ? e.jsxs("div", {
              children: [
                e.jsx("span", {
                  className:
                    "text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
                  children: "Product Tags",
                }),
                e.jsx("div", {
                  className: "mt-1 flex flex-wrap gap-2",
                  children: t.productTags.map((a, n) =>
                    e.jsx(
                      "span",
                      {
                        className:
                          "rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300",
                        children: a,
                      },
                      `product-tag-${n}`,
                    ),
                  ),
                }),
              ],
            })
          : null,
        t.locationTag
          ? e.jsxs("div", {
              children: [
                e.jsx("span", {
                  className:
                    "text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
                  children: "Location",
                }),
                e.jsx("p", {
                  className: "mt-1 text-sm text-slate-700 dark:text-slate-300",
                  children: t.locationTag,
                }),
              ],
            })
          : null,
        Array.isArray(t.media) && t.media.length
          ? e.jsxs("div", {
              children: [
                e.jsxs("span", {
                  className:
                    "text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
                  children: ["Media (", t.media.length, ")"],
                }),
                e.jsx("div", {
                  className: "mt-2 grid grid-cols-2 gap-2",
                  children: t.media.map((a, n) =>
                    e.jsx(
                      "div",
                      {
                        className:
                          "overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 ring-1 ring-slate-200/70 dark:ring-white/10",
                        children:
                          a.type === "video"
                            ? e.jsx("video", {
                                className: "h-40 w-full object-cover",
                                src: a.url,
                                controls: !0,
                                preload: "metadata",
                              })
                            : e.jsx("img", {
                                className: "h-40 w-full object-cover",
                                src: a.url,
                                alt: a.alt || "",
                                loading: "lazy",
                              }),
                      },
                      `media-${n}`,
                    ),
                  ),
                }),
              ],
            })
          : null,
      ],
    })
  );
}
function Ft(t = "") {
  const l = String(t || "open").toLowerCase();
  return l === "open" || l === "active"
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
    : l === "reviewing" || l === "reviewing_quotes"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";
}
function Ot(t = "") {
  const l = String(t || "open").toLowerCase();
  return l === "open" || l === "active"
    ? "Active"
    : l === "reviewing" || l === "reviewing_quotes"
      ? "Reviewing"
      : l === "closed" || l === "completed"
        ? "Closed"
        : String(t || "open").replaceAll("_", " ");
}
function Ht({ status: t }) {
  return e.jsx("span", {
    className: `inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${Ft(t)}`,
    children: Ot(t),
  });
}
function Gt(t) {
  return String(t || "").trim();
}
function E(t, l) {
  const a = Gt(l);
  return a
    ? e.jsxs("div", {
        className: "flex items-start justify-between gap-3 text-xs",
        children: [
          e.jsx("span", {
            className: "text-slate-500 dark:text-slate-400",
            children: t,
          }),
          e.jsx("span", {
            className:
              "text-slate-900 dark:text-slate-100 font-medium text-right whitespace-pre-wrap",
            children: a,
          }),
        ],
      })
    : null;
}
function Jt({
  item: t,
  canExpressInterest: l,
  expressInterestDisabled: a,
  onExpressInterest: n,
  onOpenComments: d,
  onShare: x,
  onReport: r,
  onMessage: m,
  highlight: i,
}) {
  var J, C, w, I, L, A, q, H;
  const v = Pe(),
    [g, b] = o.useState(!1),
    N = o.useRef(null);
  o.useEffect(() => {
    if (!g) return;
    function S(R) {
      N.current && !N.current.contains(R.target) && b(!1);
    }
    return (
      document.addEventListener("mousedown", S),
      () => document.removeEventListener("mousedown", S)
    );
  }, [g]);
  const _ = t.entityType === "buyer_request",
    $ = t.entityType === "user_feed_post",
    k =
      (J = t.author) != null && J.id
        ? _
          ? `/buyer/${encodeURIComponent(t.author.id)}`
          : t.author.rolePath
            ? `/${t.author.rolePath}/${encodeURIComponent(t.author.id)}`
            : ""
        : "";
  return e.jsxs("article", {
    className: `relative overflow-hidden rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800${i ? "ring-2 ring-[#3b82f6]/35" : ""}`,
    id: `feed-item-${t.entityType}-${t.id}`,
    children: [
      e.jsx("div", {
        className:
          "pointer-events-none absolute inset-0 opacity-0 dark:opacity-100 dark:bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.10),transparent_52%)]",
      }),
      e.jsx("header", {
        className: "relative p-4 bg-white/70 dark:bg-slate-950/30",
        children: e.jsxs("div", {
          className: "flex items-start justify-between gap-3",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3 min-w-0",
              children: [
                k
                  ? e.jsx(Z, {
                      to: k,
                      className: "shrink-0",
                      children:
                        (C = t.author) != null && C.avatar_url
                          ? e.jsx("img", {
                              src: t.author.avatar_url,
                              alt: "",
                              className: "h-10 w-10 rounded-full object-cover",
                            })
                          : e.jsx("div", {
                              className:
                                "h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 shrink-0 flex items-center justify-center text-xs font-semibold text-slate-500",
                              children: (((w = t.author) == null
                                ? void 0
                                : w.name) || "?")[0],
                            }),
                    })
                  : e.jsx("div", {
                      className:
                        "h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 shrink-0 flex items-center justify-center text-xs font-semibold text-slate-500",
                      children: (((I = t.author) == null ? void 0 : I.name) ||
                        "?")[0],
                    }),
                e.jsxs("div", {
                  className: "min-w-0",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2 min-w-0",
                      children: [
                        k
                          ? e.jsx(Z, {
                              to: k,
                              className:
                                "font-semibold text-slate-900 dark:text-slate-100 truncate hover:underline",
                              children:
                                ((L = t.author) == null ? void 0 : L.name) ||
                                "Unknown",
                            })
                          : e.jsx("p", {
                              className:
                                "font-semibold text-slate-900 dark:text-slate-100 truncate",
                              children:
                                ((A = t.author) == null ? void 0 : A.name) ||
                                "Unknown",
                            }),
                        t.verified
                          ? e.jsxs("span", {
                              className:
                                "verified-shimmer inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25",
                              title: "Verified",
                              children: [
                                e.jsx(Ct, { size: 14 }),
                                e.jsx("span", {
                                  className: "hidden sm:inline",
                                  children: "Verified",
                                }),
                              ],
                            })
                          : null,
                        (q = t.feedMetadata) != null && q.paid_boost_active
                          ? e.jsxs("span", {
                              className:
                                "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-300/25",
                              title: "Boosted visibility",
                              children: [
                                e.jsx(St, { size: 13 }),
                                e.jsx("span", {
                                  className: "hidden sm:inline",
                                  children: "Boosted",
                                }),
                              ],
                            })
                          : null,
                        String(t.certificationStatus || "").toLowerCase() ===
                        "certified"
                          ? e.jsx("span", {
                              className:
                                "inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
                              children: "Certified",
                            })
                          : null,
                        _ && t.priorityActive
                          ? e.jsx("span", {
                              className:
                                "inline-flex items-center rounded-full bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-200",
                              children: "Priority",
                            })
                          : null,
                        _ ? e.jsx(Ht, { status: t.status }) : null,
                        t.discussionActive
                          ? e.jsx("span", {
                              className:
                                "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-400/25",
                              children: "Active discussion",
                            })
                          : null,
                      ],
                    }),
                    e.jsx("p", {
                      className:
                        "text-[11px] text-slate-500 dark:text-slate-400",
                      children:
                        ((H = t.author) == null ? void 0 : H.accountType) ||
                        (_ ? "Buyer" : "Company"),
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs("div", {
              className: "relative",
              ref: N,
              children: [
                e.jsx("button", {
                  type: "button",
                  onClick: () => b((S) => !S),
                  className:
                    "rounded-full p-2 hover:bg-slate-50/70 dark:hover:bg-white/5",
                  "aria-label": "More actions",
                  "aria-haspopup": "true",
                  "aria-expanded": g,
                  children: e.jsx(Tt, {
                    size: 18,
                    className: "text-slate-500 dark:text-slate-400",
                  }),
                }),
                g &&
                  e.jsxs("div", {
                    className:
                      "absolute right-0 top-full z-50 mt-1 w-48 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700",
                    children: [
                      k
                        ? e.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              (b(!1), v(k));
                            },
                            className:
                              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                            children: [
                              e.jsx(Et, { size: 15 }),
                              " View Profile",
                            ],
                          })
                        : null,
                      e.jsxs("button", {
                        type: "button",
                        onClick: () => {
                          (b(!1), x == null || x());
                        },
                        className:
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                        children: [e.jsx(pe, { size: 15 }), " Share"],
                      }),
                      e.jsxs("button", {
                        type: "button",
                        onClick: () => {
                          b(!1);
                          const S = k
                            ? `${window.location.origin}${k}`
                            : window.location.href;
                          navigator.clipboard.writeText(S).catch(() => {});
                        },
                        className:
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                        children: [e.jsx(At, { size: 15 }), " Copy Link"],
                      }),
                      k
                        ? e.jsxs("a", {
                            href: k,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            onClick: () => b(!1),
                            className:
                              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                            children: [
                              e.jsx(Ue, { size: 15 }),
                              " Open in New Tab",
                            ],
                          })
                        : null,
                      e.jsx("hr", {
                        className:
                          "my-1 border-slate-100 dark:border-slate-800",
                      }),
                      e.jsxs("button", {
                        type: "button",
                        onClick: () => {
                          (b(!1), r == null || r());
                        },
                        className:
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50",
                        children: [e.jsx(he, { size: 15 }), " Report"],
                      }),
                    ],
                  }),
              ],
            }),
          ],
        }),
      }),
      e.jsxs("div", {
        className: "relative p-4",
        children: [
          e.jsxs("div", {
            className: "flex items-center justify-between gap-3",
            children: [
              e.jsx("p", {
                className: `text-xs font-semibold${_ ? "text-emerald-700 dark:text-emerald-300" : $ ? "text-fuchsia-700 dark:text-fuchsia-300" : "text-indigo-700 dark:text-indigo-300"}`,
                children: _
                  ? "Buyer Request"
                  : $
                    ? "Feed Post"
                    : "Company Product",
              }),
              t.createdAt
                ? e.jsx("p", {
                    className: "text-[11px] text-slate-400 dark:text-slate-500",
                    children: t.createdAt,
                  })
                : null,
            ],
          }),
          $
            ? e.jsx(De, { item: t })
            : e.jsxs(e.Fragment, {
                children: [
                  e.jsx("h3", {
                    className:
                      "mt-2 text-base font-semibold text-slate-900 dark:text-slate-100",
                    children: _
                      ? t.category || "Request"
                      : t.title || t.category || "Product",
                  }),
                  t.content
                    ? e.jsx("p", {
                        className:
                          "mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed",
                        children: t.content,
                      })
                    : null,
                  _
                    ? e.jsxs("div", {
                        className:
                          "mt-3 rounded-xl bg-slate-50/60 p-3 space-y-2 ring-1 ring-slate-200/60 dark:bg-white/5 dark:ring-white/10",
                        children: [
                          E("Category", t.category),
                          E("Quantity", t.quantity),
                          E(
                            "Timeline",
                            t.timelineDays ? `${t.timelineDays} days` : "",
                          ),
                          E("Material", t.material),
                          E(
                            "Certifications",
                            Array.isArray(t.certifications)
                              ? t.certifications.join(", ")
                              : "",
                          ),
                          E("Shipping", t.shippingTerms),
                        ],
                      })
                    : e.jsxs("div", {
                        className:
                          "mt-3 rounded-xl bg-slate-50/60 p-3 space-y-2 ring-1 ring-slate-200/60 dark:bg-white/5 dark:ring-white/10",
                        children: [
                          E("Category", t.category),
                          E("MOQ", t.moq),
                          E(
                            "Lead time",
                            t.leadTimeDays ? `${t.leadTimeDays} days` : "",
                          ),
                          E("Material", t.material),
                        ],
                      }),
                  t.hasVideo
                    ? e.jsxs("div", {
                        className:
                          "mt-3 rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white p-4 text-center dark:bg-white/5",
                        children: [
                          e.jsx("p", {
                            className:
                              "text-sm font-semibold text-slate-800 dark:text-slate-100",
                            children: "Video available",
                          }),
                          e.jsx("p", {
                            className:
                              "text-[11px] text-slate-500 dark:text-slate-400",
                            children: "Open the profile to view the gallery.",
                          }),
                        ],
                      })
                    : null,
                  Array.isArray(t.tags) && t.tags.length
                    ? e.jsx("div", {
                        className: "mt-3 flex flex-wrap gap-2",
                        children: t.tags.map((S, R) =>
                          e.jsx(
                            "span",
                            {
                              className:
                                "rounded-full bg-[#3b82f6]/10 px-3 py-1 text-[11px] font-semibold text-[#2563eb] dark:bg-[#38bdf8]/10 dark:text-[#38bdf8]",
                              children: S,
                            },
                            `${t.id}-${S}-${R}`,
                          ),
                        ),
                      })
                    : null,
                ],
              }),
        ],
      }),
      e.jsxs("footer", {
        className:
          "relative px-4 py-3 bg-white/70 dark:bg-slate-950/30 flex items-center justify-between gap-3",
        children: [
          e.jsxs("div", {
            className: "flex items-center gap-1 text-xs",
            children: [
              e.jsxs("button", {
                type: "button",
                onClick: d,
                className:
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:text-gtBlue dark:hover:text-gtBlue hover:bg-slate-200/70 dark:hover:bg-slate-700/60 hover:shadow-sm transition-all active:scale-90 cursor-pointer",
                children: [e.jsx(me, { size: 16 }), " Comment"],
              }),
              e.jsxs("button", {
                type: "button",
                onClick: x,
                className:
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:text-gtBlue dark:hover:text-gtBlue hover:bg-slate-200/70 dark:hover:bg-slate-700/60 hover:shadow-sm transition-all active:scale-90 cursor-pointer",
                children: [e.jsx(pe, { size: 16 }), " Share"],
              }),
              e.jsxs("button", {
                type: "button",
                onClick: r,
                className:
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-200/60 dark:hover:bg-rose-950/50 hover:shadow-sm transition-all active:scale-90 cursor-pointer",
                children: [e.jsx(he, { size: 16 }), " Report"],
              }),
            ],
          }),
          e.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              _ && l
                ? e.jsx("button", {
                    type: "button",
                    onClick: n,
                    disabled: !!a,
                    className:
                      "rounded-full bg-gtBlue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gtBlueHover active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed",
                    children: a ? "Claiming..." : "Express Interest",
                  })
                : e.jsxs("button", {
                    type: "button",
                    onClick: () => (m == null ? void 0 : m(t)),
                    className:
                      "rounded-full bg-gtBlue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gtBlueHover active:scale-95 inline-flex items-center gap-2",
                    children: [e.jsx(Rt, { size: 16 }), " Message"],
                  }),
              k
                ? e.jsxs(Z, {
                    to: k,
                    className:
                      "rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 inline-flex items-center gap-2 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5",
                    children: ["View profile ", e.jsx($t, { size: 14 })],
                  })
                : null,
            ],
          }),
        ],
      }),
    ],
  });
}
function Vt(t) {
  if (!t) return "";
  const l = new Date(t);
  return Number.isNaN(l.getTime()) ? "" : l.toLocaleString();
}
function Kt({ open: t, onClose: l, item: a, onShare: n }) {
  var F;
  const [d, x] = o.useState(!1),
    [r, m] = o.useState(""),
    [i, v] = o.useState([]),
    [g, b] = o.useState(""),
    [N, _] = o.useState(""),
    [$, k] = o.useState(""),
    [J, C] = o.useState({}),
    [w, I] = o.useState(!1),
    [L, A] = o.useState("post");
  o.useEffect(
    () => (
      t
        ? (document.body.style.overflow = "hidden")
        : (document.body.style.overflow = ""),
      () => {
        document.body.style.overflow = "";
      }
    ),
    [t],
  );
  const q = o.useMemo(() => X(), []);
  o.useEffect(() => {
    if (!t || !(a != null && a.id) || !(a != null && a.entityType)) return;
    let u = !0;
    return (
      x(!0),
      m(""),
      O(
        `/social/${encodeURIComponent(a.entityType)}/${encodeURIComponent(a.id)}`,
        { token: q },
      )
        .then((p) => {
          u &&
            v(Array.isArray(p == null ? void 0 : p.comments) ? p.comments : []);
        })
        .catch((p) => {
          u && (m(p.message || "Failed to load comments"), v([]));
        })
        .finally(() => {
          u && x(!1);
        }),
      () => {
        u = !1;
      }
    );
  }, [a == null ? void 0 : a.entityType, a == null ? void 0 : a.id, t, q]);
  function H() {
    (_(""), k(""));
  }
  async function S() {
    const u = g.trim();
    if (!(!u || w || !(a != null && a.id) || !(a != null && a.entityType))) {
      (I(!0), m(""));
      try {
        const p = await O(
          `/social/${encodeURIComponent(a.entityType)}/${encodeURIComponent(a.id)}/comment`,
          { method: "POST", token: q, body: { text: u } },
        );
        (v((c) => [p, ...c]), b(""));
      } catch (p) {
        m(p.message || "Failed to post comment");
      } finally {
        I(!1);
      }
    }
  }
  async function R(u) {
    const p = $.trim();
    if (!(
      !p ||
      w ||
      !(a != null && a.id) ||
      !(a != null && a.entityType) ||
      !u
    )) {
      (I(!0), m(""));
      try {
        const c = await O(
          `/social/${encodeURIComponent(a.entityType)}/${encodeURIComponent(a.id)}/comment`,
          { method: "POST", token: q, body: { text: p, parent_id: u } },
        );
        (v((f) => [c, ...f]), H());
      } catch (c) {
        m(c.message || "Failed to post reply");
      } finally {
        I(!1);
      }
    }
  }
  const V = o.useMemo(() => {
    const u = new Map(),
      p = [],
      c = [...i].sort(
        (f, B) => new Date(f.created_at) - new Date(B.created_at),
      );
    return (
      c.forEach((f) => {
        u.set(f.id, { comment: f, children: [] });
      }),
      c.forEach((f) => {
        const B = u.get(f.id);
        f.parent_id && u.has(f.parent_id)
          ? u.get(f.parent_id).children.push(B)
          : p.push(B);
      }),
      p
    );
  }, [i]);
  function D(u) {
    C((p) => ({ ...p, [u]: !p[u] }));
  }
  function ee(u) {
    if (!u) return "U";
    const p = u.trim().split(/\s+/);
    return p.length >= 2
      ? (p[0][0] + p[1][0]).toUpperCase()
      : p[0].slice(0, 2).toUpperCase();
  }
  function K(u) {
    const p = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-violet-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-cyan-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    let c = 0;
    for (let f = 0; f < (u || "").length; f++)
      c = u.charCodeAt(f) + ((c << 5) - c);
    return p[Math.abs(c) % p.length];
  }
  function W(u, p = 0) {
    const { comment: c, children: f } = u,
      B = f.length > 0,
      P = J[c.id] !== !1,
      Y = P ? f : f.slice(0, 2);
    return e.jsx(
      "div",
      {
        children: e.jsxs("div", {
          className: "flex gap-2.5",
          children: [
            c.actor_avatar
              ? e.jsx("img", {
                  src: c.actor_avatar,
                  alt: "",
                  className:
                    "mt-0.5 h-8 w-8 shrink-0 rounded-full object-cover",
                })
              : e.jsx("div", {
                  className: `mt-0.5 h-8 w-8 shrink-0 rounded-full ${K(c.actor_name)} flex items-center justify-center text-xs font-bold text-white`,
                  children: ee(c.actor_name),
                }),
            e.jsxs("div", {
              className: "flex-1 min-w-0",
              children: [
                e.jsxs("div", {
                  className:
                    "rounded-2xl bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        e.jsx("span", {
                          className:
                            "text-sm font-semibold text-slate-900 dark:text-slate-100",
                          children: c.actor_name || "User",
                        }),
                        c.actor_verified
                          ? e.jsx("span", {
                              className: "text-[10px] text-[#0A66C2] font-bold",
                              children: "Verified",
                            })
                          : null,
                      ],
                    }),
                    e.jsx("p", {
                      className:
                        "mt-0.5 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap",
                      children: c.text,
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "flex items-center gap-4 mt-0.5 px-1",
                  children: [
                    e.jsx("span", {
                      className:
                        "text-[11px] text-slate-400 dark:text-slate-500",
                      children: Vt(c.created_at),
                    }),
                    e.jsx("button", {
                      type: "button",
                      onClick: () => _(N === c.id ? "" : c.id),
                      className:
                        "text-[11px] font-semibold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400",
                      children: "Reply",
                    }),
                  ],
                }),
                N === c.id
                  ? e.jsxs("div", {
                      className: "mt-1.5 flex gap-2 items-center ml-1",
                      children: [
                        e.jsx("input", {
                          value: $,
                          onChange: (G) => k(G.target.value),
                          onKeyDown: (G) => G.key === "Enter" && R(c.id),
                          placeholder: "Write a reply...",
                          className:
                            "flex-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]",
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => R(c.id),
                          disabled: w || !$.trim(),
                          className:
                            "rounded-full bg-[#0A66C2] text-white px-3.5 py-2 text-sm font-semibold disabled:opacity-50",
                          children: w
                            ? e.jsx(ie, {
                                variant: "bounce",
                                color: "#6100ff",
                                size: "small",
                                text: "",
                                textColor: "",
                              })
                            : "Send",
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: H,
                          className:
                            "text-[11px] font-semibold text-slate-400 hover:text-slate-600",
                          children: "Cancel",
                        }),
                      ],
                    })
                  : null,
                B
                  ? e.jsxs("div", {
                      className:
                        "mt-2 space-y-2 ml-1 pl-3 border-l-2 border-slate-200 dark:border-slate-700",
                      children: [
                        Y.map((G) => W(G, p + 1)),
                        f.length > 2
                          ? e.jsx("button", {
                              type: "button",
                              onClick: () => D(c.id),
                              className:
                                "flex items-center gap-1.5 text-xs font-semibold text-[#0A66C2] hover:text-[#084b8a]",
                              children: P
                                ? e.jsxs(e.Fragment, {
                                    children: [
                                      e.jsx(qt, { size: 14 }),
                                      " Hide ",
                                      f.length - 2,
                                      " replies",
                                    ],
                                  })
                                : e.jsxs(e.Fragment, {
                                    children: [
                                      e.jsx(gt, { size: 14 }),
                                      " View ",
                                      f.length - 2,
                                      " replies",
                                    ],
                                  }),
                            })
                          : null,
                      ],
                    })
                  : null,
              ],
            }),
          ],
        }),
      },
      c.id,
    );
  }
  return t
    ? e.jsxs("div", {
        className:
          "fixed inset-0 z-50 flex items-start justify-center pt-4 pb-4 sm:pt-10",
        style: { overflow: "hidden" },
        children: [
          e.jsx("button", {
            type: "button",
            "aria-label": "Close",
            onClick: l,
            className: "fixed inset-0 bg-black/50",
          }),
          e.jsxs("div", {
            className:
              "relative z-10 w-full max-w-2xl mx-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overscroll-contain",
            children: [
              e.jsxs("header", {
                className:
                  "flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      e.jsx("div", {
                        className:
                          "h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 shrink-0",
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("p", {
                            className:
                              "text-sm font-semibold text-slate-900 dark:text-slate-100",
                            children:
                              ((F = a == null ? void 0 : a.author) == null
                                ? void 0
                                : F.name) || "Unknown",
                          }),
                          e.jsx("p", {
                            className:
                              "text-[11px] text-slate-500 dark:text-slate-400",
                            children:
                              (a == null ? void 0 : a.entityType) ===
                              "user_feed_post"
                                ? "Feed Post"
                                : (a == null ? void 0 : a.entityType) ===
                                    "buyer_request"
                                  ? "Buyer Request"
                                  : "Company Product",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx("button", {
                    type: "button",
                    onClick: l,
                    className:
                      "rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
                    "aria-label": "Close",
                    children: e.jsx(ze, {
                      size: 20,
                      className: "text-slate-500 dark:text-slate-400",
                    }),
                  }),
                ],
              }),
              e.jsxs("div", {
                className:
                  "flex border-b border-slate-200 dark:border-slate-700 shrink-0",
                children: [
                  e.jsx("button", {
                    type: "button",
                    onClick: () => A("post"),
                    className: `flex-1 px-4 py-3 text-sm font-semibold text-center transition ${L === "post" ? "text-sky-600 border-b-2 border-sky-500" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`,
                    children: "Post",
                  }),
                  e.jsx("button", {
                    type: "button",
                    onClick: () => A("comments"),
                    className: `flex-1 px-4 py-3 text-sm font-semibold text-center transition ${L === "comments" ? "text-sky-600 border-b-2 border-sky-500" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`,
                    children: "Comments",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "flex-1 min-h-0",
                children: [
                  L === "post"
                    ? e.jsxs("div", {
                        "data-lenis-prevent": !0,
                        className: "h-full overflow-y-auto p-5",
                        children: [
                          e.jsx(De, { item: a }),
                          e.jsxs("div", {
                            className:
                              "mt-6 flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700",
                            children: [
                              e.jsxs("button", {
                                type: "button",
                                onClick: () => A("comments"),
                                className:
                                  "inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400",
                                children: [e.jsx(me, { size: 18 }), "Comments"],
                              }),
                              e.jsxs("button", {
                                type: "button",
                                onClick: n,
                                className:
                                  "inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400",
                                children: [e.jsx(pe, { size: 18 }), "Share"],
                              }),
                              e.jsxs("button", {
                                type: "button",
                                className:
                                  "inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400",
                                children: [e.jsx(he, { size: 18 }), "Report"],
                              }),
                            ],
                          }),
                        ],
                      })
                    : null,
                  L === "comments"
                    ? e.jsxs("div", {
                        className: "flex flex-col h-full",
                        children: [
                          e.jsxs("div", {
                            "data-lenis-prevent": !0,
                            className: "flex-1 overflow-y-auto p-5 space-y-5",
                            children: [
                              d
                                ? e.jsx("div", {
                                    className: "flex justify-center py-8",
                                    children: e.jsx(ie, {
                                      variant: "bounce",
                                      color: "#6100ff",
                                      size: "large",
                                      style: { fontSize: "36px" },
                                      text: "",
                                      textColor: "",
                                    }),
                                  })
                                : null,
                              !d && r
                                ? e.jsx("div", {
                                    className:
                                      "text-sm text-rose-700 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-300 rounded-lg p-3",
                                    children: r,
                                  })
                                : null,
                              !d && !r && i.length === 0
                                ? e.jsxs("div", {
                                    className:
                                      "text-sm text-slate-500 dark:text-slate-400 text-center py-12",
                                    children: [
                                      e.jsx(me, {
                                        size: 32,
                                        className: "mx-auto mb-3 opacity-40",
                                      }),
                                      e.jsx("p", {
                                        children: "No comments yet.",
                                      }),
                                      e.jsx("p", {
                                        className: "text-xs mt-1",
                                        children:
                                          "Be the first to share your thoughts.",
                                      }),
                                    ],
                                  })
                                : null,
                              !d && V.map((u) => W(u, 0)),
                            ],
                          }),
                          e.jsx("div", {
                            className:
                              "p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900",
                            children: e.jsxs("div", {
                              className: "flex gap-2 items-center",
                              children: [
                                e.jsx("input", {
                                  value: g,
                                  onChange: (u) => b(u.target.value),
                                  onKeyDown: (u) => u.key === "Enter" && S(),
                                  placeholder: "Write a comment...",
                                  className:
                                    "flex-1 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]",
                                }),
                                e.jsx("button", {
                                  type: "button",
                                  onClick: S,
                                  disabled: w || !g.trim(),
                                  className:
                                    "rounded-full bg-[#0A66C2] text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-50 hover:bg-[#084b8a] transition",
                                  children: w
                                    ? e.jsx(ie, {
                                        variant: "bounce",
                                        color: "#6100ff",
                                        size: "small",
                                        text: "",
                                        textColor: "",
                                      })
                                    : "Post",
                                }),
                              ],
                            }),
                          }),
                        ],
                      })
                    : null,
                ],
              }),
            ],
          }),
        ],
      })
    : null;
}
const Me = [
  "Misleading information",
  "Spam or scam",
  "Inappropriate content",
  "Copyright/brand violation",
  "Other",
];
function Qt({ open: t, onClose: l, onSubmit: a, item: n }) {
  var g;
  const [d, x] = o.useState(Me[0]),
    [r, m] = o.useState(""),
    i = o.useMemo(
      () =>
        n != null && n.entityType
          ? n.entityType === "buyer_request"
            ? "Potentially fake or harmful buying request"
            : "Product post appears misleading or inappropriate"
          : "",
      [n == null ? void 0 : n.entityType],
    );
  if (!t) return null;
  function v() {
    const b = d === "Other" ? r.trim() || i : d;
    a(b);
  }
  return e.jsxs("div", {
    className: "fixed inset-0 z-50",
    children: [
      e.jsx("button", {
        type: "button",
        "aria-label": "Close report modal",
        onClick: l,
        className: "absolute inset-0 bg-black/40",
      }),
      e.jsxs("div", {
        className:
          "absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl shadow-borderless dark:shadow-borderlessDark",
        children: [
          e.jsxs("header", {
            className:
              "flex items-center justify-between px-5 py-4 shadow-dividerB dark:shadow-dividerBDark",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("p", {
                    className: "text-sm font-semibold text-slate-900",
                    children: "Report this post",
                  }),
                  e.jsx("p", {
                    className: "text-[11px] text-slate-500 truncate",
                    children:
                      ((g = n == null ? void 0 : n.author) == null
                        ? void 0
                        : g.name) || "Post",
                  }),
                ],
              }),
              e.jsx("button", {
                type: "button",
                onClick: l,
                className: "rounded-full p-2 hover:bg-slate-100",
                "aria-label": "Close",
                children: e.jsx(ze, { size: 18 }),
              }),
            ],
          }),
          e.jsxs("div", {
            className: "p-5 space-y-4",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("label", {
                    className:
                      "block text-xs font-semibold text-slate-700 mb-1",
                    children: "Reason",
                  }),
                  e.jsx("select", {
                    value: d,
                    onChange: (b) => x(b.target.value),
                    className:
                      "w-full rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white px-3 py-2 text-sm",
                    children: Me.map((b) =>
                      e.jsx("option", { value: b, children: b }, b),
                    ),
                  }),
                ],
              }),
              d === "Other"
                ? e.jsxs("div", {
                    children: [
                      e.jsx("label", {
                        className:
                          "block text-xs font-semibold text-slate-700 mb-1",
                        children: "Details (optional)",
                      }),
                      e.jsx("textarea", {
                        value: r,
                        onChange: (b) => m(b.target.value),
                        placeholder: i,
                        className:
                          "w-full min-h-[96px] rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white px-3 py-2 text-sm",
                      }),
                    ],
                  })
                : null,
              e.jsxs("div", {
                className: "flex gap-2 justify-end",
                children: [
                  e.jsx("button", {
                    type: "button",
                    onClick: l,
                    className:
                      "rounded-full px-4 py-2 text-sm font-semibold shadow-borderless dark:shadow-borderlessDark hover:bg-slate-50",
                    children: "Cancel",
                  }),
                  e.jsx("button", {
                    type: "button",
                    onClick: v,
                    className:
                      "rounded-full px-4 py-2 text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700",
                    children: "Submit report",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const Wt = "";
function Yt({ onNewPost: t, onUpdatedPost: l, onDeletedPost: a }) {
  const n = X();
  if (!n) return null;
  const d = `${Wt}/api/feed/stream?token=${encodeURIComponent(n)}`,
    x = new EventSource(d);
  return (
    x.addEventListener("new_post", (r) => {
      try {
        const m = JSON.parse(r.data);
        t == null || t(m);
      } catch {}
    }),
    x.addEventListener("updated_post", (r) => {
      try {
        const m = JSON.parse(r.data);
        l == null || l(m);
      } catch {}
    }),
    x.addEventListener("deleted_post", (r) => {
      try {
        const { id: m } = JSON.parse(r.data);
        a == null || a(m);
      } catch {}
    }),
    (x.onerror = () => {}),
    x
  );
}
const U = ({ children: t, className: l = "h-5 w-5" }) =>
    e.jsx("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: l,
      children: t,
    }),
  Zt = (t) =>
    e.jsxs(U, {
      ...t,
      children: [
        e.jsx("circle", { cx: "11", cy: "11", r: "8" }),
        e.jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }),
      ],
    }),
  Xt = (t) =>
    e.jsx(U, {
      ...t,
      children: e.jsx("polygon", {
        points: "22 3 2 3 10 12 10 19 14 21 14 12 22 3",
      }),
    }),
  es = (t) =>
    e.jsx(U, {
      ...t,
      children: e.jsx("polyline", { points: "6 9 12 15 18 9" }),
    }),
  Be = (t) =>
    e.jsxs(U, {
      ...t,
      children: [
        e.jsx("rect", { x: "3", y: "3", width: "7", height: "7" }),
        e.jsx("rect", { x: "14", y: "3", width: "7", height: "7" }),
        e.jsx("rect", { x: "14", y: "14", width: "7", height: "7" }),
        e.jsx("rect", { x: "3", y: "14", width: "7", height: "7" }),
      ],
    }),
  ts = (t) =>
    e.jsxs(U, {
      ...t,
      children: [
        e.jsx("path", { d: "M9 12l2 2 4-4" }),
        e.jsx("circle", { cx: "12", cy: "12", r: "10" }),
      ],
    }),
  Ee = (t) =>
    e.jsxs(U, {
      ...t,
      children: [
        e.jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
        e.jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
      ],
    }),
  ss = (t) =>
    e.jsxs(U, {
      ...t,
      children: [
        e.jsx("path", { d: "M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" }),
        e.jsx("path", { d: "M13.73 21a2 2 0 01-3.46 0" }),
      ],
    }),
  as = (t) =>
    e.jsxs(U, {
      ...t,
      children: [
        e.jsx("rect", { x: "2", y: "7", width: "20", height: "14" }),
        e.jsx("path", { d: "M16 3H8v4h8z" }),
      ],
    }),
  rs = (t) =>
    e.jsxs(U, {
      ...t,
      children: [
        e.jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
        e.jsx("polyline", { points: "17 8 12 3 7 8" }),
        e.jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" }),
      ],
    }),
  Ie = {
    tabs: ["All", "Buyer Requests", "Company Products", "Posts", "Unique OFF"],
    labels: {
      feed_center: "Feed Center",
      premium_badge: "Premium moderation dashboard",
      quick_actions: "Quick actions",
      live_status: "Live",
      search: "Search",
      search_placeholder: "Search posts, buyers...",
      categories: "All categories",
      hero_title: "Feed Center",
      hero_description:
        "Browse buyer requests, company products, and posts from one unified workspace.",
      stats: {
        buyer_requests: "Buyer Requests",
        company_products: "Company Products",
        feed_posts: "Feed Posts",
      },
    },
    messages: {
      share_copied: "Share link copied to clipboard.",
      report_submitted: "Report submitted. Thank you.",
      interest_expressed: "Interest expressed.",
      rate_limited: "Please wait a few seconds before reporting again.",
      all_caught_up: "You're all caught up.",
      no_results: "No posts matched your filters.",
      load_failed: "Failed to load feed",
    },
  };
function Fe(...t) {
  return t.filter(Boolean).join(" ");
}
function ls(t) {
  if (!t) return "";
  const l = new Date(t);
  if (Number.isNaN(l.getTime())) return "";
  const a = Date.now() - l.getTime(),
    n = Math.floor(a / 6e4);
  if (n < 1) return "Just now";
  if (n < 60) return `${n}m ago`;
  const d = Math.floor(n / 60);
  return d < 24 ? `${d}h ago` : `${Math.floor(d / 24)}d ago`;
}
function Le(t) {
  var x;
  const l = String((t == null ? void 0 : t.title) || "").trim();
  if (l) return l;
  const a = String((t == null ? void 0 : t.category) || "").trim();
  if (a) return a;
  const n = String((t == null ? void 0 : t.content) || "")
    .replace(/\s+/g, " ")
    .trim();
  if (n) return n.slice(0, 80);
  const d = String(
    ((x = t == null ? void 0 : t.author) == null ? void 0 : x.name) || "",
  ).trim();
  return d ? `${d} update` : "Feed post";
}
function ce(t) {
  var m, i, v, g, b;
  const l =
      t.feed_type === "buyer_request"
        ? "buyer_request"
        : t.feed_type === "user_feed_post"
          ? "user_feed_post"
          : "company_product",
    a = l === "buyer_request",
    n = l === "user_feed_post",
    d = t.buyer_id || t.company_id || t.user_id || t.author_id || "",
    x =
      ((m = t.author) == null ? void 0 : m.role) ||
      t.company_role ||
      (a ? "buyer" : n ? "member" : "factory"),
    r =
      ((i = t.author) == null ? void 0 : i.rolePath) ||
      (x === "buying_house"
        ? "buying-house"
        : x === "buyer"
          ? "buyer"
          : x === "factory"
            ? "factory"
            : "");
  return {
    id: t.id,
    entityType: l,
    author: {
      id: d,
      name:
        ((v = t.author) == null ? void 0 : v.name) ||
        t.company_name ||
        t.organization_name ||
        t.org ||
        t.name ||
        "Unknown",
      accountType: x ? String(x).replaceAll("_", " ") : a ? "Buyer" : "Company",
      rolePath: r,
      avatar_url: ((g = t.author) == null ? void 0 : g.avatar_url) || "",
    },
    verified: !!(((b = t.author) != null && b.verified) || t.verified),
    createdAt: ls(t.created_at),
    content: a
      ? t.custom_description || ""
      : n
        ? t.caption || ""
        : t.description || "",
    title: t.title || "",
    descriptionMarkdown: t.description_markdown || "",
    category: t.category || "",
    tags: [
      t.category,
      t.material,
      ...(Array.isArray(t.hashtags) ? t.hashtags : []),
    ].filter(Boolean),
    material: t.material || "",
    quantity: t.quantity || "",
    timelineDays: t.timeline_days || "",
    shippingTerms: t.shipping_terms || "",
    certifications: Array.isArray(t.certifications_required)
      ? t.certifications_required
      : [],
    moq: t.moq || "",
    leadTimeDays: t.lead_time_days || "",
    hasVideo: !!(
      t.hasVideo ||
      (!t.video_restricted &&
        t.video_review_status === "approved" &&
        t.video_url)
    ),
    media: Array.isArray(t.media) ? t.media : [],
    ctaText: t.cta_text || "",
    ctaUrl: t.cta_url || "",
    mentions: Array.isArray(t.mentions) ? t.mentions : [],
    links: Array.isArray(t.links) ? t.links : [],
    link_previews: Array.isArray(t.link_previews) ? t.link_previews : [],
    productTags: Array.isArray(t.product_tags) ? t.product_tags : [],
    locationTag: t.location_tag || "",
    emojis: Array.isArray(t.emojis) ? t.emojis : [],
    discussionActive: !!t.discussion_active,
    feedMetadata: t.feed_metadata || {},
    priorityActive: !!t.priority_active,
    certificationStatus: t.order_certification_status || "",
  };
}
async function ns(t) {
  var n;
  if (!t) return !1;
  if ((n = navigator.clipboard) != null && n.writeText)
    return (await navigator.clipboard.writeText(t), !0);
  const l = document.createElement("textarea");
  ((l.value = t),
    l.setAttribute("readonly", "true"),
    (l.style.position = "fixed"),
    (l.style.left = "-9999px"),
    document.body.appendChild(l),
    l.select());
  const a = document.execCommand("copy");
  return (document.body.removeChild(l), a);
}
function xe({ children: t, active: l = !1, onClick: a }) {
  return e.jsx("button", {
    onClick: a,
    className: Fe(
      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
      l
        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
        : "bg-white/70 text-slate-600 hover:bg-sky-50 hover:text-sky-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800",
    ),
    children: t,
  });
}
function ue({ icon: t, label: l, value: a, accent: n = "sky" }) {
  return e.jsx("div", {
    className:
      "rounded-3xl border border-white/60 bg-white/80 p-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70",
    children: e.jsxs("div", {
      className: "flex items-center justify-between gap-2",
      children: [
        e.jsxs("div", {
          className: "flex-1",
          children: [
            e.jsx("p", {
              className:
                "text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400",
              children: l,
            }),
            e.jsx("p", {
              className: "text-xl font-semibold text-slate-900 dark:text-white",
              children: a,
            }),
          ],
        }),
        e.jsx("div", {
          className: Fe(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            n === "sky" && "bg-sky-500/15 text-sky-600 dark:text-sky-400",
            n === "blue" && "bg-blue-500/15 text-blue-600 dark:text-blue-400",
            n === "indigo" &&
              "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
          ),
          children: t,
        }),
      ],
    }),
  });
}
function vs() {
  var Ce, Se, Te;
  Mt({
    title: "Feed — GarTexHub",
    description:
      "Stay updated with the latest textile and garment industry posts, product launches, and market insights on GarTexHub.",
    url: "/feed",
  });
  const t = Pe(),
    [l] = bt(),
    a = o.useMemo(() => X(), []),
    n = yt(),
    x = `gartexhub_unique:${(n == null ? void 0 : n.id) || "user"}`,
    [r, m] = o.useState(n),
    [i, v] = o.useState(Ie),
    [g, b] = o.useState(i.tabs[0]),
    [N, _] = o.useState(i.labels.categories),
    [$] = It(x, !1),
    [k, J] = o.useState(""),
    [C, w] = o.useState([]),
    [I, L] = o.useState([]),
    [A, q] = o.useState(0),
    [H, S] = o.useState(!0),
    R = o.useRef({ user: !1, config: !1, feed: !1 }),
    V = (s) => {
      ((R.current[s] = !0),
        R.current.user && R.current.config && R.current.feed && S(!1));
    },
    [D, ee] = o.useState(!0),
    [K, W] = o.useState(!1),
    [F, u] = o.useState(""),
    [p, c] = o.useState({ type: "", message: "" }),
    [f, B] = o.useState(null),
    [P, Y] = o.useState(null),
    [G, Oe] = o.useState({}),
    [os, fe] = o.useState(!1),
    [ge, be] = o.useState(""),
    [ye, He] = o.useState(""),
    te = l.get("item") || "",
    ke = o.useRef(null),
    se = kt(),
    { scrollY: je } = jt(),
    Ge = Re($e(je, [0, 200], [1, 0.95]), {
      stiffness: 80,
      damping: 20,
      restDelta: 0.001,
    }),
    Je = Re($e(je, [0, 600], [0, -40]), {
      stiffness: 80,
      damping: 20,
      restDelta: 0.001,
    }),
    Ve = o.useMemo(() => {
      const s = (r == null ? void 0 : r.role) || "";
      return s === "buying_house" || s === "admin";
    }, [r == null ? void 0 : r.role]),
    ve = o.useCallback(async () => {
      try {
        const s = await vt(a);
        s && m(s);
      } catch {
      } finally {
        V("user");
      }
    }, [a]),
    ae = o.useCallback(
      async ({ reset: s }) => {
        const T = s ? 0 : Number(A || 0);
        s ? (ee(!0), u(""), c({ type: "", message: "" })) : (W(!0), u(""));
        try {
          const y = (r == null ? void 0 : r.role) || "";
          let j = g;
          g === "All"
            ? y === "buyer"
              ? (j = "products")
              : (y === "factory" || y === "buying_house") && (j = "requests")
            : g === "Buyer Requests"
              ? (j = "requests")
              : g === "Company Products"
                ? (j = "products")
                : g === "Posts"
                  ? (j = "posts")
                  : g === "Unique OFF" && (j = "all");
          const z = N === i.labels.categories ? "" : N.toLowerCase(),
            Xe = new URLSearchParams({
              unique: $ ? "true" : "false",
              type: j,
              category: z,
              cursor: String(T),
              limit: String(12),
              role_filter: "true",
            }).toString(),
            M = await O(`/feed?${Xe}`, { token: a }),
            le = (
              Array.isArray(M == null ? void 0 : M.items) ? M.items : []
            ).map(ce);
          (L(Array.isArray(M == null ? void 0 : M.tags) ? M.tags : []),
            w((Q) => {
              if (s) return le;
              const et = new Set(Q.map((oe) => oe.id)),
                Ae = le.filter((oe) => !et.has(oe.id));
              return Ae.length ? [...Q, ...Ae] : Q;
            }));
          const ne = M == null ? void 0 : M.next_cursor;
          (q(ne ?? null),
            s &&
              le.slice(0, 6).forEach((Q) => {
                Nt("feed_item_viewed", {
                  entityType: Q.entityType,
                  entityId: Q.id,
                });
              }));
        } catch (y) {
          (u(y.message || i.messages.load_failed), s && w([]), q(null));
        } finally {
          (ee(!1), W(!1), !R.current.feed && s && V("feed"));
        }
      },
      [N, g, a, $, r == null ? void 0 : r.role, i, A],
    );
  (o.useEffect(() => {
    ve();
  }, [ve]),
    o.useEffect(() => {
      const s = X();
      if (!s) return V("config");
      O("/admin/config/feed-page", { token: s })
        .then((h) => v({ ...Ie, ...h }))
        .catch(() => {})
        .finally(() => V("config"));
    }, []),
    o.useEffect(() => {
      (w([]), q(0), ae({ reset: !0 }));
    }, [g, N, $]),
    o.useEffect(() => {
      const s = ke.current;
      if (!s || A === null || K || D) return;
      const h = new IntersectionObserver(
        (T) => {
          const y = T[0];
          y != null &&
            y.isIntersecting &&
            !K &&
            !D &&
            A !== null &&
            ae({ reset: !1 });
        },
        { rootMargin: "220px" },
      );
      return (h.observe(s), () => h.disconnect());
    }, [ae, D, K, A]),
    o.useEffect(() => {
      if (!X()) return;
      const h = Yt({
        onNewPost(T) {
          const y = ce({ ...T, feed_type: "user_feed_post" });
          w((j) => (j.some((z) => z.id === y.id) ? j : [y, ...j]));
        },
        onDeletedPost(T) {
          w((y) => y.filter((j) => j.id !== T));
        },
        onUpdatedPost(T) {
          const y = ce({ ...T, feed_type: "user_feed_post" });
          w((j) => j.map((z) => (z.id === y.id ? y : z)));
        },
      });
      return () => (h == null ? void 0 : h.close());
    }, []),
    o.useEffect(() => {
      if (!te || !C.length) return;
      const s = C.find((h) => `${h.entityType}:${h.id}` === te);
      s && B(s);
    }, [te, C]));
  const Ne = o.useRef(null);
  o.useEffect(() => {
    Ne.current = Date.now();
  }, []);
  function Ke(s) {
    const h = `${s.entityType}:${s.id}`;
    return (G[h] || 0) > Ne.current;
  }
  async function we(s) {
    c({ type: "", message: "" });
    try {
      const h = `${window.location.origin}/feed?item=${encodeURIComponent(`${s.entityType}:${s.id}`)}`;
      (await ns(h),
        await O(
          `/social/${encodeURIComponent(s.entityType)}/${encodeURIComponent(s.id)}/share`,
          { method: "POST", token: a },
        ),
        c({ type: "success", message: i.messages.share_copied }));
    } catch (h) {
      c({ type: "error", message: h.message || "Share failed." });
    }
  }
  function Qe(s = null) {
    if (s != null && s.id) {
      const h =
        s.entityType === "buyer_request"
          ? "buyer_request"
          : s.entityType === "product" || s.entityType === "company_product"
            ? "product"
            : "feed_post";
      _t({ type: h, id: s.id, label: Le(s) });
    }
    t("/chat", {
      state: {
        lead: s ? { type: s.entityType, id: s.id, label: Le(s) } : void 0,
      },
    });
  }
  async function We(s) {
    if (!ge) {
      be(s.id);
      try {
        (await O(`/buyer-requests/${s.id}/express-interest`, {
          method: "POST",
          token: a,
        }),
          c({ type: "success", message: i.messages.interest_expressed }),
          He(s.id));
      } catch (h) {
        c({
          type: "error",
          message: h.message || "Failed to express interest.",
        });
      } finally {
        be("");
      }
    }
  }
  async function Ye(s) {
    fe(!0);
    try {
      (await O(
        `/social/${encodeURIComponent(P.entityType)}/${encodeURIComponent(P.id)}/report`,
        { method: "POST", token: a, body: { reason: s } },
      ),
        c({ type: "success", message: i.messages.report_submitted }),
        Y(null),
        Oe((h) => ({ ...h, [`${P.entityType}:${P.id}`]: Date.now() + 3e4 })));
    } catch (h) {
      c({ type: "error", message: h.message || "Report failed." });
    } finally {
      fe(!1);
    }
  }
  const _e = o.useMemo(
      () =>
        C.filter((s) => {
          var j, z;
          const h = [
              (j = s.author) == null ? void 0 : j.name,
              s.title,
              s.content,
              s.category,
              ...(s.tags || []),
              ...(s.productTags || []),
            ]
              .join(" ")
              .toLowerCase(),
            T = k === "" || h.includes(k.toLowerCase()),
            y =
              N === i.labels.categories ||
              ((z = s.category) == null ? void 0 : z.toLowerCase()) ===
                N.toLowerCase();
          return T && y;
        }),
      [C, k, N, i],
    ),
    Ze = o.useMemo(() => {
      const s = (r == null ? void 0 : r.role) || "";
      return s === "buyer"
        ? [
            { to: "/buyer-requests", label: "Post a Buyer Request" },
            { to: "/feed/manage", label: "Create Listing" },
          ]
        : s === "factory"
          ? [
              { to: "/product-management", label: "Create Listing" },
              { to: "/member-management", label: "Members" },
            ]
          : s === "buying_house"
            ? [
                { to: "/product-management", label: "Create Listing" },
                { to: "/agent", label: "Go to Agent Dashboard" },
              ]
            : [
                { to: "/feed/manage", label: "Create Listing" },
                { to: "/search", label: "Search" },
              ];
    }, [r == null ? void 0 : r.role]),
    re = o.useMemo(
      () => ({
        requests: C.filter((s) => s.entityType === "buyer_request").length,
        products: C.filter(
          (s) =>
            s.entityType === "company_product" || s.entityType === "product",
        ).length,
        posts: C.filter((s) => s.entityType === "user_feed_post").length,
      }),
      [C],
    );
  return H
    ? e.jsx(wt, { fill: !0, size: 80, text: "Loading feed..." })
    : e.jsxs("div", {
        className:
          "flex min-h-0 flex-1 flex-col bg-slate-50 text-slate-900 dark:bg-[#0b1220] dark:text-slate-100",
        children: [
          e.jsx(de.div, {
            style: { y: se ? 0 : Je },
            className:
              "fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_25%),linear-gradient(180deg,#f8fbff_0%,#eef8ff_48%,#f8fbff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.20),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_25%),linear-gradient(180deg,#07111f_0%,#081627_45%,#06111f_100%)]",
          }),
          e.jsxs("div", {
            className:
              "flex min-h-0 flex-1 flex-col text-slate-900 transition-colors dark:text-white",
            children: [
              e.jsxs("div", {
                className:
                  "mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-6 px-4 py-4 md:px-6 lg:flex-row lg:overflow-hidden lg:p-6",
                children: [
                  e.jsxs("aside", {
                    "data-lenis-prevent": !0,
                    className:
                      "flex h-fit w-full flex-col gap-4 rounded-[32px] border border-white/70 bg-white/75 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 lg:h-full lg:w-[320px] lg:overflow-y-auto",
                    children: [
                      e.jsxs("div", {
                        className:
                          "rounded-[28px] bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-400 p-5 text-white shadow-xl shadow-sky-500/20",
                        children: [
                          e.jsx("div", {
                            className: "flex items-center justify-between",
                            children: e.jsxs("div", {
                              className: "flex items-center gap-3",
                              children: [
                                ((Ce = r == null ? void 0 : r.profile) !=
                                  null &&
                                  Ce.profile_image) ||
                                (r != null && r.avatar_url)
                                  ? e.jsx("img", {
                                      src:
                                        ((Se = r.profile) == null
                                          ? void 0
                                          : Se.profile_image) || r.avatar_url,
                                      alt:
                                        (r == null ? void 0 : r.name) || "User",
                                      className:
                                        "h-12 w-12 rounded-2xl object-cover",
                                    })
                                  : e.jsx("div", {
                                      className:
                                        "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur",
                                      children: e.jsx(Be, {
                                        className: "h-6 w-6",
                                      }),
                                    }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("p", {
                                      className:
                                        "text-sm/none font-medium opacity-90",
                                      children:
                                        r != null && r.role
                                          ? r.role.charAt(0).toUpperCase() +
                                            r.role.slice(1).replace(/_/g, " ")
                                          : "User",
                                    }),
                                    e.jsx("p", {
                                      className: "text-xl font-semibold",
                                      children:
                                        (r == null ? void 0 : r.name) ||
                                        "Feed Center",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                          e.jsxs("div", {
                            className:
                              "mt-4 flex items-center gap-2 text-sm opacity-95",
                            children: [
                              e.jsx(ts, { className: "h-4 w-4" }),
                              ((Te = r == null ? void 0 : r.profile) == null
                                ? void 0
                                : Te.bio) || i.labels.premium_badge,
                            ],
                          }),
                          (r == null ? void 0 : r.email) &&
                            e.jsx("div", {
                              className: "mt-2 text-xs opacity-75",
                              children: r.email,
                            }),
                        ],
                      }),
                      e.jsxs("div", {
                        className:
                          "rounded-[28px] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/60",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              e.jsx("h2", {
                                className:
                                  "text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400",
                                children: i.labels.quick_actions,
                              }),
                              e.jsx("span", {
                                className:
                                  "rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-300",
                                children: i.labels.live_status,
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "mt-4 grid gap-3",
                            children: Ze.map((s) =>
                              e.jsxs(
                                Z,
                                {
                                  to: s.to,
                                  className:
                                    "flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-sky-500/10 dark:hover:text-sky-300",
                                  children: [
                                    e.jsxs("span", {
                                      className: "flex items-center gap-2",
                                      children: [
                                        s.label.includes("Post")
                                          ? e.jsx(rs, { className: "h-4 w-4" })
                                          : e.jsx(Ee, { className: "h-4 w-4" }),
                                        s.label,
                                      ],
                                    }),
                                    e.jsx(es, { className: "h-4 w-4" }),
                                  ],
                                },
                                s.to,
                              ),
                            ),
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className:
                          "rounded-[28px] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/60",
                        children: [
                          e.jsxs("div", {
                            className:
                              "flex items-center justify-between gap-3",
                            children: [
                              e.jsx("h2", {
                                className:
                                  "text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400",
                                children: "Search",
                              }),
                              e.jsx("span", {
                                className:
                                  "rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                                children: "Feed",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "mt-4 relative",
                            children: [
                              e.jsx(Zt, {
                                className:
                                  "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400",
                              }),
                              e.jsx("input", {
                                value: k,
                                onChange: (s) => J(s.target.value),
                                placeholder: i.labels.search_placeholder,
                                className:
                                  "w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className:
                          "rounded-[28px] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/60",
                        children: [
                          e.jsx("h2", {
                            className:
                              "text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400",
                            children: i.labels.categories,
                          }),
                          e.jsxs("div", {
                            className: "mt-4 flex flex-wrap gap-2",
                            children: [
                              e.jsx(xe, {
                                active: N === i.labels.categories,
                                onClick: () => _(i.labels.categories),
                                children: i.labels.categories,
                              }),
                              I.map((s) =>
                                e.jsx(
                                  xe,
                                  {
                                    active: N === s,
                                    onClick: () => _(s),
                                    children: s,
                                  },
                                  s,
                                ),
                              ),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("main", {
                    "data-lenis-prevent": !0,
                    className:
                      "min-w-0 flex-1 space-y-6 overflow-y-auto pb-4 lg:pb-0",
                    children: [
                      e.jsx(de.section, {
                        className:
                          "rounded-[32px] border border-white/70 bg-white/75 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 sm:p-6",
                        style: { scale: se ? 1 : Ge },
                        children: e.jsx("div", {
                          className:
                            "flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between",
                          children: e.jsxs("div", {
                            className:
                              "grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[540px]",
                            children: [
                              e.jsx(ue, {
                                icon: e.jsx(as, { className: "h-3 w-3" }),
                                label: i.labels.stats.buyer_requests,
                                value: String(re.requests),
                                accent: "sky",
                              }),
                              e.jsx(ue, {
                                icon: e.jsx(Be, { className: "h-3 w-3" }),
                                label: i.labels.stats.company_products,
                                value: String(re.products),
                                accent: "blue",
                              }),
                              e.jsx(ue, {
                                icon: e.jsx(ss, { className: "h-3 w-3" }),
                                label: i.labels.stats.feed_posts,
                                value: String(re.posts),
                                accent: "indigo",
                              }),
                            ],
                          }),
                        }),
                      }),
                      e.jsx("section", {
                        className:
                          "rounded-[32px] border border-white/70 bg-white/75 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 sm:p-5",
                        children: e.jsxs("div", {
                          className:
                            "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between",
                          children: [
                            e.jsx("div", {
                              className: "flex flex-wrap gap-2",
                              children: i.tabs.map((s) =>
                                e.jsx(
                                  xe,
                                  {
                                    active: g === s,
                                    onClick: () => b(s),
                                    children: s,
                                  },
                                  s,
                                ),
                              ),
                            }),
                            e.jsxs("div", {
                              className: "flex flex-wrap items-center gap-3",
                              children: [
                                e.jsxs("button", {
                                  className:
                                    "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-500/30 dark:hover:text-sky-300",
                                  children: [
                                    e.jsx(Xt, { className: "h-4 w-4" }),
                                    "Filters",
                                  ],
                                }),
                                e.jsxs(Z, {
                                  to: "/feed/manage",
                                  className:
                                    "inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600",
                                  children: [
                                    e.jsx(Ee, { className: "h-4 w-4" }),
                                    "Create post",
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                      (p == null ? void 0 : p.message) &&
                        e.jsx("div", {
                          className: `rounded-2xl p-4 text-sm ring-1 ${p.type === "error" ? "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30" : p.type === "success" ? "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/25" : "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/25"}`,
                          children: e.jsxs("div", {
                            className:
                              "flex items-center justify-between gap-3",
                            children: [
                              e.jsx("p", {
                                className: "font-medium",
                                children: p.message,
                              }),
                              ye &&
                                e.jsx("button", {
                                  type: "button",
                                  onClick: () =>
                                    t("/chat", {
                                      state: {
                                        notice: `Buyer request ${ye} claimed. Open inbox to continue.`,
                                      },
                                    }),
                                  className:
                                    "rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8",
                                  children: "Open Chat",
                                }),
                            ],
                          }),
                        }),
                      e.jsxs("section", {
                        className: "grid gap-5",
                        children: [
                          F
                            ? e.jsxs("div", {
                                className:
                                  "rounded-2xl bg-rose-50 p-6 text-sm text-rose-800 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30",
                                children: [
                                  F,
                                  e.jsx("div", {
                                    className: "mt-3",
                                    children: e.jsx("button", {
                                      type: "button",
                                      onClick: () => ae({ reset: !0 }),
                                      className:
                                        "rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8",
                                      children: "Retry",
                                    }),
                                  }),
                                ],
                              })
                            : null,
                          !D &&
                            !F &&
                            _e.length === 0 &&
                            e.jsx("div", {
                              className:
                                "rounded-[32px] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400",
                              children: i.messages.no_results,
                            }),
                          !D &&
                            !F &&
                            _e.map((s, h) => {
                              const T = te === `${s.entityType}:${s.id}`,
                                y = Ke(s);
                              return e.jsx(
                                de.div,
                                {
                                  initial: se ? !1 : { opacity: 0, y: 20 },
                                  animate: se ? !1 : { opacity: 1, y: 0 },
                                  transition: {
                                    duration: 0.45,
                                    ease: [0.16, 1, 0.3, 1],
                                    delay: h * 0.05,
                                  },
                                  children: e.jsx(Jt, {
                                    item: s,
                                    highlight: T,
                                    canExpressInterest:
                                      Ve && s.entityType === "buyer_request",
                                    expressInterestDisabled: ge === s.id,
                                    onExpressInterest: () => We(s),
                                    onOpenComments: () => B(s),
                                    onShare: () => we(s),
                                    onReport: () => {
                                      if (y) {
                                        c({
                                          type: "info",
                                          message: i.messages.rate_limited,
                                        });
                                        return;
                                      }
                                      Y(s);
                                    },
                                    onMessage: () => Qe(s),
                                  }),
                                },
                                `${s.entityType}:${s.id}`,
                              );
                            }),
                          e.jsx("div", { ref: ke, className: "h-10" }),
                          K
                            ? e.jsx("div", {
                                className:
                                  "rounded-[28px] border border-white/60 bg-white/85 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 p-5",
                                children: e.jsx("div", {
                                  className:
                                    "h-3 w-40 mx-auto rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5",
                                }),
                              })
                            : null,
                          !D && !F && A === null
                            ? e.jsx("div", {
                                className:
                                  "text-center text-xs text-slate-400 dark:text-slate-500 py-3",
                                children: i.messages.all_caught_up,
                              })
                            : null,
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx(Kt, {
                open: !!f,
                onClose: () => B(null),
                item: f,
                onShare: () => f && we(f),
              }),
              e.jsx(Qt, {
                open: !!P,
                item: P,
                onClose: () => Y(null),
                onSubmit: (s) => Ye(s),
              }),
            ],
          }),
        ],
      });
}
export { vs as default };
