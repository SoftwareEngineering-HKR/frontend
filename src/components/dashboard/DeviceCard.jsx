import { deviceIcons } from "./deviceIcons";
import ToggleControl from "./ActionControls/ToggleControl";
import SliderControl from "./ActionControls/SliderControl";
import SensorDisplay from "./ActionControls/SensorDisplay";
import Schedule from "./Schedule";
import { useState, useEffect } from "react";
import { Wifi, WifiOff, Trash2, Calculator } from "lucide-react";

export default function DeviceCard(props) {
  const { device } = props;
  const Icon = deviceIcons[device.type] ?? Calculator; // just fallback icon

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
            if (action.type === "toggle")
              return (
                <ToggleControl
                  key={action.id}
                  action={action}
                  deviceId={device.id}
                  isOnline={device.isOnline}
                  onAction={props.onAction}
                />
              );
            if (action.type === "sensor")
              return <SensorDisplay key={action.id} action={action} />;
            if (action.type === "slider")
              return (
                <SliderControl
                  key={action.id}
                  action={action}
                  deviceId={device.id}
                  isOnline={device.isOnline}
                  onAction={props.onAction}
                />
              );
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
