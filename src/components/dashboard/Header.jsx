import { Home, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

export default function Header(props) {
  const onlineCount = props.devices.filter((d) => d.isOnline).length;
  const offlineCount = props.devices.filter((d) => !d.isOnline).length;
  const navigate = useNavigate();

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
                <Button
                  text="Manage Users"
                  icon={<Users className="w-4 h-4"/>}
                  onClick={() => navigate("/admin")}
                  variant="ghost"
                />
              )}
              <Button
                text="Log Out"
                icon={<LogOut className="w-4 h-4"/>}
                onClick={props.onLogout}
                variant="ghost"
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
