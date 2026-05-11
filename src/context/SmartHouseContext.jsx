import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const SmartHouseContext = createContext(null);

export function SmartHouseProvider({ isLoggedIn, accessToken, children }) {
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const { send: rawSend, devices, connectionStatus, wsError } = useWebSocket(isLoggedIn, accessToken);

    useEffect(() => {
        if (connectionStatus !== "connected") return;

        const init = async () => {
            try {
                const users = await rawSend.getUsers();
                const rooms = await rawSend.getRooms();
                setUsers(users);
                setRooms(rooms);
            } catch (err) {
                console.error("Failed to fetch initial data:", err);
            }
        };

        init();
    }, [connectionStatus]);

  const refreshUsers = async () => {
    const users = await rawSend.getUsers();
    setUsers(users);
  };

  const refreshRooms = async () => {
    const rooms = await rawSend.getRooms();
    setRooms(rooms);
  };

  // this handles UI refreshes when something changes
  // need to add all device messages
  const send = {
    createRoom: (name)         => rawSend.createRoom(name).then(refreshRooms),
    deleteRoom: (id)           => rawSend.deleteRoom(id).then(refreshRooms),
    renameRoom: (id, name)     => rawSend.renameRoom(id, name).then(refreshRooms),
    deleteUser: (userName)     => rawSend.deleteUser(userName).then(refreshUsers),
    promote:    (userName)     => rawSend.promote(userName).then(refreshUsers),
    demote:     (userName)     => rawSend.demote(userName).then(refreshUsers),
  }

  return (
    <SmartHouseContext.Provider value={{ users, rooms, devices, send, connectionStatus, wsError }}>
      {children}
    </SmartHouseContext.Provider>
  );
}

export const useSmartHouse = () => useContext(SmartHouseContext);