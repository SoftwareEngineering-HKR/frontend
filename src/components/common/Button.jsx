export default function Button({ text, onClick, type="button", variant, icon, disabled, fullWidth }) {
    const baseClasses =
    "inline-flex items-center justify-center px-4 py-2.5 text-sm gap-2 font-medium rounded-lg transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
        primary:
        "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-sm hover:shadow-md disabled:bg-indigo-300 dark:disabled:bg-indigo-900 disabled:cursor-not-allowed",
        danger:
        "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm disabled:bg-red-500 dark:disabled:bg-red-700 disabled:cursor-not-allowed",
        ghost:
        "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
    };

    return (
    <button 
        onClick={onClick} 
        type={type}
        disabled={disabled}
        className={[baseClasses, variantClasses[variant] ?? variantClasses.primary, fullWidth ? "w-full" : ""].filter(Boolean).join(" ")}
    >
        {icon && <span>{icon}</span>}
        {text}
    </button>
    )
}