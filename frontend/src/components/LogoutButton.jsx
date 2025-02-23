import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logEvent from "../utils/logEvent";

export default function LogoutButton() {
    const { logout } = useAuth();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 250); // 250ms Verzögerung
        return () => clearTimeout(timeout);
    }, []);

    const handleClick = async () => {
        logEvent("INFO", "Logout-Klick erkannt");
        await logout();
    };

    return (
        <div className={`fixed top-5 right-5 transition-opacity duration-500 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            <button
                onClick={handleClick}
                className="w-12 h-12 bg-white text-white border border-black rounded-full text-2xl flex items-center justify-center shadow-lg transition hover:bg-red-400 hover:scale-110"
            >
                🚪
            </button>
        </div>
    );
}