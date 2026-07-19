import {
  z as H,
  r as l,
  g as Ne,
  o as Ce,
  d as f,
  j as a,
  N as Se,
  S as Pe,
  f as Me,
  X as qe,
  a3 as Ae,
  k as Ue,
  q as L,
  A as Te,
  m as Re,
  Z as T,
} from "./index-CNnTWoea.js";
import { U as ie, u as oe } from "./UploadProgressBar-D72lm7cT.js";
import { S as Ve, a as ze } from "./StaggerContainer-WchD9d0t.js";
import { F as De } from "./FlipCard-B_y38N36.js";
import { W as Ie } from "./WordCount-CRyixXyU.js";
import { S as ne } from "./sparkles-DVBGTjg1.js";
import { S as Ee, M as Ge } from "./sun-medium-CARggVbV.js";
import { P as Be } from "./plus-DAdOh4uA.js";
import { C as Oe } from "./clock-3-CmBp6Ora.js";
import { B as $e } from "./badge-check-CaFeTPUp.js";
import { E as Le } from "./eye-DfSxjFuN.js";
import { T as Fe } from "./trash-2-JDuZV4rk.js";
import { I as ce } from "./image-CIejvHOi.js";
import { V as He } from "./video-D4eN06Bi.js";
import { R as We } from "./rocket-CTn5LVY_.js";
import { C as Qe } from "./circle-check-CcIEJQvk.js";
import { R as Xe, a as Ye } from "./Item-BnAepobv.js";
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Je = [
    [
      "rect",
      { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" },
    ],
    [
      "rect",
      { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" },
    ],
    [
      "rect",
      { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" },
    ],
    [
      "rect",
      { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" },
    ],
  ],
  Ke = H("layout-grid", Je);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ze = [
    [
      "path",
      {
        d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
        key: "1a8usu",
      },
    ],
    ["path", { d: "m15 5 4 4", key: "1mk7zo" }],
  ],
  ea = H("pencil", Ze);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const aa = [
    ["path", { d: "M12 3v12", key: "1x0j5s" }],
    ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ],
  ta = H("upload", aa),
  R = {
    title: "",
    industry: "",
    category: "",
    material: "",
    moq: "",
    price_range: "",
    lead_time_days: "",
    fabric_gsm: "",
    size_range: "",
    color_pantone: "",
    customization_capabilities: "",
    sample_available: "",
    sample_lead_time_days: "",
    description: "",
    video_url: "",
    image_urls: [],
    cover_image_url: "",
    status: "draft",
  };
function v({ children: i, tone: b = "blue" }) {
  const p = {
    blue: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-400/15 dark:text-sky-200 dark:border-sky-500/20",
    green:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-200 dark:border-emerald-500/20",
    amber:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-400/15 dark:text-amber-200 dark:border-amber-500/20",
    slate:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-400/15 dark:text-slate-300 dark:border-slate-500/20",
  };
  return a.jsx("span", {
    className: `inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${p[b]}`,
    children: i,
  });
}
function F({ icon: i, label: b, value: p }) {
  return a.jsx("div", {
    className:
      "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70",
    children: a.jsxs("div", {
      className: "flex items-center gap-3",
      children: [
        a.jsx("div", {
          className:
            "rounded-xl bg-sky-500/10 p-2 text-sky-600 dark:text-sky-300",
          children: a.jsx(i, { className: "h-4 w-4" }),
        }),
        a.jsxs("div", {
          children: [
            a.jsx("div", {
              className:
                "text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400",
              children: b,
            }),
            a.jsx("div", {
              className: "text-lg font-semibold text-slate-900 dark:text-white",
              children: p,
            }),
          ],
        }),
      ],
    }),
  });
}
function h({ label: i, children: b, hint: p, required: j }) {
  return a.jsxs("label", {
    className: "block space-y-1.5",
    children: [
      a.jsxs("div", {
        className: "flex items-center justify-between gap-3",
        children: [
          a.jsxs("span", {
            className: "text-sm font-medium text-slate-700 dark:text-slate-200",
            children: [
              i,
              " ",
              j
                ? a.jsx("span", { className: "text-sky-500", children: "*" })
                : null,
            ],
          }),
          p
            ? a.jsx("span", {
                className: "text-xs text-slate-500 dark:text-slate-400",
                children: p,
              })
            : null,
        ],
      }),
      b,
    ],
  });
}
function va() {
  const i = l.useMemo(() => Ne(), []),
    { theme: b, toggleTheme: p } = Ce(),
    j = b === "dark",
    [k, w] = l.useState([]),
    [W, Q] = l.useState(!0),
    [V, ue] = l.useState(!0),
    [ra, C] = l.useState(""),
    [X, o] = l.useState(
      "Drafts stay private until you publish them after media review.",
    ),
    [Y, S] = l.useState(!1),
    [r, P] = l.useState(null),
    [d, c] = l.useState(R),
    [z, M] = l.useState(!1),
    [D, q] = l.useState(!1),
    [I, _] = l.useState([]),
    [E, J] = l.useState(!1),
    [xe, G] = l.useState(0),
    [K, y] = l.useState(""),
    [B, Z] = l.useState(!1),
    [me, O] = l.useState(0),
    [ee, g] = l.useState(""),
    [ae, A] = l.useState(!1),
    te = l.useRef(null),
    re = l.useRef(null),
    N = l.useCallback(async () => {
      if (i) {
        (Q(!0), C(""));
        try {
          const e = await f("/products?mine=true", { token: i });
          w(Array.isArray(e) ? e : []);
        } catch (e) {
          (C(e.message || "Failed to load products"), w([]));
        } finally {
          Q(!1);
        }
      }
    }, [i]);
  (l.useEffect(() => {
    N();
  }, [N]),
    l.useEffect(() => {
      V && !W && ue(!1);
    }, [V, W]));
  const $ = l.useMemo(() => {
    const e = k.filter((s) => s.status === "published").length,
      t = k.filter((s) => s.status === "draft").length;
    return { published: e, drafts: t, approved: e };
  }, [k]);
  async function he() {
    if (
      (Y && (S(!1), await new Promise((e) => setTimeout(e, 100))),
      P(null),
      c(R),
      o(""),
      y(""),
      _([]),
      A(!1),
      g(""),
      q(!1),
      S(!0),
      !i)
    ) {
      o("Please log in to create a product.");
      return;
    }
    try {
      M(!0);
      const e = await f("/products", {
        method: "POST",
        token: i,
        body: { createAsDraft: !0 },
      });
      e != null && e.id
        ? (P(e),
          c({ ...R, ...e }),
          _([]),
          await N(),
          o(
            "Create a new product. Media must be uploaded inside GarTexHub using internal /uploads/... URLs.",
          ))
        : o("Created draft manually. Save will create the product.");
    } catch (e) {
      (console.error("Create draft error:", e),
        o(
          e.message ||
            "Failed to create draft. You can still enter product details and save.",
        ));
    } finally {
      M(!1);
    }
  }
  function pe(e) {
    P(e);
    const t = (
        Array.isArray(e == null ? void 0 : e.image_urls) ? e.image_urls : []
      ).map((n) => U(n)),
      s = U(e == null ? void 0 : e.cover_image_url);
    (c({
      title: (e == null ? void 0 : e.title) || "",
      industry: (e == null ? void 0 : e.industry) || "",
      category: (e == null ? void 0 : e.category) || "",
      material: (e == null ? void 0 : e.material) || "",
      moq: (e == null ? void 0 : e.moq) || "",
      price_range: (e == null ? void 0 : e.price_range) || "",
      lead_time_days: (e == null ? void 0 : e.lead_time_days) || "",
      fabric_gsm: (e == null ? void 0 : e.fabric_gsm) || "",
      size_range: (e == null ? void 0 : e.size_range) || "",
      color_pantone: (e == null ? void 0 : e.color_pantone) || "",
      customization_capabilities:
        (e == null ? void 0 : e.customization_capabilities) || "",
      sample_available: (e == null ? void 0 : e.sample_available) || "",
      sample_lead_time_days:
        (e == null ? void 0 : e.sample_lead_time_days) || "",
      description: (e == null ? void 0 : e.description) || "",
      video_url: (e == null ? void 0 : e.video_url) || "",
      image_urls: t,
      cover_image_url: s,
      status: (e == null ? void 0 : e.status) || "draft",
    }),
      o(
        "Editing existing product. Drafts remain private; published items go live after review.",
      ),
      y(""),
      _(
        Array.isArray(e == null ? void 0 : e.image_gallery)
          ? e.image_gallery
          : [],
      ),
      A(!0),
      g(""),
      q(!1),
      S(!0));
  }
  function se() {
    (S(!1), P(null), c(R), y(""), g(""), q(!1), A(!1), N());
  }
  async function de(e) {
    var s;
    if (!i) {
      o("Please log in to save products.");
      return;
    }
    if (!d.title.trim()) {
      o("Product name is required.");
      return;
    }
    if (!d.industry.trim()) {
      o("Industry is required.");
      return;
    }
    if (!d.category.trim()) {
      o("Category is required.");
      return;
    }
    if (!d.material.trim()) {
      o("Material is required.");
      return;
    }
    if (!d.price_range.trim()) {
      o("Price range is required.");
      return;
    }
    if (!d.lead_time_days.trim()) {
      o("Lead time (days) is required.");
      return;
    }
    if (!d.description.trim()) {
      o("Description is required.");
      return;
    }
    if (!((s = d.image_urls) != null && s.length)) {
      o("At least one product image is required.");
      return;
    }
    if (!ae) {
      o("Please confirm the media compliance checklist before saving.");
      return;
    }
    (M(!0), C(""));
    const t = {
      ...d,
      status: e,
      industry: d.industry || "",
      category: d.category || "",
      material: d.material || "",
      moq: d.moq || "",
      price_range: d.price_range || "",
      lead_time_days: d.lead_time_days || "",
    };
    try {
      let n;
      (r != null && r.id
        ? ((n = await f(`/products/${encodeURIComponent(r.id)}`, {
            method: "PATCH",
            token: i,
            body: t,
          })),
          w((u) => u.map((m) => (m.id === n.id ? n : m))),
          o(
            e === "published"
              ? "Product updated and published."
              : "Draft saved.",
          ),
          (r == null ? void 0 : r.status) !== "published" &&
            e === "published" &&
            T("product_published", { entityType: "product", entityId: n.id }))
        : ((n = await f("/products", { method: "POST", token: i, body: t })),
          w((u) => [n, ...u]),
          o(
            e === "published"
              ? "Product created and published."
              : "Draft saved.",
          ),
          e === "published" &&
            T("product_published", { entityType: "product", entityId: n.id })),
        await N(),
        se());
    } catch (n) {
      (console.error("Save error:", n),
        o(n.message || "Save failed. Please try again."));
    } finally {
      M(!1);
    }
  }
  async function be(e) {
    if (!i || !e) return;
    const t = k.find((n) => n.id === e);
    if (!t) {
      o("Product not found in list.");
      return;
    }
    if (window.confirm(`Delete "${t.title || t.name || "this product"}"?`)) {
      (C(""), o(""));
      try {
        (await f(`/products/${encodeURIComponent(e)}`, {
          method: "DELETE",
          token: i,
        }),
          w((n) => n.filter((u) => u.id !== e)),
          o("Product deleted."));
      } catch (n) {
        (console.error("Delete error:", n),
          o(
            n.message ||
              "Delete failed. The product may have already been deleted.",
          ));
      }
    }
  }
  function U(e = "") {
    if (!e) return "";
    const t = String(e).replace(/\\/g, "/");
    if (t.startsWith("/uploads/")) return t;
    if (t.startsWith("uploads/")) return `/${t}`;
    if (t.includes("server/uploads/")) {
      const s = t.indexOf("server/uploads/");
      return `/uploads/${t.slice(s + 15)}`;
    }
    if (t.startsWith("http")) {
      const s = t.match(/uploads\/(.+)$/);
      if (s) return `/uploads/${s[1]}`;
    }
    return `/uploads/${t}`;
  }
  function ge(e = "") {
    if (!e) return "";
    const t = String(e).replace(/\\/g, "/");
    if (t.startsWith("/uploads/")) return t;
    const s = t.indexOf("server/uploads/");
    return s >= 0
      ? `/uploads/${t.slice(s + 15)}`
      : t.startsWith("uploads/")
        ? `/${t}`
        : t;
  }
  function fe(e) {
    return e === "approved"
      ? a.jsx("span", {
          className:
            "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
          children: "Approved",
        })
      : e === "rejected"
        ? a.jsx("span", {
            className:
              "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/20 dark:text-red-300",
            children: "Rejected",
          })
        : e === "pending_review"
          ? a.jsx("span", {
              className:
                "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
              children: "Pending",
            })
          : a.jsx("span", {
              className:
                "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
              children: e,
            });
  }
  async function ke(e) {
    var t;
    if (!(r != null && r.id) || !i) {
      y("Save the product first to upload images.");
      return;
    }
    if (!(!e || !e.length)) {
      (J(!0), G(0), y(""));
      try {
        const s = [];
        for (const u of e) {
          const m = await oe("/documents", {
              file: u,
              token: i,
              fields: {
                entity_type: "company_product",
                entity_id: r.id,
                type: "image",
              },
              onProgress: G,
            }),
            le = U(m.file_path || m.url || "");
          (s.push({
            document_id: m.id,
            source_path: le,
            url: ge(le),
            status: m.moderation_status || "pending_review",
            flags: Array.isArray(m.moderation_flags) ? m.moderation_flags : [],
          }),
            T("product_image_uploaded", {
              entityType: "product",
              entityId: r.id,
              metadata: { document_id: m.id },
            }));
        }
        const n = {
          ...d,
          image_urls: Array.from(
            new Set([
              ...(d.image_urls || []),
              ...s.map((u) => u.source_path).filter(Boolean),
            ]),
          ),
          cover_image_url:
            d.cover_image_url ||
            ((t = s[0]) == null ? void 0 : t.source_path) ||
            "",
        };
        (c(n), _((u) => [...u, ...s]), await ve(n));
      } catch (s) {
        y(s.message || "Image upload failed");
      } finally {
        (J(!1), G(0));
      }
    }
  }
  async function ye(e) {
    if (!(r != null && r.id) || !i) {
      g("Save the product first to upload a video.");
      return;
    }
    if (e) {
      (Z(!0), O(0), g(""));
      try {
        const t = await oe("/documents", {
            file: e,
            token: i,
            fields: {
              entity_type: "company_product",
              entity_id: r.id,
              type: "video",
            },
            onProgress: O,
          }),
          s = U(t.file_path || t.url || "");
        (await je(s),
          g("Video uploaded and pending review."),
          T("product_video_uploaded", {
            entityType: "product",
            entityId: r.id,
            metadata: { document_id: t.id },
          }));
      } catch (t) {
        g(t.message || "Video upload failed");
      } finally {
        (Z(!1), O(0));
      }
    }
  }
  async function ve(e) {
    if (!(!(r != null && r.id) || !i))
      try {
        await f(`/products/${encodeURIComponent(r.id)}`, {
          method: "PATCH",
          token: i,
          body: {
            image_urls: e.image_urls,
            cover_image_url: e.cover_image_url,
          },
        });
      } catch (t) {
        console.error("Sync media failed:", t);
      }
  }
  async function je(e) {
    if (!(!(r != null && r.id) || !i))
      try {
        await f(`/products/${encodeURIComponent(r.id)}`, {
          method: "PATCH",
          token: i,
          body: { video_url: e },
        });
      } catch (t) {
        console.error("Sync video failed:", t);
      }
  }
  function we(e) {
    _(e);
    const t = e.map((s) => s.source_path).filter(Boolean);
    c((s) => ({
      ...s,
      image_urls: t,
      cover_image_url: s.cover_image_url || t[0] || "",
    }));
  }
  const _e = (r == null ? void 0 : r.id) !== null,
    x =
      "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400/40 dark:focus:ring-sky-400/15";
  return V
    ? a.jsx(Se, { fill: !0 })
    : a.jsx("div", {
        className: j ? "dark" : "",
        children: a.jsxs("div", {
          className:
            "min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100",
          children: [
            a.jsxs("div", {
              className:
                "relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:bg-none dark:from-transparent dark:via-transparent dark:to-transparent",
              children: [
                a.jsx("div", {
                  className:
                    "hidden dark:block absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_36%),radial_gradient(circle_at_top_right,_rgba(96,165,250,0.16),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,1)_0%,_rgba(3,7,18,1)_100%)]",
                }),
                a.jsx("div", {
                  className:
                    "hidden dark:block absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px] opacity-35",
                }),
                a.jsxs("main", {
                  className:
                    "relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
                  children: [
                    a.jsxs("div", {
                      className:
                        "mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
                      children: [
                        a.jsxs("div", {
                          children: [
                            a.jsxs("div", {
                              className:
                                "mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-700 shadow-sm backdrop-blur dark:border-sky-400/20 dark:text-sky-200",
                              children: [
                                a.jsx(ne, { className: "h-3.5 w-3.5" }),
                                "Premium Product Management",
                              ],
                            }),
                            a.jsx("h1", {
                              className:
                                "text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl",
                              children: "Product Management",
                            }),
                            a.jsx("p", {
                              className:
                                "mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base",
                              children:
                                "Buying houses and factories can post products. Drafts stay private; published items go live after media review.",
                            }),
                          ],
                        }),
                        a.jsxs("div", {
                          className: "flex items-center gap-3",
                          children: [
                            a.jsxs("button", {
                              onClick: p,
                              className:
                                "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
                              children: [
                                j
                                  ? a.jsx(Ee, {
                                      className: "h-4 w-4 text-amber-500",
                                    })
                                  : a.jsx(Ge, {
                                      className: "h-4 w-4 text-sky-500",
                                    }),
                                j ? "Light mode" : "Dark mode",
                              ],
                            }),
                            a.jsxs("button", {
                              onClick: he,
                              className:
                                "inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:scale-[1.01] hover:shadow-sky-500/35",
                              children: [
                                a.jsx(Be, { className: "h-4 w-4" }),
                                "Create product",
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    a.jsx(Pe, {
                      as: "section",
                      children: a.jsxs("div", {
                        className: "mb-6 grid gap-4 md:grid-cols-3",
                        children: [
                          a.jsx(F, {
                            icon: Ke,
                            label: "Published",
                            value: $.published,
                          }),
                          a.jsx(F, {
                            icon: Oe,
                            label: "Drafts",
                            value: $.drafts,
                          }),
                          a.jsx(F, {
                            icon: $e,
                            label: "Approved media",
                            value: $.approved,
                          }),
                        ],
                      }),
                    }),
                    a.jsx("div", {
                      className:
                        "mb-6 rounded-3xl border border-sky-200 bg-white p-5 shadow-sm dark:border-sky-400/15 dark:bg-white/5 dark:shadow-2xl dark:shadow-sky-950/20 dark:backdrop-blur",
                      children: a.jsxs("div", {
                        className:
                          "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
                        children: [
                          a.jsxs("div", {
                            className: "max-w-4xl",
                            children: [
                              a.jsxs("div", {
                                className:
                                  "mb-2 flex items-center gap-2 text-sm font-medium text-sky-700 dark:text-sky-200",
                                children: [
                                  a.jsx(Me, { className: "h-4 w-4" }),
                                  "Media & publishing help",
                                ],
                              }),
                              a.jsxs("p", {
                                className:
                                  "text-sm leading-6 text-slate-600 dark:text-slate-300",
                                children: [
                                  "Upload product images/videos inside GarTexHub. Only internal",
                                  " ",
                                  a.jsx("span", {
                                    className:
                                      "rounded-md bg-sky-100 px-1.5 py-0.5 font-mono text-sky-700 dark:bg-white/10 dark:text-sky-200",
                                    children: "/uploads/...",
                                  }),
                                  " ",
                                  "URLs are allowed. Pending or rejected media stays hidden from buyers.",
                                ],
                              }),
                              a.jsx("p", {
                                className:
                                  "mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300",
                                children:
                                  "Use Draft to keep items private while preparing your gallery; switch to Published when ready.",
                              }),
                            ],
                          }),
                          a.jsxs("div", {
                            className:
                              "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300",
                            children: [
                              a.jsx("div", {
                                className:
                                  "font-medium text-slate-900 dark:text-white",
                                children: "Status rules",
                              }),
                              a.jsxs("div", {
                                className: "mt-2 flex flex-wrap gap-2",
                                children: [
                                  a.jsx(v, {
                                    tone: "slate",
                                    children: "Draft private",
                                  }),
                                  a.jsx(v, {
                                    tone: "green",
                                    children: "Published live",
                                  }),
                                  a.jsx(v, {
                                    tone: "amber",
                                    children: "Media review required",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                    X
                      ? a.jsxs("div", {
                          className:
                            "mb-6 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800 dark:border-sky-400/15 dark:bg-sky-400/10 dark:text-sky-50",
                          children: [
                            a.jsx(Le, {
                              className:
                                "mt-0.5 h-4 w-4 shrink-0 text-sky-500 dark:text-sky-200",
                            }),
                            a.jsx("span", { children: X }),
                          ],
                        })
                      : null,
                    k.length === 0
                      ? a.jsx("div", {
                          className:
                            "rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-white/10 dark:bg-white/5",
                          children: a.jsx("p", {
                            className: "text-slate-400",
                            children:
                              "No products yet. Create your first product to get started.",
                          }),
                        })
                      : a.jsx(Ve, {
                          className: "grid gap-4",
                          children: k.map((e) =>
                            a.jsx(
                              ze,
                              {
                                children: a.jsx(De, {
                                  flipOn: "click",
                                  front: a.jsx("article", {
                                    className:
                                      "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-xl dark:shadow-slate-950/20 h-full",
                                    children: a.jsxs("div", {
                                      className: "flex flex-col gap-4 h-full",
                                      children: [
                                        a.jsxs("div", {
                                          className:
                                            "flex flex-wrap items-center gap-2",
                                          children: [
                                            a.jsxs(v, {
                                              tone:
                                                e.status === "published"
                                                  ? "green"
                                                  : "slate",
                                              children: ["Status: ", e.status],
                                            }),
                                            a.jsxs(v, {
                                              tone: "blue",
                                              children: [
                                                "Video: ",
                                                e.video_review_status ||
                                                  "approved",
                                              ],
                                            }),
                                            a.jsxs(v, {
                                              tone: "blue",
                                              children: [
                                                "Content:",
                                                " ",
                                                e.content_review_status ||
                                                  "approved",
                                              ],
                                            }),
                                          ],
                                        }),
                                        a.jsxs("div", {
                                          children: [
                                            a.jsx("h2", {
                                              className:
                                                "truncate text-2xl font-semibold text-slate-900 dark:text-white",
                                              children: e.title || e.name,
                                            }),
                                            a.jsxs("div", {
                                              className:
                                                "mt-2 inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
                                              children: [
                                                "MOQ ",
                                                e.moq || "--",
                                                " · Lead",
                                                " ",
                                                e.lead_time_days || "--",
                                              ],
                                            }),
                                          ],
                                        }),
                                        a.jsx("p", {
                                          className:
                                            "flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-4",
                                          children: e.description,
                                        }),
                                        a.jsx("div", {
                                          className:
                                            "text-xs text-slate-400 dark:text-slate-500",
                                          children: "Click to flip for details",
                                        }),
                                      ],
                                    }),
                                  }),
                                  back: a.jsx("article", {
                                    className:
                                      "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-xl dark:shadow-slate-950/20 h-full",
                                    children: a.jsxs("div", {
                                      className: "flex flex-col gap-4 h-full",
                                      children: [
                                        a.jsx("div", {
                                          className:
                                            "grid gap-3 sm:grid-cols-2",
                                          children: [
                                            {
                                              label: "Industry",
                                              value: e.industry || "—",
                                            },
                                            {
                                              label: "Category",
                                              value: e.category || "—",
                                            },
                                            {
                                              label: "Material",
                                              value: e.material || "—",
                                            },
                                            {
                                              label: "Media",
                                              value: `${Array.isArray(e.image_urls) ? e.image_urls.length : 0} files`,
                                            },
                                          ].map((t) =>
                                            a.jsxs(
                                              "div",
                                              {
                                                className:
                                                  "rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/50",
                                                children: [
                                                  a.jsx("div", {
                                                    className:
                                                      "text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-slate-400",
                                                    children: t.label,
                                                  }),
                                                  a.jsx("div", {
                                                    className:
                                                      "mt-1 text-sm font-medium text-slate-900 dark:text-white",
                                                    children: t.value,
                                                  }),
                                                ],
                                              },
                                              t.label,
                                            ),
                                          ),
                                        }),
                                        a.jsxs("div", {
                                          className:
                                            "mt-auto flex flex-wrap gap-3",
                                          children: [
                                            a.jsxs("button", {
                                              onClick: () => pe(e),
                                              className:
                                                "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
                                              children: [
                                                a.jsx(ea, {
                                                  className: "h-4 w-4",
                                                }),
                                                "Edit",
                                              ],
                                            }),
                                            a.jsxs("button", {
                                              onClick: () => be(e.id),
                                              className:
                                                "inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15",
                                              children: [
                                                a.jsx(Fe, {
                                                  className: "h-4 w-4",
                                                }),
                                                "Delete",
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  }),
                                }),
                              },
                              e.id,
                            ),
                          ),
                        }),
                  ],
                }),
              ],
            }),
            Y
              ? a.jsx("div", {
                  className:
                    "fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm dark:bg-slate-950/70",
                  children: a.jsxs("div", {
                    "data-lenis-prevent": !0,
                    className:
                      "max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white text-slate-900 shadow-2xl shadow-black/20 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:shadow-black/40",
                    children: [
                      a.jsxs("div", {
                        className:
                          "sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur dark:border-white/10 dark:bg-slate-950/95",
                        children: [
                          a.jsxs("div", {
                            children: [
                              a.jsx("h3", {
                                className:
                                  "text-2xl font-semibold text-slate-900 dark:text-white",
                                children: _e
                                  ? "Edit product"
                                  : "Create product",
                              }),
                              a.jsx("p", {
                                className:
                                  "mt-1 text-sm text-slate-500 dark:text-slate-400",
                                children:
                                  "No music uploads. Videos and images must be uploaded inside GarTexHub (internal /uploads/... only).",
                              }),
                            ],
                          }),
                          a.jsx("button", {
                            onClick: se,
                            className:
                              "rounded-2xl border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                            children: a.jsx(qe, { className: "h-5 w-5" }),
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        className:
                          "grid gap-6 px-6 py-6 lg:grid-cols-[1.3fr_0.9fr]",
                        children: [
                          a.jsxs("div", {
                            className: "space-y-5",
                            children: [
                              a.jsxs("div", {
                                className:
                                  "rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5",
                                children: [
                                  a.jsx(h, {
                                    label: "Product name",
                                    required: !0,
                                    children: a.jsx("input", {
                                      value: d.title,
                                      onChange: (e) =>
                                        c((t) => ({
                                          ...t,
                                          title: e.target.value,
                                        })),
                                      className: x,
                                      placeholder: "Untitled Draft",
                                      required: !0,
                                    }),
                                  }),
                                  a.jsxs("div", {
                                    className: "mt-4 grid gap-4 md:grid-cols-2",
                                    children: [
                                      a.jsx(h, {
                                        label: "Industry",
                                        required: !0,
                                        children: a.jsx("input", {
                                          value: d.industry,
                                          onChange: (e) =>
                                            c((t) => ({
                                              ...t,
                                              industry: e.target.value,
                                            })),
                                          className: x,
                                          placeholder:
                                            "Garments, Home Textiles...",
                                          required: !0,
                                        }),
                                      }),
                                      a.jsx(h, {
                                        label: "Category (e.g. Shirts)",
                                        required: !0,
                                        children: a.jsx("input", {
                                          value: d.category,
                                          onChange: (e) =>
                                            c((t) => ({
                                              ...t,
                                              category: e.target.value,
                                            })),
                                          className: x,
                                          placeholder: "Shirts",
                                          required: !0,
                                        }),
                                      }),
                                      a.jsx(h, {
                                        label: "Material (e.g. Cotton)",
                                        required: !0,
                                        children: a.jsx("input", {
                                          value: d.material,
                                          onChange: (e) =>
                                            c((t) => ({
                                              ...t,
                                              material: e.target.value,
                                            })),
                                          className: x,
                                          placeholder: "Cotton",
                                          required: !0,
                                        }),
                                      }),
                                      a.jsx(h, {
                                        label: "MOQ",
                                        children: a.jsx("input", {
                                          value: d.moq,
                                          onChange: (e) =>
                                            c((t) => ({
                                              ...t,
                                              moq: e.target.value,
                                            })),
                                          className: x,
                                          placeholder: "1000",
                                        }),
                                      }),
                                      a.jsx(h, {
                                        label: "Price range",
                                        required: !0,
                                        children: a.jsx("input", {
                                          value: d.price_range,
                                          onChange: (e) =>
                                            c((t) => ({
                                              ...t,
                                              price_range: e.target.value,
                                            })),
                                          className: x,
                                          placeholder: "$4.50 - $7.20",
                                          required: !0,
                                        }),
                                      }),
                                      a.jsx(h, {
                                        label: "Lead time (days)",
                                        required: !0,
                                        children: a.jsx("input", {
                                          value: d.lead_time_days,
                                          onChange: (e) =>
                                            c((t) => ({
                                              ...t,
                                              lead_time_days: e.target.value,
                                            })),
                                          className: x,
                                          placeholder: "45",
                                          required: !0,
                                        }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              a.jsxs("div", {
                                className:
                                  "rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5",
                                children: [
                                  a.jsxs("div", {
                                    className:
                                      "mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white",
                                    children: [
                                      a.jsx(Ae, {
                                        className:
                                          "h-4 w-4 text-sky-500 dark:text-sky-300",
                                      }),
                                      "Description ",
                                      a.jsx("span", {
                                        className: "text-sky-500",
                                        children: "*",
                                      }),
                                    ],
                                  }),
                                  a.jsx("textarea", {
                                    value: d.description,
                                    onChange: (e) =>
                                      c((t) => ({
                                        ...t,
                                        description: e.target.value,
                                      })),
                                    rows: 5,
                                    className: x,
                                    placeholder:
                                      "Add your product description here...",
                                    required: !0,
                                  }),
                                  a.jsx(Ie, {
                                    text: d.description,
                                    limit: (() => {
                                      const e = Ue();
                                      return String(
                                        (e == null
                                          ? void 0
                                          : e.subscription_status) || "",
                                      ).toLowerCase() === "premium"
                                        ? 1500
                                        : 600;
                                    })(),
                                  }),
                                  a.jsxs("button", {
                                    type: "button",
                                    onClick: () => q(!D),
                                    className:
                                      "mt-3 inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-100 dark:hover:bg-sky-400/15",
                                    children: [
                                      a.jsx(ne, { className: "h-4 w-4" }),
                                      D
                                        ? "Hide advanced details"
                                        : "Add advanced details",
                                    ],
                                  }),
                                  D &&
                                    a.jsxs("div", {
                                      className:
                                        "mt-4 grid gap-4 md:grid-cols-2",
                                      children: [
                                        a.jsx(h, {
                                          label: "Fabric GSM",
                                          children: a.jsx("input", {
                                            value: d.fabric_gsm,
                                            onChange: (e) =>
                                              c((t) => ({
                                                ...t,
                                                fabric_gsm: e.target.value,
                                              })),
                                            className: x,
                                            placeholder: "180",
                                          }),
                                        }),
                                        a.jsx(h, {
                                          label: "Size range",
                                          children: a.jsx("input", {
                                            value: d.size_range,
                                            onChange: (e) =>
                                              c((t) => ({
                                                ...t,
                                                size_range: e.target.value,
                                              })),
                                            className: x,
                                            placeholder: "S-XXL",
                                          }),
                                        }),
                                      ],
                                    }),
                                ],
                              }),
                              a.jsxs("div", {
                                className:
                                  "rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5",
                                children: [
                                  a.jsxs("div", {
                                    className:
                                      "mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white",
                                    children: [
                                      a.jsx(ta, {
                                        className:
                                          "h-4 w-4 text-sky-500 dark:text-sky-300",
                                      }),
                                      "Product media ",
                                      a.jsx("span", {
                                        className: "text-sky-500",
                                        children: "*",
                                      }),
                                    ],
                                  }),
                                  a.jsx("p", {
                                    className:
                                      "text-sm leading-6 text-slate-500 dark:text-slate-400",
                                    children:
                                      "Upload images or video files. Pending/rejected media stays hidden from buyers.",
                                  }),
                                  a.jsx("div", {
                                    className: "mt-4 grid gap-3 md:grid-cols-2",
                                    children:
                                      r != null && r.id
                                        ? a.jsxs(a.Fragment, {
                                            children: [
                                              a.jsxs("div", {
                                                className:
                                                  "rounded-2xl border border-dashed border-slate-300 bg-white p-4 cursor-pointer hover:border-sky-400 dark:border-white/15 dark:bg-slate-900/60 dark:hover:border-sky-400/40",
                                                onClick: () => {
                                                  var e;
                                                  return (e = te.current) ==
                                                    null
                                                    ? void 0
                                                    : e.click();
                                                },
                                                children: [
                                                  a.jsxs("div", {
                                                    className:
                                                      "flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white",
                                                    children: [
                                                      a.jsx(ce, {
                                                        className:
                                                          "h-4 w-4 text-sky-500 dark:text-sky-300",
                                                      }),
                                                      E
                                                        ? a.jsx(L, {
                                                            variant: "bounce",
                                                            color: "#6100ff",
                                                            size: "small",
                                                            text: "",
                                                            textColor: "",
                                                          })
                                                        : "Click to upload images",
                                                    ],
                                                  }),
                                                  a.jsx("div", {
                                                    className:
                                                      "mt-1 text-xs text-slate-400",
                                                    children:
                                                      "PNG, JPG up to 10MB each",
                                                  }),
                                                  a.jsx("input", {
                                                    ref: te,
                                                    type: "file",
                                                    multiple: !0,
                                                    accept:
                                                      ".jpg,.jpeg,.png,.webp,.avif,.gif,.apng,.bmp,.tiff,.tif,.heic,.heif,.dcm,.tga,.svg,.eps,.pdf,.dng,.cr2,.cr3,.nef,.arw,.sr2,.orf,.raf,.psd,.ai,.xcf,.cdr",
                                                    onChange: (e) =>
                                                      ke(e.target.files),
                                                    disabled: E,
                                                    className: "hidden",
                                                  }),
                                                  E &&
                                                    a.jsx("div", {
                                                      className: "mt-3",
                                                      children: a.jsx(ie, {
                                                        progress: xe,
                                                      }),
                                                    }),
                                                  I.length > 0 &&
                                                    a.jsx(Te, {
                                                      mode: "popLayout",
                                                      children: a.jsx(Xe, {
                                                        axis: "x",
                                                        values: I,
                                                        onReorder: we,
                                                        className:
                                                          "mt-3 flex flex-wrap gap-2",
                                                        children: I.map((e) =>
                                                          a.jsxs(
                                                            Ye,
                                                            {
                                                              value: e,
                                                              as: "div",
                                                              className:
                                                                "relative h-16 w-16 rounded-lg overflow-hidden border border-slate-200 cursor-grab active:cursor-grabbing dark:border-white/10",
                                                              children: [
                                                                a.jsx(Re.img, {
                                                                  src: e.url,
                                                                  alt: "",
                                                                  className:
                                                                    "h-full w-full object-cover pointer-events-none",
                                                                  layout: !0,
                                                                  initial: {
                                                                    opacity: 0,
                                                                    scale: 0.92,
                                                                  },
                                                                  animate: {
                                                                    opacity: 1,
                                                                    scale: 1,
                                                                  },
                                                                  exit: {
                                                                    opacity: 0,
                                                                    scale: 0.85,
                                                                  },
                                                                  transition: {
                                                                    duration: 0.35,
                                                                    ease: [
                                                                      0.16, 1,
                                                                      0.3, 1,
                                                                    ],
                                                                  },
                                                                }),
                                                                a.jsx("div", {
                                                                  className:
                                                                    "absolute bottom-0 left-0 right-0 bg-black/50",
                                                                  children: fe(
                                                                    e.status,
                                                                  ),
                                                                }),
                                                              ],
                                                            },
                                                            e.document_id ||
                                                              e.url,
                                                          ),
                                                        ),
                                                      }),
                                                    }),
                                                ],
                                              }),
                                              a.jsxs("div", {
                                                className:
                                                  "rounded-2xl border border-dashed border-slate-300 bg-white p-4 cursor-pointer hover:border-sky-400 dark:border-white/15 dark:bg-slate-900/60 dark:hover:border-sky-400/40",
                                                onClick: () => {
                                                  var e;
                                                  return (e = re.current) ==
                                                    null
                                                    ? void 0
                                                    : e.click();
                                                },
                                                children: [
                                                  a.jsxs("div", {
                                                    className:
                                                      "flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white",
                                                    children: [
                                                      a.jsx(He, {
                                                        className:
                                                          "h-4 w-4 text-sky-500 dark:text-sky-300",
                                                      }),
                                                      B
                                                        ? a.jsx(L, {
                                                            variant: "bounce",
                                                            color: "#6100ff",
                                                            size: "small",
                                                            text: "",
                                                            textColor: "",
                                                          })
                                                        : "Click to upload video",
                                                    ],
                                                  }),
                                                  a.jsx("div", {
                                                    className:
                                                      "mt-1 text-xs text-slate-400",
                                                    children:
                                                      "MP4, WEBM, MKV, AVI, MOV, FLV, MPEG, 3GP, WMV, OGV, M4V, AMV, ASF, VOB, OGG, MNG, 3G2, MXF, ROQ, RM, QT, SVI, NSV, YUV, F4V up to 50MB",
                                                  }),
                                                  a.jsx("input", {
                                                    ref: re,
                                                    type: "file",
                                                    accept: "video/*",
                                                    onChange: (e) => {
                                                      var t;
                                                      return ye(
                                                        (t = e.target.files) ==
                                                          null
                                                          ? void 0
                                                          : t[0],
                                                      );
                                                    },
                                                    disabled: B,
                                                    className: "hidden",
                                                  }),
                                                  B &&
                                                    a.jsx("div", {
                                                      className: "mt-3",
                                                      children: a.jsx(ie, {
                                                        progress: me,
                                                      }),
                                                    }),
                                                ],
                                              }),
                                            ],
                                          })
                                        : a.jsxs("div", {
                                            className:
                                              "rounded-2xl border border-dashed border-slate-300 bg-white p-4 dark:border-white/15 dark:bg-slate-900/60",
                                            children: [
                                              a.jsxs("div", {
                                                className:
                                                  "flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white",
                                                children: [
                                                  a.jsx(ce, {
                                                    className:
                                                      "h-4 w-4 text-sky-500 dark:text-sky-300",
                                                  }),
                                                  "Save product first",
                                                ],
                                              }),
                                              a.jsx("div", {
                                                className:
                                                  "mt-1 text-xs text-slate-400",
                                                children:
                                                  "Save the product first to upload images.",
                                              }),
                                            ],
                                          }),
                                  }),
                                  (K || ee) &&
                                    a.jsx("div", {
                                      className:
                                        "mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-50",
                                      children: K || ee,
                                    }),
                                ],
                              }),
                            ],
                          }),
                          a.jsxs("div", {
                            className: "space-y-5",
                            children: [
                              a.jsxs("div", {
                                className:
                                  "rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 p-5 dark:border-white/10 dark:bg-gradient-to-br dark:from-sky-500/15 dark:to-blue-500/5",
                                children: [
                                  a.jsxs("div", {
                                    className:
                                      "flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white",
                                    children: [
                                      a.jsx(We, {
                                        className:
                                          "h-4 w-4 text-sky-500 dark:text-sky-300",
                                      }),
                                      "Publishing checklist",
                                    ],
                                  }),
                                  a.jsx("div", {
                                    className:
                                      "mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300",
                                    children: [
                                      "Draft mode keeps this item private while you prepare the gallery.",
                                      "Published items go live after media review is approved.",
                                      "Buyers only see internal media that passed review.",
                                    ].map((e) =>
                                      a.jsxs(
                                        "div",
                                        {
                                          className:
                                            "flex items-start gap-3 rounded-2xl bg-white p-3 dark:bg-slate-900/50",
                                          children: [
                                            a.jsx(Qe, {
                                              className:
                                                "mt-0.5 h-4 w-4 text-emerald-500 dark:text-emerald-300",
                                            }),
                                            a.jsx("span", { children: e }),
                                          ],
                                        },
                                        e,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                              a.jsxs("div", {
                                className:
                                  "rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5",
                                children: [
                                  a.jsxs("label", {
                                    className:
                                      "flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200",
                                    children: [
                                      a.jsx("input", {
                                        type: "checkbox",
                                        checked: ae,
                                        onChange: (e) => A(e.target.checked),
                                        className:
                                          "mt-1 h-4 w-4 rounded border-slate-300 text-sky-500 dark:border-white/20",
                                      }),
                                      a.jsx("span", {
                                        children:
                                          "I confirm this product media contains no music or prohibited instruments.",
                                      }),
                                    ],
                                  }),
                                  a.jsxs("div", {
                                    className:
                                      "mt-5 flex flex-col gap-3 sm:flex-row",
                                    children: [
                                      a.jsx("button", {
                                        onClick: () => de("draft"),
                                        disabled: z,
                                        className:
                                          "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 disabled:opacity-60",
                                        children: "Save draft",
                                      }),
                                      a.jsx("button", {
                                        onClick: () => de("published"),
                                        disabled: z,
                                        className:
                                          "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:scale-[1.01] hover:shadow-sky-500/35 disabled:opacity-60",
                                        children: z
                                          ? a.jsx(L, {
                                              variant: "bounce",
                                              color: "#6100ff",
                                              size: "small",
                                              text: "",
                                              textColor: "",
                                            })
                                          : "Publish",
                                      }),
                                    ],
                                  }),
                                  a.jsx("div", {
                                    className:
                                      "mt-4 rounded-2xl border border-slate-100 bg-white p-4 text-xs leading-6 text-slate-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-400",
                                    children:
                                      "Tip: keep the item as Draft while your media is pending, then publish after everything is approved.",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                })
              : null,
          ],
        }),
      });
}
export { va as default };
