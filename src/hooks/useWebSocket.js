import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL = "ws://localhost:8080";

// How long to wait for a device to confirm a state change before showing an error
const UPDATE_TIMEOUT_MS = 5000;

const TOGGLE_TYPES = ["light", "buzz", "servo"]; // servo is both door and window, so not sure how to deal with that yet, but it does have a toggle action :)️
const SENSOR_TYPES = ["gas", "steam", "humidity"];
const SLIDER_TYPES = ["fan"];

// Map backend device format to our components
function mapBackendDevice(d) {
  // max_value/min_value can arrive as strings from the backend
  const maxValue = d.max_value != null ? Number(d.max_value) : null;
  const minValue = d.min_value != null ? Number(d.min_value) : null;
  const currentValue = d.value != null ? Number(d.value) : null;

  let actionType;
  if (TOGGLE_TYPES.includes(d.type)) actionType = "toggle";
  else if (SENSOR_TYPES.includes(d.type)) actionType = "sensor";
  else if (SLIDER_TYPES.includes(d.type)) actionType = "slider";
  else actionType = "unknown";

  const action = {
    id: "main",
    type: actionType,
    value: currentValue,
    min: minValue,
    max: maxValue,
  };

  // Label varies by device type
  const labels = {
    light: "Power",
    buzz: "Buzzer",
    servo: "Door", // door for now :)))
    gas: "Gas Level",
    steam: "Steam Level",
    humidity: "Humidity",
    fan: "Fan Speed",
  };
  action.label = labels[d.type] ?? d.type;

  return {
    id: d.id,
    name: d.name ?? d.id,
    type: d.type,
    isOnline: d.online,
    room: d.room ?? "Unassigned",
    actions: [action],
  };
}

export function useWebSocket(isLoggedIn) {
  const [devices, setDevices] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // "disconnected" | "connecting" | "connected"
  const [wsError, setWsError] = useState(null);

  const wsRef = useRef(null);
  // Tracks in-flight update commands: deviceId -> { timerId, resolve, reject }
  const pendingRef = useRef({});

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

        // Backend sends this when a device actually changes state (confirmation of success)
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
                      return a; // for sensors, as we only read values from them
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

      // If no "update value" comes back within the timeout, assume the device failed
      const timerId = setTimeout(() => {
        delete pendingRef.current[deviceId];
        reject(new Error("Device did not respond in time"));
      }, UPDATE_TIMEOUT_MS);

      pendingRef.current[deviceId] = { timerId, resolve, reject };
    });
  }, []);

  return { devices, connectionStatus, wsError, sendDeviceUpdate };
}
