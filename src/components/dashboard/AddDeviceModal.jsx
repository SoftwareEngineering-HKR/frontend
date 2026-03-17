import { useState, useEffect, useRef } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
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
  Loader2,
  Plus,
  ArrowLeft,
} from "lucide-react";

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

const deviceTypeLabels = {
  light: "Light",
  thermostat: "Thermostat",
  lock: "Lock",
  camera: "Camera",
  window: "Window",
  "coffee-machine": "Coffee Machine",
  fan: "Fan",
  speaker: "Speaker",
};


// fake "fetching"
// just reading the file with mock devices
function useMockDeviceFetch(connectedDeviceIds) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setDevices([]);

    const timer = setTimeout(async () => {
      const { allSystemDevices } = await import("./mockAvailableDevices.js");
      const available = allSystemDevices.filter(
        (d) => !connectedDeviceIds.includes(d.id),
      );
      setDevices(available);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return { devices, loading };
}

// show list of devices to select
function DeviceListStep({ devices, loading, onSelect }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Scanning for available devices…
        </p>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <Wifi className="w-7 h-7 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          No new devices found on your network.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {devices.length} device{devices.length !== 1 ? "s" : ""} available to add
      </p>
      <ul className="space-y-2">
        {devices.map((device) => {
          const Icon = deviceIcons[device.type] || Lightbulb;
          return (
            <li key={device.id}>
              <button
                onClick={() => onSelect(device)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 bg-gray-50 dark:bg-gray-700/50 transition-all duration-150 text-left group"
              >
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    device.isOnline
                      ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {device.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {deviceTypeLabels[device.type] || device.type}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {device.isOnline ? (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-400">Offline</span>
                    </>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

// input custom device info before adding to Overview
function ConfigureStep({ device, deviceName, room, onNameChange, onRoomChange, nameRef }) {
  const Icon = deviceIcons[device.type] || Lightbulb;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
        <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wide mb-0.5">
            Selected device
          </p>
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {device.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {deviceTypeLabels[device.type] || device.type}
            {" · "}
            {device.isOnline ? (
              <span className="text-green-600 dark:text-green-400">Online</span>
            ) : (
              <span className="text-gray-400">Offline</span>
            )}
          </p>
        </div>
      </div>

      <Input
        ref={nameRef}
        label="Device Name"
        placeholder="e.g. Kitchen Light"
        value={deviceName}
        onChange={(e) => onNameChange(e.target.value)}
        required
      />
      <Input
        label="Room"
        placeholder="e.g. Kitchen"
        value={room}
        onChange={(e) => onRoomChange(e.target.value)}
        required
      />
    </div>
  );
}

// main modal
export default function AddDeviceModal({ isOpen, onClose, onAdd, connectedDeviceIds }) {
  const [step, setStep] = useState("list"); // "list" or "configure"
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceName, setDeviceName] = useState("");
  const [room, setRoom] = useState("");

  const { devices, loading } = useMockDeviceFetch(connectedDeviceIds);
  const nameRef = useRef(null);

  useEffect(() => {
    if (step === "configure") {
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [step]);

  useEffect(() => {
    if (isOpen) {
        setStep("list");
        setSelectedDevice(null);
        setDeviceName("");
        setRoom("");
    }
  }, [isOpen]);

  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    setDeviceName(device.name);
    setRoom(device.room || "");
    setStep("configure");
  };

  const handleBack = () => {
    setStep("list");
    setSelectedDevice(null);
    setDeviceName("");
    setRoom("");
  };

  const handleAdd = () => {
    if (!deviceName.trim() || !room.trim()) return;
    onAdd({ ...selectedDevice, name: deviceName.trim(), room: room.trim(), connected: true });
  };

  const canAdd = deviceName.trim().length > 0 && room.trim().length > 0;

  const title =
    step === "configure" ? (
      <div className="flex items-center gap-2">
        <Button
          onClick={handleBack}
          variant="ghost"
          icon={<ArrowLeft className="w-5 h-5" />}
        />
        <span>Configure Device</span>
      </div>
    ) : (
      "Add Device"
    );

  const footer =
    step === "configure" ? (
      <div className="flex items-center gap-3">
        <Button
          text="Add Device"
          variant="primary"
          fullWidth
          disabled={!canAdd}
          icon={<Plus className="w-4 h-4" />}
          onClick={handleAdd}
        />
      </div>
    ) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
    >
      <div className="p-6">
        {step === "list" && (
          <DeviceListStep devices={devices} loading={loading} onSelect={handleSelectDevice} />
        )}
        {step === "configure" && selectedDevice && (
          <ConfigureStep
            device={selectedDevice}
            deviceName={deviceName}
            room={room}
            onNameChange={setDeviceName}
            onRoomChange={setRoom}
            nameRef={nameRef}
          />
        )}
      </div>
    </Modal>
  );
}