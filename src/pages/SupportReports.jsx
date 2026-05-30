/*
  Route: /support
  Access: Protected (login required)

  Purpose:
    - Collect bug reports, feature requests, account issues, and general feedback.
    - Store submissions in the reports queue for admin review.
*/
import NeonAtom from "../components/ui/NeonAtom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiRequest,
  API_BASE,
  getCurrentUser,
  getToken,
  hasEntitlement,
} from "../lib/auth";
import { useTheme } from "../lib/ThemeProvider";
import { usePremiumCheck } from "../hooks/useSecureUser";

const CATEGORY_OPTIONS = [
  "Bug Report",
  "Feature Request",
  "Account Problem",
  "Payment / Verification Issue",
  "Report a User",
  "Content Report",
  "General Feedback",
  "Other",
];

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];

const Icon = ({ children, className = "" }) => (
  <span className={`inline-flex items-center justify-center ${className}`}>
    {children}
  </span>
);

export default function SupportReports() {
  const token = useMemo(() => getToken(), []);
  const navigate = useNavigate();
  const sessionUser = getCurrentUser();
  const { isPremium } = usePremiumCheck();

  const canPrioritySupport =
    isPremium || hasEntitlement(sessionUser, "dedicated_support");
  const canDedicatedManager =
    isPremium || hasEntitlement(sessionUser, "dedicated_account_manager");
  const accountManager = sessionUser?.profile || {};
  const hasAccountManager = Boolean(
    accountManager.account_manager_name ||
    accountManager.account_manager_email ||
    accountManager.account_manager_phone,
  );

  const { theme: currentTheme, toggleTheme } = useTheme();
  const darkMode = currentTheme === "dark";
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Bug Report");
  const [description, setDescription] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [contactEmail, setContactEmail] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [reportId, setReportId] = useState("");
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const theme = useMemo(() => {
    return darkMode ? "bg-slate-950 text-white" : "bg-sky-50 text-slate-900";
  }, [darkMode]);

  const cardTheme = useMemo(() => {
    return darkMode
      ? "bg-white/5 border-white/10 shadow-[0_20px_80px_rgba(2,132,199,0.18)]"
      : "bg-white border-slate-200 shadow-[0_20px_60px_rgba(14,165,233,0.10)]";
  }, [darkMode]);

  const inputTheme = useMemo(() => {
    return darkMode
      ? "bg-slate-900/70 border-white/10 placeholder:text-slate-400 text-white focus:border-sky-400 focus:ring-sky-400/20"
      : "bg-white border-slate-200 placeholder:text-slate-400 text-slate-900 focus:border-sky-500 focus:ring-sky-500/20";
  }, [darkMode]);

  const loadTickets = useCallback(async () => {
    if (!token) return;
    setTicketsLoading(true);
    try {
      const data = await apiRequest("/support/tickets", { token });
      setTickets(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setTickets([]);
    } finally {
      setTicketsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  async function submitReport(e) {
    e.preventDefault();
    if (!token) {
      setFeedback("Please login again to submit a report.");
      return;
    }
    setLoading(true);
    setFeedback("");
    setReportId("");
    try {
      const report = await apiRequest("/support/tickets", {
        method: "POST",
        token,
        body: {
          subject,
          category,
          description,
          page_url: pageUrl,
          ...(canPrioritySupport ? { priority } : {}),
          contact_email: contactEmail,
        },
      });

      const ticketId = report?.ticket?.id || report?.id;
      if (attachment && ticketId) {
        const formData = new FormData();
        formData.append("file", attachment);
        formData.append("entity_type", "support_ticket");
        formData.append("entity_id", ticketId);
        formData.append("type", "screenshot");

        const res = await fetch(`${API_BASE}/documents`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Attachment upload failed");
        }
      }

      setReportId(ticketId || "");
      setFeedback("Ticket submitted successfully.");
      setSubject("");
      setDescription("");
      setPageUrl("");
      setPriority("Medium");
      setContactEmail("");
      setAttachment(null);
      await loadTickets();
    } catch (err) {
      setFeedback(err.message || "Unable to submit report");
    } finally {
      setLoading(false);
    }
  }

  const getPriorityColor = (p) => {
    if (p === "Urgent") return "bg-rose-500/15 text-rose-300";
    if (p === "High") return "bg-orange-500/15 text-orange-300";
    if (p === "Medium") return "bg-amber-500/15 text-amber-300";
    return "bg-emerald-500/15 text-emerald-300";
  };

  return (
    <div className={`min-h-screen ${theme} transition-colors duration-300`}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute top-40 right-[-6rem] h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header
          className={`mb-6 overflow-hidden rounded-[28px] border ${cardTheme} backdrop-blur-xl`}
        >
          <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-300">
                <Icon className="h-4 w-4">✨</Icon>
                Premium support center
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Support &amp; Reports
              </h1>
              <p
                className={`mt-4 max-w-2xl text-sm leading-6 sm:text-base ${darkMode ? "text-slate-300" : "text-slate-600"}`}
              >
                Report bugs, request features, or share any issue. We collect
                everything in one place so it can be tracked and resolved.
              </p>

              {canDedicatedManager && hasAccountManager ? (
                <div
                  className={`mt-4 rounded-2xl border p-4 ${darkMode ? "border-amber-400/20 bg-amber-500/10" : "border-amber-200 bg-amber-50"}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`mt-0.5 h-5 w-5 ${darkMode ? "text-amber-300" : "text-amber-600"}`}
                    >
                      👑
                    </Icon>
                    <div>
                      <p className="font-semibold">Dedicated Account Manager</p>
                      <p
                        className={`mt-1 text-sm leading-6 ${darkMode ? "text-amber-100/80" : "text-amber-900/70"}`}
                      >
                        {accountManager.account_manager_name ||
                          "Support manager"}{" "}
                        — {accountManager.account_manager_email || ""} —{" "}
                        {accountManager.account_manager_phone || ""}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition hover:scale-[1.01] active:scale-[0.99] ${
                  darkMode
                    ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {darkMode ? (
                  <Icon className="h-4 w-4">☀️</Icon>
                ) : (
                  <Icon className="h-4 w-4">🌙</Icon>
                )}
                {darkMode ? "Light mode" : "Dark mode"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5"
              >
                <Icon className="h-4 w-4">←</Icon>
                Back
              </button>
            </div>
          </div>
        </header>

        {feedback && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 ${
              feedback.includes("success")
                ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                : "border-rose-400/20 bg-rose-500/10 text-rose-300"
            }`}
          >
            {feedback}
          </div>
        )}

        <main className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <section
            className={`rounded-[28px] border ${cardTheme} p-5 backdrop-blur-xl sm:p-6`}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Submit a report
                </h2>
                <p
                  className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                >
                  Every report gets organized, prioritized, and tracked.
                </p>
              </div>
              <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-3 text-sky-300">
                <Icon className="h-5 w-5">🛡️</Icon>
              </div>
            </div>

            <form onSubmit={submitReport} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span
                    className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Subject
                  </span>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Short summary of the issue"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${inputTheme}`}
                    required
                  />
                </label>

                <label className="block">
                  <span
                    className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Category
                  </span>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full appearance-none rounded-2xl border px-4 py-3 pr-11 text-sm outline-none transition ${inputTheme}`}
                    >
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      ⌄
                    </span>
                  </div>
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <span
                    className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Priority
                  </span>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {PRIORITY_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => canPrioritySupport && setPriority(item)}
                        disabled={!canPrioritySupport}
                        className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                          priority === item
                            ? "border-sky-400 bg-sky-500/15 text-sky-300 shadow-lg shadow-sky-500/10"
                            : !canPrioritySupport
                              ? "border-white/5 bg-white/5 text-slate-600 cursor-not-allowed opacity-50"
                              : darkMode
                                ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  {!canPrioritySupport && (
                    <p className="mt-2 text-xs text-slate-500">
                      Upgrade to Premium for priority support
                    </p>
                  )}
                </div>

                <div
                  className={`rounded-2xl border p-4 ${darkMode ? "border-amber-400/20 bg-amber-500/10" : "border-amber-200 bg-amber-50"}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`mt-0.5 h-5 w-5 ${darkMode ? "text-amber-300" : "text-amber-600"}`}
                    >
                      👑
                    </Icon>
                    <div>
                      <p className="font-semibold">Premium Priority</p>
                      <p
                        className={`mt-1 text-sm leading-6 ${darkMode ? "text-amber-100/80" : "text-amber-900/70"}`}
                      >
                        {canPrioritySupport
                          ? "Your high-tier requests are highlighted for faster review."
                          : "Upgrade to Premium for priority support and faster escalation."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <label className="block">
                <span
                  className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                >
                  Description
                </span>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write the full details here"
                  className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition ${inputTheme}`}
                  required
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span
                    className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Page URL{" "}
                    <span
                      className={darkMode ? "text-slate-500" : "text-slate-400"}
                    >
                      (optional)
                    </span>
                  </span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      🌐
                    </span>
                    <input
                      value={pageUrl}
                      onChange={(e) => setPageUrl(e.target.value)}
                      placeholder="https://..."
                      className={`w-full rounded-2xl border px-10 py-3 text-sm outline-none transition ${inputTheme}`}
                    />
                  </div>
                </label>

                <label className="block">
                  <span
                    className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Contact Email{" "}
                    <span
                      className={darkMode ? "text-slate-500" : "text-slate-400"}
                    >
                      (optional)
                    </span>
                  </span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      ✉️
                    </span>
                    <input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full rounded-2xl border px-10 py-3 text-sm outline-none transition ${inputTheme}`}
                    />
                  </div>
                </label>
              </div>

              <div
                className={`rounded-[24px] border border-dashed p-5 ${darkMode ? "border-white/10 bg-slate-900/30" : "border-slate-200 bg-slate-50"}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`mt-0.5 h-5 w-5 ${darkMode ? "text-sky-300" : "text-sky-600"}`}
                    >
                      📤
                    </Icon>
                    <div>
                      <p className="font-medium">
                        Screenshot / File{" "}
                        <span
                          className={
                            darkMode ? "text-slate-500" : "text-slate-400"
                          }
                        >
                          (optional)
                        </span>
                      </p>
                      <p
                        className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        {attachment ? attachment.name : "No file chosen"}
                      </p>
                    </div>
                  </div>

                  <label
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition hover:scale-[1.01] active:scale-[0.99] ${darkMode ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setAttachment(e.target.files?.[0] || null)
                      }
                    />
                    <Icon className="h-4 w-4">📄</Icon>
                    {attachment ? "Change" : "Choose file"}
                  </label>
                </div>
              </div>

              {reportId && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                  <p className="font-semibold text-emerald-300">
                    Ticket Submitted!
                  </p>
                  <p className="text-sm text-emerald-200/80">
                    Your ticket ID: {reportId}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 px-5 py-4 text-sm font-semibold text-white shadow-xl shadow-sky-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <NeonAtom size={20} />
                ) : (
                  <Icon className="h-4 w-4">✓</Icon>
                )}
                Submit Report
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <section
              className={`rounded-[28px] border ${cardTheme} p-5 backdrop-blur-xl sm:p-6`}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">My Support Tickets</h3>
                  <p
                    className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                  >
                    Refresh and track your recent submissions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadTickets}
                  disabled={ticketsLoading}
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {ticketsLoading ? <NeonAtom size={20} /> : <Icon className="h-4 w-4">↻</Icon>}
                  Refresh
                </button>
              </div>

              {ticketsLoading ? (
                <div className="flex justify-center py-8">
                  <NeonAtom size={40} text="Loading..." />
                </div>
              ) : tickets.length === 0 ? (
                <div
                  className={`rounded-[24px] border border-dashed p-8 text-center ${darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}
                >
                  <Icon
                    className={`mx-auto h-10 w-10 ${darkMode ? "text-sky-300" : "text-sky-600"}`}
                  >
                    🎫
                  </Icon>
                  <p className="mt-4 text-lg font-semibold">No tickets yet.</p>
                  <p
                    className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                  >
                    Submit a report to create your first support ticket.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <article
                      key={ticket.id}
                      className={`rounded-[24px] border p-4 transition hover:-translate-y-0.5 ${darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-sky-500/15 px-2.5 py-1 text-xs font-semibold text-sky-300">
                              {ticket.id}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${darkMode ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-600"}`}
                            >
                              {ticket.status || "Open"}
                            </span>
                          </div>
                          <h4 className="mt-3 font-semibold">
                            {ticket.subject}
                          </h4>
                          <p
                            className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                          >
                            {ticket.category}
                          </p>
                        </div>
                        {ticket.priority && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(ticket.priority)}`}
                          >
                            {ticket.priority}
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-4 text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}
                      >
                        {ticket.created_at
                          ? new Date(ticket.created_at).toLocaleString()
                          : ""}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section
              className={`rounded-[28px] border ${cardTheme} p-5 backdrop-blur-xl sm:p-6`}
            >
              <h3 className="text-xl font-semibold">What happens next</h3>
              <div className="mt-5 space-y-4">
                {[
                  {
                    icon: "📋",
                    title: "Collected",
                    text: "Your report is grouped with the right category and priority.",
                  },
                  {
                    icon: "🐞",
                    title: "Reviewed",
                    text: "The issue is checked for clarity, impact, and reproducibility.",
                  },
                  {
                    icon: "💬",
                    title: "Responded",
                    text: "A team member can follow up if more details are needed.",
                  },
                  {
                    icon: "✅",
                    title: "Resolved",
                    text: "Completed items are tracked until the case is closed.",
                  },
                ].map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${darkMode ? "bg-white/5 text-sky-300" : "bg-sky-50 text-sky-600"}`}
                      >
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      {index < 3 && (
                        <div
                          className={`mt-2 h-full w-px flex-1 ${darkMode ? "bg-white/10" : "bg-slate-200"}`}
                        />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="font-semibold">{item.title}</p>
                      <p
                        className={`mt-1 text-sm leading-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              className={`rounded-[28px] border ${cardTheme} p-5 backdrop-blur-xl sm:p-6`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`mt-0.5 h-5 w-5 ${darkMode ? "text-sky-300" : "text-sky-600"}`}
                >
                  ⚠️
                </Icon>
                <div>
                  <h3 className="font-semibold">Best practice</h3>
                  <p
                    className={`mt-1 text-sm leading-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                  >
                    Include steps to reproduce, screenshots, page URL, and any
                    visible error text for faster resolution.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}
