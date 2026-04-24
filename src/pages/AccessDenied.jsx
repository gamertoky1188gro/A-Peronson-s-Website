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
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AccessDenied() {
  // Read the attempted path from router state (ProtectedRoute sets this when redirecting here).
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    // Full-height page wrapper (keeps center content vertically spaced on large screens).
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900 transition-colors duration-500 dark:bg-[#020617] dark:text-slate-100">
      {/* Centered panel to keep the message readable and focused. */}
      <div className="max-w-3xl mx-auto mt-16 rounded-2xl bg-white p-8 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Access denied</h1>
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Back
          </button>
        </div>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          {/* Show the blocked route (fallback to generic wording if missing). */}
          You do not have permission to access{" "}
          <strong>{location.state?.from || "this page"}</strong>.
        </p>
        {/* Primary actions: re-auth or return to a safe default page. */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-gtBlue hover:bg-gtBlueHover text-white"
          >
            Login with another account
          </Link>
          <Link
            to="/feed"
            className="px-4 py-2 rounded-lg bg-white shadow-borderless ring-1 ring-slate-200/60 hover:bg-slate-50 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10 dark:hover:bg-white/8"
          >
            Go to Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
