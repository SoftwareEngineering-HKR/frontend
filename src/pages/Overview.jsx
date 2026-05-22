import SearchBar from "../components/dashboard/SearchBar";
import Header from "../components/dashboard/Header";
import DeviceList from "../components/dashboard/DeviceList";
import Button from "../components/common/Button";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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

  const handleDeviceAction = async (deviceId, value) => {
    try {
      await send.deviceValueUpdate(deviceId, value);
    } catch (error) {
      setToast({ message: error.message, isError: true });
    }
  };

  const handleRemoveFromDashboard = async (deviceId) => {
    try {
      await send.removeFromDashboard(deviceId);
    } catch (error) {
      setToast({ message: error.message, isError: true });
    }
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
              onRemoveFromDashboard={handleRemoveFromDashboard}
            />
          )}
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          onDismiss={() => setToast(null)}
          isError={toast.isError}
        />
      )}
    </>
  );
}
