const TOGGLE_TYPES = ["light", "buzz", "servo"]; // servo is both door and window, so not sure how to deal with that yet, but it does have a toggle action :)️
const SENSOR_TYPES = ["gas", "steam", "humidity", "motion", "button"]; // button sends if it is pressed or not
const SLIDER_TYPES = ["fan"];

// Labels we use by device type
const DEVICE_LABELS = {
  light: "Power",
  buzz: "Buzzer",
  servo: "Servo",
  gas: "Gas Level",
  steam: "Steam Level",
  humidity: "Humidity",
  motion: "Motion",
  button: "Button",
  fan: "Fan Speed",
};

// Map backend device format to our components
export function mapBackendDevice(d) {
  // max_value/min_value can arrive as strings from the backend
  const maxValue = d.max_value != null ? Number(d.max_value) : null;
  const minValue = d.min_value != null ? Number(d.min_value) : null;
  const currentValue = d.value != null ? Number(d.value) : null;

  let actionType;
  if (TOGGLE_TYPES.includes(d.type)) actionType = "toggle";
  else if (SENSOR_TYPES.includes(d.type)) actionType = "sensor";
  else if (SLIDER_TYPES.includes(d.type)) actionType = "slider";
  else actionType = "unknown";

  // Capitalize first letter for display of the type if name is missing
  const displayType = d.type.charAt(0).toUpperCase() + d.type.slice(1);

  // The device we return to use in the frontend
  return {
    id: d.id,
    name: d.name ?? `${displayType} (${d.id})`,
    type: d.type,
    isOnline: d.online,
    room: d.room ?? "Unassigned",
    actions: [
      {
        id: "main",
        type: actionType,
        label: DEVICE_LABELS[d.type] ?? d.type,
        value: currentValue,
        min: minValue,
        max: maxValue,
      },
    ],
  };
}
