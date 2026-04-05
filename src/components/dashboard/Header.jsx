import LogoutButton from "../auth/LogOutButton";
import { Home, Users, LogOut } from "lucide-react";

export default function Header(props) {
  const onlineCount = props.devices.filter((d) => d.isOnline).length;
  const offlineCount = props.devices.filter((d) => !d.isOnline).length;

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Smart Home
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {onlineCount} online · {offlineCount} offline
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {props.isAdmin && (
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Manage Users</span>
                </button>
              )}
              <button
                onClick={props.onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
