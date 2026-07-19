import {
  r as x,
  o as ae,
  j as e,
  N as re,
  L as ne,
  k as le,
  q as H,
  m as oe,
  M as ie,
  F as de,
  G as ce,
  H as xe,
  I as me,
  J as he,
  K as ue,
  O as pe,
  P as ge,
  Q as fe,
  T as be,
  U as je,
  l as ye,
  g as O,
  _ as ve,
} from "./index-CNnTWoea.js";
import { W as we } from "./WordCount-CRyixXyU.js";
import { R as ke, a as Ne } from "./Item-BnAepobv.js";
const m = {
    ArrowLeft: (n) =>
      e.jsxs("svg", {
        ...n,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e.jsx("path", { d: "M19 12H5" }),
          e.jsx("path", { d: "M12 19l-7-7 7-7" }),
        ],
      }),
    Check: (n) =>
      e.jsx("svg", {
        ...n,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: e.jsx("path", { d: "M20 6L9 17l-5-5" }),
      }),
    Upload: (n) =>
      e.jsxs("svg", {
        ...n,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e.jsx("path", { d: "M12 16V4" }),
          e.jsx("path", { d: "M8 8l4-4 4 4" }),
          e.jsx("path", { d: "M4 20h16" }),
        ],
      }),
    Image: (n) =>
      e.jsxs("svg", {
        ...n,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e.jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
          e.jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
          e.jsx("path", { d: "M21 15l-5-5L5 21" }),
        ],
      }),
    Plus: (n) =>
      e.jsx("svg", {
        ...n,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: e.jsx("path", { d: "M12 5v14M5 12h14" }),
      }),
    Play: (n) =>
      e.jsx("svg", {
        ...n,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        children: e.jsx("polygon", { points: "5,3 19,12 5,21" }),
      }),
    Refresh: (n) =>
      e.jsxs("svg", {
        ...n,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e.jsx("path", { d: "M21 12a9 9 0 1 1-3-6.7" }),
          e.jsx("path", { d: "M21 3v6h-6" }),
        ],
      }),
    Sparkles: (n) =>
      e.jsx("svg", {
        ...n,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: e.jsx("path", {
          d: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z",
        }),
      }),
    Trash: (n) =>
      e.jsxs("svg", {
        ...n,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e.jsx("path", { d: "M3 6h18" }),
          e.jsx("path", { d: "M8 6V4h8v2" }),
          e.jsx("path", { d: "M6 6l1 14h10l1-14" }),
        ],
      }),
    X: (n) =>
      e.jsx("svg", {
        ...n,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: e.jsx("path", { d: "M6 6l12 12M6 18L18 6" }),
      }),
  },
  V = {
    title: "",
    category: "",
    caption: "",
    readme: "",
    ctaText: "",
    ctaUrl: "",
    hashtags: "",
    mentions: "",
    links: "",
    productTags: "",
    location: "",
  };
function T(n) {
  return n
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}
function Ce(n) {
  if (!n) return "Just now";
  const o = Date.now(),
    S = new Date(n);
  if (Number.isNaN(S.getTime())) return n;
  const t = o - S.getTime(),
    N = Math.floor(t / 1e3),
    v = Math.floor(N / 60),
    w = Math.floor(v / 60),
    f = Math.floor(w / 24),
    b = Math.floor(f / 7),
    U = Math.floor(f / 30);
  return N < 10
    ? "Just now"
    : N < 60
      ? `${N} seconds ago`
      : v === 1
        ? "1 minute ago"
        : v < 60
          ? `${v} minutes ago`
          : w === 1
            ? "1 hour ago"
            : w < 24
              ? `${w} hours ago`
              : f === 1
                ? "1 day ago"
                : f < 7
                  ? `${f} days ago`
                  : b === 1
                    ? "1 week ago"
                    : b < 5
                      ? `${b} weeks ago`
                      : U === 1
                        ? "1 month ago"
                        : `${U} months ago`;
}
function a(...n) {
  return n.filter(Boolean).join(" ");
}
function Ae() {
  const n = x.useRef(null),
    { theme: o, toggleTheme: S } = ae(),
    [t, N] = x.useState(V),
    [v, w] = x.useState([]),
    [f, b] = x.useState([]),
    [U, _] = x.useState(!0),
    [B, $] = x.useState(!1),
    [R, D] = x.useState(!1),
    [F, c] = x.useState(""),
    [j, I] = x.useState(null),
    [q, J] = x.useState(!0);
  x.useEffect(() => {
    let s = !1,
      l = !1;
    function r() {
      s && l && J(!1);
    }
    const i = async () => {
        (_(!0), c(""));
        try {
          const d = O(),
            y = await fetch("/api/feed/posts/mine", {
              headers: d ? { Authorization: `Bearer ${d}` } : void 0,
            });
          if (!y.ok) throw new Error("Failed to load your posts");
          const k = await y.json(),
            E = Array.isArray(k)
              ? k
              : Array.isArray(k == null ? void 0 : k.posts)
                ? k.posts
                : [];
          b(E);
        } catch (d) {
          const y =
            d instanceof Error ? d.message : "Failed to load your posts";
          c(y);
        } finally {
          (_(!1), (s = !0), r());
        }
      },
      M = async () => {
        try {
          await ve(O());
        } finally {
          ((l = !0), r());
        }
      };
    (i(), M());
  }, []);
  const G = t.ctaText.trim().length > 0,
    X = t.readme.trim().length > 0,
    C = x.useMemo(
      () => ({
        hashtags: T(t.hashtags),
        mentions: T(t.mentions),
        links: T(t.links),
        productTags: T(t.productTags),
      }),
      [t.hashtags, t.mentions, t.links, t.productTags],
    ),
    h = (s, l) => {
      N((r) => ({ ...r, [s]: l }));
    },
    K = () => {
      var s;
      return (s = n.current) == null ? void 0 : s.click();
    },
    Q = async (s) => {
      if (s != null && s.length) {
        ($(!0), c(""));
        try {
          const l = Array.from(s).map((r) => ({
            id: `${r.name}-${r.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
            file: r,
            name: r.name,
            type: r.type || "application/octet-stream",
            url: URL.createObjectURL(r),
          }));
          w((r) => [...r, ...l]);
        } catch (l) {
          const r = l instanceof Error ? l.message : "Upload failed";
          c(r);
        } finally {
          ($(!1), n.current && (n.current.value = ""));
        }
      }
    },
    W = () => {
      (N(V), w([]), I(null), c(""));
    },
    Y = (s) => {
      (I(s),
        N({
          title: s.title || "",
          category: s.category || "",
          caption: s.caption || "",
          readme: s.description_markdown || s.readme || "",
          ctaText: s.cta_text || s.ctaText || "",
          ctaUrl: s.cta_url || s.ctaUrl || "",
          hashtags: Array.isArray(s.hashtags)
            ? s.hashtags.join(", ")
            : s.hashtags || "",
          mentions: Array.isArray(s.mentions)
            ? s.mentions.join(", ")
            : s.mentions || "",
          links: Array.isArray(s.links) ? s.links.join(", ") : s.links || "",
          productTags: Array.isArray(s.product_tags)
            ? s.product_tags.join(", ")
            : s.product_tags || s.productTags || "",
          location: s.location_tag || s.location || "",
        }));
      const l = (s.media || []).map((r) => ({
        id: `${r.url || r.name}-${Math.random().toString(36).slice(2, 8)}`,
        file: null,
        name: r.name || "Media",
        type: r.type || "image/jpeg",
        url: r.url || r,
      }));
      (w(l), window.scrollTo({ top: 0, behavior: "smooth" }));
    },
    Z = async () => {
      if (!t.title.trim()) {
        c("Title is required.");
        return;
      }
      const s = localStorage.getItem("jwt") || localStorage.getItem("token");
      if (!s) {
        c("Please log in again. Token missing.");
        return;
      }
      (D(!0), c(""));
      const l = {
          title: t.title,
          category: t.category,
          caption: t.caption,
          description_markdown: t.readme,
          cta_text: t.ctaText,
          cta_url: t.ctaUrl,
          hashtags: T(t.hashtags),
          mentions: T(t.mentions),
          links: T(t.links),
          product_tags: T(t.productTags),
          location_tag: t.location,
          media: v.map((d) => ({ name: d.name, type: d.type, url: d.url })),
        },
        r = j !== null,
        i = r ? `/api/feed/posts/${j.id}` : "/api/feed/posts",
        M = r ? "PATCH" : "POST";
      try {
        const d = await fetch(i, {
          method: M,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${s}`,
          },
          body: JSON.stringify(l),
        });
        if (!d.ok) throw new Error("Save failed");
        const y = await d.json(),
          k = (y == null ? void 0 : y.post) ?? {
            id: r ? j.id : String(Date.now()),
            ...l,
            createdAt: new Date().toISOString(),
          };
        (b(r ? (E) => E.map((z) => (z.id === j.id ? k : z)) : (E) => [k, ...E]),
          W());
      } catch (d) {
        const y = d instanceof Error ? d.message : "Save failed";
        c(y);
      } finally {
        D(!1);
      }
    },
    ee = async (s) => {
      const l = localStorage.getItem("jwt") || localStorage.getItem("token");
      if (!l) {
        c("Please log in again. Token missing.");
        return;
      }
      const r = f;
      (c(""), b((i) => i.filter((M) => M.id !== s)));
      try {
        if (
          !(
            await fetch(`/api/feed/posts/${s}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${l}` },
            })
          ).ok
        )
          throw new Error("Delete failed");
      } catch (i) {
        b(r);
        const M = i instanceof Error ? i.message : "Delete failed";
        c(M);
      }
    },
    se = (s) => {
      w((l) => {
        const r = l.find((i) => i.id === s);
        return (r && URL.revokeObjectURL(r.url), l.filter((i) => i.id !== s));
      });
    },
    te =
      o === "dark"
        ? "bg-slate-950 text-slate-100"
        : "bg-slate-50 text-slate-900",
    P =
      o === "dark"
        ? "bg-white/5 border-white/10 shadow-[0_20px_80px_-30px_rgba(56,189,248,0.25)]"
        : "bg-white border-slate-200 shadow-[0_20px_80px_-30px_rgba(14,165,233,0.18)]",
    u = o === "dark" ? "text-slate-400" : "text-slate-500",
    A = o === "dark" ? "border-white/10" : "border-slate-200",
    p =
      o === "dark"
        ? "bg-slate-900/60 text-slate-100 placeholder:text-slate-500 border-white/10 focus:border-sky-400"
        : "bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-sky-500";
  return q
    ? e.jsx(re, { fill: !0 })
    : e.jsxs("div", {
        className: a("min-h-screen transition-colors duration-300", te),
        children: [
          e.jsx("div", {
            className: a(
              "border-b backdrop-blur-xl",
              o === "dark"
                ? "border-white/10 bg-slate-950/70"
                : "border-slate-200 bg-white/80",
            ),
            children: e.jsx("div", {
              className: "mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8",
              children: e.jsxs("div", {
                className:
                  "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
                children: [
                  e.jsx("div", {
                    className: "space-y-2",
                    children: e.jsxs("div", {
                      children: [
                        e.jsx("h1", {
                          className:
                            "text-3xl font-semibold tracking-tight sm:text-4xl",
                          children: "Feed Management",
                        }),
                        e.jsx("p", {
                          className: a("mt-1 text-sm sm:text-base", u),
                          children: "Create and manage your feed posts.",
                        }),
                      ],
                    }),
                  }),
                  e.jsxs("div", {
                    className: "flex flex-wrap items-center gap-3",
                    children: [
                      e.jsxs(ne, {
                        to: "/feed",
                        className:
                          "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-lg",
                        children: [
                          e.jsx(m.ArrowLeft, { className: "h-4 w-4" }),
                          "Back to Feed",
                        ],
                      }),
                      e.jsx("button", {
                        type: "button",
                        onClick: S,
                        className: a(
                          "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-lg",
                          P,
                        ),
                        children: o === "dark" ? "Light mode" : "Dark mode",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
          e.jsxs("div", {
            className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8",
            children: [
              F
                ? e.jsx("div", {
                    className:
                      "mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-lg",
                    children: e.jsxs("div", {
                      className: "flex items-start gap-3",
                      children: [
                        e.jsx("div", {
                          className:
                            "mt-0.5 rounded-full bg-red-500/20 p-1.5 text-red-300",
                          children: e.jsx(m.X, { className: "h-4 w-4" }),
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("p", {
                              className: "font-medium text-red-100",
                              children: "Something went wrong",
                            }),
                            e.jsx("p", {
                              className: "mt-1 text-red-200/90",
                              children: F,
                            }),
                          ],
                        }),
                      ],
                    }),
                  })
                : null,
              e.jsxs("div", {
                className: "grid gap-6 lg:grid-cols-5",
                children: [
                  e.jsx("div", {
                    className: "lg:col-span-3 space-y-6",
                    children: e.jsxs("section", {
                      className: a(
                        "overflow-hidden rounded-3xl border backdrop-blur-xl",
                        P,
                      ),
                      children: [
                        e.jsx("div", {
                          className: a("border-b px-5 py-4", A),
                          children: e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [
                              e.jsx("div", {
                                className:
                                  "rounded-2xl bg-sky-500/15 p-2 text-sky-400",
                                children: e.jsx(m.Plus, {
                                  className: "h-5 w-5",
                                }),
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx("h2", {
                                    className: "text-lg font-semibold",
                                    children: j ? "Edit Post" : "Post Editor",
                                  }),
                                  e.jsx("p", {
                                    className: a("text-sm", u),
                                    children: j
                                      ? `Editing "${j.title}"`
                                      : "Compose, enrich, and publish your feed post.",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                        e.jsxs("div", {
                          className: "grid gap-5 p-5 sm:grid-cols-2",
                          children: [
                            e.jsx(g, {
                              label: "Title",
                              required: !0,
                              children: e.jsx("input", {
                                value: t.title,
                                onChange: (s) => h("title", s.target.value),
                                placeholder: "Title...",
                                className: a(
                                  "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                                  p,
                                ),
                              }),
                            }),
                            e.jsx(g, {
                              label: "Category",
                              children: e.jsx("input", {
                                value: t.category,
                                onChange: (s) => h("category", s.target.value),
                                placeholder: "Announcements",
                                className: a(
                                  "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                                  p,
                                ),
                              }),
                            }),
                            e.jsx(g, {
                              label: "Caption",
                              className: "sm:col-span-2",
                              children: e.jsx("textarea", {
                                value: t.caption,
                                onChange: (s) => h("caption", s.target.value),
                                placeholder: "Short feed caption...",
                                rows: 3,
                                className: a(
                                  "w-full resize-none rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                                  p,
                                ),
                              }),
                            }),
                            e.jsxs(g, {
                              label: "README / Longform",
                              className: "sm:col-span-2",
                              children: [
                                e.jsx("textarea", {
                                  value: t.readme,
                                  onChange: (s) => h("readme", s.target.value),
                                  placeholder: "Write markdown here...",
                                  rows: 8,
                                  className: a(
                                    "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                                    p,
                                    "min-h-[220px]",
                                  ),
                                }),
                                e.jsx(we, {
                                  text: t.readme,
                                  limit: (() => {
                                    const s = le();
                                    return String(
                                      (s == null
                                        ? void 0
                                        : s.subscription_status) || "",
                                    ).toLowerCase() === "premium"
                                      ? 1500
                                      : 600;
                                  })(),
                                }),
                              ],
                            }),
                            e.jsx(g, {
                              label: "CTA Text",
                              children: e.jsx("input", {
                                value: t.ctaText,
                                onChange: (s) => h("ctaText", s.target.value),
                                placeholder: "Optional",
                                className: a(
                                  "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                                  p,
                                ),
                              }),
                            }),
                            e.jsx(g, {
                              label: "CTA URL",
                              children: e.jsx("input", {
                                value: t.ctaUrl,
                                onChange: (s) => h("ctaUrl", s.target.value),
                                placeholder: "https://...",
                                className: a(
                                  "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                                  p,
                                ),
                              }),
                            }),
                            e.jsx(g, {
                              label: "Hashtags",
                              children: e.jsx("input", {
                                value: t.hashtags,
                                onChange: (s) => h("hashtags", s.target.value),
                                placeholder: "#launch, #update",
                                className: a(
                                  "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                                  p,
                                ),
                              }),
                            }),
                            e.jsx(g, {
                              label: "Mentions",
                              children: e.jsx("input", {
                                value: t.mentions,
                                onChange: (s) => h("mentions", s.target.value),
                                placeholder: "@buyer, @factory",
                                className: a(
                                  "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                                  p,
                                ),
                              }),
                            }),
                            e.jsx(g, {
                              label: "Links",
                              children: e.jsx("input", {
                                value: t.links,
                                onChange: (s) => h("links", s.target.value),
                                placeholder: "https://...",
                                className: a(
                                  "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                                  p,
                                ),
                              }),
                            }),
                            e.jsx(g, {
                              label: "Product Tags",
                              children: e.jsx("input", {
                                value: t.productTags,
                                onChange: (s) =>
                                  h("productTags", s.target.value),
                                placeholder: "cotton, denim, etc",
                                className: a(
                                  "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                                  p,
                                ),
                              }),
                            }),
                            e.jsx(g, {
                              label: "Location Tag",
                              className: "sm:col-span-2",
                              children: e.jsx("input", {
                                value: t.location,
                                onChange: (s) => h("location", s.target.value),
                                placeholder: "Dhaka, Bangladesh",
                                className: a(
                                  "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                                  p,
                                ),
                              }),
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: a("border-t px-5 py-5", A),
                          children: [
                            e.jsxs("div", {
                              className:
                                "flex items-center justify-between gap-4",
                              children: [
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("h3", {
                                      className:
                                        "text-sm font-semibold uppercase tracking-wide text-sky-400",
                                      children: "Media (images / videos)",
                                    }),
                                    e.jsx("p", {
                                      className: a("mt-1 text-sm", u),
                                      children:
                                        "Add product shots, announcements, or campaign videos.",
                                    }),
                                  ],
                                }),
                                e.jsx("input", {
                                  ref: n,
                                  type: "file",
                                  multiple: !0,
                                  accept:
                                    ".jpg,.jpeg,.png,.webp,.avif,.gif,.apng,.bmp,.tiff,.tif,.heic,.heif,.dcm,.tga,.svg,.eps,.pdf,.dng,.cr2,.cr3,.nef,.arw,.sr2,.orf,.raf,.psd,.ai,.xcf,.cdr,.mp4,.webm,.mkv,.flv,.vob,.ogv,.ogg,.rrc,.gifv,.mng,.mov,.avi,.qt,.wmv,.yuv,.rm,.asf,.amv,.m4p,.m4v,.mpg,.mp2,.mpeg,.mpe,.mpv,.svi,.3gp,.3g2,.mxf,.roq,.nsv,.f4v,.f4p,.f4a,.f4b,.mod",
                                  className: "hidden",
                                  onChange: (s) => Q(s.target.files),
                                }),
                                e.jsxs("button", {
                                  type: "button",
                                  onClick: K,
                                  disabled: B,
                                  className:
                                    "inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70",
                                  children: [
                                    B
                                      ? e.jsx(H, {
                                          variant: "bounce",
                                          color: "#6100ff",
                                          size: "small",
                                          text: "",
                                          textColor: "",
                                        })
                                      : e.jsx(m.Upload, {
                                          className: "h-4 w-4",
                                        }),
                                    B ? "Uploading..." : "Upload",
                                  ],
                                }),
                              ],
                            }),
                            e.jsx("div", {
                              className: "mt-5",
                              children:
                                v.length === 0
                                  ? e.jsxs("div", {
                                      className: a(
                                        "rounded-2xl border border-dashed px-5 py-8 text-center",
                                        o === "dark"
                                          ? "border-white/10 bg-slate-950/30"
                                          : "border-slate-200 bg-slate-50/70",
                                      ),
                                      children: [
                                        e.jsx(m.Image, {
                                          className: a("mx-auto h-10 w-10", u),
                                        }),
                                        e.jsx("p", {
                                          className: "mt-3 text-sm font-medium",
                                          children: "No media uploaded yet",
                                        }),
                                        e.jsx("p", {
                                          className: a("mt-1 text-sm", u),
                                          children:
                                            "Choose one or more images/videos to build a richer post.",
                                        }),
                                      ],
                                    })
                                  : e.jsx("div", {
                                      className:
                                        "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
                                      children: v.map((s) => {
                                        const l = s.type.startsWith("video");
                                        return e.jsxs(
                                          "div",
                                          {
                                            className: a(
                                              "group overflow-hidden rounded-3xl border transition hover:-translate-y-1",
                                              o === "dark"
                                                ? "border-white/10 bg-slate-950/40"
                                                : "border-slate-200 bg-white",
                                            ),
                                            children: [
                                              e.jsxs("div", {
                                                className:
                                                  "relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sky-500/20 via-cyan-400/10 to-transparent",
                                                children: [
                                                  l
                                                    ? e.jsxs(e.Fragment, {
                                                        children: [
                                                          e.jsx("video", {
                                                            src: s.url,
                                                            className:
                                                              "h-full w-full object-cover",
                                                            muted: !0,
                                                            playsInline: !0,
                                                          }),
                                                          e.jsx("div", {
                                                            className:
                                                              "absolute inset-0 grid place-items-center bg-black/20",
                                                            children: e.jsx(
                                                              "div",
                                                              {
                                                                className:
                                                                  "rounded-full bg-black/40 p-3 text-white backdrop-blur-sm",
                                                                children: e.jsx(
                                                                  m.Play,
                                                                  {
                                                                    className:
                                                                      "h-6 w-6 fill-white",
                                                                  },
                                                                ),
                                                              },
                                                            ),
                                                          }),
                                                        ],
                                                      })
                                                    : e.jsx(oe.div, {
                                                        initial: {
                                                          opacity: 0,
                                                          scale: 1.06,
                                                        },
                                                        whileInView: {
                                                          opacity: 1,
                                                          scale: 1,
                                                        },
                                                        viewport: {
                                                          once: !0,
                                                          margin: "-40px",
                                                        },
                                                        transition: {
                                                          duration: 0.5,
                                                          ease: [
                                                            0.16, 1, 0.3, 1,
                                                          ],
                                                        },
                                                        className:
                                                          "h-full w-full",
                                                        children: e.jsx("img", {
                                                          src: s.url,
                                                          alt: s.name,
                                                          className:
                                                            "h-full w-full object-cover",
                                                        }),
                                                      }),
                                                  e.jsx("button", {
                                                    type: "button",
                                                    onClick: () => se(s.id),
                                                    className:
                                                      "absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white opacity-100 transition hover:bg-black",
                                                    "aria-label":
                                                      "Remove media",
                                                    children: e.jsx(m.X, {
                                                      className: "h-4 w-4",
                                                    }),
                                                  }),
                                                ],
                                              }),
                                              e.jsxs("div", {
                                                className: "space-y-1 p-3",
                                                children: [
                                                  e.jsx("div", {
                                                    className:
                                                      "text-xs font-medium uppercase tracking-wide text-sky-400",
                                                    children: l
                                                      ? "Video"
                                                      : "Image",
                                                  }),
                                                  e.jsx("p", {
                                                    className:
                                                      "truncate text-sm font-medium",
                                                    children: s.name,
                                                  }),
                                                ],
                                              }),
                                            ],
                                          },
                                          s.id,
                                        );
                                      }),
                                    }),
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: a(
                            "flex flex-col gap-3 border-t px-5 py-5 sm:flex-row sm:items-center sm:justify-between",
                            A,
                          ),
                          children: [
                            e.jsxs("div", {
                              className: "flex gap-3",
                              children: [
                                e.jsxs("button", {
                                  type: "button",
                                  onClick: W,
                                  className: a(
                                    "inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg",
                                    P,
                                  ),
                                  children: [
                                    e.jsx(m.Refresh, { className: "h-4 w-4" }),
                                    j ? "Cancel" : "Clear",
                                  ],
                                }),
                                j &&
                                  e.jsx("span", {
                                    className:
                                      "inline-flex items-center gap-2 rounded-2xl bg-sky-500/10 px-4 py-3 text-sm font-medium text-sky-400",
                                    children: "Editing post",
                                  }),
                              ],
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: Z,
                              disabled: R,
                              className:
                                "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:translate-y-[-1px] hover:shadow-xl hover:shadow-sky-500/30 disabled:cursor-not-allowed disabled:opacity-70",
                              children: [
                                R
                                  ? e.jsx(H, {
                                      variant: "bounce",
                                      color: "#6100ff",
                                      size: "small",
                                      text: "",
                                      textColor: "",
                                    })
                                  : e.jsx(m.Check, { className: "h-4 w-4" }),
                                R
                                  ? "Saving..."
                                  : j
                                    ? "Update post"
                                    : "Save post",
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  e.jsxs("div", {
                    className: "lg:col-span-2 space-y-6",
                    children: [
                      e.jsxs("section", {
                        className: a(
                          "overflow-hidden rounded-3xl border backdrop-blur-xl",
                          P,
                        ),
                        children: [
                          e.jsxs("div", {
                            className: a("border-b px-5 py-4", A),
                            children: [
                              e.jsx("h2", {
                                className: "text-lg font-semibold",
                                children: "Live Preview",
                              }),
                              e.jsx("p", {
                                className: a("text-sm", u),
                                children:
                                  "Rendered markdown from your README field.",
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "px-5 py-5",
                            children: X
                              ? e.jsx("article", {
                                  className: a(
                                    "prose max-w-none",
                                    o === "dark"
                                      ? "prose-invert prose-headings:text-white prose-a:text-sky-400"
                                      : "prose-slate prose-headings:text-slate-900 prose-a:text-sky-600",
                                  ),
                                  children: e.jsx(ie, {
                                    remarkPlugins: [
                                      [de, { singleTilde: !1 }],
                                      ce,
                                      xe,
                                      me,
                                      he,
                                      ue,
                                      pe,
                                      ge,
                                      fe,
                                      be,
                                    ],
                                    components: {
                                      img({ src: s, alt: l, title: r, ...i }) {
                                        return e.jsx("img", {
                                          src: s,
                                          alt: l || "",
                                          title: r,
                                          loading: "lazy",
                                          className: "max-w-full rounded-xl",
                                          ...i,
                                        });
                                      },
                                      code({
                                        inline: s,
                                        className: l,
                                        children: r,
                                        ...i
                                      }) {
                                        return s
                                          ? e.jsx("code", {
                                              className: l,
                                              ...i,
                                              children: r,
                                            })
                                          : e.jsx(je, {
                                              className: l,
                                              ...i,
                                              children: r,
                                            });
                                      },
                                    },
                                    children: t.readme,
                                  }),
                                })
                              : e.jsxs("div", {
                                  className: a(
                                    "rounded-2xl border border-dashed px-5 py-10 text-center",
                                    o === "dark"
                                      ? "border-white/10 bg-slate-950/30"
                                      : "border-slate-200 bg-slate-50",
                                  ),
                                  children: [
                                    e.jsx(m.Sparkles, {
                                      className: a("mx-auto h-10 w-10", u),
                                    }),
                                    e.jsx("p", {
                                      className: "mt-3 text-sm font-medium",
                                      children: "No preview content yet",
                                    }),
                                    e.jsx("p", {
                                      className: a("mt-1 text-sm", u),
                                      children:
                                        "Start writing markdown to see it rendered instantly.",
                                    }),
                                  ],
                                }),
                          }),
                          e.jsxs("div", {
                            className: a("border-t px-5 py-5", A),
                            children: [
                              e.jsxs("div", {
                                className:
                                  "flex items-center justify-between gap-3",
                                children: [
                                  e.jsx("h3", {
                                    className:
                                      "text-sm font-semibold uppercase tracking-wide text-sky-400",
                                    children: "Content summary",
                                  }),
                                  e.jsxs("div", {
                                    className:
                                      "rounded-full border px-3 py-1 text-xs font-medium text-sky-400 border-sky-400/20 bg-sky-400/10",
                                    children: [v.length, " media"],
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "mt-4 grid gap-3 text-sm",
                                children: [
                                  e.jsx(L, {
                                    label: "CTA",
                                    value: G
                                      ? `${t.ctaText}${t.ctaUrl ? ` → ${t.ctaUrl}` : ""}`
                                      : "None",
                                  }),
                                  e.jsx(L, {
                                    label: "Hashtags",
                                    value: C.hashtags.length
                                      ? C.hashtags.join(", ")
                                      : "None",
                                  }),
                                  e.jsx(L, {
                                    label: "Mentions",
                                    value: C.mentions.length
                                      ? C.mentions.join(", ")
                                      : "None",
                                  }),
                                  e.jsx(L, {
                                    label: "Links",
                                    value: C.links.length
                                      ? C.links.join(", ")
                                      : "None",
                                  }),
                                  e.jsx(L, {
                                    label: "Product tags",
                                    value: C.productTags.length
                                      ? C.productTags.join(", ")
                                      : "None",
                                  }),
                                  e.jsx(L, {
                                    label: "Location",
                                    value: t.location || "None",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("section", {
                        className: a(
                          "overflow-hidden rounded-3xl border backdrop-blur-xl",
                          P,
                        ),
                        children: [
                          e.jsxs("div", {
                            className: a("border-b px-5 py-4", A),
                            children: [
                              e.jsx("h2", {
                                className: "text-lg font-semibold",
                                children: "Your posts",
                              }),
                              e.jsx("p", {
                                className: a("text-sm", u),
                                children: "Fetched from /api/feed/posts/mine",
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "p-5",
                            children: U
                              ? e.jsx("div", {
                                  className:
                                    "flex items-center justify-center py-10",
                                  children: e.jsx(ye, {
                                    color: "#3b00ff",
                                    size: "large",
                                    style: { fontSize: "40px" },
                                    text: "",
                                    textColor: "",
                                  }),
                                })
                              : f.length === 0
                                ? e.jsxs("div", {
                                    className: a(
                                      "rounded-2xl border border-dashed px-5 py-10 text-center",
                                      o === "dark"
                                        ? "border-white/10 bg-slate-950/30"
                                        : "border-slate-200 bg-slate-50",
                                    ),
                                    children: [
                                      e.jsx("div", {
                                        className:
                                          "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-400",
                                        children: e.jsx(m.Image, {
                                          className: "h-6 w-6",
                                        }),
                                      }),
                                      e.jsx("p", {
                                        className: "mt-3 text-sm font-medium",
                                        children: "No posts yet",
                                      }),
                                      e.jsx("p", {
                                        className: a("mt-1 text-sm", u),
                                        children:
                                          "Create your first post to populate this list.",
                                      }),
                                    ],
                                  })
                                : e.jsx(ke, {
                                    axis: "y",
                                    values: f,
                                    onReorder: b,
                                    className: "space-y-4",
                                    children: f.map((s) =>
                                      e.jsx(
                                        Ne,
                                        {
                                          value: s,
                                          children: e.jsxs("article", {
                                            className: a(
                                              "rounded-3xl border p-4 transition hover:-translate-y-0.5 hover:shadow-xl",
                                              o === "dark"
                                                ? "border-white/10 bg-slate-950/40"
                                                : "border-slate-200 bg-white",
                                            ),
                                            children: [
                                              e.jsxs("div", {
                                                className:
                                                  "flex items-start justify-between gap-3",
                                                children: [
                                                  e.jsxs("div", {
                                                    className: "min-w-0",
                                                    children: [
                                                      e.jsx("h3", {
                                                        className:
                                                          "truncate text-base font-semibold",
                                                        children: s.title,
                                                      }),
                                                      e.jsx("p", {
                                                        className:
                                                          "mt-0.5 text-xs uppercase tracking-wide text-slate-400",
                                                        children:
                                                          s.category ||
                                                          "Uncategorized",
                                                      }),
                                                    ],
                                                  }),
                                                  e.jsxs("div", {
                                                    className:
                                                      "flex items-center gap-2",
                                                    children: [
                                                      e.jsxs("button", {
                                                        type: "button",
                                                        onClick: () => Y(s),
                                                        className:
                                                          "inline-flex shrink-0 items-center gap-2 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300 transition hover:bg-sky-500/15",
                                                        children: [
                                                          e.jsx("svg", {
                                                            className:
                                                              "h-4 w-4",
                                                            viewBox:
                                                              "0 0 24 24",
                                                            fill: "none",
                                                            stroke:
                                                              "currentColor",
                                                            strokeWidth: "2",
                                                            children: e.jsx(
                                                              "path",
                                                              {
                                                                d: "M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z",
                                                              },
                                                            ),
                                                          }),
                                                          "Edit",
                                                        ],
                                                      }),
                                                      e.jsxs("button", {
                                                        type: "button",
                                                        onClick: () => ee(s.id),
                                                        className:
                                                          "inline-flex shrink-0 items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/15",
                                                        children: [
                                                          e.jsx(m.Trash, {
                                                            className:
                                                              "h-4 w-4",
                                                          }),
                                                          "Delete",
                                                        ],
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                              e.jsx("p", {
                                                className: a(
                                                  "mt-3 line-clamp-3 text-sm leading-6",
                                                  u,
                                                ),
                                                children:
                                                  s.caption ||
                                                  "No caption provided.",
                                              }),
                                              e.jsxs("div", {
                                                className:
                                                  "mt-4 flex items-center justify-between gap-3 text-xs",
                                                children: [
                                                  e.jsxs("div", {
                                                    className: a(
                                                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
                                                      o === "dark"
                                                        ? "border-white/10 bg-white/5 text-slate-300"
                                                        : "border-slate-200 bg-slate-50 text-slate-600",
                                                    ),
                                                    children: [
                                                      e.jsx("span", {
                                                        className:
                                                          "h-2 w-2 rounded-full bg-sky-400",
                                                      }),
                                                      "Created ",
                                                      Ce(s.createdAt),
                                                    ],
                                                  }),
                                                  e.jsx("div", {
                                                    className:
                                                      "text-sky-400/90",
                                                    children: "Published",
                                                  }),
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
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
}
function g({ label: n, required: o, className: S, children: t }) {
  return e.jsxs("div", {
    className: S,
    children: [
      e.jsxs("label", {
        className: "mb-2 block text-sm font-medium",
        children: [
          n,
          " ",
          o
            ? e.jsx("span", { className: "text-sky-400", children: "*" })
            : null,
        ],
      }),
      t,
    ],
  });
}
function L({ label: n, value: o }) {
  return e.jsxs("div", {
    className:
      "flex flex-col gap-1 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4",
    children: [
      e.jsx("span", {
        className: "text-xs font-semibold uppercase tracking-wide text-sky-400",
        children: n,
      }),
      e.jsx("span", {
        className: "text-sm text-slate-300 sm:text-right",
        children: o,
      }),
    ],
  });
}
export { Ae as default };
