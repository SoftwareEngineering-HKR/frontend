export default function Input({ label, type = "text", placeholder, value, onChange, name, error }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3.5 rounded-xl border transition-all outline-none text-gray-800 placeholder-gray-400
            ${error 
                ? 'bg-red-50 border-red-500 focus:ring-2 focus:ring-red-200' 
                : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent'
            }
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
