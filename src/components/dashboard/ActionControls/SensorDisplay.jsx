import React from "react";

// Sensor display —> only reads the value from backend, no user interaction
export default function SensorDisplay({ action }) {
  const { label, value, min, max } = action;

  const hasRange = min != null && max != null && max !== min;
  const percent = hasRange
    ? Math.round((((value ?? min) - min) / (max - min)) * 100)
    : null;

  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          {value ?? "—"}
          {max != null && max > 1 && (
            <span className="text-gray-400 font-normal"> / {max}</span>
          )}
        </span>
      </div>
      {hasRange && (
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
