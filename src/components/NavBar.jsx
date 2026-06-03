/*
  Component: NavBar (global)

  Routes impacted:
    - Appears on most routes except immersive pages (/chat and /call) where AppLayout hides it.
    - Public links shown when logged out: /pricing, /about, /help
    - Authenticated icon links shown when logged in: /feed, /search, /contracts, /notifications, /chat, /verification

  Purpose:
    - Provide navigation (public + authenticated).
    - Provide theme toggle (light/dark via `.dark` class on <html>).
    - Provide user search suggestions dropdown (backend user search).
    - Provide unread notification badge (backend notifications list).
    - Provide mobile navigation drawer.

  Key UX patterns:
    - Glassmorphism base: semi-transparent + blur + subtle shadow.
    - "Active" indicator uses Framer Motion `layoutId="nav-active"` so it smoothly slides between links.
    - Ctrl+K / Cmd+K focuses search.

  Key APIs:
    - GET /api/notifications (unread count)
    - GET /api/users/search?q=... (user suggestion search)
    - POST /api/users/:id/friend-request (connect)
    - POST /api/users/:id/follow (follow)
    - POST /api/chat/rooms (create/start conversation)
    - POST /api/calls (start call)
*/
/* global process */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  Factory,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Moon,
  Package,
  PlusCircle,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  Sun,
  Users,
  Vote,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion as Motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  apiRequest,
  clearSession,
  getCurrentUser,
  getRoleHome,
  getToken,
} from "../lib/auth";
import {
  connectNotificationsRealtime,
  subscribeNotificationsRealtime,
} from "../lib/notificationsRealtime";
import { useTheme } from "../lib/ThemeProvider";
import NeonAtom from "./ui/NeonAtom";
import useScrollDirection from "../hooks/useScrollDirection";
import SlideIn from "./SlideIn";

const cn = (...classes) => classes.filter(Boolean).join(" ");

// Public navigation (shown for logged-out visitors).
const publicLinks = [
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/help", label: "Help" },
  { to: "/support", label: "Support" },

];

const ENTER_DELAY = 180;
const EXIT_DELAY = 250;
const TRAJECTORY_SAMPLE = 4;

function useSmartHover(containerRef) {
  const [trail, setTrail] = useState([]);
  const enterTimer = useRef(null);
  const exitTimer = useRef(null);
  const [intent, setIntent] = useState(null);

  const clearTimers = useCallback(() => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    enterTimer.current = null;
    exitTimer.current = null;
  }, []);

  const handlePointerMove = useCallback((e) => {
    setTrail((prev) => {
      const next = [...prev, { x: e.clientX, y: e.clientY, t: Date.now() }];
      return next.length > TRAJECTORY_SAMPLE ? next.slice(-TRAJECTORY_SAMPLE) : next;
    });
  }, []);

  const headingToward = useCallback((rect) => {
    if (trail.length < 2) return false;
    const prev = trail[trail.length - 2];
    const curr = trail[trail.length - 1];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const toCx = cx - curr.x;
    const toCy = cy - curr.y;
    const dot = dx * toCx + dy * toCy;
    return dot > 0;
  }, [trail]);

  const onEnter = useCallback((rect) => {
    clearTimers();
    if (rect && headingToward(rect)) {
      setIntent(true);
      return;
    }
    enterTimer.current = setTimeout(() => setIntent(true), ENTER_DELAY);
  }, [clearTimers, headingToward]);

  const onExit = useCallback(() => {
    clearTimers();
    exitTimer.current = setTimeout(() => setIntent(false), EXIT_DELAY);
  }, [clearTimers]);

  const onImmediateEnter = useCallback(() => {
    clearTimers();
    setIntent(true);
  }, [clearTimers]);

  const onImmediateExit = useCallback(() => {
    clearTimers();
    setIntent(false);
  }, [clearTimers]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    intent,
    onEnter,
    onExit,
    onImmediateEnter,
    onImmediateExit,
    handlePointerMove,
    trail,
  };
}

// Auth navigation dropdown structure
const navigationGroups = [
  {
    label: "Core",
    icon: LayoutDashboard,
    items: [
      { to: "/org-settings?tab=profile", label: "My Profile" },
      { to: "/feed", label: "Feed" },
      { to: "/feed/manage", label: "Manage Listings" },
      { to: "/search", label: "Search" },
      { to: "/contracts", label: "Contracts" },
      { to: "/verification", label: "Verification" },
      {
        to: "/owner",
        label: "Owner Dashboard",
        roles: ["owner", "admin", "buying_house", "factory"],
      },
      {
        to: "/agent",
        label: "Agent Dashboard",
        roles: ["buying_house", "owner", "admin", "agent"],
      },
    ],
  },
  {
    label: "Communication",
    icon: MessageSquare,
    items: [
      { to: "/notifications", label: "Notifications", badge: true },
      { to: "/chat", label: "Chat" },
    ],
  },
  {
    label: "Business",
    icon: ShoppingCart,
    items: [
      {
        to: "/buyer-requests",
        label: "Requests",
        roles: ["buyer", "buying_house", "admin"],
      },
      {
        to: "/product-management",
        label: "Products",
        roles: ["factory", "buying_house", "admin"],
      },
      {
        to: "/partner-network",
        label: "Partners",
        roles: ["buying_house", "factory", "owner", "admin", "agent"],
      },
      {
        to: "/ratings/feedback",
        label: "Ratings",
        roles: ["buyer", "buying_house", "factory", "owner", "admin", "agent"],
      },
    ],
  },
  {
    label: "Organization",
    icon: Building2,
    items: [
      {
        to: "/member-management",
        label: "Members",
        roles: ["owner", "admin", "buying_house", "factory"],
      },
      {
        to: "/org-settings",
        label: "Settings",
        roles: ["owner", "admin", "buying_house", "factory"],
      },
      {
        to: "/insights",
        label: "Insights",
        roles: ["owner", "admin", "buying_house", "factory", "buyer"],
      },
    ],
  },
  {
    label: "Admin",
    icon: ShieldCheck,
    items: [
      { to: "/admin", label: "Admin Panel", roles: ["owner", "admin"] },
      {
        to: "/admin/governance",
        label: "Governance",
        roles: ["owner", "admin"],
      },
    ],
  },
  {
    label: "Support",
    icon: Settings,
    items: [
      { to: "/support", label: "Support" },
      {
        to: "/onboarding",
        label: "Onboarding",
        roles: ["buyer", "buying_house", "factory", "owner", "admin", "agent"],
      },
    ],
  },
];

const easePremium = [0.16, 1, 0.3, 1];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function MagneticNavLink({ to, label, active }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 500, damping: 32, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 500, damping: 32, mass: 0.6 });

  const className = cn(
    "relative inline-flex items-center rounded-full px-1.5 xl:px-3 py-2 text-[0.65rem] xl:text-sm font-medium transition-colors whitespace-nowrap",
    active
      ? "text-sky-700 dark:text-sky-300"
      : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
  );

  return (
    <Link
      to={to}
      className={className}
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        const maxX = 3;
        const maxY = 2;
        x.set(clamp((relX / (rect.width / 2)) * maxX, -maxX, maxX));
        y.set(clamp((relY / (rect.height / 2)) * maxY, -maxY, maxY));
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {active ? (
        <Motion.span
          layoutId="nav-active"
          className="absolute inset-0 rounded-full bg-sky-500/15 ring-1 ring-sky-400/30 shadow-[0_0_0_1px_rgba(56,189,248,0.12)]"
          transition={{ type: "spring", stiffness: 500, damping: 42 }}
        />
      ) : null}
      <Motion.span
        style={{ x: springX, y: springY }}
        className="relative z-10 inline-block"
      >
        {label}
      </Motion.span>
    </Link>
  );
}

function IconNavLink({ to, label, active, Icon, badgeCount = 0 }) {
  const reduceMotion = useReducedMotion();
  const IconComponent = Icon;
  return (
    <div className="group relative flex items-center justify-center">
      <Motion.div
        whileHover={reduceMotion ? undefined : { scale: 1.3 }}
        whileTap={reduceMotion ? undefined : { scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link
          to={to}
          className={cn(
            "relative inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition hover:-translate-y-0.5 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-300",
            active && "text-sky-600 dark:text-sky-300"
          )}
          aria-label={label}
        >
          {active ? (
            <Motion.span
              layoutId="nav-active"
              className="absolute inset-0 rounded-full bg-sky-500/15 ring-1 ring-sky-400/30"
              transition={{ type: "spring", stiffness: 500, damping: 42 }}
            />
          ) : null}
          <span className="relative z-10 inline-flex">
            {IconComponent && <IconComponent className="h-5 w-5" />}
            {badgeCount > 0 ? (
              <Motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-0 top-0 rounded-full bg-cyan-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
              >
                {badgeCount > 99 ? "99+" : badgeCount}
              </Motion.span>
            ) : null}
          </span>
        </Link>
      </Motion.div>

      <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-slate-950/95 px-2.5 py-1 text-xs text-white opacity-0 shadow-lg transition duration-200 group-hover:block group-hover:opacity-100 dark:bg-slate-900/95">
        {label}
      </span>
    </div>
  );
}

function NavDropdown({
  group,
  isOpen,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  userRole,
  badgeCount = 0,
  isTouchDevice,
}) {
  const location = useLocation();
  const IconComponent = group.icon;
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const hover = useSmartHover(containerRef);

  const visibleItems = group.items.filter(
    (item) => !item.roles || item.roles.includes(userRole),
  );

  if (visibleItems.length === 0) return null;

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle(isOpen ? null : group.label);
  };

  const handleTriggerEnter = () => {
    const rect = dropdownRef.current?.getBoundingClientRect();
    if (isOpen) {
      hover.onImmediateEnter();
      onMouseEnter?.();
    } else {
      hover.onEnter(rect);
      onMouseEnter?.();
      if (!isTouchDevice) {
        const timer = setTimeout(() => {
          if (hover.intent) onToggle(group.label);
        }, ENTER_DELAY);
        return () => clearTimeout(timer);
      }
    }
  };

  const handleTriggerLeave = () => {
    hover.onExit();
    onMouseLeave?.();
  };

  const handleDropdownEnter = () => {
    hover.onImmediateEnter();
    onMouseEnter?.();
  };

  const handleDropdownLeave = () => {
    hover.onExit();
    onMouseLeave?.();
  };

  const show = isTouchDevice ? isOpen : (isOpen || hover.intent);

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerMove={hover.handlePointerMove}
    >
      <button
        onClick={isTouchDevice ? handleToggle : handleTriggerEnter}
        onMouseEnter={!isTouchDevice ? handleTriggerEnter : undefined}
        onMouseLeave={!isTouchDevice ? handleTriggerLeave : undefined}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full px-1.5 xl:px-3 py-2 text-[0.65rem] xl:text-sm font-medium whitespace-nowrap transition",
          show
            ? "text-sky-700 bg-sky-500/10 ring-1 ring-sky-400/25 dark:text-sky-300"
            : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
        )}
      >
        <span className="inline-flex items-center gap-2">
          {IconComponent && <IconComponent className="h-4 w-4" />}
          <span className="hidden lg:inline">{group.label}</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", show ? "rotate-180" : "")} />
      </button>

      {/* Invisible buffer zone between trigger and dropdown */}
      {show && !isTouchDevice && (
        <div className="absolute left-0 right-0 top-full h-4 z-40" />
      )}

      <div
        ref={dropdownRef}
        onMouseEnter={!isTouchDevice ? handleDropdownEnter : undefined}
        onMouseLeave={!isTouchDevice ? handleDropdownLeave : undefined}
        className={cn(
          "absolute left-0 top-full z-50 mt-2 min-w-72 overflow-hidden rounded-3xl border border-white/10 bg-white/80 p-2 shadow-[0_25px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:bg-slate-950/85",
          "transition-opacity duration-150",
          isTouchDevice
            ? isOpen ? "block" : "hidden"
            : show ? "block animate-in fade-in" : "hidden"
        )}
      >
        <div className="px-3 pb-2 pt-1">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-400">
            <span>{group.label}</span>
            <span className="rounded-full bg-sky-500/10 px-2 py-1 text-sky-700 dark:text-sky-300">
              {visibleItems.length} links
            </span>
          </div>
        </div>
        {group.label === "Communication" && badgeCount > 0 && (
          <div className="mt-2 mx-3 mb-2 rounded-2xl bg-sky-500/10 px-3 py-2 text-xs text-sky-700 dark:text-sky-300">
            {badgeCount} unread notifications
          </div>
        )}
        <div className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.to || location.pathname + "?" + location.search === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => onToggle(null)}
                className={cn(
                  "group/item flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition",
                  isActive
                    ? "bg-sky-500/10 text-sky-700 ring-1 ring-sky-400/25 dark:text-sky-300"
                    : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700 dark:bg-white/5 dark:text-slate-200">
                    {item.label === "My Profile" && <Vote className="h-4 w-4" />}
                    {item.label === "Feed" && <LayoutDashboard className="h-4 w-4" />}
                    {item.label === "Manage Listings" && <Package className="h-4 w-4" />}
                    {item.label === "Search" && <Search className="h-4 w-4" />}
                    {item.label === "Contracts" && <FileText className="h-4 w-4" />}
                    {item.label === "Verification" && <ShieldCheck className="h-4 w-4" />}
                    {item.label === "Notifications" && <Bell className="h-4 w-4" />}
                    {item.label === "Chat" && <MessageSquare className="h-4 w-4" />}
                    {item.label === "Requests" && <FileText className="h-4 w-4" />}
                    {item.label === "Products" && <Package className="h-4 w-4" />}
                    {item.label === "Partners" && <Users className="h-4 w-4" />}
                    {item.label === "Ratings" && <Star className="h-4 w-4" />}
                    {item.label === "Members" && <Users className="h-4 w-4" />}
                    {item.label === "Settings" && <Settings className="h-4 w-4" />}
                    {item.label === "Insights" && <FileText className="h-4 w-4" />}
                    {item.label === "Owner Dashboard" && <Star className="h-4 w-4" />}
                    {item.label === "Agent Dashboard" && <Star className="h-4 w-4" />}
                    {item.label === "Admin Panel" && <ShieldCheck className="h-4 w-4" />}
                    {item.label === "Governance" && <Settings className="h-4 w-4" />}
                    {item.label === "Support" && <Settings className="h-4 w-4" />}
                    {item.label === "Onboarding" && <Star className="h-4 w-4" />}
                  </span>
                  <span>{item.label}</span>
                </span>
                <ChevronRight className="h-4 w-4 opacity-40 transition group-hover/item:translate-x-0.5 group-hover/item:opacity-80" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [actionStatus, setActionStatus] = useState("");
  const [actionBusyKey, setActionBusyKey] = useState("");

  const direction = useScrollDirection();
  const reduceMotion = useReducedMotion();
  const navTarget = reduceMotion ? 0 : direction === "down" ? -120 : 0;
  const navY = useSpring(navTarget, { stiffness: 120, damping: 24, restDelta: 0.001 });

  useEffect(() => {
    navY.set(navTarget);
  }, [navTarget, navY]);

  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userId = user?.id || "";
  const searchInputRef = useRef(null);
  const isMac = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      /Mac|iPhone|iPad|iPod/.test(navigator.platform),
    [],
  );

  const searchRef = useRef(null);

  const handleSetDropdown = useCallback((label) => {
    setOpenDropdown(label);
  }, []);

  const handleDropdownHover = useCallback(() => {
    setDropdownTimeout(null);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null);
      setDropdownTimeout(null);
    }, 600);
    setDropdownTimeout(timeout);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchExpanded && searchRef.current && !searchRef.current.contains(e.target)) {
        if (!searchQuery.trim()) {
          setSearchExpanded(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchExpanded, searchQuery]);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown && isTouchDevice) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openDropdown, isTouchDevice]);

  useEffect(() => {
    const handler = (e) => {
      const key = String(e.key || "").toLowerCase();
      if (key !== "k") return;
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      searchInputRef.current?.focus?.();
      setSearchOpen(true);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }
    const token = getToken();
    if (!token) {
      setUnreadCount(0);
      return;
    }
    try {
      const data = await apiRequest("/notifications", { token });
      const rows = Array.isArray(data) ? data : [];
      flushSync(() => {
        setUnreadCount(rows.filter((n) => !n?.read).length);
      });
    } catch {
      flushSync(() => {
        setUnreadCount(0);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV === "test"
    )
      return;
    refreshUnreadCount();
  }, [refreshUnreadCount, location.pathname]);

  useEffect(() => {
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV === "test"
    )
      return undefined;
    if (!userId) return undefined;
    const token = getToken();
    if (!token) return undefined;

    connectNotificationsRealtime(token);
    const unsubscribe = subscribeNotificationsRealtime((msg) => {
      if (!msg) return;
      if (
        msg.type === "notification_created" ||
        msg.type === "notification_read"
      ) {
        refreshUnreadCount();
      }
    });

    return unsubscribe;
  }, [userId, refreshUnreadCount]);

  const fetchUserSuggestions = useCallback(
    async (query) => {
      if (!userId) return;
      try {
        const data = await apiRequest(
          `/users/search?q=${encodeURIComponent(query)}`,
          { token: getToken() },
        );
        flushSync(() => {
          setSearchResults(Array.isArray(data?.users) ? data.users : []);
        });
      } catch (err) {
        flushSync(() => {
          setSearchResults([]);
          setSearchError(err.message || "Search failed");
        });
      } finally {
        flushSync(() => {
          setSearchLoading(false);
        });
      }
    },
    [userId],
  );

  useEffect(() => {
    if (!userId) return undefined;

    const query = searchQuery.trim();
    if (query.length < 1) {
      setSearchResults([]);
      setSearchError("");
      return undefined;
    }

    setSearchLoading(true);
    setSearchError("");
    setActionStatus("");

    const timer = window.setTimeout(() => {
      fetchUserSuggestions(query);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [fetchUserSuggestions, searchQuery, userId]);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const updateRelationState = (targetId, relation) => {
    if (!targetId) return;
    setSearchResults((previous) =>
      previous.map((item) =>
        item.id === targetId ? { ...item, ...(relation || {}) } : item,
      ),
    );
  };

  const followUser = async (targetId) => {
    const token = getToken();
    if (!targetId) return;
    if (!token) {
      setSearchError("Please login to follow users.");
      return;
    }

    const key = `follow:${targetId}`;
    setActionBusyKey(key);
    setSearchError("");
    setActionStatus("");
    try {
      const response = await apiRequest(`/users/${targetId}/follow`, {
        method: "POST",
        token,
      });
      updateRelationState(targetId, response?.relation || { following: true });
      setActionStatus("Followed successfully.");
      const query = searchQuery.trim();
      if (query) fetchUserSuggestions(query);
    } catch (err) {
      setSearchError(err.message || "Unable to follow user");
      setActionStatus("Follow failed.");
    } finally {
      setActionBusyKey("");
    }
  };

  const addFriend = async (targetId) => {
    const token = getToken();
    if (!targetId) return;
    if (!token) {
      setSearchError("Please login to add friends.");
      return;
    }

    const key = `friend:${targetId}`;
    setActionBusyKey(key);
    setSearchError("");
    setActionStatus("");
    try {
      const response = await apiRequest(`/users/${targetId}/friend-request`, {
        method: "POST",
        token,
      });
      updateRelationState(
        targetId,
        response?.relation || { friend_status: "requested" },
      );
      setActionStatus("Friend request sent.");
      const query = searchQuery.trim();
      if (query) fetchUserSuggestions(query);
    } catch (err) {
      setSearchError(err.message || "Unable to add friend");
      setActionStatus("Friend request failed.");
    } finally {
      setActionBusyKey("");
    }
  };

  const messageFriend = async (targetId) => {
    const token = getToken();
    if (!token) {
      setSearchError("Please login to message friends.");
      return;
    }

    const key = `message:${targetId}`;
    setActionBusyKey(key);
    setSearchError("");
    try {
      await apiRequest(`/messages/friend/${targetId}`, {
        method: "POST",
        token,
        body: { message: "Hi! Great to connect with you." },
      });
      setSearchOpen(false);
      navigate("/chat");
    } catch (err) {
      setSearchError(err.message || "Unable to start direct message");
    } finally {
      setActionBusyKey("");
    }
  };

  const callFriend = async (targetId) => {
    const token = getToken();
    if (!token) {
      setSearchError("Please login to call friends.");
      return;
    }

    const key = `call:${targetId}`;
    setActionBusyKey(key);
    setSearchError("");
    try {
      const result = await apiRequest(`/calls/friend/${targetId}/join`, {
        method: "POST",
        token,
      });
      const callId = result?.call?.id;
      const matchId = result?.call?.match_id;
      if (!callId) throw new Error("Unable to create call session");
      setSearchOpen(false);
      navigate(
        `/call?callId=${encodeURIComponent(callId)}${matchId ? `&matchId=${encodeURIComponent(matchId)}` : ""}`,
      );
    } catch (err) {
      setSearchError(err.message || "Unable to start friend call");
    } finally {
      setActionBusyKey("");
    }
  };

  const mobileMenuRef = useRef(null);
  const mobileOpenRef = useRef(mobileOpen);

  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    const handleBackButton = () => {
      if (mobileOpenRef.current) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const html = document.documentElement;
    html.style.transition = "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease";
    const timer = setTimeout(() => {
      html.style.transition = "";
    }, 400);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <Motion.nav
      style={{ y: navY }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/65 backdrop-blur-2xl dark:bg-slate-950/55"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 flex-nowrap items-center justify-between gap-1 sm:gap-3 py-3">
          <div className="flex min-w-0 flex-shrink items-center gap-1 md:gap-4">
            {location.pathname !== "/" && (
              <button
                onClick={() => navigate(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
            )}
            <Link
              to={user ? getRoleHome(user.role) : "/"}
              className="group inline-flex items-center gap-3 rounded-full px-2 py-1 transition"
            >
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-white shadow-lg shadow-sky-500/20 ring-1 ring-white/30">
                <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 blur-xl transition group-hover:opacity-100" />
                <ShoppingCart className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold tracking-[0.18em] text-slate-900 dark:text-white">
                  GarTexHub
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  B2B Textile Marketplace
                </span>
              </span>
            </Link>

            <SlideIn direction="down" as="div" className="hidden min-w-0 flex-shrink items-center gap-1 md:flex">
              {!user
                ? publicLinks.map(({ to, label }, idx) => (
                    <Motion.div
                      key={to}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: idx ? 0.05 : 0,
                        ease: easePremium,
                      }}
                    >
                      <MagneticNavLink
                        to={to}
                        label={label}
                        active={location.pathname === to}
                      />
                    </Motion.div>
                  ))
                : navigationGroups.map((group, idx) => (
                    <Motion.div
                      key={group.label}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: idx ? 0.05 : 0,
                        ease: easePremium,
                      }}
                    >
                      <NavDropdown
                        group={group}
                        isOpen={openDropdown === group.label}
                        onToggle={handleSetDropdown}
                        onMouseEnter={handleDropdownHover}
                        onMouseLeave={handleDropdownLeave}
                        userRole={String(user?.role || "").toLowerCase()}
                        badgeCount={unreadCount}
                        isTouchDevice={isTouchDevice}
                      />
                    </Motion.div>
                  ))}
            </SlideIn>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <div ref={searchRef} className="relative hidden items-center md:flex">
              {searchExpanded ? (
                <div
                  className={cn(
                    "relative flex w-[400px] max-w-[calc(100vw-2rem)] items-center rounded-full border border-white/10 bg-white/65 px-3 py-2 backdrop-blur-xl shadow-[0_20px_45px_rgba(14,165,233,0.12)] transition-[width,box-shadow] duration-300",
                    "dark:bg-slate-950/70"
                  )}
                >
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => {
                      if (!searchQuery.trim()) {
                        setSearchExpanded(false);
                      }
                    }}
                    placeholder="Search users..."
                    autoFocus
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchExpanded(false);
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    className="pointer-events-auto rounded-full bg-slate-900/5 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchExpanded(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/65 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-sky-600 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:text-sky-300"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {user && searchOpen && searchQuery.trim().length >= 1 ? (
                <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-[360px] overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-2 shadow-[0_25px_70px_rgba(15,23,42,0.16)] backdrop-blur-2xl dark:bg-slate-950/95">
                  {searchLoading ? (
                    <NeonAtom size={16} />
                  ) : null}
                  {!searchLoading && searchError ? (
                    <p className="px-2 py-3 text-xs text-rose-500">
                      {searchError}
                    </p>
                  ) : null}
                  {!searchLoading &&
                  !searchError &&
                  searchResults.length === 0 ? (
                    <p className="px-2 py-3 text-xs text-slate-500">
                      No users found.
                    </p>
                  ) : null}
                  {!searchLoading &&
                  !searchError &&
                  searchResults.length > 0 ? (
                    <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Suggestions
                    </p>
                  ) : null}
                  {actionStatus ? (
                    <p className="px-3 pb-2 text-[11px] text-emerald-600">
                      {actionStatus}
                    </p>
                  ) : null}

                  {!searchLoading &&
                    !searchError &&
                    searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="mb-1 rounded-2xl px-2 py-2 last:mb-0 transition hover:bg-slate-900/5 dark:hover:bg-white/5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {result.name}
                              {result.is_self ? " (You)" : ""}
                            </p>
                            <p className="text-xs text-slate-500">
                              {result.role} - {result.email}
                            </p>
                          </div>
                          {result.verified ? (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                              Verified
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            disabled={
                              result.is_self ||
                              result.following ||
                              actionBusyKey === `follow:${result.id}`
                            }
                            onClick={() => followUser(result.id)}
                            className="inline-flex items-center rounded-xl bg-sky-500/10 px-2.5 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-sky-300"
                          >
                            {actionBusyKey === `follow:${result.id}`
                              ? "Following..."
                              : result.is_self
                                ? "Follow"
                                : result.following
                                  ? "Following"
                                  : "Follow"}
                          </button>
                          <button
                            disabled={
                              result.is_self ||
                              ["friends", "requested", "self"].includes(
                                result.friend_status,
                              ) ||
                              actionBusyKey === `friend:${result.id}`
                            }
                            onClick={() => addFriend(result.id)}
                            className="inline-flex items-center rounded-xl bg-indigo-500/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-indigo-300"
                          >
                            {actionBusyKey === `friend:${result.id}`
                              ? "Sending..."
                              : result.is_self
                                ? "Add Friend"
                                : result.friend_status === "incoming"
                                  ? "Accept"
                                  : "Add Friend"}
                          </button>
                          {result.friend_status === "friends" ? (
                            <>
                              <button
                                disabled={
                                  actionBusyKey === `message:${result.id}`
                                }
                                onClick={() => messageFriend(result.id)}
                                className="inline-flex items-center rounded-xl bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-300"
                              >
                                Message
                              </button>
                              <button
                                disabled={actionBusyKey === `call:${result.id}`}
                                onClick={() => callFriend(result.id)}
                                className="inline-flex items-center rounded-xl bg-violet-500/10 px-2.5 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-violet-300"
                              >
                                Call
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    ))}
                </div>
              ) : null}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:block">
                <IconNavLink
                  to="/notifications"
                  Icon={Bell}
                  label="Notifications"
                  badgeCount={unreadCount}
                  active={location.pathname === "/notifications"}
                />
              </div>

              <button
                onClick={toggleTheme}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/65 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 dark:bg-slate-950/70 dark:text-white"
                aria-label="Toggle dark mode"
              >
                {dark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
              </button>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110"
                >
                  Login
                </Link>
              )}

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/70 text-slate-900 shadow-sm transition hover:-translate-y-0.5 dark:bg-slate-950/70 dark:text-white md:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-slate-950/35 backdrop-blur-sm md:hidden"
        >
          <Motion.div
            ref={mobileMenuRef}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="mx-auto mt-16 w-[min(92vw,28rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-white/85 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-2xl dark:bg-slate-950/90"
          >
            <div className="flex items-center justify-between border-b border-slate-900/5 px-5 py-4 dark:border-white/10">
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  GarTexHub
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Navigation
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-2 text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4">
              <div className="space-y-3">
                {!user
                  ? publicLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                          location.pathname === to
                            ? "bg-sky-500/10 text-sky-700 dark:text-sky-300"
                            : "text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10"
                        )}
                      >
                        <span>{label}</span>
                        <ChevronRight className="h-4 w-4 opacity-40" />
                      </Link>
                    ))
                  : navigationGroups.map((group) => (
                      <div
                        key={group.label}
                        className="rounded-3xl border border-slate-900/5 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-slate-900 dark:text-white">
                          <group.icon className="h-4 w-4 text-sky-500" />
                          {group.label}
                        </div>
                        <div className="space-y-1">
                          {group.items
                            .filter(
                              (item) =>
                                !item.roles ||
                                item.roles.includes(
                                  String(user?.role || "").toLowerCase(),
                                ),
                            )
                            .map((item) => {
                              const ItemIcon = {
                                "My Profile": Vote,
                                Feed: LayoutDashboard,
                                "Manage Listings": Package,
                                Search: Search,
                                Contracts: FileText,
                                Verification: ShieldCheck,
                                Notifications: Bell,
                                Chat: MessageSquare,
                                Requests: FileText,
                                Products: Package,
                                Partners: Users,
                                Ratings: Star,
                                Members: Users,
                                Settings: Settings,
                                Insights: FileText,
                                "Owner Dashboard": Star,
                                "Agent Dashboard": Star,
                                "Admin Panel": ShieldCheck,
                                Governance: Settings,
                                Support: Settings,
                                Onboarding: Star,
                              }[item.label] || Settings;
                              return (
                              <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                  "flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition",
                                  (location.pathname === item.to || location.pathname + "?" + location.search === item.to)
                                    ? "bg-sky-500/10 text-sky-700 dark:text-sky-300"
                                    : "text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10"
                                )}
                              >
                                <span className="flex items-center gap-3">
                                  <ItemIcon className="h-4 w-4" />
                                  {item.label}
                                </span>
                                {item.badge &&
                                  item.to === "/notifications" &&
                                  unreadCount > 0 && (
                                    <Motion.span
                                      animate={{ scale: [1, 1.15, 1] }}
                                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                      className="rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] font-semibold text-white"
                                    >
                                      {unreadCount > 99 ? "99+" : unreadCount}
                                    </Motion.span>
                                  )}
                                <ChevronRight className="h-4 w-4 opacity-40" />
                              </Link>
                              );
                            })}
                        </div>
                      </div>
                    ))}
              </div>

              {!user ? (
                <div className="mt-4 rounded-3xl border border-sky-400/10 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 p-4">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    Guest access
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-900/10 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                      Signup
                    </Link>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Link
                        to="/terms"
                        onClick={() => setMobileOpen(false)}
                        className="hover:text-sky-600"
                      >
                        Terms
                      </Link>
                      <Link
                        to="/privacy"
                        onClick={() => setMobileOpen(false)}
                        className="text-right hover:text-sky-600"
                      >
                        Privacy
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between border-t border-slate-900/5 px-5 py-4 dark:border-white/10">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-medium text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                {dark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {dark ? "Light mode" : "Dark mode"}
              </button>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              ) : null}
            </div>
          </Motion.div>
        </Motion.div>
      )}
      </AnimatePresence>
    </Motion.nav>
  );
}

