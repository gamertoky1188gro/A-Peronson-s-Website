/*
  Route: /contracts
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent
 */
import NeonAtom from "../components/ui/NeonAtom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../lib/ThemeProvider";
import AccessDeniedState from "../components/AccessDeniedState";
import {
  API_BASE,
  apiRequest,
  getCurrentUser,
  getToken,
  syncUserFromApi,
} from "../lib/auth";
import {
  Package,
  LayoutDashboard,
  Bell,
  Plus,
  RefreshCw,
  Search,
  HelpCircle,
  MessageSquare,
  Lock,
  Download,
  Shield,
  Check,
  File,
  Phone,
  Calendar,
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import CardStack from "../components/CardStack";
import { StaggerContainer, StaggerItem } from "../components/StaggerContainer";
import { uploadFile } from "../lib/upload";
import { logger } from "../lib/logger";

const TIMELINE = [
  "Discovered",
  "Matched",
  "Contacted",
  "Meeting scheduled",
  "Negotiating",
  "Contract drafted",
  "Contract signed",
  "Closed",
];

function mapContract(c) {
  if (!c) return null;
  const ls = c.lifecycle_status || "draft";
  const artifactStatus = c.artifact?.status || "draft";
  const next = (() => {
    if (ls === "archived") return "Archived";
    if (artifactStatus === "locked") return "Archived";
    if (ls === "signed") return "Lock pending";
    if (
      c.buyer_signature_state === "signed" &&
      c.factory_signature_state === "signed"
    )
      return "Generate PDF";
    if (
      c.buyer_signature_state === "signed" ||
      c.factory_signature_state === "signed"
    )
      return "Other party sign";
    return "Awaiting signatures";
  })();
  const statusLabel =
    ls === "draft"
      ? "Draft"
      : ls === "pending_signature"
        ? "Pending"
        : ls === "signed"
          ? "Signed"
          : "Archived";
  const pdfStatus =
    artifactStatus === "generated" || artifactStatus === "locked"
      ? "ready"
      : "pending";
  const buyerSign = c.buyer_signature_state || "pending";
  const factorySign = c.factory_signature_state || "pending";
  const timelineIdx =
    ls === "archived"
      ? 7
      : ls === "signed"
        ? 6
        : ls === "pending_signature"
          ? 5
          : 2;
  return {
    id: c.id,
    contract_number: c.contract_number || c.id,
    status: statusLabel,
    title: c.title || "",
    buyer: c.buyer_name || "",
    factory: c.factory_name || "",
    date: c.created_at ? new Date(c.created_at).toLocaleDateString() : "",
    next,
    buyerSign,
    factorySign,
    pdf: pdfStatus,
    timeline: TIMELINE,
    timelineIdx,
    raw: c,
  };
}

import { cn } from "../lib/cn";

const icons = {
  vault: (props) => <Package {...props} />,
  dashboard: (props) => <LayoutDashboard {...props} />,
  bell: (props) => <Bell {...props} />,
  plus: (props) => <Plus {...props} />,
  refresh: (props) => <RefreshCw {...props} />,
  search: (props) => <Search {...props} />,
  help: (props) => <HelpCircle {...props} />,
  chat: (props) => <MessageSquare {...props} />,
  lock: (props) => <Lock {...props} />,
  download: (props) => <Download {...props} />,
  shield: (props) => <Shield {...props} />,
  check: (props) => <Check {...props} />,
  file: (props) => <File {...props} />,
  phone: (props) => <Phone {...props} />,
  calendar: (props) => <Calendar {...props} />,
};

function Pill({ children, tone = "default" }) {
  const tones = {
    default: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80",
    blue: "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-300",
    green:
      "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300",
    amber:
      "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300",
    violet:
      "bg-violet-500/10 text-violet-700 ring-1 ring-violet-500/20 dark:text-violet-300",
    red: "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

function SectionCard({ title, subtitle, right, children }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_20px_60px_rgba(2,8,23,0.4)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          ) : null}
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
                : "border-slate-300 bg-white text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-400",
          )}
        >
          {done ? <icons.check className="h-4 w-4" /> : active ? "•" : "○"}
        </div>
        {!last ? (
          <div
            className={cn(
              "mt-2 h-10 w-px",
              done ? "bg-sky-400/80" : "bg-slate-200 dark:bg-white/10",
            )}
          />
        ) : null}
      </div>
      <div className="pb-4 pt-1">
        <div
          className={cn(
            "text-sm font-medium",
            active || done
              ? "text-slate-900 dark:text-white"
              : "text-slate-500 dark:text-slate-400",
          )}
        >
          {label}
        </div>
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
          : "bg-slate-50 text-slate-700 hover:bg-sky-50 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10",
      )}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "grid h-8 w-8 place-items-center rounded-xl",
            active ? "bg-white/15" : "bg-white dark:bg-white/10",
          )}
        >
          {icon({ className: "h-4 w-4" })}
        </span>
        {label}
      </span>
      {count ? (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold",
            active
              ? "bg-white/15 text-white"
              : "bg-sky-500/10 text-sky-600 dark:text-sky-300",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

function MetaChip({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-100 px-3 py-2 dark:bg-white/5">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </div>
    </div>
  );
}

function DetailPanel({ icon, title, body }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
          {icon}
        </span>
        {title}
      </div>
      <div className="mt-3">{body}</div>
    </div>
  );
}

function StatusCard({ label, status }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
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
          : "border-sky-500/20 bg-sky-500/5 text-slate-900 hover:-translate-y-0.5 dark:text-white",
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="grid h-7 w-7 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
          {icon}
        </span>
        {title}
      </div>
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {subtitle}
      </div>
    </button>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function Input({ label, value, placeholder, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
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
      <span
        className={cn(
          "grid h-6 w-6 place-items-center rounded-full text-xs font-bold",
          done
            ? "bg-emerald-500 text-white"
            : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400",
        )}
      >
        {done ? "✓" : "•"}
      </span>
      <span className="font-medium text-slate-900 dark:text-white">{step}</span>
    </div>
  );
}

function isOwnerLevel(user) {
  return user?.role === "owner" || user?.role === "admin";
}

export default function ContractVaultPage({ embedded = false }) {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState("All");
  const [saving, setSaving] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    type: "bank_transfer",
    transaction_reference: "",
    bank_name: "",
    sender_account_name: "",
    receiver_account_name: "",
    transaction_date: "",
    amount: "",
    currency: "USD",
  });
  const PAYMENT_FORM_RESET = {
    type: "bank_transfer",
    transaction_reference: "",
    bank_name: "",
    sender_account_name: "",
    receiver_account_name: "",
    transaction_date: "",
    amount: "",
    currency: "USD",
  };

  const mainRef = useRef(null);
  const [mainHeight, setMainHeight] = useState(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el || !embedded) return;
    const ro = new ResizeObserver(([entry]) =>
      setMainHeight(entry.contentRect.height),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [embedded]);

  useEffect(() => {
    let cancelled = false;
    let contractsDone = false;
    let userDone = false;

    function tryDone() {
      if (contractsDone && userDone && !cancelled) {
        setPageLoading(false);
      }
    }

    (async () => {
      try {
        const data = await apiRequest("/documents/contracts", {
          token: getToken(),
        });
        if (cancelled) return;
        const mapped = (Array.isArray(data) ? data : [])
          .map(mapContract)
          .filter(Boolean);
        setContracts(mapped);
        if (mapped.length > 0) setSelectedId(mapped[0].id);
      } catch (err) {
        logger.warn("Failed to load contracts", err);
        setFeedback("Failed to load contracts.");
      } finally {
        contractsDone = true;
        tryDone();
      }
    })();

    (async () => {
      try {
        await syncUserFromApi(getToken());
      } finally {
        userDone = true;
        tryDone();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const contract =
    contracts.find((c) => c.id === selectedId) || contracts[0] || null;
  const currentUser = useMemo(() => getCurrentUser(), []);
  const navigate = useNavigate();

  const [calls, setCalls] = useState([]);
  const [paymentProofs, setPaymentProofs] = useState([]);

  const loadContracts = async () => {
    try {
      const data = await apiRequest("/documents/contracts", {
        token: getToken(),
      });
      const mapped = (Array.isArray(data) ? data : [])
        .map(mapContract)
        .filter(Boolean);
      setContracts(mapped);
    } catch (err) {
      logger.warn("Failed to load contracts", err);
    }
  };

  const handleNewDraft = async () => {
    try {
      const newContract = await apiRequest("/contracts", {
        method: "POST",
        token: getToken(),
        body: { status: "draft", title: "Untitled" },
      });
      await loadContracts();
      if (newContract?.id) setSelectedId(newContract.id);
    } catch (err) {
      logger.warn("Failed to create draft", err);
    }
  };

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    apiRequest(`/contracts/${selectedId}/calls`, { token: getToken() })
      .then((data) => {
        if (!cancelled) setCalls(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setCalls([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const refreshPaymentProofs = async () => {
    if (!contract?.id) return;
    try {
      const data = await apiRequest(
        `/contracts/${contract.id}/payment-proofs`,
        {
          token: getToken(),
        },
      );
      setPaymentProofs(Array.isArray(data) ? data : []);
    } catch {
      setPaymentProofs([]);
    }
  };

  useEffect(() => {
    if (!contract?.id) return;
    let cancelled = false;
    apiRequest(`/contracts/${contract.id}/payment-proofs`, {
      token: getToken(),
    })
      .then((data) => {
        if (cancelled) return;
        setPaymentProofs(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setPaymentProofs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [contract?.id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !contract?.id) return;
    try {
      await uploadFile("/documents", {
        file,
        fields: { contract_id: contract.id, type: "payment_proof" },
      });
      await refreshPaymentProofs();
    } catch (err) {
      logger.warn("Failed to upload file", err);
    }
  };

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      const matchesQuery = [
        c.id,
        c.contract_number,
        c.status,
        c.title,
        c.buyer,
        c.factory,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesTab =
        tab === "All" ? true : c.status.toLowerCase() === tab.toLowerCase();
      return matchesQuery && matchesTab;
    });
  }, [query, tab, contracts]);

  const shell = theme === "dark" ? "dark" : "";

  const runAction = async (actionFn, errorMsg) => {
    setSaving(true);
    try {
      await actionFn();
    } catch (err) {
      logger.error(err.message || errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const cid = contract?.id || "";

  const handleESign = async () => {
    const token = getToken();
    if (!token || !cid) return;
    await runAction(async () => {
      const res = await apiRequest(`/documents/contracts/${cid}/sign-session`, {
        method: "POST",
        token,
      });
      if (res?.signing_url) {
        window.open(res.signing_url, "_blank");
      }
    }, "Failed to create session");
  };

  const handleDownloadPdf = () => {
    const pdfPath = contract?.raw?.artifact?.pdf_path;
    if (pdfPath) {
      window.open(`${API_BASE}${pdfPath}`, "_blank");
    }
  };

  const handleBuyerSign = async () => {
    const token = getToken();
    if (!token || !cid) return;
    await runAction(async () => {
      await apiRequest(`/documents/contracts/${cid}/signatures`, {
        method: "PATCH",
        token,
        body: { buyer_signature_state: "signed", is_draft: false },
      });
    }, "Failed to sign");
  };

  const handleFactorySign = async () => {
    const token = getToken();
    if (!token || !cid) return;
    await runAction(async () => {
      await apiRequest(`/documents/contracts/${cid}/signatures`, {
        method: "PATCH",
        token,
        body: { factory_signature_state: "signed", is_draft: false },
      });
    }, "Failed to sign");
  };

  const handleLockPdf = async () => {
    const token = getToken();
    if (!token || !cid) return;
    await runAction(async () => {
      await apiRequest(`/documents/contracts/${cid}/artifact`, {
        method: "PATCH",
        token,
        body: { status: "locked" },
      });
    }, "Failed to lock");
  };

  const handleArchive = async () => {
    const token = getToken();
    if (!token || !cid) return;
    await runAction(async () => {
      await apiRequest(`/documents/contracts/${cid}/artifact`, {
        method: "PATCH",
        token,
        body: { status: "archived" },
      });
    }, "Failed to archive");
  };

  const handleSubmitProof = async () => {
    const token = getToken();
    if (!token || !cid) return;
    await runAction(async () => {
      await apiRequest("/payment-proofs", {
        method: "POST",
        token,
        body: {
          contract_id: cid,
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
      setPaymentForm({ ...PAYMENT_FORM_RESET });
      setFeedback("Payment proof submitted successfully.");
    }, "Failed to submit proof");
  };

  const canSign = currentUser && isOwnerLevel(currentUser);

  if (pageLoading) {
    if (embedded)
      return (
        <div className="flex items-center justify-center py-12">
          <NeonAtom />
        </div>
      );
    return <NeonAtom fill />;
  }
  if (!contract) {
    if (embedded) {
      return (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          No contracts found.
        </div>
      );
    }
    return (
      <div className={shell}>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">
            No contracts found.
          </p>
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <aside
      data-lenis-prevent
      className="flex flex-col overflow-y-auto scrollbar-hide max-h-full rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_20px_60px_rgba(2,8,23,0.4)]"
    >
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-sky-600 dark:text-sky-300">
            <icons.vault className="h-5 w-5" />
            Vault
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
            Contract Vault
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Draft → Sign → PDF artifact → Lock → Archive
          </p>
        </div>
        {!embedded && (
          <button
            onClick={() => {
              toggleTheme();
              window.dispatchEvent(new Event("theme-change"));
            }}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        )}
      </div>

      {!embedded && (
        <div className="mt-6 grid gap-2 shrink-0">
          <NavItem
            icon={icons.dashboard}
            label="Dashboard"
            onClick={() => navigate("/owner")}
          />
          <NavItem
            icon={icons.bell}
            label="Notifications"
            onClick={() => navigate("/notifications")}
          />
          <NavItem
            icon={icons.plus}
            label="New draft"
            onClick={handleNewDraft}
          />
          <NavItem icon={icons.file} label="Contracts" active />
          <NavItem
            icon={icons.refresh}
            label="Refresh"
            onClick={loadContracts}
          />
        </div>
      )}

      <div className="shrink-0">
        <ScrollReveal as="section">
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
                aria-label="Search contracts"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <span className="ml-3 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Ctrl K
              </span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section">
          <div className="mt-6 flex flex-wrap gap-2">
            {["All", "Draft", "Pending", "Signed", "Archived"].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition",
                  tab === item
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-500/20"
                    : "bg-slate-100 text-slate-700 hover:bg-sky-50 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <div className="flex-1 min-h-0 mt-6">
        <StaggerContainer className="space-y-3">
          {filtered.map((c) => (
            <StaggerItem key={c.id}>
              <button
                layout
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  "w-full rounded-3xl border p-4 text-left transition hover:-translate-y-0.5",
                  selectedId === c.id
                    ? "border-sky-500/40 bg-sky-500/10 shadow-lg shadow-sky-500/10 dark:bg-sky-400/10"
                    : "border-slate-200 bg-white/70 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {c.id}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Pill tone="green">{c.status}</Pill>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {c.title}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                    {c.date}
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  Buyer: {c.buyer} · Factory: {c.factory}
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-3">
                  <MetaChip label="Next" value={c.next} />
                  <MetaChip label="Buyer" value={c.buyerSign} />
                  <MetaChip label="Factory" value={c.factorySign} />
                </div>
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </aside>
  );

  const vaultContent = (
    <div
      className={cn(
        embedded
          ? "flex flex-col xl:flex-row max-h-full gap-4 items-start"
          : "grid max-h-full gap-4 xl:grid-cols-[280px_minmax(0,1fr)]",
      )}
    >
      {embedded ? (
        <div
          className="w-full xl:w-[280px] shrink-0"
          style={{ maxHeight: mainHeight ? `${mainHeight}px` : undefined }}
        >
          {sidebarContent}
        </div>
      ) : (
        <CardStack className="h-full">{sidebarContent}</CardStack>
      )}

      {feedback && (
        <div className="fixed top-4 right-4 z-50 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {feedback}
          <button
            onClick={() => setFeedback("")}
            className="ml-3 text-white/70 hover:text-white"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <main
        ref={mainRef}
        data-lenis-prevent
        className={cn(
          embedded
            ? "flex-1 min-w-0 min-h-0 overflow-y-auto scrollbar-hide max-h-full"
            : "grid overflow-y-auto scrollbar-hide max-h-full xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]",
        )}
      >
        <div className="space-y-4">
          <ScrollReveal as="section">
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
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        Journey Timeline
                      </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Video calls are recommended before finalizing contracts.
                        No recorded call is linked to this contract yet.
                      </div>
                    </div>
                    <Pill tone="blue">Help</Pill>
                  </div>
                  <div className="mt-4 space-y-0">
                    {contract.timeline.map((step, idx) => (
                      <Step
                        key={step}
                        label={step}
                        done={idx < contract.timelineIdx}
                        active={idx === contract.timelineIdx}
                        last={idx === contract.timeline.length - 1}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/chat")}
                    className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5"
                  >
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
                          <StatusCard
                            label="Buyer"
                            status={contract.buyerSign}
                          />
                          <StatusCard
                            label="Factory"
                            status={contract.factorySign}
                          />
                        </div>
                        {contract?.raw?.payment_proof_accepted === false && (
                          <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100">
                            Warning: No accepted payment proof yet. You may
                            continue, but proof is strongly recommended for
                            safety.
                          </div>
                        )}
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <ActionButton
                            icon={<icons.check className="h-4 w-4" />}
                            title="Buyer sign"
                            subtitle={
                              canSign ? "Sign as buyer" : "Already signed."
                            }
                            disabled={
                              !canSign || contract.buyerSign === "signed"
                            }
                            onClick={handleBuyerSign}
                          />
                          <ActionButton
                            icon={<icons.shield className="h-4 w-4" />}
                            title="Factory sign"
                            subtitle={
                              canSign ? "Sign as factory" : "Already signed."
                            }
                            disabled={
                              !canSign || contract.factorySign === "signed"
                            }
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
                          <span>
                            PDF generates automatically after both signatures.
                          </span>
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
          </ScrollReveal>

          <ScrollReveal as="section">
            <div className="grid gap-4 lg:grid-cols-2">
              <SectionCard
                title="Banking references (optional)"
                subtitle="For fraud prevention only. No direct payments are processed on-platform."
                right={<Pill tone="violet">Visible</Pill>}
              >
                <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Row
                    label="Bank name"
                    value={contract?.raw?.bank_name || "—"}
                  />
                  <Row
                    label="Beneficiary"
                    value={contract?.raw?.beneficiary_name || "—"}
                  />
                  <Row
                    label="Transaction reference"
                    value={contract?.raw?.transaction_reference || "—"}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Payment proof workflow"
                subtitle="Submit bank transfer or LC documents. Seller review sets status, disputes trigger internal admin review."
                right={
                  <button
                    onClick={refreshPaymentProofs}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  >
                    Refresh
                  </button>
                }
              >
                <div className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Proof type
                    </label>
                    <select
                      value={paymentForm.type}
                      onChange={(e) =>
                        setPaymentForm((p) => ({
                          ...p,
                          type: e.target.value,
                        }))
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950"
                    >
                      <option value="bank_transfer">Bank transfer</option>
                      <option value="lc">Letter of credit (LC)</option>
                    </select>
                    <Input
                      label="Transaction reference"
                      value={paymentForm.transaction_reference}
                      placeholder="Enter reference"
                      onChange={(e) =>
                        setPaymentForm((p) => ({
                          ...p,
                          transaction_reference: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label="Bank name"
                      value={paymentForm.bank_name}
                      placeholder="Bank name"
                      onChange={(e) =>
                        setPaymentForm((p) => ({
                          ...p,
                          bank_name: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label="Sender account name"
                      value={paymentForm.sender_account_name}
                      placeholder="Sender account"
                      onChange={(e) =>
                        setPaymentForm((p) => ({
                          ...p,
                          sender_account_name: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label="Receiver/company account name"
                      value={paymentForm.receiver_account_name}
                      placeholder="Receiver account"
                      onChange={(e) =>
                        setPaymentForm((p) => ({
                          ...p,
                          receiver_account_name: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label="mm/dd/yyyy"
                      value={paymentForm.transaction_date}
                      placeholder="Date"
                      onChange={(e) =>
                        setPaymentForm((p) => ({
                          ...p,
                          transaction_date: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label="Amount"
                      value={paymentForm.amount}
                      placeholder="USD"
                      onChange={(e) =>
                        setPaymentForm((p) => ({
                          ...p,
                          amount: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <label className="block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
                    <span className="mb-2 block font-medium">
                      Upload proof document
                    </span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      aria-label="Upload payment proof file"
                      className="block w-full text-sm"
                    />
                  </label>
                  <button
                    onClick={handleSubmitProof}
                    disabled={saving}
                    className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:opacity-50"
                  >
                    Submit proof
                  </button>
                  {paymentProofs.length > 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-white/10 dark:bg-slate-950">
                      {paymentProofs.map((proof, idx) => (
                        <div
                          key={proof.id || idx}
                          className="flex items-center justify-between py-1 text-slate-700 dark:text-slate-300"
                        >
                          <span>
                            {proof.type ||
                              proof.transaction_reference ||
                              `Proof ${idx + 1}`}
                          </span>
                          <Pill
                            tone={
                              proof.status === "accepted"
                                ? "green"
                                : proof.status === "rejected"
                                  ? "red"
                                  : "amber"
                            }
                          >
                            {proof.status || "pending"}
                          </Pill>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400">
                      No proofs submitted yet.
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          </ScrollReveal>
        </div>

        <div className="space-y-4">
          <ScrollReveal as="section">
            <SectionCard
              title="Contract Snapshot"
              subtitle="Focused, premium, and ready for review"
              right={<Pill tone="blue">Premium</Pill>}
            >
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <Row label="Status" value={contract.status} />
                <Row label="Next" value={contract.next} />
                <Row label="Buyer sign" value={contract.buyerSign} />
                <Row label="Factory sign" value={contract.factorySign} />
                <Row label="PDF" value={contract.pdf} />
                <Row label="Date" value={contract.date} />
              </div>
            </SectionCard>

            <SectionCard
              title="Call recordings"
              subtitle="Recorded calls are stored for dispute resolution and security (project.md)."
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900 dark:text-white">
                    Call recordings
                  </span>
                  <icons.phone className="h-4 w-4 text-sky-500" />
                </div>
                {calls.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {calls.map((call, idx) => (
                      <li
                        key={call.id || idx}
                        className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm dark:bg-slate-950"
                      >
                        <span className="text-slate-700 dark:text-slate-300">
                          {call.title || call.id || `Call ${idx + 1}`}
                        </span>
                        {call.recording_url && (
                          <a
                            href={call.recording_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:underline dark:text-sky-400"
                          >
                            Listen
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    No calls linked to this contract yet.
                  </p>
                )}
              </div>
            </SectionCard>

            <SectionCard
              title="Artifact audit"
              subtitle="Generated, versioned, and traceable"
            >
              <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-300">
                {(() => {
                  const a = contract?.raw?.artifact || {};
                  const signers = a?.signer_ids;
                  const timestamps = a?.signature_timestamps;
                  return (
                    <>
                      <Row label="Status" value={a?.status || "—"} />
                      <Row
                        label="Generated at"
                        value={a?.generated_at || "—"}
                      />
                      <Row
                        label="Version"
                        value={a?.version != null ? String(a.version) : "—"}
                      />
                      <Row label="Hash" value={a?.pdf_hash || "—"} />
                      <Row
                        label="Signer IDs"
                        value={
                          signers
                            ? `Buyer ${signers.buyer_id || "—"} · Factory ${signers.factory_id || "—"}`
                            : "—"
                        }
                      />
                      <Row
                        label="Signature timestamps"
                        value={
                          timestamps
                            ? `Buyer ${timestamps.buyer_signed_at || "—"} · Factory ${timestamps.factory_signed_at || "—"}`
                            : "—"
                        }
                      />
                    </>
                  );
                })()}
              </div>
            </SectionCard>

            <SectionCard
              title="Contract Audit Trail"
              subtitle="Premium access gate"
            >
              {(() => {
                const cu = getCurrentUser();
                const hasPremium =
                  cu?.subscription_status === "premium" ||
                  cu?.plan === "premium" ||
                  cu?.role === "owner" ||
                  cu?.role === "admin";
                if (hasPremium) {
                  return (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        All actions on this contract are logged and timestamped.
                      </p>
                      {contract?.raw?.audit_log?.length > 0 ? (
                        contract.raw.audit_log.slice(0, 10).map((entry, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900"
                          >
                            <div className="mt-0.5 h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {entry.action}
                              </p>
                              <p className="text-xs text-slate-500">
                                {entry.performed_by} · {entry.timestamp}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No audit trail entries yet.
                        </p>
                      )}
                    </div>
                  );
                }
                return (
                  <div className="rounded-3xl border border-dashed border-sky-400/30 bg-sky-500/5 p-6 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-500/20">
                      <icons.lock className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                      Premium
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Premium plan required to view the contract audit trail.
                    </p>
                    <button
                      onClick={() => navigate("/pricing")}
                      className="mt-4 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                );
              })()}
            </SectionCard>

            <SectionCard
              title="Workflow summary"
              subtitle="Every single thing in one place"
            >
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <SummaryRow step="Draft" done />
                <SummaryRow
                  step="Buyer sign"
                  done={contract.buyerSign === "signed"}
                />
                <SummaryRow
                  step="Factory sign"
                  done={contract.factorySign === "signed"}
                />
                <SummaryRow
                  step="Lock PDF"
                  done={
                    contract?.raw?.artifact?.status === "locked" ||
                    contract?.raw?.artifact?.status === "archived"
                  }
                />
                <SummaryRow
                  step="Archive"
                  done={contract?.raw?.lifecycle_status === "archived"}
                />
              </div>
            </SectionCard>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );

  if (embedded) return vaultContent;

  return (
    <div className={shell}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_24%),linear-gradient(180deg,#f8fbff_0%,#eef7ff_40%,#eaf3ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.24),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(125,211,252,0.12),_transparent_22%),linear-gradient(180deg,#020617_0%,#07111f_45%,#08111b_100%)] dark:text-white">
        <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
          {vaultContent}
        </div>
      </div>
    </div>
  );
}
