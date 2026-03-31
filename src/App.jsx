import { Routes, Route, Navigate } from "react-router-dom";
import Authentication from "./pages/Authentication.jsx";
import Overview from "./pages/Overview.jsx";
import { useState } from "react";
import ConfirmDialog from "./components/common/ConfirmDialog.jsx";
import Toast from "./components/common/Toast.jsx";
import { useWebSocket } from "./hooks/useWebSocket.js";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  // For the confirmation dialog when removing a device
  // This should also be okay for confirming for example to delete users from the admin page
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [actionError, setActionError] = useState(null); // for WS action errors
  // Connects when logged in, disconnects on logout -> need to change with proper login/logout/token stuff
  const { devices, connectionStatus, wsError, sendDeviceUpdate } =
    useWebSocket(!!currentUser);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Need to fix the value part later for different action types
  const handleDeviceAction = async (deviceId, actionId, value) => {
    if (!currentUser) return;

    const numericValue = typeof value === "boolean" ? (value ? 1 : 0) : value;

    try {
      await sendDeviceUpdate(deviceId, numericValue);
    } catch (error) {
      setActionError(error.message);
    }
  };

  // Will be removed later
  /*
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
  }; */

  // Temporary to not break everything when removing devices - will fix when backend is fully implemented
  const handleRemoveDevice = (deviceId) => {
    openConfirm({
      title: "Remove Device",
      message: "Removing devices is not yet supported.",
      onConfirm: closeConfirm,
    });
  };

  // Temporary to not break everything when removing devices - will fix when backend is fully implemented
  const handleAddDevice = (newDevice) => {
    console.log("Add device not yet supported by backend", newDevice);
  };

  // Temporary to not break everything when removing devices - will fix when backend is fully implemented
  const handleScheduleUpdate = (deviceId, schedule) => {
    console.log(
      "Schedule update not yet supported by backend",
      deviceId,
      schedule,
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
                devices={devices}
                connectionStatus={connectionStatus}
                onLogout={handleLogout}
                onDeviceAction={handleDeviceAction}
                onRemoveDevice={handleRemoveDevice}
                onAddDevice={handleAddDevice}
                onScheduleUpdate={handleScheduleUpdate}
                isAdmin={false} // Will need to be implemented properly when backend is ready
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

      {/* Shows WebSocket errors like idk device timeout, access denied, and so on? */}
      {(actionError || wsError) && (
        <Toast
          message={actionError ?? wsError}
          onDismiss={() => {
            setActionError(null);
          }}
        />
      )}
    </>
  );
}

export default App;
