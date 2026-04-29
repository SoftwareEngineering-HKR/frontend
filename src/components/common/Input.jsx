export default function Input({ label, type = "text", placeholder, value, onChange, name, error, required, disabled = false}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3.5 rounded-xl border transition-all outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            ${error 
                ? 'bg-red-50 dark:bg-red-900/20 border-red-500 focus:ring-2 focus:ring-red-200' 
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
      {error && (
        <span className="text-xs text-red-500 ml-1 font-medium">
            {error}
        </span>
      )}
    </div>
  );
}
