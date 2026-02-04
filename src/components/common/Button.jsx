// professional button with hover effects and loading state support
export default function Button({ text, onClick, type="button" }) {
    return (
    <button 
        onClick={onClick} 
        type={type} 
        className="w-full px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all active:scale-[0.98] shadow-xl shadow-primary/20 tracking-wide"
    >
        {text}
    </button>
    )
}
