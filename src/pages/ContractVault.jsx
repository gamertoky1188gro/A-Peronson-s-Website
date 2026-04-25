/*
  Route: /contracts
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent
 */
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccessDeniedState from "../components/AccessDeniedState";
import { API_BASE, apiRequest, getCurrentUser, getToken } from "../lib/auth";

const contractsSeed = [
  {
    id: "SEED-001",
    status: "Signed",
    title: "Seeded Contract",
    buyer: "Seed Buyer",
    factory: "Seed Factory",
    date: "2026-04-21",
    next: "Lock pending",
    buyerSign: "signed",
    factorySign: "signed",
    pdf: "ready",
    timeline: [
      "Discovered",
      "Matched",
      "Contacted",
      "Meeting scheduled",
      "Negotiating",
      "Contract drafted",
      "Contract signed",
      "Closed",
    ],
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Icon({ path, className = "", viewBox = "0 0 24 24" }) {
  return (
    <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={path} />
    </svg>
  );
}

const icons = {
  vault: (props) => <Icon {...props} path="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5zM12 12v9M4 7.5l8 4.5 8-4.5" />,
  dashboard: (props) => <Icon {...props} path="M4 5h7v7H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 14h7v5H4z" />,
  bell: (props) => <Icon {...props} path="M15 17H5l1.6-1.6A2 2 0 0 0 7 14v-3a5 5 0 0 1 10 0v3a2 2 0 0 0 .4 1.2L19 17h-4m-4 2a2 2 0 0 0 4 0" />,
  plus: (props) => <Icon {...props} path="M12 5v14M5 12h14" />,
  refresh: (props) => <Icon {...props} path="M20 12a8 8 0 1 1-2.34-5.66M20 4v6h-6" />,
  search: (props) => <Icon {...props} path="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />,
  help: (props) => <Icon {...props} path="M12 18h.01M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4" />,
  chat: (props) => <Icon {...props} path="M21 15a4 4 0 0 1-4 4H9l-5 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4Z" />,
  lock: (props) => <Icon {...props} path="M7 11V8a5 5 0 0 1 10 0v3m-11 0h12v10H6z" />,
  download: (props) => <Icon {...props} path="M12 3v10m0 0 4-4m-4 4-4-4M4 17v3h16v-3" />,
  shield: (props) => <Icon {...props} path="M12 3 20 6v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z" />,
  check: (props) => <Icon {...props} path="M20 6 9 17l-5-5" />,
  file: (props) => <Icon {...props} path="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5" />,
  phone: (props) => <Icon {...props} path="M5 4h4l2 5-2 2c1.5 3 3.5 5 6 6l2-2 5 2v4c0 1.1-.9 2-2 2C10.5 21 3 13.5 3 5c0-1.1.9-2 2-2Z" />,
  calendar: (props) => <Icon {...props} path="M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />,
};

function Pill({ children, tone = "default" }) {
  const tones = {
    default: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80",
    blue: "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-300",
    green: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300",
    amber: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300",
    violet: "bg-violet-500/10 text-violet-700 ring-1 ring-violet-500/20 dark:text-violet-300",
    red: "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>{children}</span>;
}

function SectionCard({ title, subtitle, right, children }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_20px_60px_rgba(2,8,23,0.4)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function Step({ label, active, done, last }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold",
            done
              ? "border-sky-500 bg-sky-500 text-white"
              : active
              ? "border-sky-400 bg-sky-500/10 text-sky-600 dark:text-sky-300"
              : "border-slate-300 bg-white text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-400"
          )}
        >
          {done ? <icons.check className="h-4 w-4" /> : active ? "•" : "○"}
        </div>
        {!last ? <div className={cn("mt-2 h-10 w-px", done ? "bg-sky-400/80" : "bg-slate-200 dark:bg-white/10")} /> : null}
      </div>
      <div className="pb-4 pt-1">
        <div className={cn("text-sm font-medium", active || done ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")}>{label}</div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition",
        active
          ? "bg-sky-600 text-white shadow-lg shadow-sky-500/20"
          : "bg-slate-50 text-slate-700 hover:bg-sky-50 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
      )}
    >
      <span className="flex items-center gap-3">
        <span className={cn("grid h-8 w-8 place-items-center rounded-xl", active ? "bg-white/15" : "bg-white dark:bg-white/10")}>{icon({ className: "h-4 w-4" })}</span>
        {label}
      </span>
      {count ? <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", active ? "bg-white/15 text-white" : "bg-sky-500/10 text-sky-600 dark:text-sky-300")}>{count}</span> : null}
    </button>
  );
}

function MetaChip({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-100 px-3 py-2 dark:bg-white/5">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">{value}</div>
    </div>
  );
}

function DetailPanel({ icon, title, body }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">{icon}</span>
        {title}
      </div>
      <div className="mt-3">{body}</div>
    </div>
  );
}

function StatusCard({ label, status }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        <Pill tone="green">{status}</Pill>
      </div>
    </div>
  );
}

function ActionButton({ icon, title, subtitle, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-4 text-left transition",
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
          : "border-sky-500/20 bg-sky-500/5 text-slate-900 hover:-translate-y-0.5 dark:text-white"
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="grid h-7 w-7 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">{icon}</span>
        {title}
      </div>
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>
    </button>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}

function Input({ label, value, placeholder, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
      />
    </label>
  );
}

function SummaryRow({ step, done }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <span className={cn("grid h-6 w-6 place-items-center rounded-full text-xs font-bold", done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400")}>
        {done ? "✓" : "•"}
      </span>
      <span className="font-medium text-slate-900 dark:text-white">{step}</span>
    </div>
  );
}

function isOwnerLevel(user) {
  return user?.role === "owner" || user?.role === "admin";
}

export default function ContractVaultPage() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "dark";
    }
    return "dark";
  });
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("SEED-001");
  const [tab, setTab] = useState("All");
  const [saving, setSaving] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    type: "bank_transfer",
    transaction_reference: "",
    bank_name: "",
    sender_account_name: "",
    receiver_account_name: "",
    transaction_date: "",
    amount: "",
    currency: "USD",
    document_file: null,
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleESign = async () => {
    const token = getToken();
    if (!token) return;
    await runAction(
      async () => {
        const res = await apiRequest("/documents/contracts/SEED-001/sign-session", {
          method: "POST",
          token,
        });
        if (res?.signing_url) {
          window.open(res.signing_url, "_blank");
        }
      },
      "Failed to create session"
    );
  };

  const handleDownloadPdf = () => {
    window.open(`${API_BASE}/uploads/contracts/CN-1776429426220-v1.pdf`, "_blank");
  };

  const contract = contractsSeed.find((c) => c.id === selectedId) || contractsSeed[0];
  const currentUser = useMemo(() => getCurrentUser(), []);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return contractsSeed.filter((c) => {
      const matchesQuery = [c.id, c.status, c.title, c.buyer, c.factory].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesTab = tab === "All" ? true : c.status.toLowerCase() === tab.toLowerCase();
      return matchesQuery && matchesTab;
    });
  }, [query, tab]);

  const shell = theme === "dark" ? "dark" : "";

  const runAction = async (actionFn, errorMsg) => {
    setSaving(true);
    try {
      await actionFn();
    } catch (err) {
      console.error(err.message || errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleBuyerSign = async () => {
    const token = getToken();
    if (!token) return;
    await runAction(
      async () => {
        await apiRequest("/documents/contracts/SEED-001/signatures", {
          method: "PATCH",
          token,
          body: { buyer_signature_state: "signed", is_draft: false },
        });
      },
      "Failed to sign"
    );
  };

  const handleFactorySign = async () => {
    const token = getToken();
    if (!token) return;
    await runAction(
      async () => {
        await apiRequest("/documents/contracts/SEED-001/signatures", {
          method: "PATCH",
          token,
          body: { factory_signature_state: "signed", is_draft: false },
        });
      },
      "Failed to sign"
    );
  };

  const handleLockPdf = async () => {
    const token = getToken();
    if (!token) return;
    await runAction(
      async () => {
        await apiRequest("/documents/contracts/SEED-001/artifact", {
          method: "PATCH",
          token,
          body: { status: "locked" },
        });
      },
      "Failed to lock"
    );
  };

  const handleArchive = async () => {
    const token = getToken();
    if (!token) return;
    await runAction(
      async () => {
        await apiRequest("/documents/contracts/SEED-001/artifact", {
          method: "PATCH",
          token,
          body: { status: "archived" },
        });
      },
      "Failed to archive"
    );
  };

  const handleSubmitProof = async () => {
    const token = getToken();
    if (!token) return;
    await runAction(
      async () => {
        await apiRequest("/payment-proofs", {
          method: "POST",
          token,
          body: {
            contract_id: "SEED-001",
            type: paymentForm.type,
            transaction_reference: paymentForm.transaction_reference,
            bank_name: paymentForm.bank_name,
            sender_account_name: paymentForm.sender_account_name,
            receiver_account_name: paymentForm.receiver_account_name,
            transaction_date: paymentForm.transaction_date,
            amount: paymentForm.amount,
            currency: paymentForm.currency,
          },
        });
      },
      "Failed to submit proof"
    );
  };

  const canSign = currentUser && isOwnerLevel(currentUser);

  return (
    <div className={shell}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_24%),linear-gradient(180deg,#f8fbff_0%,#eef7ff_40%,#eaf3ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.24),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(125,211,252,0.12),_transparent_22%),linear-gradient(180deg,#020617_0%,#07111f_45%,#08111b_100%)] dark:text-white">
        <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
          <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_20px_60px_rgba(2,8,23,0.4)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-sky-600 dark:text-sky-300">
                    <icons.vault className="h-5 w-5" />
                    Vault
                  </div>
                  <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">Contract Vault</h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Draft → Sign → PDF artifact → Lock → Archive</p>
                </div>
                <button
                  onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
              </div>

              <div className="mt-6 grid gap-2">
                <NavItem icon={icons.dashboard} label="Dashboard" onClick={() => navigate("/owner")} />
                <NavItem icon={icons.bell} label="Notifications" count="4" onClick={() => navigate("/notifications")} />
                <NavItem icon={icons.plus} label="New draft" />
                <NavItem icon={icons.file} label="Contracts" active />
                <NavItem icon={icons.refresh} label="Refresh" />
              </div>

              <div className="mt-6 rounded-2xl border border-sky-500/15 bg-sky-500/5 p-4 dark:border-sky-400/20 dark:bg-sky-400/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-200">
                  <icons.search className="h-4 w-4" />
                  Search by number, buyer, factory, title...
                </div>
                <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-slate-950">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search contracts"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <span className="ml-3 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    Ctrl K
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {["All", "Draft", "Pending", "Signed", "Archived"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setTab(item)}
                    className={cn(
                      "rounded-full px-3 py-2 text-sm font-medium transition",
                      tab === item
                        ? "bg-sky-600 text-white shadow-lg shadow-sky-500/20"
                        : "bg-slate-100 text-slate-700 hover:bg-sky-50 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "w-full rounded-3xl border p-4 text-left transition hover:-translate-y-0.5",
                      selectedId === c.id
                        ? "border-sky-500/40 bg-sky-500/10 shadow-lg shadow-sky-500/10 dark:bg-sky-400/10"
                        : "border-slate-200 bg-white/70 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{c.id}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <Pill tone="green">{c.status}</Pill>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{c.title}</span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-500 dark:text-slate-400">{c.date}</div>
                    </div>
                    <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">Buyer: {c.buyer} · Factory: {c.factory}</div>
                    <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-3">
                      <MetaChip label="Next" value={c.next} />
                      <MetaChip label="Buyer" value={c.buyerSign} />
                      <MetaChip label="Factory" value={c.factorySign} />
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <main className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <div className="space-y-4">
                <SectionCard
                  title={contract.id}
                  subtitle={`${contract.status} · ${contract.title}`}
                  right={<Pill tone="green">{contract.status}</Pill>}
                >
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>Buyer: {contract.buyer}</span>
                    <span>•</span>
                    <span>Factory: {contract.factory}</span>
                  </div>
                  <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">Journey Timeline</div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Video calls are recommended before finalizing contracts. No recorded call is linked to this contract yet.</div>
                        </div>
                        <Pill tone="blue">Help</Pill>
                      </div>
                      <div className="mt-4 space-y-0">
                        {contract.timeline.map((step, idx) => (
                          <Step key={step} label={step} done={idx <= 6} active={idx === 7} last={idx === contract.timeline.length - 1} />
                        ))}
                      </div>
                      <button onClick={() => navigate("/chat")} className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5">
                        <icons.chat className="h-4 w-4" />
                        Open chat
                      </button>
                    </div>

                    <div className="space-y-4">
                      <DetailPanel
                        icon={<icons.check className="h-4 w-4" />}
                        title="Signatures"
                        body={
                          <>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <StatusCard label="Buyer" status={contract.buyerSign} />
                              <StatusCard label="Factory" status={contract.factorySign} />
                            </div>
                            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100">
                              Warning: No accepted payment proof yet. You may continue, but proof is strongly recommended for safety.
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <ActionButton 
                                icon={<icons.check className="h-4 w-4" />} 
                                title="Buyer sign" 
                                subtitle={canSign ? "Sign as buyer" : "Already signed."} 
                                disabled={!canSign || contract.buyerSign === "signed"} 
                                onClick={handleBuyerSign}
                              />
                              <ActionButton 
                                icon={<icons.shield className="h-4 w-4" />} 
                                title="Factory sign" 
                                subtitle={canSign ? "Sign as factory" : "Already signed."} 
                                disabled={!canSign || contract.factorySign === "signed"} 
                                onClick={handleFactorySign}
                              />
                              <ActionButton 
                                icon={<icons.check className="h-4 w-4" />} 
                                title="E-sign session" 
                                subtitle="Create signing session" 
                                disabled={saving}
                                onClick={handleESign}
                              />
                              <ActionButton 
                                icon={<icons.shield className="h-4 w-4" />} 
                                title="Lock PDF" 
                                subtitle="Lock the PDF" 
                                disabled={saving}
                                onClick={handleLockPdf}
                              />
                            </div>
                          </>
                        }
                      />

                      <DetailPanel
                        icon={<icons.file className="h-4 w-4" />}
                        title="Artifact (PDF)"
                        body={
                          <div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                              <Pill tone="blue">Status: {contract.pdf}</Pill>
                              <span>PDF generates automatically after both signatures.</span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                              <ActionButton 
                                icon={<icons.lock className="h-4 w-4" />} 
                                title="Lock PDF" 
                                subtitle="Lock the PDF" 
                                disabled={saving}
                                onClick={handleLockPdf}
                              />
                              <ActionButton 
                                icon={<icons.download className="h-4 w-4" />} 
                                title="Download PDF" 
                                subtitle="Ready to export" 
                                onClick={handleDownloadPdf}
                              />
                              <ActionButton 
                                icon={<icons.shield className="h-4 w-4" />} 
                                title="Archive" 
                                subtitle="Archive contract" 
                                disabled={saving}
                                onClick={handleArchive}
                              />
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </div>
                </SectionCard>

                <div className="grid gap-4 lg:grid-cols-2">
                  <SectionCard title="Banking references (optional)" subtitle="For fraud prevention only. No direct payments are processed on-platform." right={<Pill tone="violet">Visible</Pill>}>
                    <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <Row label="Bank name" value="—" />
                      <Row label="Beneficiary" value="—" />
                      <Row label="Transaction reference" value="—" />
                    </div>
                  </SectionCard>

                  <SectionCard title="Payment proof workflow" subtitle="Submit bank transfer or LC documents. Seller review sets status, disputes trigger internal admin review." right={<button className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">Refresh</button>}>
                    <div className="grid gap-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Proof type</label>
                        <select value={paymentForm.type} onChange={(e) => setPaymentForm((p) => ({ ...p, type: e.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950">
                          <option value="bank_transfer">Bank transfer</option>
                          <option value="lc">Letter of credit (LC)</option>
                        </select>
                        <Input label="Transaction reference" value={paymentForm.transaction_reference} placeholder="Enter reference" onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_reference: e.target.value }))} />
                        <Input label="Bank name" value={paymentForm.bank_name} placeholder="Bank name" onChange={(e) => setPaymentForm((p) => ({ ...p, bank_name: e.target.value }))} />
                        <Input label="Sender account name" value={paymentForm.sender_account_name} placeholder="Sender account" onChange={(e) => setPaymentForm((p) => ({ ...p, sender_account_name: e.target.value }))} />
                        <Input label="Receiver/company account name" value={paymentForm.receiver_account_name} placeholder="Receiver account" onChange={(e) => setPaymentForm((p) => ({ ...p, receiver_account_name: e.target.value }))} />
                        <Input label="mm/dd/yyyy" value={paymentForm.transaction_date} placeholder="Date" onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_date: e.target.value }))} />
                        <Input label="Amount" value={paymentForm.amount} placeholder="USD" onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
                      </div>
                      <label className="block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
                        <span className="mb-2 block font-medium">Upload proof document</span>
                        <input type="file" className="block w-full text-sm" />
                      </label>
                      <button onClick={handleSubmitProof} disabled={saving} className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:opacity-50">Submit proof</button>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400">No proofs submitted yet.</div>
                    </div>
                  </SectionCard>
                </div>
              </div>

              <div className="space-y-4">
                <SectionCard title="Contract Snapshot" subtitle="Focused, premium, and ready for review" right={<Pill tone="blue">Premium</Pill>}>
                  <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <Row label="Status" value={contract.status} />
                    <Row label="Next" value={contract.next} />
                    <Row label="Buyer sign" value={contract.buyerSign} />
                    <Row label="Factory sign" value={contract.factorySign} />
                    <Row label="PDF" value={contract.pdf} />
                    <Row label="Date" value={contract.date} />
                  </div>
                </SectionCard>

                <SectionCard title="Call recordings" subtitle="Recorded calls are stored for dispute resolution and security (project.md).">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900 dark:text-white">0 available</span>
                      <icons.phone className="h-4 w-4 text-sky-500" />
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No calls linked to this contract yet.</p>
                  </div>
                </SectionCard>

                <SectionCard title="Artifact audit" subtitle="Generated, versioned, and traceable">
                  <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <Row label="Status" value="generated" />
                    <Row label="Generated at" value="2026-04-21T15:33:19.998Z" />
                    <Row label="Version" value="0" />
                    <Row label="Hash" value="abc" />
                    <Row label="Signer IDs" value="Buyer — - Factory —" />
                    <Row label="Signature timestamps" value="Buyer — - Factory —" />
                  </div>
                </SectionCard>

                <SectionCard title="Contract Audit Trail" subtitle="Premium access gate">
                  <div className="rounded-3xl border border-dashed border-sky-400/30 bg-sky-500/5 p-6 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-500/20">
                      <icons.lock className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Premium</div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Premium plan required to view the contract audit trail.</p>
                    <button className="mt-4 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20">
                      Upgrade to Premium
                    </button>
                  </div>
                </SectionCard>

                <SectionCard title="Workflow summary" subtitle="Every single thing in one place">
                  <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <SummaryRow step="Draft" done />
                    <SummaryRow step="Buyer sign" done={contract.buyerSign === "signed"} />
                    <SummaryRow step="Factory sign" done={contract.factorySign === "signed"} />
                    <SummaryRow step="Lock PDF" done={false} />
                    <SummaryRow step="Archive" done={false} />
                  </div>
                </SectionCard>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}