import { useState } from "react";
import { Send } from "lucide-react";
import Toast from "../../common/Toast";

const MAX_LENGTH = 32;

export default function DisplayControl({
  action,
  deviceId,
  isOnline,
  onAction,
}) {
  const [input, setInput] = useState("");
  const [toast, setToast] = useState(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await onAction(deviceId, input.trim());
      setInput("");
      setToast({ message: "Display updated.", isError: false });
    } catch (error) {
      setToast({ message: error.message, isError: true });
    }
  };

  return (
    <>
      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {action.label}
        </span>

        <div className="w-full px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
          {action.value || <span>No text set</span>}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={!isOnline}
            placeholder="Enter text..."
            className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!isOnline || !input.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <span className="text-xs text-gray-400 text-right block">
          {input.length} / {MAX_LENGTH}
        </span>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          isError={toast.isError}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}
