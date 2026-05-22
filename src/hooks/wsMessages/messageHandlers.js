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
              return {...a, value: Number(content)};
            }),
          }
        : d,
    ),
  );
}

function handleDeviceOnlineState(payload, { setDevices }) {
  const { deviceID, content } = payload;
  setDevices((prev) =>
    prev.map((d) => (d.id === deviceID ? { ...d, isOnline: content } : d)),
  );
}

function handleAddedNewDevice(payload, { setDevices }) {
  const { content } = payload;
  const device = mapBackendDevice(content);

  setDevices((prev) => {
    const alreadyExists = prev.some((existingDevice) => existingDevice.id === device.id);

    if (alreadyExists) {
      return prev.map((existingDevice) =>
        existingDevice.id === device.id ? device : existingDevice,
      );
    }

    return [...prev, device];
  });
}

function handleRemovedDeviceFromUser(payload, { setDevices }) {
  const { deviceID } = payload;
  setDevices((prev) => prev.filter((device) => device.id !== deviceID));
}

function handleActionResponse(payload, { pendingRef, setWsError, actionResponseRef }) {
  const { statusCode, message } = payload;
  const msg = message || "Action failed";
  
  // for when the "action response" is about a device error
  const devicePendings = Object.keys(pendingRef.current);
  if (devicePendings.length > 0) {
    devicePendings.forEach((deviceId) => {
      const p = pendingRef.current[deviceId];
      clearTimeout(p.timerId);
      p.reject(new Error(msg));
      delete pendingRef.current[deviceId];
    });
    setWsError(msg);
    return;
  }
  
  // for all normal "action response" cases
  const next = actionResponseRef.current.shift();
  if (!next) return;

  if (statusCode === 200) {
    next.resolve({ statusCode, message });
  } else {
    next.reject(new Error(message));
  }
}

function handleUsers(payload, { setUsers, actionResponseRef }) {
  setUsers(payload.users);
  const next = actionResponseRef.current.shift();
  next?.resolve(payload.users);
}

function handleRooms(payload, { setRooms, actionResponseRef }) {
  setRooms(payload.rooms);
  const next = actionResponseRef.current.shift();
  next?.resolve(payload.rooms);
}

function handleDeviceInfo(payload, { setAllDevices, actionResponseRef }) {
  setAllDevices(payload.devices.map(mapBackendDevice));
  const next = actionResponseRef.current.shift();
  next?.resolve(payload.devices);
}
// To map incoming message type strings to handler functions
export const HANDLERS = {
  "inital devices": handleInitialDevices,
  "update value": handleUpdateValue,
  "action response": handleActionResponse,
  "users": handleUsers,
  "rooms": handleRooms,
  "device info": handleDeviceInfo,
  "update device onlineState": handleDeviceOnlineState,
  "added new device": handleAddedNewDevice,
  "removed device from user": handleRemovedDeviceFromUser,
};
