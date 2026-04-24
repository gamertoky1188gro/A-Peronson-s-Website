import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../lib/auth";

const DEFAULT_ADMIN_PANEL_FALLBACK_INVENTORY = [
  {
    id: "platform",
    label: "Core Platform & Business Control",
    icon_name: "ShieldCheck",
    sections: [],
  },
  {
    id: "infra",
    label: "Server / System / Infrastructure Management",
    icon_name: "Server",
    sections: [],
  },
  {
    id: "network",
    label: "Network Monitoring & Management",
    icon_name: "Network",
    sections: [],
  },
  {
    id: "server-admin",
    label: "Server Admin + App Management",
    icon_name: "Database",
    sections: [],
  },
  {
    id: "cms",
    label: "CMS + Content Management",
    icon_name: "Settings",
    sections: [],
  },
  {
    id: "ultra-security",
    label: "Ultra Security Layer",
    icon_name: "Lock",
    sections: [],
  },
];

const DEFAULT_PIE_PALETTE = ["#38bdf8", "#60a5fa", "#0f172a"];
const DEFAULT_CMS_WEEKLY_TREND = [
  { name: "Mon", value: 24 },
  { name: "Tue", value: 38 },
  { name: "Wed", value: 29 },
  { name: "Thu", value: 57 },
  { name: "Fri", value: 44 },
  { name: "Sat", value: 66 },
  { name: "Sun", value: 52 },
];
const DEFAULT_ULTRA_MINI_CHART_POINTS = [
  22, 28, 24, 34, 30, 46, 40, 54, 50, 66, 58, 72,
];
const DEFAULT_ULTRA_MINI_CHART_KPIS = [
  { label: "Requests", value: "12.8k" },
  { label: "Integrity", value: "99.98%" },
  { label: "Latency", value: "148ms" },
];
const DEFAULT_EMPTY_STATE_COPY = {
  "verification.pending.short": "No pending verifications.",
  "verification.pending": "No pending verifications in queue.",
  "disputes.none": "No active disputes.",
  "firewall.rules.none": "No rules yet.",
  "cron.jobs.none": "No cron jobs yet.",
};
const DEFAULT_SECTION_METRICS = {
  wallet: [
    { label: "Balance", path: "wallet.total_balance_usd", format: "currency" },
  ],
};
const DEFAULT_ADMIN_PANEL_ALLOWED_ROLES = ["owner", "admin"];
const KNOWN_ROLES = [
  "buyer",
  "factory",
  "buying_house",
  "owner",
  "admin",
  "agent",
];
const INFRA_CAPABILITIES_DEFAULT = [
  {
    capability_id: "system_health",
    title: "System Health & Performance Monitoring",
    count: 5,
    icon_name: "Activity",
    subtitle: "Real-time signals, resource visibility, and operational pulse.",
  },
  {
    capability_id: "os_maintenance",
    title: "OS & Software Maintenance",
    count: 4,
    icon_name: "Server",
    subtitle: "Safe updates, package checks, and controlled maintenance flows.",
  },
];
const NETWORK_CAPABILITIES_DEFAULT = [
  {
    capability_id: "monitoring",
    title: "Real-Time Monitoring & Visibility",
    count: 4,
    icon_name: "Activity",
    subtitle: "Interface health, packet loss, latency heatmap.",
  },
];
const ULTRA_CAPABILITIES_DEFAULT = [
  {
    capability_id: "zero_trust",
    title: "Zero-Trust Access Controls",
    count: 8,
    icon_name: "Lock",
    subtitle: "Mandatory MFA, session timeout, IP whitelisting.",
  },
];
const BUYER_BENEFITS_DEFAULT = [
  "Access to factory network",
  "Request quotations",
  "Track orders",
];
const FACTORY_BENEFITS_DEFAULT = [
  "Receive RFQs",
  "Manage products",
  "Track shipments",
];
const BUYING_HOUSE_BENEFITS_DEFAULT = [
  "Manage multiple buyers",
  "Commission tracking",
  "Supplier network",
];

export function useAdminFullConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/admin/config/total-config", {
        method: "GET",
      });
      setConfig(data);
      setError(null);
    } catch (e) {
      console.log("[useAdminFullConfig] Failed to fetch config:", e.message);
      setError(e);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const inventory = config?.inventory || DEFAULT_ADMIN_PANEL_FALLBACK_INVENTORY;
  const uiConfig = config?.ui_config || {};
  const roles = config?.roles || {};
  const infraCapabilities = config?.infra_capabilities?.length
    ? config.infra_capabilities
    : INFRA_CAPABILITIES_DEFAULT;
  const networkCapabilities = config?.network_capabilities?.length
    ? config.network_capabilities
    : NETWORK_CAPABILITIES_DEFAULT;
  const ultraCapabilities = config?.ultra_capabilities?.length
    ? config.ultra_capabilities
    : ULTRA_CAPABILITIES_DEFAULT;
  const actions = config?.actions || [];
  const rolesList = config?.roles?.roles || [];

  const knownRoles = roles?.known_roles || KNOWN_ROLES;
  const allowedRoles =
    roles?.allowed_roles || DEFAULT_ADMIN_PANEL_ALLOWED_ROLES;
  const piePalette =
    uiConfig?.chart_palette?.length >= 2
      ? uiConfig.chart_palette
      : DEFAULT_PIE_PALETTE;
  const sectionMetrics = uiConfig?.section_metrics || DEFAULT_SECTION_METRICS;
  const emptyStates = uiConfig?.empty_states || DEFAULT_EMPTY_STATE_COPY;
  const cmsWeeklyTrend = DEFAULT_CMS_WEEKLY_TREND;
  const ultraMiniChartPoints = DEFAULT_ULTRA_MINI_CHART_POINTS;
  const ultraMiniChartKpis = DEFAULT_ULTRA_MINI_CHART_KPIS;

  return {
    config,
    loading,
    error,
    refetch,
    inventory,
    uiConfig,
    roles,
    infraCapabilities,
    networkCapabilities,
    ultraCapabilities,
    actions,
    rolesList,
    knownRoles,
    allowedRoles,
    piePalette,
    sectionMetrics,
    emptyStates,
    cmsWeeklyTrend,
    ultraMiniChartPoints,
    ultraMiniChartKpis,
  };
}

export function useInventory() {
  const [inventory, setInventory] = useState(
    DEFAULT_ADMIN_PANEL_FALLBACK_INVENTORY,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      try {
        const data = await apiRequest("/admin/config/inventory", {
          method: "GET",
        });
        if (data && data.length > 0) {
          setInventory(data);
        }
      } catch {
        console.log("[useInventory] Using fallback (auth may not be ready)");
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, []);

  return { inventory, loading };
}

export function useUiConfig() {
  const [uiConfig, setUiConfig] = useState({
    chart_palette: DEFAULT_PIE_PALETTE,
    section_metrics: DEFAULT_SECTION_METRICS,
    empty_states: DEFAULT_EMPTY_STATE_COPY,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUiConfig() {
      setLoading(true);
      try {
        const data = await apiRequest("/admin/config/ui", { method: "GET" });
        setUiConfig({
          chart_palette:
            data?.chart_palette?.length >= 2
              ? data.chart_palette
              : DEFAULT_PIE_PALETTE,
          section_metrics: data?.section_metrics || DEFAULT_SECTION_METRICS,
          empty_states: data?.empty_states || DEFAULT_EMPTY_STATE_COPY,
        });
      } catch {
        console.log("[useUiConfig] Using fallback (auth may not be ready)");
      } finally {
        setLoading(false);
      }
    }
    fetchUiConfig();
  }, []);

  return {
    ...uiConfig,
    loading,
    piePalette: uiConfig.chart_palette,
    sectionMetrics: uiConfig.section_metrics,
    emptyStates: uiConfig.empty_states,
  };
}

export function useCapabilities(moduleId) {
  const [capabilities, setCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCapabilities() {
      setLoading(true);
      try {
        const endpoint =
          moduleId === "infra"
            ? "/admin/config/infra-capabilities"
            : moduleId === "network"
              ? "/admin/config/network-capabilities"
              : moduleId === "ultra-security"
                ? "/admin/config/ultra-capabilities"
                : null;
        if (endpoint) {
          const data = await apiRequest(endpoint, { method: "GET" });
          setCapabilities(data || []);
        }
      } catch (e) {
        console.log("[useCapabilities] Error:", e.message);
      } finally {
        setLoading(false);
      }
    }
    if (moduleId) fetchCapabilities();
  }, [moduleId]);

  return { capabilities, loading };
}

export function useActions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActions() {
      setLoading(true);
      try {
        const data = await apiRequest("/admin/config/actions", {
          method: "GET",
        });
        setActions(data || []);
      } catch (e) {
        console.log("[useActions] Error:", e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchActions();
  }, []);

  return { actions, loading };
}

export function useActionGroups() {
  const [groups, setGroups] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      setLoading(true);
      try {
        const data = await apiRequest("/admin/config/actions/groups", {
          method: "GET",
        });
        setGroups(data && data.length > 0 ? data : null);
      } catch (e) {
        console.log("[useActionGroups] Error:", e.message);
        setGroups(null);
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  return { groups, loading };
}

export function useRoleConfig() {
  const [roles, setRoles] = useState({
    known_roles: KNOWN_ROLES,
    allowed_roles: DEFAULT_ADMIN_PANEL_ALLOWED_ROLES,
    roles: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      setLoading(true);
      try {
        const [rolesData, rolesList] = await Promise.all([
          apiRequest("/admin/config/roles", { method: "GET" }),
          apiRequest("/admin/config/roles-list", { method: "GET" }),
        ]);
        setRoles({
          ...rolesData,
          roles: rolesList || [],
        });
      } catch (e) {
        console.log("[useRoleConfig] Error:", e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRoles();
  }, []);

  return {
    ...roles,
    loading,
    knownRoles: roles.known_roles,
    allowedRoles: roles.allowed_roles,
    rolesList: roles.roles,
    buyerBenefits:
      roles.roles?.find((r) => r.role_key === "buyer")?.benefits ||
      BUYER_BENEFITS_DEFAULT,
    factoryBenefits:
      roles.roles?.find((r) => r.role_key === "factory")?.benefits ||
      FACTORY_BENEFITS_DEFAULT,
    buyingHouseBenefits:
      roles.roles?.find((r) => r.role_key === "buying_house")?.benefits ||
      BUYING_HOUSE_BENEFITS_DEFAULT,
  };
}

export {
  DEFAULT_ADMIN_PANEL_FALLBACK_INVENTORY,
  DEFAULT_PIE_PALETTE,
  DEFAULT_CMS_WEEKLY_TREND,
  DEFAULT_ULTRA_MINI_CHART_POINTS,
  DEFAULT_ULTRA_MINI_CHART_KPIS,
  DEFAULT_EMPTY_STATE_COPY,
  DEFAULT_SECTION_METRICS,
  DEFAULT_ADMIN_PANEL_ALLOWED_ROLES,
  KNOWN_ROLES,
  INFRA_CAPABILITIES_DEFAULT,
  NETWORK_CAPABILITIES_DEFAULT,
  ULTRA_CAPABILITIES_DEFAULT,
  BUYER_BENEFITS_DEFAULT,
  FACTORY_BENEFITS_DEFAULT,
  BUYING_HOUSE_BENEFITS_DEFAULT,
};
