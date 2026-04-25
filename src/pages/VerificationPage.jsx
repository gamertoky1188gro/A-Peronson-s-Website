/*
  Routes: /verification and /verification-center
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Let users upload required verification documents based on role + buyer region.
    - Show verification status per document (submitted, missing, etc.).
    - Enforce subscription rules (verification is subscription-based and renewed).

  Key API endpoints:
    - GET /api/verification/me
    - POST /api/verification/me  (update documents + upload references)
    - GET /api/subscriptions/me

  Notes:
    - Buyer required documents vary by region (EU/USA/OTHER), derived from country.
*/
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { API_BASE, apiRequest, getCurrentUser, getToken } from "../lib/auth";
import {
  BUYER_COUNTRY_OPTIONS,
  EU_COUNTRIES,
  isEuCountry,
} from "../../shared/config/geo.js";

const Icon = ({ d, className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const icons = {
  shield: "M12 2l7 4v6c0 5-3.5 9.7-7 10-3.5-.3-7-5-7-10V6l7-4z",
  check: "M20 6 9 17l-5-5",
  clock: "M12 8v4l3 2",
  help: "M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3",
  spark: "M13 2l1.5 5.5L20 9l-5.5 1.5L13 16l-1.5-5.5L6 9l5.5-1.5L13 2z",
  lock: "M7 11V8a5 5 0 0 1 10 0v3",
  card: "M3 8h18v10H3z M3 12h18",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5-5 5 5 M12 5v12",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7 M20 4v7h-7",
  star: "M12 2l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 16.8 6.2 19.8l1.1-6.4L2.6 8.8l6.5-.9L12 2z",
  sun: "M12 3v2 M12 19v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M3 12h2 M19 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4 M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z",
  moon: "M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8z",
  x: "M18 6 6 18 M6 6l12 12",
  plus: "M12 5v14 M5 12h14",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

const LABELS = {
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
};

const REQUIRED_BY_ROLE = {
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
};

const REQUIRED_BUYER_BY_REGION = {
  EU: ["company_registration", "vat", "eori", "bank_proof"],
  USA: ["company_registration", "ein", "ior", "bank_proof"],
  OTHER: ["company_registration", "bank_proof"],
};

function normalizeBuyerRegionFromCountry(country) {
  const value = String(country || "").trim();
  if (!value) return "OTHER";
  if (isEuCountry(value)) return "EU";
  const upper = value.toUpperCase();
  if (
    upper === "USA" ||
    upper === "US" ||
    upper === "UNITED STATES" ||
    upper === "UNITED STATES OF AMERICA"
  )
    return "USA";
  return "OTHER";
}

export default function VerificationPage() {
  const user = getCurrentUser();
  const token = getToken();
  const role = user?.role || "buyer";

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
      if (document.documentElement.classList.contains("dark")) return "dark";
    }
    return "dark";
  });
  const [verification, setVerification] = useState(null);
  const [buyerCountry, setBuyerCountry] = useState("");
  const [busyDoc, setBusyDoc] = useState("");
  const [savingCountry, setSavingCountry] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [optionalLicenseInput, setOptionalLicenseInput] = useState("");
  const [renewing, setRenewing] = useState(false);

  const fileInputRef = useRef(null);
  const pendingDocRef = useRef("");

  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem("theme");
      if (saved && saved !== theme) {
        setTheme(saved);
      }
    };
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(() => {
      const saved = localStorage.getItem("theme");
      if (saved && saved !== theme) {
        setTheme(saved);
      }
    }, 500);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [theme]);

  const buyerRegion = useMemo(() => {
    if (role !== "buyer") return "";
    return normalizeBuyerRegionFromCountry(buyerCountry);
  }, [buyerCountry, role]);

  const requiredDocs = useMemo(() => {
    if (role === "buyer")
      return (
        REQUIRED_BUYER_BY_REGION[buyerRegion] || REQUIRED_BUYER_BY_REGION.OTHER
      );
    return REQUIRED_BY_ROLE[role] || [];
  }, [buyerRegion, role]);

  const documents = verification?.documents || {};
  const optionalLicenses = Array.isArray(documents.optional_licenses)
    ? documents.optional_licenses.filter(Boolean)
    : [];

  const credibilityScore = verification?.credibility?.score ?? 0;
  const verified = Boolean(verification?.verified);
  const reviewStatus =
    verification?.review_status || (verified ? "approved" : "pending");
  const reviewReason = verification?.review_reason || "";
  const remainingDays = Number(verification?.subscription_remaining_days || 0);

  const credibility = useMemo(() => {
    const base = 12;
    const bonus = optionalLicenses.length * 12;
    return Math.min(100, base + bonus + credibilityScore);
  }, [optionalLicenses.length, credibilityScore]);

  const loadStatus = useCallback(async () => {
    if (!token) return;
    setError("");
    setFeedback("");
    try {
      const verificationData = await apiRequest("/verification/me", { token });
      setVerification(verificationData);
      setBuyerCountry(String(verificationData?.documents?.buyer_country || ""));
    } catch (err) {
      setError(err.message || "Could not load verification center data");
    }
  }, [token]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    if (!token || role !== "buyer") return;
    if (!buyerCountry) return;

    const currentCountry = String(verification?.documents?.buyer_country || "");
    const currentRegion = String(verification?.documents?.buyer_region || "");
    const nextRegion = normalizeBuyerRegionFromCountry(buyerCountry);
    if (currentCountry === buyerCountry && currentRegion === nextRegion) return;

    const timeoutId = setTimeout(async () => {
      try {
        setSavingCountry(true);
        const updatedDocs = {
          ...(verification?.documents || {}),
          buyer_country: buyerCountry,
          buyer_region: nextRegion,
        };
        await apiRequest("/verification/me", {
          method: "POST",
          token,
          body: { documents: updatedDocs },
        });
        setVerification((prev) => ({
          ...(prev || {}),
          documents: updatedDocs,
        }));
      } catch {
        setError("Could not save buyer country. Please try again.");
      } finally {
        setSavingCountry(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [buyerCountry, role, token, verification]);

  async function requestUpload(documentKey, file) {
    if (!file || !token) return;
    setBusyDoc(documentKey);
    setFeedback("");
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", documentKey);
      form.append("entity_type", "verification");

      const uploadRes = await fetch(`${API_BASE}/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const uploadData = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok)
        throw new Error(uploadData.error || "Document upload failed");

      const updatedDocs = {
        ...(verification?.documents || {}),
        [documentKey]: "uploaded",
        ...(role === "buyer"
          ? {
              buyer_country: buyerCountry,
              buyer_region: normalizeBuyerRegionFromCountry(buyerCountry),
            }
          : {}),
      };

      await apiRequest("/verification/me", {
        method: "POST",
        token,
        body: { documents: updatedDocs },
      });
      setVerification((prev) => ({ ...(prev || {}), documents: updatedDocs }));
      setFeedback(
        `${LABELS[documentKey] || documentKey} uploaded and verification state updated.`,
      );
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setBusyDoc("");
    }
  }

  function openPicker(documentKey) {
    pendingDocRef.current = documentKey;
    fileInputRef.current?.click();
  }

  async function onFileSelected(event) {
    const file = event.target.files?.[0];
    const documentKey = pendingDocRef.current;
    event.target.value = "";
    if (!file || !documentKey) return;
    await requestUpload(documentKey, file);
  }

  async function addOptionalLicense() {
    const nextValue = optionalLicenseInput.trim();
    if (!nextValue || !token) return;
    setOptionalLicenseInput("");
    setFeedback("");
    setError("");
    try {
      const updatedDocs = {
        ...(verification?.documents || {}),
        optional_licenses: [...optionalLicenses, nextValue],
        ...(role === "buyer"
          ? {
              buyer_country: buyerCountry,
              buyer_region: normalizeBuyerRegionFromCountry(buyerCountry),
            }
          : {}),
      };
      const updated = await apiRequest("/verification/me", {
        method: "POST",
        token,
        body: { documents: updatedDocs },
      });
      setVerification(updated);
      setFeedback("Optional license saved.");
    } catch (err) {
      setError(err.message || "Could not save optional license");
    }
  }

  async function removeOptionalLicense(value) {
    if (!token) return;
    setFeedback("");
    setError("");
    try {
      const updatedDocs = {
        ...(verification?.documents || {}),
        optional_licenses: optionalLicenses.filter((x) => x !== value),
        ...(role === "buyer"
          ? {
              buyer_country: buyerCountry,
              buyer_region: normalizeBuyerRegionFromCountry(buyerCountry),
            }
          : {}),
      };
      const updated = await apiRequest("/verification/me", {
        method: "POST",
        token,
        body: { documents: updatedDocs },
      });
      setVerification(updated);
      setFeedback("Optional license removed.");
    } catch (err) {
      setError(err.message || "Could not remove optional license");
    }
  }

  async function handleRenewVerification() {
    if (!token) return;
    setError("");
    setFeedback("");
    setRenewing(true);
    try {
      const res = await apiRequest("/verification/renew", {
        method: "POST",
        token,
      });
      if (res?.verification) setVerification(res.verification);
      const price = Number(res?.price_usd || 0);
      setFeedback(
        `Verification subscription updated. Charged $${price.toFixed(2)}.`,
      );
    } catch (err) {
      setError(err.message || "Verification payment failed");
    } finally {
      setRenewing(false);
    }
  }

  const pageBg = isDark
    ? "bg-slate-950 text-slate-100"
    : "bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-900";

  const cardBg = isDark
    ? "bg-white/5 border-white/10 shadow-[0_20px_80px_rgba(2,8,23,0.55)]"
    : "bg-white/80 border-slate-200 shadow-[0_20px_70px_rgba(14,165,233,0.12)] backdrop-blur";

  const softText = isDark ? "text-slate-300" : "text-slate-600";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const fieldBg = isDark ? "bg-slate-900/80 border-white/10 text-slate-100" : "bg-white border-slate-200 text-slate-900";
  const chipBg = isDark ? "bg-sky-500/10 text-sky-200 border-sky-400/20" : "bg-sky-50 text-sky-700 border-sky-200";
  const buttonPrimary = "bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/35 hover:-translate-y-0.5";
  const buttonGhost = isDark
    ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-100"
    : "bg-white hover:bg-sky-50 border-slate-200 text-slate-900";

  const requirements = requiredDocs.map((key) => ({
    title: LABELS[key] || key,
    desc: documents?.[key] ? "Submitted" : "Missing",
    done: Boolean(documents?.[key]),
  }));

  return (
    <div className={`min-h-screen ${pageBg} transition-colors duration-300`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute top-1/3 right-[-5rem] h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className={`mb-6 flex items-center justify-between rounded-3xl border px-4 py-4 ${cardBg}`}>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/25">
              <Icon d={icons.shield} className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Verification Center</h1>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${chipBg}`}>
                  {reviewStatus}
                </span>
              </div>
              <p className={`mt-1 text-sm ${softText}`}>Verification is subscription-based and renews monthly. First month: $1.99 • Renewals: $6.99/month</p>
            </div>
          </div>

          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition-all ${buttonGhost}`}
          >
            <Icon d={isDark ? icons.sun : icons.moon} className="h-4 w-4" />
            {isDark ? "Light" : "Dark"}
          </button>
        </header>

        {feedback && (
          <div className="mb-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-3 text-emerald-200">
            {feedback}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 px-4 py-3 text-rose-300">
            {error}
          </div>
        )}

        <main className="grid flex-1 gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="space-y-6">
            <div className={`rounded-[28px] border p-6 sm:p-8 ${cardBg}`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${chipBg}`}>
                    <Icon d={icons.spark} className="h-3.5 w-3.5" />
                    Review status: {reviewStatus}
                    {reviewReason && ` • ${reviewReason}`}
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Build trust with verified proof</h2>
                  <p className={`mt-4 max-w-2xl text-base leading-7 ${softText}`}>
                    Upload the right documents for your role, add optional licenses, and strengthen credibility for buyers and partners.
                  </p>
                </div>

                <div className={`min-w-[240px] rounded-3xl border p-5 ${isDark ? "bg-slate-900/70 border-white/10" : "bg-sky-50/70 border-sky-100"}`}>
                  <div className={`flex items-center justify-between text-sm ${mutedText}`}>
                    <span>Credibility</span>
                    <span>{credibility}/100</span>
                  </div>
                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${credibility}%` }}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Basic credibility</div>
                      <div className={`mt-1 text-xs ${mutedText}`}>More licensing proof increases credibility and international trust.</div>
                    </div>
                    <Icon d={icons.star} className="h-7 w-7 text-sky-400" />
                  </div>
                </div>
              </div>
            </div>

            {role === "buyer" && (
              <div className={`rounded-[28px] border p-6 sm:p-8 ${cardBg}`}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Buyer region</h3>
                    <p className={`mt-1 text-sm ${softText}`}>Select your country to determine required documents.</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-sky-500">
                    <Icon d={icons.help} className="h-4 w-4" />
                    Region: {buyerRegion}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <select
                    value={buyerCountry}
                    onChange={(e) => setBuyerCountry(e.target.value)}
                    className={`w-full rounded-2xl border px-4 py-3 outline-none ring-0 transition ${fieldBg}`}
                  >
                    <option value="">Select country</option>
                    {BUYER_COUNTRY_OPTIONS.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  {savingCountry && (
                    <span className={`flex items-center text-sm ${mutedText}`}>Saving...</span>
                  )}
                </div>

                <p className={`mt-3 text-sm ${softText}`}>
                  EU buyers need:{" "}
                  <span className="font-semibold">Business Registration + VAT Number + EORI + Bank proof</span>
                  . USA buyers need:{" "}
                  <span className="font-semibold">Business Registration + EIN + IOR + Bank proof</span>
                  .
                </p>

                {!buyerCountry && (
                  <p className="mt-3 text-sm text-rose-400">Buyer country is required before completing buyer verification.</p>
                )}
              </div>
            )}

            <div className={`rounded-[28px] border p-6 sm:p-8 ${cardBg}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Your requirements</h3>
                  <p className={`mt-1 text-sm ${softText}`}>Role-based checklist. Uploading more proof increases credibility.</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-sm ${chipBg}`}>
                  {verified ? "Verified" : "Not verified"}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {requirements.map((item, idx) => (
                  <div key={idx} className={`rounded-3xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 grid h-10 w-10 place-items-center rounded-2xl ${item.done ? "bg-emerald-500/15 text-emerald-300" : "bg-sky-500/10 text-sky-500"}`}>
                        <Icon d={item.done ? icons.check : icons.clock} className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className={`mt-1 text-sm leading-6 ${softText}`}>{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => openPicker(requiredDocs[idx])}
                      disabled={busyDoc === requiredDocs[idx] || (role === "buyer" && !buyerCountry)}
                      className={`mt-4 w-full rounded-2xl border px-3 py-2 text-sm font-medium transition-all ${
                        busyDoc === requiredDocs[idx] || (role === "buyer" && !buyerCountry)
                          ? "opacity-50 cursor-not-allowed border-white/10"
                          : buttonGhost
                      }`}
                    >
                      {busyDoc === requiredDocs[idx] ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-[28px] border p-6 sm:p-8 ${cardBg}`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Optional licenses</h3>
                  <p className={`mt-1 text-sm ${softText}`}>Optional proofs can be added anytime. More proof = more trust.</p>
                </div>
                <div className={`flex items-center gap-2 text-sm ${softText}`}>
                  <Icon d={icons.help} className="h-4 w-4 text-sky-400" />
                  e.g. OEKO-TEX, BSCI, WRAP...
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  value={optionalLicenseInput}
                  onChange={(e) => setOptionalLicenseInput(e.target.value)}
                  placeholder="Add a license or certification"
                  className={`w-full rounded-2xl border px-4 py-3 outline-none ring-0 transition placeholder:text-slate-400 focus:border-sky-400 ${fieldBg}`}
                />
                <button
                  onClick={addOptionalLicense}
                  className={`rounded-2xl px-5 py-3 font-semibold transition-all ${buttonPrimary}`}
                >
                  Add
                </button>
              </div>

              <div className="mt-5 min-h-[92px] rounded-3xl border border-dashed border-sky-400/30 bg-sky-500/5 p-4">
                {optionalLicenses.length ? (
                  <div className="flex flex-wrap gap-2">
                    {optionalLicenses.map((lic) => (
                      <button
                        key={lic}
                        onClick={() => removeOptionalLicense(lic)}
                        className={`rounded-full border px-3 py-2 text-sm ${chipBg}`}
                      >
                        {lic}
                        <Icon d={icons.x} className="ml-2 inline h-3 w-3" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={`flex h-full items-center justify-center text-sm ${mutedText}`}>No optional licenses yet.</div>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className={`rounded-[28px] border p-6 ${cardBg}`}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-500/10 text-sky-500">
                  <Icon d={icons.card} className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Subscription</h3>
                  <p className={`text-sm ${mutedText}`}>Verification approval requires an active verification subscription.</p>
                </div>
              </div>

              <div className={`mt-5 rounded-3xl border p-5 ${isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white"}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className={softText}>Status</span>
                  <span className="rounded-full bg-rose-500/10 px-3 py-1 font-semibold text-rose-400">
                    {remainingDays > 0 ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className={`mt-3 text-sm leading-6 ${softText}`}>
                  Activate your verification plan to unlock review eligibility and progress toward approval.
                </div>
                {remainingDays > 0 && (
                  <p className={`mt-3 text-xs ${mutedText}`}>
                    Remaining: {remainingDays} day{remainingDays === 1 ? "" : "s"}
                  </p>
                )}
              </div>

              <div className="mt-4 grid gap-3">
                <button
                  onClick={handleRenewVerification}
                  disabled={renewing}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all ${buttonPrimary}`}
                >
                  <Icon d={icons.refresh} className="h-4 w-4" />
                  {renewing ? "Processing..." : "Pay / Renew Verification"}
                </button>
                <button
                  onClick={loadStatus}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 font-semibold transition-all ${buttonGhost}`}
                >
                  <Icon d={icons.refresh} className="h-4 w-4" />
                  Refresh status
                </button>
              </div>
            </div>

            <div className={`rounded-[28px] border p-6 ${cardBg}`}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-500">
                  <Icon d={icons.help} className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Need help?</h3>
                  <p className={`text-sm ${mutedText}`}>Visit the Help Center.</p>
                </div>
              </div>

              <div className={`mt-5 rounded-3xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-sky-50/60"}`}>
                <div className="flex items-start gap-3">
                  <Icon d={icons.upload} className="mt-0.5 h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm font-semibold">Upload stronger proof</p>
                    <p className={`mt-1 text-sm leading-6 ${softText}`}>
                      Higher-quality documents and licenses can improve review confidence and credibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-[28px] border p-6 ${cardBg}`}>
              <h3 className="font-semibold">Overview</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className={softText}>First month</span>
                  <span className="font-semibold">$1.99</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={softText}>Renewals</span>
                  <span className="font-semibold">$6.99/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={softText}>Review status</span>
                  <span className="font-semibold text-amber-400">{reviewStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={softText}>Verification</span>
                  <span className="font-semibold text-rose-400">{verified ? "Verified" : "Not verified"}</span>
                </div>
              </div>
            </div>
          </aside>
        </main>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={onFileSelected}
        />
      </div>
    </div>
  );
}