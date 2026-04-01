import { useEffect, useRef, useState, useCallback } from "react";
import { mapBackendDevice } from "./deviceMapping";

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

      switch (message.type) {
        // Backend sends this once on connect — the full device list for this user
        case "inital devices": {
          setDevices(message.payload.devices.map(mapBackendDevice));
          break;
        }

        // Backend sends this when a device actually changes state
        case "update value": {
          const { deviceID, content } = message.payload;

          // Resolve the pending promise for this device, if it exists
          const pending = pendingRef.current[deviceID];
          if (pending) {
            clearTimeout(pending.timerId);
            pending.resolve();
            delete pendingRef.current[deviceID];
          }

          // Update that device in state
          setDevices((prev) =>
            prev.map((d) =>
              d.id === deviceID
                ? {
                    ...d,
                    actions: d.actions.map((a) => {
                      if (a.type === "toggle")
                        return { ...a, value: content === 1 ? 1 : 0 };
                      if (a.type === "slider")
                        return { ...a, value: Number(content) };
                      if (a.type === "sensor")
                        return { ...a, value: Number(content) };
                      return a;
                    }),
                  }
                : d,
            ),
          );
          break;
        }

        // Backend sends this on 403/500 errors related to an action command
        case "action response": {
          const { message: errorMsg } = message.payload;
          Object.keys(pendingRef.current).forEach((deviceId) => {
            const p = pendingRef.current[deviceId];
            clearTimeout(p.timerId);
            p.reject(new Error(errorMsg));
            delete pendingRef.current[deviceId];
          });
          setWsError(errorMsg);
          break;
        }

        default:
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
