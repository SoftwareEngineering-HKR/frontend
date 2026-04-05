import SearchBar from "../components/dashboard/SearchBar";
import Header from "../components/dashboard/Header";
import DeviceList from "../components/dashboard/DeviceList";
import Button from "../components/common/Button";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AddDeviceModal from "../components/dashboard/AddDeviceModal";
import Toast from "../components/common/Toast";

export default function Overview(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const filteredDevices = props.devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.room.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const connectedDeviceIds = props.devices.map((d) => d.id);

  const handleDeviceAdded = (newDevice) => {
    props.onAddDevice(newDevice);
    setIsAddModalOpen(false);
    setToast({ message: `"${newDevice.name}" added to your dashboard.` });
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <Header
          devices={props.devices}
          onLogout={props.onLogout}
          isAdmin={props.isAdmin}
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
            {props.isAdmin && (
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
              onDeviceAction={props.onDeviceAction}
              onRemoveDevice={props.onRemoveDevice}
              onScheduleUpdate={props.onScheduleUpdate}
              isAdmin={props.isAdmin}
            />
          )}
        </main>
      </div>

      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleDeviceAdded}
        connectedDeviceIds={connectedDeviceIds}
      />
 
      {toast && (
        <Toast message={toast.message} onDismiss={() => setToast(null)} />
      )}
    </>
  );
}
