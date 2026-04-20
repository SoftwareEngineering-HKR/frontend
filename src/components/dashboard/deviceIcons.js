import {
  Lightbulb,
  Fan,
  Flame,
  Droplets,
  Volume2,
  Wind,
  Activity,
  Squircle,
  DoorClosed,
  Grid2X2,
  Scan,
  Camera,
  Sun,
  Move,
} from "lucide-react";

export const deviceIcons = {
  light: Lightbulb,
  fan: Fan,
  gas: Flame,
  humidity: Droplets,
  steam: Wind,
  servo: Scan, // no perfect icon for servo, using scan as a placeholder
  buzz: Volume2,
  motion: Move,
  button: Squircle,
  door: DoorClosed,
  window: Grid2X2,
  photo: Camera,
  tilt: Activity,
  brightness: Sun,
};
