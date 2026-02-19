import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication.jsx";
import Overview from "./pages/Overview.jsx";
import { useState, useEffect } from "react";

const initialDevices = [
  {
    id: "1",
    name: "Living Room Light",
    type: "light",
    isOnline: true,
    room: "Living Room",
    actions: [{ id: "power", label: "Power", type: "toggle", value: true }],
  },
  {
    id: "2",
    name: "Bedroom Light",
    type: "light",
    isOnline: true,
    room: "Bedroom",
    actions: [{ id: "power", label: "Power", type: "toggle", value: false }],
  },
  {
    id: "3",
    name: "Main Thermostat",
    type: "thermostat",
    isOnline: true,
    room: "Living Room",
    actions: [{ id: "power", label: "Power", type: "toggle", value: true }],
  },
  {
    id: "4",
    name: "Front Door Lock",
    type: "lock",
    isOnline: false,
    room: "Entrance",
    actions: [
      { id: "lock", label: "Lock", type: "button" },
      { id: "unlock", label: "Unlock", type: "button" },
    ],
  },
  {
    id: "5",
    name: "Security Camera",
    type: "camera",
    isOnline: true,
    room: "Front Yard",
    actions: [
      { id: "power", label: "Power", type: "toggle", value: true },
      { id: "record", label: "Start Recording", type: "button" },
    ],
  },
  {
    id: "6",
    name: "Kitchen Window",
    type: "window",
    isOnline: true,
    room: "Kitchen",
    actions: [
      { id: "open", label: "Open", type: "button" },
      { id: "close", label: "Close", type: "button" },
    ],
  },
  {
    id: "7",
    name: "Coffee Maker",
    type: "coffee-machine",
    isOnline: true,
    room: "Kitchen",
    actions: [
      { id: "power", label: "Power", type: "toggle", value: false },
      { id: "brew", label: "Brew Coffee", type: "button" },
      { id: "clean", label: "Clean Cycle", type: "button" },
    ],
  },
  {
    id: "8",
    name: "Ceiling Fan",
    type: "fan",
    isOnline: false,
    room: "Bedroom",
    actions: [{ id: "power", label: "Power", type: "toggle", value: false }],
  },
  {
    id: "9",
    name: "Smart Speaker",
    type: "speaker",
    isOnline: true,
    room: "Living Room",
    actions: [{ id: "power", label: "Power", type: "toggle", value: true }],
  },
];

function App() {
  const [devices, setDevices] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Overview devices={devices} onLogout={handleLogout} />}
      />
    </Routes>
  );
}

export default App;
