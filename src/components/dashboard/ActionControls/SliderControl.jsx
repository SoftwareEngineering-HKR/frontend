import React, { useState, useEffect } from "react";

export default function SliderControl({
  action,
  deviceId,
  isOnline,
  onAction,
}) {
  const min = action.min ?? 0;
  const max = action.max ?? 100;

  // Local state tracks the visual position while dragging
  // Only sends to backend on release
  const [localValue, setLocalValue] = useState(action.value ?? min);

  // Keep in sync if backend pushes a new value externally
  useEffect(() => {
    if (action.value != null) setLocalValue(action.value);
  }, [action.value]);

  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {action.label}
        </span>
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          {localValue} / {max}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={localValue}
        disabled={!isOnline}
        onChange={(e) => setLocalValue(Number(e.target.value))} // only updates UI
        onPointerUp={(e) =>
          onAction(deviceId, action.id, Number(e.target.value))
        } // sends to backend
        className={`
          w-full accent-indigo-600
          ${!isOnline ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
