import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication.jsx";
import Overview from "./pages/Overview.jsx";
import { useState, useEffect } from "react";
import ConfirmDialog from "./components/common/ConfirmDialog.jsx";

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
  const [devices, setDevices] = useState(initialDevices);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // For the confirmation dialog when removing a device
  // This should also be okay for confirming for example to delete users from the admin page
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleDeviceAction = (deviceId, actionId, value) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) => {
        if (device.id === deviceId) {
          return {
            ...device,
            actions: device.actions.map((action) =>
              action.id === actionId && action.type === "toggle"
                ? { ...action, value }
                : action,
            ),
          };
        }
        return device;
      }),
    );
  };

  const handleRemoveDevice = (deviceId) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;

    setConfirmDialog({
      isOpen: true,
      title: "Remove Device",
      message: `Are you sure you want to remove "${device.name}"?`,
      onConfirm: () => {
        (setDevices((prevDevices) =>
          prevDevices.filter((device) => device.id !== deviceId),
        ),
          setConfirmDialog({ ...confirmDialog, isOpen: false }));
      },
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Overview
              devices={devices}
              onLogout={handleLogout}
              onDeviceAction={handleDeviceAction}
              onRemoveDevice={handleRemoveDevice}
            />
          }
        />
      </Routes>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
      />
    </>
  );
}

export default App;
