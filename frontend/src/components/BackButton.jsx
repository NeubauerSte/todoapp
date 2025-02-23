import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logEvent from "../utils/logEvent";

export default function BackButton() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 250); // 250ms Verzögerung
        return () => clearTimeout(timeout);
    }, []);

    const handleClick = () => {
        logEvent("INFO", "Zurück zur Startseite");
        setTimeout(() => navigate("/"), 300);
    };

    return (
        <div className={`fixed top-5 left-5 transition-opacity duration-500 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            <button
                onClick={handleClick}
                className="w-12 h-12 bg-white text-blue-600 border border-black rounded-full text-2xl flex items-center justify-center shadow-lg transition hover:bg-gray-300 hover:scale-110"
            >
                ⬅
            </button>
        </div>
    );
}