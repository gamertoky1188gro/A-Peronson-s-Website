/*
  Route: /buyer/:id
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Render the Buyer profile (overview + requests).
    - Show trust indicators (verification summary, credibility meter, verified badge).
    - Provide relationship actions (follow/connect/message).

  Key API endpoints:
    - GET /api/profiles/:id
    - GET /api/ratings/profiles/user::id (public ratings summary)
    - GET /api/profiles/:id/requests?cursor=...
*/
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { apiRequest, getCurrentUser, getToken } from "../lib/auth";
import { usePremiumCheck } from "../hooks/useSecureUser";
import { trackClientEvent } from "../lib/events";
import { recordLeadSource } from "../lib/leadSource";
import VerificationPanel from "../components/profile/VerificationPanel";
import CrmSummaryPanel from "../components/profile/CrmSummaryPanel";
import JourneyTimeline from "../components/JourneyTimeline";
import NeonAtom from "../components/ui/NeonAtom";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  CircleDashed,
  ClipboardList,
  Clock3,
  Edit3,
  ExternalLink,
  Eye,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  Trash2,
  Users,
  Sparkles,
  Rocket,
  UserRound,
  BriefcaseBusiness,
  Building,
} from "lucide-react";

const Motion = motion;

function roleToRoute(role, id) {
  if (!id) return "/feed";
  if (role === "buyer") return `/buyer/${encodeURIComponent(id)}`;
  if (role === "buying_house") return `/buying-house/${encodeURIComponent(id)}`;
  return `/factory/${encodeURIComponent(id)}`;
}

function isBoostActive(boost) {
  if (!boost) return false;
  if (String(boost.status || "").toLowerCase() !== "active") return false;
  const now = Date.now();
  const startsAt = new Date(boost.starts_at).getTime();
  const endsAt = new Date(boost.ends_at).getTime();
  if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false;
  return now >= startsAt && now <= endsAt;
}

function Pill({ children, tone = "default", title }) {
  const tones = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    info: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    premium: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white",
    danger: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  };
  return (
    <span title={title} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone] || tones.default}`}>
      {children}
    </span>
  );
}

function Metric({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</div>
      {helper ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</div> : null}
    </div>
  );
}

function AvatarFallback({ name, imageUrl }) {
  const initials = (n) => {
    if (!n) return "?";
    return n.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
  };
  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-500 via-cyan-400 to-indigo-500 p-[2px] shadow-xl">
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.15rem] bg-slate-100 text-2xl font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-100">
        {imageUrl ? (
          <img src={imageUrl} alt={name || "Profile avatar"} className="h-full w-full object-cover" />
        ) : (
          initials(name)
        )}
      </div>
    </div>
  );
}

function SoftCard({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-slate-200/70 bg-white/75 p-4 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/65 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-4 w-4 text-sky-500" /> : null}
          <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
        {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default function BuyerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useMemo(() => getToken(), []);
  const currentUser = useMemo(() => getCurrentUser(), []);
  const { isPremium: isPremiumFromApi } = usePremiumCheck();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [certification, setCertification] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [requests, setRequests] = useState([]);
  const [requestsCursor, setRequestsCursor] = useState(0);
  const [requestsNext, setRequestsNext] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [profileBoost, setProfileBoost] = useState(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const coverParallax = useSpring(useTransform(scrollY, [0, 400], [0, 60]), {
    stiffness: 80, damping: 20, restDelta: 0.001,
  });
  const journeyParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const user = profile?.user || null;
  const verification = profile?.verification_summary || null;
  const relationship = profile?.relationship || {
    following: false,
    friend_status: "none",
  };
  const viewerPerms = profile?.viewer_permissions || {
    is_self: false,
    is_admin: false,
  };
  const isBoosted = Boolean(profileBoost);
  const isPremium =
    isPremiumFromApi ||
    String(user?.subscription_status || "").toLowerCase() === "premium" ||
    profile?.effective_plan === "premium";
  const isSelfOrAdmin = viewerPerms.is_self || viewerPerms.is_admin;
  const brandProfile = isSelfOrAdmin
    ? (profile?.profile_private || user?.profile || {})
    : {};
  const hasBrandKit = Boolean(
    brandProfile.brand_name ||
    brandProfile.brand_logo_url ||
    brandProfile.brand_tagline ||
    brandProfile.brand_website,
  );
  const hasAccountManager = Boolean(
    brandProfile.account_manager_name ||
    brandProfile.account_manager_email ||
    brandProfile.account_manager_phone,
  );
  const isCertified =
    String(certification?.status || "").toLowerCase() === "certified";

  const loadProfile = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest(`/profiles/${encodeURIComponent(id)}`, {
        token,
      });
      if (data?.user?.role && data.user.role !== "buyer") {
        navigate(roleToRoute(data.user.role, id), { replace: true });
        return;
      }
      setProfile(data);
    } catch (err) {
      setError(err.message || "Failed to load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [id, navigate, token]);

  const loadRatings = useCallback(async () => {
    if (!id) return;
    try {
      const data = await apiRequest(
        `/ratings/profiles/user:${encodeURIComponent(id)}`,
        { token: "" },
      );
      setRatingSummary(data || null);
    } catch {
      setRatingSummary(null);
    }
  }, [id]);

  const loadCertification = useCallback(async () => {
    if (!id || !token) return;
    try {
      const data = await apiRequest(
        `/certifications/org/${encodeURIComponent(id)}`,
        { token },
      );
      setCertification(data?.summary || null);
    } catch {
      setCertification(null);
    }
  }, [id, token]);

  const loadRequests = useCallback(
    async ({ reset }) => {
      if (!id) return;
      const cursor = reset ? 0 : requestsCursor;
      setLoadingRequests(true);
      try {
        const data = await apiRequest(
          `/profiles/${encodeURIComponent(id)}/requests?cursor=${cursor}&limit=10`,
          { token },
        );
        const rows = Array.isArray(data?.items) ? data.items : [];
        setRequests((prev) => (reset ? rows : [...prev, ...rows]));
        setRequestsCursor(reset ? 10 : cursor + 10);
        setRequestsNext(data?.next_cursor ?? null);
      } catch {
      } finally {
        setLoadingRequests(false);
      }
    },
    [id, requestsCursor, token],
  );

  useEffect(() => {
    loadProfile();
    loadRatings();
    loadCertification();
  }, [loadProfile, loadRatings, loadCertification]);

  useEffect(() => {
    if (!user?.id) return;
    trackClientEvent("profile_view", {
      entityType: "profile",
      entityId: user.id,
      metadata: { role: user.role || "buyer" },
    });
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (!viewerPerms.is_self) return;
    const tokenValue = getToken();
    if (!tokenValue) return;
    apiRequest("/boosts/me", { token: tokenValue })
      .then((data) => {
        const active = (data?.items || []).find(
          (boost) => boost.scope === "profile" && isBoostActive(boost),
        );
        setProfileBoost(active || null);
      })
      .catch(() => setProfileBoost(null));
  }, [viewerPerms.is_self]);

  useEffect(() => {
    if (activeTab !== "requests") return;
    if (requests.length) return;
    loadRequests({ reset: true });
  }, [activeTab, loadRequests, requests.length]);

  async function follow() {
    if (!id) return;
    try {
      const res = await apiRequest(`/users/${encodeURIComponent(id)}/follow`, {
        method: "POST",
        token,
      });
      setProfile((prev) =>
        prev
          ? { ...prev, relationship: res?.relation || prev.relationship }
          : prev,
      );
    } catch {
    }
  }

  async function connect() {
    if (!id) return;
    try {
      const res = await apiRequest(
        `/users/${encodeURIComponent(id)}/friend-request`,
        { method: "POST", token },
      );
      setProfile((prev) =>
        prev
          ? { ...prev, relationship: res?.relation || prev.relationship }
          : prev,
      );
    } catch {
    }
  }

  function contact() {
    if (id) {
      recordLeadSource({
        type: "direct",
        id: `profile:${id}`,
        label: `Profile: ${user?.name || "buyer"}`,
      });
    }
    navigate("/chat", {
      state: {
        notice: `Contacting ${user?.name || "buyer"}. If you are unverified, your first message may appear as a request.`,
      },
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.02),rgba(2,6,23,0))] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.22),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))] p-6 text-slate-700 dark:text-slate-200">
        Loading profile...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.02),rgba(2,6,23,0))] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.22),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))] p-6 text-rose-700 dark:text-rose-200">
        {error}
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.02),rgba(2,6,23,0))] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.22),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))] p-6 text-slate-700 dark:text-slate-200">
        Profile not found.
      </div>
    );
  }

  const displayName = user?.name || "Buyer profile";
  const country = user?.profile?.country || "—";
  const industry = user?.profile?.industry || "Garments & Textile";
  const organization = user?.profile?.organization_name || user?.profile?.organization || user?.name || "—";
  const avg = ratingSummary?.aggregate?.average_score ?? 0;
  const totalRatings = ratingSummary?.aggregate?.total_count ?? 0;
  const totalRequests = profile?.counts?.requests ?? 0;
  const joinedYear = user?.created_at ? new Date(user.created_at).getFullYear() : "—";

  const badges = [
    user?.verified ? { label: "Verified", icon: ShieldCheck, tone: "info" } : null,
    isCertified ? { label: "Certified", icon: BadgeCheck, tone: "success" } : null,
    isPremium ? { label: "Premium Reach", icon: Sparkles, tone: "premium", title: "Boosted visibility enabled for Premium" } : null,
    isBoosted ? { label: "Boosted", icon: Rocket, tone: "success" } : null,
  ].filter(Boolean);

  const coverImage = user?.profile?.cover_image_url;
  const avatarImage = user?.profile?.profile_image;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.02),rgba(2,6,23,0))] text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.22),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))] dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:text-sky-300"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Role: <span className="font-medium text-slate-700 dark:text-slate-200">buyer</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_0.85fr]">
          <div className="w-full space-y-6">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={reduceMotion ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-[0_24px_100px_rgba(14,165,233,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70"
            >
              <div className="relative h-[280px] overflow-hidden sm:h-[340px]">
                {coverImage ? (
                  <motion.img
                    src={coverImage}
                    alt="Cover"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ y: reduceMotion ? 0 : coverParallax }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.22),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(14,165,233,0.3))]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex items-end gap-4">
                      <div className="-mb-10 sm:-mb-12">
                        <AvatarFallback name={displayName} imageUrl={avatarImage} />
                      </div>
                      <div className="pb-1 text-white">
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{displayName}</h1>
                          <Pill tone="info">Buyer</Pill>
                          {country !== "—" ? (
                            <Pill tone="info"><MapPin className="h-3.5 w-3.5" /> {country}</Pill>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-200/90">{organization}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {badges.map((badge) => (
                            <Pill key={badge.label} tone={badge.tone} title={badge.title}>
                              {badge.label}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pb-1">
                      <button
                        onClick={contact}
                        className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-400"
                      >
                        <Mail className="h-4 w-4" /> Contact
                      </button>
                      <button
                        onClick={follow}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                      >
                        <Heart className={`h-4 w-4 ${relationship.following ? "fill-white" : ""}`} /> {relationship.following ? "Following" : "Follow"}
                      </button>
                      <button
                        onClick={connect}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                      >
                        <Users className="h-4 w-4" /> {relationship.friend_status === "friends" ? "Connected" : relationship.friend_status === "requested" ? "Requested" : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 pt-12 sm:grid-cols-2 lg:grid-cols-4 lg:pt-14">
                <Metric label="Trust" value={<span className="inline-flex items-center gap-2">{user?.verified ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <CircleDashed className="h-4 w-4 text-slate-400" />} {user?.verified ? "Verified" : "Unverified"}</span>} helper="Identity signal" />
                <Metric label="Rating" value={<span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /> {avg.toFixed(1)} / 5</span>} helper={`${totalRatings} reviews`} />
                <Metric label="Requests" value={`${totalRequests} request${totalRequests === 1 ? "" : "s"}`} helper="Posted on the platform" />
                <Metric label="Joined" value={joinedYear} helper={profile?.effective_plan ? `Plan: ${profile.effective_plan}` : "Account age"} />
              </div>
            </motion.div>

            <SoftCard>
              <div className="flex flex-wrap gap-2">
                {["overview", "requests", "work", "reviews"].map((tab) => {
                  const active = activeTab === tab;
                  const label = tab === "overview" ? "Overview" : tab === "work" ? "Work History" : tab === "requests" ? "Requests" : "Reviews";
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </SoftCard>

            <AnimatePresence mode="wait">
              {activeTab === "overview" ? (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <SoftCard>
                    <SectionTitle icon={Eye} title="About" subtitle="Buyer profile summary and positioning." />
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                      {user?.profile?.about || "No description added yet."}
                    </p>
                  </SoftCard>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <SoftCard>
                      <SectionTitle icon={ClipboardList} title="Core Profile" subtitle="Quick facts and profile metadata." />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Metric label="Country" value={user?.profile?.country || "—"} />
                        <Metric label="Certifications" value={(user?.profile?.certifications || []).join(", ") || "—"} />
                        <Metric label="Active Since" value={user?.profile?.active_since || new Date().getFullYear()} />
                        <Metric label="Role" value="Buyer" />
                      </div>
                    </SoftCard>

                    <SoftCard>
                      <SectionTitle icon={BriefcaseBusiness} title="Trust Indicators" subtitle="Verification and commercial status." />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Verification Panel</div>
                            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Status and credibility snapshot.</div>
                          </div>
                          <Pill tone={certification?.status === "certified" ? "success" : "default"}>{certification?.status || "Unknown"}</Pill>
                        </div>
                        <Metric label="Signed contracts" value={certification?.signed_contracts ?? 0} />
                        <Metric label="Premium status" value={isPremium ? "Enabled" : "Standard"} helper={isBoosted ? "Boosted visibility active" : "No active profile boost"} />
                      </div>
                    </SoftCard>
                  </div>

                  {hasBrandKit ? (
                    <SoftCard>
                      <SectionTitle icon={Eye} title="Brand Kit" subtitle="Visible only to self or admins." />
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 ring-1 ring-sky-500/10">
                          {brandProfile.brand_logo_url ? (
                            <img src={brandProfile.brand_logo_url} alt="Brand logo" className="h-full w-full object-cover" />
                          ) : (
                            <Building className="h-5 w-5 text-sky-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{brandProfile.brand_name || user?.name}</div>
                          {brandProfile.brand_tagline ? <div className="text-xs text-slate-500 dark:text-slate-400">{brandProfile.brand_tagline}</div> : null}
                          {brandProfile.brand_website ? <div className="text-xs text-slate-500 dark:text-slate-400">{brandProfile.brand_website}</div> : null}
                        </div>
                      </div>
                    </SoftCard>
                  ) : null}

                  {isPremium && hasAccountManager ? (
                    <SoftCard>
                      <SectionTitle icon={Users} title="Dedicated Account Manager" subtitle="Premium support contact." />
                      <div className="grid gap-4 md:grid-cols-3">
                        <Metric label="Name" value={brandProfile.account_manager_name || "Assigned manager"} />
                        <Metric label="Email" value={brandProfile.account_manager_email || "—"} />
                        <Metric label="Phone" value={brandProfile.account_manager_phone || "—"} />
                      </div>
                    </SoftCard>
                  ) : null}

                  <SoftCard>
                    <SectionTitle icon={Building} title="Companies Worked With" subtitle="Selected brand and organizational history." />
                    {(user?.profile?.companies_worked_with || []).length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {(user.profile.companies_worked_with || []).map((company, idx) => (
                          <div key={idx} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 ring-1 ring-sky-500/10">
                              {company.logo ? (
                                <img src={company.logo} alt={company.name || "Company"} className="h-full w-full object-cover" />
                              ) : (
                                <Building2 className="h-5 w-5 text-sky-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{company.name || "Untitled company"}</div>
                              {company.location ? <div className="truncate text-xs text-slate-500 dark:text-slate-400">{company.location}</div> : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400">No companies listed yet.</p>
                    )}
                  </SoftCard>
                </motion.div>
              ) : null}

              {activeTab === "requests" ? (
                <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <SoftCard>
                    <SectionTitle icon={ClipboardList} title="Requests" subtitle="Buyer sourcing demand and procurement details." action={<Pill tone="info">{totalRequests} request{totalRequests === 1 ? "" : "s"}</Pill>} />
                    {viewerPerms.is_self || viewerPerms.is_admin ? (
                      <>
                        <div className="space-y-3">
                          {requests.map((r) => (
                            <div key={r.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{r.category || "Request"}</div>
                                    <Pill tone={r.status === "active" ? "success" : r.status === "pending" ? "warning" : "default"}>{r.status || "Unknown"}</Pill>
                                  </div>
                                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{r.custom_description || ""}</p>
                                </div>
                                <button onClick={contact} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-500/15 dark:text-sky-300">
                                  <MessageSquare className="h-4 w-4" /> Contact
                                </button>
                              </div>
                              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <Metric label="Quantity" value={r.quantity || "-"} />
                                <Metric label="Timeline" value={r.timeline_days || "-"} helper="days" />
                                <Metric label="Material" value={r.material || "-"} />
                                <Metric label="Status" value={r.status || "-"} />
                              </div>
                            </div>
                          ))}
                          {loadingRequests ? (
                            <NeonAtom size={40} text="Loading requests..." />
                          ) : null}
                          {requestsNext !== null && !loadingRequests ? (
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm text-slate-500 dark:text-slate-400">Cursor-based pagination, limit 10.</div>
                              <button
                                type="button"
                                onClick={() => loadRequests({ reset: false })}
                                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                              >
                                Load more
                              </button>
                            </div>
                          ) : null}
                          {!requests.length && !loadingRequests ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/20 dark:text-slate-400">
                              No requests found.
                            </div>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Request details are private</div>
                          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            Only the buyer can view detailed request information to protect business privacy.
                          </p>
                        </div>
                        <Metric label="Total requests posted" value={`${totalRequests} request${totalRequests === 1 ? "" : "s"}`} />
                      </div>
                    )}
                  </SoftCard>
                </motion.div>
              ) : null}

              {activeTab === "work" ? (
                <motion.div key="work" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <SoftCard>
                    <SectionTitle icon={BriefcaseBusiness} title="Work History & Portfolio" subtitle="Previously worked companies and engagement history." />
                    {(user?.profile?.companies_worked_with || []).length > 0 ? (
                      <div className="space-y-3">
                        {(user.profile.companies_worked_with || []).map((company, idx) => (
                          <div key={idx} className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/40">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/15 to-cyan-500/15 ring-1 ring-sky-500/10">
                                {company.logo ? (
                                  <img src={company.logo} alt={company.name || "Company"} className="h-full w-full object-cover" />
                                ) : (
                                  <Building2 className="h-5 w-5 text-sky-500" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{company.name || "Untitled company"}</div>
                                <div className="truncate text-xs text-slate-500 dark:text-slate-400">{company.role || "Role not specified"}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <CalendarDays className="h-4 w-4" /> {company.period || company.location || "Period not specified"}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/20 dark:text-slate-400">
                        No work history added yet.
                      </div>
                    )}
                  </SoftCard>
                </motion.div>
              ) : null}

              {activeTab === "reviews" ? (
                <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <SoftCard>
                    <SectionTitle icon={Star} title="Rating summary" subtitle="Public reviews and confidence scoring." />
                    <div className="grid gap-4 md:grid-cols-3">
                      <Metric label="Average score" value={`${avg.toFixed(1)} / 5`} />
                      <Metric label="Total reviews" value={totalRatings} />
                      <Metric label="Confidence" value={ratingSummary?.aggregate?.reliability?.confidence || "low"} helper="Aggregate reliability" />
                    </div>
                  </SoftCard>

                  <div className="rounded-3xl border border-amber-400/25 bg-amber-500/10 p-4 text-sm leading-7 text-amber-950 dark:text-amber-100">
                    <strong className="font-semibold">Review Policy:</strong> Reviews can only be edited or deleted by the person who wrote them. Profile owners cannot delete reviews to maintain transparency and trust.
                  </div>

                  <SoftCard>
                    <SectionTitle icon={MessageSquare} title="Recent reviews" subtitle="Public feedback from past collaborations." />
                    {(ratingSummary?.recent_reviews || []).length > 0 ? (
                      <div className="space-y-3">
                        {(ratingSummary.recent_reviews || []).map((review) => {
                          const canEdit = currentUser?.id && String(currentUser.id) === String(review.from_user_id || "");
                          return (
                            <div key={review.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Pill tone="warning"><Star className="h-3.5 w-3.5" /> {Number(review.score || 0).toFixed(1)}</Pill>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{review.reviewer_name || "Anonymous"}</div>
                                  </div>
                                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{review.comment || "No comment provided."}</p>
                                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
                                  </div>
                                </div>
                                {canEdit ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:text-sky-300"
                                      onClick={async () => {
                                        const score = window.prompt("Update rating (1-5)", String(review.score || "5"));
                                        if (!score) return;
                                        const comment = window.prompt("Update review comment", review.comment || "");
                                        try {
                                          await apiRequest(`/ratings/${review.id}`, {
                                            method: "PATCH",
                                            token,
                                            body: { score: Number(score), comment: comment ?? "" },
                                          });
                                          await loadRatings();
                                        } catch {}
                                      }}
                                    >
                                      <Edit3 className="h-4 w-4" /> Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-500/15 dark:border-rose-900/60 dark:text-rose-300"
                                      onClick={async () => {
                                        if (!window.confirm("Delete this review?")) return;
                                        try {
                                          await apiRequest(`/ratings/${review.id}`, { method: "DELETE", token });
                                          await loadRatings();
                                        } catch {}
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" /> Delete
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/20 dark:text-slate-400">
                        No reviews yet.
                      </div>
                    )}
                  </SoftCard>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <JourneyTimeline
              title="Journey Timeline"
              matchId={
                journeyParams.get("match_id") ||
                journeyParams.get("journey_match_id") ||
                ""
              }
              contractId={journeyParams.get("contract_id") || ""}
              requirementId={journeyParams.get("requirement_id") || ""}
            />

            <CrmSummaryPanel targetId={user.id} />
          </div>

          <div className="space-y-6 xl:sticky xl:top-6 xl:h-fit">
            <SoftCard>
              <SectionTitle icon={ShieldCheck} title="Verification Panel" subtitle="Shared trust and compliance component." />
              <VerificationPanel summary={verification} />
            </SoftCard>

            {certification ? (
              <SoftCard>
                <SectionTitle icon={BadgeCheck} title="Order Completion Certification" subtitle="Signed contract record." />
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Status</div>
                      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Certification status</div>
                    </div>
                    <Pill tone={certification.status === "certified" ? "success" : "default"}>{certification.status || "pending"}</Pill>
                  </div>
                  <Metric label="Signed contracts" value={certification.signed_contracts ?? 0} />
                </div>
              </SoftCard>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
