// For incoming WebSocket messages

import { mapBackendDevice } from "./deviceMapping";

// Backend sends this once on connect — the full device list for this user (i think its harcoded on their side for now)
function handleInitialDevices(payload, { setDevices }) {
  setDevices(payload.devices.map(mapBackendDevice));
}

// Backend sends this when a device actually changes state
function handleUpdateValue(payload, { setDevices, pendingRef }) {
  const { deviceID, content } = payload;

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
              if (a.type === "slider") return { ...a, value: Number(content) };
              if (a.type === "sensor") return { ...a, value: Number(content) };
              return a;
            }),
          }
        : d,
    ),
  );
}

// Backend sends this on 403/500 errors related to an action command
function handleActionResponse(payload, { pendingRef, setWsError }) {
  const { message: errorMsg } = payload;
  Object.keys(pendingRef.current).forEach((deviceId) => {
    const p = pendingRef.current[deviceId];
    clearTimeout(p.timerId);
    p.reject(new Error(errorMsg));
    delete pendingRef.current[deviceId];
  });
  setWsError(errorMsg);
}

// To map incoming message type strings to handler functions
export const HANDLERS = {
  "inital devices": handleInitialDevices,
  "update value": handleUpdateValue,
  "action response": handleActionResponse,
};
