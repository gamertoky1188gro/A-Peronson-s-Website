import { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { apiRequest, getToken } from "../lib/auth";
import NeonAtom from "../components/ui/NeonAtom";
import {
  ChevronLeft,
  ShieldCheck,
  MapPin,
  Building2,
  Globe2,
  Mail,
  CalendarDays,
  UserRound,
  SearchX,
  ArrowLeft,
  BadgeCheck,
  Sparkles,
  Shield,
} from "lucide-react";
import usePageMeta from "../lib/usePageMeta";
import { logger } from "../lib/logger";

function Pill({ children, tone = "default" }) {
  const tones = {
    default:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    success:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    info: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    premium: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone] || tones.default}`}
    >
      {children}
    </span>
  );
}

function Metric({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </div>
      {helper ? (
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {helper}
        </div>
      ) : null}
    </div>
  );
}

function SoftCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200/70 bg-white/75 p-4 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/65 ${className}`}
    >
      {children}
    </div>
  );
}

function AvatarFallback({ name, imageUrl }) {
  const initials = (n) => {
    if (!n) return "?";
    return n
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");
  };
  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-500 via-cyan-400 to-indigo-500 p-[2px] shadow-xl">
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.15rem] bg-slate-100 text-2xl font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name || "Profile avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          initials(name)
        )}
      </div>
    </div>
  );
}

function ProfileNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <SearchX className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          User not found
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This profile doesn't exist or you may not have access.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/20 hover:bg-sky-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  usePageMeta({ title: "Profile — GarTexHub", url: `/profile/${id}` });

  useEffect(() => {
    let cancelled = false;
    async function lookup() {
      try {
        const data = await apiRequest("/users/lookup", {
          method: "POST",
          token: getToken(),
          body: { ids: [id] },
        });
        const user = data?.users?.[0];
        if (!cancelled) setTarget(user || null);
      } catch (err) {
        logger.warn("API error:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    lookup();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <NeonAtom fill />;
  if (error || !target) return <ProfileNotFound />;

  const role = target.role;
  if (role === "buyer") return <Navigate to={`/buyer/${id}`} replace />;
  if (role === "factory") return <Navigate to={`/factory/${id}`} replace />;
  if (role === "buying_house")
    return <Navigate to={`/buying-house/${id}`} replace />;

  const profile = target.profile || {};
  const displayName = target.name || "";
  const displayRole = (role || "").replace(/_/g, " ");
  const avatarImage =
    target.avatar_url ||
    profile.avatar_url ||
    profile.profile_image ||
    profile.avatar ||
    "";
  const coverImage = profile.cover_image_url || "";
  const country = profile.country || "";
  const company = profile.company || "";
  const industry = profile.industry || "";
  const headline = profile.headline || "";
  const bio = profile.bio || "";
  const email = target.email || "";
  const joinedYear = target.created_at
    ? new Date(target.created_at).getFullYear()
    : "—";

  const badges = [
    target.verified
      ? { label: "Verified", icon: ShieldCheck, tone: "success" }
      : null,
  ].filter(Boolean);

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
            <Shield className="h-3.5 w-3.5" /> Role:{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {displayRole}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_0.85fr]">
          <div className="w-full space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-[0_24px_100px_rgba(14,165,233,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70"
            >
              <div className="relative h-[280px] overflow-hidden sm:h-[340px]">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.22),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(14,165,233,0.3))]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex items-end gap-4">
                      <div className="-mb-10 sm:-mb-12">
                        <AvatarFallback
                          name={displayName}
                          imageUrl={avatarImage}
                        />
                      </div>
                      <div className="pb-1 text-white">
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            {displayName}
                          </h1>
                          <Pill tone="info">{displayRole}</Pill>
                          {country ? (
                            <Pill tone="info">
                              <MapPin className="h-3.5 w-3.5" /> {country}
                            </Pill>
                          ) : null}
                        </div>
                        {headline ? (
                          <p className="mt-1 text-sm text-slate-200/90">
                            {headline}
                          </p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {badges.map((badge) => (
                            <Pill key={badge.label} tone={badge.tone}>
                              <badge.icon className="h-3.5 w-3.5" />{" "}
                              {badge.label}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pb-1">
                      <button
                        onClick={() =>
                          (window.location.href = `mailto:${email}`)
                        }
                        className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-400"
                      >
                        <Mail className="h-4 w-4" /> Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 pt-12 sm:grid-cols-2 lg:grid-cols-4 lg:pt-14">
                <Metric
                  label="Trust"
                  value={
                    <span className="inline-flex items-center gap-2">
                      {target.verified ? (
                        <BadgeCheck className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Shield className="h-4 w-4 text-slate-400" />
                      )}
                      {target.verified ? "Verified" : "Unverified"}
                    </span>
                  }
                  helper="Identity signal"
                />
                <Metric
                  label="Joined"
                  value={joinedYear}
                  helper="Account age"
                />
                {company ? (
                  <Metric
                    label="Company"
                    value={company}
                    helper="Organization"
                  />
                ) : null}
                {industry ? <Metric label="Industry" value={industry} /> : null}
              </div>
            </motion.div>

            {bio ? (
              <SoftCard>
                <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                  About
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {bio}
                </p>
              </SoftCard>
            ) : null}

            {company || industry || country || email ? (
              <SoftCard>
                <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                  Details
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {company ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/70">
                      <Building2 className="h-4 w-4 shrink-0 text-sky-500" />
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Company
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {company}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {industry ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/70">
                      <Globe2 className="h-4 w-4 shrink-0 text-sky-500" />
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Industry
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {industry}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {country ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/70">
                      <MapPin className="h-4 w-4 shrink-0 text-sky-500" />
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Country
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {country}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {email ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/70">
                      <Mail className="h-4 w-4 shrink-0 text-sky-500" />
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Email
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {email}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </SoftCard>
            ) : null}
          </div>

          <aside className="space-y-6">
            <SoftCard>
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-sky-500" />
                <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                  Account
                </h3>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Role
                  </span>
                  <span className="font-medium capitalize text-slate-900 dark:text-white">
                    {displayRole}
                  </span>
                </div>
                {target.verified !== undefined ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Status
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${target.verified ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}
                    >
                      {target.verified ? (
                        <BadgeCheck className="h-3.5 w-3.5" />
                      ) : null}
                      {target.verified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Joined
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {joinedYear}
                  </span>
                </div>
              </div>
            </SoftCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
