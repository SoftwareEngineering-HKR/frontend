import { useState, useRef, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  ChevronDown,
  Trash2,
  UserPlus,
  UserMinus,
  Pencil,
  Check,
  X,
} from "lucide-react";
import Button from "../common/Button";

// maybe replace with react-collapse package
function Collapse({ open, children }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    if (open) {
      setHeight(ref.current.scrollHeight);
    } else {
      setHeight(ref.current.scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  // recalculate height whenever children change
  useEffect(() => {
    if (open && ref.current) setHeight(ref.current.scrollHeight);
  });

  return (
    <div
      style={{
        maxHeight: open ? height : 0,
        overflow: "hidden",
        transition: "max-height 280ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

// user chip
function UserChip({ user, onRemove }) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg group">
      {/* avatar placeholder */}
      <div className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center flex-shrink-0">
        <span className="text-[9px] font-bold text-indigo-700 dark:text-indigo-300 uppercase leading-none">
          {user.username?.[0] ?? "?"}
        </span>
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate max-w-[80px]">
        {user.username}
      </span>
      <button
        onClick={() => onRemove(user)}
        className="ml-auto p-0.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        title={`Remove ${user.username}`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// dropdown to choose room
function RoomEditor({ currentRoom, rooms, onSave, onCancel }) {
  const [value, setValue] = useState(currentRoom);

  return (
    <div className="flex items-center gap-2 mt-1">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="null">
        </option>
        {rooms.map((r) => (
          <option key={r.id} value={r.name}>
            {r.name}
          </option>
        ))}
      </select>
      <Button
        onClick={async () => await onSave(value)}
        icon={<Check className="w-3.5 h-3.5" />}
      />
      <button
        onClick={onCancel}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
        title="Cancel"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

import { deviceIcons } from "../dashboard/deviceIcons";
import { useSmartHouse } from "../../context/SmartHouseContext";

// main thing
export default function DevicePlate({
  device,
  onDelete,
  onChangeRoom,
  onRename,
  users,
  rooms
  //onAssignUser,
  //onUnassignUser,
}) {
  //const { users, rooms } = useSmartHouse();
  const [expanded, setExpanded] = useState(false);
  const [editingRoom, setEditingRoom] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(device.name);
  const [addingUser, setAddingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const Icon = deviceIcons[device.type] ?? HelpCircle;

  const unassignedUsers = users.filter(
    (u) => !device.users?.some((a) => a.id === u.id)
  );

  // const handleAddUser = () => {
  //   const user = users.find((u) => u.id === selectedUser || u.username === selectedUser);
  //   if (!user) return;
  //   onAssignUser?.(device.id, user);
  //   setSelectedUser("");
  //   setAddingUser(false);
  // };

  const handleSaveRoom = async (newRoomName) => {
    const room = rooms.find((r) => r.name === newRoomName);
    await onChangeRoom(device, room);
    setEditingRoom(false);
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-200 overflow-hidden
        ${
          expanded
            ? "border-indigo-300 dark:border-indigo-700 shadow-md"
            : "border-gray-200 dark:border-gray-700 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
        }
        ${!device.isOnline ? "opacity-70" : ""}
      `}
    >
      {/* collapsed header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left group"
      >
        {/* icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            device.isOnline
              ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
              : "bg-gray-100 dark:bg-gray-700 text-gray-400"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* name + buttons */}
        <div className="flex-1 min-w-0">
          { editingName ? (
            <div className="flex items-center gap-1 mt-0.5" onClick={(e) => e.stopPropagation()}>
              <input
                autoFocus
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-indigo-400 outline-none w-full"
              />
              <button onClick={() => { onRename(device, nameValue); setEditingName(false); }}>
                <Check className="w-3.5 h-3.5 text-indigo-500" />
              </button>
              <button onClick={() => { setNameValue(device.name); setEditingName(false); }}>
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
            ) : (
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate leading-tight">
                {device.name}
                <button onClick={(e) => { e.stopPropagation(); setEditingName(true); }}
                  className="ml-1.5 inline opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="w-3 h-3 text-gray-400 inline" />
                </button>
              </p>
            )}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {device.type}
            </span>
            <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {device.room}
            </span>
          </div>
        </div>

        {/* right badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* online indicator */}
          <div className="flex items-center gap-1">
            {device.isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-gray-400" />
            )}
          </div>

          {/* user count badge */}
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              device.users?.length > 0
                ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                : "bg-gray-100 dark:bg-gray-700 text-gray-400"
            }`}
          >
            {device.users?.length} user{device.users?.length !== 1 ? "s" : ""}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-250 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* expanded body */}
      <Collapse open={expanded}>
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">

          {/* room section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Room
              </span>
              {!editingRoom && (
                <button
                  onClick={() => setEditingRoom(true)}
                  className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              )}
            </div>
            {editingRoom ? (
              <RoomEditor
                currentRoom={device.room} // this is just a string, not an id
                rooms={rooms}
                onSave={handleSaveRoom}
                onCancel={() => setEditingRoom(false)}
              />
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                {device.room}
              </p>
            )}
          </div>

          {/* assigned users section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Assigned Users
              </span>
              {/* {!addingUser && unassignedUsers.length > 0 && (
                <button
                  onClick={() => {
                    setAddingUser(true);
                    setSelectedUser(unassignedUsers[0]?.username ?? "");
                  }}
                  className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  <UserPlus className="w-3 h-3" />
                  Add
                </button>
              )} */}
            </div>

            {/* user chips */}
            <div className="flex flex-wrap gap-2">
              {device.users?.length === 0 && !addingUser ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                  No users assigned
                </p>
              ) : (
                device.users?.map((user) => (
                  <UserChip
                    key={user.id}
                    user={user}
                    onRemove={(u) => onUnassignUser?.(device.id, u)}
                  />
                ))
              )}
            </div>

            {/* add user inline */}
            {/* {addingUser && (
              <div className="flex items-center gap-2 mt-2">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {unassignedUsers.map((u) => (
                    <option key={u.id} value={u.username}>
                      {u.username}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddUser}
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  title="Assign"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setAddingUser(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )} */}
          </div>

          {/* danger zone */}
          <div className="pt-1 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={ () => onDelete(device.id)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Device
            </button>
          </div>
        </div>
      </Collapse>
    </div>
  );
}