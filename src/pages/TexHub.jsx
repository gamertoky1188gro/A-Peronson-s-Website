/*
  Route: /
  Page Name: Landing (TexHub)
  Access: Public

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Marketing/landing surface for GarTexHub (hero + bento features).
    - Demonstrate key platform concepts: Buyer Requests, Verified Factories, Contract Vault, Analytics, Agent Lock, etc.
    - Fetch "dynamic preview" data from a public system endpoint, and show skeleton shimmer while loading.

  Key API endpoints:
    - GET /api/system/home  (via `apiRequest('/system/home')`)

  Theme: Merged with user's new sky-blue theme while preserving all functionality
*/
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, getToken } from "../lib/auth";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileSignature,
  Layers3,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Stars,
  Users2,
} from "lucide-react";

const Motion = motion;

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">
        <Stars className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
        {text}
      </p>
    </div>
  );
}

function Pill({ children }) {
  return (
    <div className="rounded-full border border-slate-200/50 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white/85">
      {children}
    </div>
  );
}

function Card({ className = "", children }) {
  return (
    <div
      className={
        "rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_70px_-30px_rgba(2,132,199,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 " +
        className
      }
    >
      {children}
    </div>
  );
}

function VerifiedBadge({ label = "Verified" }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_10px_24px_rgba(16,185,129,0.12)] dark:bg-emerald-400/8 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.14),0_0_32px_rgba(16,185,129,0.16)]"
      title="Verified"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.65)] dark:bg-emerald-300 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
      {label}
    </span>
  );
}

function BentoMotion({ index, className = "", children }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1,
      }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedHeroHeading({ text, className = "" }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <span className={className}>{text}</span>;

  const words = String(text).split(" ");
  let globalIndex = 0;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => {
          const chars = Array.from(word);
          return (
            <span key={`${word}-${wordIndex}`}>
              <span className="inline-block whitespace-nowrap">
                {chars.map((ch, idx) => {
                  const charIndex = globalIndex++;
                  return (
                    <motion.span
                      key={`${ch}-${idx}`}
                      className="inline-block"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: charIndex * 0.012,
                      }}
                    >
                      {ch}
                    </motion.span>
                  );
                })}
              </span>
              {wordIndex < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    </span>
  );
}

function MagneticLinkButton({ to, className = "", children }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });
  const maxShift = 9;

  function handleMove(event) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;
    const dx = (relX - 0.5) * 2;
    const dy = (relY - 0.5) * 2;
    x.set(dx * maxShift);
    y.set(dy * maxShift);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <Link to={to} className="inline-flex">
      <motion.span
        className={className}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.span>
    </Link>
  );
}

function SkeletonLine({ className = "" }) {
  return (
    <div
      className={[
        "rounded-xl relative overflow-hidden bg-slate-200/80 dark:bg-white/5",
        "after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%]",
        "after:pointer-events-none after:opacity-70 dark:after:opacity-90",
        "after:animate-skeleton",
        "after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.28)_45%,transparent_70%)]",
        "dark:after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_70%)]",
        className,
      ].join(" ")}
    />
  );
}

function GlassSurface({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-3xl bg-white/10 backdrop-blur-md text-slate-900 dark:text-white",
        "shadow-[0_22px_60px_rgba(2,6,23,0.55)]",
        "ring-1 ring-white/12",
        "transition duration-300 ease-out will-change-transform",
        "hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(2,6,23,0.65)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function TexHub() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  const initialHome = useMemo(
    () => ({
      hero: {
        headline:
          "Where global buyers, factories, and buying houses connect with clarity",
        subheadline:
          "A focused B2B sourcing workflow platform for garments and textiles. Post requests, showcase products, connect quickly, and move from first contact to contract in one place.",
        short_description:
          "A focused B2B platform for Bangladesh-centric but global-facing garments and textile sourcing.",
        presentation_rule:
          "Strategic presentation rule: GartexHub must be presented in a way that makes business workflow stronger, more transparent, more efficient, and more trusted. It cannot be marketed with a destructive message against any group.",
        value_props: [
          "Structured buyer request system",
          "Factory product visibility engine",
          "Buying house team-based workflow",
          "AI-assisted communication + verification",
        ],
        trust_points: [
          "Organization-based verification",
          "Digital signature + PDF contract record",
          "Audit-ready activity history",
          "Controlled communication flow",
        ],
        buyerRequest: {
          label: "Buyer Request",
          title: "No live buyer requests yet",
          badge: "Live",
          fields: [],
        },
        verifiedFactories: {
          title: "Verified factories",
          subtitle: "Matched by compliance",
          factories: [],
        },
      },
      bento: {
        professionalFeed: {
          title: "Professional feed",
          description:
            "A calm, LinkedIn-style surface where posts stay readable without heavy frames.",
          lanes: [
            { label: "Buyer Requests", meta: "Auto-sorted" },
            { label: "Factory Updates", meta: "Auto-sorted" },
            { label: "Buying House Notes", meta: "Auto-sorted" },
          ],
        },
        structuredBuyerRequests: {
          title: "Structured buyer requests",
          description:
            "Perfectly aligned fields so teams compare requirements instantly.",
          badge: "Aligned",
          fields: [],
        },
        contractVault: {
          title: "Contract Vault",
          description:
            "A secure room vibe for agreements, compliance docs, and audit-ready records.",
          items: ["Draft → Signed", "Version history", "Team access control"],
          badge: "Encrypted storage",
        },
        enterpriseAnalytics: {
          title: "Enterprise analytics",
          description:
            "Decision-ready reporting for buying houses -- without turning the UI into a spreadsheet.",
          stats: [],
        },
        agentLock: {
          title: "Internal Agent Lock System",
          description:
            "Subtle, conflict-free lead ownership across multi-agent buying house teams.",
          requestLabel: "No active request yet",
          status: "Idle",
          note: "Live request locks will appear here once teams start claiming leads.",
        },
      },
      marketing: {
        sections: [],
      },
      whyCards: [
        {
          title: "Structured buyer request system",
          text: "Clear requirements reduce noise and help teams compare responses faster.",
        },
        {
          title: "Factory product visibility engine",
          text: "Show products, capacity, and proof points in a calm, organized format.",
        },
        {
          title: "Buying house team-based workflow",
          text: "Assign leads, coordinate follow-ups, and keep everyone aligned.",
        },
        {
          title: "AI-assisted communication + verification",
          text: "Summaries, suggested replies, and trust signals help teams move with confidence.",
        },
      ],
      workflow: [
        {
          step: "Step 1",
          title: "Post or search",
          text: "Buyers post structured requirements. Factories publish products and capacity.",
        },
        {
          step: "Step 2",
          title: "Smart matching + claim lead",
          text: "Agents claim requests. AI summarizes context so the team moves fast without noise.",
        },
        {
          step: "Step 3",
          title: "Chat, call, contract",
          text: "Communicate, schedule meetings, and store agreements inside the Contract Vault.",
        },
      ],
      platformFeatures: [
        {
          title: "Professional feed",
          text: "A calm, LinkedIn-style surface where posts stay readable without heavy frames.",
          meta: "Buyer Requests • Factory Updates • Buying House Notes",
        },
        {
          title: "Structured buyer requests",
          text: "Perfectly aligned fields so teams compare requirements instantly.",
          meta: "Aligned • Clean • Fast",
        },
        {
          title: "Contract Vault",
          text: "A secure room vibe for agreements, compliance docs, and audit-ready records.",
          meta: "Draft → Signed • Version history • Team access control",
        },
        {
          title: "Enterprise analytics",
          text: "Decision-ready reporting for buying houses without turning the UI into a spreadsheet.",
          meta: "Active leads • Verified matches • Avg. response",
        },
      ],
      categories: [
        "Shirts",
        "Pants",
        "Knitwear",
        "Woven",
        "Denim",
        "Custom production",
      ],
      audience: [
        {
          title: "For Buyers",
          text: "Post clear requirements. Get structured replies. Search Bangladesh-centric but global-facing suppliers.",
          points: [
            "Structured buyer request posting",
            "Fast supplier comparison + clearer requirements",
            "Reduced irrelevant communication",
            "Contract history + audit-ready records",
          ],
        },
        {
          title: "For Factories",
          text: "Show products + capabilities. Receive better leads. Build trust through verification.",
          points: [
            "Product posts with specs, media, and capacity highlights",
            "Clearer inquiries (less back-and-forth)",
            "AI-assisted responses for repeated questions",
            "Verification + visibility signals that build trust",
          ],
        },
        {
          title: "For Buying Houses",
          text: "Run sourcing as an organization with team seats, lead assignment, and multi-factory coordination.",
          points: [
            "Team seats + sub-accounts",
            "Lead assignment + internal CRM timeline",
            "Multi-factory coordination in one inbox",
            "Enterprise analytics (agent outcomes + conversions)",
          ],
        },
      ],
      aiWorkflow: {
        eyebrow: "AI Guided Workflow",
        title:
          "Clear positioning, calm surfaces, and stronger business workflow.",
        text: "GarTexHub is presented to strengthen sourcing operations, improve transparency, make communication more efficient, and build trust — without destructive messaging toward any group.",
        features: [
          "Professional feed",
          "Verified factories",
          "Digital Contract Vault",
          "AI guided workflow",
        ],
      },
      timeline: [
        {
          label: "No live buyer requests yet",
          status: "Live",
          icon: "Search",
        },
        {
          label: "Verified factories",
          status: "Matched by compliance",
          icon: "ShieldCheck",
        },
        {
          label: "Internal Agent Lock System",
          status: "Idle",
          icon: "LockKeyhole",
        },
      ],
    }),
    [],
  );

  const [home, setHome] = useState(initialHome);
  const [loadError, setLoadError] = useState("");
  const [_loading, setLoading] = useState(true);
  const [mode, setMode] = useState("professional");

  const iconMap = {
    Search,
    ShieldCheck,
    LockKeyhole,
  };

  const workflowIconMap = {
    ClipboardList,
    Sparkles,
    FileSignature,
  };

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    apiRequest("/system/home", { signal: controller.signal })
      .then((data) => {
        if (!alive) return;
        if (data?.ok && data?.hero && data?.bento) {
          setHome((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => {
        if (!alive) return;
        if (err?.name === "AbortError") return;
        setLoadError(String(err?.message || "Failed to load"));
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
      controller.abort();
    };
  }, [initialHome]);

  const heroBuyerRequest =
    home?.hero?.buyerRequest || initialHome.hero.buyerRequest;
  const heroFactories =
    home?.hero?.verifiedFactories || initialHome.hero.verifiedFactories;
  const heroHeadline = home?.hero?.headline || initialHome.hero.headline;
  const heroSubheadline =
    home?.hero?.subheadline || initialHome.hero.subheadline;
  const heroShortDescription =
    home?.hero?.short_description || initialHome.hero.short_description;
  const heroPresentation =
    home?.hero?.presentation_rule || initialHome.hero.presentation_rule;
  const heroValueProps = Array.isArray(home?.hero?.value_props)
    ? home.hero.value_props
    : initialHome.hero.value_props;
  const bento = home?.bento || initialHome.bento;
  const marketingSections = Array.isArray(home?.marketing?.sections)
    ? home.marketing.sections
    : initialHome?.marketing?.sections || [];
  const whyCards = home?.whyCards || initialHome.whyCards;
  const workflowSteps = home?.workflow || initialHome.workflow;
  const platformFeatures =
    home?.platformFeatures || initialHome.platformFeatures;
  const categories = home?.categories || initialHome.categories;
  const audience = home?.audience || initialHome.audience;
  const aiWorkflow = home?.aiWorkflow || initialHome.aiWorkflow;
  const timeline = home?.timeline || initialHome.timeline;
  const buyerStats = home?.bento?.enterpriseAnalytics?.stats ||
    initialHome.bento.enterpriseAnalytics.stats || [
      { label: "Active leads", value: "120" },
      { label: "Verified matches", value: "60" },
      { label: "Avg. response", value: "1h 30m" },
    ];
  const trustPoints = home?.hero?.trust_points || initialHome.hero.trust_points;

  const bentoView = useMemo(() => {
    if (mode === "professional") return bento;
    return {
      ...bento,
      professionalFeed: {
        ...bento.professionalFeed,
        title: "Diverse feed",
        description:
          "A broader surface for discovery -- still structured and readable.",
        lanes: [
          { label: "Market Updates", meta: "Auto-sorted" },
          { label: "New Suppliers", meta: "Auto-sorted" },
          { label: "Opportunities", meta: "Auto-sorted" },
        ],
      },
      structuredBuyerRequests: {
        ...bento.structuredBuyerRequests,
        badge: "Verified",
      },
    };
  }, [bento, mode]);

  return (
    <div className="relative bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#07111f] dark:text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/15" />
        <div className="absolute right-[-80px] top-[260px] h-[360px] w-[360px] rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute left-[-120px] top-[760px] h-[280px] w-[280px] rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-400/10" />
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="grid items-center gap-8 lg:grid-cols-[1.25fr_0.95fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill>Bangladesh-centric</Pill>
              <Pill>Global-facing</Pill>
              <Pill>Garments</Pill>
              <Pill>Textiles</Pill>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              <AnimatedHeroHeading text={heroHeadline} />
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              {heroSubheadline}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {heroShortDescription}
            </p>
            {heroPresentation ? (
              <p className="mt-2 max-w-2xl text-xs italic text-slate-500 dark:text-slate-400">
                {heroPresentation}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              {isLoggedIn ? (
                <>
                  <MagneticLinkButton
                    to="/feed"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5"
                  >
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </MagneticLinkButton>
                  <MagneticLinkButton
                    to="/search"
                    className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-white px-5 py-3 text-sm font-semibold text-sky-700 shadow-sm transition hover:-translate-y-0.5 dark:bg-white/5 dark:text-sky-200"
                  >
                    Browse Suppliers
                  </MagneticLinkButton>
                </>
              ) : (
                <>
                  <MagneticLinkButton
                    to="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5"
                  >
                    Create Buyer Account <ArrowRight className="h-4 w-4" />
                  </MagneticLinkButton>
                  <MagneticLinkButton
                    to="/signup"
                    className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-white px-5 py-3 text-sm font-semibold text-sky-700 shadow-sm transition hover:-translate-y-0.5 dark:bg-white/5 dark:text-sky-200"
                  >
                    Register Factory
                  </MagneticLinkButton>
                  <MagneticLinkButton
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                  >
                    View enterprise plans
                  </MagneticLinkButton>
                </>
              )}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {buyerStats.map((item) => (
                <Card key={item.label} className="p-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {item.label}
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    {item.value}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <Card className="overflow-hidden p-5">
              <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-white p-5 text-slate-900 shadow-2xl shadow-sky-200/30 dark:from-slate-950 dark:to-sky-950 dark:text-white dark:shadow-sky-950/25">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-sky-600/80 dark:text-sky-100/80">
                      Buyer Request
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      {heroBuyerRequest.title}
                    </div>
                  </div>
                  <VerifiedBadge label={heroBuyerRequest.badge} />
                </div>

                <div className="mt-6 grid gap-3">
                  {timeline.map((item) => {
                    const Icon = iconMap[item.icon] || Search;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/10">
                          <Icon className="h-5 w-5 text-sky-600 dark:text-sky-200" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {item.label}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-sky-100/70">
                            {item.status}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-100 p-4 dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BadgeCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />{" "}
                      {heroFactories.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-sky-100/70">
                      {heroFactories.subtitle}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-slate-600/85 sm:grid-cols-2 dark:text-sky-50/85">
                    {heroValueProps.slice(0, 4).map((t) => (
                      <div key={t} className="rounded-2xl bg-slate-50 px-3 py-2 dark:bg-white/5">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="why" className="mt-20">
          <SectionTitle
            eyebrow="Why GarTexHub"
            title="A sourcing workflow network built only for garments and textiles."
            text="Low noise, structured requests, and trust by design. Designed to strengthen business workflow, increase transparency, improve efficiency, and build trust."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {whyCards.map((card) => (
              <Card key={card.title} className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {card.text}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section id="workflow" className="mt-20">
          <SectionTitle
            eyebrow="How GarTexHub works"
            title="A simple flow that stays structured end-to-end."
            text="From the first request to the final agreement, every step is organized to keep sourcing calm, clear, and fast."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {workflowSteps.map((item) => {
              const Icon = workflowIconMap[item.icon] || ClipboardList;
              return (
                <Card key={item.title} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300">
                      {item.step}
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-100">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.text}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-sky-700 dark:text-sky-300">
                    Continue <ChevronRight className="h-4 w-4" />
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="platform" className="mt-20">
          <SectionTitle
            eyebrow="Platform features"
            title="Borderless surfaces, clean hierarchy, and strong trust indicators."
            text="Professional feed, structured buyer requests, contract vault, enterprise analytics, a subtle lock system, and a premium AI assistant — all aligned around clarity."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {platformFeatures.map((item) => (
              <Card key={item.title} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {item.text}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 p-3 text-white shadow-lg shadow-sky-500/20">
                    <Layers3 className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  {item.meta}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-6" id="trust">
            <SectionTitle
              eyebrow="Trust"
              title="Verified and documented by design."
              text="GarTexHub increases trust with organization-based verification, controlled communication flow, and secure contract records."
            />
            <div className="mt-6 space-y-3">
              {trustPoints.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                >
                  <ShieldCheck className="h-5 w-5 text-sky-500" />
                  <div className="text-sm text-slate-700 dark:text-slate-200">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-sky-500 to-blue-700 p-6 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                  <LockKeyhole className="h-3.5 w-3.5" /> Internal Agent Lock
                  System
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight">
                  Subtle, conflict-free lead ownership
                </div>
                <p className="mt-3 text-sm leading-6 text-sky-50/90">
                  Multi-agent buying house teams can claim leads, avoid overlap,
                  and keep ownership visible without friction.
                </p>
                <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>{bentoView.agentLock.requestLabel}</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                      {bentoView.agentLock.status}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-sky-50/85">
                    {bentoView.agentLock.note}
                  </p>
                </div>
              </div>
              <div className="p-6 dark:bg-slate-950/70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Unique toggle
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      A tactile switch for diverse content modes
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setMode((current) =>
                        current === "professional" ? "diverse" : "professional",
                      )
                    }
                    className="relative h-8 w-16 rounded-full bg-slate-200 p-1 dark:bg-slate-800"
                  >
                    <motion.div
                      layout
                      className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform dark:bg-sky-400"
                      animate={{ x: mode === "professional" ? 0 : 32 }}
                    />
                  </button>
                </div>
                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="text-sm font-medium">
                    {mode === "professional" ? "Professional" : "Diverse"}
                  </div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Factory video gallery
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-20">
          <SectionTitle
            eyebrow="Built for growing buying houses"
            title="Enterprise control, dedicated analytics, and organization-level workflow."
            text="Unlimited sub-accounts, dedicated analytics, organization control, and contract management designed for serious sourcing teams."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                  Enterprise analytics
                </div>
                <BriefcaseBusiness className="h-5 w-5 text-sky-500" />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Decision-ready reporting for buying houses — without turning the
                UI into a spreadsheet.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["Active leads", "120"],
                  ["Verified matches", "60"],
                  ["Avg. response", "1h 30m"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Platform features</div>
                <Users2 className="h-5 w-5 text-sky-500" />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Focused only on garments and textiles. Clear categories help the
                right people find the right partners.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-3xl bg-gradient-to-br from-sky-50 to-white p-5 text-slate-900 dark:from-slate-950 dark:to-sky-950 dark:text-white">
                <div className="text-sm text-sky-600/75 dark:text-sky-100/75">
                  Start connecting with the right partners
                </div>
                <div className="mt-1 text-lg font-semibold">
                  Create account • Login
                </div>
                <div className="mt-4 flex gap-3">
                  {isLoggedIn ? (
                    <>
                      <MagneticLinkButton
                        to="/feed"
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                      >
                        Go to Dashboard
                      </MagneticLinkButton>
                      <MagneticLinkButton
                        to="/search"
                        className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-white"
                      >
                        Browse Suppliers
                      </MagneticLinkButton>
                    </>
                  ) : (
                    <>
                      <MagneticLinkButton
                        to="/signup"
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                      >
                        Create account
                      </MagneticLinkButton>
                      <MagneticLinkButton
                        to="/login"
                        className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-white"
                      >
                        Login
                      </MagneticLinkButton>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-20">
          <SectionTitle
            eyebrow="Audience"
            title="Clear surfaces and structured workflows for every role in the sourcing chain."
            text="Buyers, factories, and buying houses each get a focused experience that keeps the system calm at scale."
          />
          <div className="mt-8 grid gap-4 xl:grid-cols-3">
            {audience.map((item) => (
              <Card key={item.title} className="p-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.text}
                </p>
                <div className="mt-5 space-y-3">
                  {item.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-sky-500" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {marketingSections.length ? (
          <section className="mt-20">
            <SectionTitle
              eyebrow="More"
              title="Additional features and capabilities."
              text="Explore more ways GarTexHub supports your sourcing workflow."
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {marketingSections.map((section, idx) => (
                <BentoMotion
                  key={section.id || section.title || String(idx)}
                  index={idx}
                  className="md:col-span-1"
                >
                  <Card className="p-7">
                    {section.eyebrow ? (
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {section.eyebrow}
                      </p>
                    ) : null}
                    <h4 className="mt-2 text-base font-bold tracking-tight text-slate-900 dark:text-white">
                      {section.title}
                    </h4>
                    {section.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {section.description}
                      </p>
                    ) : null}
                    {Array.isArray(section.bullets) &&
                    section.bullets.length ? (
                      <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </Card>
                </BentoMotion>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-20 overflow-hidden rounded-[2rem] border border-sky-500/20 bg-gradient-to-br from-sky-500 to-blue-800 p-8 text-white shadow-2xl shadow-sky-500/20 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" /> {aiWorkflow.eyebrow}
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                {aiWorkflow.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-sky-50/90 md:text-base">
                {aiWorkflow.text}
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Focused only on garments & textile</span>
                <FileSignature className="h-4 w-4" />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-sky-50/85">
                {aiWorkflow.features.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-2xl bg-white/10 px-4 py-3"
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {loadError ? (
          <p className="mt-8 text-center text-xs text-amber-700 dark:text-amber-300">
            {loadError}
          </p>
        ) : null}
      </main>
    </div>
  );
}
