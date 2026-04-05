// some more mock devices for the discovery thing to show as list
// will later replace with web socket shenanigans

export const allSystemDevices = [
  {
    id: "sys-1",
    name: "Garage Door",
    type: "lock",
    isOnline: true,
    connected: false,
    room: "",
    actions: [
      { id: "lock", label: "Lock", type: "button" },
      { id: "unlock", label: "Unlock", type: "button" },
    ],
  },
  {
    id: "sys-2",
    name: "Backyard Sprinkler",
    type: "window",
    isOnline: true,
    connected: false,
    room: "",
    actions: [
      { id: "open", label: "Open", type: "button" },
      { id: "close", label: "Close", type: "button" },
    ],
  },
  {
    id: "sys-3",
    name: "Hallway Light",
    type: "light",
    isOnline: true,
    connected: false,
    room: "",
    actions: [{ id: "power", label: "Power", type: "toggle", value: false }],
  },
  {
    id: "sys-4",
    name: "Office Speaker",
    type: "speaker",
    isOnline: true,
    connected: false,
    room: "",
    actions: [{ id: "power", label: "Power", type: "toggle", value: false }],
  },
  {
    id: "sys-5",
    name: "Patio Camera",
    type: "camera",
    isOnline: true,
    connected: false,
    room: "",
    actions: [
      { id: "power", label: "Power", type: "toggle", value: false },
      { id: "record", label: "Start Recording", type: "button" },
    ],
  },
];