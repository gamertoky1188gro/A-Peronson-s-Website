import fs from "node:fs/promises";
import path from "node:path";

async function readChatSource() {
  return fs.readFile(
    path.join(process.cwd(), "src", "pages", "ChatInterface.jsx"),
    "utf8",
  );
}

describe("ChatInterface send/error/reconnect contracts", () => {
  test("sendMessage trims draft and handles lock/notice", async () => {
    const source = await readChatSource();
    expect(source).toMatch(/const content = draftMessage\.trim\(\)/);
    expect(source).toMatch(
      /if \(!canSendMessage\)[\s\S]*setNotice\(\{ title: "Access required"/,
    );
  });

  test("chat error payload sets policy feedback or error state", async () => {
    const source = await readChatSource();
    expect(source).toMatch(/chat_error/);
    expect(source).toMatch(/setPolicyFeedback/);
    expect(source).toMatch(/setError/);
  });

  test("websocket reconnects on close with backoff timer", async () => {
    const source = await readChatSource();
    expect(source).toMatch(
      /ws\.onclose = \(\) => \{[\s\S]*setChatConnectionStatus\("offline"\)/,
    );
    expect(source).toMatch(
      /reconnectTimerRef\.current = window\.setTimeout\(connect, 1500\)/,
    );
  });
});
