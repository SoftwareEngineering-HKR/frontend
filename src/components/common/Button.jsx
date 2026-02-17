export default function Button({ text, onClick, type="button" }) {
    return (
    <button 
        onClick={onClick} 
        type={type} 
        className="w-full px-6 py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/30 tracking-wide"
    >
        {text}
    </button>
    )
}