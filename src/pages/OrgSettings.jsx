import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  apiRequest,
  clearSession,
  getCurrentUser,
  getToken,
  hasEntitlement,
} from "../lib/auth";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SectionCard({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={cx(
        "rounded-3xl border border-sky-200/60 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/75",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Label({ children }) {
  return <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{children}</label>;
}

function Input(props) {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/60 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-950/50",
        props.className
      )}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={cx(
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/60 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-950/50",
        props.className
      )}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className={cx(
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-200/60 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-sky-500 dark:focus:ring-sky-950/50",
        props.className
      )}
    >
      {children}
    </select>
  );
}

function Toggle({ checked, onChange, label, hint }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-sky-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <div className="text-sm font-medium text-slate-900 dark:text-white">{label}</div>
        {hint ? <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{hint}</div> : null}
      </div>
      <div className={cx("relative h-7 w-12 rounded-full transition", checked ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-700")}>
        <div className={cx("absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
      </div>
    </button>
  );
}

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    yellow: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    red: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  };
  return <span className={cx("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", tones[tone] || tones.slate)}>{children}</span>;
}

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={cx("inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60", className)}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={cx("inline-flex items-center justify-center rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800", className)}
    >
      {children}
    </button>
  );
}

function Icon({ children, className = "" }) {
  return (
    <div className={cx("flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/20", className)}>
      {children}
    </div>
  );
}

const ROLE_HIERARCHY = ["observer", "agent", "viewer", "editor", "manager", "factory", "buying_house", "admin", "owner"];

const hasRoleAccess = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  const userIndex = ROLE_HIERARCHY.indexOf(userRole.toLowerCase());
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole.toLowerCase());
  return userIndex >= requiredIndex && userIndex !== -1;
};

const TABS = [
  { id: "general", label: "General Info", requiredRole: "viewer" },
  { id: "profile", label: "My Profile", requiredRole: "observer" },
  { id: "verification", label: "Verification", requiredRole: "factory" },
  { id: "branding", label: "Branding", requiredRole: "factory" },
  { id: "security", label: "Security", requiredRole: "factory" },
  { id: "members", label: "Members", requiredRole: "factory" },
  { id: "subscription", label: "Subscription", requiredRole: "factory" },
  { id: "boosts", label: "Boosts", requiredRole: "manager" },
  { id: "assistant_knowledge", label: "Assistant Knowledge", requiredRole: "admin" },
];

export default function OrgSettings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = useMemo(() => {
    const candidate = searchParams.get("tab") || "general";
    return TABS.some(t => t.id === candidate) ? candidate : "general";
  }, [searchParams]);

  const [tab, setTab] = useState(initialTab);
  const [theme, setTheme] = useState("dark");
  const [statusMessage, setStatusMessage] = useState("Ready.");

  const currentUser = useMemo(() => getCurrentUser(), []);
  const currentUserRole = useMemo(() => String(currentUser?.role || "").toLowerCase(), [currentUser]);
  const isOrgManager = ["owner", "admin", "buying_house", "factory"].includes(currentUserRole);

  const accessibleTabs = useMemo(() => {
    return TABS.filter(t => t.requiredRole && hasRoleAccess(currentUserRole, t.requiredRole));
  }, [currentUserRole]);

  const activeTab = useMemo(() => {
    return accessibleTabs.some(t => t.id === tab) ? tab : accessibleTabs[0]?.id || "general";
  }, [tab, accessibleTabs]);

  // General tab state
  const [chatbotEnabled, setChatbotEnabled] = useState(() => Boolean(currentUser?.chatbot_enabled || currentUser?.profile?.chatbot_enabled));
  const [autoSaveSearchAlerts, setAutoSaveSearchAlerts] = useState(() => {
    const raw = currentUser?.profile?.auto_save_search_alerts;
    return raw === undefined || raw === null || raw === "" ? true : raw === true || String(raw).toLowerCase() === "true";
  });
  const [handoffMode, setHandoffMode] = useState(() => String(currentUser?.handoff_mode || currentUser?.profile?.handoff_mode || "notify_agent"));
  const [autoReplyGreeting, setAutoReplyGreeting] = useState("");
  const [autoReplySignature, setAutoReplySignature] = useState("");
  const [autoReplyFallback, setAutoReplyFallback] = useState("");
  const [autoReplyTone, setAutoReplyTone] = useState("professional");
  const [autoReplyQualification, setAutoReplyQualification] = useState("");
  const [_autoReplyFeedback, setAutoReplyFeedback] = useState("");
  const [_loadingAutoReply, setLoadingAutoReply] = useState(false);
  const [policyMessageCaps, setPolicyMessageCaps] = useState("12");
  const [policyWindowMinutes, setPolicyWindowMinutes] = useState("15");
  const [policyCooldownSeconds, setPolicyCooldownSeconds] = useState("30");
  const [policyStrictnessMode, setPolicyStrictnessMode] = useState("balanced");
  const [mainProcesses, setMainProcesses] = useState(() => (currentUser?.profile?.main_processes || []).join(", "));
  const [yearsInBusiness, setYearsInBusiness] = useState(() => String(currentUser?.profile?.years_in_business || ""));
  const [teamSeats, setTeamSeats] = useState(() => String(currentUser?.profile?.team_seats || ""));
  const [exportPorts, setExportPorts] = useState(() => (currentUser?.profile?.export_ports || []).join(", "));
  const [handlesMultipleFactories, setHandlesMultipleFactories] = useState(() => Boolean(currentUser?.profile?.handles_multiple_factories));
  const [locationLat, setLocationLat] = useState(() => String(currentUser?.profile?.location_lat || ""));
  const [locationLng, setLocationLng] = useState(() => String(currentUser?.profile?.location_lng || ""));

  // Profile tab state
  const [profileDisplayName, setProfileDisplayName] = useState(() => String(currentUser?.display_name || currentUser?.name || ""));
  const [profileHeadline, setProfileHeadline] = useState(() => String(currentUser?.profile?.headline || ""));
  const [profileBio, setProfileBio] = useState(() => String(currentUser?.profile?.bio || ""));
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(() => String(currentUser?.avatar_url || currentUser?.profile?.avatar_url || ""));
  const [profilePhone, setProfilePhone] = useState(() => String(currentUser?.phone || currentUser?.profile?.phone || ""));
  const [profileEmail, setProfileEmail] = useState(() => String(currentUser?.email || ""));
  const [profileVisibility, setProfileVisibility] = useState(() => String(currentUser?.profile?.visibility || "public"));
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [_profileFeedback, setProfileFeedback] = useState("");

  // Password & Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [revokingSession, setRevokingSession] = useState(null);
  const [totpEnabled, setTotpEnabled] = useState(() => Boolean(currentUser?.totp_enabled));
  const [passkeys, setPasskeys] = useState(() => Array.isArray(currentUser?.passkeys) ? currentUser.passkeys : []);
  const [passkeyName, setPasskeyName] = useState("");
  const [passkeyError, setPasskeyError] = useState("");

  // Notification state
  const [notifEmail, setNotifEmail] = useState(() => {
    const val = currentUser?.notification_prefs?.email;
    return val === undefined || val === null ? true : Boolean(val);
  });
  const [notifPush, setNotifPush] = useState(() => {
    const val = currentUser?.notification_prefs?.push;
    return val === undefined || val === null ? true : Boolean(val);
  });
  const [notifInApp, setNotifInApp] = useState(() => {
    const val = currentUser?.notification_prefs?.in_app;
    return val === undefined || val === null ? true : Boolean(val);
  });
  const [_notifFeedback, setNotifFeedback] = useState("");

  // Data export state
  const [exportingData, setExportingData] = useState(false);
  const [exportFeedback, setExportFeedback] = useState("");

  // Delete account state
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingProfile, setDeletingProfile] = useState(false);
  const [deleteProfileFeedback, setDeleteProfileFeedback] = useState("");

  // Billing/subscription state
  const [remainingDays, setRemainingDays] = useState(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletRestricted, setWalletRestricted] = useState(0);
  const [verification, setVerification] = useState(null);
  const [_billingFeedback, setBillingFeedback] = useState("");
  const [entitlements] = useState(() => currentUser?.entitlements || null);
  const [_planLimits] = useState(null);

  // Members state
  const [entries, setEntries] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberInviteEmail, setMemberInviteEmail] = useState("");
  const [memberInviteRole, setMemberInviteRole] = useState("Editor");
  const [invitingMember, setInvitingMember] = useState(false);
  const [memberFeedback, setMemberFeedback] = useState("");
  const [_faqFeedback, setFaqFeedback] = useState("");
  const [knowledgeForm, setKnowledgeForm] = useState({ type: "faq", question: "", answer: "", keywords: "" });

  // Boosts state (placeholder)
  const [_boosts] = useState([]);
  const [_boostScope] = useState("feed");
  const [_boostDuration] = useState("7");
  const [_boostMultiplier] = useState("1.5");
  const [_boostPrice] = useState("9.99");
  const [_boostFeedback] = useState("");
  const [_loadingBoosts] = useState(false);

  // Branding state
  const [brandName, setBrandName] = useState(() => String(currentUser?.profile?.brand_name || ""));
  const [brandTagline, setBrandTagline] = useState(() => String(currentUser?.profile?.brand_tagline || ""));
  const [brandWebsite, setBrandWebsite] = useState(() => String(currentUser?.profile?.brand_website || ""));
  const [brandLogoUrl, setBrandLogoUrl] = useState(() => String(currentUser?.profile?.brand_logo_url || ""));
  const [_brandCoverUrl] = useState(() => String(currentUser?.profile?.brand_cover_url || ""));
  const [_brandColor] = useState(() => String(currentUser?.profile?.brand_color || ""));
  const [brandAccent, setBrandAccent] = useState(() => String(currentUser?.profile?.brand_accent || ""));

  // Subscription values
  const [_subscription] = useState({ plan: "Premium", paymentMethod: "Visa", nextBilling: "2026-05-29", amount: "$49.00", balance: 128.4, restrictedBalance: 12.1 });
  const [_deletePassword] = useState("");

  const canAutoReply = hasEntitlement(entitlements ? { entitlements } : null, "ai_auto_reply_customization");
  const canBranding = hasEntitlement(entitlements ? { entitlements } : null, "custom_branding");

  const verificationStatus = useMemo(() => {
    if (remainingDays <= 0) return "expired";
    if (remainingDays <= 7) return "expiring_soon";
    return "verified_active";
  }, [remainingDays]);

  const save = (msg) => setStatusMessage(msg || "Saved.");

  // Load billing data
  const loadBilling = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const [sub, remaining, wallet, v] = await Promise.all([
        apiRequest("/subscriptions/me", { token }),
        apiRequest("/subscriptions/me/remaining-days", { token }),
        apiRequest("/wallet/me", { token }),
        apiRequest("/verification/me", { token }),
      ]);
      setSubscriptionPlan(sub?.plan || "free");
      setRemainingDays(Number(remaining?.remaining_days || 0));
      setWalletBalance(Number(wallet?.balance_usd || 0));
      setWalletRestricted(Number(wallet?.restricted_balance_usd || 0));
      setVerification(v || null);
    } catch (err) {
      setBillingFeedback(err.message || "Unable to load subscription status");
    }
  }, []);

  // Load user profile
  const loadUserProfile = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const data = await apiRequest("/users/me", { token });
      if (data) {
        setProfileDisplayName(String(data.display_name || data.name || ""));
        setProfileHeadline(String(data.profile?.headline || ""));
        setProfileBio(String(data.profile?.bio || ""));
        setProfileAvatarUrl(String(data.avatar_url || data.profile?.avatar_url || ""));
        setProfilePhone(String(data.phone || data.profile?.phone || ""));
        setProfileEmail(String(data.email || ""));
        setProfileVisibility(String(data.profile?.visibility || "public"));
        setNotifEmail(data.notification_prefs?.email !== false);
        setNotifPush(data.notification_prefs?.push !== false);
        setNotifInApp(data.notification_prefs?.in_app !== false);
        setTotpEnabled(Boolean(data.totp_enabled));
        setPasskeys(Array.isArray(data.passkeys) ? data.passkeys : []);
      }
    } catch { /* ignore */ }
  }, []);

  // Load sessions
  const loadSessions = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoadingSessions(true);
    try {
      const data = await apiRequest("/auth/sessions", { token });
      setSessions(Array.isArray(data?.sessions) ? data.sessions : []);
    } catch { setSessions([]); }
    finally { setLoadingSessions(false); }
  }, []);

  // Load FAQs
  const loadFaqs = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      const data = await apiRequest("/assistant/knowledge", { token });
      setEntries(data.entries || []);
    } catch (err) {
      setFaqFeedback(err.status === 403 ? "Access denied" : err.message);
    }
  }, []);

  // Load members
  const loadMembers = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoadingMembers(true);
    try {
      const data = await apiRequest("/org/members", { token });
      setMembers(Array.isArray(data?.members) ? data.members : []);
    } catch { setMembers([]); }
    finally { setLoadingMembers(false); }
  }, []);

  // Invite member
  const inviteMember = async () => {
    if (!memberInviteEmail.trim()) {
      setMemberFeedback("Enter a member email");
      return;
    }
    const token = getToken();
    if (!token) return;
    setInvitingMember(true);
    setMemberFeedback("");
    try {
      await apiRequest("/org/members", {
        method: "POST",
        token,
        body: { email: memberInviteEmail, role: memberInviteRole },
      });
      setMemberFeedback("Member invited successfully.");
      setMemberInviteEmail("");
      setMemberInviteRole("Editor");
      loadMembers();
    } catch (err) {
      setMemberFeedback(err.message || "Failed to invite member");
    } finally {
      setInvitingMember(false);
    }
  };

  // Remove member
  const removeMember = async (memberId) => {
    const token = getToken();
    if (!token || !memberId) return;
    try {
      await apiRequest(`/org/members/${encodeURIComponent(memberId)}`, { method: "DELETE", token });
      setMembers(m => m.filter(x => x.id !== memberId));
      save("Member removed from organization.");
    } catch { /* ignore */ }
  };

  // Load passkeys
  const loadPasskeys = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const data = await apiRequest("/auth/passkeys", { token });
      setPasskeys(Array.isArray(data?.passkeys) ? data.passkeys : []);
    } catch { setPasskeys([]); }
  }, []);

  // Load chatbot settings
  const loadChatbotSettings = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      setLoadingAutoReply(true);
      const data = await apiRequest("/chatbot/settings", { token });
      const settings = data?.settings || {};
      setAutoReplyGreeting(String(settings?.auto_reply_greeting || ""));
      setAutoReplySignature(String(settings?.auto_reply_signature || ""));
      setAutoReplyFallback(String(settings?.auto_reply_fallback || ""));
      setAutoReplyTone(String(settings?.auto_reply_tone || "professional"));
      setAutoReplyQualification(String(settings?.auto_reply_qualification_prompt || ""));
    } catch { /* ignore */ }
    finally { setLoadingAutoReply(false); }
  }, []);

  // Load communication policy
  const loadCommunicationPolicy = useCallback(async () => {
    const token = getToken();
    if (!token || !currentUser?.id) return;
    try {
      const data = await apiRequest(`/messages/policy/config?org_id=${encodeURIComponent(currentUser.id)}`, { token });
      const policy = data?.config || {};
      setPolicyMessageCaps(String(policy?.message_caps?.outbound_per_window || 12));
      setPolicyWindowMinutes(String(policy?.message_caps?.window_minutes || 15));
      setPolicyCooldownSeconds(String(policy?.message_caps?.cooldown_seconds || 30));
      setPolicyStrictnessMode(String(policy?.strictness_mode || "balanced"));
    } catch { /* ignore */ }
  }, [currentUser?.id]);

  // Save general settings
  const saveGeneralSettings = async () => {
    const token = getToken();
    if (!token) return;
    try {
      await apiRequest("/org/settings", {
        method: "PUT",
        token,
        body: {
          chatbot_enabled: chatbotEnabled,
          auto_save_search_alerts: autoSaveSearchAlerts,
          handoff_mode: handoffMode,
          main_processes: mainProcesses.split(",").map(s => s.trim()).filter(Boolean),
          years_in_business: yearsInBusiness,
          team_seats: teamSeats,
          export_ports: exportPorts.split(",").map(s => s.trim()).filter(Boolean),
          handles_multiple_factories: handlesMultipleFactories,
          location_lat: locationLat,
          location_lng: locationLng,
        },
      });
      save("General settings saved.");
    } catch (err) {
      setBillingFeedback(err.message || "Failed to save settings");
    }
  };

  // Save chatbot settings
  const saveChatbotSettings = async () => {
    const token = getToken();
    if (!token) return;
    setAutoReplyFeedback("Saving...");
    try {
      await apiRequest("/chatbot/settings", {
        method: "POST",
        token,
        body: {
          auto_reply_greeting: autoReplyGreeting,
          auto_reply_signature: autoReplySignature,
          auto_reply_fallback: autoReplyFallback,
          auto_reply_tone: autoReplyTone,
          auto_reply_qualification_prompt: autoReplyQualification,
        },
      });
      setAutoReplyFeedback("Auto-reply settings saved.");
    } catch (err) {
      setAutoReplyFeedback(err.message || "Failed to save");
    }
  };

  // Save profile
  const saveProfileSettings = async () => {
    const token = getToken();
    if (!token) return;
    setLoadingProfile(true);
    setProfileFeedback("");
    try {
      await apiRequest("/users/me/profile", {
        method: "PUT",
        token,
        body: {
          display_name: profileDisplayName,
          headline: profileHeadline,
          bio: profileBio,
          avatar_url: profileAvatarUrl,
        },
      });
      setProfileFeedback("Profile saved.");
    } catch (err) {
      setProfileFeedback(err.message || "Failed to save");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Save contact
  const saveContactSettings = async () => {
    const token = getToken();
    if (!token) return;
    setLoadingProfile(true);
    setProfileFeedback("");
    try {
      await apiRequest("/users/me/profile", {
        method: "PUT",
        token,
        body: { phone: profilePhone },
      });
      setProfileFeedback("Contact saved.");
    } catch (err) {
      setProfileFeedback(err.message || "Failed to save");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Change password
  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFeedback("Fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordFeedback("Must be at least 6 characters");
      return;
    }
    const token = getToken();
    if (!token) return;
    setChangingPassword(true);
    setPasswordFeedback("");
    try {
      await apiRequest("/auth/password", {
        method: "PUT",
        token,
        body: { current_password: currentPassword, new_password: newPassword },
      });
      setPasswordFeedback("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordFeedback(err.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Save notification prefs
  const saveNotificationPref = async (type, value) => {
    const token = getToken();
    if (!token) return;
    try {
      await apiRequest("/users/me/notification-prefs", {
        method: "PUT",
        token,
        body: { [type]: value },
      });
      setNotifFeedback("Preferences saved.");
    } catch { setNotifFeedback(""); }
  };

  // Export data
  const exportUserData = async () => {
    const token = getToken();
    if (!token) return;
    setExportingData(true);
    setExportFeedback("");
    try {
      const data = await apiRequest("/users/me/export", { token });
      if (data?.export_url) {
        window.open(data.export_url, "_blank");
        setExportFeedback("Download started.");
      } else {
        setExportFeedback("No export available yet.");
      }
    } catch (err) {
      setExportFeedback(err.message || "Export failed");
    } finally {
      setExportingData(false);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    const expected = currentUser?.name || "DELETE";
    if (deleteConfirmText !== expected) {
      setDeleteProfileFeedback(`Type "${expected}" to confirm`);
      return;
    }
    const token = getToken();
    if (!token) return;
    setDeletingProfile(true);
    setDeleteProfileFeedback("");
    try {
      await apiRequest("/users/me", { method: "DELETE", token });
      clearSession();
      navigate("/login?deleted=true");
    } catch (err) {
      setDeleteProfileFeedback(err.message || "Delete failed");
    } finally {
      setDeletingProfile(false);
    }
  };

  // Revoke session
  const revokeSession = async (sessionId) => {
    const token = getToken();
    if (!token || !sessionId) return;
    setRevokingSession(sessionId);
    try {
      await apiRequest(`/auth/sessions/${encodeURIComponent(sessionId)}`, { method: "DELETE", token });
      loadSessions();
      save(`Session revoked.`);
    } catch { setRevokingSession(null); }
  };

  // Add passkey
  const addPasskey = async () => {
    if (!passkeyName.trim()) {
      setPasskeyError("Enter a passkey name");
      return;
    }
    const token = getToken();
    if (!token) return;
    setPasskeyError("");
    try {
      const optionsRes = await apiRequest("/auth/passkey/registration/options", { method: "POST", token });
      if (!optionsRes?.options?.challenge) {
        throw new Error("Passkey setup failed");
      }
      // WebAuthn registration would happen here with startRegistration
      setPasskeys([...passkeys, { id: crypto.randomUUID(), name: passkeyName, createdAt: "Now" }]);
      setPasskeyName("");
      save("Passkey registered.");
    } catch (err) {
      setPasskeyError(err.message || "Failed to add passkey");
    }
  };

  // Save visibility
  const saveVisibility = async (value) => {
    const token = getToken();
    if (!token) return;
    try {
      await apiRequest("/users/me/profile", {
        method: "PUT",
        token,
        body: { visibility: value },
      });
    } catch { /* ignore */ }
  };

  // Initial load
  useEffect(() => {
    if (isOrgManager) {
      loadBilling();
      loadUserProfile();
      loadSessions();
      loadPasskeys();
      loadChatbotSettings();
      loadCommunicationPolicy();
      loadFaqs();
      loadMembers();
    }
  }, [isOrgManager, loadBilling, loadUserProfile, loadSessions, loadPasskeys, loadChatbotSettings, loadCommunicationPolicy, loadFaqs, loadMembers]);

  const onThemeToggle = () => setTheme(t => t === "dark" ? "light" : "dark");
  const verificationTone = verificationStatus === "verified_active" ? "green" : verificationStatus === "expiring_soon" ? "yellow" : "red";

  const bodyTheme = theme === "dark" ? "dark" : "";

  return (
    <div className={cx(bodyTheme, "min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white")}>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-sky-400/25 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-sky-200/70 bg-white/80 p-5 shadow-[0_24px_80px_-35px_rgba(2,132,199,0.6)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Icon><span className="text-lg font-black">O</span></Icon>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Owner Console</h1>
                <Badge tone="sky">Premium Dashboard</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Modern control center for automation, verification, branding, security, and team growth.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={verificationTone}>{verificationStatus === "verified_active" ? "Verified" : verificationStatus === "expiring_soon" ? "Expiring Soon" : "Expired"}</Badge>
            <Badge tone="violet">{remainingDays} days left</Badge>
            <SecondaryButton onClick={onThemeToggle}>{theme === "dark" ? "Light mode" : "Dark mode"}</SecondaryButton>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 overflow-x-auto rounded-[1.75rem] border border-sky-200/60 bg-white/75 p-2 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex min-w-max gap-2">
            {accessibleTabs.map(tabItem => (
              <button
                key={tabItem.id}
                onClick={() => { if (tabItem.id === "members") loadMembers(); setTab(tabItem.id); }}
                className={cx("rounded-2xl px-4 py-3 text-sm font-semibold transition", activeTab === tabItem.id ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25" : "text-slate-600 hover:bg-sky-50 dark:text-slate-300 dark:hover:bg-slate-900")}
              >
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mb-6 rounded-3xl border border-sky-200/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</p>
              <p className="text-sm text-slate-900 dark:text-white">{statusMessage}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                <div className="text-xs text-slate-500 dark:text-slate-400">Wallet</div>
                <div className="font-semibold text-slate-900 dark:text-white">${walletBalance.toFixed(2)}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                <div className="text-xs text-slate-500 dark:text-slate-400">Restricted</div>
                <div className="font-semibold text-slate-900 dark:text-white">${walletRestricted.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== GENERAL TAB ==================== */}
        {activeTab === "general" && hasRoleAccess(currentUserRole, "viewer") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Automation & Chatbot" subtitle="Control buyer conversations, handoff rules, and saved alerts.">
              <div className="space-y-4">
                <Toggle checked={chatbotEnabled} onChange={setChatbotEnabled} label="Enable AI Chatbot" hint="Answers MOQ, lead time, certifications, then hands off when needed." />
                <Toggle checked={autoSaveSearchAlerts} onChange={setAutoSaveSearchAlerts} label="Auto-save search alerts" hint="Automatically creates alerts for matching searches." />
                <div>
                  <Label>Handoff mode</Label>
                  <Select value={handoffMode} onChange={e => setHandoffMode(e.target.value)}>
                    <option value="notify_agent">Notify agent / owner</option>
                    <option value="notify_owner">Notify owner only</option>
                  </Select>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="AI Auto-Reply Customization" subtitle="Build the tone and structure of your first response.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Greeting</Label><Input value={autoReplyGreeting} onChange={e => setAutoReplyGreeting(e.target.value)} /></div>
                <div><Label>Signature</Label><Input value={autoReplySignature} onChange={e => setAutoReplySignature(e.target.value)} /></div>
                <div className="sm:col-span-2"><Label>Fallback response</Label><Input value={autoReplyFallback} onChange={e => setAutoReplyFallback(e.target.value)} /></div>
                <div><Label>Tone</Label><Select value={autoReplyTone} onChange={e => setAutoReplyTone(e.target.value)}><option>Professional</option><option>Warm</option><option>Direct</option><option>Friendly</option></Select></div>
                <div className="sm:col-span-2"><Label>Qualification prompt</Label><Textarea rows={4} value={autoReplyQualification} onChange={e => setAutoReplyQualification(e.target.value)} /></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <PrimaryButton onClick={saveChatbotSettings} disabled={!canAutoReply}>Save auto-reply settings</PrimaryButton>
                <SecondaryButton onClick={saveGeneralSettings}>Save settings</SecondaryButton>
              </div>
            </SectionCard>

            <SectionCard title="Communication Policy" subtitle="Throttle and prioritize messages with configurable rules.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Message cap per window</Label><Input type="number" value={policyMessageCaps} onChange={e => setPolicyMessageCaps(e.target.value)} /></div>
                <div><Label>Window (minutes)</Label><Input type="number" value={policyWindowMinutes} onChange={e => setPolicyWindowMinutes(e.target.value)} /></div>
                <div><Label>Cooldown (seconds)</Label><Input type="number" value={policyCooldownSeconds} onChange={e => setPolicyCooldownSeconds(e.target.value)} /></div>
                <div><Label>Strictness mode</Label><Select value={policyStrictnessMode} onChange={e => setPolicyStrictnessMode(e.target.value)}><option>Relaxed</option><option>Balanced</option><option>Strict</option></Select></div>
              </div>
            </SectionCard>

            <SectionCard title="Supplier Profile" subtitle="Show your operations and capabilities clearly.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Main processes</Label><Input value={mainProcesses} onChange={e => setMainProcesses(e.target.value)} /></div>
                <div><Label>Years in business</Label><Input type="number" value={yearsInBusiness} onChange={e => setYearsInBusiness(e.target.value)} /></div>
                <div><Label>Team seats</Label><Input type="number" value={teamSeats} onChange={e => setTeamSeats(e.target.value)} /></div>
                <div><Label>Export ports</Label><Input value={exportPorts} onChange={e => setExportPorts(e.target.value)} /></div>
                <div><Label>Location lat/lng</Label><Input value={locationLat && locationLng ? `${locationLat}, ${locationLng}` : ""} onChange={e => { const v = e.target.value.split(","); setLocationLat(v[0] || ""); setLocationLng(v[1] || ""); }} /></div>
                <div className="flex items-end"><Toggle checked={handlesMultipleFactories} onChange={setHandlesMultipleFactories} label="Handles multiple factories" /></div>
              </div>
              <div className="mt-4"><PrimaryButton onClick={saveGeneralSettings}>Save settings</PrimaryButton></div>
            </SectionCard>
          </div>
        )}

        {/* ==================== PROFILE TAB ==================== */}
        {activeTab === "profile" && hasRoleAccess(currentUserRole, "observer") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Profile Section" subtitle="Manage how your profile looks to buyers and partners.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Display Name</Label><Input value={profileDisplayName} onChange={e => setProfileDisplayName(e.target.value)} /></div>
                <div><Label>Headline</Label><Input value={profileHeadline} onChange={e => setProfileHeadline(e.target.value)} /></div>
                <div className="sm:col-span-2"><Label>Bio</Label><Textarea rows={4} value={profileBio} onChange={e => setProfileBio(e.target.value)} /></div>
                <div className="sm:col-span-2"><Label>Avatar URL</Label><Input value={profileAvatarUrl} onChange={e => setProfileAvatarUrl(e.target.value)} placeholder="https://..." /></div>
                <div className="sm:col-span-2">
                  <div className="rounded-3xl border border-dashed border-sky-300 bg-sky-50/60 p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 text-2xl font-black text-white">
                        {profileAvatarUrl ? <img src={profileAvatarUrl} alt="Preview" className="h-full w-full object-cover" /> : profileDisplayName.slice(0, 1).toUpperCase()}
                      </div>
                      <div><div className="font-semibold text-slate-900 dark:text-white">Avatar preview</div><div className="text-sm text-slate-500 dark:text-slate-400">Updates when URL is provided.</div></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-3"><PrimaryButton onClick={saveProfileSettings} disabled={loadingProfile}>{loadingProfile ? "Saving..." : "Save Profile"}</PrimaryButton></div>
            </SectionCard>

            <SectionCard title="Contact & Privacy" subtitle="Edit contact details, visibility, and notification preferences.">
              <div className="space-y-4">
                <div><Label>Email</Label><Input value={profileEmail} readOnly className="cursor-not-allowed opacity-90" /></div>
                <div><Label>Phone</Label><Input value={profilePhone} onChange={e => setProfilePhone(e.target.value)} /></div>
                <PrimaryButton onClick={saveContactSettings}>Save Contact</PrimaryButton>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Toggle checked={notifEmail} onChange={v => { setNotifEmail(v); saveNotificationPref("email", v); }} label="Email Notifications" />
                  <Toggle checked={notifPush} onChange={v => { setNotifPush(v); saveNotificationPref("push", v); }} label="Push Notifications" />
                  <Toggle checked={notifInApp} onChange={v => { setNotifInApp(v); saveNotificationPref("in_app", v); }} label="In-App Notifications" />
                </div>
                <div><Label>Profile Visibility</Label><Select value={profileVisibility} onChange={e => { setProfileVisibility(e.target.value); saveVisibility(e.target.value); }}><option>Public</option><option>Network</option><option>Private</option></Select></div>
              </div>
            </SectionCard>

            <SectionCard title="Password & Security" subtitle="Change password and keep account access protected.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><Badge tone={totpEnabled ? "green" : "red"}>2FA {totpEnabled ? "Enabled" : "Disabled"}</Badge></div>
                <div><Label>Current password</Label><Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></div>
                <div><Label>New password</Label><Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></div>
                <div className="sm:col-span-2"><Label>Confirm new password</Label><Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3"><PrimaryButton onClick={changePassword} disabled={changingPassword}>{changingPassword ? "Changing..." : "Change Password"}</PrimaryButton></div>
              {passwordFeedback && <p className={`mt-2 text-sm ${passwordFeedback.includes("success") ? "text-green-600" : "text-red-600"}`}>{passwordFeedback}</p>}
            </SectionCard>

            <SectionCard title="Data & Account Control" subtitle="Export data, review sessions, and remove the account securely.">
              <div className="space-y-4">
                <SecondaryButton onClick={exportUserData} disabled={exportingData}>{exportingData ? "Preparing..." : "Download My Data"}</SecondaryButton>
                {exportFeedback && <p className="text-sm text-slate-500">{exportFeedback}</p>}
                <div><Label>Type your name to confirm</Label><Input value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} placeholder={profileDisplayName} /></div>
                <PrimaryButton onClick={deleteAccount} disabled={deletingProfile || deleteConfirmText !== profileDisplayName}>{deletingProfile ? "Deleting..." : "Delete My Account"}</PrimaryButton>
                {deleteProfileFeedback && <p className="text-sm text-red-600">{deleteProfileFeedback}</p>}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div><div className="font-semibold text-slate-900 dark:text-white">Active Sessions</div><div className="text-sm text-slate-500 dark:text-slate-400">Reload, inspect, and revoke sessions.</div></div>
                    <SecondaryButton onClick={loadSessions}>Refresh</SecondaryButton>
                  </div>
                  <div className="space-y-3">
                    {loadingSessions ? <p className="text-sm text-slate-500">Loading...</p> : sessions.length === 0 ? <p className="text-sm text-slate-500">No active sessions.</p> : (
                      sessions.map(session => (
                        <div key={session.id || session.token} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2"><div className="font-medium text-slate-900 dark:text-white">{session.device || session.browser || "Unknown"}</div>{session.current && <Badge tone="green">Current</Badge>}</div>
                              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{session.ip} · {session.location || "Unknown"} · {session.last_active || "recently"}</div>
                            </div>
                            {!session.current && <SecondaryButton onClick={() => revokeSession(session.id || session.token)} disabled={revokingSession === (session.id || session.token)}>Revoke</SecondaryButton>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {/* ==================== VERIFICATION TAB ==================== */}
        {activeTab === "verification" && hasRoleAccess(currentUserRole, "factory") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Verification Status" subtitle="Track status and renew before expiration.">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={verificationTone}>{verificationStatus === "verified_active" ? "Verified Active" : verificationStatus === "expiring_soon" ? "Expiring Soon" : "Expired"}</Badge>
                <Badge tone="sky">{remainingDays} days remaining</Badge>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><div className="text-xs text-slate-500 dark:text-slate-400">Wallet balance</div><div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">${walletBalance.toFixed(2)}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><div className="text-xs text-slate-500 dark:text-slate-400">Restricted balance</div><div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">${walletRestricted.toFixed(2)}</div></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <SecondaryButton onClick={() => navigate("/verification")}>Open Verification Center</SecondaryButton>
                <PrimaryButton onClick={() => save("Renewal started for $6.99.")}>Renew verification ($6.99)</PrimaryButton>
              </div>
            </SectionCard>

            <SectionCard title="Missing Documents" subtitle="Upload these items to complete verification.">
              <div className="space-y-3">
                {verification?.missing_required?.length ? verification.missing_required.slice(0, 6).map(doc => (
                  <div key={doc} className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                    <span>{doc}</span><span className="text-xs font-semibold">Required</span>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">All verification documents have been uploaded.</div>
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ==================== SECURITY TAB ==================== */}
        {activeTab === "security" && hasRoleAccess(currentUserRole, "factory") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Passkeys" subtitle="Register WebAuthn passkeys for safer sign-ins.">
              <div className="space-y-3">
                {passkeys.map(p => (
                  <div key={p.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div><div className="font-medium text-slate-900 dark:text-white">{p.name}</div><div className="text-sm text-slate-500 dark:text-slate-400">Created {p.created_at || p.createdAt}</div></div>
                    <SecondaryButton onClick={() => { setPasskeys(x => x.filter(i => i.id !== p.id)); save(`Passkey ${p.name} deleted.`); }}>Delete</SecondaryButton>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input value={passkeyName} onChange={e => setPasskeyName(e.target.value)} placeholder="Passkey name" />
                <PrimaryButton onClick={addPasskey}>Add Passkey</PrimaryButton>
              </div>
              {passkeyError && <p className="mt-2 text-sm text-red-600">{passkeyError}</p>}
            </SectionCard>

            <SectionCard title="Active Sessions" subtitle="See live sessions and revoke access quickly.">
              <div className="space-y-3">
                {loadingSessions ? <p className="text-sm text-slate-500">Loading...</p> : sessions.length === 0 ? <p className="text-sm text-slate-500">No sessions.</p> : (
                  sessions.map(session => (
                    <div key={session.id || session.token} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-start justify-between gap-4">
                        <div><div className="flex items-center gap-2"><div className="font-medium text-slate-900 dark:text-white">{session.device || session.browser || "Unknown"}</div>{session.current && <Badge tone="green">Current</Badge>}</div><div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{session.ip} · {session.location || "Unknown"} · {session.last_active || "recently"}</div></div>
                        {!session.current && <SecondaryButton onClick={() => revokeSession(session.id || session.token)}>Revoke</SecondaryButton>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ==================== BRANDING TAB ==================== */}
        {activeTab === "branding" && hasRoleAccess(currentUserRole, "factory") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Brand Identity" subtitle="Set your brand name, logo, website, and tone.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Brand name</Label><Input value={brandName} onChange={e => setBrandName(e.target.value)} disabled={!canBranding} /></div>
                <div><Label>Website</Label><Input value={brandWebsite} onChange={e => setBrandWebsite(e.target.value)} disabled={!canBranding} /></div>
                <div className="sm:col-span-2"><Label>Logo URL</Label><Input value={brandLogoUrl} onChange={e => setBrandLogoUrl(e.target.value)} disabled={!canBranding} /></div>
                <div><Label>Accent style</Label><Select value={brandAccent} onChange={e => setBrandAccent(e.target.value)} disabled={!canBranding}><option>Sky Blue</option><option>Ocean</option><option>Classic Navy</option></Select></div>
                <div><Label>Tagline</Label><Input value={brandTagline} onChange={e => setBrandTagline(e.target.value)} disabled={!canBranding} /></div>
              </div>
              <div className="mt-4 flex gap-3"><PrimaryButton onClick={() => save("Branding saved.")} disabled={!canBranding}>Save Branding</PrimaryButton></div>
            </SectionCard>
            <SectionCard title="Brand Preview" subtitle="A preview of your brand identity.">
              <div className="rounded-[2rem] bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-400 p-6 text-white shadow-2xl">
                <div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 text-2xl font-black backdrop-blur">{brandName.slice(0, 1).toUpperCase()}</div><div><div className="text-2xl font-black">{brandName}</div><div className="text-sm text-white/85">{brandTagline}</div></div></div>
              </div>
            </SectionCard>
          </div>
        )}

        {/* ==================== SUBSCRIPTION TAB ==================== */}
        {activeTab === "subscription" && hasRoleAccess(currentUserRole, "factory") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Current Plan" subtitle="Track plan level and billing status.">
              <div className="rounded-[1.75rem] bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-400 p-6 text-white shadow-2xl">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">Plan</div>
                <div className="mt-2 text-3xl font-black">{subscriptionPlan === "free" ? "Free" : subscriptionPlan === "premium" ? "Premium" : "Enterprise"}</div>
                <div className="mt-2 text-white/85">{subscriptionPlan === "free" ? "Limited features" : "$49.00 / month"}</div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {subscriptionPlan === "free" && <SecondaryButton className="border-white/20 bg-white/15 text-white hover:bg-white/25" onClick={() => navigate("/pricing")}>Upgrade</SecondaryButton>}
                  <SecondaryButton className="border-white/20 bg-white/15 text-white hover:bg-white/25" onClick={() => navigate("/pricing")}>View plans</SecondaryButton>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Wallet" subtitle="Funds available for boosts and billing.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><div className="text-xs text-slate-500">Balance</div><div className="mt-1 text-2xl font-black">${walletBalance.toFixed(2)}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><div className="text-xs text-slate-500">Restricted</div><div className="mt-1 text-2xl font-black">${walletRestricted.toFixed(2)}</div></div>
              </div>
              <div className="mt-4"><PrimaryButton onClick={() => save("Add funds flow.")}>Add funds</PrimaryButton></div>
            </SectionCard>
          </div>
        )}

        {/* ==================== MEMBERS TAB ==================== */}
        {activeTab === "members" && hasRoleAccess(currentUserRole, "factory") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Team Members" subtitle="Manage your team.">
              <div className="space-y-3">
                {loadingMembers ? (
                  <p className="text-sm text-slate-500">Loading members...</p>
                ) : members.length === 0 ? (
                  <p className="text-sm text-slate-500">No team members yet.</p>
                ) : (
                  members.map(member => (
                    <div key={member.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{member.name || member.email}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{member.email}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge tone="sky">{member.role}</Badge>
                        <SecondaryButton onClick={() => removeMember(member.id)}>Remove</SecondaryButton>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>
            <SectionCard title="Invite Members" subtitle="Add teammates by email and role.">
              <div className="grid gap-4">
                <div><Label>Email</Label><Input value={memberInviteEmail} onChange={e => setMemberInviteEmail(e.target.value)} placeholder="team@company.com" /></div>
                <div><Label>Role</Label><Select value={memberInviteRole} onChange={e => setMemberInviteRole(e.target.value)}><option>Owner</option><option>Admin</option><option>Manager</option><option>Editor</option><option>Viewer</option></Select></div>
                <PrimaryButton onClick={inviteMember} disabled={invitingMember}>{invitingMember ? "Inviting..." : "Add member"}</PrimaryButton>
                {memberFeedback && <p className={`text-sm ${memberFeedback.includes("success") ? "text-green-600" : "text-red-600"}`}>{memberFeedback}</p>}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ==================== BOOSTS TAB ==================== */}
        {activeTab === "boosts" && hasRoleAccess(currentUserRole, "manager") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Boost Management" subtitle="Create and manage visibility boosts.">
              <p className="text-sm text-slate-500">Boost features coming soon.</p>
            </SectionCard>
          </div>
        )}

        {/* ==================== ASSISTANT KNOWLEDGE TAB ==================== */}
        {activeTab === "assistant_knowledge" && hasRoleAccess(currentUserRole, "manager") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Assistant Knowledge" subtitle="Manage FAQ entries used by the bot.">
              <div className="space-y-3">
                {entries.length === 0 ? <p className="text-sm text-slate-500">No FAQ entries yet.</p> : entries.map(entry => (
                  <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">{entry.question}</div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Add FAQ" subtitle="Expand the assistant with new answers.">
              <Label>Question</Label><Textarea rows={4} value={knowledgeForm.question} onChange={e => setKnowledgeForm(f => ({...f, question: e.target.value}))} placeholder="Example: What is your MOQ?" />
              <div className="mt-4"><PrimaryButton onClick={() => { if (!knowledgeForm.question.trim()) return; setEntries(e => [...e, { id: crypto.randomUUID(), ...knowledgeForm }]); setKnowledgeForm({type:"faq",question:"",answer:"",keywords:""}); save("FAQ added."); }}>Add FAQ</PrimaryButton></div>
            </SectionCard>
          </div>
        )}

        {!isOrgManager && (
          <div className="rounded-xl bg-red-50 p-4 text-red-600">You do not have permission to view organization settings.</div>
        )}
      </div>
    </div>
  );
}