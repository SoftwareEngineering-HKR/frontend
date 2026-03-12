// Ideas for the devices:
// Can create component for each device type, and then have a generic DeviceCard that takes in the device data and renders the appropriate component based on the device type. Too have more customized controls for each device type.
// Or, have like a generic DeviceCard that just takes in the device data and renders the appropriate controls based on the actions array. And have toggles and buttons for the different action types. This is simpler and more flexible, but less customized for each device type. I think this is better for now, and we can always add more customization later if we want.

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
  Power,
  Trash2,
  Clock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// Can add more icons as needed, and maybe add a default icon for unknown device types
// We said to maybe have the icon coming from the backend, but this is okay for now
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

export default function DeviceCard(props) {
  const Icon = deviceIcons[props.device.type];

  return (
    <>
      {/* Green / Grey border for Online / Offline Device */}
      <div
        className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-200 overflow-hidden
        ${
          props.device.isOnline
            ? "border-green-200 dark:border-green-800 hover:shadow-xl"
            : "border-gray-300 dark:border-gray-700 opacity-75"
        }
      `}
      >
        {/* Card Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div
                className={`
                w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                ${
                  props.device.isOnline
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                }
              `}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {props.device.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {props.device.room}
                </p>
              </div>
            </div>
            {/* Remove button */}
            <button
              onClick={() => props.onRemove(props.device.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Remove device"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Online/Offline Part*/}
          <div className="flex items-center gap-2 mb-4">
            {props.device.isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Online
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">
                  Offline
                </span>
              </>
            )}
          </div>

          {/* Device Actions */}
          {/* This will be changed as specific actions are implemented based on the device type */}
          <div className="space-y-2">
            {props.device.actions.map((action) => (
              <div key={action.id}>
                {action.type === "toggle" ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {action.label}
                    </span>
                    <button
                      onClick={() =>
                        props.onAction(
                          props.device.id,
                          action.id,
                          !action.value,
                        )
                      }
                      disabled={!props.device.isOnline}
                      className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${!props.device.isOnline ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      ${
                        action.value
                          ? "bg-indigo-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }
                    `}
                    >
                      <span
                        className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${action.value ? "translate-x-6" : "translate-x-1"}
                      `}
                      />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => props.onAction(props.device.id, action.id)}
                    disabled={!props.device.isOnline}
                    className={`
                    w-full px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                    ${
                      !props.device.isOnline
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }
                  `}
                  >
                    <Power className="w-4 h-4" />
                    {action.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
