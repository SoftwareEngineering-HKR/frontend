import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { ChevronDown, ChevronUp, Plus, Minus, Trash2 } from "lucide-react";

export default function UserModal({
  isOpen,
  onClose,
  user,
  devices = [],
  onAssign,
  onUnassign,
  onUpgrade,
  onDowngrade,
  onDelete,
  currentUser,
}) {
  const [expandedSections, setExpandedSections] = useState({
    assigned: true,
    available: true,
  });

  if (!user) return null;

  // Inline device filtering logic
  const assigned = devices.filter((device) => {
    const users = device.users ?? [];
    return users.some((u) => u.id === user.id);
  });

  const available = devices.filter((device) => {
    const users = device.users ?? [];
    return !users.some((u) => u.id === user.id);
  });

  const isMe = user.id === currentUser?.id;

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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

        {/* Assigned Devices */}
        <div>
          <button
            onClick={() => toggleSection("assigned")}
            className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {expandedSections.assigned ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              Assigned Devices ({assigned.length})
            </span>
          </button>

          {expandedSections.assigned && (
            <div className="mt-2 space-y-2 ml-6">
              {assigned.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No devices assigned
                </p>
              ) : (
                assigned.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {device.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {device.type}
                      </p>
                    </div>
                    <Button
                      variant="danger"
                      icon={<Minus className="w-4 h-4" />}
                      onClick={() => onUnassign(user, device)}
                      title="Remove device"
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Available Devices */}
        <div>
          <button
            onClick={() => toggleSection("available")}
            className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {expandedSections.available ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              Available Devices ({available.length})
            </span>
          </button>

          {expandedSections.available && (
            <div className="mt-2 space-y-2 ml-6">
              {available.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  All devices assigned
                </p>
              ) : (
                available.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {device.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {device.type}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      icon={<Plus className="w-4 h-4" />}
                      onClick={() => onAssign(user, device)}
                      title="Assign device"
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
