import { postMessage } from "../../server/services/messageService.js";
import { readJson, writeJson } from "../../server/utils/jsonStore.js";

describe("message queue and policy decision integrity", () => {
  test("postMessage persists consistent queue + decision linkage", async () => {
    process.env.NODE_ENV = "test";

    const now = Date.now();
    const buyerId = `buyer-${now}`;
    const supplierId = `factory-${now}`;
    const matchId = `req-${now}:${supplierId}`;

    await writeJson("users.json", [
      {
        id: buyerId,
        role: "buyer",
        status: "active",
        verified: true,
        name: "Buyer",
        email: "buyer@example.com",
      },
      {
        id: supplierId,
        role: "factory",
        status: "active",
        verified: true,
        name: "Supplier",
        email: "supplier@example.com",
      },
    ]);
    await writeJson("requirements.json", [
      { id: `req-${now}`, buyer_id: buyerId, verified_only: false },
    ]);
    await writeJson("messages.json", []);
    await writeJson("message_queue_items.json", []);
    await writeJson("message_policy_logs.json", []);
    await writeJson("message_queue.json", []);
    await writeJson("message_policy_decisions.json", []);
    await writeJson("communication_limits.json", []);
    await writeJson("communication_policy_configs.json", []);
    await writeJson("sender_reputation.json", []);
    await writeJson("policy_metrics.json", {});
    await writeJson("violations.json", []);
    await writeJson("notifications.json", []);
    await writeJson("message_requests.json", []);
    await writeJson("conversation_locks.json", []);

    const entry = await postMessage(
      matchId,
      buyerId,
      "urgent limited offer contact me on telegram",
      "text",
    );

    expect(entry).toBeDefined();
    expect(entry.id).toBeTruthy();
    expect(entry.policy_status).toBe("queued");
    expect(entry.queue_id).toBeTruthy();

    const queueRows = await readJson("message_queue_items.json");
    const policyLogs = await readJson("message_policy_logs.json");
    const messages = await readJson("messages.json");

    const queue = queueRows.find((row) => row.id === entry.queue_id);
    const decision = policyLogs.find((row) => row.queue_id === entry.queue_id);
    const message = messages.find((row) => row.id === entry.id);

    expect(queue).toBeDefined();
    expect(queue.message_id).toBe(entry.id);
    expect(queue.queue_status).toBe("sent");

    expect(decision).toBeDefined();
    expect(decision.action).toBe("queue");
    expect(decision.match_id).toBe(matchId);

    expect(message).toBeDefined();
    expect(message.queue_id).toBe(entry.queue_id);
    expect(message.policy_status).toBe("queued");
    expect(message.moderated).toBe(true);
    expect(String(message.message || "")).toMatch(/Removed: outside contact/i);
  });
});
