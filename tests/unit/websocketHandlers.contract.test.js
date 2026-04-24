import fs from "node:fs/promises";
import path from "node:path";

describe("server websocket handler contracts", () => {
  test("chat join/session auth failures emit stable error strings", async () => {
    const source = await fs.readFile(
      path.join(process.cwd(), "server", "server.js"),
      "utf8",
    );

    expect(source).toMatch(/payload\?\.type\s*===\s*'join_chat_room'/);
    expect(source).toMatch(
      /chat_error',\s*error:\s*'match_id is required to join chat room'/,
    );
    expect(source).toMatch(
      /chat_error',\s*error:\s*'Valid token is required to join chat room'/,
    );
    expect(source).toMatch(
      /chat_error',\s*error:\s*'Forbidden: thread access denied'/,
    );

    expect(source).toMatch(/payload\?\.type\s*===\s*'join_call_room'/);
    expect(source).toMatch(
      /call_error',\s*error:\s*'call_id is required to join room'/,
    );
    expect(source).toMatch(
      /call_error',\s*error:\s*'Valid token is required to join call room'/,
    );
    expect(source).toMatch(
      /call_error',\s*error:\s*'Forbidden: call access denied'/,
    );
  });

  test("close handler performs room and socket cleanup", async () => {
    const source = await fs.readFile(
      path.join(process.cwd(), "server", "server.js"),
      "utf8",
    );

    expect(source).toMatch(/socket\.on\('close',\s*\(\)\s*=>\s*\{/);
    expect(source).toMatch(/leaveCallRoom\(socket\)/);
    expect(source).toMatch(/leaveChatRoom\(socket\)/);
    expect(source).toMatch(/setUserOffline\(socket\.userId\)/);
    expect(source).toMatch(/unregisterSocketUser\(socket, socket\.userId\)/);
  });
});
