import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "node:util";
import {
  clearImmediate as nodeClearImmediate,
  setImmediate as nodeSetImmediate,
} from "node:timers";

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}

if (!globalThis.setImmediate) {
  globalThis.setImmediate = nodeSetImmediate;
}

if (!globalThis.clearImmediate) {
  globalThis.clearImmediate = nodeClearImmediate;
}

if (typeof window !== "undefined" && !window.scrollTo) {
  window.scrollTo = () => {};
}

if (!globalThis.fetch) {
  globalThis.fetch = async (url, options = {}) => {
    const { method = "GET", headers = {}, body } = options;
    return {
      ok: method !== "POST" || !url.includes("fail"),
      status: 200,
      json: async () => ({
        choices: [{ message: { content: "Mock response" } }],
      }),
      text: async () => "Mock response",
    };
  };
}
