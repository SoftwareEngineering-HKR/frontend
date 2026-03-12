import SearchBar from "../components/dashboard/SearchBar";
import Header from "../components/dashboard/Header";
import DeviceList from "../components/dashboard/DeviceList";
import Button from "../components/common/Button";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function Overview(props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDevices = props.devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.room.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap">
                <Plus className="w-5 h-5" />
                Add Device
              </button>
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
              isAdmin={props.isAdmin}
            />
          )}
        </main>
      </div>
    </>
  );
}
