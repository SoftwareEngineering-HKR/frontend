import { useState, useEffect } from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

// need to maybe fix cause UI looks a bit weird
const daysOfWeek = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

export default function Schedule(props) {
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);

  const [schedule, setSchedule] = useState(
    props.schedule || {
      enabled: false,
      days: [],
      startTime: "",
      endTime: "",
    },
  );

  useEffect(() => {
    setSchedule(
      props.schedule || {
        enabled: false,
        days: [],
        startTime: "",
        endTime: "",
      },
    );
  }, [props.schedule]);

  const handleScheduleChange = (updates) => {
    const newSchedule = {
      ...schedule,
      ...updates,
    };
    setSchedule(newSchedule);
    props.onChange?.(newSchedule);
  };

  const toggleDay = (day) => {
    const newDays = schedule.days.includes(day)
      ? schedule.days.filter((d) => d !== day)
      : [...schedule.days, day];

    handleScheduleChange({
      days: newDays,
    });
  };

  return (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <button
        onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
        disabled={!props.isOnline}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Scheduling
          </span>
          {/* Maybe can show instead the active days? */}
          {schedule.enabled && (
            <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
              Active
            </span>
          )}
        </div>
        {isScheduleExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {isScheduleExpanded && (
        <div className="mt-3 space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          {/* Enable/Disable Schedule */}
          {/* Maybe need to fix the logic here a bit */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Enable Schedule
            </span>
            <button
              onClick={() =>
                handleScheduleChange({ enabled: !schedule.enabled })
              }
              className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer
                    ${schedule.enabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}
                  `}
            >
              <span
                className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${schedule.enabled ? "translate-x-6" : "translate-x-1"}
                    `}
              />
            </button>
          </div>

          {schedule.enabled && (
            <>
              {/* Days of Week */}
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                  Active Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      onClick={() => toggleDay(day.value)}
                      className={`
                            px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                            ${
                              schedule.days.includes(day.value)
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                            }
                          `}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={schedule.startTime || ""}
                    onChange={(e) =>
                      handleScheduleChange({ startTime: e.target.value })
                    }
                    className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={schedule.endTime || ""}
                    onChange={(e) =>
                      handleScheduleChange({ endTime: e.target.value })
                    }
                    className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
