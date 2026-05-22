import { Bell } from "lucide-react";

export default function BuzzerControl({
  action,
  deviceId,
  isOnline,
  onAction,
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {action.label}
      </span>
      <button
        onClick={() => onAction(deviceId, 1)}
        disabled={!isOnline}
        className="
    flex items-center justify-center
      w-10 h-10 mr-4
      rounded-full
      bg-indigo-600 hover:bg-indigo-700
      text-white
      transition-all
      hover:scale-105
      active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed
      mr-2
  "
      >
        <Bell className="w-4 h-4" />
      </button>
    </div>
  );
}
