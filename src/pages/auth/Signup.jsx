/* eslint-disable no-unused-vars */
/*
  Route: /signup
  Access: Public
*/
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  apiRequest,
  getCurrentUser,
  getRoleHome,
  saveSession,
} from "../../lib/auth";

const COUNTRIES = [
  "Bangladesh",
  "India",
  "Pakistan",
  "China",
  "Vietnam",
  "Indonesia",
  "Sri Lanka",
  "Turkey",
  "Italy",
  "Spain",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Netherlands",
  "Japan",
  "South Korea",
  "Malaysia",
  "Thailand",
  "Cambodia",
];

const ACCOUNT_TYPES = [
  { label: "Factory", value: "F" },
  { label: "Buying house", value: "BH" },
  { label: "Buyer", value: "B"}
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function FieldShell({ label, children, hint }) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
        {hint ? <span className="text-xs text-sky-600 dark:text-sky-300">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9.9 5.1A10.6 10.6 0 0 1 12 5c6 0 9.5 7 9.5 7a18.2 18.2 0 0 1-3.1 4.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6.3 6.3C3.8 8.2 2.5 12 2.5 12s3.5 7 9.5 7c1.3 0 2.5-.2 3.6-.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ROLE_VALUE_TO_API = {
  "F": "factory",
  "BH": "buying_house",
  "B": "buyer",
};

export default function Signup() {
  const navigate = useNavigate();
  const existingUser = getCurrentUser();

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
      if (document.documentElement.classList.contains("dark")) return "dark";
    }
    return "dark";
  });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES[0]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [country, setCountry] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.toLowerCase().includes(q));
  }, [countryQuery]);

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
  }, [existingUser?.role, navigate, theme]);

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

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }
    try {
      const payload = {
        name: fullName,
        email: email,
        password: password,
        role: ROLE_VALUE_TO_API[accountType.value],
        company_name: organizationName,
        profile: { country: country },
      };
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: payload,
      });
      saveSession(data.user, data.token);
      navigate("/onboarding", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(isDark ? "dark" : "", "min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#07111f] dark:text-white") }>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.30),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.24),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.30),transparent)] dark:bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.20),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        <aside className="relative flex items-center px-6 py-10 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="inline-flex items-center gap-3 rounded-full border border-sky-200/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur dark:border-sky-400/20 dark:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-300 text-sm font-black text-white shadow-lg shadow-sky-500/30">
                  G
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-[0.18em] text-slate-900 dark:text-white">GARTEXHUB</div>
                  <div className="text-xs text-slate-500 dark:text-slate-300">Garments & Textile sourcing</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
              >
                {isDark ? "Light mode" : "Dark mode"}
              </button>
            </div>

            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-4 inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200"
              >
                Create your account
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.5 }}
                className="text-4xl font-black leading-tight tracking-tight sm:text-5xl"
              >
                A clean, professional start for Garments and Textile sourcing teams.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.5 }}
                className="mt-5 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300"
              >
                Join a modern sourcing network built for factories and buying houses with a premium, polished onboarding experience.
              </motion.p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ["Secure onboarding", "Clear account selection and identity flow."],
                  ["Fast setup", "Search countries and complete details quickly."],
                  ["Premium UI", "Soft gradients, glass panels, and refined spacing."],
                  ["Dual theme", "Optimized for both light and dark environments."],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/20">
                      <CheckIcon />
                    </div>
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </aside>

        <main className="relative flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-xl"
          >
            <div className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_30px_120px_rgba(2,8,23,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1627]/80 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:text-sky-200"
                >
                  <span className="text-base">←</span>
                  Back
                </button>
                <div className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white shadow-lg shadow-sky-500/30">
                  GarTexHub
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight">Create your account</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                  A clean, professional start for Garments and Textile sourcing teams.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl bg-rose-500/15 border border-rose-500/30 px-4 py-3 text-sm text-rose-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <FieldShell label="Full Name">
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-slate-500"
                    required
                  />
                </FieldShell>

                <FieldShell label="Email">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-slate-500"
                    required
                  />
                </FieldShell>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FieldShell label="Password">
                    <div className="relative">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="•••••••••••"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-slate-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-50 dark:text-sky-200 dark:hover:bg-white/10"
                      >
                        <span className="inline-flex items-center gap-1">
                          <EyeIcon open={showPassword} />
                          {showPassword ? "Hide" : "Show"}
                        </span>
                      </button>
                    </div>
                  </FieldShell>

                  <FieldShell label="Confirm Password">
                    <div className="relative">
                      <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="•••••••••••"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-slate-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-50 dark:text-sky-200 dark:hover:bg-white/10"
                      >
                        <span className="inline-flex items-center gap-1">
                          <EyeIcon open={showConfirmPassword} />
                          {showConfirmPassword ? "Hide" : "Show"}
                        </span>
                      </button>
                    </div>
                  </FieldShell>
                </div>

                <FieldShell label="Account Type" hint={accountType.value === "F" ? "Factory" : accountType.value === "BH" ? "Buying house" : "Buyer"}>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setAccountOpen((v) => !v)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm transition hover:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-white/5"
                    >
                      <span className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white">
                          {accountType.value}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-100">{accountType.label}</span>
                      </span>
                      <span className="text-slate-500 dark:text-slate-300"><ChevronDown /></span>
                    </button>

                    {accountOpen ? (
                      <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#0d1829]">
                        {ACCOUNT_TYPES.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                              setAccountType(item);
                              setAccountOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-sky-50 dark:hover:bg-white/5",
                              accountType.value === item.value ? "bg-sky-50 dark:bg-white/5" : ""
                            )}
                          >
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                              {item.value}
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-100">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </FieldShell>

                <FieldShell label="Country">
                  <div className="relative">
                    <input
                      value={countryOpen ? countryQuery : country}
                      onChange={(e) => {
                        setCountryQuery(e.target.value);
                        setCountryOpen(true);
                        setCountry("");
                      }}
                      onFocus={() => setCountryOpen(true)}
                      placeholder="Type to search countries"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-slate-500"
                    />
                    {countryOpen ? (
                      <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#0d1829]">
                        {filteredCountries.length ? (
                          filteredCountries.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setCountry(item);
                                setCountryQuery(item);
                                setCountryOpen(false);
                              }}
                              className="block w-full px-4 py-3 text-left text-sm transition hover:bg-sky-50 dark:hover:bg-white/5"
                            >
                              {item}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-sm text-slate-500 dark:text-slate-300">No matching country found.</div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </FieldShell>

                <FieldShell label="Organization Name">
                  <input
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Enter your organization name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-slate-500"
                  />
                </FieldShell>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-400 px-5 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(14,165,233,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(14,165,233,0.45)] disabled:opacity-60"
                >
                  <span className="relative z-10">{loading ? "Creating account..." : "Create account"}</span>
                  <span className="absolute inset-0 translate-x-[-120%] bg-white/20 transition-transform duration-700 group-hover:translate-x-[120%]" />
                </button>

                <div className="pt-2 text-center text-sm text-slate-600 dark:text-slate-300">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200">
                    Login
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}