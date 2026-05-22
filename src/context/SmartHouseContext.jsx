import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useAuth } from "./AuthContext";

const SmartHouseContext = createContext(null);

export function SmartHouseProvider({ children }) {
  const { isLoggedIn, accessToken } = useAuth();
  const {
    send: rawSend,
    devices,
    allDevices,
    users,
    rooms,
    connectionStatus,
    wsError
  } = useWebSocket(isLoggedIn, accessToken);

  useEffect(() => {
      if (connectionStatus !== "connected") return;

      const init = async () => {
          try {
              await rawSend.getUsers();
              await rawSend.getRooms();
              await rawSend.getDevices();
          } catch (err) {
              console.error("Failed to fetch initial data:", err);
          }
      };

      init();
  }, [connectionStatus]);

  const refreshUsers = async () => {
    await rawSend.getUsers();
  };

  const refreshRooms = async () => {
    await rawSend.getRooms();
  };

  const refreshDevices = async () => {
    await rawSend.getDevices();
  };

  // this handles UI refreshes when something changes
  // backend logic may change so this may eventually be dropped
  // need to add all device messages
  const send = {
    deviceValueUpdate: (deviceId, value) => rawSend.deviceValueUpdate(deviceId, value),
    getDevices: () => rawSend.getDevices(),
    createRoom: (name) => rawSend.createRoom(name).then(refreshRooms),
    deleteRoom: (id) => rawSend.deleteRoom(id).then(refreshRooms),
    renameRoom: (id, name) => rawSend.renameRoom(id, name).then(refreshRooms),
    deleteUser: (userName) => rawSend.deleteUser(userName).then(refreshUsers),
    promote: (userName) => rawSend.promote(userName).then(refreshUsers),
    demote: (userName) => rawSend.demote(userName).then(refreshUsers),
    assignUserToDevice: (userId, deviceId) => rawSend.assignUserToDevice(userId, deviceId).then(refreshDevices),
    unassignUserFromDevice: (userId, deviceId) => rawSend.unassignUserFromDevice(userId, deviceId).then(refreshDevices),
  }

  return (
    <SmartHouseContext.Provider
      value={
        {
          users,
          rooms,
          devices,
          allDevices,
          send,
          connectionStatus,
          wsError
        }
      }>
      {children}
    </SmartHouseContext.Provider>
  );
}

export const useSmartHouse = () => useContext(SmartHouseContext);
