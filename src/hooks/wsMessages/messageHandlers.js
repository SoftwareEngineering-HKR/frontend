// For incoming WebSocket messages

import { mapBackendDevice } from "./deviceMapping";

const getUserDeviceSetter = ({ setUserDevices, setDevices }) =>
  setUserDevices ?? setDevices;

// Backend sends this once on connect — the full device list for this user
function handleInitialDevices(payload, context) {
  const setCurrentDevices = getUserDeviceSetter(context);

  setCurrentDevices(payload.devices.map(mapBackendDevice));
}

// Backend sends this when a device actually changes state
function handleUpdateValue(payload, context) {
  const { pendingRef } = context;
  const setCurrentDevices = getUserDeviceSetter(context);
  const { deviceID, content } = payload;

  const pending = pendingRef.current[deviceID];
  if (pending) {
    clearTimeout(pending.timerId);
    pending.resolve();
    delete pendingRef.current[deviceID];
  }

  setCurrentDevices((prev) =>
    prev.map((d) =>
      d.id === deviceID
        ? {
            ...d,
            actions: d.actions.map((a) => ({
              ...a,
              value: a.type === "display" ? content : Number(content),
            })),
          }
        : d,
    ),
  );
}

function handleDeviceOnlineState(payload, context) {
  const { setAllDevices } = context;
  const setCurrentDevices = getUserDeviceSetter(context);
  const { deviceID, content } = payload;

  setCurrentDevices((prev) =>
    prev.map((d) => (d.id === deviceID ? { ...d, isOnline: content } : d)),
  );

  setAllDevices?.((prev) =>
    prev.map((d) => (d.id === deviceID ? { ...d, isOnline: content } : d)),
  );
}

function handleAddedNewDevice(payload, context) {
  const setCurrentDevices = getUserDeviceSetter(context);
  const { content } = payload;
  const device = mapBackendDevice(content);

  setCurrentDevices((prev) => {
    const alreadyExists = prev.some((existingDevice) => existingDevice.id === device.id);

    if (alreadyExists) {
      return prev.map((existingDevice) =>
        existingDevice.id === device.id ? device : existingDevice,
      );
    }

    return [...prev, device];
  });
}

function handleRemovedDeviceFromUser(payload, context) {
  const setCurrentDevices = getUserDeviceSetter(context);
  const { deviceID } = payload;
  setCurrentDevices((prev) => prev.filter((device) => device.id !== deviceID));
}

function handleActionResponse(
  payload,
  { pendingRef, setWsError, actionResponseRef },
) {
  const { statusCode, message } = payload;
  const msg = message || "Action failed";

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

  const next = actionResponseRef.current.shift();
  if (!next) return;

  if (statusCode === 200) {
    next.resolve({ statusCode, message });
  } else {
    next.reject(new Error(msg));
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

export const HANDLERS = {
  "inital devices": handleInitialDevices,
  "update value": handleUpdateValue,
  "action response": handleActionResponse,
  users: handleUsers,
  rooms: handleRooms,
  "device info": handleDeviceInfo,
  "update device onlineState": handleDeviceOnlineState,
  "added new device": handleAddedNewDevice,
  "removed device from user": handleRemovedDeviceFromUser,
};
