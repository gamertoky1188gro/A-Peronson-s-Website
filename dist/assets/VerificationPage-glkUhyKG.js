import {
  b as oe,
  j as e,
  m as ve,
  k as we,
  g as ne,
  o as ke,
  r as c,
  d as R,
  _ as Se,
  N as Ce,
  q as re,
  S as Re,
} from "./index-CNnTWoea.js";
import { U as Me, u as _e } from "./UploadProgressBar-D72lm7cT.js";
function Ie({ char: i, status: l = "empty", delay: n = 0 }) {
  const o = oe(),
    j =
      l === "correct"
        ? "bg-emerald-500 text-white border-emerald-500"
        : l === "present"
          ? "bg-amber-400 text-white border-amber-400"
          : l === "absent"
            ? "bg-slate-500 text-white border-slate-500"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700";
  return o
    ? e.jsx("div", {
        className: `flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-bold ${j}`,
        children: i,
      })
    : e.jsx(ve.div, {
        className: `flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-bold ${j}`,
        initial: { rotateX: 0 },
        animate: { rotateX: 360 },
        transition: { duration: 0.4, delay: n, ease: [0.16, 1, 0.3, 1] },
        style: { transformStyle: "preserve-3d" },
        children: i,
      });
}
function Te({
  value: i = "",
  maxLength: l = 6,
  className: n = "",
  onChange: o,
  onSubmit: j,
  statuses: $ = [],
  placeholder: m = "●",
}) {
  const a = oe(),
    N = i.split("").concat(Array(l - i.length).fill(""));
  i.length;
  function r(w) {
    const p = w.target.value.replace(/\s/g, "").toUpperCase().slice(0, l);
    (o == null || o(p), p.length === l && (j == null || j(p)));
  }
  return e.jsxs("div", {
    className: `flex flex-col items-center gap-4 ${n}`,
    children: [
      e.jsx("div", {
        className: "flex gap-2",
        children: N.map((w, p) =>
          e.jsx(
            Ie,
            { char: w || "", status: $[p] || "empty", delay: a ? 0 : p * 0.08 },
            p,
          ),
        ),
      }),
      e.jsx("input", {
        type: "text",
        value: i,
        onChange: r,
        maxLength: l,
        className:
          "w-full max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-lg font-bold tracking-[0.25em] text-slate-900 outline-none focus:ring-2 focus:ring-sky-400/50 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
        placeholder: m,
        autoComplete: "off",
      }),
    ],
  });
}
const $e = [
    "Austria",
    "Belgium",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
  ],
  Be = [
    "Afghanistan",
    "Åland Islands",
    "Albania",
    "Algeria",
    "American Samoa",
    "AndorrA",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo",
    "Congo, The Democratic Republic of the",
    "Cook Islands",
    "Costa Rica",
    "Cote D'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands (Malvinas)",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and Mcdonald Islands",
    "Holy See (Vatican City State)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran, Islamic Republic Of",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, Democratic People'S Republic of",
    "Korea, Republic of",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People'S Democratic Republic",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libyan Arab Jamahiriya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Macedonia, The Former Yugoslav Republic of",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia, Federated States of",
    "Moldova, Republic of",
    "Monaco",
    "Mongolia",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestinian Territory, Occupied",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russian Federation",
    "RWANDA",
    "Saint Helena",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia and Montenegro",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan, Province of China",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "United States Minor Outlying Islands",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Viet Nam",
    "Virgin Islands, British",
    "Virgin Islands, U.S.",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ],
  Ee = new Set($e.map((i) => i.toLowerCase()));
function Ae(i) {
  return Ee.has(
    String(i || "")
      .trim()
      .toLowerCase(),
  );
}
const h = ({ d: i, className: l = "" }) =>
    e.jsx("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: l,
      children: e.jsx("path", { d: i }),
    }),
  x = {
    shield: "M12 2l7 4v6c0 5-3.5 9.7-7 10-3.5-.3-7-5-7-10V6l7-4z",
    check: "M20 6 9 17l-5-5",
    clock: "M12 8v4l3 2",
    help: "M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3",
    spark: "M13 2l1.5 5.5L20 9l-5.5 1.5L13 16l-1.5-5.5L6 9l5.5-1.5L13 2z",
    card: "M3 8h18v10H3z M3 12h18",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5-5 5 5 M12 5v12",
    refresh: "M20 11a8 8 0 1 0-2.3 5.7 M20 4v7h-7",
    star: "M12 2l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 16.8 6.2 19.8l1.1-6.4L2.6 8.8l6.5-.9L12 2z",
    sun: "M12 3v2 M12 19v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M3 12h2 M19 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4 M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z",
    moon: "M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8z",
    x: "M18 6 6 18 M6 6l12 12",
  },
  ie = {
    company_registration: "Company Registration",
    trade_license: "Trade License",
    tin: "TIN (Tax Identification Number)",
    authorized_person_nid: "Authorized Person NID",
    bank_proof: "Company Bank Proof",
    erc: "ERC (Export Registration Certificate)",
    vat: "VAT Number",
    eori: "EORI (Economic Operators Registration and Identification)",
    ein: "EIN (Employer Identification Number)",
    ior: "IOR (Importer of Record)",
  },
  Ue = {
    factory: [
      "company_registration",
      "trade_license",
      "tin",
      "authorized_person_nid",
      "bank_proof",
      "erc",
    ],
    buying_house: [
      "company_registration",
      "trade_license",
      "tin",
      "authorized_person_nid",
      "bank_proof",
    ],
  },
  le = {
    EU: ["company_registration", "vat", "eori", "bank_proof"],
    USA: ["company_registration", "ein", "ior", "bank_proof"],
    OTHER: ["company_registration", "bank_proof"],
  };
function M(i) {
  const l = String(i || "").trim();
  if (!l) return "OTHER";
  if (Ae(l)) return "EU";
  const n = l.toUpperCase();
  return n === "USA" ||
    n === "US" ||
    n === "UNITED STATES" ||
    n === "UNITED STATES OF AMERICA"
    ? "USA"
    : "OTHER";
}
function Le({ embedded: i = !1 }) {
  var se;
  const l = we(),
    n = ne(),
    o = (l == null ? void 0 : l.role) || "buyer",
    { theme: j, toggleTheme: $ } = ke(),
    m = j === "dark",
    [a, N] = c.useState(null),
    [r, w] = c.useState(""),
    [p, L] = c.useState(""),
    [de, B] = c.useState(0),
    [ce, D] = c.useState(!1),
    [z, f] = c.useState(""),
    [V, g] = c.useState(""),
    [F, G] = c.useState(""),
    [H, q] = c.useState(!1),
    [ue, me] = c.useState(!0),
    K = c.useRef(null),
    Y = c.useRef(""),
    E = c.useMemo(() => (o !== "buyer" ? "" : M(r)), [r, o]),
    k = c.useMemo(
      () => (o === "buyer" ? le[E] || le.OTHER : Ue[o] || []),
      [E, o],
    ),
    v = (a == null ? void 0 : a.documents) || {},
    S = Array.isArray(v.optional_licenses)
      ? v.optional_licenses.filter(Boolean)
      : [],
    J =
      ((se = a == null ? void 0 : a.credibility) == null ? void 0 : se.score) ??
      0,
    A = !!(a != null && a.verified),
    U = (a == null ? void 0 : a.review_status) || (A ? "approved" : "pending"),
    W = (a == null ? void 0 : a.review_reason) || "",
    _ = Number((a == null ? void 0 : a.subscription_remaining_days) || 0),
    Q = c.useMemo(() => {
      const t = S.length * 12;
      return Math.min(100, 12 + t + J);
    }, [S.length, J]),
    P = c.useCallback(async () => {
      var s;
      if (n) {
        (f(""), g(""));
        try {
          const t = await R("/verification/me", { token: n });
          (N(t),
            w(
              String(
                ((s = t == null ? void 0 : t.documents) == null
                  ? void 0
                  : s.buyer_country) || "",
              ),
            ));
        } catch (t) {
          f(t.message || "Could not load verification center data");
        }
      }
    }, [n]);
  (c.useEffect(() => {
    let s = !1,
      t = !1,
      d = !1;
    function b() {
      t && d && !s && me(!1);
    }
    return (
      (async () => {
        try {
          await P();
        } finally {
          ((t = !0), b());
        }
      })(),
      (async () => {
        try {
          await Se(ne());
        } finally {
          ((d = !0), b());
        }
      })(),
      () => {
        s = !0;
      }
    );
  }, [P]),
    c.useEffect(() => {
      var T, ae;
      if (!n || o !== "buyer" || !r) return;
      const s = String(
          ((T = a == null ? void 0 : a.documents) == null
            ? void 0
            : T.buyer_country) || "",
        ),
        t = String(
          ((ae = a == null ? void 0 : a.documents) == null
            ? void 0
            : ae.buyer_region) || "",
        ),
        d = M(r);
      if (s === r && t === d) return;
      const b = setTimeout(async () => {
        try {
          D(!0);
          const te = {
            ...((a == null ? void 0 : a.documents) || {}),
            buyer_country: r,
            buyer_region: d,
          };
          (await R("/verification/me", {
            method: "POST",
            token: n,
            body: { documents: te },
          }),
            N((Ne) => ({ ...(Ne || {}), documents: te })));
        } catch {
          f("Could not save buyer country. Please try again.");
        } finally {
          D(!1);
        }
      }, 350);
      return () => clearTimeout(b);
    }, [r, o, n, a]));
  async function xe(s, t) {
    if (!(!t || !n)) {
      (L(s), g(""), f(""));
      try {
        B(0);
        const d = await _e("/documents", {
            file: t,
            token: n,
            fields: { type: s, entity_type: "verification" },
            onProgress: B,
          }),
          b = {
            ...((a == null ? void 0 : a.documents) || {}),
            [s]: "uploaded",
            ...(o === "buyer" ? { buyer_country: r, buyer_region: M(r) } : {}),
          };
        (await R("/verification/me", {
          method: "POST",
          token: n,
          body: { documents: b },
        }),
          N((T) => ({ ...(T || {}), documents: b })),
          g(`${ie[s] || s} uploaded and verification state updated.`));
      } catch (d) {
        f(d.message || "Upload failed");
      } finally {
        (L(""), B(0));
      }
    }
  }
  function he(s) {
    var t;
    ((Y.current = s), (t = K.current) == null || t.click());
  }
  async function pe(s) {
    var b;
    const t = (b = s.target.files) == null ? void 0 : b[0],
      d = Y.current;
    ((s.target.value = ""), !(!t || !d) && (await xe(d, t)));
  }
  async function be() {
    const s = F.trim();
    if (!(!s || !n)) {
      (G(""), g(""), f(""));
      try {
        const t = {
            ...((a == null ? void 0 : a.documents) || {}),
            optional_licenses: [...S, s],
            ...(o === "buyer" && r
              ? { buyer_country: r, buyer_region: M(r) }
              : {}),
          },
          d = await R("/verification/me", {
            method: "POST",
            token: n,
            body: { documents: t },
          });
        if (d != null && d.error) throw new Error(d.error);
        (N(d), g("Optional license saved."));
      } catch (t) {
        f(t.message || "Could not save optional license");
      }
    }
  }
  async function fe(s) {
    if (n) {
      (g(""), f(""));
      try {
        const t = {
            ...((a == null ? void 0 : a.documents) || {}),
            optional_licenses: S.filter((b) => b !== s),
            ...(o === "buyer" ? { buyer_country: r, buyer_region: M(r) } : {}),
          },
          d = await R("/verification/me", {
            method: "POST",
            token: n,
            body: { documents: t },
          });
        (N(d), g("Optional license removed."));
      } catch (t) {
        f(t.message || "Could not remove optional license");
      }
    }
  }
  async function ge() {
    if (n) {
      (f(""), g(""), q(!0));
      try {
        const s = await R("/verification/renew", { method: "POST", token: n });
        s != null && s.verification && N(s.verification);
        const t = Number((s == null ? void 0 : s.price_usd) || 0);
        g(`Verification subscription updated. Charged $${t.toFixed(2)}.`);
      } catch (s) {
        f(s.message || "Verification payment failed");
      } finally {
        q(!1);
      }
    }
  }
  const ye = m
      ? "bg-slate-950 text-slate-100"
      : "bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-900",
    y = m
      ? "bg-white/5 border-white/10 shadow-[0_20px_80px_rgba(2,8,23,0.55)]"
      : "bg-white/80 border-slate-200 shadow-[0_20px_70px_rgba(14,165,233,0.12)] backdrop-blur",
    u = m ? "text-slate-300" : "text-slate-600",
    C = m ? "text-slate-400" : "text-slate-500",
    X = m
      ? "bg-slate-900/80 border-white/10 text-slate-100"
      : "bg-white border-slate-200 text-slate-900",
    I = m
      ? "bg-sky-500/10 text-sky-200 border-sky-400/20"
      : "bg-sky-50 text-sky-700 border-sky-200",
    Z =
      "bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/35 hover:-translate-y-0.5",
    O = m
      ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-100"
      : "bg-white hover:bg-sky-50 border-slate-200 text-slate-900",
    je = k.map((s) => ({
      title: ie[s] || s,
      desc: v != null && v[s] ? "Submitted" : "Missing",
      done: !!(v != null && v[s]),
    }));
  if (ue) return i ? null : e.jsx(Ce, { fill: !0 });
  const ee = e.jsxs(e.Fragment, {
    children: [
      e.jsxs("header", {
        className: `mb-6 flex items-center justify-between rounded-3xl border px-4 py-4 ${y}`,
        children: [
          e.jsxs("div", {
            className: "flex items-center gap-3",
            children: [
              e.jsx("div", {
                className:
                  "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/25",
                children: e.jsx(h, { d: x.shield, className: "h-6 w-6" }),
              }),
              e.jsxs("div", {
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      e.jsx("h1", {
                        className:
                          "text-xl font-semibold tracking-tight sm:text-2xl",
                        children: "Verification Center",
                      }),
                      e.jsx("span", {
                        className: `rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${I}`,
                        children: U,
                      }),
                    ],
                  }),
                  e.jsx("p", {
                    className: `mt-1 text-sm ${u}`,
                    children:
                      "Verification is subscription-based and renews monthly. First month: $1.99 • Renewals: $6.99/month",
                  }),
                ],
              }),
            ],
          }),
          !i &&
            e.jsxs("button", {
              onClick: $,
              className: `inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition-all ${O}`,
              children: [
                e.jsx(h, { d: m ? x.sun : x.moon, className: "h-4 w-4" }),
                m ? "Light" : "Dark",
              ],
            }),
        ],
      }),
      V &&
        e.jsx("div", {
          className:
            "mb-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-3 text-emerald-200",
          children: V,
        }),
      z &&
        e.jsx("div", {
          className:
            "mb-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 px-4 py-3 text-rose-300",
          children: z,
        }),
      e.jsxs("main", {
        className: "grid flex-1 gap-6 lg:grid-cols-[1.25fr_0.75fr]",
        children: [
          e.jsxs("section", {
            className: "space-y-6",
            children: [
              e.jsx("div", {
                className: `rounded-[28px] border p-6 sm:p-8 ${y}`,
                children: e.jsxs("div", {
                  className:
                    "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
                  children: [
                    e.jsxs("div", {
                      children: [
                        e.jsxs("div", {
                          className: `mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${I}`,
                          children: [
                            e.jsx(h, { d: x.spark, className: "h-3.5 w-3.5" }),
                            "Review status: ",
                            U,
                            W && ` • ${W}`,
                          ],
                        }),
                        e.jsx("h2", {
                          className:
                            "text-3xl font-semibold tracking-tight sm:text-4xl",
                          children: "Build trust with verified proof",
                        }),
                        e.jsx("p", {
                          className: `mt-4 max-w-2xl text-base leading-7 ${u}`,
                          children:
                            "Upload the right documents for your role, add optional licenses, and strengthen credibility for buyers and partners.",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: `min-w-[240px] rounded-3xl border p-5 ${m ? "bg-slate-900/70 border-white/10" : "bg-sky-50/70 border-sky-100"}`,
                      children: [
                        e.jsxs("div", {
                          className: `flex items-center justify-between text-sm ${C}`,
                          children: [
                            e.jsx("span", { children: "Credibility" }),
                            e.jsxs("span", { children: [Q, "/100"] }),
                          ],
                        }),
                        e.jsx("div", {
                          className:
                            "mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-slate-800",
                          children: e.jsx("div", {
                            className:
                              "h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 transition-all duration-500",
                            style: { width: `${Q}%` },
                          }),
                        }),
                        e.jsxs("div", {
                          className: "mt-4 flex items-center justify-between",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx("div", {
                                  className: "text-sm font-semibold",
                                  children: "Basic credibility",
                                }),
                                e.jsx("div", {
                                  className: `mt-1 text-xs ${C}`,
                                  children:
                                    "More licensing proof increases credibility and international trust.",
                                }),
                              ],
                            }),
                            e.jsx(h, {
                              d: x.star,
                              className: "h-7 w-7 text-sky-400",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              o === "buyer" &&
                e.jsxs("div", {
                  className: `rounded-[28px] border p-6 sm:p-8 ${y}`,
                  children: [
                    e.jsxs("div", {
                      className:
                        "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", {
                              className: "text-xl font-semibold",
                              children: "Buyer region",
                            }),
                            e.jsx("p", {
                              className: `mt-1 text-sm ${u}`,
                              children:
                                "Select your country to determine required documents.",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className:
                            "flex items-center gap-2 text-sm text-sky-500",
                          children: [
                            e.jsx(h, { d: x.help, className: "h-4 w-4" }),
                            "Region: ",
                            E,
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "mt-5 flex flex-col gap-3 sm:flex-row",
                      children: [
                        e.jsxs("select", {
                          value: r,
                          onChange: (s) => w(s.target.value),
                          className: `w-full rounded-2xl border px-4 py-3 outline-none ring-0 transition ${X}`,
                          children: [
                            e.jsx("option", {
                              value: "",
                              children: "Select country",
                            }),
                            Be.map((s) =>
                              e.jsx("option", { value: s, children: s }, s),
                            ),
                          ],
                        }),
                        ce &&
                          e.jsx("span", {
                            className: "flex items-center",
                            children: e.jsx(re, {
                              variant: "bounce",
                              color: "#6100ff",
                              size: "small",
                              text: "",
                              textColor: "",
                            }),
                          }),
                      ],
                    }),
                    e.jsxs("p", {
                      className: `mt-3 text-sm ${u}`,
                      children: [
                        "EU buyers need:",
                        " ",
                        e.jsx("span", {
                          className: "font-semibold",
                          children:
                            "Business Registration + VAT Number + EORI + Bank proof",
                        }),
                        ". USA buyers need:",
                        " ",
                        e.jsx("span", {
                          className: "font-semibold",
                          children:
                            "Business Registration + EIN + IOR + Bank proof",
                        }),
                        ".",
                      ],
                    }),
                    !r &&
                      e.jsx("p", {
                        className: "mt-3 text-sm text-rose-400",
                        children:
                          "Buyer country is required before completing buyer verification.",
                      }),
                  ],
                }),
              e.jsx(Re, {
                as: "section",
                children: e.jsxs("div", {
                  className: `rounded-[28px] border p-6 sm:p-8 ${y}`,
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between gap-4",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", {
                              className: "text-xl font-semibold",
                              children: "Your requirements",
                            }),
                            e.jsx("p", {
                              className: `mt-1 text-sm ${u}`,
                              children:
                                "Role-based checklist. Uploading more proof increases credibility.",
                            }),
                          ],
                        }),
                        e.jsx("span", {
                          className: `rounded-full border px-3 py-1 text-sm ${I}`,
                          children: A ? "Verified" : "Not verified",
                        }),
                      ],
                    }),
                    e.jsx("div", {
                      className: "mt-6 grid gap-4 md:grid-cols-3",
                      children: je.map((s, t) =>
                        e.jsxs(
                          "div",
                          {
                            className: `rounded-3xl border p-5 ${m ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`,
                            children: [
                              e.jsxs("div", {
                                className: "flex items-start gap-3",
                                children: [
                                  e.jsx("div", {
                                    className: `mt-0.5 grid h-10 w-10 place-items-center rounded-2xl ${s.done ? "bg-emerald-500/15 text-emerald-300" : "bg-sky-500/10 text-sky-500"}`,
                                    children: e.jsx(h, {
                                      d: s.done ? x.check : x.clock,
                                      className: "h-5 w-5",
                                    }),
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("h4", {
                                        className: "font-semibold",
                                        children: s.title,
                                      }),
                                      e.jsx("p", {
                                        className: `mt-1 text-sm leading-6 ${u}`,
                                        children: s.desc,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx("button", {
                                onClick: () => he(k[t]),
                                disabled: p === k[t] || (o === "buyer" && !r),
                                className: `mt-4 w-full rounded-2xl border px-3 py-2 text-sm font-medium transition-all ${p === k[t] || (o === "buyer" && !r) ? "opacity-50 cursor-not-allowed border-white/10" : O}`,
                                children:
                                  p === k[t]
                                    ? e.jsx(re, {
                                        variant: "bounce",
                                        color: "#6100ff",
                                        size: "small",
                                        text: "",
                                        textColor: "",
                                      })
                                    : "Upload",
                              }),
                              p === k[t] &&
                                e.jsx(Me, { progress: de, className: "mt-2" }),
                            ],
                          },
                          t,
                        ),
                      ),
                    }),
                  ],
                }),
              }),
              e.jsxs("div", {
                className: `rounded-[28px] border p-6 sm:p-8 ${y}`,
                children: [
                  e.jsxs("div", {
                    className:
                      "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsx("h3", {
                            className: "text-xl font-semibold",
                            children: "Optional licenses",
                          }),
                          e.jsx("p", {
                            className: `mt-1 text-sm ${u}`,
                            children:
                              "Optional proofs can be added anytime. More proof = more trust.",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: `flex items-center gap-2 text-sm ${u}`,
                        children: [
                          e.jsx(h, {
                            d: x.help,
                            className: "h-4 w-4 text-sky-400",
                          }),
                          "e.g. OEKO-TEX, BSCI, WRAP...",
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "mt-5 flex flex-col gap-3 sm:flex-row",
                    children: [
                      e.jsx("input", {
                        value: F,
                        onChange: (s) => G(s.target.value),
                        placeholder: "Add a license or certification",
                        className: `w-full rounded-2xl border px-4 py-3 outline-none ring-0 transition placeholder:text-slate-400 focus:border-sky-400 ${X}`,
                      }),
                      e.jsx("button", {
                        onClick: be,
                        className: `rounded-2xl px-5 py-3 font-semibold transition-all ${Z}`,
                        children: "Add",
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className:
                      "mt-5 min-h-[92px] rounded-3xl border border-dashed border-sky-400/30 bg-sky-500/5 p-4",
                    children: S.length
                      ? e.jsx("div", {
                          className: "flex flex-wrap gap-2",
                          children: S.map((s) =>
                            e.jsxs(
                              "button",
                              {
                                onClick: () => fe(s),
                                className: `rounded-full border px-3 py-2 text-sm ${I}`,
                                children: [
                                  s,
                                  e.jsx(h, {
                                    d: x.x,
                                    className: "ml-2 inline h-3 w-3",
                                  }),
                                ],
                              },
                              s,
                            ),
                          ),
                        })
                      : e.jsx("div", {
                          className: `flex h-full items-center justify-center text-sm ${C}`,
                          children: "No optional licenses yet.",
                        }),
                  }),
                ],
              }),
              e.jsxs("div", {
                className: `rounded-[28px] border p-6 sm:p-8 ${y}`,
                children: [
                  e.jsx("div", {
                    className:
                      "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
                    children: e.jsxs("div", {
                      children: [
                        e.jsx("h3", {
                          className: "text-xl font-semibold",
                          children: "Verification code",
                        }),
                        e.jsx("p", {
                          className: `mt-1 text-sm ${u}`,
                          children:
                            "Enter the 6-digit code sent to your email on file.",
                        }),
                      ],
                    }),
                  }),
                  e.jsx("div", {
                    className: "mt-5",
                    children: e.jsx(Te, {
                      maxLength: 6,
                      onChange: (s) => {
                        s.length === 6 &&
                          g("Code accepted. Verification in progress.");
                      },
                      placeholder: "●",
                    }),
                  }),
                ],
              }),
            ],
          }),
          e.jsxs("aside", {
            className: "space-y-6",
            children: [
              e.jsxs("div", {
                className: `rounded-[28px] border p-6 ${y}`,
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      e.jsx("div", {
                        className:
                          "grid h-11 w-11 place-items-center rounded-2xl bg-sky-500/10 text-sky-500",
                        children: e.jsx(h, { d: x.card, className: "h-5 w-5" }),
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("h3", {
                            className: "font-semibold",
                            children: "Subscription",
                          }),
                          e.jsx("p", {
                            className: `text-sm ${C}`,
                            children:
                              "Verification approval requires an active verification subscription.",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: `mt-5 rounded-3xl border p-5 ${m ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white"}`,
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center justify-between text-sm",
                        children: [
                          e.jsx("span", { className: u, children: "Status" }),
                          e.jsx("span", {
                            className:
                              "rounded-full bg-rose-500/10 px-3 py-1 font-semibold text-rose-400",
                            children: _ > 0 ? "Active" : "Inactive",
                          }),
                        ],
                      }),
                      e.jsx("div", {
                        className: `mt-3 text-sm leading-6 ${u}`,
                        children:
                          "Activate your verification plan to unlock review eligibility and progress toward approval.",
                      }),
                      _ > 0 &&
                        e.jsxs("p", {
                          className: `mt-3 text-xs ${C}`,
                          children: [
                            "Remaining: ",
                            _,
                            " day",
                            _ === 1 ? "" : "s",
                          ],
                        }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "mt-4 grid gap-3",
                    children: [
                      e.jsxs("button", {
                        onClick: ge,
                        disabled: H,
                        className: `inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all ${Z}`,
                        children: [
                          e.jsx(h, { d: x.refresh, className: "h-4 w-4" }),
                          H ? "Processing..." : "Pay / Renew Verification",
                        ],
                      }),
                      e.jsxs("button", {
                        onClick: P,
                        className: `inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 font-semibold transition-all ${O}`,
                        children: [
                          e.jsx(h, { d: x.refresh, className: "h-4 w-4" }),
                          "Refresh status",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: `rounded-[28px] border p-6 ${y}`,
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      e.jsx("div", {
                        className:
                          "grid h-11 w-11 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-500",
                        children: e.jsx(h, { d: x.help, className: "h-5 w-5" }),
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("h3", {
                            className: "font-semibold",
                            children: "Need help?",
                          }),
                          e.jsx("p", {
                            className: `text-sm ${C}`,
                            children: "Visit the Help Center.",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className: `mt-5 rounded-3xl border p-5 ${m ? "border-white/10 bg-white/5" : "border-slate-200 bg-sky-50/60"}`,
                    children: e.jsxs("div", {
                      className: "flex items-start gap-3",
                      children: [
                        e.jsx(h, {
                          d: x.upload,
                          className: "mt-0.5 h-5 w-5 text-sky-400",
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("p", {
                              className: "text-sm font-semibold",
                              children: "Upload stronger proof",
                            }),
                            e.jsx("p", {
                              className: `mt-1 text-sm leading-6 ${u}`,
                              children:
                                "Higher-quality documents and licenses can improve review confidence and credibility.",
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                ],
              }),
              e.jsxs("div", {
                className: `rounded-[28px] border p-6 ${y}`,
                children: [
                  e.jsx("h3", {
                    className: "font-semibold",
                    children: "Overview",
                  }),
                  e.jsxs("div", {
                    className: "mt-4 space-y-3 text-sm",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          e.jsx("span", {
                            className: u,
                            children: "First month",
                          }),
                          e.jsx("span", {
                            className: "font-semibold",
                            children: "$1.99",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          e.jsx("span", { className: u, children: "Renewals" }),
                          e.jsx("span", {
                            className: "font-semibold",
                            children: "$6.99/month",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          e.jsx("span", {
                            className: u,
                            children: "Review status",
                          }),
                          e.jsx("span", {
                            className: "font-semibold text-amber-400",
                            children: U,
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          e.jsx("span", {
                            className: u,
                            children: "Verification",
                          }),
                          e.jsx("span", {
                            className: "font-semibold text-rose-400",
                            children: A ? "Verified" : "Not verified",
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
      }),
      e.jsx("input", {
        ref: K,
        type: "file",
        className: "hidden",
        onChange: pe,
      }),
    ],
  });
  return i
    ? ee
    : e.jsxs("div", {
        className: `min-h-screen ${ye} transition-colors duration-300`,
        children: [
          e.jsxs("div", {
            className: "absolute inset-0 overflow-hidden pointer-events-none",
            children: [
              e.jsx("div", {
                className:
                  "absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl",
              }),
              e.jsx("div", {
                className:
                  "absolute top-1/3 right-[-5rem] h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl",
              }),
              e.jsx("div", {
                className:
                  "absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl",
              }),
            ],
          }),
          e.jsx("div", {
            className:
              "relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8",
            children: ee,
          }),
        ],
      });
}
export { Le as default };
