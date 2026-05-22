// Each builder returns the message object to send over the socket.

// device builders
function buildUpdateValue({ deviceId, value }) {
  return {
    type: "update value",
    payload: { id: deviceId, value },
  };
}

function buildDeleteDevice({ id }) {
  return { type: "delete device", payload: { id } };
}

function buildDeleteDeviceFromDashboard({ deviceId }) {
  return {
    type: "delete yourself from device",
    payload: { deviceId },
  };
}

function buildGetAllDeviceInfo() {
  return {
    type: "get all device info"
  };
}

// user builders
function buildGetUsers() {
  return {
    type: "get users",
  };
}

function buildUpdateRole({ name, role }) {
  return {
    type: "update user role",
    payload: {
      userName: name,
      role: role,
    },
  };
}

function buildDeleteUser({ name }) {
  return {
    type: "delete user",
    payload: {
      userName: name,
    },
  };
}

// room builders
function buildGetRooms() {
  return {
    type: "get all rooms",
  };
}

function buildCreateRoom({ room }) {
  return {
    type: "create room",
    payload: {
      name: room,
    },
  };
}

function buildDeleteRoom({ id }) {
  return {
    type: "delete room",
    payload: {
      id: id,
    },
  };
}

function buildRenameRoom({ id, name }) {
  return {
    type: "update room",
    payload: {
      id: id,
      name: name,
    },
  };
}

// BUILDER pairs
// FORMAT | "message type": builderFunction
export const BUILDERS = {
  "update value": buildUpdateValue,
  "get users": buildGetUsers,
  "update user role": buildUpdateRole,
  "delete user": buildDeleteUser,
  "get all rooms": buildGetRooms,
  "create room": buildCreateRoom,
  "delete room": buildDeleteRoom,
  "update room": buildRenameRoom,
  "delete device": buildDeleteDevice,
  "delete yourself from device": buildDeleteDeviceFromDashboard,
  "get all device info": buildGetAllDeviceInfo,
};
