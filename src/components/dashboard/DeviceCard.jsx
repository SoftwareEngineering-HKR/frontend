// Will probably puts the different control types in separate files later
import Schedule from "./Schedule";
import { useState, useEffect } from "react";
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
  Trash2,
  Flame,
  Droplets,
  Wind as Steam,
  DoorOpen,
  Volume2,
} from "lucide-react";

const deviceIcons = {
  light: Lightbulb,
  thermostat: Thermometer,
  lock: Lock,
  camera: Camera,
  fan: Fan,
  speaker: Speaker,
  gas: Flame,
  humidity: Droplets,
  steam: Steam,
  servo: DoorOpen,
  buzz: Volume2,
};

// Still havent tested if it works :)
// Sensor display —> only reads the value from backend, no user interaction
function SensorDisplay({ action }) {
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

// Toggle — on/off (light, buzz), open/closed (door for now)
function ToggleControl({ action, deviceId, isOnline, onAction }) {
  const isOn = action.value === 1 || action.value === true;

  // Servo (door) shows Open/Closed label instead of On/Off
  const onLabel =
    action.id === "servo" || action.label === "Door" ? "Open" : "On";
  const offLabel =
    action.id === "servo" || action.label === "Door" ? "Closed" : "Off";

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

// Still havent tested if it works :)
// Slider — for the fan speed
function SliderControl({ action, deviceId, isOnline, onAction }) {
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

export default function DeviceCard(props) {
  const { device } = props;
  const Icon = deviceIcons[device.type] ?? Wind; // just fallback icon, will probably change later

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-200 overflow-hidden
        ${
          device.isOnline
            ? "border-green-200 dark:border-green-800 hover:shadow-xl"
            : "border-gray-300 dark:border-gray-700 opacity-75"
        }
      `}
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div
              className={`
                w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                ${
                  device.isOnline
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                }
              `}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {device.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {device.room}
              </p>
            </div>
          </div>
          <button
            onClick={() => props.onRemove(device.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Remove device"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Online / Offline */}
        <div className="flex items-center gap-2 mb-4">
          {device.isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Online
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">Offline</span>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-2">
          {device.actions.map((action) => {
            if (action.type === "toggle") {
              return (
                <ToggleControl
                  key={action.id}
                  action={action}
                  deviceId={device.id}
                  isOnline={device.isOnline}
                  onAction={props.onAction}
                />
              );
            }
            if (action.type === "sensor") {
              return <SensorDisplay key={action.id} action={action} />;
            }
            if (action.type === "slider") {
              return (
                <SliderControl
                  key={action.id}
                  action={action}
                  deviceId={device.id}
                  isOnline={device.isOnline}
                  onAction={props.onAction}
                />
              );
            }
            return null;
          })}
        </div>
        {/* Scheduling */}
        <Schedule
          schedule={device.schedule}
          isOnline={device.isOnline}
          onChange={(newSchedule) =>
            props.onScheduleUpdate?.(device.id, newSchedule)
          }
        />
      </div>
    </div>
  );
}
