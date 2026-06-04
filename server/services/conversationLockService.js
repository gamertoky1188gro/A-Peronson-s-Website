import crypto from "crypto";
import prisma from "../utils/prisma.js";

async function createLockNotification(
  userId,
  message,
  requestId,
  actorId,
  meta = {},
) {
  if (!userId) return;
  await prisma.notification.create({
    data: {
      id: crypto.randomUUID(),
      user_id: userId,
      type: "conversation_lock",
      entity_type: "buyer_request",
      entity_id: requestId,
      message,
      actor_id: actorId,
      meta,
      read: false,
      created_at: new Date(),
    },
  });
}

function normalizeAllowed(lock) {
  if (!lock) return [];
  const allowedUsers = Array.isArray(lock.allowed_users)
    ? lock.allowed_users
    : [];
  const allowedAgents = Array.isArray(lock.allowed_agents)
    ? lock.allowed_agents
    : [];
  return [
    ...new Set([...allowedUsers, ...allowedAgents].map((id) => String(id))),
  ];
}

export async function claimConversation(requestId, agent) {
  const existing = await prisma.conversationLock.findUnique({
    where: { request_id: requestId },
  });

  if (!existing) {
    const row = await prisma.conversationLock.create({
      data: {
        request_id: requestId,
        locked_by: agent.id,
        allowed_agents: [agent.id],
        allowed_users: [agent.id],
        lock_type: "agent_claim",
        lock_status: "claimed",
        lock_reason: "agent_claim",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    await createLockNotification(
      agent.id,
      `You claimed buyer request ${requestId}.`,
      requestId,
      agent.id,
    );
    return { status: "claimed", ...row };
  }

  const allowed = normalizeAllowed(existing);
  if (existing.locked_by === agent.id || allowed.includes(agent.id)) {
    return { status: "granted", ...existing };
  }

  return {
    status: "locked",
    notification: "Conversation is locked by another agent.",
  };
}

export async function grantConversationAccess(requestId, actor, targetUserId) {
  if (!targetUserId) return "invalid_target";
  const existing = await prisma.conversationLock.findUnique({
    where: { request_id: requestId },
  });
  if (!existing) return null;
  const isOwner = String(existing.locked_by) === String(actor?.id || "");
  const isAdmin = ["owner", "admin"].includes(
    String(actor?.role || "").toLowerCase(),
  );
  if (!isOwner && !isAdmin) return "forbidden";

  const allowedUsers = normalizeAllowed(existing);
  if (!allowedUsers.includes(targetUserId)) {
    await prisma.conversationLock.update({
      where: { request_id: requestId },
      data: {
        allowed_users: [...allowedUsers, targetUserId],
        updated_at: new Date(),
      },
    });
  }

  await createLockNotification(
    targetUserId,
    `Access granted for buyer request ${requestId}. You can now join this conversation.`,
    requestId,
    actor?.id,
    { request_id: requestId, granted_by: actor?.id },
  );

  return prisma.conversationLock.findUnique({ where: { request_id: requestId } });
}

export async function requestConversationAccess(requestId, requester) {
  const lock = await prisma.conversationLock.findUnique({
    where: { request_id: requestId },
  });

  if (!lock) {
    return { status: "unclaimed", request_id: requestId };
  }

  const allowed = normalizeAllowed(lock);
  if (lock.locked_by === requester.id || allowed.includes(requester.id)) {
    return { status: "granted", ...lock };
  }

  await createLockNotification(
    lock.locked_by,
    `${requester.name || "An agent"} requested access to buyer request ${requestId}.`,
    requestId,
    requester.id,
    { request_id: requestId, requester_id: requester.id },
  );

  await createLockNotification(
    requester.id,
    `Access request sent for buyer request ${requestId}.`,
    requestId,
    requester.id,
    { request_id: requestId, requester_id: requester.id },
  );

  return {
    status: "requested",
    request_id: requestId,
    locked_by: lock.locked_by,
  };
}

export async function transferConversation(requestId, actor, targetUserId) {
  if (!targetUserId) return "invalid_target";
  const existing = await prisma.conversationLock.findUnique({
    where: { request_id: requestId },
  });
  if (!existing) return null;

  const isOwner = String(existing.locked_by) === String(actor?.id || "");
  const isAdmin = ["owner", "admin"].includes(
    String(actor?.role || "").toLowerCase(),
  );
  if (!isOwner && !isAdmin) return "forbidden";

  await prisma.conversationLock.update({
    where: { request_id: requestId },
    data: {
      locked_by: targetUserId,
      allowed_agents: [targetUserId],
      allowed_users: [targetUserId],
      lock_type: "agent_claim",
      lock_status: "claimed",
      lock_reason: "agent_transfer",
      updated_at: new Date(),
    },
  });

  await createLockNotification(
    targetUserId,
    `A conversation was transferred to you for buyer request ${requestId}. You now own this thread.`,
    requestId,
    actor?.id,
    { request_id: requestId, transferred_by: actor?.id },
  );

  await createLockNotification(
    existing.locked_by,
    `You transferred buyer request ${requestId}. You no longer have messaging access.`,
    requestId,
    actor?.id,
    { request_id: requestId, transferred_to: targetUserId },
  );

  return prisma.conversationLock.findUnique({ where: { request_id: requestId } });
}
