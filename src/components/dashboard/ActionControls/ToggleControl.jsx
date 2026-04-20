import React from "react";

// Toggle — on/off (light, buzz), open/closed (servo, door, window)
export default function ToggleControl({
  action,
  deviceId,
  isOnline,
  onAction,
}) {
  const isOn = action.value === 1 || action.value === true;

  const isOpenCloseType =
    ["servo", "door", "window"].includes(action.id?.toLowerCase()) ||
    ["servo", "door", "window"].includes(action.label?.toLowerCase());

  // Servo/Door/Window shows Open/Closed label instead of On/Off
  const onLabel = isOpenCloseType ? "Open" : "On";
  const offLabel = isOpenCloseType ? "Closed" : "Off";

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {action.label}
        </span>
        <span className="text-xs text-gray-400">
          {isOn ? onLabel : offLabel}
        </span>
      </div>
      <button
        onClick={() => onAction(deviceId, action.id, isOn ? 0 : 1)}
        disabled={!isOnline}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${!isOnline ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${isOn ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${isOn ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}
