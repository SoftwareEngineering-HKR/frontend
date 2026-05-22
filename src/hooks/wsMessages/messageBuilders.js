// Each builder returns the message object to send over the socket.

// device builders
function buildUpdateValue({ deviceId, value }) {
  return {
    type: "update value",
    payload: { id: deviceId, value },
  };
}

function buildDeleteDevice({ id }) {
  return {
    type: "delete device",
    payload: {
      id
    }
  };
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

function buildUpdateDeviceRoom({ deviceId, roomId }) {
  return {
    type: "update device room",
    payload: 
      {
        deviceId,
        roomId,
      }
  };
}

function buildRenameDevice({ id, name, description=null }) {
  return {
    type: "update device",
    payload: 
      {
        id,
        name,
        description,
      }
  };
}

function buildGetDevices() {
  return {
    type: "get all device info",
    payload: {}
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
    payload: 
      {
        userName: name,
        role,
      }
  }
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
    payload: 
      {
        id
      }
  }
}

function buildRenameRoom({ id, name }) {
  return {
    type: "update room",
    payload:
      {
        id,
        name,
      }
  }
}

function buildAddUserToDevice({ userId, deviceId }) {
  return {
    type: "add user to device",
    payload: {
      userId,
      deviceId,
    }
  }
}

function buildDeleteUserFromDevice({ userId, deviceId }) {
  return {
    type: "delete user from device",
    payload: {
      deviceId,
      userId,
    }
  }
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
  "add user to device": buildAddUserToDevice,
  "delete user from device": buildDeleteUserFromDevice,
  "delete yourself from device": buildDeleteDeviceFromDashboard,
  "get all device info": buildGetAllDeviceInfo,
  "update device room": buildUpdateDeviceRoom,
  "update device": buildRenameDevice,
};
