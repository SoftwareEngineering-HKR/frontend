import Modal from "../common/Modal";
import Button from "../common/Button";
import RoleTag from "./RoleTag";
import {
  Lightbulb,
  Thermometer,
  Lock,
  Camera,
  Wind,
  Coffee,
  Fan,
  Speaker,
  Wifi,
  WifiOff,
} from "lucide-react";

const deviceIcons = {
  light: Lightbulb,
  thermostat: Thermometer,
  lock: Lock,
  camera: Camera,
  window: Wind,
  "coffee-machine": Coffee,
  fan: Fan,
  speaker: Speaker,
};

const deviceTypeLabels = {
  light: "Light",
  thermostat: "Thermostat",
  lock: "Lock",
  camera: "Camera",
  window: "Window",
  "coffee-machine": "Coffee Machine",
  fan: "Fan",
  speaker: "Speaker",
};

export default function UserModal({
  isOpen,
  onClose,
  user,
  availableDevices,
  currentUser,
  onUpgrade,
  onDowngrade,
  onDelete,
  onAssign,
  onUnassign,
}) {
  if (!user) return null;

  const isMe = user.id === currentUser?.id;
  const footer = (
    <div className="flex flex-wrap justify-end gap-3">
      {!isMe && user.role === "user" && (
        <Button
          text="Promote"
          variant="primary"
          onClick={() => onUpgrade(user)}
        />
      )}
      {!isMe && user.role === "admin" && (
        <Button
          text="Demote"
          variant="ghost"
          onClick={() => onDowngrade(user)}
        />
      )}
      {!isMe && (
        <Button
          text="Delete"
          variant="danger"
          onClick={() => onDelete(user)}
        />
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User details"
      footer={footer}
    >
      <div className="space-y-6 p-6">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
            <RoleTag role={user.role} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-3 py-2 border border-gray-200 dark:border-gray-700">
              <strong className="text-gray-900 dark:text-white">{user.devices?.length ?? 0}</strong>
              assigned device{(user.devices?.length || 0) === 1 ? "" : "s"}
            </span>
            {isMe && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-3 py-2 border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                This is you
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Assigned Devices
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.devices?.length ?? 0} total
            </p>
          </div>

          {user.devices?.length ? (
            <ul className="space-y-3">
              {user.devices.map((device) => {
                const Icon = deviceIcons[device.type] || Lightbulb;
                return (
                  <li
                    key={device.id}
                    onClick={() => onUnassign(device)}
                    className="group flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 cursor-pointer hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        device.isOnline
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {device.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {deviceTypeLabels[device.type] || device.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {device.isOnline ? (
                        <>
                          <Wifi className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-green-600 dark:text-green-400">Online</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-400">Offline</span>
                        </>
                      )}
                    </div>
                    <Button
                      text="Unassign"
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnassign(device);
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No devices assigned to this user.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Available Devices
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {availableDevices?.length ?? 0} available
            </p>
          </div>

          {availableDevices?.length ? (
            <ul className="space-y-3">
              {availableDevices.map((device) => {
                const Icon = deviceIcons[device.type] || Lightbulb;
                return (
                  <li
                    key={device.id}
                    onClick={() => onAssign(device)}
                    className="group flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        device.isOnline
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {device.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {deviceTypeLabels[device.type] || device.type}
                        {device.ownerName ? ` · ${device.ownerName}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {device.isOnline ? (
                        <>
                          <Wifi className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-green-600 dark:text-green-400">Online</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-400">Offline</span>
                        </>
                      )}
                    </div>
                    <Button
                      text="Assign"
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssign(device);
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No additional devices available to assign.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
