import { BUILDERS } from "../../src/hooks/wsMessages/messageBuilders";

const WS_URL = "ws://localhost:8080";

export function createWsClient(accessToken) {
  const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(accessToken)}`);
  const listeners = new Set();

  ws.addEventListener("message", (event) => {
    let message;
    try {
        message = JSON.parse(event.data);
    } catch {
        return;
    }
    for (const fn of listeners) fn(message);
  });

  const connected = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", () => reject(new Error("WS connection failed")));
  });

  return {
    async send(type, params) {
      await connected;
      const builder = BUILDERS[type];
      if (!builder) throw new Error(`No BUILDER for "${type}"`);
      ws.send(JSON.stringify(builder(params)));
    },

    waitFor(predicate, timeoutMs = 5000) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          listeners.delete(handler);
          reject(new Error(`waitFor timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        function handler(msg) {
          if (predicate(msg)) {
            clearTimeout(timer);
            listeners.delete(handler);
            resolve(msg);
          }
        }
        listeners.add(handler);
      });
    },

    close() { ws.close(); },
  };
}