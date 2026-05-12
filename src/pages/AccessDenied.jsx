/*
  Route: /access-denied
  Access: Public (shown after an auth/role gate denies access)

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Purpose:
    - Display a friendly "you can't access this" screen after ProtectedRoute rejects a role.
    - Echo the route that was attempted via react-router `location.state.from` (set by the router guard).

  Notes:
    - Tailwind-only styling (no legacy App.css utilities).
    - This page does not call any API.
*/
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  LogIn,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  SunMedium,
  MoonStar,
} from "lucide-react";

export default function AccessDenied() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-50">
        {/* Background accents */}
        <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl dark:bg-blue-500/20" />
          <div className="absolute right-[-8rem] top-[18%] h-[22rem] w-[22rem] rounded-full bg-blue-500/15 blur-3xl dark:bg-cyan-400/10" />
          <div className="absolute bottom-[-10rem] left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-cyan-300/20 blur-3xl dark:bg-sky-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_28%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_28%)]" />
        </div>

        <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            {/* Left side */}
            <section className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/70 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm backdrop-blur dark:border-sky-500/20 dark:bg-white/5 dark:text-sky-300">
                <Sparkles className="h-4 w-4" />
                Restricted access
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sky-600 dark:text-sky-300">
                  <ShieldAlert className="h-7 w-7" />
                  <span className="text-sm font-semibold uppercase tracking-[0.28em]">
                    Access denied
                  </span>
                </div>

                <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Access denied
                </h1>

                <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                  You do not have permission to access{" "}
                  <strong>{location.state?.from || "this page"}</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-white dark:text-slate-950 dark:shadow-black/20 dark:hover:bg-slate-200 dark:focus:ring-offset-slate-950"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white/80 px-5 py-3.5 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:border-sky-500/20 dark:bg-white/5 dark:text-sky-200 dark:hover:border-sky-400/30 dark:hover:bg-white/10 dark:focus:ring-offset-slate-950"
                >
                  <LogIn className="h-4 w-4" />
                  Login with another account
                </Link>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/feed"
                  className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-sky-400/30 dark:hover:text-sky-300"
                >
                  Go to Feed
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </section>

            {/* Right side card */}
            <aside className="relative">
              <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[2rem] bg-sky-500/10 blur-2xl dark:bg-cyan-400/10" />

              <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/25 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex rounded-2xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                      <Lock className="h-6 w-6" />
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                      Permission required
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                      This area is protected for authorized users only. Switch
                      accounts or return to the feed to continue browsing.
                    </p>
                  </div>

                  <div className="hidden rounded-2xl border border-sky-200/70 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300 md:block">
                    Secure area
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Account", value: "Restricted" },
                    { label: "Status", value: "No access" },
                    { label: "Action", value: "Switch login" },
                    {
                      label: "Route",
                      value: location.state?.from || "Unknown",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        {item.label}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 p-[1px] shadow-lg shadow-sky-500/10">
                  <div className="rounded-[1.15rem] bg-white px-5 py-4 dark:bg-slate-950">
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Try signing in with the correct organization account or
                      return to the feed to explore public content.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* Floating theme toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-lg shadow-slate-200/60 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:shadow-black/30"
        >
          {dark ? (
            <>
              <SunMedium className="h-4 w-4 text-amber-500" /> Light mode
            </>
          ) : (
            <>
              <MoonStar className="h-4 w-4 text-sky-500" /> Dark mode
            </>
          )}
        </button>
      </div>
    </div>
  );
}
