import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { readJson, updateJson } from "../utils/jsonStore.js";
import { sanitizeString } from "../utils/validators.js";
import { logError, logInfo } from "../utils/logger.js";
import { updateLocalJson } from "../utils/localStore.js";

const FILE = "assistant_knowledge.json";
const RULES_FILE = "assistant_rules.json";
const CONFIG_FILE = "assistant_config.json";
const KNOWLEDGE_TYPES = {
  FAQ: "faq",
  FACT: "fact",
};

const DEFAULT_SYSTEM_PROMPT = "You are a helpful GarTex assistant.";
const DEFAULT_AGENT_PROMPT = `You are the GarTex Assistant, an expert on the GarTexHub textile marketplace platform.
Your goal is to help users understand and navigate this specific web application.
Use the following context to provide accurate, specific answers. If the answer isn't in the context, use your general knowledge but stay professional.
Always be helpful and detailed. Never say "message is incomplete" unless it is truly gibberish.`;

async function loadAssistantConfig() {
  try {
    const data = await readJson(CONFIG_FILE);
    return {
      systemPrompt: data.systemPrompt || DEFAULT_SYSTEM_PROMPT,
      agentPrompt: data.agentPrompt || DEFAULT_AGENT_PROMPT,
      codeContextEnabled: data.codeContextEnabled !== false,
      codeContextKeywords: data.codeContextKeywords || [
        "api",
        "route",
        "server",
        "controller",
        "service",
        "code",
        "bug",
        "error",
        "endpoint",
        "json",
        "database",
        "model",
        "function",
      ],
    };
  } catch {
    return {
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      agentPrompt: DEFAULT_AGENT_PROMPT,
      codeContextEnabled: true,
      codeContextKeywords: [
        "api",
        "route",
        "server",
        "controller",
        "service",
        "code",
        "bug",
        "error",
        "endpoint",
        "json",
        "database",
        "model",
        "function",
      ],
    };
  }
}

async function loadAssistantRules() {
  try {
    const data = await readJson(RULES_FILE);
    return {
      globalRules: data.globalRules || [],
      smallTalkRules: data.smallTalkRules || [],
    };
  } catch {
    return { globalRules: [], smallTalkRules: [] };
  }
}

const CODE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".md",
  ".css",
  ".html",
]);
const SKIP_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".vite",
]);
const MAX_FILES_TO_SCAN = 400;
const MAX_FILE_BYTES = 80_000;
const MAX_MATCHED_SNIPPETS = 4;
const MAX_SNIPPET_LENGTH = 320;
const MAX_CONTEXT_CHARS = 1_600;
const MAX_KNOWLEDGE_CONTEXT_CHARS = 1_200;
const MAX_AI_ANSWER_CHARS = 1200;

const AI_PROVIDERS = {
  OLLAMA: "ollama",
  OPENROUTER: "openrouter",
  GEMINI: "gemini",
  NONE: "none",
};

const aiConfig = {
  primary:
    process.env.AI_PRIMARY_PROVIDER?.toLowerCase() || AI_PROVIDERS.OLLAMA,
  fallback:
    process.env.AI_FALLBACK_PROVIDER?.toLowerCase() || AI_PROVIDERS.OPENROUTER,
  enabled: process.env.AI_ENABLED !== "false",
  ollama: {
    host: process.env.OLLAMA_HOST || "127.0.0.1",
    port: process.env.OLLAMA_PORT || "11434",
    model: process.env.OLLAMA_MODEL || "llama3",
    timeoutMs: Number(process.env.OLLAMA_TIMEOUT_MS || 45000),
    chatEndpoint:
      process.env.OLLAMA_CHAT_ENDPOINT ||
      `http://${process.env.OLLAMA_HOST || "127.0.0.1"}:${process.env.OLLAMA_PORT || "11434"}/v1/chat/completions`,
    completionEndpoint:
      process.env.OLLAMA_COMPLETION_ENDPOINT ||
      `http://${process.env.OLLAMA_HOST || "127.0.0.1"}:${process.env.OLLAMA_PORT || "11434"}/completion`,
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct",
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    timeoutMs: Number(process.env.OPENROUTER_TIMEOUT_MS || 60000),
    referer: process.env.OPENROUTER_REFERER || "https://gartexhub.com",
    appTitle: process.env.OPENROUTER_APP_TITLE || "GarTexHub",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS || 60000),
  },
};

function getPrimaryProvider() {
  if (!aiConfig.enabled) return AI_PROVIDERS.NONE;
  return aiConfig.primary;
}

function getFallbackProvider() {
  if (!aiConfig.enabled) return AI_PROVIDERS.NONE;
  if (aiConfig.fallback === aiConfig.primary) return AI_PROVIDERS.NONE;
  return aiConfig.fallback;
}

function isProviderAvailable(provider) {
  switch (provider) {
    case AI_PROVIDERS.OLLAMA:
      return aiConfig.ollama.model && aiConfig.ollama.host;
    case AI_PROVIDERS.OPENROUTER:
      return aiConfig.openrouter.apiKey && aiConfig.openrouter.model;
    case AI_PROVIDERS.GEMINI:
      return aiConfig.gemini.apiKey && aiConfig.gemini.model;
    default:
      return false;
  }
}

export function getAiConfig() {
  return {
    ...aiConfig,
    primaryProvider: getPrimaryProvider(),
    fallbackProvider: getFallbackProvider(),
    primaryAvailable: isProviderAvailable(getPrimaryProvider()),
    fallbackAvailable: isProviderAvailable(getFallbackProvider()),
  };
}

export function updateAiConfig(newConfig) {
  if (newConfig.primary !== undefined) {
    aiConfig.primary = newConfig.primary.toLowerCase();
  }
  if (newConfig.fallback !== undefined) {
    aiConfig.fallback = newConfig.fallback.toLowerCase();
  }
  if (newConfig.enabled !== undefined) {
    aiConfig.enabled = newConfig.enabled;
  }
  if (newConfig.ollama) {
    Object.assign(aiConfig.ollama, newConfig.ollama);
  }
  if (newConfig.openrouter) {
    Object.assign(aiConfig.openrouter, newConfig.openrouter);
  }
}

const CODE_CONTEXT_HINTS = new Set([
  "api",
  "route",
  "server",
  "controller",
  "service",
  "code",
  "bug",
  "error",
  "endpoint",
  "json",
  "database",
  "model",
  "function",
]);

let codeFileCache = {
  expiresAt: 0,
  files: [],
};

function normalize(text = "") {
  return sanitizeString(String(text || "").toLowerCase(), 500);
}

function tokenize(text = "") {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2);
}

function scoreMatch(questionText, candidateQuestion, candidateKeywords = []) {
  const normalizedQuestion = normalize(questionText);
  const normalizedCandidate = normalize(candidateQuestion);
  const questionTokens = tokenize(normalizedQuestion);

  let score = 0;
  if (
    normalizedCandidate &&
    (normalizedQuestion.includes(normalizedCandidate) ||
      normalizedCandidate.includes(normalizedQuestion))
  ) {
    score += 2;
  }

  const keywordSet = new Set(
    candidateKeywords.map((keyword) => normalize(keyword)).filter(Boolean),
  );
  for (const token of questionTokens) {
    if (keywordSet.has(token)) score += 1;
  }
  return score;
}

function normalizeType(type) {
  const normalized = sanitizeString(type, 30).toLowerCase();
  return normalized === KNOWLEDGE_TYPES.FACT
    ? KNOWLEDGE_TYPES.FACT
    : KNOWLEDGE_TYPES.FAQ;
}

function mapKnowledgeRow(row) {
  return {
    id: row.id,
    org_id: row.org_id,
    type: normalizeType(row.type),
    question: row.question,
    answer: row.answer,
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    updated_at: row.updated_at,
    created_at: row.created_at,
  };
}

async function collectCodeFiles(dirPath, collector, limit = MAX_FILES_TO_SCAN) {
  if (collector.length >= limit) return;

  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (collector.length >= limit) return;

    const resolvedPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRECTORIES.has(entry.name)) continue;
      await collectCodeFiles(resolvedPath, collector, limit);
      continue;
    }

    if (!entry.isFile()) continue;
    const extension = path.extname(entry.name).toLowerCase();
    if (!CODE_EXTENSIONS.has(extension)) continue;
    collector.push(resolvedPath);
  }
}

async function getCodeFiles() {
  const now = Date.now();
  if (codeFileCache.expiresAt > now && codeFileCache.files.length > 0) {
    return codeFileCache.files;
  }

  const files = [];
  await collectCodeFiles(process.cwd(), files);
  codeFileCache = {
    files,
    expiresAt: now + 60_000,
  };
  return files;
}

function findBestSnippet(content, tokens) {
  const lines = content.split("\n");
  let best = { score: 0, line: "", lineNumber: 1 };

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const normalizedLine = normalize(rawLine);
    if (!normalizedLine) continue;

    let score = 0;
    for (const token of tokens) {
      if (normalizedLine.includes(token)) score += 1;
    }

    if (score > best.score) {
      best = {
        score,
        line: sanitizeString(rawLine.trim(), MAX_SNIPPET_LENGTH),
        lineNumber: index + 1,
      };
    }
  }

  return best.score > 0 ? best : null;
}

async function searchCodeContext(questionText) {
  const tokens = tokenize(questionText);
  if (tokens.length === 0) {
    return {
      summary: "",
      snippets: [],
      prompt_context: "",
    };
  }

  const files = await getCodeFiles();
  const matches = [];

  for (const filePath of files) {
    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch {
      continue;
    }
    if (!stat.isFile() || stat.size > MAX_FILE_BYTES) continue;

    let content = "";
    try {
      content = await fs.readFile(filePath, "utf8");
    } catch {
      continue;
    }

    const relativePath = path.relative(process.cwd(), filePath);
    const fileTokens = tokenize(relativePath);

    let score = 0;
    for (const token of tokens) {
      if (fileTokens.includes(token)) score += 2;
      if (normalize(content).includes(token)) score += 1;
    }

    if (score === 0) continue;

    const bestSnippet = findBestSnippet(content, tokens);
    matches.push({
      path: relativePath,
      score: score + (bestSnippet?.score || 0),
      snippet: bestSnippet,
    });
  }

  const topMatches = matches
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_MATCHED_SNIPPETS);

  const snippets = topMatches.map((match) => ({
    file: match.path,
    score: match.score,
    line: match.snippet?.lineNumber || null,
    snippet: match.snippet?.line || "",
  }));

  const summary = snippets
    .map((item) => `${item.file}${item.line ? `:${item.line}` : ""}`)
    .join(", ");

  let promptContext = snippets
    .map(
      (item) =>
        `[${item.file}${item.line ? `:${item.line}` : ""}] ${item.snippet}`,
    )
    .join("\n");
  promptContext = sanitizeString(promptContext, MAX_CONTEXT_CHARS);

  return {
    summary,
    snippets,
    prompt_context: promptContext,
  };
}

async function shouldSearchCodeContext(questionText) {
  const config = await loadAssistantConfig();
  if (!config.codeContextEnabled) return false;
  const tokens = tokenize(questionText);
  if (tokens.length < 3) return false;
  const keywordSet = new Set(
    config.codeContextKeywords.map((k) => k.toLowerCase()),
  );
  return tokens.some((token) => keywordSet.has(token));
}

function findBestRule(questionText, rules = []) {
  const normalizedQuestion = normalize(questionText);
  const rawQuestionTokens = normalizedQuestion
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const compactQuestionTokens = new Set(
    rawQuestionTokens
      .map((token) =>
        String(token || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, ""),
      )
      .filter(Boolean),
  );

  let bestRule = null;
  let bestRuleScore = 0;

  for (const rule of rules) {
    if (!Array.isArray(rule.keywords)) continue;
    const normalizedKeywords = rule.keywords
      .map((keyword) =>
        String(keyword || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, ""),
      )
      .filter(Boolean);
    let score = 0;
    for (const keyword of normalizedKeywords) {
      if (!keyword) continue;
      if (compactQuestionTokens.has(keyword)) {
        score += 1;
        continue;
      }
      if (keyword.length > 3 && normalizedQuestion.includes(keyword))
        score += 1;
    }

    if (score > bestRuleScore) {
      bestRule = rule;
      bestRuleScore = score;
    }
  }

  return { bestRule, bestRuleScore };
}

async function buildKnowledgeContext(questionText, entries) {
  const rules = await loadAssistantRules();
  const rankedEntries = entries
    .map((entry) => ({
      entry,
      score: scoreMatch(questionText, entry.question, entry.keywords),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const lines = rankedEntries.map((item, index) => {
    const entry = item.entry;
    const keywords = Array.isArray(entry.keywords)
      ? entry.keywords.join(", ")
      : "";
    return `${index + 1}. (${entry.type}) Q: ${entry.question}\nA: ${entry.answer}${keywords ? `\nK: ${keywords}` : ""}`;
  });

  const { bestRule: bestGlobalRule, bestRuleScore: bestGlobalRuleScore } =
    findBestRule(questionText, rules.globalRules);
  if (bestGlobalRule && bestGlobalRuleScore > 0) {
    lines.push(`Global guidance: ${bestGlobalRule.response}`);
  }

  const { bestRule: bestSmallTalkRule, bestRuleScore: bestSmallTalkScore } =
    findBestRule(questionText, rules.smallTalkRules);
  if (bestSmallTalkRule && bestSmallTalkScore > 0) {
    lines.push(`Tone guidance: ${bestSmallTalkRule.response}`);
  }

  return sanitizeString(lines.join("\n\n"), MAX_KNOWLEDGE_CONTEXT_CHARS);
}

async function buildAgentPrompt(questionText, codeContext, knowledgeContext) {
  const config = await loadAssistantConfig();
  const sections = [config.agentPrompt];

  if (knowledgeContext) {
    sections.push(`PROJECT KNOWLEDGE BASE:\n${knowledgeContext}`);
  }

  if (
    config.codeContextEnabled &&
    (codeContext?.summary || codeContext?.prompt_context)
  ) {
    const codeBlock = [
      "TECHNICAL CONTEXT (Source Code):",
      codeContext.summary ? `Relevant files: ${codeContext.summary}` : "",
      codeContext.prompt_context
        ? `Code snippets:\n${codeContext.prompt_context}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    sections.push(codeBlock);
  }

  sections.push(`USER QUESTION: ${questionText}`);
  sections.push("ANSWER:");
  return sections.join("\n\n");
}

export async function callLlama(prompt, systemPromptOverride = null) {
  if (!aiConfig.enabled) {
    logInfo("AI is disabled");
    return null;
  }

  const config = await loadAssistantConfig();
  const systemPrompt = systemPromptOverride || config.systemPrompt;

  const primary = getPrimaryProvider();
  const fallback = getFallbackProvider();

  if (primary === AI_PROVIDERS.NONE && fallback === AI_PROVIDERS.NONE) {
    logInfo("No AI provider configured");
    return null;
  }

  if (primary !== AI_PROVIDERS.NONE && isProviderAvailable(primary)) {
    const result = await callAiProvider(primary, prompt, systemPrompt);
    if (result) return result;
  }

  if (fallback !== AI_PROVIDERS.NONE && isProviderAvailable(fallback)) {
    logInfo(`Primary ${primary} failed, trying fallback ${fallback}`);
    const result = await callAiProvider(fallback, prompt, systemPrompt);
    if (result) return result;
  }

  logError("All AI providers failed or unavailable");
  return null;
}

async function callAiProvider(provider, prompt, systemPrompt) {
  switch (provider) {
    case AI_PROVIDERS.OLLAMA:
      return callOllama(prompt, systemPrompt);
    case AI_PROVIDERS.OPENROUTER:
      return callOpenRouter(prompt, systemPrompt);
    case AI_PROVIDERS.GEMINI:
      return callGemini(prompt, systemPrompt);
    default:
      logError("Unknown AI provider", { provider });
      return null;
  }
}

async function callOllama(
  prompt,
  systemPrompt = "You are a helpful GarTex assistant.",
) {
  const cfg = aiConfig.ollama;

  logInfo("Calling Ollama", { endpoint: cfg.chatEndpoint, model: cfg.model });

  const chatResult = await runWithTimeout(
    (signal) => callOllamaChat(prompt, signal, systemPrompt),
    cfg.timeoutMs,
  );
  if (chatResult) return chatResult;

  logInfo("Ollama chat failed, trying completion endpoint", {
    endpoint: cfg.completionEndpoint,
  });
  return await runWithTimeout(
    (signal) => callOllamaCompletion(prompt, signal),
    cfg.timeoutMs,
  );
}

async function callOllamaChat(
  prompt,
  signal,
  systemPrompt = "You are a helpful GarTex assistant.",
) {
  const cfg = aiConfig.ollama;
  const response = await fetch(cfg.chatEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: cfg.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 450,
    }),
    signal,
  });

  if (!response.ok) return null;
  const payload = await response.json();
  return (
    sanitizeString(
      payload?.choices?.[0]?.message?.content || "",
      MAX_AI_ANSWER_CHARS,
    ) || null
  );
}

async function callOllamaCompletion(prompt, signal) {
  const cfg = aiConfig.ollama;
  const response = await fetch(cfg.completionEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: cfg.model,
      prompt,
      temperature: 0.2,
      n_predict: 220,
    }),
    signal,
  });

  if (!response.ok) return null;
  const payload = await response.json();
  return (
    sanitizeString(
      payload?.content || payload?.response || "",
      MAX_AI_ANSWER_CHARS,
    ) || null
  );
}

async function callOpenRouter(
  prompt,
  systemPrompt = "You are a helpful GarTex assistant.",
) {
  const cfg = aiConfig.openrouter;

  if (!cfg.apiKey) return null;

  logInfo("Calling OpenRouter", { model: cfg.model });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), cfg.timeoutMs);

  try {
    const response = await fetch(cfg.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
        "HTTP-Referer": cfg.referer,
        "X-Title": cfg.appTitle,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 450,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError("OpenRouter API error", {
        status: response.status,
        error: errorText,
      });
      return null;
    }

    const payload = await response.json();
    return (
      sanitizeString(
        payload?.choices?.[0]?.message?.content || "",
        MAX_AI_ANSWER_CHARS,
      ) || null
    );
  } catch (error) {
    if (error.name === "AbortError") {
      logError("OpenRouter request timed out");
    } else {
      logError("OpenRouter call failed", error);
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function callGemini(
  prompt,
  systemPrompt = "You are a helpful GarTex assistant.",
) {
  const cfg = aiConfig.gemini;

  if (!cfg.apiKey) return null;

  logInfo("Calling Gemini", { model: cfg.model });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), cfg.timeoutMs);

  try {
    const url = `${cfg.baseUrl}/models/${cfg.model}:generateContent?key=${cfg.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        systemInstruction: {
          role: "system",
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 450,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError("Gemini API error", {
        status: response.status,
        error: errorText,
      });
      return null;
    }

    const payload = await response.json();
    const content = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    return sanitizeString(content || "", MAX_AI_ANSWER_CHARS) || null;
  } catch (error) {
    if (error.name === "AbortError") {
      logError("Gemini request timed out");
    } else {
      logError("Gemini call failed", error);
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function runWithTimeout(callback, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await callback(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

async function generateDynamicAnswer(
  questionText,
  codeContext,
  knowledgeContext,
) {
  if (!aiConfig.enabled) {
    logInfo("AI is disabled");
    return null;
  }

  const prompt = buildAgentPrompt(questionText, codeContext, knowledgeContext);
  const primary = getPrimaryProvider();
  const fallback = getFallbackProvider();

  logInfo("Generating dynamic answer", {
    primary,
    fallback,
    prompt_chars: prompt.length,
  });

  if (primary !== AI_PROVIDERS.NONE && isProviderAvailable(primary)) {
    const result = await callAiProvider(primary, prompt);
    if (result) return result;
  }

  if (fallback !== AI_PROVIDERS.NONE && isProviderAvailable(fallback)) {
    logInfo(`Primary ${primary} failed, trying fallback ${fallback}`);
    const result = await callAiProvider(fallback, prompt);
    if (result) return result;
  }

  logError("All AI providers failed or unavailable");
  return null;
}

export async function listKnowledge(orgId) {
  const rows = await readJson(FILE);
  return rows
    .filter((row) => row.org_id === orgId)
    .sort((a, b) =>
      String(b.updated_at || "").localeCompare(String(a.updated_at || "")),
    )
    .map(mapKnowledgeRow);
}

export async function createKnowledgeEntry(orgId, payload) {
  const type = normalizeType(payload?.type);
  const question = sanitizeString(payload?.question, 280);
  const answer = sanitizeString(payload?.answer, 1200);
  const keywords = Array.isArray(payload?.keywords)
    ? payload.keywords
        .map((k) => sanitizeString(k, 80).toLowerCase())
        .filter(Boolean)
    : [];

  if (!question || !answer) {
    const error = new Error("question and answer are required");
    error.status = 400;
    throw error;
  }

  const now = new Date().toISOString();
  const entry = {
    id: crypto.randomUUID(),
    org_id: orgId,
    type,
    question,
    answer,
    keywords,
    created_at: now,
    updated_at: now,
  };

  await updateJson(FILE, (rows) => {
    rows.push(entry);
    return rows;
  });
  return mapKnowledgeRow(entry);
}

export async function updateKnowledgeEntry(orgId, entryId, payload) {
  let updated = null;
  await updateJson(FILE, (rows) => {
    const index = rows.findIndex(
      (row) => row.id === entryId && row.org_id === orgId,
    );
    if (index < 0) {
      const error = new Error("Knowledge entry not found");
      error.status = 404;
      throw error;
    }

    const current = rows[index];
    const type =
      payload?.type === undefined
        ? normalizeType(current.type)
        : normalizeType(payload.type);
    const question =
      payload?.question === undefined
        ? current.question
        : sanitizeString(payload.question, 280);
    const answer =
      payload?.answer === undefined
        ? current.answer
        : sanitizeString(payload.answer, 1200);
    const keywords =
      payload?.keywords === undefined
        ? current.keywords
        : Array.isArray(payload.keywords)
          ? payload.keywords
              .map((k) => sanitizeString(k, 80).toLowerCase())
              .filter(Boolean)
          : [];

    if (!question || !answer) {
      const error = new Error("question and answer are required");
      error.status = 400;
      throw error;
    }

    updated = {
      ...current,
      type,
      question,
      answer,
      keywords,
      updated_at: new Date().toISOString(),
    };
    rows[index] = updated;
    return rows;
  });

  return mapKnowledgeRow(updated);
}

export async function deleteKnowledgeEntry(orgId, entryId) {
  let deleted = false;
  await updateJson(FILE, (rows) => {
    const next = rows.filter(
      (row) => !(row.id === entryId && row.org_id === orgId),
    );
    deleted = next.length !== rows.length;
    return next;
  });
  return deleted;
}

export async function listAssistantRules() {
  return await loadAssistantRules();
}

export async function updateAssistantRules(globalRules, smallTalkRules) {
  await updateJson(RULES_FILE, () => ({
    globalRules: Array.isArray(globalRules) ? globalRules : [],
    smallTalkRules: Array.isArray(smallTalkRules) ? smallTalkRules : [],
    updated_at: new Date().toISOString(),
  }));
  return await loadAssistantRules();
}

export async function getAssistantConfig() {
  return await loadAssistantConfig();
}

export async function updateAssistantConfig(payload) {
  const current = await loadAssistantConfig();
  const updated = {
    systemPrompt: sanitizeString(
      payload.systemPrompt || current.systemPrompt,
      2000,
    ),
    agentPrompt: sanitizeString(
      payload.agentPrompt || current.agentPrompt,
      4000,
    ),
    codeContextEnabled:
      payload.codeContextEnabled !== undefined
        ? Boolean(payload.codeContextEnabled)
        : current.codeContextEnabled,
    codeContextKeywords: Array.isArray(payload.codeContextKeywords)
      ? payload.codeContextKeywords
          .map((k) => String(k).toLowerCase().trim())
          .filter(Boolean)
      : current.codeContextKeywords,
  };
  await updateJson(CONFIG_FILE, () => ({
    ...updated,
    updated_at: new Date().toISOString(),
  }));
  return updated;
}

export async function addAssistantRule(type, payload) {
  const rules = await loadAssistantRules();
  const rule = {
    id: crypto.randomUUID(),
    source: payload.source || `${type}:${Date.now()}`,
    keywords: Array.isArray(payload.keywords)
      ? payload.keywords
          .map((k) => String(k).toLowerCase().trim())
          .filter(Boolean)
      : [],
    response: sanitizeString(payload.response || "", 500),
    created_at: new Date().toISOString(),
  };

  if (type === "global") {
    rules.globalRules.push(rule);
  } else if (type === "smalltalk") {
    rules.smallTalkRules.push(rule);
  } else {
    const error = new Error("Invalid rule type");
    error.status = 400;
    throw error;
  }

  await updateJson(RULES_FILE, () => ({
    ...rules,
    updated_at: new Date().toISOString(),
  }));

  return rule;
}

export async function removeAssistantRule(type, ruleId) {
  const rules = await loadAssistantRules();
  let deleted = false;

  if (type === "global") {
    const idx = rules.globalRules.findIndex((r) => r.id === ruleId);
    if (idx >= 0) {
      rules.globalRules.splice(idx, 1);
      deleted = true;
    }
  } else if (type === "smalltalk") {
    const idx = rules.smallTalkRules.findIndex((r) => r.id === ruleId);
    if (idx >= 0) {
      rules.smallTalkRules.splice(idx, 1);
      deleted = true;
    }
  }

  if (deleted) {
    await updateJson(RULES_FILE, () => ({
      ...rules,
      updated_at: new Date().toISOString(),
    }));
  }

  return deleted;
}

function buildMatchedResponse({
  matchedAnswer,
  source,
  score,
  fallbackReason = null,
  matchedType = null,
  codeContext = null,
  knowledgeContext = "",
}) {
  return {
    matched_answer: matchedAnswer,
    source,
    confidence: Number(Math.min(0.95, 0.45 + score * 0.1).toFixed(2)),
    metadata: {
      matched_source: source,
      matched_type: matchedType,
      confidence: Number(Math.min(0.95, 0.45 + score * 0.1).toFixed(2)),
      fallback_reason: fallbackReason,
      code_context: codeContext,
      knowledge_context: knowledgeContext,
    },
  };
}

export async function assistantReply(orgId, question = "") {
  const questionText = sanitizeString(question, 800);
  const codeContext = shouldSearchCodeContext(questionText)
    ? await searchCodeContext(questionText)
    : { summary: "", snippets: [], prompt_context: "" };
  const entries = await listKnowledge(orgId);
  const knowledgeContext = await buildKnowledgeContext(questionText, entries);

  const dynamicAnswer = await generateDynamicAnswer(
    questionText,
    codeContext,
    knowledgeContext,
  );
  if (dynamicAnswer) {
    await updateLocalJson(
      "ai_response_audit.json",
      (rows = []) => {
        const next = Array.isArray(rows) ? rows : [];
        next.push({
          id: crypto.randomUUID(),
          question: questionText,
          answer: dynamicAnswer,
          source: "local_llm",
          created_at: new Date().toISOString(),
        });
        return next.slice(-500);
      },
      [],
    );
    return buildMatchedResponse({
      matchedAnswer: dynamicAnswer,
      source: "dynamic_ai:local_llm",
      score: 2,
      fallbackReason: "ai_generated_response",
      matchedType: "dynamic_ai",
      codeContext,
      knowledgeContext,
    });
  }

  return {
    forward_to_agent: true,
    agent_prompt_context: {
      question: questionText,
      code_summary: codeContext.summary,
      compact_code_context: codeContext.prompt_context,
      compact_knowledge_context: knowledgeContext,
      max_context_chars: MAX_CONTEXT_CHARS,
    },
    metadata: {
      matched_source: null,
      matched_type: null,
      confidence: 0,
      fallback_reason: "local_llm_unavailable",
      code_context: codeContext,
      knowledge_context: knowledgeContext,
    },
  };
}
