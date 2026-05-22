import { Home, LogOut, MonitorCog, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { useDarkMode } from "../../hooks/useDarkMode";

export default function Header({
  devices,
  isAdmin,
  onLogout,
  title = "Smart Home",
  subtitle,
  icon = <Home className="w-6 h-6 text-white" />,
  actions,
}) {
  const onlineCount = devices?.filter((d) => d.isOnline).length ?? 0;
  const offlineCount = devices?.filter((d) => !d.isOnline).length ?? 0;
  const { isDark, toggle } = useDarkMode();

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
              <button
                onClick={toggle}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              {actions ?? (
                <>
                  {isAdmin && (
                    <Button
                      text="Admin Panel"
                      icon={<MonitorCog className="w-4 h-4" />}
                      onClick={() => navigate("/admin")}
                      variant="ghost"
                    />
                  )}
                </>
              )}
              <Button
                text="Log Out"
                icon={<LogOut className="w-4 h-4" />}
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
