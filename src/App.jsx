/* global process */

import { motion } from "framer-motion";
import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import FloatingAssistant from "./components/FloatingAssistant.jsx";
import Footer from "./components/Footer.jsx";
import LenisProvider from "./components/LenisProvider.jsx";
import NavBar from "./components/NavBar.jsx";
import ScrollProgressBar from "./components/ScrollProgressBar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ToastProvider } from "./components/ToastContainer.jsx";
import CyberpunkCursor from "./components/ui/CyberpunkCursor.jsx";
import NeonAtom from "./components/ui/NeonAtom.jsx";
import { getCurrentUser, getToken, verifyAndSyncUser } from "./lib/auth.js";
import { trackClientEvent } from "./lib/events.js";

function LazyLoadError() {
	return (
		<div class="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
			<div class="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
				<svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
					/>
				</svg>
			</div>
			<h2 class="text-xl font-semibold text-slate-900 dark:text-white">Failed to load page</h2>
			<p class="max-w-md text-sm text-slate-500 dark:text-slate-400">
				The page could not be loaded. This may be a network issue or a new version was deployed.
			</p>
			<button
				onClick={() => window.location.reload()}
				class="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
			>
				Refresh Page
			</button>
		</div>
	);
}

const safeLazy = (importFn) => lazy(() => importFn().catch(() => ({ default: LazyLoadError })));

const TexHub = safeLazy(() => import("./pages/TexHub.jsx"));
const Pricing = safeLazy(() => import("./pages/Pricing.jsx"));
const Login = safeLazy(() => import("./pages/auth/Login.jsx"));
const Signup = safeLazy(() => import("./pages/auth/Signup.jsx"));
const SignupUltra = safeLazy(() => import("./pages/auth/SignupUltra.jsx"));
const OnboardingPage = safeLazy(() => import("./pages/auth/OnboardingPage.jsx"));
const MainFeed = safeLazy(() => import("./pages/MainFeed.jsx"));
const FeedManagement = safeLazy(() => import("./pages/FeedManagement.jsx"));
const SearchResults = safeLazy(() => import("./pages/SearchResults.jsx"));
const BuyerProfile = safeLazy(() => import("./pages/BuyerProfile.jsx"));
const FactoryProfile = safeLazy(() => import("./pages/FactoryProfile.jsx"));
const BuyingHouseProfile = safeLazy(() => import("./pages/BuyingHouseProfile.jsx"));
const MemberManagement = safeLazy(() => import("./pages/MemberManagement.jsx"));
const PartnerNetwork = safeLazy(() => import("./pages/PartnerNetwork.jsx"));
const ProductManagement = safeLazy(() => import("./pages/ProductManagement.jsx"));
const BuyerRequestManagement = safeLazy(() => import("./pages/BuyerRequestManagement.jsx"));
const HelpCenter = safeLazy(() => import("./pages/HelpCenter.jsx"));
const NotificationsCenter = safeLazy(() => import("./pages/NotificationsCenter.jsx"));
const OrgSettings = safeLazy(() => import("./pages/OrgSettings.jsx"));
const Insights = safeLazy(() => import("./pages/Insights.jsx"));
const About = safeLazy(() => import("./pages/About.jsx"));
const Terms = safeLazy(() => import("./pages/Terms.jsx"));
const Privacy = safeLazy(() => import("./pages/Privacy.jsx"));
const ChatInterface = safeLazy(() => import("./pages/ChatInterface.jsx"));
const CallInterface = safeLazy(() => import("./pages/CallInterface.jsx"));
const OwnerDashboard = safeLazy(() => import("./pages/OwnerDashboard.jsx"));
const AgentDashboard = safeLazy(() => import("./pages/AgentDashboard.jsx"));

const IndustryPage = safeLazy(() => import("./pages/IndustryPage.jsx"));
const RatingFeedback = safeLazy(() => import("./pages/RatingFeedback.jsx"));
const SupportReports = safeLazy(() => import("./pages/SupportReports.jsx"));
const VerificationPage = safeLazy(() => import("./pages/VerificationPage.jsx"));
const TaskTracker = safeLazy(() => import("./pages/TaskTracker.jsx"));
const ProfilePage = safeLazy(() => import("./pages/ProfilePage.jsx"));
const AdminPanel = safeLazy(() => import("./pages/AdminPanel.jsx"));
const AdminGovernance = safeLazy(() => import("./pages/AdminGovernance.jsx"));
const AccessDenied = safeLazy(() => import("./pages/AccessDenied.jsx"));

const AUTH_ROLES = ["buyer", "buying_house", "factory", "owner", "admin", "agent"];
const OWNER_ROLES = ["owner", "admin", "buying_house", "factory"];
const INSIGHTS_ROLES = ["owner", "admin", "buying_house", "factory", "buyer"];
const MEMBER_MANAGEMENT_ROLES = ["owner", "admin", "buying_house", "factory"];

function ProtectedRoute({ children, roles }) {
	const location = useLocation();
	const token = getToken();

	// Simple check - if no token, redirect to login
	if (!token) {
		return <Navigate to="/login" replace={true} state={{ from: location.pathname }} />;
	}

	// Get user - might be from cache or need to wait for sync
	const user = getCurrentUser();

	if (!user) {
		// User is loading - show spinner while auth is being verified
		return <NeonAtom fill={true} size={80} />;
	}

	const userRole = user?.role;
	if (Array.isArray(roles) && roles.length > 0 && userRole && !roles.includes(userRole)) {
		return <Navigate to="/access-denied" replace={true} state={{ from: location.pathname }} />;
	}

	return children;
}

function AppRoutes() {
	const location = useLocation();
	return (
		<Routes location={location} key={location.pathname}>
			<Route path="/" element={<TexHub />} />
			<Route path="/pricing" element={<Pricing />} />
			<Route path="/about" element={<About />} />
			<Route path="/terms" element={<Terms />} />
			<Route path="/privacy" element={<Privacy />} />
			<Route path="/help" element={<HelpCenter />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/:time/meow/:date/SignupUltra" element={<SignupUltra />} />
			<Route
				path="/onboarding"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<OnboardingPage />
					</ProtectedRoute>
				}
			/>
			<Route path="/access-denied" element={<AccessDenied />} />

			<Route
				path="/feed"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<MainFeed />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/feed/manage"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<FeedManagement />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/search"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<SearchResults />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/industry/:slug"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<IndustryPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/buyer/:id"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<BuyerProfile />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/factory/:id"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<FactoryProfile />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/buying-house/:id"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<BuyingHouseProfile />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/partner-network"
				element={
					<ProtectedRoute roles={["buying_house", "admin", "factory", "agent", "owner"]}>
						<PartnerNetwork />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/product-management"
				element={
					<ProtectedRoute roles={["factory", "buying_house", "admin"]}>
						<ProductManagement />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/buyer-requests"
				element={
					<ProtectedRoute roles={["buyer", "buying_house", "admin"]}>
						<BuyerRequestManagement />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/notifications"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<NotificationsCenter />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/chat"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<ChatInterface />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/call"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<CallInterface />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/ratings/feedback"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<RatingFeedback />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/support"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<SupportReports />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/member-management"
				element={
					<ProtectedRoute roles={MEMBER_MANAGEMENT_ROLES}>
						<MemberManagement />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/org-settings"
				element={
					<ProtectedRoute roles={OWNER_ROLES}>
						<OrgSettings />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/insights"
				element={
					<ProtectedRoute roles={INSIGHTS_ROLES}>
						<Insights />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/owner"
				element={
					<ProtectedRoute roles={OWNER_ROLES}>
						<OwnerDashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/contracts"
				element={
					<ProtectedRoute roles={OWNER_ROLES}>
						<OwnerDashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/leads"
				element={
					<ProtectedRoute roles={OWNER_ROLES}>
						<OwnerDashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/agent"
				element={
					<ProtectedRoute roles={["buying_house", "owner", "admin", "agent"]}>
						<AgentDashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin"
				element={
					<ProtectedRoute roles={["owner", "admin"]}>
						<AdminPanel />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/governance"
				element={
					<ProtectedRoute roles={["owner", "admin"]}>
						<AdminGovernance />
					</ProtectedRoute>
				}
			/>

			<Route path="/tasks" element={<TaskTracker />} />
			<Route
				path="/profile/:id"
				element={
					<ProtectedRoute roles={AUTH_ROLES}>
						<ProfilePage />
					</ProtectedRoute>
				}
			/>
			<Route path="*" element={<Navigate to="/" replace={true} />} />
		</Routes>
	);
}

function AppLayout() {
	const location = useLocation();
	const isImmersiveRoute = location.pathname === "/chat" || location.pathname === "/call";
	const isAdminRoute = location.pathname.startsWith("/admin");
	const hideChrome = isImmersiveRoute || isAdminRoute;
	const content =
		isAdminRoute || isImmersiveRoute ? (
			<ErrorBoundary>
				<Suspense
					fallback={
						<div class="flex min-h-screen items-center justify-center">
							<NeonAtom size={48} />
						</div>
					}
				>
					<AppRoutes />
				</Suspense>
			</ErrorBoundary>
		) : (
			<>
				{hideChrome ? null : <ScrollProgressBar />}
				<div class="flex w-full justify-center bg-slate-50 dark:bg-[#0b1220]">
					<div
						class="app-shell flex min-h-[125vh] flex-col text-slate-900 dark:text-slate-100 overflow-x-hidden"
						style={{ zoom: 0.8, width: "100%" }}
					>
						{hideChrome ? null : <NavBar />}
						<main class="flex-1 min-h-0 bg-slate-50 dark:bg-[#0b1220] overflow-x-hidden">
							<ErrorBoundary>
								<Suspense
									fallback={
										<div class="flex min-h-screen items-center justify-center">
											<NeonAtom size={48} />
										</div>
									}
								>
									<motion.div
										key={location.pathname}
										initial={{ opacity: 0, y: 8 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
									>
										<AppRoutes />
									</motion.div>
								</Suspense>
							</ErrorBoundary>
						</main>
						{!hideChrome && location.pathname !== "/feed" ? <Footer /> : null}
						{hideChrome ? null : <FloatingAssistant />}
					</div>
				</div>
			</>
		);

	const navigationRef = useRef({ path: "", startedAt: 0 });
	const sessionRef = useRef({ startedAt: 0, ended: false });

	// Sync user data from API on first load - security critical
	useEffect(() => {
		const token = getToken();
		if (token) {
			verifyAndSyncUser(token).catch(console.error);
		}
	}, []);

	useEffect(() => {
		// Reset scroll so new routes don't inherit the old scroll position.
		if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "test") {
			return;
		}
		try {
			if (typeof window.scrollTo === "function") {
				window.scrollTo(0, 0);
			}
		} catch {
			// Some environments (old jsdom) throw "Not implemented: window.scrollTo".
		}
	}, []);

	useEffect(() => {
		// Global event tracking (project.md): page views + time-on-page.
		// Uses a public endpoint that also accepts auth (if present).
		const currentPath = `${location.pathname}${location.search || ""}`;
		const now = Date.now();
		const prev = navigationRef.current;

		if (prev?.path) {
			const durationMs = Math.max(0, now - (prev.startedAt || now));
			trackClientEvent("page_duration", {
				entityType: "route",
				entityId: prev.path,
				metadata: { duration_ms: durationMs },
			});
		} else {
			// First route hit in this SPA session.
			trackClientEvent("session_start", {
				entityType: "route",
				entityId: currentPath,
			});
		}

		trackClientEvent("page_view", {
			entityType: "route",
			entityId: currentPath,
		});
		navigationRef.current = { path: currentPath, startedAt: now };
	}, [location.pathname, location.search]);

	useEffect(() => {
		function handleClick(event) {
			const target = event.target?.closest?.("button, a, [data-track-click]");
			if (!target) {
				return;
			}
			const label = String(target.getAttribute("aria-label") || target.textContent || "")
				.trim()
				.slice(0, 120);
			const tag = String(target.tagName || "").toLowerCase();
			trackClientEvent("click", {
				entityType: "route",
				entityId: `${location.pathname}${location.search || ""}`,
				metadata: { tag, label },
			});
		}

		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, [location.pathname, location.search]);

	useEffect(() => {
		function finalizeSession() {
			if (sessionRef.current.ended) {
				return;
			}
			sessionRef.current.ended = true;
			const durationSeconds = Math.max(
				1,
				Math.round((Date.now() - (sessionRef.current.startedAt || Date.now())) / 1000),
			);
			trackClientEvent("session_end", {
				entityType: "route",
				entityId: navigationRef.current?.path || "session",
				metadata: { duration_seconds: durationSeconds },
			});
		}

		function handleVisibility() {
			if (document.visibilityState === "hidden") {
				finalizeSession();
			}
		}

		sessionRef.current.startedAt = Date.now();
		sessionRef.current.ended = false;
		window.addEventListener("beforeunload", finalizeSession);
		document.addEventListener("visibilitychange", handleVisibility);
		return () => {
			window.removeEventListener("beforeunload", finalizeSession);
			document.removeEventListener("visibilitychange", handleVisibility);
		};
	}, []);

	return hideChrome ? content : <LenisProvider>{content}</LenisProvider>;
}

function App() {
	return (
		<BrowserRouter>
			<CyberpunkCursor />
			<ToastProvider>
				<ErrorBoundary>
					<AppLayout />
				</ErrorBoundary>
				<ScrollToTop />
			</ToastProvider>
		</BrowserRouter>
	);
}

export default App;
