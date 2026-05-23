import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { ChevronDown, ChevronUp, Plus, Minus, Trash2 } from "lucide-react";

const isDeviceAssignedToUser = (device, user) => {
  if (!device || !user) return false;
  return (device.users ?? []).some(
    (assignedUser) => assignedUser.id === user.id,
  );
};

const getDeviceName = (device) => device.name || `${device.type} (${device.id})`;

const sortByDeviceName = (first, second) =>
  getDeviceName(first).localeCompare(getDeviceName(second));

const getOtherAssignedUsers = (device, user) => {
  const userId = String(user.id);
  const userName = user.username ?? user.name;

  return (device.users ?? [])
    .filter((assignedUser) => {
      const assignedUserId = assignedUser?.id ?? assignedUser?.userId;
      const assignedUserName = assignedUser?.username ?? assignedUser?.userName ?? assignedUser?.name;

      return (
        (assignedUserId == null || String(assignedUserId) !== userId) &&
        (userName == null || assignedUserName !== userName)
      );
    })
    .map((assignedUser) => assignedUser.username ?? assignedUser.userName ?? assignedUser.name)
    .filter(Boolean);
};

export default function UserModal({
  isOpen,
  onClose,
  user,
  devices = [],
  send,
  setToast,
  onUpgrade,
  onDowngrade,
  onDelete,
  currentUser,
}) {
  const [showDevices, setShowDevices] = useState(true);

  if (!user) return null;

  const accessDevices = [...devices].sort(sortByDeviceName);
  const assignedDevices = accessDevices.filter((device) =>
    isDeviceAssignedToUser(device, user),
  );
  const availableDevices = accessDevices.filter(
    (device) => !isDeviceAssignedToUser(device, user),
  );
  const assignedCount = assignedDevices.length;

  const isMe = user.id === currentUser?.id;

  const handleAssignDevice = async (user, device) => {
    try {
      await send.assignUserToDevice(user.id, device.id);
      setToast({ message: `"${device.name}" assigned to ${user.username}.` });
    } catch (err) {
      setToast({ message: err.message, isError: true });
    }
  };

  const handleUnassignDevice = async (user, device) => {
    try {
      await send.unassignUserFromDevice(user.id, device.id);
      setToast({ message: `"${device.name}" removed from ${user.username}.` });
    } catch (err) {
      setToast({ message: err.message, isError: true });
    }
  };

  const handleToggleDevice = (device) => {
    if (isDeviceAssignedToUser(device, user)) {
      handleUnassignDevice(user, device);
      return;
    }

    handleAssignDevice(user, device);
  };

  const renderDeviceRow = (device, isAssigned) => {
    const otherUsers = getOtherAssignedUsers(device, user);

    return (
      <div
        key={device.id}
        className={[
          "flex items-center justify-between gap-3 p-3 rounded-lg border",
          isAssigned
            ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800"
            : "bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600",
        ].join(" ")}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {getDeviceName(device)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {device.type} - {device.room ?? "Unassigned"}
          </p>
          {otherUsers.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Also assigned to {otherUsers.join(", ")}
            </p>
          )}
        </div>
        <Button
          variant={isAssigned ? "danger" : "primary"}
          icon={
            isAssigned ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )
          }
          onClick={() => handleToggleDevice(device)}
          title={isAssigned ? "Remove device access" : "Assign device access"}
          className="shrink-0"
        />
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${user.username}`}>
      <div className="px-6 py-4 space-y-6">
        {/* User Info */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">
                {user.username}
              </span>
            </p>
            {user.email && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Role: <span className="font-semibold capitalize">{user.type}</span>
            </p>
          </div>

          {/* Role Actions */}
          {!isMe && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {user.type === "user" && (
                  <Button
                    text="Promote to Admin"
                    variant="primary"
                    onClick={() => onUpgrade(user)}
                    className="flex-1"
                  />
                )}
                {user.type === "admin" && (
                  <Button
                    text="Demote to User"
                    variant="primary"
                    onClick={() => onDowngrade(user)}
                    className="flex-1"
                  />
                )}
              </div>
              <Button
                text="Delete User"
                variant="danger"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => onDelete(user)}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Device Assignment */}
        <div>
          <button
            onClick={() => setShowDevices((previous) => !previous)}
            className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {showDevices ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              Device Access ({assignedCount}/{accessDevices.length})
            </span>
          </button>

          {showDevices && (
            <div className="mt-2 space-y-4 ml-6">
              {accessDevices.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No devices available
                </p>
              ) : (
                <>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                      Assigned to {user.username} ({assignedDevices.length})
                    </p>
                    <div className="space-y-2">
                      {assignedDevices.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No devices assigned to this user
                        </p>
                      ) : (
                        assignedDevices.map((device) => renderDeviceRow(device, true))
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                      Available to assign ({availableDevices.length})
                    </p>
                    <div className="space-y-2">
                      {availableDevices.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          All devices are assigned to this user
                        </p>
                      ) : (
                        availableDevices.map((device) => renderDeviceRow(device, false))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
