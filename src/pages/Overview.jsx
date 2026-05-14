import SearchBar from "../components/dashboard/SearchBar";
import Header from "../components/dashboard/Header";
import DeviceList from "../components/dashboard/DeviceList";
import Button from "../components/common/Button";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AddDeviceModal from "../components/dashboard/AddDeviceModal";
import Toast from "../components/common/Toast";
import { useSmartHouse } from "../context/SmartHouseContext";
import { useAuth } from "../context/AuthContext";

export default function Overview() {
  const { currentUser, logout } = useAuth();
  const { devices, send, wsError } = useSmartHouse();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.room.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const connectedDeviceIds = devices.map((d) => d.id);

  // const handleDeviceAdded = (newDevice) => {
  //   handleAddDevice(newDevice);
  //   setIsAddModalOpen(false);
  //   setToast({ message: `"${newDevice.name}" added to your dashboard.` });
  // };

  const handleDeviceAction = async (deviceId, value) => {
    try {
      console.log(devices[0])
      await send.deviceValueUpdate(deviceId, value);
    } catch (error) {
      console.log("Device value update failed.");
      setToast({ message: error.message, isError: true });
    }
  };

  const handleRemoveDevice = (deviceId) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;

    openConfirm({
      title: "Remove Device",
      message: `Are you sure you want to remove "${device.name}"?`,
      onConfirm: async () => {
        closeConfirm();
        try {
          await send.deleteDevice(deviceId);
        } catch (error) {
          setActionError(error.message);
        }
      },
    });
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <Header
          devices={devices}
          onLogout={logout}
          isAdmin={currentUser.isAdmin}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Search and Add Device */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            {currentUser.isAdmin && (
              <Button
                text="Add Device"
                variant="primary"
                icon={<Plus className="w-5 h-5" />}
                onClick={() => setIsAddModalOpen(true)}
              />
            )}
          </div>

          {/* Devices List */}
          {filteredDevices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "No devices found matching your search"
                  : "No devices available"}
              </p>
            </div>
          ) : (
            <DeviceList
              filteredDevices={filteredDevices}
              onDeviceAction={handleDeviceAction}
              onRemoveDevice={handleRemoveDevice}
              isAdmin={currentUser.isAdmin}
            />
          )}
        </main>
      </div>

      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        //onAdd={handleAddDevice}
        connectedDeviceIds={connectedDeviceIds}
      />

      {toast && (
        <Toast message={toast.message} onDismiss={() => setToast(null)} />
      )}
    </>
  );
}
