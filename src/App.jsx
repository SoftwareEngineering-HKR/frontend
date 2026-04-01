import { Routes, Route, Navigate } from "react-router-dom";
import Authentication from "./pages/Authentication.jsx";
import Overview from "./pages/Overview.jsx";
import { useState } from "react";
import ConfirmDialog from "./components/common/ConfirmDialog.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

// Mock initial devices
const initialDevices = [
  {
    id: "1",
    name: "Living Room Light",
    type: "light",
    isOnline: true,
    room: "Living Room",
    schedule: {
      enabled: true,
      days: ["monday", "wednesday", "friday"],
      startTime: "16:00",
      endTime: "22:00",
    },
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

// Mock some users
const initialUsers = [
  {
    id: "user-1",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    devices: initialDevices.slice(0, 5),
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    devices: initialDevices.slice(5),
  },
  {
    id: "admin-1",
    name: "Admin",
    email: "admin@example.com",
    role: "admin",
    devices: initialDevices.slice(5),
  },
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  // This will probably match with the backend for later
  // const currentUserData = users.find((u) => u.id === currentUser?.id);
  const currentUserData = users.find((u) => u.email === currentUser?.email);
  // For the confirmation dialog when removing a device
  // This should also be okay for confirming for example to delete users from the admin page
  const [confirmDialog, setConfirmDialog] = useState(null);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleDeviceAction = (deviceId, actionId, value) => {
    if (!currentUser) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        // Using email for now, later use id when backend is implemented
        if (user.email === currentUser.email) {
          return {
            ...user,
            devices: user.devices.map((device) => {
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
          };
        }
        return user;
      }),
    );
  };

  const handleRemoveDevice = (deviceId) => {
    if (!currentUser) return;

    const device = currentUserData?.devices.find((d) => d.id === deviceId);

    if (!device) return;

    openConfirm({
      title: "Remove Device",
      message: `Are you sure you want to remove "${device.name}"?`,

      onConfirm: () => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            // Using email for now, later use id when backend is implemented
            if (user.email === currentUser.email) {
              return {
                ...user,
                devices: user.devices.filter(
                  (device) => device.id !== deviceId,
                ),
              };
            }
            return user;
          }),
        );
        closeConfirm();
      },
    });
  };

  // temp handler to add device only to admins
  // will be replaced with some proper API call
  const handleAddDevice = (newDevice) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.role === "admin") {
          return {
            ...user,
            devices: [...user.devices, newDevice],
          };
        }
        return user;
      }),
    );
  };

  const handleScheduleUpdate = (deviceId, schedule) => {
    if (!currentUser) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        // Using email for now, later use id when backend is implemented
        if (user.email === currentUser.email) {
          return {
            ...user,
            devices: user.devices.map((device) =>
              device.id === deviceId ? { ...device, schedule } : device,
            ),
          };
        }
        return user;
      }),
    );
  };

  const openConfirm = ({ title, message, onConfirm }) => {
    setConfirmDialog({
      title,
      message,
      onConfirm,
    });
  };

  const closeConfirm = () => {
    setConfirmDialog(null);
  };

  return (
    <>
      <Routes>
        {/* Authentication Route */}
        <Route
          path="/authentication"
          element={
            currentUser ? (
              <Navigate to="/overview" />
            ) : (
              <Authentication onAuthSuccess={setCurrentUser} />
            )
          }
        />

        {/* Overview Route */}
        <Route
          path="/overview"
          element={
            currentUser ? (
              <Overview
                devices={currentUserData?.devices || []}
                onLogout={handleLogout}
                onDeviceAction={handleDeviceAction}
                onRemoveDevice={handleRemoveDevice}
                onAddDevice={handleAddDevice}
                onScheduleUpdate={handleScheduleUpdate}
                isAdmin={currentUserData?.role === "admin"}
              />
            ) : (
              <Navigate to="/authentication" />
            )
          }
        />

        <Route
          path="/admin"
          element={
            currentUser && currentUserData.role === "admin" ? (
              <AdminPanel
                users={users}
                currentUser={currentUserData}
                onUsersChange={setUsers}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/authentication" />
            )
          }
        />

        {/* Redirect to authentication if user types an not used path*/}
        <Route path="*" element={<Navigate to="/authentication" />} />
      </Routes>

      <ConfirmDialog
        isOpen={!!confirmDialog}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        onConfirm={confirmDialog?.onConfirm}
        onCancel={closeConfirm}
      />
    </>
  );
}

export default App;
