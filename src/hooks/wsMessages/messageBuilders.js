// Each builder returns the message object to send over the socket.

function buildUpdateValue({ deviceId, value }) {
  return {
    type: "update value",
    payload: { id: deviceId, value },
  };
}

// Just an example from what Niko sent
// function buildDeleteDevice({ id }) {
//   return { type: "delete device", payload: { id } };
// }

// once backend implements more actions, we can add more builders here like the handlers
export const BUILDERS = {
  "update value": buildUpdateValue,
  // "delete device": buildDeleteDevice, -> just an example of what it will look like
};
