/*
  Route: /about
  Access: Public

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Explain what GarTexHub is and why it exists (mission/vision/how it works).
    - Display trust-focused stats + verified documents (dynamic).
    - Use bento-grid layout + glass surfaces + subtle weave background (texture reference to textiles).

  Key API endpoints:
    - GET /api/system/about  (via `apiRequest('/system/about')`)

  Major UI/UX patterns:
    - Bento grid + glassmorphism surfaces.
    - Staggered reveal animations (Framer Motion).
    - Skeleton -> fade-in "trust load" while documents/stats fetch.
    - Verified glow indicators (trust anchors).
*/

import {
	AnimatePresence,
	motion,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import {
	ArrowUpRight,
	Building2,
	Check,
	ChevronRight,
	CircleAlert,
	ExternalLink,
	FileText,
	Globe2,
	MessagesSquare,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import ParallaxBackground from "../components/ParallaxBackground.jsx";
import MagneticButton from "../components/ui/MagneticButton.jsx";
import NeonAtom from "../components/ui/NeonAtom.jsx";
import SpotlightCard from "../components/ui/SpotlightCard.jsx";
import { apiRequest } from "../lib/auth.js";

import usePageMeta from "../lib/usePageMeta.js";

const Motion = motion;

const fallbackAbout = {
	ok: true,
	stats: {
		verifiedFactories: 64,
		countriesCovered: 28,
		docsVerified: 18,
		avgResponseSla: "2h 14m",
	},
	documents: [
		{ name: "Trade license", status: "Verified", updatedAt: "2026-03-12" },
		{
			name: "Factory audit report",
			status: "Verified",
			updatedAt: "2026-03-09",
		},
		{
			name: "Compliance certificate",
			status: "Pending",
			updatedAt: "2026-03-08",
		},
		{
			name: "Bank reference letter",
			status: "Verified",
			updatedAt: "2026-03-05",
		},
		{ name: "Tax registration", status: "Expired", updatedAt: "2026-03-01" },
		{
			name: "Ownership declaration",
			status: "Verified",
			updatedAt: "2026-02-27",
		},
	],
};

/**
 * @typedef {Object} Document
 * @property {string} name
 * @property {string} status
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Stats
 * @property {number} verifiedFactories
 * @property {number} countriesCovered
 * @property {number} docsVerified
 * @property {string} avgResponseSla
 */

const statusStyles = {
	Verified: {
		chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
		dot: "bg-emerald-500",
		icon: Check,
	},
	Pending: {
		chip: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
		dot: "bg-sky-500",
		icon: CircleAlert,
	},
	Expired: {
		chip: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
		dot: "bg-rose-500",
		icon: CircleAlert,
	},
};

/**
 * Renders a loading skeleton.
 * @param {Object} props
 * @param {string} [props.className]
 * @param {number} [props.size]
 * @returns {JSX.Element}
 */
const Skeleton = ({ className = "", size }) => (
	<div className={`flex items-center justify-center ${className}`}>
		<ThreeDot
			variant="bounce"
			color="#6100ff"
			size="large"
			style={{ fontSize: `${size || 48}px` }}
			text=""
			textColor=""
		/>
	</div>
);

/**
 * Wraps children in a motion div for scroll-based animations.
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
function MotionItem({ className = "", children }) {
	const reduceMotion = useReducedMotion();
	if (reduceMotion) {
		return <div class={className}>{children}</div>;
	}

	return (
		<motion.div
			class={className}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
		>
			{children}
		</motion.div>
	);
}

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: 0.15 },
	},
};
const staggerItem = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
	},
};

/**
 * Renders a verified badge.
 * @param {Object} props
 * @param {string} [props.label]
 * @returns {JSX.Element}
 */
function VerifiedBadge({ label = "Verified" }) {
	return (
		<span
			class={[
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
				"border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
				"dark:text-emerald-300",
			].join(" ")}
			title={label}
		>
			<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
			{label}
		</span>
	);
}

/**
 * Renders a status chip based on document status.
 * @param {Object} props
 * @param {string} props.status
 * @returns {JSX.Element}
 */
function StatusChip({ status }) {
	const style = statusStyles[status] || statusStyles.Pending;
	const StatusIcon = style.icon;
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style.chip}`}
		>
			<span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
			<StatusIcon className="h-3.5 w-3.5" />
			{status}
		</span>
	);
}

/**
 * Renders a statistical card.
 * @param {Object} props
 * @param {React.ElementType} props.icon
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} props.sublabel
 * @returns {JSX.Element}
 */
function StatCard({ icon: Icon, label, value, sublabel }) {
	return (
		<SpotlightCard className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/70 p-5 shadow-[0_20px_80px_-30px_rgba(2,132,199,0.35)] backdrop-blur dark:bg-slate-950/55">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-500/15 bg-sky-500/10 text-sky-600 dark:text-sky-300">
						<Icon className="h-5 w-5" />
					</div>
					<p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
					<p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
						{value}
					</p>
					<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{sublabel}</p>
				</div>
			</div>
		</SpotlightCard>
	);
}

/**
 * Renders a section heading.
 * @param {Object} props
 * @param {string} props.eyebrow
 * @param {string} props.title
 * @param {string} props.description
 * @returns {JSX.Element}
 */
function SectionHeading({ eyebrow, title, description }) {
	return (
		<div className="max-w-3xl">
			<div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
				<Sparkles className="h-3.5 w-3.5" />
				{eyebrow}
			</div>
			<h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
				{title}
			</h2>
			<p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
				{description}
			</p>
		</div>
	);
}

/**
 * About page component.
 * @returns {JSX.Element}
 */
export default function About() {
	usePageMeta({
		title: "About — GarTexHub",
		description:
			"Learn about GarTexHub — the global textile and garment marketplace connecting verified factories, buying houses, and suppliers worldwide.",
		url: "/about",
	});

	const [about, setAbout] = useState(fallbackAbout);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");

	const heroRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ["start start", "end start"],
	});
	const reduceMotion = useReducedMotion();
	const spring = useSpring(scrollYProgress, {
		stiffness: 120,
		damping: 24,
		mass: 0.2,
	});
	const y1 = useTransform(spring, [0, 1], [0, reduceMotion ? 0 : 60]);
	const y2 = useTransform(spring, [0, 1], [0, reduceMotion ? 0 : -40]);

	const needleRaf = useRef(null);
	const handleNeedleMove = useCallback((event) => {
		if (needleRaf.current) {
			return;
		}
		const el = event.currentTarget;
		const { clientX, clientY } = event;
		needleRaf.current = requestAnimationFrame(() => {
			needleRaf.current = null;
			const rect = el.getBoundingClientRect();
			el.style.setProperty("--needle-x", `${clientX - rect.left}px`);
			el.style.setProperty("--needle-y", `${clientY - rect.top}px`);
		});
	}, []);

	useEffect(() => {
		let alive = true;
		const controller = new AbortController();

		apiRequest("/system/about", { signal: controller.signal })
			.then((data) => {
				if (!alive) {
					return;
				}
				if (data?.ok && data?.stats && Array.isArray(data?.documents)) {
					setAbout(data);
				}
			})
			.catch((err) => {
				if (!alive) {
					return;
				}
				if (err?.name === "AbortError") {
					return;
				}
				setLoadError(String(err?.message || "Failed to load"));
			})
			.finally(() => {
				if (!alive) {
					return;
				}
				setLoading(false);
			});

		return () => {
			alive = false;
			controller.abort();
		};
	}, []);

	const howItWorks = useMemo(
		() => [
			{
				title: "Buyers can post structured requests",
				text: "with detailed specifications.",
			},
			{
				title: "Factories and Buying Houses can showcase",
				text: "products and capabilities.",
			},
			{
				title: "Verified accounts increase trust",
				text: "through document-based validation.",
			},
			{
				title: "Built-in communication tools",
				text: "enable secure discussions.",
			},
			{
				title: "Digital contracts and document storage",
				text: "ensure record integrity.",
			},
		],
		[],
	);

	if (loading) {
		return <NeonAtom fill={true} />;
	}

	return (
		<main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#050816] dark:text-white">
			<ParallaxBackground />

			<svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
				<filter id="noise-filter-about">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.8"
						numOctaves="2"
						stitchTiles="stitch"
					/>
					<feColorMatrix type="saturate" values="0" />
				</filter>
			</svg>

			<div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light [background-image:radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.8)_1px,transparent_0)] [background-size:22px_22px] dark:opacity-[0.08]" />
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(186,230,253,0.35),transparent_16%,transparent_84%,rgba(2,6,23,0.08))] dark:bg-[linear-gradient(to_bottom,rgba(14,165,233,0.18),transparent_18%,transparent_82%,rgba(2,6,23,0.5))]" />

			<section
				ref={heroRef}
				className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12"
			>
				<motion.div
					style={{ y: y1 }}
					className="mx-auto max-w-6xl rounded-[2rem] border border-sky-500/15 bg-white/75 p-6 shadow-[0_30px_120px_-50px_rgba(14,165,233,0.55)] backdrop-blur-xl dark:bg-slate-950/50 sm:p-8 lg:p-10"
				>
					<div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
						<motion.div style={{ y: y2 }} className="relative">
							<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-sky-700 dark:text-sky-300">
								<ShieldCheck className="h-3.5 w-3.5" />
								Public about page
							</div>

							<h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
								About GarTexHub - Show notifications
							</h1>

							<p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
								GarTexHub is a professional B2B platform built exclusively for the Garments and
								Textile industry. Our goal is to create a structured, transparent, and trust-driven
								environment where international buyers, factories, and buying houses can connect
								with confidence.
							</p>

							<div className="mt-8 flex flex-wrap gap-3">
								<MagneticButton
									to="/verification"
									className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
								>
									View verification standards
									<ChevronRight className="h-4 w-4" />
								</MagneticButton>
								<MagneticButton
									to="/help"
									className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-400 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:text-sky-300"
								>
									Contact sales
									<ExternalLink className="h-4 w-4" />
								</MagneticButton>
							</div>

							<p className="mt-5 max-w-3xl text-base italic leading-7 text-slate-500 dark:text-slate-400">
								A professional B2B platform built exclusively for the Garments and Textile industry.
							</p>
						</motion.div>

						<motion.div style={{ y: y2 }} className="relative">
							<div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/15 via-cyan-500/10 to-indigo-500/10 p-5 shadow-[0_30px_100px_-40px_rgba(8,145,178,0.55)] backdrop-blur-xl dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-indigo-400/10 sm:p-6">
								<div className="mb-4 flex items-center justify-between">
									<div>
										<p className="text-xs font-medium uppercase tracking-[0.25em] text-sky-700 dark:text-sky-300">
											Trust indicators
										</p>
										<h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
											Live platform signals
										</h3>
									</div>
									{loadError ? (
										<div className="inline-flex items-center gap-2 rounded-full border border-amber-500/15 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
											<CircleAlert className="h-3.5 w-3.5" />
											Live data unavailable -- showing defaults.
										</div>
									) : loading ? (
										<div className="inline-flex items-center gap-2 rounded-full border border-sky-500/15 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">
											<ThreeDot
												variant="bounce"
												color="#6100ff"
												size="small"
												text=""
												textColor=""
											/>
											Loading...
										</div>
									) : (
										<div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
											<Check className="h-3.5 w-3.5" />
											Live data loaded
										</div>
									)}
								</div>

								<div className="grid gap-4 sm:grid-cols-2">
									{loading ? (
										<>
											<Skeleton className="h-32 rounded-3xl" />
											<Skeleton className="h-32 rounded-3xl" />
											<Skeleton className="h-32 rounded-3xl" />
											<Skeleton className="h-32 rounded-3xl" />
										</>
									) : (
										<>
											<StatCard
												icon={Building2}
												label="Verified factories"
												value={about.stats.verifiedFactories}
												sublabel="Businesses validated by document review"
											/>
											<StatCard
												icon={Globe2}
												label="Countries covered"
												value={about.stats.countriesCovered}
												sublabel="International reach across markets"
											/>
											<StatCard
												icon={FileText}
												label="Docs verified"
												value={about.stats.docsVerified}
												sublabel="Document checks strengthening trust"
											/>
											<StatCard
												icon={MessagesSquare}
												label="Avg. response SLA"
												value={about.stats.avgResponseSla}
												sublabel="Expected communication responsiveness"
											/>
										</>
									)}
								</div>
							</div>
						</motion.div>
					</div>
				</motion.div>
			</section>

			<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
				<div className="grid gap-6 lg:grid-cols-2">
					<MotionItem>
						<SpotlightCard className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-8">
							<SectionHeading
								eyebrow="Why GarTexHub exists"
								title="Built to reduce friction, ambiguity, and trust barriers"
								description="Cross-border textile trade often depends on informal communication, scattered documents, and manual verification processes. GarTexHub was created to solve that problem by combining structured communication, verified business identities, and secure documentation within one unified system."
							/>
						</SpotlightCard>
					</MotionItem>

					<MotionItem>
						<SpotlightCard className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-8">
							<div className="max-w-3xl">
								<div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
									<Sparkles className="h-3.5 w-3.5" />
									Mission & Vision
								</div>
								<h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
									A secure digital infrastructure for global sourcing
								</h2>
								<div className="mt-3 space-y-4">
									<p className="text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
										To simplify international garment sourcing by building a secure digital
										infrastructure that prioritizes credibility, transparency, and efficiency.
									</p>
									<p className="text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
										To become a trusted digital bridge between global buyers and garment
										manufacturers, reducing negotiation friction and strengthening international
										trade relationships.
									</p>
								</div>
							</div>
						</SpotlightCard>
					</MotionItem>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
				<SectionHeading
					eyebrow="How the platform works"
					title="A clear workflow designed for professional B2B sourcing"
					description="GarTexHub uses a structured flow so every interaction stays readable, verifiable, and easier to manage across borders."
				/>

				<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
					{howItWorks.map((step, index) => (
						<motion.div
							key={step.title}
							initial={reduceMotion ? false : { opacity: 0, y: 24 }}
							whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								duration: 0.45,
								delay: reduceMotion ? 0 : index * 0.06,
							}}
						>
							<SpotlightCard className="h-full rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
								<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300">
									<span className="text-sm font-semibold">0{index + 1}</span>
								</div>
								<h3 className="text-base font-semibold text-slate-950 dark:text-white">{step.title}</h3>
								<p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{step.text}</p>
							</SpotlightCard>
						</motion.div>
					))}
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
				<div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
					<MotionItem>
						<SpotlightCard className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-8">
							<SectionHeading
								eyebrow="Verification & trust"
								title="Document-based verification with ongoing compliance"
								description="GarTexHub uses a document-based verification system. Companies submit legal and operational documents, which are manually reviewed before verification status is granted. Verification is subscription-based and must be maintained for ongoing compliance. The more verified documentation a company provides, the stronger its credibility and international acceptance."
							/>
						</SpotlightCard>
					</MotionItem>

					<MotionItem>
						<SpotlightCard
							className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-8"
							onMouseMove={handleNeedleMove}
						>
							<span className="needle-cursor" />
							<div className="flex items-center justify-between gap-3">
								<div>
									<h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
										Verified documents
									</h2>
									<p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
										Skeleton loads into audit-ready details -- verified signals stay prominent.
									</p>
								</div>
								<FileText className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
							</div>

							<div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-950/50">
								<div className="grid grid-cols-12 border-b border-slate-200/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:text-slate-400">
									<div className="col-span-6">Document name</div>
									<div className="col-span-3">Status</div>
									<div className="col-span-3 text-right">Last updated</div>
								</div>
								<div className="divide-y divide-slate-200/80 dark:divide-white/10">
									{loading ? (
										<>
											<Skeleton className="h-14 rounded-none" />
											<Skeleton className="h-14 rounded-none" />
											<Skeleton className="h-14 rounded-none" />
											<Skeleton className="h-14 rounded-none" />
											<Skeleton className="h-14 rounded-none" />
											<Skeleton className="h-14 rounded-none" />
										</>
									) : (
										<AnimatePresence initial={false}>
											{(about.documents || []).map((doc, index) => {
												const style = statusStyles[doc.status] || statusStyles.Pending;
												const StatusIcon = style.icon;
												return (
													<motion.div
														key={`${doc.name}-${doc.updatedAt}`}
														initial={reduceMotion ? false : { opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														exit={{ opacity: 0, y: -10 }}
														transition={{
															duration: 0.25,
															delay: reduceMotion ? 0 : index * 0.03,
														}}
														className="grid grid-cols-12 items-center px-4 py-4 text-sm"
													>
														<div className="col-span-6 pr-3">
															<div className="font-medium text-slate-900 dark:text-white">
																{doc.name}
															</div>
														</div>
														<div className="col-span-3">
															<span
																className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.chip}`}
															>
																<span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
																<StatusIcon className="h-3.5 w-3.5" />
																{doc.status}
															</span>
														</div>
														<div className="col-span-3 text-right font-medium text-slate-600 dark:text-slate-300">
															{doc.updatedAt}
														</div>
													</motion.div>
												);
											})}
										</AnimatePresence>
									)}
								</div>
							</div>
						</SpotlightCard>
					</MotionItem>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
				<div className="grid gap-6 lg:grid-cols-3">
					<MotionItem className="lg:col-span-2">
						<SpotlightCard className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-8">
							<SectionHeading
								eyebrow="Digital bridge"
								title="Coming soon: a global map of verified connections"
								description="The Digital Bridge feature will visualize trusted relationships between buyers and manufacturers on a global map, making verified trade networks easier to understand and explore."
							/>
						</SpotlightCard>
					</MotionItem>

					<MotionItem>
						<SpotlightCard className="rounded-[2rem] border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-cyan-500/10 to-indigo-500/10 p-6 shadow-sm backdrop-blur dark:border-white/10 sm:p-8">
							<div className="inline-flex rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
								Coming soon
							</div>
							<p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
								A global map view that visualizes verified connections between buyers and
								manufacturers.
							</p>
						</SpotlightCard>
					</MotionItem>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
				<div className="grid gap-6 lg:grid-cols-2">
					<MotionItem>
						<SpotlightCard className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-8">
							<SectionHeading
								eyebrow="Industry focus"
								title="Strictly dedicated to Garments and Textile"
								description="GarTexHub is strictly dedicated to the Garments and Textile sector. By focusing on a single industry, we provide smarter categorization, clearer communication, and more relevant matching between buyers and manufacturers."
							/>
						</SpotlightCard>
					</MotionItem>

					<MotionItem>
						<SpotlightCard className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-8">
							<SectionHeading
								eyebrow="Professional commitment"
								title="No direct financial transactions on the platform"
								description="We do not process direct financial transactions. Our platform is designed to facilitate secure communication, structured agreements, and verified business interactions."
							/>
							<div className="mt-6 space-y-3">
								<div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
									<Check className="mt-1 h-4 w-4 shrink-0 text-sky-500" />
									<span>
										GarTexHub operates with the principle that trust is earned through transparency,
										documentation, and professional conduct.
									</span>
								</div>
							</div>
						</SpotlightCard>
					</MotionItem>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
				<MotionItem>
					<SpotlightCard className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-8">
						<div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
							<div>
								<SectionHeading
									eyebrow="Contact & legal"
									title="Official communication channels for partnership and support"
									description="For partnership inquiries, support, or compliance-related questions, please contact us through the official communication channels listed on the platform."
								/>
							</div>
							<div className="flex flex-wrap gap-3 lg:justify-end">
								<MagneticButton
									to="/verification"
									className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
								>
									View verification standards
									<ArrowUpRight className="h-4 w-4" />
								</MagneticButton>
								<MagneticButton
									to="/help"
									className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-500/15 dark:text-sky-300"
								>
									Contact sales
									<ArrowUpRight className="h-4 w-4" />
								</MagneticButton>
							</div>
						</div>
					</SpotlightCard>
				</MotionItem>
			</section>
		</main>
	);
}
