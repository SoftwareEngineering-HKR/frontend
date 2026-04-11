// Binary sensor only has 0 or 1 value (used for buttons, motion, and so on)
function BinarySensorDisplay({ label, value, detectedText, clearText }) {
  const isActive = value === 1;
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <span
        className={`
          text-sm font-semibold px-2 py-0.5 rounded-full
          ${
            isActive
              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
              : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
          }
        `}
      >
        {value == null ? "—" : isActive ? detectedText : clearText}
      </span>
    </div>
  );
}

// Range sensor (for gas, steam, humidity, and so on)
function RangeSensorDisplay({ label, value, min, max }) {
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

// 1 means active, 0 means inactive
const BINARY_LABELS = {
  photo: { detected: "Detected", clear: "Clear" },
  button: { detected: "Pressed", clear: "Released" },
};

const BINARY_FALLBACK = { detected: "Active", clear: "Inactive" };

export default function SensorDisplay({ action, deviceType }) {
  const { label, value, min, max, variant } = action;

  if (variant === "binary") {
    const { detected, clear } = BINARY_LABELS[deviceType] ?? BINARY_FALLBACK;
    return (
      <BinarySensorDisplay
        label={label}
        value={value}
        detectedText={detected}
        clearText={clear}
      />
    );
  }

  return <RangeSensorDisplay label={label} value={value} min={min} max={max} />;
}
