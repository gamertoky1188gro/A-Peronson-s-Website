import "./utils/dotenv.js";
import path from "path";
import fs from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { WebSocketServer } from "ws";
import { REALTIME_EVENTS, realtimeBus } from "./realtime/realtimeBus.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import requirementRoutes from "./routes/requirementRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminConfigRoutes from "./routes/adminConfigRoutes.js";
import uploadsRoutes from "./routes/uploadsRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import qdrantRoutes from "./routes/qdrantRoutes.js";
import presetsRoutes from "./routes/presetsRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";
import linkPreviewRoutes from "./routes/linkPreviewRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import partnerNetworkRoutes from "./routes/partnerNetworkRoutes.js";
import agentSubIdRoutes from "./routes/agentSubIdRoutes.js";
import callSessionRoutes from "./routes/callSessionRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import ratingsRoutes from "./routes/ratingsRoutes.js";
import presenceRoutes from "./routes/presenceRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import boostRoutes from "./routes/boostRoutes.js";
import geoRoutes from "./routes/geoRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import paymentProofRoutes from "./routes/paymentProofRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import infraRoutes from "./routes/infraRoutes.js";
import networkRoutes from "./routes/networkRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";
import crmRoutes from "./routes/crmRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import devRoutes from "./routes/devRoutes.js";
import { startEsignWebhookRetryWorker } from "./services/esignRetryService.js";
import { startSyslogServer } from "./services/syslogServer.js";
import dealJourneyRoutes from "./routes/dealJourneyRoutes.js";
import workflowLifecycleRoutes from "./routes/workflowLifecycleRoutes.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logInfo, logError } from "./utils/logger.js";
import { assistantReply, streamOpencodeReply, initOpencodeServer, initAllUserSessions } from "./services/assistantService.js";
import { maybeGenerateBotReply } from "./services/chatbotService.js";
import jwt from "jsonwebtoken";
import {
  canAccessMatch,
  listMessagesByMatch,
  postMessage,
} from "./services/messageService.js";
import { getCallSession } from "./services/callSessionService.js";
import { recordWorkflowEvent } from "./services/workflowLifecycleService.js";
import {
  setUserOnline,
  setUserOffline,
  touchUser,
} from "./services/presenceService.js";
import prisma from "./utils/prisma.js";
import {
  consumePendingInvites,
  enqueuePendingInvites,
} from "./utils/pendingInvites.js";
import {
  ensureDatabaseConnection,
  closeDatabaseConnection,
  startDbHeartbeat,
} from "./utils/db.js";
import { initRedis, closeRedis } from "./utils/redis.js";
import { startOpenSearchHeartbeat } from "./services/openSearchService.js";
import { revokeExpiredVerifications } from "./services/verificationService.js";
import { enforcePartnerFreeTierLimits } from "./services/partnerNetworkService.js";
import { runLeadReminderSweep } from "./services/leadReminderService.js";
import { getFxHealth, refreshRates } from "./services/currencyService.js";
import { startEventQualityReporter } from "./services/eventIngestionService.js";

const app = express();
const PORT = process.env.PORT || 4000;

const FX_REFRESH_INTERVAL_MS = 60 * 60 * 1000;
refreshRates().catch(() => null);
setInterval(() => {
  refreshRates().catch(() => null);
}, FX_REFRESH_INTERVAL_MS).unref();

startEventQualityReporter();

// CORS configuration - stricter in production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173", // dev frontend
      "http://localhost:4173", // preview
      "http://127.0.0.1:5173",
      "https://gartexhub.onrender.com", // production
    ];

    // Allow requests with no origin (like mobile apps, curl, Postman)
    // In production, you might want to be stricter
    if (!origin) {
      if (process.env.NODE_ENV === "production") {
        // In production, require specific origins (comment out to allow all for API clients)
        // callback(null, true); // Uncomment for strict mode
        callback(null, true); // Temporary: allow no-origin for mobile/API
      } else {
        callback(null, true); // Dev: allow all
      }
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV === "production") {
        callback(new Error("Not allowed by CORS"));
      } else {
        callback(null, true); // Dev: allow all
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "wss:", "https:"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "blob:"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));

const uploadsRoot = path.join(process.cwd(), "server", "uploads");
const chatUploadsRoot = path.join(uploadsRoot, "chat");
const feedUploadsRoot = path.join(uploadsRoot, "feed");
const profileUploadsRoot = path.join(uploadsRoot, "profile");
if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot, { recursive: true });
if (!fs.existsSync(chatUploadsRoot))
  fs.mkdirSync(chatUploadsRoot, { recursive: true });
if (!fs.existsSync(feedUploadsRoot))
  fs.mkdirSync(feedUploadsRoot, { recursive: true });
if (!fs.existsSync(profileUploadsRoot))
  fs.mkdirSync(profileUploadsRoot, { recursive: true });

app.use("/uploads", express.static(uploadsRoot));

const distRoot = path.join(process.cwd(), "dist");
const serveDist = process.env.SERVE_DIST === "true";
if (serveDist) {
  console.log("[static] SERVE_DIST=true, dist exists:", fs.existsSync(distRoot));
}
const MIME_TYPES = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

if (serveDist && fs.existsSync(distRoot)) {
  app.use((req, res, next) => {
    const ext = path.extname(req.path).toLowerCase();
    const contentType = MIME_TYPES[ext];
    if (!contentType) return next();
    const filePath = path.join(distRoot, req.path);
    if (!fs.existsSync(filePath)) return next();
    const content = fs.readFileSync(filePath);
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": Buffer.byteLength(content),
      "Cache-Control": "public, max-age=31536000, immutable",
    });
    res.end(content);
  });
}

app.use(
  "/api",
  requestLogger({ timeoutMs: Number(process.env.REQUEST_TIMEOUT_MS || 45000) }),
);

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "textile-trust-verification-mvp",
    fx: getFxHealth(),
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminConfigRoutes);
app.use("/api/admin", uploadsRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/link-preview", linkPreviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/qdrant", qdrantRoutes);
app.use("/api/presets", presetsRoutes);
app.use("/api/partners", partnerNetworkRoutes);
app.use("/api/agents/subids", agentSubIdRoutes);
app.use("/api/calls", callSessionRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/presence", presenceRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/boosts", boostRoutes);
app.use("/api/geo", geoRoutes);
app.use("/api/industry", industryRoutes);
app.use("/api/payment-proofs", paymentProofRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/deal-journeys", dealJourneyRoutes);
app.use("/api/workflow", workflowLifecycleRoutes);
app.use("/api/infra", infraRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/dev", devRoutes);
app.use(errorHandler);

if (serveDist && fs.existsSync(distRoot)) {
  app.get(/.*/, (req, res) => {
    if (req.path.match(/\.\w+$/)) {
      return res.status(404).end();
    }
    res.sendFile(path.join(distRoot, "index.html"));
  });
}

const server = http.createServer(app);
const ALLOWED_WS_ORIGINS = (
  process.env.ALLOWED_WS_ORIGINS ||
  "http://localhost:5173,http://localhost:4000"
).split(",").map((s) => s.trim());
const wsServer = new WebSocketServer({
  server,
  verifyClient: (info, cb) => {
    const origin = info.origin || info.req.headers.origin || "";
    const host = info.req.headers.host || "";
    const allowed = ALLOWED_WS_ORIGINS.some(
      (o) => origin === o || origin.startsWith(o + "/") || origin === `https://${host}` || origin === `http://${host}`,
    );
    if (allowed || !origin) {
      cb(true);
    } else {
      cb(false, 403, "Forbidden");
    }
  },
});
const recentGreetingByIp = new Map();
const callRooms = new Map();
const chatRooms = new Map();
const socketsByUserId = new Map();
if (!process.env.JWT_SECRET) {
  console.error("[server] FATAL: JWT_SECRET environment variable is required");
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER || "gartexhub-api";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "gartexhub-client";

function sendWs(socket, payload) {
  if (socket.readyState !== 1) return;
  socket.send(JSON.stringify(payload));
}

function registerSocketUser(socket, userId) {
  if (!userId) return;
  if (!socketsByUserId.has(userId)) socketsByUserId.set(userId, new Set());
  socketsByUserId.get(userId).add(socket);
}

function unregisterSocketUser(socket, userId) {
  if (!userId) return;
  const set = socketsByUserId.get(userId);
  if (!set) return;
  set.delete(socket);
  if (set.size === 0) socketsByUserId.delete(userId);
}

function broadcastToUsers(userIds = [], payload) {
  const undelivered = [];
  userIds.forEach((userId) => {
    const sockets = socketsByUserId.get(userId);
    if (!sockets || sockets.size === 0) {
      undelivered.push(userId);
      return;
    }
    sockets.forEach((sock) => sendWs(sock, payload));
  });
  return undelivered;
}

realtimeBus.on(
  REALTIME_EVENTS.notificationCreated,
  ({ userId, notification }) => {
    broadcastToUsers([String(userId)], {
      type: "notification_created",
      notification,
    });
  },
);

realtimeBus.on(REALTIME_EVENTS.notificationRead, ({ userId, id }) => {
  broadcastToUsers([String(userId)], { type: "notification_read", id });
});

function leaveCallRoom(socket) {
  const callId = socket.callRoomId;
  if (!callId) return;

  const room = callRooms.get(callId);
  if (!room) {
    socket.callRoomId = null;
    return;
  }

  room.delete(socket);
  for (const peer of room) {
    sendWs(peer, {
      type: "participant_left",
      call_id: callId,
      participant_id: socket.participantId || null,
    });
  }

  if (room.size === 0) callRooms.delete(callId);
  socket.callRoomId = null;
}

function leaveChatRoom(socket) {
  const matchId = socket.chatRoomId;
  if (!matchId) return;

  const room = chatRooms.get(matchId);
  if (!room) {
    socket.chatRoomId = null;
    return;
  }

  room.delete(socket);

  for (const peer of room) {
    sendWs(peer, {
      type: "chat_participant_left",
      match_id: matchId,
      participant_id: socket.userId || null,
    });
  }

  if (room.size === 0) chatRooms.delete(matchId);
  socket.chatRoomId = null;

  if (socket.userId) setUserOffline(socket.userId);
  if (socket.userId) unregisterSocketUser(socket, socket.userId);
}

function parseSocketUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(String(token), JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  } catch {
    return null;
  }
}

async function joinChatRoom(socket, payload) {
  const matchId = String(payload?.match_id || "").trim();
  const user = parseSocketUser(payload?.token);

  if (!matchId) {
    sendWs(socket, {
      type: "chat_error",
      error: "match_id is required to join chat room",
    });
    return;
  }

  if (!user?.id) {
    sendWs(socket, {
      type: "chat_error",
      error: "Valid token is required to join chat room",
    });
    return;
  }

  const canJoin = await canAccessMatch(matchId, user.id);
  if (!canJoin) {
    sendWs(socket, {
      type: "chat_error",
      error: "Forbidden: thread access denied",
    });
    return;
  }

  leaveChatRoom(socket);

  if (!chatRooms.has(matchId)) {
    chatRooms.set(matchId, new Set());
  }

  socket.userId = user.id;
  registerSocketUser(socket, user.id);
  setUserOnline(user.id);

  const room = chatRooms.get(matchId);
  const participants = [...room]
    .map((participantSocket) => participantSocket.userId)
    .filter(Boolean);
  room.add(socket);
  socket.chatRoomId = matchId;
  touchUser(user.id);
  await recordWorkflowEvent(
    "chat_started",
    {
      match_id: matchId,
      requirement_id: payload?.requirement_id,
      product_id: payload?.product_id,
    },
    { actor_id: user.id, source: "ws.join_chat_room" },
  ).catch(() => null);

  const history = await listMessagesByMatch(matchId);
  sendWs(socket, {
    type: "joined_chat_room",
    match_id: matchId,
    participant_id: user.id,
    participants,
    messages: history,
  });

  for (const peer of room) {
    if (peer === socket) continue;
    sendWs(peer, {
      type: "chat_participant_joined",
      match_id: matchId,
      participant_id: user.id,
    });
  }
}

async function relayChatMessage(socket, payload) {
  const matchId = socket.chatRoomId;
  if (!matchId || !socket.userId) {
    sendWs(socket, {
      type: "chat_error",
      error: "Join a chat room before sending messages",
    });
    return;
  }

  const canSend = await canAccessMatch(matchId, socket.userId);
  if (!canSend) {
    sendWs(socket, {
      type: "chat_error",
      error: "Forbidden: thread access denied",
    });
    return;
  }

  const room = chatRooms.get(matchId);
  if (!room) return;

  const messageText = String(payload?.message || "").trim();
  if (!messageText) return;

  try {
    const created = await postMessage(
      matchId,
      socket.userId,
      messageText,
      payload?.message_type || "text",
      null,
      {
        source_type: payload?.source_type,
        source_id: payload?.source_id,
        source_label: payload?.source_label,
      },
    );

    const policyStatus = String(created?.policy_status || "delivered");
    const shouldBroadcast = policyStatus === "delivered";
    const peers = shouldBroadcast ? [...room] : [socket];
    for (const peer of peers) {
      sendWs(peer, {
        type: "chat_message",
        match_id: matchId,
        message: created,
      });
    }

    if (!shouldBroadcast) {
      sendWs(socket, {
        type: "chat_policy_status",
        match_id: matchId,
        status: policyStatus,
        reason: created?.policy_reason || null,
        queue_rank: created?.policy_priority || null,
        retry_after_seconds: Number(created?.retry_after_seconds || 0),
      });
    }

    await recordWorkflowEvent(
      "chat_message_sent",
      {
        match_id: matchId,
      },
      { actor_id: socket.userId, source: "ws.chat_message" },
    ).catch(() => null);

    try {
      const botResult = await maybeGenerateBotReply({
        match_id: matchId,
        sender_id: socket.userId,
        message: messageText,
      });
      if (botResult?.reply) {
        for (const peer of room) {
          sendWs(peer, {
            type: "chat_message",
            match_id: matchId,
            message: botResult.reply,
          });
        }
      }
    } catch {
      // silent
    }
  } catch (error) {
    logError("chat_message_failed", error);
    const policyReason = error?.policy?.reason || null;
    const retryAfter = Number(error?.policy?.retry_after_seconds || 0);
    sendWs(socket, {
      type: "chat_error",
      error: error?.message || "Unable to send message",
      reason: policyReason,
      retry_after_seconds: retryAfter,
    });
  }
}

async function joinCallRoom(socket, payload) {
  const callId = String(payload?.call_id || "").trim();
  const tokenUser = parseSocketUser(payload?.token);
  const participantId =
    String(payload?.participant_id || "").trim() ||
    tokenUser?.id ||
    `anon-${Date.now()}`;
  if (!callId) {
    sendWs(socket, {
      type: "call_error",
      error: "call_id is required to join room",
    });
    return;
  }

  if (!tokenUser?.id) {
    sendWs(socket, {
      type: "call_error",
      error: "Valid token is required to join call room",
    });
    return;
  }

  const call = await getCallSession(callId, tokenUser.id);
  if (!call || call === "forbidden") {
    sendWs(socket, {
      type: "call_error",
      error: "Forbidden: call access denied",
    });
    return;
  }

  leaveCallRoom(socket);

  if (!callRooms.has(callId)) {
    callRooms.set(callId, new Set());
  }

  const room = callRooms.get(callId);
  const existingParticipants = [...room]
    .map((s) => s.participantId)
    .filter(Boolean);
  room.add(socket);
  socket.callRoomId = callId;
  socket.participantId = participantId;
  socket.userId = tokenUser.id;
  registerSocketUser(socket, tokenUser.id);

  sendWs(socket, {
    type: "joined_call_room",
    call_id: callId,
    participant_id: participantId,
    participants: existingParticipants,
    should_offer: existingParticipants.length > 0,
  });

  for (const peer of room) {
    if (peer === socket) continue;
    sendWs(peer, {
      type: "participant_joined",
      call_id: callId,
      participant_id: participantId,
    });
  }
}

function relaySignal(socket, payload) {
  const callId = socket.callRoomId;
  if (!callId) return;
  const room = callRooms.get(callId);
  if (!room) return;

  const signalType = String(payload?.signal?.type || "");
  if (signalType && signalType !== "candidate") {
    logInfo("webrtc_signal", {
      call_id: callId,
      from_user_id: socket.userId || null,
      from_participant_id: socket.participantId || null,
      signal_type: signalType,
    });
  }

  for (const peer of room) {
    if (peer === socket) continue;
    sendWs(peer, {
      type: "webrtc_signal",
      call_id: callId,
      from: socket.participantId || null,
      signal: payload?.signal || null,
    });
  }
}

wsServer.on("connection", (socket, req) => {
  logInfo("Assistant WebSocket connected");
  let lastQuestion = "";
  let lastQuestionAt = 0;

  function sendReply(payload) {
    const answer =
      payload?.matched_answer || payload?.answer || payload?.message || "";
    sendWs(socket, {
      ...payload,
      matched_answer: answer,
      answer,
      message: answer,
    });
  }

  const clientIp = req?.socket?.remoteAddress || "unknown";
  const now = Date.now();
  const lastGreetingAt = Number(recentGreetingByIp.get(clientIp) || 0);
  if (now - lastGreetingAt > 5_000) {
    recentGreetingByIp.set(clientIp, now);
    sendReply({
      type: "reply",
      question: null,
      matched_answer:
        "Hello! I am your GarTex Assistant (WS). How can I help you with your textile business today?",
      source: "system:greeting",
      metadata: {
        matched_source: "system:greeting",
        matched_type: "system",
        confidence: 1,
        fallback_reason: null,
      },
    });
  }

  socket.on("message", async (rawMessage) => {
    let payload;
    try {
      payload = JSON.parse(String(rawMessage || ""));
    } catch {
      sendReply({
        type: "reply",
        question: null,
        matched_answer:
          'Invalid message format. Please send JSON like {"type":"ask","question":"..."}.',
        source: "ws:error",
        metadata: {
          matched_source: "ws:error",
          matched_type: "error",
          confidence: 0,
          fallback_reason: "invalid_json",
        },
      });
      return;
    }

    if (payload?.type === "join_call_room") {
      await joinCallRoom(socket, payload);
      return;
    }

    if (payload?.type === "webrtc_signal") {
      relaySignal(socket, payload);
      return;
    }

    if (payload?.type === "identify") {
      const tokenUser = parseSocketUser(payload?.token);
      if (!tokenUser?.id) return;
      socket.userId = tokenUser.id;
      registerSocketUser(socket, tokenUser.id);
      const queued = consumePendingInvites(tokenUser.id);
      if (queued.length > 0) queued.forEach((invite) => sendWs(socket, invite));
      return;
    }

    if (payload?.type === "call_invite") {
      const tokenUser = parseSocketUser(payload?.token);
      if (!tokenUser?.id) return;
      const participantIds = Array.isArray(payload?.participant_ids)
        ? payload.participant_ids.map((id) => String(id))
        : [];
      if (!participantIds.length) return;
      const caller = await prisma.user.findUnique({ where: { id: tokenUser.id } });
      const callerPayload = caller
        ? {
            id: caller.id,
            name: caller.name || "",
            email: caller.email || "",
            avatar: caller.avatar_url || caller.avatar || "",
            role: caller.role || "",
          }
        : { id: tokenUser.id };

      const targets = participantIds.filter((id) => id && id !== tokenUser.id);
      if (!targets.length) return;
      const invitePayload = {
        type: "incoming_call",
        call_id: payload?.call_id || null,
        match_id: payload?.match_id || null,
        from: callerPayload,
      };
      const undelivered = broadcastToUsers(targets, invitePayload);
      enqueuePendingInvites(undelivered, [invitePayload]);
      return;
    }

    if (payload?.type === "join_chat_room") {
      await joinChatRoom(socket, payload);
      return;
    }

    if (payload?.type === "chat_message") {
      await relayChatMessage(socket, payload);
      return;
    }

    if (payload?.type !== "ask") return;

    const question = String(payload?.question || "");
    const messageNow = Date.now();
    if (
      question &&
      question === lastQuestion &&
      messageNow - lastQuestionAt < 1500
    )
      return;
    lastQuestion = question;
    lastQuestionAt = messageNow;
    logInfo("Assistant WebSocket ask received", {
      question_chars: question.length,
    });

    try {
      const userId = socket?.userId || null;
      const requestId = payload?.request_id || null;

      let streamedText = "";
      let streamError = null;
      let streamDone = false;

      const gotChunk = (delta, fullText) => {
        streamedText = fullText;
        sendReply({
          type: "chunk",
          request_id: requestId,
          question,
          delta,
          text: fullText,
          done: false,
        });
      };

      const gotComplete = (answer, error) => {
        streamDone = true;
        streamError = error;
        if (error) {
          sendReply({
            type: "reply",
            request_id: requestId,
            question,
            matched_answer: answer || "I could not find a response right now. Please try again.",
            source: "ws:stream_error",
            metadata: {
              matched_source: "ws:stream_error",
              matched_type: "error",
              confidence: 0,
              fallback_reason: error,
            },
          });
        } else {
          sendReply({
            type: "reply",
            request_id: requestId,
            question,
            matched_answer: answer || "I could not find a response right now. Please try again.",
            source: "ws:stream",
            metadata: {
              matched_source: "ws:stream",
              matched_type: "ai_generated",
              confidence: 2,
              fallback_reason: null,
            },
          });
        }
      };

      await streamOpencodeReply(question, userId, gotChunk, gotComplete);

      if (!streamDone) {
        sendReply({
          type: "reply",
          request_id: requestId,
          question,
          matched_answer: streamedText || "I could not find a response right now. Please try again.",
          source: "ws:fallback",
          metadata: {
            matched_source: "ws:fallback",
            matched_type: "unknown",
            confidence: 0,
            fallback_reason: "stream_not_started",
          },
        });
      }
    } catch (error) {
      logError("Assistant WebSocket ask failed", error);
      sendReply({
        type: "reply",
        request_id: payload?.request_id || null,
        question,
        matched_answer:
          "I could not reach the AI model right now. Please try again.",
        source: "ws:error",
        metadata: {
          matched_source: "ws:error",
          matched_type: "error",
          confidence: 0,
          fallback_reason: "assistant_exception",
        },
      });
    }
  });

  const keepaliveTimer = setInterval(() => {
    if (socket.readyState === 1) {
      socket.ping();
    } else {
      clearInterval(keepaliveTimer);
    }
  }, 25_000);

  socket.on("close", () => {
    clearInterval(keepaliveTimer);
    leaveCallRoom(socket);
    leaveChatRoom(socket);
    unregisterSocketUser(socket, socket.userId);
    delete socket.userId;
  });

  socket.on("error", () => {
    clearInterval(keepaliveTimer);
    leaveCallRoom(socket);
    leaveChatRoom(socket);
    unregisterSocketUser(socket, socket.userId);
    delete socket.userId;
  });
});

async function start() {
  await ensureDatabaseConnection();
  startDbHeartbeat();
  // Redis caching (optional - only if REDIS_URL is set)
  await initRedis();
  startOpenSearchHeartbeat();
  // Verification renewals: keep badges in sync with subscription validity.
  revokeExpiredVerifications().catch((error) =>
    logError("verification_expiry_check_failed", error),
  );
  enforcePartnerFreeTierLimits().catch((error) =>
    logError("partner_limit_check_failed", error),
  );
  runLeadReminderSweep().catch((error) =>
    logError("lead_reminder_sweep_failed", error),
  );
  setInterval(
    () => {
      revokeExpiredVerifications().catch((error) =>
        logError("verification_expiry_check_failed", error),
      );
      enforcePartnerFreeTierLimits().catch((error) =>
        logError("partner_limit_check_failed", error),
      );
    },
    6 * 60 * 60 * 1000,
  );

  setInterval(
    () => {
      runLeadReminderSweep().catch((error) =>
        logError("lead_reminder_sweep_failed", error),
      );
    },
    5 * 60 * 1000,
  );
  
  initOpencodeServer()
    .then(() => initAllUserSessions())
    .catch((err) => logError("init_opencode_failed", err));
  
  server.listen(PORT, () => {
    logInfo(`Verification MVP API running on http://localhost:${PORT}`);
  });

  startSyslogServer();

  try {
    startEsignWebhookRetryWorker();
  } catch (err) {
    logError("start_esign_retry_worker_failed", err);
  }

  import("./services/aiModerationService.js")
    .then(({ ensureVenv, isAIAnalyticsEnabled }) => {
      import("./services/uploadsService.js")
        .then(({ scanAndAnalyzeExistingFiles }) => {
          setTimeout(() => {
            if (!isAIAnalyticsEnabled()) {
              console.log(
                "[AI Moderation] Disabled via AI_HARAM_ANALYTICS_ENABLED — skipping venv setup and scan",
              );
              return;
            }
            ensureVenv().catch(console.error);
            scanAndAnalyzeExistingFiles().catch(console.error);
          }, 5000);
        })
        .catch(() => {});
    })
    .catch(() => {});
}

start().catch((error) => {
  logError("Failed to start server", error);
  process.exit(1);
});

process.on("SIGINT", async () => {
  try {
    await closeRedis();
    await closeDatabaseConnection();
  } finally {
    process.exit(0);
  }
});
