import {
  r as h,
  k as ce,
  a9 as Bt,
  o as Ot,
  g as Ut,
  d as P,
  j as e,
  N as zt,
  L as de,
  S as nt,
  X as Wt,
  a7 as Ne,
  a3 as Gt,
  q as ee,
  A as Qt,
  m as It,
} from "./index-CNnTWoea.js";
import { W as ke } from "./WordCount-CRyixXyU.js";
import { u as Kt, U as Ht } from "./UploadProgressBar-D72lm7cT.js";
import { u as Yt, b as Vt } from "./useSecureUser-DoQht3Qe.js";
import { C as lt } from "./clipboard-list-GYmViMIP.js";
import { S as Xt, M as Jt } from "./sun-medium-CARggVbV.js";
import { S as _e } from "./sparkles-DVBGTjg1.js";
import { C as qe } from "./circle-check-CcIEJQvk.js";
import { C as Ce } from "./cloud-upload-DNG9vfc8.js";
import { B as ot } from "./bot-D1MdrQ10.js";
import { F as Zt } from "./funnel-D_YkTlih.js";
import { L as es } from "./layers-DHzbiSyF.js";
import { P as ts } from "./plus-DAdOh4uA.js";
import { A as ss } from "./arrow-left-CJ4bAA4u.js";
import { A as is } from "./arrow-right-C0cRUQ52.js";
import { R as Se } from "./refresh-cw-CRn231Z_.js";
import { Z as rs } from "./zap-eQvd90E6.js";
import { P as as } from "./pen-line-BGjHakA5.js";
import { T as ns } from "./trash-2-JDuZV4rk.js";
function ls(t = {}) {
  var T, i, a, w, E, W, Q, u, G, I;
  if (!t || typeof t != "object") return {};
  const r = Number.isFinite(
      Number((T = t == null ? void 0 : t.price) == null ? void 0 : T.min),
    )
      ? Number(t.price.min)
      : null,
    x = Number.isFinite(
      Number((i = t == null ? void 0 : t.price) == null ? void 0 : i.max),
    )
      ? Number(t.price.max)
      : null,
    f =
      ((a = t == null ? void 0 : t.price) == null ? void 0 : a.currency) ||
      ((w = t == null ? void 0 : t.price) == null ? void 0 : w.currency_code) ||
      "USD",
    c = r !== null ? `${f} ${r}${x !== null && x !== r ? `-${x}` : ""}` : "",
    b =
      ((E = t == null ? void 0 : t.timeline) == null
        ? void 0
        : E.normalized_days) ??
      (Number.isFinite(Number(t == null ? void 0 : t.timeline))
        ? Number(t.timeline)
        : null),
    N = Number.isFinite(Number(b))
      ? `${b} days`
      : (t == null ? void 0 : t.timeline) || "",
    S = Number.isFinite(
      Number((W = t == null ? void 0 : t.fabric) == null ? void 0 : W.gsm),
    )
      ? String(t.fabric.gsm)
      : "",
    j =
      (t == null ? void 0 : t.moq) !== void 0 &&
      (t == null ? void 0 : t.moq) !== null
        ? String(t.moq)
        : "";
  return {
    product_type: t.product_type || "",
    category: t.category || t.sub_category || "",
    moq: j,
    target_price:
      (t == null ? void 0 : t.target_price) !== void 0 &&
      (t == null ? void 0 : t.target_price) !== null
        ? String(t.target_price)
        : r !== null
          ? String(r)
          : "",
    timeline: (t == null ? void 0 : t.timeline) || "",
    incoterm:
      (t == null ? void 0 : t.incoterm) ||
      (t == null ? void 0 : t.incoterms) ||
      "",
    certifications: Array.isArray(t.certifications) ? t.certifications : [],
    notes:
      (t == null ? void 0 : t.notes) ||
      (t == null ? void 0 : t.description) ||
      "",
    requestType:
      typeof t.product_type == "string" && /textile/i.test(t.product_type)
        ? "textile"
        : "",
    title: t.title || "",
    subCategory: t.sub_category || "",
    materialType: t.material_type || t.material || "",
    totalQuantity:
      t.quantity !== void 0 && t.quantity !== null ? String(t.quantity) : "",
    quantity:
      t.quantity !== void 0 && t.quantity !== null ? String(t.quantity) : j,
    unit: t.unit || "",
    targetFobPrice: c,
    targetPrice: c,
    fabricComposition:
      ((Q = t == null ? void 0 : t.fabric) == null ? void 0 : Q.composition) ||
      (t == null ? void 0 : t.material) ||
      "",
    fiberComposition:
      ((u = t == null ? void 0 : t.fabric) == null ? void 0 : u.composition) ||
      (t == null ? void 0 : t.material) ||
      "",
    fabricWeightGsm: S,
    leadTimeRequired: N,
    incoterms: t.incoterm || t.incoterms || "",
    complianceNotes:
      ((G = t == null ? void 0 : t.compliance) == null ? void 0 : G.notes) ||
      (t == null ? void 0 : t.notes) ||
      "",
    complianceCerts: Array.isArray(t.certifications)
      ? t.certifications
      : Array.isArray(
            (I = t == null ? void 0 : t.compliance) == null ? void 0 : I.certs,
          )
        ? t.compliance.certs
        : [],
    sustainabilityCerts: Array.isArray(t.sustainability)
      ? t.sustainability
      : [],
    customDescription:
      (t == null ? void 0 : t.notes) ||
      (t == null ? void 0 : t.description) ||
      "",
  };
}
const os = [
    /^abc$/i,
    /^abcd$/i,
    /^demo$/i,
    /^test$/i,
    /^sample$/i,
    /^title$/i,
    /^item$/i,
    /^placeholder$/i,
    /^lorem$/i,
    /^asdf+$/i,
    /^qwer+$/i,
    /^zxcv+$/i,
    /^dummy$/i,
  ],
  cs =
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|dozen|pair|pairs|piece|pieces|single|double)\b/i;
function J(t) {
  return String(t ?? "")
    .replace(/\s+/g, " ")
    .trim();
}
function ds(t) {
  return J(t)
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09ff]+/g, "");
}
function us(t = {}) {
  return J(t.requestType ?? t.request_type ?? "").toLowerCase() === "textile"
    ? "textile"
    : "garments";
}
function v(t = {}, r = []) {
  for (const x of r) {
    const f = J(t == null ? void 0 : t[x]);
    if (f) return { key: x, value: f };
  }
  return { key: r[0] || "", value: "" };
}
function ms(t) {
  const r = J(t);
  if (!r) return !1;
  const x = ds(r);
  return !(
    x.length < 3 ||
    !/[a-z\u0980-\u09ff]/i.test(r) ||
    os.some((f) => f.test(x)) ||
    /^(.)\1+$/.test(x)
  );
}
function ct(t) {
  const r = J(t);
  return r
    ? !!(
        /\d/.test(r) ||
        /[০-৯]/.test(r) ||
        cs.test(r) ||
        /[\u0980-\u09ff]/.test(r)
      )
    : !1;
}
function ue(t = {}, r = 0) {
  if (!J(t.requestType ?? t.request_type ?? ""))
    return { requestType: "Select a request type to continue." };
  const f = us(t),
    c = {};
  if (r === 0) return c;
  if (r === 1) {
    const b = v(t, ["title", "request_title"]);
    if (
      (b.value
        ? ms(b.value) ||
          (c[b.key] = 'Use a real product title, like "Denim jacket".')
        : (c[b.key] = "Title is required."),
      f === "textile")
    ) {
      const N = v(t, ["materialType", "material_type"]);
      N.value || (c[N.key] = "Material type is required.");
      const S = v(t, ["subCategory", "sub_category"]);
      S.value || (c[S.key] = "Sub-category is required.");
      const j = v(t, ["quantity", "totalQuantity", "total_quantity"]);
      j.value
        ? ct(j.value) ||
          (c[j.key] =
            "Enter a real quantity, such as 100, one hundred, or 100 pcs.")
        : (c[j.key] = "Quantity is required.");
      const T = v(t, ["unit"]);
      T.value || (c[T.key] = "Unit is required.");
    } else {
      const N = v(t, ["category"]);
      N.value || (c[N.key] = "Category is required.");
      const S = v(t, ["genderTarget", "gender_target"]);
      S.value || (c[S.key] = "Gender target is required.");
      const j = v(t, ["season"]);
      j.value || (c[j.key] = "Season is required.");
      const T = v(t, ["totalQuantity", "quantity", "total_quantity"]);
      T.value
        ? ct(T.value) ||
          (c[T.key] =
            "Enter a real quantity, such as 100, one hundred, or 100 pcs.")
        : (c[T.key] = "Total quantity is required.");
    }
    return c;
  }
  if (r === 2) {
    if (f === "textile") {
      const b = v(t, ["fiberComposition", "fiber_composition"]);
      b.value || (c[b.key] = "Fiber composition is required.");
      const N = v(t, ["fabricWeightGsm", "fabric_weight_gsm", "fabric_weight"]);
      N.value || (c[N.key] = "Fabric weight (GSM) is required.");
    }
    return c;
  }
  if (r === 3) {
    if (f === "textile") {
      const b = v(t, ["targetPrice", "price_range", "target_price"]);
      b.value || (c[b.key] = "Target price is required.");
      const N = v(t, ["priceUnit", "price_unit"]);
      N.value || (c[N.key] = "Price unit is required.");
      const S = v(t, ["incoterms", "incoterm"]);
      S.value || (c[S.key] = "Incoterm is required.");
      const j = v(t, ["deliveryPort", "delivery_port"]);
      j.value || (c[j.key] = "Delivery port is required.");
      const T = v(t, ["leadTimeRequired", "lead_time_required"]);
      T.value || (c[T.key] = "Lead time is required.");
    } else {
      const b = v(t, ["targetFobPrice", "price_range", "target_fob_price"]);
      b.value || (c[b.key] = "Target FOB price is required.");
      const N = v(t, ["incoterms", "incoterm"]);
      N.value || (c[N.key] = "Incoterm is required.");
      const S = v(t, ["exFactoryDate", "ex_factory_date"]);
      S.value || (c[S.key] = "Ex-factory date is required.");
      const j = v(t, ["paymentTerms", "payment_terms"]);
      j.value || (c[j.key] = "Payment terms are required.");
    }
    return c;
  }
  return c;
}
function dt(t = {}) {
  return { ...ue(t, 1), ...ue(t, 2), ...ue(t, 3) };
}
function hs(t = {}) {
  const r = new Set([
      "requestType",
      "title",
      "request_title",
      "category",
      "genderTarget",
      "gender_target",
      "season",
      "totalQuantity",
      "quantity",
      "total_quantity",
      "materialType",
      "material_type",
      "subCategory",
      "sub_category",
      "unit",
    ]),
    x = new Set([
      "fiberComposition",
      "fiber_composition",
      "fabricWeightGsm",
      "fabric_weight_gsm",
      "fabric_weight",
    ]),
    f = new Set([
      "targetFobPrice",
      "price_range",
      "target_price",
      "targetPrice",
      "priceUnit",
      "price_unit",
      "incoterms",
      "incoterm",
      "exFactoryDate",
      "ex_factory_date",
      "paymentTerms",
      "payment_terms",
      "deliveryPort",
      "delivery_port",
      "leadTimeRequired",
      "lead_time_required",
    ]);
  return Object.keys(t).some((c) => r.has(c))
    ? 1
    : Object.keys(t).some((c) => x.has(c))
      ? 2
      : Object.keys(t).some((c) => f.has(c))
        ? 3
        : 0;
}
const se = {
  requestType: "",
  title: "",
  industry: "",
  category: "",
  genderTarget: "",
  season: "",
  totalQuantity: "",
  numberOfStyles: "",
  fabricComposition: "",
  fabricWeightGsm: "",
  weaveOrKnit: "",
  sizeRange: "",
  colorRequirement: "",
  styleDescription: "",
  techPackRequired: "",
  targetFobPrice: "",
  incoterms: "",
  destinationPort: "",
  exFactoryDate: "",
  sampleRequired: "",
  sampleType: "",
  paymentTerms: "",
  complianceCerts: [],
  sustainabilityCerts: [],
  complianceNotes: "",
  materialType: "",
  subCategory: "",
  quantity: "",
  unit: "",
  fiberComposition: "",
  fabricWidth: "",
  yarnCount: "",
  threadCount: "",
  finishRequired: "",
  stretchRequired: "",
  color: "",
  pattern: "",
  targetPrice: "",
  priceUnit: "",
  deliveryPort: "",
  leadTimeRequired: "",
  labTestRequired: "",
  swatchFirst: "",
  labCertNotes: "",
  quoteDeadline: "",
  expiresAt: "",
  maxSuppliers: "",
  verifiedOnly: !1,
  preferredFactoryLocation: "",
  factorySizePreference: "",
  exportExperiencePreference: "",
  confidentialityToggle: !1,
  packagingRequirement: "",
  originLabelRequired: "",
  hangtagBarcode: "",
  partialShipmentAllowed: "",
  shipmentMode: "",
  customFields: [],
  customDescription: "",
};
function ut(t) {
  const r = t.requestType === "textile",
    x = r ? t.subCategory : t.category,
    f = r ? t.targetPrice : t.targetFobPrice,
    c = r ? t.quantity : t.totalQuantity;
  return {
    request_type: t.requestType || "garments",
    title: t.title,
    industry: t.industry,
    category: x,
    product: r ? t.materialType : t.category,
    quantity: c,
    price_range: f,
    incoterms: t.incoterms,
    payment_terms: t.paymentTerms,
    material: r ? t.fiberComposition : t.fabricComposition,
    fabric_gsm: t.fabricWeightGsm,
    size_range: t.sizeRange,
    color_pantone: t.colorRequirement,
    custom_description: t.customDescription,
    quote_deadline: t.quoteDeadline || null,
    expires_at: t.expiresAt || null,
    max_suppliers: t.maxSuppliers || null,
    verified_only: !!t.verifiedOnly,
    custom_fields: Array.isArray(t.customFields) ? t.customFields : [],
    gender_target: t.genderTarget,
    season: t.season,
    number_of_styles: t.numberOfStyles,
    fabric_composition: t.fabricComposition,
    weave_or_knit: t.weaveOrKnit,
    color_requirement: t.colorRequirement,
    style_description: t.styleDescription,
    tech_pack_required: t.techPackRequired,
    destination_port: t.destinationPort,
    ex_factory_date: t.exFactoryDate,
    sample_required: t.sampleRequired,
    sample_type: t.sampleType,
    compliance_certs: Array.isArray(t.complianceCerts) ? t.complianceCerts : [],
    sustainability_certs: Array.isArray(t.sustainabilityCerts)
      ? t.sustainabilityCerts
      : [],
    compliance_notes: t.complianceNotes,
    material_type: t.materialType,
    sub_category: t.subCategory,
    unit: t.unit,
    fiber_composition: t.fiberComposition,
    fabric_width: t.fabricWidth,
    yarn_count: t.yarnCount,
    thread_count: t.threadCount,
    finish_required: t.finishRequired,
    stretch_required: t.stretchRequired,
    color: t.color,
    pattern: t.pattern,
    target_price: t.targetPrice,
    price_unit: t.priceUnit,
    delivery_port: t.deliveryPort,
    lead_time_required: t.leadTimeRequired,
    lab_test_required: t.labTestRequired,
    swatch_first: t.swatchFirst,
    lab_cert_notes: t.labCertNotes,
    preferred_factory_location: t.preferredFactoryLocation,
    factory_size_preference: t.factorySizePreference,
    export_experience_preference: t.exportExperiencePreference,
    confidentiality_toggle: !!t.confidentialityToggle,
    packaging_requirement: t.packagingRequirement,
    origin_label_required: t.originLabelRequired,
    hangtag_barcode: t.hangtagBarcode,
    partial_shipment_allowed: t.partialShipmentAllowed,
    shipment_mode: t.shipmentMode,
  };
}
function mt(t) {
  const r = t != null && t.specs && typeof t.specs == "object" ? t.specs : {};
  return {
    ...se,
    requestType: t.request_type || "garments",
    title: t.title || "",
    industry: t.industry || "",
    category: t.category || "",
    genderTarget: r.gender_target || "",
    season: r.season || "",
    totalQuantity: t.quantity || "",
    numberOfStyles: r.number_of_styles || "",
    fabricComposition: r.fabric_composition || t.material || "",
    fabricWeightGsm: r.fabric_weight_gsm || t.fabric_gsm || "",
    weaveOrKnit: r.weave_or_knit || "",
    sizeRange: r.size_range || t.size_range || "",
    colorRequirement: r.color_requirement || t.color_pantone || "",
    styleDescription: r.style_description || "",
    techPackRequired: r.tech_pack_required || "",
    targetFobPrice: t.price_range || "",
    incoterms: t.incoterms || "",
    destinationPort: r.destination_port || "",
    exFactoryDate: r.ex_factory_date || "",
    sampleRequired: r.sample_required || "",
    sampleType: r.sample_type || "",
    paymentTerms: r.payment_terms || t.payment_terms || "",
    complianceCerts: Array.isArray(r.compliance_certs)
      ? r.compliance_certs
      : [],
    sustainabilityCerts: Array.isArray(r.sustainability_certs)
      ? r.sustainability_certs
      : [],
    complianceNotes: r.compliance_notes || t.compliance_notes || "",
    materialType: r.material_type || "",
    subCategory: r.sub_category || t.category || "",
    quantity: t.quantity || "",
    unit: r.unit || "",
    fiberComposition: r.fiber_composition || "",
    fabricWidth: r.fabric_width || "",
    yarnCount: r.yarn_count || "",
    threadCount: r.thread_count || "",
    finishRequired: r.finish_required || "",
    stretchRequired: r.stretch_required || "",
    color: r.color || "",
    pattern: r.pattern || "",
    targetPrice: t.price_range || "",
    priceUnit: r.price_unit || "",
    deliveryPort: r.delivery_port || "",
    leadTimeRequired: r.lead_time_required || "",
    labTestRequired: r.lab_test_required || "",
    swatchFirst: r.swatch_first || "",
    labCertNotes: r.lab_cert_notes || "",
    quoteDeadline: t.quote_deadline
      ? new Date(t.quote_deadline).toISOString().slice(0, 10)
      : "",
    expiresAt: t.expires_at
      ? new Date(t.expires_at).toISOString().slice(0, 10)
      : "",
    maxSuppliers: t.max_suppliers ?? "",
    verifiedOnly: !!t.verified_only,
    preferredFactoryLocation: r.preferred_factory_location || "",
    factorySizePreference: r.factory_size_preference || "",
    exportExperiencePreference: r.export_experience_preference || "",
    confidentialityToggle: !!r.confidentiality_toggle,
    packagingRequirement: r.packaging_requirement || "",
    originLabelRequired: r.origin_label_required || "",
    hangtagBarcode: r.hangtag_barcode || "",
    partialShipmentAllowed: r.partial_shipment_allowed || "",
    shipmentMode: r.shipment_mode || "",
    customFields: Array.isArray(t.custom_fields) ? t.custom_fields : [],
    customDescription: t.custom_description || "",
  };
}
function ps(t = "") {
  if (!t) return "";
  const r = String(t).replace(/\\/g, "/"),
    x = "server/uploads/";
  return r.includes(x)
    ? `/uploads/${r.split(x)[1]}`
    : r.startsWith("/uploads/")
      ? r
      : r.startsWith("uploads/")
        ? `/${r}`
        : r.startsWith("/")
          ? r
          : `/${r}`;
}
const gs = ["BSCI", "WRAP", "SA8000"],
  xs = ["GOTS", "OEKO-TEX", "GRS"],
  bs = ["buyer", "buying_house", "admin"],
  Te =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide";
function L({ children: t, className: r = "" }) {
  return e.jsx("span", { className: `${Te} ${r}`, children: t });
}
function o({ label: t, children: r, hint: x, error: f, required: c }) {
  return e.jsxs("label", {
    className: "block space-y-1.5",
    children: [
      e.jsxs("div", {
        className: "flex items-center justify-between gap-3",
        children: [
          e.jsxs("span", {
            className: "text-sm font-medium text-slate-700 dark:text-slate-200",
            children: [
              t,
              " ",
              c
                ? e.jsx("span", { className: "text-sky-500", children: "*" })
                : null,
            ],
          }),
          x
            ? e.jsx("span", {
                className: "text-xs text-slate-400 dark:text-slate-500",
                children: x,
              })
            : null,
        ],
      }),
      r,
      f
        ? e.jsx("p", {
            className: "text-xs font-semibold text-rose-500",
            children: f,
          })
        : null,
    ],
  });
}
function d(t) {
  return e.jsx("input", {
    ...t,
    className: `w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 ${t.className || ""}`,
  });
}
function te(t) {
  return e.jsx("textarea", {
    ...t,
    className: `w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 ${t.className || ""}`,
  });
}
function X(t) {
  return e.jsx("select", {
    ...t,
    className: `w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 ${t.className || ""}`,
  });
}
function ht(t = "") {
  const r = String(t || "open").toLowerCase();
  return r === "open" || r === "active"
    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 border-emerald-500/20"
    : r === "reviewing" || r === "reviewing_quotes"
      ? "bg-amber-500/15 text-amber-700 dark:text-amber-200 border-amber-500/20"
      : "bg-zinc-500/15 text-zinc-700 dark:text-zinc-200 border-zinc-500/20";
}
function pt(t = "") {
  const r = String(t || "open").toLowerCase();
  return r === "open" || r === "active"
    ? "Active"
    : r === "reviewing" || r === "reviewing_quotes"
      ? "Reviewing Quotes"
      : r === "closed" || r === "completed"
        ? "Closed"
        : String(t || "open").replaceAll("_", " ");
}
function Ls() {
  const t = h.useMemo(() => ce(), []),
    { user: r, loading: x } = Yt(),
    { hasEntitlement: f } = Vt(),
    c =
      (r == null ? void 0 : r.role) ||
      String((t == null ? void 0 : t.role) || "").toLowerCase(),
    b = f("smart_supplier_matching") || Bt(t, "smart_supplier_matching"),
    { theme: N, toggleTheme: S } = Ot(),
    [j, T] = h.useState(!1),
    [i, a] = h.useState(se),
    [w, E] = h.useState(0),
    [W, Q] = h.useState([]),
    [u, G] = h.useState({}),
    [I, Re] = h.useState([]),
    [Fe, Pe] = h.useState([]),
    [gt, Ae] = h.useState([]),
    [xt, $e] = h.useState({}),
    [Ee, De] = h.useState(""),
    [bt, me] = h.useState(0),
    [he, K] = h.useState(""),
    [yt, ft] = h.useState({}),
    [Le, Me] = h.useState(!0),
    [pe, Be] = h.useState(!1),
    [ge, jt] = h.useState(!0),
    [H, Y] = h.useState(!1),
    [xe, q] = h.useState(""),
    [be, A] = h.useState(""),
    [ye, Oe] = h.useState({}),
    [fe, Ue] = h.useState(""),
    [ze, We] = h.useState({}),
    [Ge, Qe] = h.useState(!1),
    [Ie, Ke] = h.useState([]),
    [je, ie] = h.useState(""),
    [re, ve] = h.useState(""),
    [R, M] = h.useState(se),
    g = h.useMemo(() => Ut(), []),
    $ = i.requestType === "textile",
    B = h.useMemo(
      () =>
        $
          ? [
              "Type",
              "Basics",
              "Technical",
              "Commercial",
              "Compliance",
              "Preview",
            ]
          : [
              "Type",
              "Basics",
              "Product",
              "Commercial",
              "Compliance",
              "Preview",
            ],
      [$],
    ),
    He = w === 0,
    vt = w === B.length - 1;
  h.useEffect(() => {
    w > B.length - 1 && E(B.length - 1);
  }, [w, B.length]);
  function Ye() {
    (G({}), q(""));
  }
  function wt(s = w) {
    const n = ue(i, s);
    return (
      G(n),
      Object.keys(n).length
        ? (q("Please fix the highlighted fields before continuing."), !1)
        : !0
    );
  }
  function Nt() {
    wt(w) && (Ye(), E((s) => Math.min(B.length - 1, s + 1)));
  }
  function kt() {
    (Ye(), E((s) => Math.max(0, s - 1)));
  }
  function Ve(s, n, m) {
    a((y) => {
      const _ = Array.isArray(y.customFields) ? [...y.customFields] : [],
        l = _[s] || { label: "", value: "" };
      return ((_[s] = { ...l, [n]: m }), { ...y, customFields: _ });
    });
  }
  function _t() {
    a((s) => ({
      ...s,
      customFields: [
        ...(Array.isArray(s.customFields) ? s.customFields : []),
        { label: "", value: "" },
      ],
    }));
  }
  function qt(s) {
    a((n) => ({
      ...n,
      customFields: (Array.isArray(n.customFields)
        ? n.customFields
        : []
      ).filter((m, y) => y !== s),
    }));
  }
  const O = h.useCallback(async () => {
      if (g) {
        (Me(!0), q(""));
        try {
          const s = await P("/requirements", { token: g });
          Re(Array.isArray(s) ? s : []);
        } catch (s) {
          (q(s.message || "Failed to load buyer requests."), Re([]));
        } finally {
          Me(!1);
        }
      }
    }, [g]),
    V = h.useCallback(async () => {
      if (!(!g || c !== "buyer")) {
        Be(!0);
        try {
          const s = await P("/requirements/browse", { token: g });
          Pe(Array.isArray(s) ? s : []);
        } catch {
          Pe([]);
        } finally {
          Be(!1);
        }
      }
    }, [c, g]),
    Xe = h.useCallback(async () => {
      if (g && (c === "buying_house" || c === "admin"))
        try {
          const s = await P("/org/members", { token: g });
          Ae(Array.isArray(s == null ? void 0 : s.members) ? s.members : []);
        } catch {
          Ae([]);
        }
    }, [c, g]),
    Z = h.useCallback(
      async (s) => {
        if (!(!g || !s))
          try {
            const n = await P(
              `/documents?entity_type=buyer_request&entity_id=${encodeURIComponent(s)}`,
              { token: g },
            );
            $e((m) => ({ ...m, [s]: Array.isArray(n) ? n : [] }));
          } catch {
            $e((n) => ({ ...n, [s]: [] }));
          }
      },
      [g],
    ),
    Je = h.useCallback(
      async (s, n, m = "reference") => {
        if (!(!g || !s || !n)) {
          (K(""), De(s), me(0));
          try {
            (await Kt("/documents", {
              file: n,
              token: g,
              fields: {
                entity_type: "buyer_request",
                entity_id: s,
                type: m || "reference",
              },
              onProgress: me,
            }),
              K("Attachment uploaded."),
              await Z(s));
          } catch (y) {
            K(y.message || "Attachment upload failed");
          } finally {
            (De(""), me(0));
          }
        }
      },
      [Z, g],
    ),
    Ct = h.useCallback(
      async (s, n) => {
        if (!(!g || !s)) {
          K("");
          try {
            (await P(`/documents/${encodeURIComponent(s)}`, {
              method: "DELETE",
              token: g,
            }),
              n && (await Z(n)),
              K("Attachment removed."));
          } catch (m) {
            K(m.message || "Failed to remove attachment.");
          }
        }
      },
      [Z, g],
    );
  (h.useEffect(() => {
    (O(), V(), Xe());
  }, [Xe, V, O]),
    h.useEffect(() => {
      ge && !Le && !x && !pe && jt(!1);
    }, [ge, Le, x, pe]));
  async function Ze(s = "open") {
    if (g) {
      (Y(!0), q(""), A(""));
      try {
        if (s !== "draft") {
          const m = dt(i);
          if (Object.keys(m).length) {
            (G(m),
              q("Please fix the highlighted fields before posting."),
              E(hs(m)));
            return;
          }
        }
        const n = await P("/requirements", {
          method: "POST",
          token: g,
          body: { ...ut(i), status: s },
        });
        if (n != null && n.id && W.length)
          for (const m of W)
            m != null &&
              m.file &&
              (await Je(n.id, m.file, m.type || "tech_pack"));
        (A(s === "draft" ? "Draft saved." : "Buyer request posted."),
          a(se),
          Q([]),
          G({}),
          E(0),
          await O(),
          await V());
      } catch (n) {
        q(n.message || "Failed to post buyer request.");
      } finally {
        Y(!1);
      }
    }
  }
  async function St() {
    await Ze("draft");
  }
  async function Tt() {
    var s, n, m, y;
    if (g) {
      if (!i.customDescription.trim()) {
        ie("Please enter request text in Custom description first.");
        return;
      }
      (Qe(!0), Ke([]), ie(""));
      try {
        const _ = await P("/ai/requirements/extract", {
            method: "POST",
            token: g,
            body: { text: i.customDescription },
          }),
          l = (_ == null ? void 0 : _.requirements) || {},
          U = Array.isArray(l.missing_fields) ? l.missing_fields : [];
        Ke(U);
        try {
          const le = ls(l),
            z = Object.entries(le).reduce(
              (F, [oe, C]) => (
                C == null ||
                  (typeof C == "string" && C.trim() === "") ||
                  (Array.isArray(C) && C.length === 0) ||
                  (F[oe] = C),
                F
              ),
              {},
            );
          a((F) => ({ ...F, ...z }));
        } catch {
          const le =
              (s = l == null ? void 0 : l.timeline) == null
                ? void 0
                : s.normalized_days,
            z = (n = l == null ? void 0 : l.price) == null ? void 0 : n.min,
            F = (m = l == null ? void 0 : l.price) == null ? void 0 : m.max,
            oe =
              ((y = l == null ? void 0 : l.price) == null
                ? void 0
                : y.currency) || "USD";
          a((C) => {
            var et, tt, st, it, rt, at;
            return {
              ...C,
              targetFobPrice: Number.isFinite(z)
                ? `${oe} ${z}${Number.isFinite(F) && F !== z ? `-${F}` : ""}`
                : C.targetFobPrice,
              targetPrice: Number.isFinite(z)
                ? `${oe} ${z}${Number.isFinite(F) && F !== z ? `-${F}` : ""}`
                : C.targetPrice,
              fabricComposition:
                ((et = l == null ? void 0 : l.fabric) == null
                  ? void 0
                  : et.composition) ||
                ((tt = l == null ? void 0 : l.fabric) == null
                  ? void 0
                  : tt.material) ||
                C.fabricComposition,
              fiberComposition:
                ((st = l == null ? void 0 : l.fabric) == null
                  ? void 0
                  : st.composition) ||
                ((it = l == null ? void 0 : l.fabric) == null
                  ? void 0
                  : it.material) ||
                C.fiberComposition,
              fabricWeightGsm: Number.isFinite(
                (rt = l == null ? void 0 : l.fabric) == null ? void 0 : rt.gsm,
              )
                ? String(l.fabric.gsm)
                : C.fabricWeightGsm,
              complianceNotes:
                ((at = l == null ? void 0 : l.compliance) == null
                  ? void 0
                  : at.notes) || C.complianceNotes,
              leadTimeRequired: Number.isFinite(le)
                ? `${le} days`
                : C.leadTimeRequired,
            };
          });
        }
        const ne = Number((_ == null ? void 0 : _.confidence) || 0);
        ie(`AI parsed your text (confidence ${Math.round(ne * 100)}%).`);
      } catch (_) {
        ie(_.message || "AI parsing failed.");
      } finally {
        Qe(!1);
      }
    }
  }
  function Rt(s) {
    (ve(s.id), M(mt(s)), A(""), q(""));
  }
  function Ft(s) {
    (a(mt(s)),
      E(1),
      A(
        "Loaded the request into the form. Update details and post when ready.",
      ),
      q(""),
      typeof window < "u" && window.scrollTo({ top: 0, behavior: "smooth" }));
  }
  async function Pt() {
    if (!(!g || !re)) {
      (Y(!0), q(""), A(""));
      try {
        const s = dt(R);
        if (Object.keys(s).length) {
          q("Please fix the highlighted fields before saving.");
          return;
        }
        (await P(`/requirements/${encodeURIComponent(re)}`, {
          method: "PATCH",
          token: g,
          body: ut(R),
        }),
          A("Request updated."),
          ve(""),
          M(se),
          await O(),
          await V());
      } catch (s) {
        q(s.message || "Failed to update request.");
      } finally {
        Y(!1);
      }
    }
  }
  async function At(s) {
    if (!(!g || !s)) {
      (Y(!0), q(""), A(""));
      try {
        (await P(`/requirements/${encodeURIComponent(s)}`, {
          method: "DELETE",
          token: g,
        }),
          A("Request deleted."),
          await O(),
          await V());
      } catch (n) {
        q(n.message || "Failed to delete request.");
      } finally {
        Y(!1);
      }
    }
  }
  async function $t(s) {
    if (!(!g || !s) && b) {
      (Ue(s), We((n) => ({ ...n, [s]: "" })));
      try {
        const n = await P(`/requirements/${encodeURIComponent(s)}/matches`, {
          token: g,
        });
        Oe((m) => ({
          ...m,
          [s]: Array.isArray(n == null ? void 0 : n.matches) ? n.matches : [],
        }));
      } catch (n) {
        (We((m) => ({
          ...m,
          [s]: n.message || "Unable to load smart matches",
        })),
          Oe((m) => ({ ...m, [s]: [] })));
      } finally {
        Ue("");
      }
    }
  }
  async function Et(s, n) {
    if (!(!g || !s)) {
      (q(""), A(""));
      try {
        (await P(`/requirements/${encodeURIComponent(s)}`, {
          method: "PATCH",
          token: g,
          body: { assigned_agent_id: n || "" },
        }),
          A("Assignment updated."),
          await O());
      } catch (m) {
        q(m.message || "Failed to assign request.");
      }
    }
  }
  const ae = h.useMemo(
      () =>
        c === "buyer"
          ? I
          : I.filter(
              (s) => String(s.status || "open").toLowerCase() === "open",
            ),
      [I, c],
    ),
    we = h.useMemo(
      () =>
        [
          { label: "Request type", value: i.requestType || "garments" },
          { label: "Title", value: i.title },
          { label: "Category", value: $ ? i.subCategory : i.category },
          { label: "Industry", value: i.industry },
          { label: "Gender target", value: i.genderTarget },
          { label: "Season", value: i.season },
          { label: "Total quantity", value: i.totalQuantity },
          { label: "Number of styles", value: i.numberOfStyles },
          { label: "Material type", value: i.materialType },
          { label: "Quantity", value: i.quantity },
          { label: "Unit", value: i.unit },
          {
            label: "Fabric composition",
            value: i.fabricComposition || i.fiberComposition,
          },
          { label: "Fabric weight (GSM)", value: i.fabricWeightGsm },
          { label: "Weave/Knit", value: i.weaveOrKnit },
          { label: "Size range", value: i.sizeRange },
          { label: "Color requirement", value: i.colorRequirement || i.color },
          { label: "Style description", value: i.styleDescription },
          { label: "Tech pack required", value: i.techPackRequired },
          { label: "Target FOB price", value: i.targetFobPrice },
          { label: "Target price", value: i.targetPrice },
          { label: "Price unit", value: i.priceUnit },
          { label: "Incoterm", value: i.incoterms },
          {
            label: "Destination port",
            value: i.destinationPort || i.deliveryPort,
          },
          { label: "Ex-factory date", value: i.exFactoryDate },
          { label: "Lead time required", value: i.leadTimeRequired },
          { label: "Sample required", value: i.sampleRequired },
          { label: "Sample type", value: i.sampleType },
          { label: "Payment terms", value: i.paymentTerms },
          {
            label: "Compliance certs",
            value: Array.isArray(i.complianceCerts)
              ? i.complianceCerts.join(", ")
              : "",
          },
          {
            label: "Sustainability certs",
            value: Array.isArray(i.sustainabilityCerts)
              ? i.sustainabilityCerts.join(", ")
              : "",
          },
          { label: "Lab test required", value: i.labTestRequired },
          { label: "Swatch first", value: i.swatchFirst },
          {
            label: "Compliance notes",
            value: i.complianceNotes || i.labCertNotes,
          },
          { label: "Quote deadline", value: i.quoteDeadline },
          { label: "Request expiry", value: i.expiresAt },
          { label: "Max suppliers", value: i.maxSuppliers },
          { label: "Preferred location", value: i.preferredFactoryLocation },
          { label: "Factory size", value: i.factorySizePreference },
          { label: "Export experience", value: i.exportExperiencePreference },
          {
            label: "Confidentiality",
            value: i.confidentialityToggle ? "Hide brand name" : "",
          },
          { label: "Packaging", value: i.packagingRequirement },
          { label: "Origin label", value: i.originLabelRequired },
          { label: "Hang tag / barcode", value: i.hangtagBarcode },
          { label: "Partial shipment", value: i.partialShipmentAllowed },
          { label: "Shipment mode", value: i.shipmentMode },
          {
            label: "Messaging access",
            value: i.verifiedOnly ? "Verified request only" : "Normal",
          },
        ].filter((n) => n.value),
      [i, $],
    ),
    p = N === "dark",
    Dt = p
      ? "bg-[#07111f] text-slate-100"
      : "bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-slate-900",
    D = p
      ? "border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
      : "border-slate-200 bg-white/80 shadow-[0_20px_80px_rgba(14,116,144,0.08)] backdrop-blur",
    k = p ? "text-slate-300" : "text-slate-600",
    Lt = c === "buyer" ? "Post Buyer Request" : "Buyer Request Management",
    Mt =
      c === "buyer"
        ? "Create structured requests so factories and buying houses can compare requirements quickly."
        : "Lead queue for buyer requests. Use Assign to route a request to a specific agent.";
  return ge
    ? e.jsx(zt, { fill: !0 })
    : e.jsx("div", {
        className: `min-h-screen ${Dt}`,
        children: e.jsx("div", {
          className: "mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8",
          children: e.jsxs("div", {
            className: `overflow-hidden rounded-[32px] border ${D}`,
            children: [
              e.jsx("div", {
                className:
                  "border-b border-white/10 bg-gradient-to-r from-sky-500/15 via-cyan-500/10 to-blue-500/10 px-4 py-4 sm:px-6",
                children: e.jsxs("div", {
                  className:
                    "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-start gap-4",
                      children: [
                        e.jsx("div", {
                          className:
                            "rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 p-4 text-white shadow-lg shadow-sky-500/20",
                          children: e.jsx(lt, { className: "h-7 w-7" }),
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsxs("div", {
                              className:
                                "mb-2 flex flex-wrap items-center gap-2",
                              children: [
                                e.jsx(L, {
                                  className:
                                    "border-sky-400/30 bg-sky-500/15 text-sky-300",
                                  children: "/buyer-requests",
                                }),
                                e.jsxs(L, {
                                  className: `border-white/10 bg-white/5 ${p ? "text-slate-300" : "text-slate-600"}`,
                                  children: ["Role: ", c],
                                }),
                              ],
                            }),
                            e.jsx("h1", {
                              className:
                                "text-2xl font-bold tracking-tight sm:text-3xl",
                              children: Lt,
                            }),
                            e.jsx("p", {
                              className: `mt-1 max-w-3xl text-sm sm:text-base ${k}`,
                              children: Mt,
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "flex flex-wrap items-center gap-2",
                      children: [
                        e.jsx("div", {
                          className: `flex items-center gap-2 rounded-2xl border px-2 py-2 ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                          children: bs.map((s) =>
                            e.jsx(
                              "span",
                              {
                                className: `rounded-xl px-3 py-2 text-sm font-medium ${c === s ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : p ? "text-slate-500" : "text-slate-400"}`,
                                children:
                                  s === "buying_house"
                                    ? "Buying House"
                                    : s.charAt(0).toUpperCase() + s.slice(1),
                              },
                              s,
                            ),
                          ),
                        }),
                        c !== "buyer"
                          ? e.jsx(de, {
                              to: "/owner",
                              className: `inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${p ? "border-white/10 bg-white/5 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`,
                              children: "Back to Dashboard",
                            })
                          : null,
                        e.jsxs("button", {
                          onClick: S,
                          className: `inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${p ? "border-white/10 bg-white/5 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`,
                          children: [
                            p
                              ? e.jsx(Xt, { className: "h-4 w-4" })
                              : e.jsx(Jt, { className: "h-4 w-4" }),
                            p ? "Light" : "Dark",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              e.jsxs("div", {
                className: "grid gap-4 p-4 lg:grid-cols-12 lg:p-6",
                children: [
                  e.jsx("div", {
                    className:
                      c === "buyer"
                        ? "lg:col-span-8 xl:col-span-8"
                        : "lg:col-span-12",
                    children: e.jsx(nt, {
                      as: "section",
                      children: e.jsxs("div", {
                        className: `rounded-[28px] border p-5 ${D}`,
                        children: [
                          e.jsx("div", {
                            className:
                              "mb-5 flex items-center justify-between gap-3",
                            children: e.jsxs("div", {
                              className: "flex items-center gap-3",
                              children: [
                                e.jsx("div", {
                                  className: `rounded-2xl p-3 ${p ? "bg-sky-500/15 text-sky-300" : "bg-sky-100 text-sky-700"}`,
                                  children: e.jsx(_e, { className: "h-5 w-5" }),
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("h2", {
                                      className:
                                        "text-lg font-semibold tracking-tight",
                                      children:
                                        c === "buyer"
                                          ? "Request Builder"
                                          : "Request Management Hub",
                                    }),
                                    e.jsx("p", {
                                      className: `text-sm ${k}`,
                                      children:
                                        c === "buyer"
                                          ? "Premium workflow UI with dense controls and polished spacing."
                                          : "Lead queue with agent assignment and tracking.",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                          (xe || be || he || je) &&
                            e.jsxs("div", {
                              className: "mb-5 space-y-2",
                              children: [
                                be
                                  ? e.jsxs("div", {
                                      className:
                                        "rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200",
                                      children: [
                                        e.jsx(qe, {
                                          className:
                                            "mr-2 inline-block h-4 w-4",
                                        }),
                                        " ",
                                        be,
                                      ],
                                    })
                                  : null,
                                xe
                                  ? e.jsxs("div", {
                                      className:
                                        "rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200",
                                      children: [
                                        e.jsx(Wt, {
                                          className:
                                            "mr-2 inline-block h-4 w-4",
                                        }),
                                        " ",
                                        xe,
                                      ],
                                    })
                                  : null,
                                he
                                  ? e.jsxs("div", {
                                      className:
                                        "rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-700 dark:text-sky-200",
                                      children: [
                                        e.jsx(Ce, {
                                          className:
                                            "mr-2 inline-block h-4 w-4",
                                        }),
                                        " ",
                                        he,
                                      ],
                                    })
                                  : null,
                                je
                                  ? e.jsxs("div", {
                                      className:
                                        "rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-700 dark:text-cyan-200",
                                      children: [
                                        e.jsx(ot, {
                                          className:
                                            "mr-2 inline-block h-4 w-4",
                                        }),
                                        " ",
                                        je,
                                      ],
                                    })
                                  : null,
                              ],
                            }),
                          c === "buyer"
                            ? e.jsxs(e.Fragment, {
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "mb-5 flex flex-wrap items-center justify-between gap-3",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsxs("div", {
                                            className:
                                              "text-sm text-slate-500 dark:text-slate-400",
                                            children: [
                                              "Step ",
                                              w + 1,
                                              " of ",
                                              B.length,
                                              " — ",
                                              e.jsx("span", {
                                                className:
                                                  "font-medium text-slate-700 dark:text-slate-200",
                                                children: B[w],
                                              }),
                                            ],
                                          }),
                                          e.jsx("div", {
                                            className: `mt-1 text-sm ${k}`,
                                            children:
                                              "Complete each step so verified suppliers can quote faster.",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                          e.jsxs("button", {
                                            onClick: () => T((s) => !s),
                                            className: `inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${p ? "border-white/10 bg-white/5 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`,
                                            children: [
                                              e.jsx(Zt, {
                                                className: "h-4 w-4",
                                              }),
                                              j
                                                ? "Hide more fields"
                                                : "More fields",
                                            ],
                                          }),
                                          e.jsxs("button", {
                                            onClick: Tt,
                                            disabled:
                                              Ge || !i.customDescription.trim(),
                                            className:
                                              "inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 disabled:opacity-50",
                                            children: [
                                              e.jsx(ot, {
                                                className: "h-4 w-4",
                                              }),
                                              " ",
                                              Ge
                                                ? "Parsing..."
                                                : "AI parse my text",
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsx("div", {
                                    className: "mb-5 grid gap-2 sm:grid-cols-6",
                                    children: B.map((s, n) =>
                                      e.jsxs(
                                        "div",
                                        {
                                          className: `rounded-2xl border px-3 py-3 text-center text-xs font-semibold ${n === w ? "border-sky-400 bg-sky-500/15 text-sky-300" : p ? "border-white/10 bg-white/5 text-slate-300" : "border-slate-200 bg-white text-slate-500"}`,
                                          children: [n + 1, ". ", s],
                                        },
                                        s,
                                      ),
                                    ),
                                  }),
                                  Ie.length
                                    ? e.jsxs("div", {
                                        className:
                                          "mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-200",
                                        children: [
                                          "Missing data confidence warning: ",
                                          Ie.join(", "),
                                        ],
                                      })
                                    : null,
                                  e.jsxs("div", {
                                    className: "space-y-5",
                                    children: [
                                      w === 0
                                        ? e.jsxs("div", {
                                            className:
                                              "grid gap-4 md:grid-cols-2",
                                            children: [
                                              e.jsxs("button", {
                                                type: "button",
                                                className: `group rounded-[26px] border p-5 text-left transition hover:-translate-y-1 ${i.requestType === "garments" ? "border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/10" : p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}${u.requestType ? " ring-2 ring-rose-400" : ""}`,
                                                onClick: () =>
                                                  a({
                                                    ...i,
                                                    requestType: "garments",
                                                  }),
                                                children: [
                                                  e.jsxs("div", {
                                                    className:
                                                      "mb-3 flex items-center justify-between",
                                                    children: [
                                                      e.jsx("div", {
                                                        className:
                                                          "rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-3 text-white shadow-lg shadow-sky-500/20",
                                                        children: e.jsx(es, {
                                                          className: "h-5 w-5",
                                                        }),
                                                      }),
                                                      i.requestType ===
                                                      "garments"
                                                        ? e.jsx(qe, {
                                                            className:
                                                              "h-5 w-5 text-sky-400",
                                                          })
                                                        : e.jsx(Ne, {
                                                            className:
                                                              "h-5 w-5 text-slate-400 group-hover:text-sky-400",
                                                          }),
                                                    ],
                                                  }),
                                                  e.jsx("div", {
                                                    className:
                                                      "text-lg font-semibold",
                                                    children: "Garments Buyer",
                                                  }),
                                                  e.jsx("div", {
                                                    className: `mt-1 text-sm ${k}`,
                                                    children:
                                                      "Finished garments with design + construction focus.",
                                                  }),
                                                ],
                                              }),
                                              e.jsxs("button", {
                                                type: "button",
                                                className: `group rounded-[26px] border p-5 text-left transition hover:-translate-y-1 ${i.requestType === "textile" ? "border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/10" : p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}${u.requestType ? " ring-2 ring-rose-400" : ""}`,
                                                onClick: () =>
                                                  a({
                                                    ...i,
                                                    requestType: "textile",
                                                  }),
                                                children: [
                                                  e.jsxs("div", {
                                                    className:
                                                      "mb-3 flex items-center justify-between",
                                                    children: [
                                                      e.jsx("div", {
                                                        className:
                                                          "rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-3 text-white shadow-lg shadow-sky-500/20",
                                                        children: e.jsx(Gt, {
                                                          className: "h-5 w-5",
                                                        }),
                                                      }),
                                                      i.requestType ===
                                                      "textile"
                                                        ? e.jsx(qe, {
                                                            className:
                                                              "h-5 w-5 text-sky-400",
                                                          })
                                                        : e.jsx(Ne, {
                                                            className:
                                                              "h-5 w-5 text-slate-400 group-hover:text-sky-400",
                                                          }),
                                                    ],
                                                  }),
                                                  e.jsx("div", {
                                                    className:
                                                      "text-lg font-semibold",
                                                    children: "Textile Buyer",
                                                  }),
                                                  e.jsx("div", {
                                                    className: `mt-1 text-sm ${k}`,
                                                    children:
                                                      "Fabric/yarn/trim requests with technical specs.",
                                                  }),
                                                ],
                                              }),
                                            ],
                                          })
                                        : null,
                                      w === 1
                                        ? e.jsxs("div", {
                                            className:
                                              "grid gap-4 md:grid-cols-2",
                                            children: [
                                              e.jsx(o, {
                                                label: "Request title",
                                                required: !0,
                                                hint: "Example: Denim Jacket - 10k pcs",
                                                error:
                                                  u.title || u.request_title,
                                                children: e.jsx(d, {
                                                  value: i.title,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      title: s.target.value,
                                                    }),
                                                  placeholder:
                                                    "Meaningful title",
                                                }),
                                              }),
                                              $
                                                ? e.jsxs(e.Fragment, {
                                                    children: [
                                                      e.jsx(o, {
                                                        label: "Material type",
                                                        required: !0,
                                                        error:
                                                          u.materialType ||
                                                          u.material_type,
                                                        children: e.jsx(d, {
                                                          value: i.materialType,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              materialType:
                                                                s.target.value,
                                                            }),
                                                          placeholder: "Cotton",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Sub-category",
                                                        required: !0,
                                                        error:
                                                          u.subCategory ||
                                                          u.sub_category,
                                                        children: e.jsx(d, {
                                                          value: i.subCategory,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              subCategory:
                                                                s.target.value,
                                                            }),
                                                          placeholder: "Jersey",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Quantity",
                                                        required: !0,
                                                        error:
                                                          u.quantity ||
                                                          u.totalQuantity ||
                                                          u.total_quantity,
                                                        children: e.jsx(d, {
                                                          value: i.quantity,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              quantity:
                                                                s.target.value,
                                                            }),
                                                          placeholder: "5000",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Unit",
                                                        required: !0,
                                                        error: u.unit,
                                                        children: e.jsx(d, {
                                                          value: i.unit,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              unit: s.target
                                                                .value,
                                                            }),
                                                          placeholder: "kg",
                                                        }),
                                                      }),
                                                    ],
                                                  })
                                                : e.jsxs(e.Fragment, {
                                                    children: [
                                                      e.jsx(o, {
                                                        label:
                                                          "Product category",
                                                        required: !0,
                                                        error: u.category,
                                                        children: e.jsx(d, {
                                                          value: i.category,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              category:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "Outerwear",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Gender target",
                                                        required: !0,
                                                        error:
                                                          u.genderTarget ||
                                                          u.gender_target,
                                                        children: e.jsxs(X, {
                                                          value: i.genderTarget,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              genderTarget:
                                                                s.target.value,
                                                            }),
                                                          children: [
                                                            e.jsx("option", {
                                                              value: "",
                                                              children:
                                                                "Select gender",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "Women",
                                                              children: "Women",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "Men",
                                                              children: "Men",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "Kids",
                                                              children: "Kids",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "Unisex",
                                                              children:
                                                                "Unisex",
                                                            }),
                                                          ],
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Season",
                                                        required: !0,
                                                        error: u.season,
                                                        children: e.jsxs(X, {
                                                          value: i.season,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              season:
                                                                s.target.value,
                                                            }),
                                                          children: [
                                                            e.jsx("option", {
                                                              value: "",
                                                              children:
                                                                "Select season",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "Spring",
                                                              children:
                                                                "Spring",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "Summer",
                                                              children:
                                                                "Summer",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "Autumn",
                                                              children:
                                                                "Autumn",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "Winter",
                                                              children:
                                                                "Winter",
                                                            }),
                                                            e.jsx("option", {
                                                              value:
                                                                "All season",
                                                              children:
                                                                "All season",
                                                            }),
                                                          ],
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Total quantity (pcs)",
                                                        required: !0,
                                                        error:
                                                          u.totalQuantity ||
                                                          u.quantity ||
                                                          u.total_quantity,
                                                        children: e.jsx(d, {
                                                          value:
                                                            i.totalQuantity,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              totalQuantity:
                                                                s.target.value,
                                                            }),
                                                          placeholder: "10000",
                                                        }),
                                                      }),
                                                    ],
                                                  }),
                                              j
                                                ? e.jsxs(e.Fragment, {
                                                    children: [
                                                      e.jsx(o, {
                                                        label: "Industry",
                                                        hint: "Optional",
                                                        children: e.jsx(d, {
                                                          value: i.industry,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              industry:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "Apparel / Textile",
                                                        }),
                                                      }),
                                                      $
                                                        ? null
                                                        : e.jsx(o, {
                                                            label:
                                                              "Number of styles",
                                                            hint: "Optional",
                                                            children: e.jsx(d, {
                                                              value:
                                                                i.numberOfStyles,
                                                              onChange: (s) =>
                                                                a({
                                                                  ...i,
                                                                  numberOfStyles:
                                                                    s.target
                                                                      .value,
                                                                }),
                                                              placeholder: "2",
                                                            }),
                                                          }),
                                                    ],
                                                  })
                                                : null,
                                            ],
                                          })
                                        : null,
                                      w === 2 && $
                                        ? e.jsxs("div", {
                                            className:
                                              "grid gap-4 md:grid-cols-2",
                                            children: [
                                              e.jsx(o, {
                                                label: "Fiber composition",
                                                required: !0,
                                                error:
                                                  u.fiberComposition ||
                                                  u.fiber_composition,
                                                children: e.jsx(d, {
                                                  value: i.fiberComposition,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      fiberComposition:
                                                        s.target.value,
                                                    }),
                                                  placeholder:
                                                    "100% combed cotton",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Fabric weight (GSM)",
                                                required: !0,
                                                error:
                                                  u.fabricWeightGsm ||
                                                  u.fabric_weight_gsm ||
                                                  u.fabric_weight,
                                                children: e.jsx(d, {
                                                  value: i.fabricWeightGsm,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      fabricWeightGsm:
                                                        s.target.value,
                                                    }),
                                                  placeholder: "180",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Fabric width",
                                                children: e.jsx(d, {
                                                  value: i.fabricWidth,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      fabricWidth:
                                                        s.target.value,
                                                    }),
                                                  placeholder: "58 inches",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Yarn count",
                                                children: e.jsx(d, {
                                                  value: i.yarnCount,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      yarnCount: s.target.value,
                                                    }),
                                                  placeholder: "30s",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Thread count",
                                                children: e.jsx(d, {
                                                  value: i.threadCount,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      threadCount:
                                                        s.target.value,
                                                    }),
                                                  placeholder: "N/A",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Finish required",
                                                children: e.jsx(d, {
                                                  value: i.finishRequired,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      finishRequired:
                                                        s.target.value,
                                                    }),
                                                  placeholder: "Bio wash",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Stretch required",
                                                children: e.jsx(d, {
                                                  value: i.stretchRequired,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      stretchRequired:
                                                        s.target.value,
                                                    }),
                                                  placeholder: "Low stretch",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Color",
                                                children: e.jsx(d, {
                                                  value: i.color,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      color: s.target.value,
                                                    }),
                                                  placeholder: "White",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Pattern",
                                                children: e.jsx(d, {
                                                  value: i.pattern,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      pattern: s.target.value,
                                                    }),
                                                  placeholder: "Solid",
                                                }),
                                              }),
                                            ],
                                          })
                                        : null,
                                      w === 2 && !$
                                        ? e.jsxs("div", {
                                            className:
                                              "grid gap-4 md:grid-cols-2",
                                            children: [
                                              e.jsx(o, {
                                                label: "Fabric composition",
                                                children: e.jsx(d, {
                                                  value: i.fabricComposition,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      fabricComposition:
                                                        s.target.value,
                                                    }),
                                                  placeholder:
                                                    "98% cotton, 2% elastane",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Fabric weight (GSM)",
                                                children: e.jsx(d, {
                                                  value: i.fabricWeightGsm,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      fabricWeightGsm:
                                                        s.target.value,
                                                    }),
                                                  placeholder: "320",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Weave / Knit type",
                                                children: e.jsx(d, {
                                                  value: i.weaveOrKnit,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      weaveOrKnit:
                                                        s.target.value,
                                                    }),
                                                  placeholder: "Twill weave",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Size range",
                                                children: e.jsx(d, {
                                                  value: i.sizeRange,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      sizeRange: s.target.value,
                                                    }),
                                                  placeholder: "S-XL",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Color requirement",
                                                children: e.jsx(d, {
                                                  value: i.colorRequirement,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      colorRequirement:
                                                        s.target.value,
                                                    }),
                                                  placeholder:
                                                    "Indigo and black",
                                                }),
                                              }),
                                              e.jsxs(o, {
                                                label: "Style description",
                                                children: [
                                                  e.jsx(te, {
                                                    rows: 4,
                                                    value: i.styleDescription,
                                                    onChange: (s) =>
                                                      a({
                                                        ...i,
                                                        styleDescription:
                                                          s.target.value,
                                                      }),
                                                    placeholder:
                                                      "Premium structured jacket...",
                                                  }),
                                                  e.jsx(ke, {
                                                    text: i.styleDescription,
                                                    limit: (() => {
                                                      const s = ce();
                                                      return String(
                                                        (s == null
                                                          ? void 0
                                                          : s.subscription_status) ||
                                                          "",
                                                      ).toLowerCase() ===
                                                        "premium"
                                                        ? 1500
                                                        : 600;
                                                    })(),
                                                  }),
                                                ],
                                              }),
                                              e.jsx(o, {
                                                label: "Tech pack required",
                                                children: e.jsx(d, {
                                                  value: i.techPackRequired,
                                                  onChange: (s) =>
                                                    a({
                                                      ...i,
                                                      techPackRequired:
                                                        s.target.value,
                                                    }),
                                                  placeholder: "Yes / No",
                                                }),
                                              }),
                                              e.jsx(o, {
                                                label: "Tech pack upload",
                                                hint: "optional",
                                                children: e.jsxs("div", {
                                                  className: `rounded-2xl border border-dashed p-4 ${p ? "border-white/15 bg-white/5" : "border-sky-200 bg-sky-50/70"}`,
                                                  children: [
                                                    W.length
                                                      ? e.jsx("div", {
                                                          className:
                                                            "space-y-2",
                                                          children: W.map(
                                                            (s, n) => {
                                                              var m, y;
                                                              return e.jsxs(
                                                                "div",
                                                                {
                                                                  className: `flex items-center justify-between rounded-2xl border px-3 py-2 ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                                  children: [
                                                                    e.jsx(
                                                                      "span",
                                                                      {
                                                                        className:
                                                                          "text-xs text-slate-600 dark:text-slate-400",
                                                                        children:
                                                                          ((m =
                                                                            s.file) ==
                                                                          null
                                                                            ? void 0
                                                                            : m.name) ||
                                                                          "File",
                                                                      },
                                                                    ),
                                                                    e.jsx(
                                                                      "button",
                                                                      {
                                                                        type: "button",
                                                                        className:
                                                                          "text-xs font-semibold text-rose-500",
                                                                        onClick:
                                                                          () =>
                                                                            Q(
                                                                              (
                                                                                _,
                                                                              ) =>
                                                                                _.filter(
                                                                                  (
                                                                                    l,
                                                                                    U,
                                                                                  ) =>
                                                                                    U !==
                                                                                    n,
                                                                                ),
                                                                            ),
                                                                        children:
                                                                          "Remove",
                                                                      },
                                                                    ),
                                                                  ],
                                                                },
                                                                `${(y = s.file) == null ? void 0 : y.name}-${n}`,
                                                              );
                                                            },
                                                          ),
                                                        })
                                                      : e.jsx("p", {
                                                          className:
                                                            "text-xs text-slate-500",
                                                          children:
                                                            "You can upload tech packs and sketches after posting too.",
                                                        }),
                                                    e.jsx("div", {
                                                      className:
                                                        "mt-3 flex items-center gap-2",
                                                      children: e.jsxs(
                                                        "label",
                                                        {
                                                          className:
                                                            "inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20",
                                                          children: [
                                                            e.jsx(Ce, {
                                                              className:
                                                                "h-4 w-4",
                                                            }),
                                                            " Add file",
                                                            e.jsx("input", {
                                                              type: "file",
                                                              className:
                                                                "hidden",
                                                              onChange: (s) => {
                                                                var m;
                                                                const n =
                                                                  (m =
                                                                    s.target
                                                                      .files) ==
                                                                  null
                                                                    ? void 0
                                                                    : m[0];
                                                                (n &&
                                                                  Q((y) => [
                                                                    ...y,
                                                                    {
                                                                      file: n,
                                                                      type: "tech_pack",
                                                                    },
                                                                  ]),
                                                                  (s.target.value =
                                                                    ""));
                                                              },
                                                            }),
                                                          ],
                                                        },
                                                      ),
                                                    }),
                                                  ],
                                                }),
                                              }),
                                            ],
                                          })
                                        : null,
                                      w === 3
                                        ? e.jsxs("div", {
                                            className:
                                              "grid gap-4 md:grid-cols-2",
                                            children: [
                                              $
                                                ? e.jsxs(e.Fragment, {
                                                    children: [
                                                      e.jsx(o, {
                                                        label: "Target price",
                                                        required: !0,
                                                        error:
                                                          u.targetPrice ||
                                                          u.price_range ||
                                                          u.target_price,
                                                        children: e.jsx(d, {
                                                          value: i.targetPrice,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              targetPrice:
                                                                s.target.value,
                                                            }),
                                                          placeholder: "2.15",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Price unit",
                                                        required: !0,
                                                        error:
                                                          u.priceUnit ||
                                                          u.price_unit,
                                                        children: e.jsx(d, {
                                                          value: i.priceUnit,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              priceUnit:
                                                                s.target.value,
                                                            }),
                                                          placeholder: "/ kg",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Incoterm",
                                                        required: !0,
                                                        error:
                                                          u.incoterms ||
                                                          u.incoterm,
                                                        children: e.jsxs(X, {
                                                          value: i.incoterms,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              incoterms:
                                                                s.target.value,
                                                            }),
                                                          children: [
                                                            e.jsx("option", {
                                                              value: "",
                                                              children:
                                                                "Select incoterm",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "FOB",
                                                              children: "FOB",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "CIF",
                                                              children: "CIF",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "EXW",
                                                              children: "EXW",
                                                            }),
                                                          ],
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Delivery port",
                                                        required: !0,
                                                        error:
                                                          u.deliveryPort ||
                                                          u.delivery_port,
                                                        children: e.jsx(d, {
                                                          value: i.deliveryPort,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              deliveryPort:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "Chittagong",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Lead time required",
                                                        required: !0,
                                                        error:
                                                          u.leadTimeRequired ||
                                                          u.lead_time_required,
                                                        children: e.jsx(d, {
                                                          value:
                                                            i.leadTimeRequired,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              leadTimeRequired:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "30 days",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Lab test required",
                                                        children: e.jsx(d, {
                                                          value:
                                                            i.labTestRequired,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              labTestRequired:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "Yes / No",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Swatch/sample first?",
                                                        children: e.jsx(d, {
                                                          value: i.swatchFirst,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              swatchFirst:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "Yes / No",
                                                        }),
                                                      }),
                                                    ],
                                                  })
                                                : e.jsxs(e.Fragment, {
                                                    children: [
                                                      e.jsx(o, {
                                                        label:
                                                          "Target FOB price",
                                                        required: !0,
                                                        error:
                                                          u.targetFobPrice ||
                                                          u.price_range ||
                                                          u.target_fob_price,
                                                        children: e.jsx(d, {
                                                          value:
                                                            i.targetFobPrice,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              targetFobPrice:
                                                                s.target.value,
                                                            }),
                                                          placeholder: "8.40",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Incoterm",
                                                        required: !0,
                                                        error:
                                                          u.incoterms ||
                                                          u.incoterm,
                                                        children: e.jsxs(X, {
                                                          value: i.incoterms,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              incoterms:
                                                                s.target.value,
                                                            }),
                                                          children: [
                                                            e.jsx("option", {
                                                              value: "",
                                                              children:
                                                                "Select incoterm",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "FOB",
                                                              children: "FOB",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "CIF",
                                                              children: "CIF",
                                                            }),
                                                            e.jsx("option", {
                                                              value: "EXW",
                                                              children: "EXW",
                                                            }),
                                                          ],
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Destination port",
                                                        children: e.jsx(d, {
                                                          value:
                                                            i.destinationPort,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              destinationPort:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "Chittagong",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Ex-factory date",
                                                        required: !0,
                                                        error:
                                                          u.exFactoryDate ||
                                                          u.ex_factory_date,
                                                        children: e.jsx(d, {
                                                          type: "date",
                                                          value:
                                                            i.exFactoryDate,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              exFactoryDate:
                                                                s.target.value,
                                                            }),
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Sample required",
                                                        children: e.jsx(d, {
                                                          value:
                                                            i.sampleRequired,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              sampleRequired:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "Yes / No",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Sample type",
                                                        children: e.jsx(d, {
                                                          value: i.sampleType,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              sampleType:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "Proto sample",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Payment terms",
                                                        required: !0,
                                                        error:
                                                          u.paymentTerms ||
                                                          u.payment_terms,
                                                        children: e.jsx(d, {
                                                          value: i.paymentTerms,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              paymentTerms:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "30% advance, 70% against B/L",
                                                        }),
                                                      }),
                                                    ],
                                                  }),
                                              j
                                                ? e.jsxs(e.Fragment, {
                                                    children: [
                                                      e.jsx(o, {
                                                        label: "Quote deadline",
                                                        hint: "Optional",
                                                        children: e.jsx(d, {
                                                          type: "date",
                                                          value:
                                                            i.quoteDeadline,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              quoteDeadline:
                                                                s.target.value,
                                                            }),
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label: "Request expiry",
                                                        hint: "Optional",
                                                        children: e.jsx(d, {
                                                          type: "date",
                                                          value: i.expiresAt,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              expiresAt:
                                                                s.target.value,
                                                            }),
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Max suppliers to contact",
                                                        hint: "Optional",
                                                        children: e.jsx(d, {
                                                          value: i.maxSuppliers,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              maxSuppliers:
                                                                s.target.value,
                                                            }),
                                                          placeholder: "8",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Messaging access",
                                                        hint: "Normal: verified goes to inbox, unverified goes to requests. Verified request only: only verified suppliers can message.",
                                                        children: e.jsxs(
                                                          "div",
                                                          {
                                                            className:
                                                              "grid grid-cols-1 gap-2 sm:grid-cols-2",
                                                            children: [
                                                              e.jsxs("button", {
                                                                type: "button",
                                                                onClick: () =>
                                                                  a({
                                                                    ...i,
                                                                    verifiedOnly:
                                                                      !1,
                                                                  }),
                                                                className: `rounded-2xl border p-4 text-left text-sm transition ${i.verifiedOnly ? (p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white") : "border-sky-400 bg-sky-500/10"}`,
                                                                children: [
                                                                  e.jsx("div", {
                                                                    className:
                                                                      "font-semibold",
                                                                    children:
                                                                      "Normal",
                                                                  }),
                                                                  e.jsx("div", {
                                                                    className: `mt-1 text-xs ${k}`,
                                                                    children:
                                                                      "verified goes to inbox, unverified goes to requests",
                                                                  }),
                                                                ],
                                                              }),
                                                              e.jsxs("button", {
                                                                type: "button",
                                                                onClick: () =>
                                                                  a({
                                                                    ...i,
                                                                    verifiedOnly:
                                                                      !0,
                                                                  }),
                                                                className: `rounded-2xl border p-4 text-left text-sm transition ${i.verifiedOnly ? "border-sky-400 bg-sky-500/10" : p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                                children: [
                                                                  e.jsx("div", {
                                                                    className:
                                                                      "font-semibold",
                                                                    children:
                                                                      "Verified request only",
                                                                  }),
                                                                  e.jsx("div", {
                                                                    className: `mt-1 text-xs ${k}`,
                                                                    children:
                                                                      "only verified suppliers can message",
                                                                  }),
                                                                ],
                                                              }),
                                                            ],
                                                          },
                                                        ),
                                                      }),
                                                    ],
                                                  })
                                                : null,
                                            ],
                                          })
                                        : null,
                                      w === 4
                                        ? e.jsxs("div", {
                                            className:
                                              "grid gap-4 xl:grid-cols-2",
                                            children: [
                                              e.jsxs("div", {
                                                className: `rounded-[26px] border p-5 ${D}`,
                                                children: [
                                                  e.jsx("h3", {
                                                    className:
                                                      "mb-4 text-base font-semibold",
                                                    children:
                                                      "Compliance / Lab",
                                                  }),
                                                  $
                                                    ? e.jsx(o, {
                                                        label:
                                                          "Lab/Certification notes",
                                                        children: e.jsx(te, {
                                                          rows: 4,
                                                          value: i.labCertNotes,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              labCertNotes:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "Testing requirements...",
                                                        }),
                                                      })
                                                    : e.jsxs(e.Fragment, {
                                                        children: [
                                                          e.jsx(o, {
                                                            label:
                                                              "Compliance certifications",
                                                            children: e.jsx(
                                                              "div",
                                                              {
                                                                className:
                                                                  "grid grid-cols-2 gap-3",
                                                                children:
                                                                  gs.map((s) =>
                                                                    e.jsxs(
                                                                      "label",
                                                                      {
                                                                        className: `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                                        children:
                                                                          [
                                                                            e.jsx(
                                                                              "input",
                                                                              {
                                                                                type: "checkbox",
                                                                                checked:
                                                                                  i.complianceCerts.includes(
                                                                                    s,
                                                                                  ),
                                                                                onChange:
                                                                                  (
                                                                                    n,
                                                                                  ) => {
                                                                                    const m =
                                                                                      n
                                                                                        .target
                                                                                        .checked
                                                                                        ? [
                                                                                            ...i.complianceCerts,
                                                                                            s,
                                                                                          ]
                                                                                        : i.complianceCerts.filter(
                                                                                            (
                                                                                              y,
                                                                                            ) =>
                                                                                              y !==
                                                                                              s,
                                                                                          );
                                                                                    a(
                                                                                      {
                                                                                        ...i,
                                                                                        complianceCerts:
                                                                                          m,
                                                                                      },
                                                                                    );
                                                                                  },
                                                                                className:
                                                                                  "h-4 w-4 accent-sky-500",
                                                                              },
                                                                            ),
                                                                            e.jsx(
                                                                              "span",
                                                                              {
                                                                                children:
                                                                                  s,
                                                                              },
                                                                            ),
                                                                          ],
                                                                      },
                                                                      s,
                                                                    ),
                                                                  ),
                                                              },
                                                            ),
                                                          }),
                                                          e.jsx(o, {
                                                            label:
                                                              "Sustainability certifications",
                                                            children: e.jsx(
                                                              "div",
                                                              {
                                                                className:
                                                                  "grid grid-cols-2 gap-3",
                                                                children:
                                                                  xs.map((s) =>
                                                                    e.jsxs(
                                                                      "label",
                                                                      {
                                                                        className: `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                                        children:
                                                                          [
                                                                            e.jsx(
                                                                              "input",
                                                                              {
                                                                                type: "checkbox",
                                                                                checked:
                                                                                  i.sustainabilityCerts.includes(
                                                                                    s,
                                                                                  ),
                                                                                onChange:
                                                                                  (
                                                                                    n,
                                                                                  ) => {
                                                                                    const m =
                                                                                      n
                                                                                        .target
                                                                                        .checked
                                                                                        ? [
                                                                                            ...i.sustainabilityCerts,
                                                                                            s,
                                                                                          ]
                                                                                        : i.sustainabilityCerts.filter(
                                                                                            (
                                                                                              y,
                                                                                            ) =>
                                                                                              y !==
                                                                                              s,
                                                                                          );
                                                                                    a(
                                                                                      {
                                                                                        ...i,
                                                                                        sustainabilityCerts:
                                                                                          m,
                                                                                      },
                                                                                    );
                                                                                  },
                                                                                className:
                                                                                  "h-4 w-4 accent-sky-500",
                                                                              },
                                                                            ),
                                                                            e.jsx(
                                                                              "span",
                                                                              {
                                                                                children:
                                                                                  s,
                                                                              },
                                                                            ),
                                                                          ],
                                                                      },
                                                                      s,
                                                                    ),
                                                                  ),
                                                              },
                                                            ),
                                                          }),
                                                          e.jsx(o, {
                                                            label:
                                                              "Compliance notes",
                                                            children: e.jsx(
                                                              te,
                                                              {
                                                                rows: 4,
                                                                value:
                                                                  i.complianceNotes,
                                                                onChange: (s) =>
                                                                  a({
                                                                    ...i,
                                                                    complianceNotes:
                                                                      s.target
                                                                        .value,
                                                                  }),
                                                                placeholder:
                                                                  "Traceability, audit readiness...",
                                                              },
                                                            ),
                                                          }),
                                                        ],
                                                      }),
                                                  e.jsxs("div", {
                                                    className:
                                                      "mt-4 grid gap-4 md:grid-cols-2",
                                                    children: [
                                                      e.jsx(o, {
                                                        label:
                                                          "Preferred factory location",
                                                        children: e.jsx(d, {
                                                          value:
                                                            i.preferredFactoryLocation,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              preferredFactoryLocation:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "Gazipur / Chittagong / Any",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Factory size preference",
                                                        children: e.jsx(d, {
                                                          value:
                                                            i.factorySizePreference,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              factorySizePreference:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "Small / Medium / Large",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Export experience preference",
                                                        children: e.jsx(d, {
                                                          value:
                                                            i.exportExperiencePreference,
                                                          onChange: (s) =>
                                                            a({
                                                              ...i,
                                                              exportExperiencePreference:
                                                                s.target.value,
                                                            }),
                                                          placeholder:
                                                            "EU required / US required / Any",
                                                        }),
                                                      }),
                                                      e.jsx(o, {
                                                        label:
                                                          "Confidentiality",
                                                        children: e.jsxs(
                                                          "label",
                                                          {
                                                            className: `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                            children: [
                                                              e.jsx("input", {
                                                                type: "checkbox",
                                                                checked:
                                                                  i.confidentialityToggle,
                                                                onChange: (s) =>
                                                                  a({
                                                                    ...i,
                                                                    confidentialityToggle:
                                                                      s.target
                                                                        .checked,
                                                                  }),
                                                                className:
                                                                  "h-4 w-4 accent-sky-500",
                                                              }),
                                                              "Hide brand name (only verified suppliers can see it)",
                                                            ],
                                                          },
                                                        ),
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                              e.jsxs("div", {
                                                className: "space-y-4",
                                                children: [
                                                  e.jsxs("div", {
                                                    className: `rounded-[26px] border p-5 ${D}`,
                                                    children: [
                                                      e.jsx("h3", {
                                                        className:
                                                          "mb-4 text-base font-semibold",
                                                        children:
                                                          "Packaging & Shipment",
                                                      }),
                                                      e.jsxs("div", {
                                                        className: "grid gap-4",
                                                        children: [
                                                          e.jsx(o, {
                                                            label:
                                                              "Packaging requirement",
                                                            children: e.jsx(d, {
                                                              value:
                                                                i.packagingRequirement,
                                                              onChange: (s) =>
                                                                a({
                                                                  ...i,
                                                                  packagingRequirement:
                                                                    s.target
                                                                      .value,
                                                                }),
                                                              placeholder:
                                                                "Poly bag / Hanger / Flat pack",
                                                            }),
                                                          }),
                                                          e.jsx(o, {
                                                            label:
                                                              "Origin label requirement",
                                                            children: e.jsx(d, {
                                                              value:
                                                                i.originLabelRequired,
                                                              onChange: (s) =>
                                                                a({
                                                                  ...i,
                                                                  originLabelRequired:
                                                                    s.target
                                                                      .value,
                                                                }),
                                                              placeholder:
                                                                "Made in Bangladesh required?",
                                                            }),
                                                          }),
                                                          e.jsx(o, {
                                                            label:
                                                              "Hang tag / Barcode",
                                                            children: e.jsx(d, {
                                                              value:
                                                                i.hangtagBarcode,
                                                              onChange: (s) =>
                                                                a({
                                                                  ...i,
                                                                  hangtagBarcode:
                                                                    s.target
                                                                      .value,
                                                                }),
                                                              placeholder:
                                                                "Buyer-supplied / Factory to arrange",
                                                            }),
                                                          }),
                                                          e.jsx(o, {
                                                            label:
                                                              "Partial shipment allowed",
                                                            children: e.jsx(d, {
                                                              value:
                                                                i.partialShipmentAllowed,
                                                              onChange: (s) =>
                                                                a({
                                                                  ...i,
                                                                  partialShipmentAllowed:
                                                                    s.target
                                                                      .value,
                                                                }),
                                                              placeholder:
                                                                "Yes / No",
                                                            }),
                                                          }),
                                                          e.jsx(o, {
                                                            label:
                                                              "Shipment mode",
                                                            children: e.jsx(d, {
                                                              value:
                                                                i.shipmentMode,
                                                              onChange: (s) =>
                                                                a({
                                                                  ...i,
                                                                  shipmentMode:
                                                                    s.target
                                                                      .value,
                                                                }),
                                                              placeholder:
                                                                "Sea / Air / Both",
                                                            }),
                                                          }),
                                                        ],
                                                      }),
                                                    ],
                                                  }),
                                                  e.jsxs("div", {
                                                    className: `rounded-[26px] border p-5 ${D}`,
                                                    children: [
                                                      e.jsxs("div", {
                                                        className:
                                                          "mb-3 flex items-center justify-between",
                                                        children: [
                                                          e.jsx("h3", {
                                                            className:
                                                              "text-base font-semibold",
                                                            children:
                                                              "Custom fields",
                                                          }),
                                                          e.jsxs("button", {
                                                            type: "button",
                                                            onClick: _t,
                                                            className:
                                                              "inline-flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white",
                                                            children: [
                                                              e.jsx(ts, {
                                                                className:
                                                                  "h-3.5 w-3.5",
                                                              }),
                                                              " Add custom field",
                                                            ],
                                                          }),
                                                        ],
                                                      }),
                                                      e.jsx("div", {
                                                        className: "space-y-3",
                                                        children:
                                                          (Array.isArray(
                                                            i.customFields,
                                                          )
                                                            ? i.customFields
                                                            : []
                                                          ).map((s, n) =>
                                                            e.jsxs(
                                                              "div",
                                                              {
                                                                className:
                                                                  "grid gap-2 md:grid-cols-[1fr_1fr_auto]",
                                                                children: [
                                                                  e.jsx(d, {
                                                                    placeholder:
                                                                      "Label",
                                                                    value:
                                                                      s.label,
                                                                    onChange: (
                                                                      m,
                                                                    ) =>
                                                                      Ve(
                                                                        n,
                                                                        "label",
                                                                        m.target
                                                                          .value,
                                                                      ),
                                                                  }),
                                                                  e.jsx(d, {
                                                                    placeholder:
                                                                      "Value",
                                                                    value:
                                                                      s.value,
                                                                    onChange: (
                                                                      m,
                                                                    ) =>
                                                                      Ve(
                                                                        n,
                                                                        "value",
                                                                        m.target
                                                                          .value,
                                                                      ),
                                                                  }),
                                                                  e.jsx(
                                                                    "button",
                                                                    {
                                                                      type: "button",
                                                                      onClick:
                                                                        () =>
                                                                          qt(n),
                                                                      className:
                                                                        "rounded-2xl border px-3 py-2 text-sm text-rose-500",
                                                                      children:
                                                                        "Remove",
                                                                    },
                                                                  ),
                                                                ],
                                                              },
                                                              `custom-${n}`,
                                                            ),
                                                          ),
                                                      }),
                                                      e.jsx("div", {
                                                        className: "mt-4",
                                                        children: e.jsxs(o, {
                                                          label:
                                                            "Custom description",
                                                          hint: "Use this for extra notes, design details, or negotiation context.",
                                                          children: [
                                                            e.jsx(te, {
                                                              rows: 5,
                                                              value:
                                                                i.customDescription,
                                                              onChange: (s) =>
                                                                a({
                                                                  ...i,
                                                                  customDescription:
                                                                    s.target
                                                                      .value,
                                                                }),
                                                              placeholder:
                                                                "Use this for extra notes...",
                                                            }),
                                                            e.jsx(ke, {
                                                              text: i.customDescription,
                                                              limit: (() => {
                                                                const s = ce();
                                                                return String(
                                                                  (s == null
                                                                    ? void 0
                                                                    : s.subscription_status) ||
                                                                    "",
                                                                ).toLowerCase() ===
                                                                  "premium"
                                                                  ? 1500
                                                                  : 600;
                                                              })(),
                                                            }),
                                                          ],
                                                        }),
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          })
                                        : null,
                                      w === 5
                                        ? e.jsxs("div", {
                                            children: [
                                              e.jsxs("div", {
                                                className:
                                                  "mb-4 flex items-center justify-between",
                                                children: [
                                                  e.jsxs("div", {
                                                    children: [
                                                      e.jsx("h3", {
                                                        className:
                                                          "text-xl font-semibold",
                                                        children:
                                                          "Preview summary",
                                                      }),
                                                      e.jsx("p", {
                                                        className: `text-sm ${k}`,
                                                        children:
                                                          "Review all fields before posting.",
                                                      }),
                                                    ],
                                                  }),
                                                  e.jsxs(L, {
                                                    className:
                                                      "bg-sky-500/15 text-sky-300",
                                                    children: [
                                                      we.length,
                                                      " visible fields",
                                                    ],
                                                  }),
                                                ],
                                              }),
                                              we.length === 0
                                                ? e.jsx("div", {
                                                    className: `rounded-[24px] border p-6 text-sm ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                    children:
                                                      "No fields filled yet.",
                                                  })
                                                : e.jsx("div", {
                                                    className:
                                                      "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
                                                    children: we.map((s) =>
                                                      e.jsxs(
                                                        "div",
                                                        {
                                                          className: `rounded-[22px] border p-4 ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                          children: [
                                                            e.jsx("div", {
                                                              className:
                                                                "text-xs uppercase tracking-wider text-slate-400",
                                                              children: s.label,
                                                            }),
                                                            e.jsx("div", {
                                                              className:
                                                                "mt-1 text-sm font-medium break-words",
                                                              children: s.value,
                                                            }),
                                                          ],
                                                        },
                                                        s.label,
                                                      ),
                                                    ),
                                                  }),
                                            ],
                                          })
                                        : null,
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className:
                                      "mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5",
                                    children: [
                                      e.jsxs("div", {
                                        className: "flex gap-2",
                                        children: [
                                          e.jsxs("button", {
                                            type: "button",
                                            onClick: kt,
                                            disabled: He,
                                            className: `inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${He ? "cursor-not-allowed opacity-40" : p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                            children: [
                                              e.jsx(ss, {
                                                className: "h-4 w-4",
                                              }),
                                              " Back",
                                            ],
                                          }),
                                          e.jsxs("button", {
                                            type: "button",
                                            disabled: H,
                                            onClick: St,
                                            className:
                                              "inline-flex items-center gap-2 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-500/15 disabled:opacity-70 dark:text-sky-200",
                                            children: [
                                              e.jsx(Ce, {
                                                className: "h-4 w-4",
                                              }),
                                              " ",
                                              H
                                                ? e.jsx(ee, {
                                                    variant: "bounce",
                                                    color: "#6100ff",
                                                    size: "small",
                                                    text: "",
                                                    textColor: "",
                                                  })
                                                : "Save Draft",
                                            ],
                                          }),
                                        ],
                                      }),
                                      e.jsx("div", {
                                        className: "flex gap-2",
                                        children: vt
                                          ? e.jsxs("button", {
                                              type: "button",
                                              disabled: H,
                                              onClick: () => Ze(),
                                              className:
                                                "inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 disabled:opacity-70",
                                              children: [
                                                H
                                                  ? e.jsx(ee, {
                                                      variant: "bounce",
                                                      color: "#6100ff",
                                                      size: "small",
                                                      text: "",
                                                      textColor: "",
                                                    })
                                                  : "Post Request",
                                                " ",
                                                e.jsx(_e, {
                                                  className: "h-4 w-4",
                                                }),
                                              ],
                                            })
                                          : e.jsxs("button", {
                                              type: "button",
                                              disabled: H,
                                              onClick: Nt,
                                              className:
                                                "inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 disabled:opacity-50",
                                              children: [
                                                "Next ",
                                                e.jsx(is, {
                                                  className: "h-4 w-4",
                                                }),
                                              ],
                                            }),
                                      }),
                                    ],
                                  }),
                                ],
                              })
                            : e.jsxs("div", {
                                className: "space-y-6",
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "flex flex-wrap items-center gap-2",
                                    children: [
                                      e.jsx(L, {
                                        className: "bg-sky-500/15 text-sky-300",
                                        children: "Open Buyer Requests",
                                      }),
                                      e.jsx(L, {
                                        className:
                                          "bg-cyan-500/15 text-cyan-300",
                                        children: "Assign to agents",
                                      }),
                                      e.jsx(L, {
                                        className: `bg-white/5 ${p ? "text-slate-300" : "text-slate-600"}`,
                                        children: "Manual refresh only",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: `rounded-[26px] border p-5 ${D}`,
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "mb-4 flex items-center justify-between gap-3",
                                        children: [
                                          e.jsxs("div", {
                                            children: [
                                              e.jsx("h3", {
                                                className:
                                                  "text-lg font-semibold",
                                                children: "Lead queue",
                                              }),
                                              e.jsx("p", {
                                                className: `text-sm ${k}`,
                                                children:
                                                  "Use Assign to route a request to a specific agent.",
                                              }),
                                            ],
                                          }),
                                          e.jsxs("button", {
                                            type: "button",
                                            onClick: O,
                                            className:
                                              "inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition dark:border-white/10 dark:bg-white/5",
                                            children: [
                                              e.jsx(Se, {
                                                className: "h-4 w-4",
                                              }),
                                              " Refresh",
                                            ],
                                          }),
                                        ],
                                      }),
                                      ae.length
                                        ? e.jsx("div", {
                                            className:
                                              "overflow-x-auto rounded-[22px] border border-white/10",
                                            children: e.jsxs("table", {
                                              className:
                                                "min-w-full divide-y divide-white/10 text-left text-sm",
                                              children: [
                                                e.jsx("thead", {
                                                  className:
                                                    "bg-white/5 text-slate-300",
                                                  children: e.jsxs("tr", {
                                                    children: [
                                                      e.jsx("th", {
                                                        className:
                                                          "px-4 py-3 font-medium",
                                                        children: "Title",
                                                      }),
                                                      e.jsx("th", {
                                                        className:
                                                          "px-4 py-3 font-medium",
                                                        children: "Status",
                                                      }),
                                                      e.jsx("th", {
                                                        className:
                                                          "px-4 py-3 font-medium",
                                                        children: "Qty",
                                                      }),
                                                      e.jsx("th", {
                                                        className:
                                                          "px-4 py-3 font-medium",
                                                        children: "Target",
                                                      }),
                                                      e.jsx("th", {
                                                        className:
                                                          "px-4 py-3 font-medium",
                                                        children: "Delivery",
                                                      }),
                                                      e.jsx("th", {
                                                        className:
                                                          "px-4 py-3 font-medium",
                                                        children: "Assign",
                                                      }),
                                                    ],
                                                  }),
                                                }),
                                                e.jsx("tbody", {
                                                  className:
                                                    "divide-y divide-white/10",
                                                  children: ae.map((s) =>
                                                    e.jsxs(
                                                      "tr",
                                                      {
                                                        className:
                                                          "hover:bg-white/5",
                                                        children: [
                                                          e.jsxs("td", {
                                                            className:
                                                              "px-4 py-4",
                                                            children: [
                                                              e.jsx("div", {
                                                                className:
                                                                  "font-medium",
                                                                children:
                                                                  s.title ||
                                                                  s.category ||
                                                                  "Buyer Request",
                                                              }),
                                                              e.jsxs("div", {
                                                                className:
                                                                  "mt-1 text-xs text-slate-400",
                                                                children: [
                                                                  "Buyer: ",
                                                                  String(
                                                                    s.buyer_id ||
                                                                      "",
                                                                  ).slice(0, 8),
                                                                  "...",
                                                                  s.ai_summary
                                                                    ? ` - ${s.ai_summary}`
                                                                    : "",
                                                                ],
                                                              }),
                                                            ],
                                                          }),
                                                          e.jsx("td", {
                                                            className:
                                                              "px-4 py-4",
                                                            children: e.jsx(
                                                              "span",
                                                              {
                                                                className: `${Te} ${ht(s.status)}`,
                                                                children: pt(
                                                                  s.status,
                                                                ),
                                                              },
                                                            ),
                                                          }),
                                                          e.jsx("td", {
                                                            className:
                                                              "px-4 py-4",
                                                            children:
                                                              s.quantity ||
                                                              "--",
                                                          }),
                                                          e.jsx("td", {
                                                            className:
                                                              "px-4 py-4",
                                                            children:
                                                              s.target_market ||
                                                              "--",
                                                          }),
                                                          e.jsx("td", {
                                                            className:
                                                              "px-4 py-4",
                                                            children:
                                                              s.delivery_timeline ||
                                                              s.timeline_days ||
                                                              "--",
                                                          }),
                                                          e.jsx("td", {
                                                            className:
                                                              "px-4 py-4",
                                                            children: e.jsxs(
                                                              X,
                                                              {
                                                                value:
                                                                  s.assigned_agent_id ||
                                                                  "",
                                                                onChange: (n) =>
                                                                  Et(
                                                                    s.id,
                                                                    n.target
                                                                      .value,
                                                                  ),
                                                                children: [
                                                                  e.jsx(
                                                                    "option",
                                                                    {
                                                                      value: "",
                                                                      children:
                                                                        "Unassigned",
                                                                    },
                                                                  ),
                                                                  gt.map((n) =>
                                                                    e.jsxs(
                                                                      "option",
                                                                      {
                                                                        value:
                                                                          n.id,
                                                                        children:
                                                                          [
                                                                            n.name,
                                                                            " (",
                                                                            n.member_id,
                                                                            ")",
                                                                          ],
                                                                      },
                                                                      n.id,
                                                                    ),
                                                                  ),
                                                                ],
                                                              },
                                                            ),
                                                          }),
                                                        ],
                                                      },
                                                      s.id,
                                                    ),
                                                  ),
                                                }),
                                              ],
                                            }),
                                          })
                                        : e.jsx("div", {
                                            className: `text-sm ${k}`,
                                            children: "No open requests.",
                                          }),
                                    ],
                                  }),
                                ],
                              }),
                        ],
                      }),
                    }),
                  }),
                  c === "buyer"
                    ? e.jsx("div", {
                        className: "space-y-4 lg:col-span-4 xl:col-span-4",
                        children: e.jsxs("div", {
                          className: `rounded-[28px] border p-5 ${D}`,
                          children: [
                            e.jsxs("div", {
                              className:
                                "mb-4 flex items-center justify-between",
                              children: [
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("h3", {
                                      className: "font-semibold",
                                      children: "Premium feature",
                                    }),
                                    e.jsx("p", {
                                      className: `text-xs ${k}`,
                                      children: "Smart supplier matching",
                                    }),
                                  ],
                                }),
                                e.jsx(Star, {
                                  className: "h-5 w-5 text-sky-400",
                                }),
                              ],
                            }),
                            b
                              ? null
                              : e.jsxs(e.Fragment, {
                                  children: [
                                    e.jsx("div", {
                                      className:
                                        "rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4 text-sm text-slate-700 dark:text-slate-200",
                                      children:
                                        "Smart supplier matching is a Premium feature.",
                                    }),
                                    e.jsxs(de, {
                                      to: "/pricing",
                                      className:
                                        "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20",
                                      children: [
                                        e.jsx(rs, { className: "h-4 w-4" }),
                                        " Upgrade to unlock",
                                      ],
                                    }),
                                  ],
                                }),
                            b
                              ? e.jsx("div", {
                                  className:
                                    "mt-4 rounded-2xl border border-white/10 p-4",
                                  children: e.jsxs("div", {
                                    className:
                                      "mb-3 flex items-center justify-between",
                                    children: [
                                      e.jsx("span", {
                                        className: "text-sm font-medium",
                                        children: "Smart match",
                                      }),
                                      e.jsxs(L, {
                                        className: "bg-white/5 text-slate-300",
                                        children: [
                                          "GET /api/requirements/",
                                          "{id}",
                                          "/matches",
                                        ],
                                      }),
                                    ],
                                  }),
                                })
                              : null,
                          ],
                        }),
                      })
                    : null,
                  c === "buyer"
                    ? e.jsx(nt, {
                        as: "section",
                        children: e.jsxs("div", {
                          className:
                            "grid gap-4 border-t border-white/10 p-4 lg:grid-cols-12 lg:p-6",
                          children: [
                            e.jsx("div", {
                              className: "lg:col-span-7",
                              children: e.jsxs("div", {
                                className: `rounded-[28px] border p-5 ${D}`,
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "mb-4 flex items-center justify-between gap-3",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx("h3", {
                                            className: "text-lg font-semibold",
                                            children: "My Requests",
                                          }),
                                          e.jsx("p", {
                                            className: `text-sm ${k}`,
                                            children:
                                              "Duplicate, smart match, edit, delete, and manage attachments.",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("button", {
                                        type: "button",
                                        onClick: O,
                                        className:
                                          "inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-white/5",
                                        children: [
                                          e.jsx(Se, { className: "h-4 w-4" }),
                                          " Refresh",
                                        ],
                                      }),
                                    ],
                                  }),
                                  ae.length
                                    ? e.jsx("div", {
                                        className: "grid gap-4",
                                        children: e.jsx(Qt, {
                                          children: ae.map((s) => {
                                            var y, _;
                                            const n = xt[s.id] || [],
                                              m = yt[s.id] || "tech_pack";
                                            return e.jsxs(
                                              It.div,
                                              {
                                                layout: !0,
                                                initial: { opacity: 0, y: 12 },
                                                animate: { opacity: 1, y: 0 },
                                                exit: {
                                                  opacity: 0,
                                                  scale: 0.95,
                                                },
                                                transition: {
                                                  duration: 0.25,
                                                  ease: [0.16, 1, 0.3, 1],
                                                },
                                                className: `rounded-[24px] border p-5 ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                children: [
                                                  re === s.id
                                                    ? e.jsxs("div", {
                                                        className: "space-y-3",
                                                        children: [
                                                          e.jsx(o, {
                                                            label: "Title",
                                                            children: e.jsx(d, {
                                                              value: R.title,
                                                              onChange: (l) =>
                                                                M({
                                                                  ...R,
                                                                  title:
                                                                    l.target
                                                                      .value,
                                                                }),
                                                            }),
                                                          }),
                                                          e.jsx(o, {
                                                            label: "Category",
                                                            children: e.jsx(d, {
                                                              value: R.category,
                                                              onChange: (l) =>
                                                                M({
                                                                  ...R,
                                                                  category:
                                                                    l.target
                                                                      .value,
                                                                }),
                                                            }),
                                                          }),
                                                          e.jsx(o, {
                                                            label: "Quantity",
                                                            children: e.jsx(d, {
                                                              value: R.quantity,
                                                              onChange: (l) =>
                                                                M({
                                                                  ...R,
                                                                  quantity:
                                                                    l.target
                                                                      .value,
                                                                }),
                                                            }),
                                                          }),
                                                          e.jsxs(o, {
                                                            label:
                                                              "Custom description",
                                                            children: [
                                                              e.jsx(te, {
                                                                rows: 4,
                                                                value:
                                                                  R.customDescription,
                                                                onChange: (l) =>
                                                                  M({
                                                                    ...R,
                                                                    customDescription:
                                                                      l.target
                                                                        .value,
                                                                  }),
                                                              }),
                                                              e.jsx(ke, {
                                                                text: R.customDescription,
                                                                limit: (() => {
                                                                  const l =
                                                                    ce();
                                                                  return String(
                                                                    (l == null
                                                                      ? void 0
                                                                      : l.subscription_status) ||
                                                                      "",
                                                                  ).toLowerCase() ===
                                                                    "premium"
                                                                    ? 1500
                                                                    : 600;
                                                                })(),
                                                              }),
                                                            ],
                                                          }),
                                                          e.jsx(o, {
                                                            label:
                                                              "Messaging access",
                                                            hint: "Normal: verified goes to inbox, unverified goes to requests. Verified request only: only verified suppliers can message.",
                                                            children: e.jsxs(
                                                              "div",
                                                              {
                                                                className:
                                                                  "grid grid-cols-1 gap-2 sm:grid-cols-2",
                                                                children: [
                                                                  e.jsx(
                                                                    "button",
                                                                    {
                                                                      type: "button",
                                                                      onClick:
                                                                        () =>
                                                                          M({
                                                                            ...R,
                                                                            verifiedOnly:
                                                                              !1,
                                                                          }),
                                                                      className: `rounded-2xl border p-4 text-left text-sm transition ${R.verifiedOnly ? (p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white") : "border-sky-400 bg-sky-500/10"}`,
                                                                      children:
                                                                        e.jsx(
                                                                          "div",
                                                                          {
                                                                            className:
                                                                              "font-semibold",
                                                                            children:
                                                                              "Normal",
                                                                          },
                                                                        ),
                                                                    },
                                                                  ),
                                                                  e.jsx(
                                                                    "button",
                                                                    {
                                                                      type: "button",
                                                                      onClick:
                                                                        () =>
                                                                          M({
                                                                            ...R,
                                                                            verifiedOnly:
                                                                              !0,
                                                                          }),
                                                                      className: `rounded-2xl border p-4 text-left text-sm transition ${R.verifiedOnly ? "border-sky-400 bg-sky-500/10" : p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                                      children:
                                                                        e.jsx(
                                                                          "div",
                                                                          {
                                                                            className:
                                                                              "font-semibold",
                                                                            children:
                                                                              "Verified request only",
                                                                          },
                                                                        ),
                                                                    },
                                                                  ),
                                                                ],
                                                              },
                                                            ),
                                                          }),
                                                          e.jsxs("div", {
                                                            className:
                                                              "flex gap-2",
                                                            children: [
                                                              e.jsx("button", {
                                                                type: "button",
                                                                disabled: H,
                                                                onClick: Pt,
                                                                className:
                                                                  "rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70",
                                                                children:
                                                                  "Save",
                                                              }),
                                                              e.jsx("button", {
                                                                type: "button",
                                                                onClick: () =>
                                                                  ve(""),
                                                                className:
                                                                  "rounded-2xl border px-4 py-2.5 text-sm font-medium dark:border-white/10 dark:bg-white/5",
                                                                children:
                                                                  "Cancel",
                                                              }),
                                                            ],
                                                          }),
                                                        ],
                                                      })
                                                    : e.jsxs("div", {
                                                        className:
                                                          "flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between",
                                                        children: [
                                                          e.jsxs("div", {
                                                            children: [
                                                              e.jsxs("div", {
                                                                className:
                                                                  "flex flex-wrap items-center gap-2",
                                                                children: [
                                                                  e.jsx("h4", {
                                                                    className:
                                                                      "text-base font-semibold",
                                                                    children:
                                                                      s.title ||
                                                                      s.category ||
                                                                      "Buyer Request",
                                                                  }),
                                                                  e.jsx(
                                                                    "span",
                                                                    {
                                                                      className: `${Te} ${ht(s.status)}`,
                                                                      children:
                                                                        pt(
                                                                          s.status,
                                                                        ),
                                                                    },
                                                                  ),
                                                                ],
                                                              }),
                                                              e.jsxs("div", {
                                                                className: `mt-2 text-sm ${k}`,
                                                                children: [
                                                                  "Qty ",
                                                                  s.quantity ||
                                                                    "--",
                                                                  " - ",
                                                                  s.material ||
                                                                    "--",
                                                                  " - Target ",
                                                                  s.target_market ||
                                                                    "--",
                                                                  " - Delivery ",
                                                                  s.delivery_timeline ||
                                                                    s.timeline_days ||
                                                                    "--",
                                                                ],
                                                              }),
                                                              e.jsxs("div", {
                                                                className:
                                                                  "mt-3 flex flex-wrap gap-2",
                                                                children: [
                                                                  e.jsxs(
                                                                    "button",
                                                                    {
                                                                      type: "button",
                                                                      onClick:
                                                                        () =>
                                                                          Ft(s),
                                                                      className:
                                                                        "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium dark:border-white/10 dark:bg-white/5",
                                                                      children:
                                                                        [
                                                                          e.jsx(
                                                                            lt,
                                                                            {
                                                                              className:
                                                                                "h-3.5 w-3.5",
                                                                            },
                                                                          ),
                                                                          " Duplicate",
                                                                        ],
                                                                    },
                                                                  ),
                                                                  e.jsxs(
                                                                    "button",
                                                                    {
                                                                      type: "button",
                                                                      disabled:
                                                                        !b,
                                                                      onClick:
                                                                        () =>
                                                                          $t(
                                                                            s.id,
                                                                          ),
                                                                      className:
                                                                        "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium dark:border-white/10 dark:bg-white/5 disabled:opacity-60",
                                                                      children:
                                                                        [
                                                                          e.jsx(
                                                                            _e,
                                                                            {
                                                                              className:
                                                                                "h-3.5 w-3.5",
                                                                            },
                                                                          ),
                                                                          " ",
                                                                          fe ===
                                                                          s.id
                                                                            ? e.jsx(
                                                                                ee,
                                                                                {
                                                                                  variant:
                                                                                    "bounce",
                                                                                  color:
                                                                                    "#6100ff",
                                                                                  size: "small",
                                                                                  text: "",
                                                                                  textColor:
                                                                                    "",
                                                                                },
                                                                              )
                                                                            : "Smart match",
                                                                        ],
                                                                    },
                                                                  ),
                                                                  e.jsxs(
                                                                    "button",
                                                                    {
                                                                      type: "button",
                                                                      onClick:
                                                                        () =>
                                                                          Rt(s),
                                                                      className:
                                                                        "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium dark:border-white/10 dark:bg-white/5",
                                                                      children:
                                                                        [
                                                                          e.jsx(
                                                                            as,
                                                                            {
                                                                              className:
                                                                                "h-3.5 w-3.5",
                                                                            },
                                                                          ),
                                                                          " Edit",
                                                                        ],
                                                                    },
                                                                  ),
                                                                  e.jsxs(
                                                                    "button",
                                                                    {
                                                                      type: "button",
                                                                      onClick:
                                                                        () =>
                                                                          At(
                                                                            s.id,
                                                                          ),
                                                                      className:
                                                                        "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium text-rose-500 dark:border-white/10 dark:bg-white/5",
                                                                      children:
                                                                        [
                                                                          e.jsx(
                                                                            ns,
                                                                            {
                                                                              className:
                                                                                "h-3.5 w-3.5",
                                                                            },
                                                                          ),
                                                                          " Delete",
                                                                        ],
                                                                    },
                                                                  ),
                                                                ],
                                                              }),
                                                            ],
                                                          }),
                                                          e.jsxs("div", {
                                                            className: `rounded-2xl border border-white/10 bg-sky-500/10 px-4 py-3 text-sm ${p ? "text-sky-300" : "text-sky-700"}`,
                                                            children: [
                                                              e.jsx("div", {
                                                                className:
                                                                  "font-medium",
                                                                children:
                                                                  "Attachments",
                                                              }),
                                                              e.jsx("div", {
                                                                className: `mt-1 text-xs ${p ? "text-sky-200/80" : "text-sky-600/80"}`,
                                                                children:
                                                                  "Tech pack, sketch, reference image, compliance, other",
                                                              }),
                                                            ],
                                                          }),
                                                        ],
                                                      }),
                                                  b
                                                    ? null
                                                    : e.jsxs("div", {
                                                        className:
                                                          "mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-200",
                                                        children: [
                                                          "Smart supplier matching is a Premium feature.",
                                                          e.jsx("div", {
                                                            className: "mt-2",
                                                            children: e.jsx(
                                                              de,
                                                              {
                                                                to: "/pricing",
                                                                className:
                                                                  "text-xs font-semibold text-sky-400 hover:underline",
                                                                children:
                                                                  "Upgrade to unlock",
                                                              },
                                                            ),
                                                          }),
                                                        ],
                                                      }),
                                                  ze[s.id]
                                                    ? e.jsx("p", {
                                                        className:
                                                          "mt-2 text-xs text-rose-500",
                                                        children: ze[s.id],
                                                      })
                                                    : null,
                                                  b &&
                                                  (((y = ye[s.id]) != null &&
                                                    y.length) ||
                                                    fe === s.id)
                                                    ? e.jsxs("div", {
                                                        className: `mt-4 rounded-[22px] border p-4 ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                        children: [
                                                          e.jsx("p", {
                                                            className:
                                                              "text-xs font-semibold",
                                                            children:
                                                              "Smart matches",
                                                          }),
                                                          e.jsxs("div", {
                                                            className:
                                                              "mt-2 space-y-2",
                                                            children: [
                                                              (ye[s.id] || [])
                                                                .slice(0, 3)
                                                                .map((l) =>
                                                                  e.jsxs(
                                                                    "div",
                                                                    {
                                                                      className: `flex items-center justify-between rounded-2xl border px-3 py-2 text-xs ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                                      children:
                                                                        [
                                                                          e.jsx(
                                                                            "span",
                                                                            {
                                                                              className:
                                                                                "truncate",
                                                                              children:
                                                                                l.name ||
                                                                                l.supplier_name ||
                                                                                l.supplier_id,
                                                                            },
                                                                          ),
                                                                          e.jsx(
                                                                            L,
                                                                            {
                                                                              className:
                                                                                "bg-emerald-500/15 text-emerald-300",
                                                                              children:
                                                                                l.score ||
                                                                                l.match_score ||
                                                                                "--",
                                                                            },
                                                                          ),
                                                                        ],
                                                                    },
                                                                    l.id ||
                                                                      l.supplier_id,
                                                                  ),
                                                                ),
                                                              !(
                                                                (_ =
                                                                  ye[s.id]) !=
                                                                  null &&
                                                                _.length
                                                              ) && fe === s.id
                                                                ? e.jsx("div", {
                                                                    className: `text-xs ${k}`,
                                                                    children:
                                                                      "Finding matches...",
                                                                  })
                                                                : null,
                                                            ],
                                                          }),
                                                        ],
                                                      })
                                                    : null,
                                                  re !== s.id
                                                    ? e.jsx("div", {
                                                        className: "mt-4",
                                                        children: e.jsxs(
                                                          "div",
                                                          {
                                                            className: `rounded-[22px] border p-4 ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                            children: [
                                                              e.jsxs("div", {
                                                                className:
                                                                  "flex items-center justify-between",
                                                                children: [
                                                                  e.jsx("p", {
                                                                    className:
                                                                      "text-xs font-semibold",
                                                                    children:
                                                                      "Attachments",
                                                                  }),
                                                                  e.jsx(
                                                                    "button",
                                                                    {
                                                                      type: "button",
                                                                      onClick:
                                                                        () =>
                                                                          Z(
                                                                            s.id,
                                                                          ),
                                                                      className:
                                                                        "text-xs font-semibold text-sky-400",
                                                                      children:
                                                                        "Refresh",
                                                                    },
                                                                  ),
                                                                ],
                                                              }),
                                                              e.jsx("div", {
                                                                className:
                                                                  "mt-2 space-y-2",
                                                                children:
                                                                  n.length
                                                                    ? n.map(
                                                                        (l) =>
                                                                          e.jsxs(
                                                                            "div",
                                                                            {
                                                                              className: `flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                                              children:
                                                                                [
                                                                                  e.jsxs(
                                                                                    "a",
                                                                                    {
                                                                                      className:
                                                                                        "text-xs font-semibold truncate",
                                                                                      href: ps(
                                                                                        l.file_path,
                                                                                      ),
                                                                                      target:
                                                                                        "_blank",
                                                                                      rel: "noreferrer",
                                                                                      children:
                                                                                        [
                                                                                          l.type ||
                                                                                            "Attachment",
                                                                                          ": ",
                                                                                          l.file_path
                                                                                            ? String(
                                                                                                l.file_path,
                                                                                              )
                                                                                                .split(
                                                                                                  /[\\/]/,
                                                                                                )
                                                                                                .pop()
                                                                                            : "File",
                                                                                        ],
                                                                                    },
                                                                                  ),
                                                                                  e.jsx(
                                                                                    "button",
                                                                                    {
                                                                                      type: "button",
                                                                                      onClick:
                                                                                        () =>
                                                                                          Ct(
                                                                                            l.id,
                                                                                            s.id,
                                                                                          ),
                                                                                      className:
                                                                                        "text-xs font-semibold text-rose-500",
                                                                                      children:
                                                                                        "Remove",
                                                                                    },
                                                                                  ),
                                                                                ],
                                                                            },
                                                                            l.id,
                                                                          ),
                                                                      )
                                                                    : e.jsx(
                                                                        "div",
                                                                        {
                                                                          className:
                                                                            "text-xs text-slate-500",
                                                                          children:
                                                                            "No attachments uploaded yet.",
                                                                        },
                                                                      ),
                                                              }),
                                                              e.jsxs("div", {
                                                                className:
                                                                  "mt-3 flex flex-wrap items-center gap-2",
                                                                children: [
                                                                  e.jsxs(X, {
                                                                    value: m,
                                                                    onChange: (
                                                                      l,
                                                                    ) =>
                                                                      ft(
                                                                        (
                                                                          U,
                                                                        ) => ({
                                                                          ...U,
                                                                          [s.id]:
                                                                            l
                                                                              .target
                                                                              .value,
                                                                        }),
                                                                      ),
                                                                    children: [
                                                                      e.jsx(
                                                                        "option",
                                                                        {
                                                                          value:
                                                                            "tech_pack",
                                                                          children:
                                                                            "Tech pack",
                                                                        },
                                                                      ),
                                                                      e.jsx(
                                                                        "option",
                                                                        {
                                                                          value:
                                                                            "sketch",
                                                                          children:
                                                                            "Sketch",
                                                                        },
                                                                      ),
                                                                      e.jsx(
                                                                        "option",
                                                                        {
                                                                          value:
                                                                            "reference_image",
                                                                          children:
                                                                            "Reference image",
                                                                        },
                                                                      ),
                                                                      e.jsx(
                                                                        "option",
                                                                        {
                                                                          value:
                                                                            "compliance",
                                                                          children:
                                                                            "Compliance",
                                                                        },
                                                                      ),
                                                                      e.jsx(
                                                                        "option",
                                                                        {
                                                                          value:
                                                                            "other",
                                                                          children:
                                                                            "Other",
                                                                        },
                                                                      ),
                                                                    ],
                                                                  }),
                                                                  e.jsxs(
                                                                    "label",
                                                                    {
                                                                      className:
                                                                        "inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white",
                                                                      children:
                                                                        [
                                                                          Ee ===
                                                                          s.id
                                                                            ? e.jsx(
                                                                                ee,
                                                                                {
                                                                                  variant:
                                                                                    "bounce",
                                                                                  color:
                                                                                    "#6100ff",
                                                                                  size: "small",
                                                                                  text: "",
                                                                                  textColor:
                                                                                    "",
                                                                                },
                                                                              )
                                                                            : "Upload file",
                                                                          e.jsx(
                                                                            "input",
                                                                            {
                                                                              type: "file",
                                                                              className:
                                                                                "hidden",
                                                                              onChange:
                                                                                (
                                                                                  l,
                                                                                ) => {
                                                                                  var ne;
                                                                                  const U =
                                                                                    (ne =
                                                                                      l
                                                                                        .target
                                                                                        .files) ==
                                                                                    null
                                                                                      ? void 0
                                                                                      : ne[0];
                                                                                  (U &&
                                                                                    Je(
                                                                                      s.id,
                                                                                      U,
                                                                                      m,
                                                                                    ),
                                                                                    (l.target.value =
                                                                                      ""));
                                                                                },
                                                                            },
                                                                          ),
                                                                        ],
                                                                    },
                                                                  ),
                                                                  Ee === s.id &&
                                                                    e.jsx(Ht, {
                                                                      progress:
                                                                        bt,
                                                                      className:
                                                                        "w-24",
                                                                    }),
                                                                ],
                                                              }),
                                                            ],
                                                          },
                                                        ),
                                                      })
                                                    : null,
                                                ],
                                              },
                                              s.id,
                                            );
                                          }),
                                        }),
                                      })
                                    : e.jsx("div", {
                                        className: `text-sm ${k}`,
                                        children: "No requests yet.",
                                      }),
                                ],
                              }),
                            }),
                            e.jsx("div", {
                              className: "space-y-4 lg:col-span-5",
                              children: e.jsxs("div", {
                                className: `rounded-[28px] border p-5 ${D}`,
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "mb-4 flex items-center justify-between",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx("h3", {
                                            className: "text-lg font-semibold",
                                            children:
                                              "Browse Requests (Summary Only)",
                                          }),
                                          e.jsx("p", {
                                            className: `text-sm ${k}`,
                                            children:
                                              "You can research market demand, but full details remain private.",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("button", {
                                        type: "button",
                                        onClick: V,
                                        className:
                                          "inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-white/5",
                                        children: [
                                          e.jsx(Se, { className: "h-4 w-4" }),
                                          " ",
                                          pe
                                            ? e.jsx(ee, {
                                                variant: "bounce",
                                                color: "#6100ff",
                                                size: "small",
                                                text: "",
                                                textColor: "",
                                              })
                                            : "Refresh",
                                        ],
                                      }),
                                    ],
                                  }),
                                  Fe.length
                                    ? e.jsx("div", {
                                        className: "space-y-3",
                                        children: Fe.filter(
                                          (s) =>
                                            s.buyer_id !==
                                            (t == null ? void 0 : t.id),
                                        )
                                          .slice(0, 12)
                                          .map((s) =>
                                            e.jsxs(
                                              "div",
                                              {
                                                className: `rounded-[22px] border p-4 ${p ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                                                children: [
                                                  e.jsxs("div", {
                                                    className:
                                                      "flex items-center justify-between gap-3",
                                                    children: [
                                                      e.jsx("div", {
                                                        className:
                                                          "font-medium",
                                                        children:
                                                          s.title ||
                                                          s.category ||
                                                          "Buyer Request",
                                                      }),
                                                      e.jsx(L, {
                                                        className: `bg-white/5 ${p ? "text-slate-300" : "text-slate-600"}`,
                                                        children: String(
                                                          s.buyer_id || "",
                                                        ).slice(0, 8),
                                                      }),
                                                    ],
                                                  }),
                                                  e.jsxs("div", {
                                                    className: `mt-2 text-sm ${k}`,
                                                    children: [
                                                      "Qty ",
                                                      s.quantity || "--",
                                                      " - ",
                                                      s.material || "--",
                                                      " - Target ",
                                                      s.target_market || "--",
                                                      " - Delivery ",
                                                      s.delivery_timeline ||
                                                        "--",
                                                    ],
                                                  }),
                                                  e.jsxs(de, {
                                                    to: `/buyer/${encodeURIComponent(s.buyer_id)}`,
                                                    className:
                                                      "mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-400 hover:text-sky-300",
                                                    children: [
                                                      "View Buyer Profile ",
                                                      e.jsx(Ne, {
                                                        className: "h-4 w-4",
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              },
                                              s.id,
                                            ),
                                          ),
                                      })
                                    : e.jsx("div", {
                                        className: `text-sm ${k}`,
                                        children: "No requests to browse yet.",
                                      }),
                                ],
                              }),
                            }),
                          ],
                        }),
                      })
                    : null,
                ],
              }),
            ],
          }),
        }),
      });
}
export { Ls as default };
