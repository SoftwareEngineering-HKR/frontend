import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useAuth } from "./AuthContext";

const SmartHouseContext = createContext(null);

export function SmartHouseProvider({ children }) {
  const { isLoggedIn, accessToken } = useAuth();
  const {
    send,
    userDevices,
    devices,
    users,
    rooms,
    connectionStatus,
    wsError,
  } = useWebSocket(isLoggedIn, accessToken);

  useEffect(() => {
    if (connectionStatus !== "connected") return;

      const init = async () => {
          try {
              await send.getUsers();
              await send.getRooms();
              await send.getDevices();
          } catch (err) {
              console.error("Failed to fetch initial data:", err);
          }
      };

    init();
  }, [connectionStatus]);

  return (
    <SmartHouseContext.Provider
      value={
        {
          users,
          rooms,
          userDevices,
          devices,
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
