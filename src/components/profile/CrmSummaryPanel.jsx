import React, { useEffect, useMemo, useState } from "react";
import { apiRequest, getCurrentUser, getToken } from "../../lib/auth";

function formatDate(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString();
}

function withinRange(iso, range = {}) {
  if (!range?.from && !range?.to) return true;
  const ts = new Date(iso || "").getTime();
  if (!Number.isFinite(ts)) return false;
  if (range.from && ts < range.from) return false;
  if (range.to && ts > range.to) return false;
  return true;
}

export default function CrmSummaryPanel({ targetId }) {
  const token = useMemo(() => getToken(), []);
  const currentUser = useMemo(() => getCurrentUser(), []);
  const actorRole = String(currentUser?.role || "").toLowerCase();
  const actorOrgId =
    actorRole === "agent"
      ? String(currentUser?.org_owner_id || "")
      : String(currentUser?.id || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterMatch, setFilterMatch] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [expandedThreads, setExpandedThreads] = useState({});

  useEffect(() => {
    if (!token || !targetId) return;
    const relationshipMode =
      actorOrgId && String(targetId) !== String(actorOrgId);
    const endpoint = relationshipMode
      ? `/crm/relationship/${encodeURIComponent(targetId)}`
      : `/crm/profile/${encodeURIComponent(targetId)}`;
    let alive = true;
    apiRequest(endpoint, { token })
      .then((res) => {
        if (!alive) return;
        setData(res);
        setError("");
      })
      .catch((err) => {
        if (!alive) return;
        setError(
          err.status === 403 ? "" : err.message || "Unable to load CRM summary",
        );
        setData(null);
      });
    return () => {
      alive = false;
    };
  }, [targetId, token, actorOrgId]);

  if (!data && !error) return null;
  if (!data) return null;

  const leadStatus = data?.leads?.by_status || {};
  const threads = Array.isArray(data?.messages?.threads)
    ? data.messages.threads
    : [];
  const calls = Array.isArray(data?.calls?.items) ? data.calls.items : [];
  const contracts = Array.isArray(data?.contracts?.items)
    ? data.contracts.items
    : [];
  const previousOrders = Array.isArray(data?.previous_orders)
    ? data.previous_orders
    : [];
  const agentOutcomes = Array.isArray(data?.agent_outcomes)
    ? data.agent_outcomes
    : [];
  const openLink =
    currentUser?.role === "agent" ? "/agent?tab=leads" : "/owner?tab=leads";
  const counterparty = data?.counterparty || null;
  const titleHint = counterparty?.name
    ? `Relationship with ${counterparty.name}`
    : "";

  const range = {
    from: filterFrom ? new Date(`${filterFrom}T00:00:00`).getTime() : null,
    to: filterTo ? new Date(`${filterTo}T23:59:59`).getTime() : null,
  };

  const matches = threads.map((thread) => thread.match_id).filter(Boolean);
  const filteredThreads = threads
    .filter((thread) => (filterMatch ? thread.match_id === filterMatch : true))
    .map((thread) => ({
      ...thread,
      messages: Array.isArray(thread.messages)
        ? thread.messages.filter((msg) =>
            withinRange(msg.timestamp || msg.created_at, range),
          )
        : [],
    }))
    .filter((thread) =>
      range.from || range.to ? thread.messages.length > 0 : true,
    );

  const filteredCalls = calls
    .filter((call) =>
      filterMatch
        ? String(call.match_id || call?.context?.chat_thread_id || "") ===
          filterMatch
        : true,
    )
    .filter((call) => withinRange(call.created_at || call.started_at, range));

  const filteredContracts = contracts.filter((contract) =>
    withinRange(contract.updated_at || contract.created_at, range),
  );

  function toggleThread(matchId) {
    setExpandedThreads((prev) => ({ ...prev, [matchId]: !prev[matchId] }));
  }

  return (
    <section className="mt-6 rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">CRM Timeline</p>
          <p className="text-[11px] text-slate-500">
            {titleHint || "Visible only to your team"}
          </p>
        </div>
        <a
          href={openLink}
          className="rounded-full bg-[#0A66C2] px-3 py-1 text-[11px] font-semibold text-white"
        >
          Open Leads
        </a>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-600">Lead Status</p>
          <div className="mt-2 space-y-1 text-xs text-slate-700">
            {Object.keys(leadStatus).length ? (
              Object.entries(leadStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize">
                    {String(status).replace(/_/g, " ")}
                  </span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-400">No leads yet.</div>
            )}
          </div>
        </div>

        <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-600">Messages</p>
          <div className="mt-2 space-y-1 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span>Total threads</span>
              <span className="font-semibold">
                {data?.messages?.total_threads ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total messages</span>
              <span className="font-semibold">
                {data?.messages?.total_messages ?? 0}
              </span>
            </div>
            {threads[0]?.last_message_at ? (
              <div className="text-[10px] text-slate-500">
                Latest: {formatDate(threads[0].last_message_at)}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-600">
            Calls & Contracts
          </p>
          <div className="mt-2 space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span>Calls</span>
              <span className="font-semibold">{data?.calls?.total ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Contracts</span>
              <span className="font-semibold">
                {data?.contracts?.total ?? 0}
              </span>
            </div>
            {contracts.length ? (
              <div className="text-[10px] text-slate-500">
                Latest contract:{" "}
                {formatDate(
                  contracts[0]?.updated_at || contracts[0]?.created_at,
                )}
              </div>
            ) : null}
            {calls.length ? (
              <div className="text-[10px] text-slate-500">
                Latest call:{" "}
                {formatDate(calls[0]?.created_at || calls[0]?.started_at)}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-4">
        <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white p-3">
          <label className="text-[11px] font-semibold text-slate-500">
            Type
          </label>
          <select
            value={filterType}
            onChange={(event) => setFilterType(event.target.value)}
            className="mt-2 w-full rounded-lg shadow-borderless dark:shadow-borderlessDark bg-slate-50 px-3 py-2 text-xs"
          >
            <option value="all">All</option>
            <option value="messages">Messages</option>
            <option value="calls">Calls</option>
            <option value="contracts">Contracts</option>
          </select>
        </div>

        <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white p-3">
          <label className="text-[11px] font-semibold text-slate-500">
            Match
          </label>
          <select
            value={filterMatch}
            onChange={(event) => setFilterMatch(event.target.value)}
            className="mt-2 w-full rounded-lg shadow-borderless dark:shadow-borderlessDark bg-slate-50 px-3 py-2 text-xs"
          >
            <option value="">All threads</option>
            {matches.map((match) => (
              <option key={match} value={match}>
                {match.slice(0, 18)}...
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white p-3">
          <label className="text-[11px] font-semibold text-slate-500">
            From
          </label>
          <input
            type="date"
            value={filterFrom}
            onChange={(event) => setFilterFrom(event.target.value)}
            className="mt-2 w-full rounded-lg shadow-borderless dark:shadow-borderlessDark bg-slate-50 px-3 py-2 text-xs"
          />
        </div>

        <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white p-3">
          <label className="text-[11px] font-semibold text-slate-500">To</label>
          <input
            type="date"
            value={filterTo}
            onChange={(event) => setFilterTo(event.target.value)}
            className="mt-2 w-full rounded-lg shadow-borderless dark:shadow-borderlessDark bg-slate-50 px-3 py-2 text-xs"
          />
        </div>
      </div>

      {filterType === "all" || filterType === "messages" ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-900">
            Message Timeline
          </p>
          <div className="mt-2 space-y-3">
            {filteredThreads.length ? (
              filteredThreads.map((thread) => (
                <div
                  key={thread.match_id}
                  className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-slate-700">
                      Thread {thread.match_id.slice(0, 10)}...
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleThread(thread.match_id)}
                      className="text-[11px] font-semibold text-[#0A66C2]"
                    >
                      {expandedThreads[thread.match_id] ? "Hide" : "View"} (
                      {thread.message_count})
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Last: {formatDate(thread.last_message_at)}
                  </div>
                  {expandedThreads[thread.match_id] ? (
                    <div className="mt-3 space-y-2">
                      {thread.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="rounded-lg bg-white p-2 text-xs text-slate-700"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">
                              {msg.sender_name || msg.sender_id}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatDate(msg.timestamp || msg.created_at)}
                            </span>
                          </div>
                          <p className="mt-1 whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">
                No message history yet.
              </div>
            )}
          </div>
        </div>
      ) : null}

      {filterType === "all" || filterType === "calls" ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-900">Call History</p>
          <div className="mt-2 space-y-2">
            {filteredCalls.length ? (
              filteredCalls.map((call) => (
                <div
                  key={call.id}
                  className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-3 text-xs text-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {call.title || "Call session"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(call.created_at || call.started_at)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Participants:{" "}
                    {(call.participants || []).map((p) => p.name).join(", ") ||
                      "N/A"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">No call history yet.</div>
            )}
          </div>
        </div>
      ) : null}

      {filterType === "all" || filterType === "contracts" ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-900">
            Contracts & Previous Orders
          </p>
          <div className="mt-2 space-y-2">
            {filteredContracts.length ? (
              filteredContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-3 text-xs text-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {contract.contract_number || contract.title || "Contract"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(contract.updated_at || contract.created_at)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Status: {contract.lifecycle_status || "draft"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">No contracts yet.</div>
            )}
          </div>

          {previousOrders.length ? (
            <div className="mt-3 rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white p-3">
              <p className="text-xs font-semibold text-slate-600">
                Previous orders (signed contracts)
              </p>
              <div className="mt-2 space-y-2 text-xs text-slate-700">
                {previousOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2"
                  >
                    <span className="truncate">
                      {order.contract_number || order.title || "Contract"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {formatDate(order.signed_at)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {agentOutcomes.length ? (
        <div className="mt-4 rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Agent Outcomes</p>
          <div className="mt-2 space-y-2 text-xs text-slate-700">
            <div className="grid grid-cols-6 gap-2 text-[10px] uppercase tracking-widest text-slate-400">
              <span className="col-span-2">Agent</span>
              <span className="text-right">Assigned</span>
              <span className="text-right">Closed</span>
              <span className="text-right">Confirmed</span>
              <span className="text-right">Converted</span>
            </div>
            {agentOutcomes.map((agent) => (
              <div
                key={agent.agent_id}
                className="grid grid-cols-6 gap-2 rounded-lg shadow-borderless dark:shadow-borderlessDark bg-white px-3 py-2"
              >
                <span className="col-span-2 truncate">{agent.name}</span>
                <span className="text-right">{agent.assigned_leads ?? 0}</span>
                <span className="text-right">{agent.closed_leads ?? 0}</span>
                <span className="text-right">
                  {agent.orders_confirmed ?? 0}
                </span>
                <span className="text-right">{agent.conversions ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
