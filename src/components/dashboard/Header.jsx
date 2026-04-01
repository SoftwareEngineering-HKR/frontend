import { Home, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

export default function Header({ devices, isAdmin, onLogout, title="Smart Home", subtitle, icon=<Home className="w-6 h-6 text-white" />, actions }) {
  const onlineCount = devices?.filter((d) => d.isOnline).length ?? 0;
  const offlineCount = devices?.filter((d) => !d.isOnline).length ?? 0;

  // device count if in Overview, user count if in Admin Panel
  if (!subtitle) {
    subtitle = `${onlineCount} online · ${offlineCount} offline`;
  }
  
  const navigate = useNavigate();

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                {icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              { actions ?? (
                <>
                  {isAdmin && (
                    <Button
                      text="Manage Users"
                      icon={<Users className="w-4 h-4"/>}
                      onClick={() => navigate("/admin")}
                      variant="ghost"
                    />
                  )}
                </>
              )}
              <Button
                text="Log Out"
                icon={<LogOut className="w-4 h-4"/>}
                onClick={onLogout}
                variant="ghost"
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
