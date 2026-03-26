import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Shield, UserCheck, UserMinus, Wifi, WifiOff } from "lucide-react";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";

export default function ManageUsers({
  users,
  allDevices,
  onToggleUserDevice,
  onToggleUserRole,
  onRemoveUser,
  onLogout,
}) {
  const [toast, setToast] = useState(null);

  const handleDeviceCheckbox = (userId, device, checked) => {
    onToggleUserDevice(userId, device, checked);
    setToast({ message: `${device.name} ${checked ? "assigned" : "unassigned"} to user` });
  };

  const handleRoleToggle = (user) => {
    onToggleUserRole(user.id);
    setToast({ message: `${user.name} role changed to ${user.role === "admin" ? "user" : "admin"}` });
  };

  const handleRemove = (user) => {
    onRemoveUser(user.id);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Edit users, assign devices, change roles, or remove users.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/overview" className="min-w-[96px]">
              <Button text="Back to Overview" variant="ghost" fullWidth onClick={() => {}} />
            </Link>
            <Button text="Logout" variant="ghost" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2">Username</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Assign Devices</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const hasDevice = (device) => user.devices.some((d) => d.id === device.id);
                return (
                  <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-3 py-2 align-top flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-500" />
                      {user.name}
                    </td>
                    <td className="px-3 py-2 align-top flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      {user.email}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        {user.role === "admin" ? <UserMinus className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />} {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                        {allDevices.map((device) => {
                          const checked = hasDevice(device);
                          return (
                            <label
                              key={`${user.id}-${device.id}`}
                              className="flex items-center gap-2 text-xs"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => handleDeviceCheckbox(user.id, device, e.target.checked)}
                                className="h-4 w-4"
                              />
                              {checked ? (
                                <Wifi className="w-4 h-4 text-green-500" />
                              ) : (
                                <WifiOff className="w-4 h-4 text-gray-400" />
                              )}
                              {device.name}
                            </label>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          text={user.role === "admin" ? "Downgrade" : "Upgrade"}
                          variant="primary"
                          onClick={() => handleRoleToggle(user)}
                        />
                        <Button
                          text="Remove"
                          variant="danger"
                          onClick={() => handleRemove(user)}
                          disabled={user.id === "admin-1"}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {toast && <Toast message={toast.message} onDismiss={() => setToast(null)} />}
    </div>
  );
}
