/* global process */
import { lazy, Suspense, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import FloatingAssistant from "./components/FloatingAssistant";
import { getCurrentUser, verifyAndSyncUser, getToken } from "./lib/auth";
import { trackClientEvent } from "./lib/events";

const TexHub = lazy(() => import("./pages/TexHub"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const SignupUltra = lazy(() => import("./pages/auth/SignupUltra"));
const OnboardingPage = lazy(() => import("./pages/auth/OnboardingPage"));
const MainFeed = lazy(() => import("./pages/MainFeed"));
const FeedManagement = lazy(() => import("./pages/FeedManagement"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const BuyerProfile = lazy(() => import("./pages/BuyerProfile"));
const FactoryProfile = lazy(() => import("./pages/FactoryProfile"));
const BuyingHouseProfile = lazy(() => import("./pages/BuyingHouseProfile"));
const MemberManagement = lazy(() => import("./pages/MemberManagement"));
const PartnerNetwork = lazy(() => import("./pages/PartnerNetwork"));
const ProductManagement = lazy(() => import("./pages/ProductManagement"));
const BuyerRequestManagement = lazy(() => import("./pages/BuyerRequestManagement"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const ContractVault = lazy(() => import("./pages/ContractVault"));
const NotificationsCenter = lazy(() => import("./pages/NotificationsCenter"));
const OrgSettings = lazy(() => import("./pages/OrgSettings"));
const Insights = lazy(() => import("./pages/Insights"));
const About = lazy(() => import("./pages/About"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const ChatInterface = lazy(() => import("./pages/ChatInterface"));
const CallInterface = lazy(() => import("./pages/CallInterface"));
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard"));
const AgentDashboard = lazy(() => import("./pages/AgentDashboard"));

const IndustryPage = lazy(() => import("./pages/IndustryPage"));
const RatingFeedback = lazy(() => import("./pages/RatingFeedback"));
const SupportReports = lazy(() => import("./pages/SupportReports"));
const VerificationPage = lazy(() => import("./pages/VerificationPage"));
const TaskTracker = lazy(() => import("./pages/TaskTracker"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminGovernance = lazy(() => import("./pages/AdminGovernance"));
const AccessDenied = lazy(() => import("./pages/AccessDenied"));

const AUTH_ROLES = [
  "buyer",
  "buying_house",
  "factory",
  "owner",
  "admin",
  "agent",
];
const OWNER_ROLES = ["owner", "admin", "buying_house", "factory"];
const INSIGHTS_ROLES = ["owner", "admin", "buying_house", "factory", "buyer"];
const MEMBER_MANAGEMENT_ROLES = ["owner", "admin", "buying_house", "factory"];

function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const token = getToken();

  // Simple check - if no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Get user - might be from cache or need to wait for sync
  const user = getCurrentUser();

  if (!user) {
    // User is loading - show spinner while auth is being verified
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  const userRole = user?.role;
  if (
    Array.isArray(roles) &&
    roles.length &&
    userRole &&
    !roles.includes(userRole)
  ) {
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
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
          <ProtectedRoute
            roles={["buying_house", "admin", "factory", "agent", "owner"]}
          >
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
        path="/contracts"
        element={
          <ProtectedRoute roles={AUTH_ROLES}>
            <ContractVault />
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
        path="/verification"
        element={
          <ProtectedRoute roles={AUTH_ROLES}>
            <VerificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verification-center"
        element={
          <ProtectedRoute roles={AUTH_ROLES}>
            <VerificationPage />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppLayout() {
  const location = useLocation();
  const isImmersiveRoute =
    location.pathname === "/chat" || location.pathname === "/call";
  const isAdminRoute = location.pathname.startsWith("/admin");
  const hideChrome = isImmersiveRoute || isAdminRoute;
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
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV === "test"
    )
      return;
    try {
      if (typeof window.scrollTo === "function") window.scrollTo(0, 0);
    } catch {
      // Some environments (old jsdom) throw "Not implemented: window.scrollTo".
    }
  }, [location.pathname, location.search]);

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
      if (!target) return;
      const label = String(
        target.getAttribute("aria-label") || target.textContent || "",
      )
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
      if (sessionRef.current.ended) return;
      sessionRef.current.ended = true;
      const durationSeconds = Math.max(
        1,
        Math.round(
          (Date.now() - (sessionRef.current.startedAt || Date.now())) / 1000,
        ),
      );
      trackClientEvent("session_end", {
        entityType: "route",
        entityId: navigationRef.current?.path || "session",
        metadata: { duration_seconds: durationSeconds },
      });
    }

    function handleVisibility() {
      if (document.visibilityState === "hidden") finalizeSession();
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

  return (
    <div className="app-shell flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-[#0b1220] dark:text-slate-100" style={{ zoom: 0.9 }}>
      {!hideChrome ? <NavBar /> : null}
      <main
        className="flex-1 min-h-0 bg-slate-50 dark:bg-[#0b1220]"
      >
        <Suspense fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          </div>
        }>
          <AppRoutes />
        </Suspense>
      </main>
      {!hideChrome ? <Footer /> : null}
      {!hideChrome ? <FloatingAssistant /> : null}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
