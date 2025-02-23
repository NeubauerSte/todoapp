export default function GeneralButton({ onClick, text, className = "" }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 bg-primary text-white rounded-full shadow-lg transition hover:scale-105 hover:bg-blue-700 ${className}`}
        >
            {text}
        </button>
    );
}