import React, { useEffect, useState } from "react";
import { apiRequest } from "../lib/auth";

const initialPolicy = { code: "", name: "", description: "" };
const initialVersion = {
  policyId: "",
  status: "active",
  effectiveFrom: "",
  roleScopes: "",
  planScopes: "",
  regionScopes: "",
  rulesJson: '{"maxWarnings":1}',
};
const initialSimulation = {
  policyVersionId: "",
  role: "",
  plan: "",
  region: "",
};
const initialTemplate = {
  templateKey: "trust_decision_notice",
  channel: "in_app",
  subject: "Trust decision update",
  body: "Action {{action}} was applied to your account.",
};

function splitCsv(value) {
  return String(value || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function AdminGovernance() {
  const [policy, setPolicy] = useState(initialPolicy);
  const [version, setVersion] = useState(initialVersion);
  const [simulation, setSimulation] = useState(initialSimulation);
  const [userId, setUserId] = useState("");
  const [trustSignals, setTrustSignals] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [history, setHistory] = useState([]);
  const [simulationResult, setSimulationResult] = useState(null);
  const [reportMonth, setReportMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [status, setStatus] = useState("");

  const load = async () => {
    const [policyRes, historyRes, templatesRes] = await Promise.all([
      apiRequest("/admin/governance/policies"),
      apiRequest("/admin/governance/enforcement/history?limit=50"),
      apiRequest("/admin/governance/templates"),
    ]);
    setPolicies(policyRes?.items || []);
    setHistory(historyRes?.items || []);
    setTemplates(templatesRes?.items || []);
  };

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        await load();
      } catch {
        if (active) setStatus("Failed to load governance data");
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  const savePolicy = async () => {
    await apiRequest("/admin/governance/policies", {
      method: "POST",
      body: policy,
    });
    setPolicy(initialPolicy);
    setStatus("Policy saved");
    await load();
  };

  const createVersion = async () => {
    const rules = JSON.parse(version.rulesJson || "{}");
    await apiRequest("/admin/governance/policy-versions", {
      method: "POST",
      body: {
        policyId: version.policyId,
        status: version.status,
        effectiveFrom: version.effectiveFrom || new Date().toISOString(),
        rules,
        scopes: {
          role: splitCsv(version.roleScopes),
          plan: splitCsv(version.planScopes),
          region: splitCsv(version.regionScopes),
        },
      },
    });
    setStatus("Policy version created");
    await load();
  };

  const simulate = async () => {
    const result = await apiRequest("/admin/governance/simulate", {
      method: "POST",
      body: {
        policyVersionId: simulation.policyVersionId,
        actor: {
          role: simulation.role,
          plan: simulation.plan,
          region: simulation.region,
        },
      },
    });
    setSimulationResult(result);
  };

  const evaluateRisk = async () => {
    if (!userId) return;
    const signals = await apiRequest(
      `/admin/governance/trust/signals?user_id=${encodeURIComponent(userId)}`,
    );
    setTrustSignals(signals);
    const evalRow = await apiRequest("/admin/governance/trust/evaluate", {
      method: "POST",
      body: { user_id: userId, decision: "auto_evaluated" },
    });
    await apiRequest("/admin/governance/enforcement/apply", {
      method: "POST",
      body: {
        userId,
        evaluationId: evalRow?.id,
        reason: "Automated governance review from admin panel",
      },
    });
    setStatus("Trust evaluated and enforcement decision applied");
    await load();
  };

  const saveTemplate = async () => {
    await apiRequest("/admin/governance/templates", {
      method: "POST",
      body: initialTemplate,
    });
    setStatus("Template saved");
    await load();
  };

  const generateReport = async () => {
    const result = await apiRequest("/admin/governance/reports/monthly", {
      method: "POST",
      body: { month: reportMonth },
    });
    setMonthlyReport(result?.item || null);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-3xl font-semibold">Admin Governance Console</h1>
        {status ? (
          <p className="rounded border border-emerald-400/40 bg-emerald-500/10 p-2 text-sm">
            {status}
          </p>
        ) : null}

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-lg font-semibold">Policy Editor</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <input
              className="rounded bg-slate-800 p-2"
              placeholder="Code"
              value={policy.code}
              onChange={(e) =>
                setPolicy((p) => ({ ...p, code: e.target.value }))
              }
            />
            <input
              className="rounded bg-slate-800 p-2"
              placeholder="Name"
              value={policy.name}
              onChange={(e) =>
                setPolicy((p) => ({ ...p, name: e.target.value }))
              }
            />
            <input
              className="rounded bg-slate-800 p-2"
              placeholder="Description"
              value={policy.description}
              onChange={(e) =>
                setPolicy((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>
          <button
            className="mt-3 rounded bg-indigo-600 px-3 py-2 text-sm"
            onClick={savePolicy}
          >
            Save policy
          </button>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <select
              className="rounded bg-slate-800 p-2"
              value={version.policyId}
              onChange={(e) =>
                setVersion((p) => ({ ...p, policyId: e.target.value }))
              }
            >
              <option value="">Select policy</option>
              {policies.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.code}
                </option>
              ))}
            </select>
            <input
              className="rounded bg-slate-800 p-2"
              type="datetime-local"
              value={version.effectiveFrom}
              onChange={(e) =>
                setVersion((p) => ({ ...p, effectiveFrom: e.target.value }))
              }
            />
            <input
              className="rounded bg-slate-800 p-2"
              placeholder="Role scopes (csv)"
              value={version.roleScopes}
              onChange={(e) =>
                setVersion((p) => ({ ...p, roleScopes: e.target.value }))
              }
            />
            <input
              className="rounded bg-slate-800 p-2"
              placeholder="Plan scopes (csv)"
              value={version.planScopes}
              onChange={(e) =>
                setVersion((p) => ({ ...p, planScopes: e.target.value }))
              }
            />
            <input
              className="rounded bg-slate-800 p-2"
              placeholder="Region scopes (csv)"
              value={version.regionScopes}
              onChange={(e) =>
                setVersion((p) => ({ ...p, regionScopes: e.target.value }))
              }
            />
            <textarea
              className="rounded bg-slate-800 p-2"
              rows={3}
              placeholder="Rules JSON"
              value={version.rulesJson}
              onChange={(e) =>
                setVersion((p) => ({ ...p, rulesJson: e.target.value }))
              }
            />
          </div>
          <button
            className="mt-3 rounded bg-indigo-600 px-3 py-2 text-sm"
            onClick={createVersion}
          >
            Create policy version
          </button>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-lg font-semibold">Rule Simulation</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-4">
            <input
              className="rounded bg-slate-800 p-2"
              placeholder="Policy version id"
              value={simulation.policyVersionId}
              onChange={(e) =>
                setSimulation((p) => ({
                  ...p,
                  policyVersionId: e.target.value,
                }))
              }
            />
            <input
              className="rounded bg-slate-800 p-2"
              placeholder="Role"
              value={simulation.role}
              onChange={(e) =>
                setSimulation((p) => ({ ...p, role: e.target.value }))
              }
            />
            <input
              className="rounded bg-slate-800 p-2"
              placeholder="Plan"
              value={simulation.plan}
              onChange={(e) =>
                setSimulation((p) => ({ ...p, plan: e.target.value }))
              }
            />
            <input
              className="rounded bg-slate-800 p-2"
              placeholder="Region"
              value={simulation.region}
              onChange={(e) =>
                setSimulation((p) => ({ ...p, region: e.target.value }))
              }
            />
          </div>
          <button
            className="mt-3 rounded bg-violet-600 px-3 py-2 text-sm"
            onClick={simulate}
          >
            Run simulation
          </button>
          {simulationResult ? (
            <pre className="mt-3 overflow-auto rounded bg-slate-950 p-2 text-xs">
              {JSON.stringify(simulationResult, null, 2)}
            </pre>
          ) : null}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-lg font-semibold">Trust Risk & Enforcement</h2>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded bg-slate-800 p-2"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button
              className="rounded bg-amber-600 px-3 py-2 text-sm"
              onClick={evaluateRisk}
            >
              Evaluate + enforce
            </button>
          </div>
          {trustSignals ? (
            <pre className="mt-3 overflow-auto rounded bg-slate-950 p-2 text-xs">
              {JSON.stringify(trustSignals, null, 2)}
            </pre>
          ) : null}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-lg font-semibold">Enforcement History Viewer</h2>
          <div className="mt-3 space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="rounded border border-slate-800 p-2 text-sm"
              >
                <div className="font-medium">
                  {item.action} • {item.user_id}
                </div>
                <div className="text-slate-400">
                  {item.reason || "No reason"} •{" "}
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-lg font-semibold">
            Notification Templates & Appeal Workflow
          </h2>
          <button
            className="mt-2 rounded bg-fuchsia-600 px-3 py-2 text-sm"
            onClick={saveTemplate}
          >
            Save trust templates
          </button>
          <pre className="mt-3 overflow-auto rounded bg-slate-950 p-2 text-xs">
            {JSON.stringify(templates, null, 2)}
          </pre>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-lg font-semibold">
            Monthly Governance Reporting
          </h2>
          <div className="mt-2 flex gap-2">
            <input
              className="rounded bg-slate-800 p-2"
              type="month"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
            />
            <button
              className="rounded bg-emerald-600 px-3 py-2 text-sm"
              onClick={generateReport}
            >
              Generate report
            </button>
          </div>
          {monthlyReport ? (
            <pre className="mt-3 overflow-auto rounded bg-slate-950 p-2 text-xs">
              {JSON.stringify(monthlyReport, null, 2)}
            </pre>
          ) : null}
        </section>
      </div>
    </div>
  );
}
