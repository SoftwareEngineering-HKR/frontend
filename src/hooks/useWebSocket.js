import { useEffect, useRef, useState, useCallback } from "react";
import { HANDLERS } from "./wsMessages/messageHandlers";
import { BUILDERS } from "./wsMessages/messageBuilders";

// const WS_URL = "ws://192.168.50.207:8080";
const WS_BASE_URL = "ws://localhost:8080";

// How long to wait for a device to confirm a state change before showing an error
const UPDATE_TIMEOUT_MS = 5000;

export function useWebSocket(isLoggedIn, accessToken) {
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // "disconnected" | "connecting" | "connected"
  const [wsError, setWsError] = useState(null);

  // references
  const wsRef = useRef(null);
  const pendingRef = useRef({});
  const actionResponseRef = useRef([]);

  // context to pass to all handlers
  const handlerContext = {
    setDevices,
    setUsers,
    setRooms,
    setWsError,
    pendingRef,
    actionResponseRef,
  };

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
        handler(message.payload, handlerContext);
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

  // only for device value updates
  function sendDeviceValueUpdate(deviceId, value) {
    return new Promise((resolve, reject) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        reject(new Error("Not connected to server"));
        return;
      }

      const timerId = setTimeout(() => {
        delete pendingRef.current[deviceId];
        reject(new Error("Device did not respond in time"));
      }, UPDATE_TIMEOUT_MS);

      pendingRef.current[deviceId] = { timerId, resolve, reject };
      const messageToSend = JSON.stringify(
        BUILDERS["update value"]({ deviceId, value }),
      );
      wsRef.current.send(messageToSend);
    });
  }

  // for all other types of messages that get an "action response" reply
  async function sendMessage(type, params) {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      throw new Error("Not connected to server");
    }

    const builder = BUILDERS[type];
    if (!builder) throw new Error(`No builder for "${type}"`);

    return new Promise((resolve, reject) => {
      actionResponseRef.current.push({ resolve, reject });
      wsRef.current.send(JSON.stringify(builder(params)));
    });
  }

  // To handle device removal in the UI after sending the delete command
  const removeDevice = useCallback((deviceId) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
  }, []);

  const send = {
    deviceValueUpdate: (deviceId, value) =>
      sendDeviceValueUpdate(deviceId, value),
    getUsers: () => sendMessage("get users"),
    promote: (name) => sendMessage("update user role", { name, role: "admin" }),
    demote: (name) => sendMessage("update user role", { name, role: "user" }),
    deleteUser: (name) => sendMessage("delete user", { name }),
    getRooms: () => sendMessage("get all rooms"),
    createRoom: (room) => sendMessage("create room", { room }),
    deleteRoom: (id) => sendMessage("delete room", { id }),
    renameRoom: (id, name) => sendMessage("update room", { id, name }),
    deleteDevice: (id) => {
      sendMessage("delete device", { id });
      removeDevice(id); // To update the UI, since backend doesn't send an update after deleting
    },
    removeFromDashboard: async (id) => {
      await sendMessage("delete yourself from device", { deviceId: id });
      removeDevice(id);
    },
  };

  return {
    send,
    devices,
    users,
    rooms,
    connectionStatus,
    wsError,
  };
}
