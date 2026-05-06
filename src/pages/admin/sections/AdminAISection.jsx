/**
 * Admin AI Section - AI Rules & Configuration
 */
import React, { useState, useEffect } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

import {
  Bot,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Lightbulb,
  Loader2,
  Settings,
  Code2,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  Edit3,
} from "lucide-react";
import { apiRequest } from "../../../lib/auth";

export function AdminAISection({ activeCategory, adminDark }) {
  const [rules, setRules] = useState({ globalRules: [], smallTalkRules: [] });
  const [knowledge, setKnowledge] = useState([]);
  const [config, setConfig] = useState({
    systemPrompt: "",
    agentPrompt: "",
    codeContextEnabled: true,
    codeContextKeywords: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("settings");

  const [newRule, setNewRule] = useState({
    source: "",
    keywords: "",
    response: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const [newKnowledge, setNewKnowledge] = useState({
    type: "faq",
    question: "",
    answer: "",
    keywords: "",
  });
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  if (activeCategory !== "ai") return null;

  async function addKnowledge() {
    if (!newKnowledge.question || !newKnowledge.answer) {
      setError("Question and answer are required");
      return;
    }
    try {
      const keywordArray = newKnowledge.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      const entry = await apiRequest("/api/assistant/knowledge", {
        method: "POST",
        token: true,
        body: {
          type: newKnowledge.type,
          question: newKnowledge.question,
          answer: newKnowledge.answer,
          keywords: keywordArray,
        },
      });
      if (entry) {
        setKnowledge((prev) => [...prev, entry]);
        setNewKnowledge({
          type: "faq",
          question: "",
          answer: "",
          keywords: "",
        });
        setShowAddKnowledge(false);
        setNotice("Knowledge entry added");
        setTimeout(() => setNotice(""), 3000);
      }
    } catch {
      setError("Failed to add knowledge entry");
    }
  }

  async function updateKnowledge(entryId) {
    if (!editingKnowledge?.question || !editingKnowledge?.answer) {
      setError("Question and answer are required");
      return;
    }
    try {
      const keywordArray = (editingKnowledge.keywords || "")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      const updated = await apiRequest(`/api/assistant/knowledge/${entryId}`, {
        method: "PUT",
        token: true,
        body: {
          type: editingKnowledge.type,
          question: editingKnowledge.question,
          answer: editingKnowledge.answer,
          keywords: keywordArray,
        },
      });
      if (updated) {
        setKnowledge((prev) =>
          prev.map((e) => (e.id === entryId ? updated : e)),
        );
        setEditingKnowledge(null);
        setNotice("Knowledge entry updated");
        setTimeout(() => setNotice(""), 3000);
      }
    } catch {
      setError("Failed to update knowledge entry");
    }
  }

  async function deleteKnowledge(entryId) {
    try {
      await apiRequest(`/api/assistant/knowledge/${entryId}`, {
        method: "DELETE",
        token: true,
      });
      setKnowledge((prev) => prev.filter((e) => e.id !== entryId));
      setNotice("Knowledge entry deleted");
      setTimeout(() => setNotice(""), 3000);
    } catch {
      setError("Failed to delete knowledge entry");
    }
  }

  async function saveConfig() {
    try {
      setSaving(true);
      setError("");
      const keywordsArray = config.codeContextKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      await apiRequest("/api/assistant/config", {
        method: "PUT",
        token: true,
        body: {
          systemPrompt: config.systemPrompt,
          agentPrompt: config.agentPrompt,
          codeContextEnabled: config.codeContextEnabled,
          codeContextKeywords: keywordsArray,
        },
      });
      setNotice("Settings saved successfully");
      setTimeout(() => setNotice(""), 3000);
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function addRule() {
    if (!newRule.response || !newRule.keywords) {
      setError("Keywords and response are required");
      return;
    }
    try {
      const keywordArray = newRule.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      const ruleType = activeTab === "global" ? "global" : "smalltalk";
      const rule = await apiRequest("/api/assistant/rules", {
        method: "POST",
        token: true,
        body: {
          type: ruleType,
          source: newRule.source || `${ruleType}_rule_${Date.now()}`,
          keywords: keywordArray,
          response: newRule.response,
        },
      });
      if (rule) {
        setRules((prev) => ({
          ...prev,
          [ruleType === "global" ? "globalRules" : "smallTalkRules"]: [
            ...(ruleType === "global" ? prev.globalRules : prev.smallTalkRules),
            rule,
          ],
        }));
        setNewRule({ source: "", keywords: "", response: "" });
        setShowAddForm(false);
        setNotice("Rule added successfully");
        setTimeout(() => setNotice(""), 3000);
      }
    } catch {
      setError("Failed to add rule");
    }
  }

  async function deleteRule(ruleId) {
    try {
      const ruleType = activeTab === "global" ? "global" : "smalltalk";
      await apiRequest(`/api/assistant/rules/${ruleType}/${ruleId}`, {
        method: "DELETE",
        token: true,
      });
      setRules((prev) => ({
        ...prev,
        [ruleType === "global" ? "globalRules" : "smallTalkRules"]:
          (ruleType === "global"
            ? prev.globalRules
            : prev.smallTalkRules
          ).filter((r) => r.id !== ruleId),
      }));
      setNotice("Rule deleted");
      setTimeout(() => setNotice(""), 3000);
    } catch {
      setError("Failed to delete rule");
    }
  }

  async function fetchData() {
    try {
      setLoading(true);
      const [rulesData, configData, knowledgeData] = await Promise.all([
        apiRequest("/api/assistant/rules", { token: true }),
        apiRequest("/api/assistant/config", { token: true }),
        apiRequest("/api/assistant/knowledge", { token: true }),
      ]);
      if (rulesData) {
        setRules({
          globalRules: rulesData.globalRules || [],
          smallTalkRules: rulesData.smallTalkRules || [],
        });
      }
      if (configData) {
        setConfig({
          systemPrompt: configData.systemPrompt || "",
          agentPrompt: configData.agentPrompt || "",
          codeContextEnabled: configData.codeContextEnabled !== false,
          codeContextKeywords: (configData.codeContextKeywords || []).join(
            ", ",
          ),
        });
      }
      if (knowledgeData?.entries) {
        setKnowledge(knowledgeData.entries);
      }
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  const currentRules =
    activeTab === "global" ? rules.globalRules : rules.smallTalkRules;
  const tabs = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
    { id: "global", label: "Global Rules", icon: Lightbulb },
    { id: "smalltalk", label: "Small Talk", icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-3xl border p-6",
          adminDark
            ? "border-white/10 bg-white/5"
            : "border-slate-200 bg-white",
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-400 text-white">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2
              className={cn(
                "text-2xl font-semibold",
                adminDark ? "text-white" : "text-slate-900",
              )}
            >
              AI Assistant Configuration
            </h2>
            <p className={adminDark ? "text-slate-400" : "text-slate-500"}>
              Configure AI behavior, prompts, and response rules
            </p>
          </div>
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
          <CheckCircle className="h-5 w-5" />
          {notice}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div
        className={cn(
          "flex gap-2 rounded-2xl border p-1",
          adminDark
            ? "border-white/10 bg-white/5"
            : "border-slate-200 bg-slate-50",
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              activeTab === tab.id
                ? adminDark
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "bg-white text-indigo-600 shadow-sm"
                : adminDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : activeTab === "settings" ? (
        <div className="space-y-6">
          {/* System Prompt */}
          <div
            className={cn(
              "rounded-3xl border p-6",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-indigo-400" />
              <h3
                className={cn(
                  "font-semibold",
                  adminDark ? "text-white" : "text-slate-900",
                )}
              >
                System Prompt
              </h3>
            </div>
            <p
              className={cn(
                "mb-4 text-sm",
                adminDark ? "text-slate-400" : "text-slate-500",
              )}
            >
              Short instruction that defines AI's role. Sent as "system" message
              to AI.
            </p>
            <textarea
              value={config.systemPrompt}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, systemPrompt: e.target.value }))
              }
              rows={3}
              placeholder="You are a helpful GarTex assistant."
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-sm outline-none resize-none",
                adminDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
                  : "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
              )}
            />
          </div>

          {/* Agent Prompt */}
          <div
            className={cn(
              "rounded-3xl border p-6",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-400" />
              <h3
                className={cn(
                  "font-semibold",
                  adminDark ? "text-white" : "text-slate-900",
                )}
              >
                Agent Prompt
              </h3>
            </div>
            <p
              className={cn(
                "mb-4 text-sm",
                adminDark ? "text-slate-400" : "text-slate-500",
              )}
            >
              Full prompt with role description. Appended before knowledge base
              and user question.
            </p>
            <textarea
              value={config.agentPrompt}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, agentPrompt: e.target.value }))
              }
              rows={6}
              placeholder="You are the GarTex Assistant, an expert on the GarTexHub textile marketplace platform..."
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-sm outline-none resize-none font-mono",
                adminDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
                  : "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
              )}
            />
          </div>

          {/* Code Context Settings */}
          <div
            className={cn(
              "rounded-3xl border p-6",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-indigo-400" />
                <h3
                  className={cn(
                    "font-semibold",
                    adminDark ? "text-white" : "text-slate-900",
                  )}
                >
                  Code Context Search
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    codeContextEnabled: !prev.codeContextEnabled,
                  }))
                }
                className="text-indigo-400"
              >
                {config.codeContextEnabled ? (
                  <ToggleRight className="h-6 w-6" />
                ) : (
                  <ToggleLeft className="h-6 w-6" />
                )}
              </button>
            </div>
            <p
              className={cn(
                "mb-4 text-sm",
                adminDark ? "text-slate-400" : "text-slate-500",
              )}
            >
              When enabled, AI will search your codebase for relevant code
              snippets when questions contain these keywords.
            </p>
            <div>
              <label
                className={cn(
                  "mb-1.5 block text-sm font-medium",
                  adminDark ? "text-slate-300" : "text-slate-700",
                )}
              >
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={config.codeContextKeywords}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    codeContextKeywords: e.target.value,
                  }))
                }
                placeholder="api, route, server, code, bug, error"
                disabled={!config.codeContextEnabled}
                className={cn(
                  "w-full rounded-2xl border px-4 py-2.5 text-sm outline-none",
                  adminDark
                    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    : "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
                  !config.codeContextEnabled && "opacity-50",
                )}
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={saveConfig}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/20 px-6 py-3 text-sm font-medium text-indigo-300 transition-all hover:bg-indigo-500/30 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      ) : activeTab === "knowledge" ? (
        <div className="space-y-4">
          {/* Knowledge Base List */}
          <div
            className={cn(
              "rounded-3xl border",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="border-b border-slate-200/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3
                  className={cn(
                    "font-semibold",
                    adminDark ? "text-white" : "text-slate-900",
                  )}
                >
                  Knowledge Base - FAQ ({knowledge.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddKnowledge(!showAddKnowledge)}
                  className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-500/20"
                >
                  <Plus className="h-4 w-4" />
                  Add Entry
                </button>
              </div>
            </div>

            {knowledge.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <BookOpen
                  className={cn(
                    "mx-auto h-12 w-12 mb-4",
                    adminDark ? "text-slate-600" : "text-slate-300",
                  )}
                />
                <p className={adminDark ? "text-slate-400" : "text-slate-500"}>
                  No knowledge entries yet. Add FAQ entries for AI to use.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200/10">
                {knowledge.map((entry) => (
                  <div key={entry.id} className="px-6 py-4 hover:bg-white/5">
                    {editingKnowledge?.id === entry.id ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <select
                            value={editingKnowledge.type}
                            onChange={(e) =>
                              setEditingKnowledge((prev) => ({
                                ...prev,
                                type: e.target.value,
                              }))
                            }
                            className={cn(
                              "rounded-xl border px-3 py-2 text-sm",
                              adminDark
                                ? "border-slate-700 bg-slate-800 text-white"
                                : "border-slate-200 text-slate-900",
                            )}
                          >
                            <option value="faq">FAQ</option>
                            <option value="fact">Fact</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          value={editingKnowledge.question}
                          onChange={(e) =>
                            setEditingKnowledge((prev) => ({
                              ...prev,
                              question: e.target.value,
                            }))
                          }
                          placeholder="Question"
                          className={cn(
                            "w-full rounded-xl border px-4 py-2 text-sm",
                            adminDark
                              ? "border-slate-700 bg-slate-800 text-white"
                              : "border-slate-200 text-slate-900",
                          )}
                        />
                        <textarea
                          value={editingKnowledge.answer}
                          onChange={(e) =>
                            setEditingKnowledge((prev) => ({
                              ...prev,
                              answer: e.target.value,
                            }))
                          }
                          placeholder="Answer"
                          rows={3}
                          className={cn(
                            "w-full rounded-xl border px-4 py-2 text-sm resize-none",
                            adminDark
                              ? "border-slate-700 bg-slate-800 text-white"
                              : "border-slate-200 text-slate-900",
                          )}
                        />
                        <input
                          type="text"
                          value={editingKnowledge.keywords || ""}
                          onChange={(e) =>
                            setEditingKnowledge((prev) => ({
                              ...prev,
                              keywords: e.target.value,
                            }))
                          }
                          placeholder="Keywords (comma separated)"
                          className={cn(
                            "w-full rounded-xl border px-4 py-2 text-sm",
                            adminDark
                              ? "border-slate-700 bg-slate-800 text-white"
                              : "border-slate-200 text-slate-900",
                          )}
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => updateKnowledge(entry.id)}
                            className="flex items-center gap-1 rounded-lg bg-indigo-500/20 px-3 py-1.5 text-sm text-indigo-400"
                          >
                            <Save className="h-3 w-3" />
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingKnowledge(null)}
                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-xs uppercase",
                                entry.type === "faq"
                                  ? adminDark
                                    ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                                    : "border-blue-200 bg-blue-50 text-blue-600"
                                  : adminDark
                                    ? "border-green-500/30 bg-green-500/10 text-green-300"
                                    : "border-green-200 bg-green-50 text-green-600",
                              )}
                            >
                              {entry.type}
                            </span>
                          </div>
                          <div
                            className={cn(
                              "text-sm font-medium",
                              adminDark ? "text-white" : "text-slate-900",
                            )}
                          >
                            Q: {entry.question}
                          </div>
                          <div
                            className={cn(
                              "mt-1 text-sm",
                              adminDark ? "text-slate-300" : "text-slate-600",
                            )}
                          >
                            A: {entry.answer}
                          </div>
                          {entry.keywords?.length > 0 && (
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                              {entry.keywords.map((kw, idx) => (
                                <span
                                  key={idx}
                                  className={cn(
                                    "rounded-full border px-2 py-0.5 text-xs",
                                    adminDark
                                      ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                                      : "border-indigo-200 bg-indigo-50 text-indigo-600",
                                  )}
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingKnowledge({
                                ...entry,
                                keywords: entry.keywords?.join(", ") || "",
                              })
                            }
                            className="rounded-xl border border-slate-700 p-2 text-slate-400 hover:text-white"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteKnowledge(entry.id)}
                            className="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Knowledge Form */}
          {showAddKnowledge && (
            <div
              className={cn(
                "rounded-3xl border p-6",
                adminDark
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white",
              )}
            >
              <h3
                className={cn(
                  "mb-4 font-semibold",
                  adminDark ? "text-white" : "text-slate-900",
                )}
              >
                Add Knowledge Entry
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className={cn(
                      "mb-1.5 block text-sm font-medium",
                      adminDark ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Type
                  </label>
                  <select
                    value={newKnowledge.type}
                    onChange={(e) =>
                      setNewKnowledge((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    className={cn(
                      "w-full rounded-2xl border px-4 py-2.5 text-sm",
                      adminDark
                        ? "border-slate-700 bg-slate-800 text-white"
                        : "border-slate-200 text-slate-900",
                    )}
                  >
                    <option value="faq">FAQ</option>
                    <option value="fact">Fact</option>
                  </select>
                </div>
                <div>
                  <label
                    className={cn(
                      "mb-1.5 block text-sm font-medium",
                      adminDark ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Question
                  </label>
                  <input
                    type="text"
                    value={newKnowledge.question}
                    onChange={(e) =>
                      setNewKnowledge((prev) => ({
                        ...prev,
                        question: e.target.value,
                      }))
                    }
                    placeholder="What is MOQ?"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-2.5 text-sm outline-none",
                      adminDark
                        ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
                        : "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
                    )}
                  />
                </div>
                <div>
                  <label
                    className={cn(
                      "mb-1.5 block text-sm font-medium",
                      adminDark ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Answer
                  </label>
                  <textarea
                    value={newKnowledge.answer}
                    onChange={(e) =>
                      setNewKnowledge((prev) => ({
                        ...prev,
                        answer: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Minimum Order Quantity refers to..."
                    className={cn(
                      "w-full rounded-2xl border px-4 py-2.5 text-sm outline-none resize-none",
                      adminDark
                        ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
                        : "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
                    )}
                  />
                </div>
                <div>
                  <label
                    className={cn(
                      "mb-1.5 block text-sm font-medium",
                      adminDark ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newKnowledge.keywords}
                    onChange={(e) =>
                      setNewKnowledge((prev) => ({
                        ...prev,
                        keywords: e.target.value,
                      }))
                    }
                    placeholder="moq, minimum order, quantity"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-2.5 text-sm outline-none",
                      adminDark
                        ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
                        : "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addKnowledge}
                    className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-500/20"
                  >
                    <Plus className="h-4 w-4" />
                    Add Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddKnowledge(false);
                      setNewKnowledge({
                        type: "faq",
                        question: "",
                        answer: "",
                        keywords: "",
                      });
                    }}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                      adminDark
                        ? "border-slate-700 text-slate-400 hover:text-white"
                        : "border-slate-200 text-slate-600 hover:text-slate-900",
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Rules List */}
          <div
            className={cn(
              "rounded-3xl border",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="border-b border-slate-200/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3
                  className={cn(
                    "font-semibold",
                    adminDark ? "text-white" : "text-slate-900",
                  )}
                >
                  {activeTab === "global" ? "Global Rules" : "Small Talk Rules"}{" "}
                  ({currentRules.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-500/20"
                >
                  <Plus className="h-4 w-4" />
                  Add Rule
                </button>
              </div>
            </div>

            {currentRules.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Bot
                  className={cn(
                    "mx-auto h-12 w-12 mb-4",
                    adminDark ? "text-slate-600" : "text-slate-300",
                  )}
                />
                <p className={adminDark ? "text-slate-400" : "text-slate-500"}>
                  No rules configured yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200/10">
                {currentRules.map((rule) => (
                  <div key={rule.id} className="px-6 py-4 hover:bg-white/5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              "text-sm font-medium",
                              adminDark ? "text-white" : "text-slate-900",
                            )}
                          >
                            {rule.source}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          {rule.keywords?.map((kw, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-xs",
                                adminDark
                                  ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                                  : "border-indigo-200 bg-indigo-50 text-indigo-600",
                              )}
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                        <p
                          className={cn(
                            "mt-2 text-sm",
                            adminDark ? "text-slate-300" : "text-slate-600",
                          )}
                        >
                          {rule.response}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteRule(rule.id)}
                        className="shrink-0 rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Rule Form */}
          {showAddForm && (
            <div
              className={cn(
                "rounded-3xl border p-6",
                adminDark
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white",
              )}
            >
              <h3
                className={cn(
                  "mb-4 font-semibold",
                  adminDark ? "text-white" : "text-slate-900",
                )}
              >
                Add New Rule
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className={cn(
                      "mb-1.5 block text-sm font-medium",
                      adminDark ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Source (optional)
                  </label>
                  <input
                    type="text"
                    value={newRule.source}
                    onChange={(e) =>
                      setNewRule((prev) => ({
                        ...prev,
                        source: e.target.value,
                      }))
                    }
                    placeholder="e.g., custom_rule_name"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-2.5 text-sm outline-none",
                      adminDark
                        ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
                        : "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
                    )}
                  />
                </div>
                <div>
                  <label
                    className={cn(
                      "mb-1.5 block text-sm font-medium",
                      adminDark ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newRule.keywords}
                    onChange={(e) =>
                      setNewRule((prev) => ({
                        ...prev,
                        keywords: e.target.value,
                      }))
                    }
                    placeholder="e.g., setup, onboarding, profile"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-2.5 text-sm outline-none",
                      adminDark
                        ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
                        : "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
                    )}
                  />
                </div>
                <div>
                  <label
                    className={cn(
                      "mb-1.5 block text-sm font-medium",
                      adminDark ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Response
                  </label>
                  <textarea
                    value={newRule.response}
                    onChange={(e) =>
                      setNewRule((prev) => ({
                        ...prev,
                        response: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="The response the AI should give when keywords match"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-2.5 text-sm outline-none resize-none",
                      adminDark
                        ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
                        : "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addRule}
                    className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-500/20"
                  >
                    <Plus className="h-4 w-4" />
                    Add Rule
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewRule({ source: "", keywords: "", response: "" });
                    }}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                      adminDark
                        ? "border-slate-700 text-slate-400 hover:text-white"
                        : "border-slate-200 text-slate-600 hover:text-slate-900",
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminAISection;
