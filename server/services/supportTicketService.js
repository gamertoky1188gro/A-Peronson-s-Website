import crypto from "crypto";
import { readJson, writeJson } from "../utils/jsonStore.js";
import { sanitizeString } from "../utils/validators.js";
import { getAdminConfig } from "./adminConfigService.js";

const TICKETS_FILE = "support_tickets.json";
const MESSAGES_FILE = "support_ticket_messages.json";

function nowIso() {
  return new Date().toISOString();
}

function minutesFromNow(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function hoursFromNow(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    role: user.role || "",
  };
}

async function getSlaTargets() {
  const config = await getAdminConfig();
  const responseMinutes = Number(
    config?.support?.sla_targets?.response_minutes || 60,
  );
  const resolutionHours = Number(
    config?.support?.sla_targets?.resolution_hours || 72,
  );
  return {
    response_minutes: Math.max(15, responseMinutes),
    resolution_hours: Math.max(1, resolutionHours),
  };
}

function normalizePriority(priority, premium) {
  const raw = sanitizeString(String(priority || ""), 40).toLowerCase();
  if (premium && ["high", "urgent", "priority"].includes(raw))
    return "priority";
  if (["high", "urgent", "priority"].includes(raw)) return "high";
  if (["low", "medium", "normal"].includes(raw)) return raw;
  return "standard";
}

export async function createSupportTicket({
  actor,
  subject,
  description,
  category,
  pageUrl,
  contactEmail,
  priority,
}) {
  const tickets = await readJson(TICKETS_FILE);
  const rows = Array.isArray(tickets) ? tickets : [];
  const messages = await readJson(MESSAGES_FILE);
  const messageRows = Array.isArray(messages) ? messages : [];

  const premium =
    String(actor?.subscription_status || "").toLowerCase() === "premium";
  const sla = await getSlaTargets();
  const now = nowIso();
  const ticketId = crypto.randomUUID();
  const assignedTo = sanitizeString(
    String(actor?.profile?.account_manager_id || ""),
    120,
  );

  const ticket = {
    id: ticketId,
    user_id: sanitizeString(String(actor?.id || ""), 120),
    subject: sanitizeString(String(subject || "Support ticket"), 160),
    category: sanitizeString(String(category || "General"), 80),
    status: "open",
    priority: normalizePriority(priority, premium),
    premium_support: premium,
    page_url: sanitizeString(String(pageUrl || ""), 240),
    contact_email: sanitizeString(String(contactEmail || ""), 120),
    assigned_to: assignedTo || null,
    created_at: now,
    updated_at: now,
    last_message_at: now,
    sla_response_due_at: minutesFromNow(sla.response_minutes),
    sla_resolution_due_at: hoursFromNow(sla.resolution_hours),
  };

  rows.push(ticket);

  const initialMessage = {
    id: crypto.randomUUID(),
    ticket_id: ticketId,
    sender_id: sanitizeString(String(actor?.id || ""), 120),
    sender_role: sanitizeString(String(actor?.role || ""), 40),
    message: sanitizeString(String(description || ""), 1200),
    created_at: now,
  };
  messageRows.push(initialMessage);

  await writeJson(TICKETS_FILE, rows);
  await writeJson(MESSAGES_FILE, messageRows);
  return { ticket, initial_message: initialMessage };
}

export async function listSupportTicketsForUser(userId) {
  const tickets = await readJson(TICKETS_FILE);
  const rows = Array.isArray(tickets) ? tickets : [];
  const userRows = rows
    .filter((row) => String(row.user_id) === String(userId || ""))
    .sort((a, b) =>
      String(b.updated_at || "").localeCompare(String(a.updated_at || "")),
    );
  return userRows;
}

export async function listSupportTicketsAdmin({
  status,
  priority,
  assignedTo,
  premiumOnly,
  limit = 50,
  offset = 0,
} = {}) {
  const tickets = await readJson(TICKETS_FILE);
  const rows = Array.isArray(tickets) ? tickets : [];
  const normalizedStatus = status
    ? sanitizeString(String(status || ""), 40).toLowerCase()
    : "";
  const normalizedPriority = priority
    ? sanitizeString(String(priority || ""), 40).toLowerCase()
    : "";
  const normalizedAssigned = assignedTo
    ? sanitizeString(String(assignedTo || ""), 120)
    : "";
  const premiumFlag = premiumOnly === undefined ? null : Boolean(premiumOnly);

  const filtered = rows.filter((row) => {
    if (
      normalizedStatus &&
      String(row.status || "").toLowerCase() !== normalizedStatus
    )
      return false;
    if (
      normalizedPriority &&
      String(row.priority || "").toLowerCase() !== normalizedPriority
    )
      return false;
    if (
      normalizedAssigned &&
      String(row.assigned_to || "") !== normalizedAssigned
    )
      return false;
    if (premiumFlag !== null && Boolean(row.premium_support) !== premiumFlag)
      return false;
    return true;
  });

  const sorted = filtered.sort((a, b) =>
    String(b.updated_at || "").localeCompare(String(a.updated_at || "")),
  );
  const start = Math.max(0, Number(offset) || 0);
  const max = Math.min(200, Math.max(1, Number(limit) || 50));
  return sorted.slice(start, start + max);
}

export async function listSupportTicketMessages(ticketId) {
  const messages = await readJson(MESSAGES_FILE);
  const rows = Array.isArray(messages) ? messages : [];
  return rows
    .filter((row) => String(row.ticket_id) === String(ticketId || ""))
    .sort((a, b) =>
      String(a.created_at || "").localeCompare(String(b.created_at || "")),
    );
}

export async function getSupportTicketById(ticketId) {
  const tickets = await readJson(TICKETS_FILE);
  const rows = Array.isArray(tickets) ? tickets : [];
  return rows.find((row) => String(row.id) === String(ticketId || "")) || null;
}

export async function appendSupportTicketMessage(ticketId, actor, message) {
  const tickets = await readJson(TICKETS_FILE);
  const rows = Array.isArray(tickets) ? tickets : [];
  const idx = rows.findIndex(
    (row) => String(row.id) === String(ticketId || ""),
  );
  if (idx < 0) return null;
  if (String(rows[idx].user_id) !== String(actor?.id || "")) return "forbidden";

  const entry = {
    id: crypto.randomUUID(),
    ticket_id: String(ticketId),
    sender_id: sanitizeString(String(actor?.id || ""), 120),
    sender_role: sanitizeString(String(actor?.role || ""), 40),
    message: sanitizeString(String(message || ""), 1200),
    created_at: nowIso(),
  };

  const messages = await readJson(MESSAGES_FILE);
  const messageRows = Array.isArray(messages) ? messages : [];
  messageRows.push(entry);
  rows[idx] = {
    ...rows[idx],
    updated_at: entry.created_at,
    last_message_at: entry.created_at,
    status: rows[idx].status === "resolved" ? "open" : rows[idx].status,
  };

  await writeJson(MESSAGES_FILE, messageRows);
  await writeJson(TICKETS_FILE, rows);
  return entry;
}

export async function adminAssignSupportTicket(ticketId, assigneeId, actorId) {
  const tickets = await readJson(TICKETS_FILE);
  const rows = Array.isArray(tickets) ? tickets : [];
  const idx = rows.findIndex(
    (row) => String(row.id) === String(ticketId || ""),
  );
  if (idx < 0) return null;
  rows[idx] = {
    ...rows[idx],
    assigned_to: sanitizeString(String(assigneeId || ""), 120) || null,
    updated_at: nowIso(),
    updated_by: sanitizeString(String(actorId || ""), 120),
  };
  await writeJson(TICKETS_FILE, rows);
  return rows[idx];
}

export async function adminUpdateSupportTicket(
  ticketId,
  patch = {},
  actorId = "",
) {
  const tickets = await readJson(TICKETS_FILE);
  const rows = Array.isArray(tickets) ? tickets : [];
  const idx = rows.findIndex(
    (row) => String(row.id) === String(ticketId || ""),
  );
  if (idx < 0) return null;

  const nextStatus = patch.status
    ? sanitizeString(String(patch.status || ""), 40).toLowerCase()
    : rows[idx].status;
  const nextPriority = patch.priority
    ? sanitizeString(String(patch.priority || ""), 40).toLowerCase()
    : rows[idx].priority;

  rows[idx] = {
    ...rows[idx],
    status: nextStatus || rows[idx].status,
    priority: nextPriority || rows[idx].priority,
    resolution_note: patch.resolution_note
      ? sanitizeString(String(patch.resolution_note || ""), 240)
      : rows[idx].resolution_note,
    resolved_at:
      nextStatus === "resolved" ? nowIso() : rows[idx].resolved_at || "",
    updated_at: nowIso(),
    updated_by: sanitizeString(String(actorId || ""), 120),
  };

  await writeJson(TICKETS_FILE, rows);
  return rows[idx];
}

export async function buildSupportTicketSummary(ticket) {
  if (!ticket) return ticket;
  const users = await readJson("users.json");
  const rows = Array.isArray(users) ? users : [];
  const user =
    rows.find((u) => String(u.id) === String(ticket.user_id)) || null;
  const assignee = ticket.assigned_to
    ? rows.find((u) => String(u.id) === String(ticket.assigned_to)) || null
    : null;
  return {
    ...ticket,
    user: publicUser(user),
    assignee: publicUser(assignee),
  };
}
