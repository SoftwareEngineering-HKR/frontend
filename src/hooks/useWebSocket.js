import { useEffect, useRef, useState, useCallback } from "react";
import { HANDLERS } from "./wsMessages/messageHandlers";
import { BUILDERS } from "./wsMessages/messageBuilders";

// const WS_URL = "ws://192.168.50.207:8080";
const WS_BASE_URL = "ws://localhost:8080";

// How long to wait for a device to confirm a state change before showing an error
const UPDATE_TIMEOUT_MS = 5000;

export function useWebSocket(isLoggedIn, accessToken) {
  const [devices, setDevices] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // "disconnected" | "connecting" | "connected"
  const [wsError, setWsError] = useState(null);

  const wsRef = useRef(null);
  // Tracks in-flight update commands: deviceId -> { timerId, resolve, reject }
  // If the backend confirms the update with an "update value" message (from handler), we call resolve() and clear the timeout
  // If we get an "action response" error message (from handler) or the timeout triggers, we call reject() and clear the pending command
  const pendingRef = useRef({});

  // When user logs in with a valid token, it connects to WS; on logout, it disconnects
  useEffect(() => {
    if (!isLoggedIn || !accessToken) {
      wsRef.current?.close();
      wsRef.current = null;
      setDevices([]);
      setConnectionStatus("disconnected");
      return;
    }

    setConnectionStatus("connecting");
    const wsUrl = `${WS_BASE_URL}?token=${encodeURIComponent(accessToken)}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("connected");
      setWsError(null);
    };

    ws.onmessage = (event) => {
      console.log("WS RAW:", event.data);
      let message;
      try {
        message = JSON.parse(event.data);
        console.log("WS PARSED:", message);
      } catch {
        console.error("Failed to parse WebSocket message:", event.data);
        return;
      }

      const handler = HANDLERS[message.type];
      if (handler) {
        handler(message.payload, { setDevices, setWsError, pendingRef });
      } else {
        console.warn("Unknown WebSocket message type:", message.type);
      }
    };

    ws.onclose = () => {
      setConnectionStatus("disconnected");
      wsRef.current = null;
    };

    ws.onerror = () => {
      setConnectionStatus("disconnected");
      setWsError("Connection to server failed");
    };

    return () => {
      ws.close();
    };
  }, [isLoggedIn, accessToken]);

  const sendMessage = useCallback((type, params) => {
    return new Promise((resolve, reject) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        reject(new Error("Not connected to server"));
        return;
      }

      const builder = BUILDERS[type];
      if (!builder) {
        reject(new Error(`No builder registered for message type: "${type}"`));
        return;
      }

      wsRef.current.send(JSON.stringify(builder(params)));

      // Only set up a timeout for messages that expect a confirmation back from a device.
      // For device updates, if no "update value" comes back within the timeout, we assume the device failed.
      // Other messages (like room or device management) don't have backend responses yet,
      // so we resolve them immediately for now and can change when/if the backend implements those.
      if (params.deviceId) {
        const timerId = setTimeout(() => {
          delete pendingRef.current[params.deviceId];
          reject(new Error("Device did not respond in time"));
        }, UPDATE_TIMEOUT_MS);
        pendingRef.current[params.deviceId] = { timerId, resolve, reject };
      } else {
        resolve();
      }
    });
  }, []);

  return { devices, connectionStatus, wsError, sendMessage };
}
