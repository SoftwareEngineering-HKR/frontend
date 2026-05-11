import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const SmartHouseContext = createContext(null);

export function SmartHouseProvider({ isLoggedIn, accessToken, children }) {
    const {
      send: rawSend,
      devices,
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

  // this handles UI refreshes when something changes
  // backend logic may change so this may eventually be dropped
  // need to add all device messages
  const send = {
    createRoom: (name) => rawSend.createRoom(name).then(refreshRooms),
    deleteRoom: (id) => rawSend.deleteRoom(id).then(refreshRooms),
    renameRoom: (id, name) => rawSend.renameRoom(id, name).then(refreshRooms),
    deleteUser: (userName) => rawSend.deleteUser(userName).then(refreshUsers),
    promote: (userName) => rawSend.promote(userName).then(refreshUsers),
    demote: (userName) => rawSend.demote(userName).then(refreshUsers),
  }

  return (
    <SmartHouseContext.Provider value={{ users, rooms, devices, send, connectionStatus, wsError }}>
      {children}
    </SmartHouseContext.Provider>
  );
}

export const useSmartHouse = () => useContext(SmartHouseContext);