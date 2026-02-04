// professional input component with error state styling
export default function Input({ label, type = "text", placeholder, value, onChange, name, error }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* label with subtle color */}
      {label && <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>}
      
      {/* input field with dynamic border color based on error */}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3.5 rounded-xl border transition-all outline-none text-gray-800 placeholder-gray-400
            ${error 
                ? 'bg-red-50 border-red-500 focus:ring-4 focus:ring-red-500/10' 
                : 'bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10'
            }
        `}
      />
      
      {/* error message below input */}
      {error && (
        <span className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1 animate-pulse">
            • {error}
        </span>
      )}
    </div>
  );
}
