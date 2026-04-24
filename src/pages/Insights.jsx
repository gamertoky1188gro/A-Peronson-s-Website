import React, { useEffect, useMemo, useState } from "react";
import AccessDeniedState from "../components/AccessDeniedState";
import useAnalyticsDashboard from "../hooks/useAnalyticsDashboard";
import { apiRequest, getCurrentUser, getToken } from "../lib/auth";

function StatCard({ label, value, hint = "" }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
      <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </div>
      {hint ? (
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

export default function Insights() {
  const {
    dashboard,
    companyAnalytics,
    platformAnalytics,
    premiumInsights,
    subscription,
    isEnterprise,
    loading,
    error,
    forbidden,
  } = useAnalyticsDashboard();
  const currentUser = useMemo(() => getCurrentUser(), []);
  const [profileViewers, setProfileViewers] = useState([]);
  const [productViewers, setProductViewers] = useState([]);
  const [viewerLoading, setViewerLoading] = useState(false);
  const totals = dashboard?.totals || {};
  const byType = dashboard?.analytics_events?.by_type || {};
  const interactionSummary = dashboard?.interaction_summary || {};
  const topMetrics = Array.isArray(dashboard?.top_metrics)
    ? dashboard.top_metrics
    : [];
  const companyTotals = companyAnalytics?.totals || {};
  const topProducts = Array.isArray(companyAnalytics?.top_products)
    ? companyAnalytics.top_products
    : [];
  const visitCountries = Array.isArray(
    companyAnalytics?.profile_visits_by_country,
  )
    ? companyAnalytics.profile_visits_by_country
    : [];
  const leadSources = Array.isArray(companyAnalytics?.top_lead_sources)
    ? companyAnalytics.top_lead_sources
    : [];
  const platformTotals = platformAnalytics?.totals || {};
  const platformCategories = Array.isArray(
    platformAnalytics?.top_categories_global,
  )
    ? platformAnalytics.top_categories_global
    : [];
  const platformByCountry = Array.isArray(
    platformAnalytics?.top_categories_by_country,
  )
    ? platformAnalytics.top_categories_by_country
    : [];
  const platformPriceDemand = Array.isArray(
    platformAnalytics?.price_range_demand,
  )
    ? platformAnalytics.price_range_demand
    : [];
  const platformMonthly = Array.isArray(platformAnalytics?.monthly_demand_trend)
    ? platformAnalytics.monthly_demand_trend
    : [];
  const platformSearchGlobal = Array.isArray(
    platformAnalytics?.top_search_categories_global,
  )
    ? platformAnalytics.top_search_categories_global
    : [];
  const platformSearchByCountry = Array.isArray(
    platformAnalytics?.top_search_categories_by_country,
  )
    ? platformAnalytics.top_search_categories_by_country
    : [];
  const platformTrending = Array.isArray(
    platformAnalytics?.trending_search_categories,
  )
    ? platformAnalytics.trending_search_categories
    : [];
  const searchEventCount = platformAnalytics?.search_event_count ?? 0;
  const searchDataReady = platformAnalytics?.search_data_ready ?? true;
  const searchMinEvents = platformAnalytics?.search_min_events ?? 25;
  const scopeLevel = String(platformAnalytics?.scope_level || "not_available");
  const suppressedFields = Array.isArray(platformAnalytics?.suppressed_fields)
    ? platformAnalytics.suppressed_fields
    : [];
  const privacyThresholdApplied = Boolean(
    platformAnalytics?.privacy_threshold_applied,
  );
  const premiumRole = premiumInsights?.role || "";
  const canExportAnalytics = currentUser?.capabilities?.leads?.export !== false;
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState("");

  useEffect(() => {
    const role = String(premiumRole || "").toLowerCase();
    if (!["factory", "buying_house"].includes(role)) return;
    const token = getToken();
    if (!token || !currentUser?.id) return;

    async function loadViewers() {
      setViewerLoading(true);
      try {
        const productId = companyAnalytics?.top_products?.[0]?.product_id || "";
        const requests = [
          apiRequest(
            `/analytics/viewers?entity=profile&id=${encodeURIComponent(currentUser.id)}&limit=8`,
            { token },
          ),
        ];
        if (productId) {
          requests.push(
            apiRequest(
              `/analytics/viewers?entity=product&id=${encodeURIComponent(productId)}&limit=8`,
              { token },
            ),
          );
        }
        const results = await Promise.all(requests);
        const profileData = results[0];
        const productData = results[1];
        setProfileViewers(
          Array.isArray(profileData?.items) ? profileData.items : [],
        );
        setProductViewers(
          Array.isArray(productData?.items) ? productData.items : [],
        );
      } catch {
        setProfileViewers([]);
        setProductViewers([]);
      } finally {
        setViewerLoading(false);
      }
    }

    loadViewers();
  }, [premiumRole, currentUser?.id, companyAnalytics?.top_products]);

  // Helpers for exporting sanitized analytics
  function downloadBlob(content, mimeType, filename) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function renderCsvFromReport(report = {}) {
    const lines = [];
    // Totals
    lines.push("# Totals");
    lines.push("metric,value");
    const totals = report.totals || {};
    Object.keys(totals).forEach((k) =>
      lines.push(`${k},${String(totals[k] ?? "")}`),
    );
    lines.push("");

    // Monthly demand trend
    if (Array.isArray(report.monthly_demand_trend)) {
      lines.push("# Monthly Demand Trend");
      lines.push("month,count");
      report.monthly_demand_trend.forEach((r) =>
        lines.push(`${r.month || ""},${Number(r.count || 0)}`),
      );
      lines.push("");
    }

    // Top categories global
    if (Array.isArray(report.top_categories_global)) {
      lines.push("# Top Categories (Global)");
      lines.push("category,count");
      report.top_categories_global.forEach((r) =>
        lines.push(`${r.label || ""},${Number(r.count || 0)}`),
      );
      lines.push("");
    }

    // Price range demand
    if (Array.isArray(report.price_range_demand)) {
      lines.push("# Price Range Demand");
      lines.push("bucket,count");
      report.price_range_demand.forEach((r) =>
        lines.push(`${r.bucket || ""},${Number(r.count || 0)}`),
      );
      lines.push("");
    }

    // Top search categories
    if (Array.isArray(report.top_search_categories_global)) {
      lines.push("# Top Search Categories (Global)");
      lines.push("label,count");
      report.top_search_categories_global.forEach((r) =>
        lines.push(`${r.label || ""},${Number(r.count || 0)}`),
      );
      lines.push("");
    }

    // Top categories by country
    if (Array.isArray(report.top_categories_by_country)) {
      lines.push("# Top Categories By Country");
      lines.push("country,category,count");
      report.top_categories_by_country.forEach((c) => {
        const country = c.country || "";
        const categories = Array.isArray(c.categories) ? c.categories : [];
        categories.forEach((cat) =>
          lines.push(`${country},${cat.label || ""},${Number(cat.count || 0)}`),
        );
      });
      lines.push("");
    }

    return lines.join("\n");
  }

  function renderHtmlReport(report = {}) {
    const escape = (s) =>
      String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    let html = `<html><head><meta charset="utf-8"><title>Analytics Export</title></head><body style="font-family:system-ui,Arial,Helvetica,sans-serif;padding:24px;">`;
    html += `<h1>Analytics Export</h1>`;
    html += `<h2>Totals</h2><ul>`;
    const totals = report.totals || {};
    Object.keys(totals).forEach((k) => {
      html += `<li><strong>${escape(k)}:</strong> ${escape(totals[k])}</li>`;
    });
    html += `</ul>`;

    if (Array.isArray(report.monthly_demand_trend)) {
      html += `<h2>Monthly Demand Trend</h2><table border="1" cellpadding="6" cellspacing="0"><tr><th>Month</th><th>Count</th></tr>`;
      report.monthly_demand_trend.forEach((r) => {
        html += `<tr><td>${escape(r.month)}</td><td>${escape(r.count)}</td></tr>`;
      });
      html += `</table>`;
    }

    if (Array.isArray(report.top_categories_global)) {
      html += `<h2>Top Categories (Global)</h2><ul>`;
      report.top_categories_global.forEach((r) => {
        html += `<li>${escape(r.label)} — ${escape(r.count)}</li>`;
      });
      html += `</ul>`;
    }

    html += `<p>Generated at ${new Date().toISOString()}</p>`;
    html += `</body></html>`;
    return html;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-[#020617] dark:text-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            Insights &amp; Analytics{" "}
            <span className="text-sm text-slate-500 dark:text-slate-400">
              ({isEnterprise ? "Enterprise" : "Free"} Plan)
            </span>
          </h1>
        </div>

        {loading ? (
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            Loading analytics...
          </div>
        ) : null}
        {forbidden ? (
          <div className="mb-4">
            <AccessDeniedState message={error} />
          </div>
        ) : null}
        {!forbidden && error ? (
          <div className="mb-4 rounded-2xl bg-rose-50 p-3 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20">
            {error}
          </div>
        ) : null}

        {forbidden ? null : (
          <>
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-5">
              {(topMetrics.length
                ? topMetrics
                : [
                    {
                      key: "buyer_requests",
                      label: "Buyer Requests",
                      value: String(totals.buyer_requests ?? 0),
                      hint: "",
                    },
                    {
                      key: "chats",
                      label: "Active Chats",
                      value: String(totals.chats ?? 0),
                      hint: "",
                    },
                    {
                      key: "partners",
                      label: "Partner Network",
                      value: String(totals.partner_network ?? 0),
                      hint: "",
                    },
                    {
                      key: "contracts",
                      label: "Contracts",
                      value: String(totals.contracts ?? 0),
                      hint: "",
                    },
                    {
                      key: "documents",
                      label: "Documents",
                      value: String(totals.documents ?? 0),
                      hint: "",
                    },
                  ]
              )
                .slice(0, 5)
                .map((m) => (
                  <StatCard
                    key={m.key}
                    label={m.label}
                    value={m.value}
                    hint={m.hint || ""}
                  />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Total Buyer Requests"
                value={totals.buyer_requests ?? 0}
              />
              <StatCard label="Active Chats" value={totals.chats ?? 0} />
              <StatCard
                label="Connected Partners"
                value={totals.partner_network ?? 0}
              />
              <StatCard
                label="Contracts / Documents"
                value={`${totals.contracts ?? 0} / ${totals.documents ?? 0}`}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
              <StatCard
                label="Total Page Views"
                value={interactionSummary.total_page_views ?? 0}
              />
              <StatCard
                label="Total Clicks"
                value={interactionSummary.total_clicks ?? 0}
              />
              <StatCard
                label="Avg Session Duration"
                value={`${interactionSummary.avg_session_duration_seconds ?? 0}s`}
              />
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Top Pages
                </div>
                <div className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {(interactionSummary.top_pages || []).length ? (
                    interactionSummary.top_pages.map((row) => (
                      <div
                        key={row.page}
                        className="flex items-center justify-between"
                      >
                        <span className="truncate">{row.page}</span>
                        <span className="font-semibold">{row.count}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500">No page view data yet.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              {!isEnterprise ? (
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    You are currently on{" "}
                    <strong>{subscription?.plan || "free"}</strong>. Upgrade to
                    Premium/Enterprise to unlock unlimited advanced filters,
                    expanded analytics, and exports.
                  </div>
                  <div className="mt-4">
                    <button className="px-3 py-2 bg-gtBlue hover:bg-gtBlueHover text-white rounded">
                      Upgrade to Enterprise
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold mb-3">
                    Analytics Events by Type
                  </h3>
                  <div className="space-y-2 text-sm">
                    {Object.keys(byType).length === 0 ? (
                      <div className="text-slate-600 dark:text-slate-400">
                        No analytics events recorded yet.
                      </div>
                    ) : null}
                    {Object.entries(byType).map(([type, count]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between rounded-md p-2 ring-1 ring-slate-200/60 dark:ring-slate-800"
                      >
                        <span>{type}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      className="px-3 py-2 rounded ring-1 ring-slate-200/70 dark:ring-slate-800 disabled:opacity-50"
                      disabled={
                        !canExportAnalytics ||
                        scopeLevel !== "platform_admin_full_detail" ||
                        exportLoading
                      }
                      title={
                        !canExportAnalytics
                          ? "Export disabled by policy"
                          : scopeLevel !== "platform_admin_full_detail"
                            ? "Export restricted to admin full-platform view"
                            : "Export CSV"
                      }
                      onClick={async () => {
                        if (
                          !canExportAnalytics ||
                          scopeLevel !== "platform_admin_full_detail"
                        )
                          return;
                        setExportError("");
                        setExportLoading(true);
                        try {
                          const token = getToken();
                          const resp = await apiRequest("/export/analytics", {
                            method: "POST",
                            token,
                          });
                          const report = resp?.report || {};
                          const csv = renderCsvFromReport(report);
                          downloadBlob(
                            csv,
                            "text/csv;charset=utf-8;",
                            `analytics_export_${Date.now()}.csv`,
                          );
                        } catch (err) {
                          setExportError(err?.message || String(err));
                        } finally {
                          setExportLoading(false);
                        }
                      }}
                    >
                      {exportLoading ? "Exporting..." : "Export CSV"}
                    </button>
                    <button
                      className="px-3 py-2 rounded ring-1 ring-slate-200/70 dark:ring-slate-800 disabled:opacity-50"
                      disabled={
                        !canExportAnalytics ||
                        scopeLevel !== "platform_admin_full_detail" ||
                        exportLoading
                      }
                      title={
                        !canExportAnalytics
                          ? "Export disabled by policy"
                          : scopeLevel !== "platform_admin_full_detail"
                            ? "Export restricted to admin full-platform view"
                            : "Download PDF Report"
                      }
                      onClick={async () => {
                        if (
                          !canExportAnalytics ||
                          scopeLevel !== "platform_admin_full_detail"
                        )
                          return;
                        setExportError("");
                        setExportLoading(true);
                        try {
                          const token = getToken();
                          const resp = await apiRequest("/export/analytics", {
                            method: "POST",
                            token,
                          });
                          const report = resp?.report || {};
                          const html = renderHtmlReport(report);
                          const blob = new Blob([html], { type: "text/html" });
                          const url = URL.createObjectURL(blob);
                          window.open(url, "_blank");
                        } catch (err) {
                          setExportError(err?.message || String(err));
                        } finally {
                          setExportLoading(false);
                        }
                      }}
                    >
                      {exportLoading ? "Preparing..." : "Download PDF Report"}
                    </button>
                  </div>
                  {exportError ? (
                    <p className="mt-2 text-xs text-rose-600">{exportError}</p>
                  ) : null}
                  {!canExportAnalytics ? (
                    <p className="mt-2 text-xs text-slate-500">
                      Export is disabled by organization policy.
                    </p>
                  ) : null}
                </>
              )}
            </div>

            <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Premium Insights</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                  {premiumRole || "premium"}
                </span>
              </div>
              {!premiumInsights ? (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Premium analytics unlock buying patterns, conversion insights,
                  and agent performance. Upgrade to Premium to view.
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {premiumInsights.request_performance ? (
                    <StatCard
                      label="Request Match Rate"
                      value={`${premiumInsights.request_performance.match_rate_pct ?? 0}%`}
                      hint="Matched buyer requests"
                    />
                  ) : null}
                  {premiumInsights.smart_matching_success_rate ? (
                    <StatCard
                      label="Smart Match Success"
                      value={`${premiumInsights.smart_matching_success_rate.match_rate_pct ?? 0}%`}
                      hint="Matched requests converted"
                    />
                  ) : null}
                  {premiumInsights.request_performance_insights ? (
                    <StatCard
                      label="Open Requests"
                      value={
                        premiumInsights.request_performance_insights
                          .open_requests ?? 0
                      }
                      hint="Requests still open"
                    />
                  ) : null}
                  {premiumInsights.request_performance_insights ? (
                    <StatCard
                      label="Response Speed"
                      value={
                        premiumInsights.request_performance_insights
                          .response_speed ||
                        premiumInsights.request_performance_insights
                          .response_speed_hours ||
                        "--"
                      }
                      hint="Avg response time"
                    />
                  ) : null}
                  {premiumInsights.request_performance ? (
                    <StatCard
                      label="Avg Response Time"
                      value={
                        premiumInsights.request_performance.avg_response_time ||
                        "--"
                      }
                      hint="Premium response speed"
                    />
                  ) : null}
                  {premiumInsights.buyer_conversion_insights ? (
                    <StatCard
                      label="Conversion Rate"
                      value={`${premiumInsights.buyer_conversion_insights.conversion_rate_pct ?? 0}%`}
                      hint="Deals closed"
                    />
                  ) : null}
                  {premiumInsights.advanced_analytics ? (
                    <StatCard
                      label="Product Views"
                      value={
                        premiumInsights.advanced_analytics.product_views ?? 0
                      }
                      hint="Premium visibility"
                    />
                  ) : null}
                  {premiumInsights.advanced_analytics ? (
                    <StatCard
                      label="Inquiry Rate"
                      value={
                        premiumInsights.advanced_analytics.inquiry_rate ?? 0
                      }
                      hint="Inbound inquiries per view"
                    />
                  ) : null}
                  {premiumInsights.buyer_interest_analytics ? (
                    <StatCard
                      label="Buyer Interest"
                      value={
                        premiumInsights.buyer_interest_analytics
                          .unique_buyers ?? 0
                      }
                      hint="Unique buyers reached"
                    />
                  ) : null}
                  {premiumInsights.buyer_interest_analytics ? (
                    <StatCard
                      label="Matched Requests"
                      value={
                        premiumInsights.buyer_interest_analytics
                          .matched_requests ?? 0
                      }
                      hint="Requests matched"
                    />
                  ) : null}
                  {premiumInsights.buyer_communication_insights ? (
                    <StatCard
                      label="Inbound Messages"
                      value={
                        premiumInsights.buyer_communication_insights
                          .inbound_messages ?? 0
                      }
                      hint="Buyer communications"
                    />
                  ) : null}
                  {premiumInsights.buyer_communication_insights ? (
                    <StatCard
                      label="Total Messages"
                      value={
                        premiumInsights.buyer_communication_insights
                          .total_messages ?? 0
                      }
                      hint="All thread messages"
                    />
                  ) : null}
                  {premiumInsights.buyer_communication_insights ? (
                    <StatCard
                      label="Avg Reply Time"
                      value={
                        premiumInsights.buyer_communication_insights
                          .avg_response_time || "--"
                      }
                      hint="Response speed"
                    />
                  ) : null}
                  {premiumInsights.order_completion_certification ? (
                    <StatCard
                      label="Completion Cert"
                      value={
                        premiumInsights.order_completion_certification.status ||
                        "pending"
                      }
                      hint="Order completion status"
                    />
                  ) : null}
                  {premiumInsights.buyer_conversion_insights ? (
                    <StatCard
                      label="Contracts Signed"
                      value={
                        premiumInsights.buyer_conversion_insights
                          .contracts_signed ?? 0
                      }
                      hint="Closed deals"
                    />
                  ) : null}
                </div>
              )}

              {premiumInsights?.agent_performance_analytics?.length ? (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Agent Performance
                  </p>
                  <div className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {premiumInsights.agent_performance_analytics.map(
                      (agent) => (
                        <div
                          key={agent.agent_id}
                          className="flex items-center justify-between rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                        >
                          <span className="truncate">
                            {agent.name || agent.agent_id}
                          </span>
                          <span className="text-xs font-semibold">
                            {agent.assigned_leads ?? 0} leads
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="mt-3 rounded-xl shadow-borderless dark:shadow-borderlessDark p-3">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Agent Outcomes
                    </p>
                    <div className="mt-2 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      <div className="grid grid-cols-6 gap-2 text-[10px] uppercase tracking-widest text-slate-400">
                        <span className="col-span-2">Agent</span>
                        <span className="text-right">Assigned</span>
                        <span className="text-right">Closed</span>
                        <span className="text-right">Confirmed</span>
                        <span className="text-right">Converted</span>
                      </div>
                      {premiumInsights.agent_performance_analytics.map(
                        (agent) => (
                          <div
                            key={`${agent.agent_id}-outcomes`}
                            className="grid grid-cols-6 gap-2 rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                          >
                            <span className="col-span-2 truncate">
                              {agent.name || agent.agent_id}
                            </span>
                            <span className="text-right">
                              {agent.assigned_leads ?? 0}
                            </span>
                            <span className="text-right">
                              {agent.closed_leads ?? 0}
                            </span>
                            <span className="text-right">
                              {agent.orders_confirmed ?? 0}
                            </span>
                            <span className="text-right">
                              {agent.conversions ?? 0}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {premiumInsights?.buying_pattern_analysis?.length ? (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Buying Pattern Analysis
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-700 dark:text-slate-300">
                    {premiumInsights.buying_pattern_analysis.map((row) => (
                      <span
                        key={row.label}
                        className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1"
                      >
                        {row.label} - {row.count}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {premiumInsights?.lead_distribution ? (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Lead Distribution
                  </p>
                  <div className="mt-2 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {Object.entries(premiumInsights.lead_distribution).map(
                      ([agentId, count]) => (
                        <div
                          key={agentId}
                          className="flex items-center justify-between rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                        >
                          <span className="truncate">{agentId}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : null}

              {["factory", "buying_house"].includes(
                String(premiumRole || "").toLowerCase(),
              ) ? (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark p-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Recent Profile Viewers
                    </p>
                    {viewerLoading ? (
                      <div className="mt-2 text-xs text-slate-500">
                        Loading viewers...
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        {profileViewers.length ? (
                          profileViewers.map((row) => (
                            <div
                              key={row.viewer_id}
                              className="flex items-center justify-between"
                            >
                              <span className="truncate">
                                {row.viewer?.name || row.viewer_id}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {new Date(row.viewed_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-500">
                            No viewers yet.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark p-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Recent Product Viewers
                    </p>
                    {viewerLoading ? (
                      <div className="mt-2 text-xs text-slate-500">
                        Loading viewers...
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        {productViewers.length ? (
                          productViewers.map((row) => (
                            <div
                              key={row.viewer_id}
                              className="flex items-center justify-between"
                            >
                              <span className="truncate">
                                {row.viewer?.name || row.viewer_id}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {new Date(row.viewed_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-500">
                            No viewers yet.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {companyAnalytics ? (
              <div className="mt-6 space-y-4">
                {companyAnalytics.limited ? (
                  <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
                    Advanced analytics (who viewed, inquiry rate, conversion
                    metrics) are available on Premium. Upgrade to unlock full
                    company analytics.
                  </div>
                ) : null}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                  <StatCard
                    label="Profile Visits"
                    value={companyTotals.profile_visits ?? 0}
                  />
                  <StatCard
                    label="Product Views"
                    value={companyTotals.product_views ?? 0}
                  />
                  <StatCard
                    label="Inbound Messages"
                    value={companyTotals.inbound_messages ?? 0}
                  />
                  <StatCard
                    label="Conversion Rate"
                    value={`${companyTotals.conversion_rate_pct ?? 0}%`}
                  />
                  <StatCard
                    label="Avg Response Time"
                    value={companyTotals.avg_response_time || "--"}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Top Viewed Products
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      {topProducts.length ? (
                        topProducts.map((row) => (
                          <div
                            key={row.product_id}
                            className="flex items-center justify-between rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                          >
                            <span className="truncate">{row.title}</span>
                            <span className="text-xs font-semibold">
                              {row.views}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">
                          No product views yet.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Profile Visits by Country
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      {visitCountries.length ? (
                        visitCountries.map((row) => (
                          <div
                            key={row.country}
                            className="flex items-center justify-between rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                          >
                            <span className="truncate">{row.country}</span>
                            <span className="text-xs font-semibold">
                              {row.count}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">
                          No visits yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Top Lead Sources
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {leadSources.length ? (
                      leadSources.map((row) => (
                        <div
                          key={`${row.source_type || row.label}-${row.source_id || row.label}`}
                          className="flex items-center justify-between rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                        >
                          <div className="min-w-0">
                            <span className="block truncate">{row.label}</span>
                            {row.source_type ? (
                              <span className="text-[10px] text-slate-400">
                                {row.source_type.replace(/_/g, " ")}
                              </span>
                            ) : null}
                          </div>
                          <span className="text-xs font-semibold">
                            {row.count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">
                        No lead source data yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {platformAnalytics ? (
              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-blue-50 p-4 text-xs text-blue-900 ring-1 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-200 dark:ring-blue-500/30">
                  <div className="font-semibold uppercase tracking-[0.12em]">
                    Scope: {scopeLevel.replace(/_/g, " ")}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div>
                      Privacy thresholds:{" "}
                      {privacyThresholdApplied ? "applied" : "not applied"}.
                      {suppressedFields.length
                        ? ` Suppressed controls: ${suppressedFields.join(", ")}.`
                        : " No suppressed slices in this snapshot."}
                    </div>
                    {privacyThresholdApplied ? (
                      <div
                        className="text-[11px] text-slate-500"
                        title="Anonymized platform data: identifiers removed/suppressed according to privacy policy"
                      >
                        ℹ️ Anonymized platform data
                      </div>
                    ) : null}
                  </div>
                </div>
                {!searchDataReady ? (
                  <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
                    Search trends are still warming up. We need more search
                    activity to show reliable demand insights. Current events:{" "}
                    {searchEventCount}/{searchMinEvents}. Showing proxy demand
                    from buyer requests.
                  </div>
                ) : null}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <StatCard
                    label="Total Buyer Requests"
                    value={platformTotals.buyer_requests ?? 0}
                  />
                  <StatCard
                    label="Repeat Buyer Rate"
                    value={`${platformTotals.repeat_buyer_rate ?? 0}%`}
                  />
                  <StatCard
                    label="Top Categories"
                    value={
                      platformCategories
                        .map((c) => c.label)
                        .slice(0, 3)
                        .join(", ") || "--"
                    }
                  />
                </div>

                {scopeLevel !== "platform_summary_aggregated" ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Top Categories by Country
                      </p>
                      <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                        {platformByCountry.length ? (
                          platformByCountry.map((row) => (
                            <div
                              key={row.country}
                              className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                            >
                              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                {row.country}
                              </div>
                              <div className="mt-1 text-sm">
                                {(row.categories || [])
                                  .map((c) => c.label)
                                  .join(", ") || "--"}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-slate-500">
                            No data yet.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Price Range Demand
                      </p>
                      <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        {platformPriceDemand.length ? (
                          platformPriceDemand.map((row) => (
                            <div
                              key={row.bucket}
                              className="flex items-center justify-between rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                            >
                              <span className="truncate">{row.bucket}</span>
                              <span className="text-xs font-semibold">
                                {row.count}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-slate-500">
                            No price-range data yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                    Detailed geography and segment breakdowns are hidden for
                    this role. Switch to organization-scoped or admin scope for
                    deeper cuts.
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Top Search Categories
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      {platformSearchGlobal.length ? (
                        platformSearchGlobal.map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                          >
                            <span className="truncate">{row.label}</span>
                            <span className="text-xs font-semibold">
                              {row.count}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">
                          No search data yet.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Trending Searches (30d)
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      {platformTrending.length ? (
                        platformTrending.map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                          >
                            <span className="truncate">{row.label}</span>
                            <span className="text-xs font-semibold">
                              {row.delta}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">
                          No trend data yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Search Categories by Country
                  </p>
                  <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    {platformSearchByCountry.length ? (
                      platformSearchByCountry.map((row) => (
                        <div
                          key={row.country}
                          className="rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                        >
                          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {row.country}
                          </div>
                          <div className="mt-1 text-sm">
                            {(row.categories || [])
                              .map((c) => c.label)
                              .join(", ") || "--"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">
                        No search data yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Monthly Demand Trend
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {platformMonthly.length ? (
                      platformMonthly.map((row) => (
                        <div
                          key={row.month}
                          className="flex items-center justify-between rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                        >
                          <span>{row.month}</span>
                          <span className="text-xs font-semibold">
                            {row.count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">
                        No monthly data yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
