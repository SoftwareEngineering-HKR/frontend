import { useEffect, useRef, useState, useCallback } from "react";
import { mapBackendDevice } from "./deviceMapping";
import { HANDLERS } from "./messageHandlers";

// const WS_URL = "ws://192.168.50.207:8080";
const WS_URL = "ws://localhost:8080";

// How long to wait for a device to confirm a state change before showing an error
const UPDATE_TIMEOUT_MS = 5000;

export function useWebSocket(isLoggedIn) {
  const [devices, setDevices] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // "disconnected" | "connecting" | "connected"
  const [wsError, setWsError] = useState(null);

  const wsRef = useRef(null);
  // Tracks in-flight update commands: deviceId -> { timerId, resolve, reject }
  // If the backend confirms the update with an "update value" message, we call resolve() and clear the timeout
  // If we get an "action response" error message or the timeout triggers, we call reject() and clear the pending command
  const pendingRef = useRef({});

  // When user logs in, it connects to WS; on logout, it disconnects
  //  -> need to change with proper login once that is implemented in the backend
  useEffect(() => {
    if (!isLoggedIn) {
      wsRef.current?.close();
      wsRef.current = null;
      setDevices([]);
      setConnectionStatus("disconnected");
      return;
    }

    setConnectionStatus("connecting");
    const ws = new WebSocket(WS_URL);
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
  }, [isLoggedIn]);

  // Sends a device update command and returns a promise that resolves/rejects based on the response
  // - resolves when the backend confirms the change with "update value"
  // - rejects if there's an error response or the device doesn't respond in time
  const sendDeviceUpdate = useCallback((deviceId, value) => {
    return new Promise((resolve, reject) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        reject(new Error("Not connected to server"));
        return;
      }

      wsRef.current.send(
        JSON.stringify({
          type: "update value",
          payload: { id: deviceId, value },
        }),
      );

      // If no "update value" comes back within the timeout, assume device failed
      const timerId = setTimeout(() => {
        delete pendingRef.current[deviceId];
        reject(new Error("Device did not respond in time"));
      }, UPDATE_TIMEOUT_MS);

      pendingRef.current[deviceId] = { timerId, resolve, reject };
    });
  }, []);

  return { devices, connectionStatus, wsError, sendDeviceUpdate };
}
