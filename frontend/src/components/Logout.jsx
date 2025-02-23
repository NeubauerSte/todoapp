import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logEvent from "../utils/logEvent";

export default function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logEvent("INFO", "User wird ausgeloggt...");
        logout().then(() => {
            setTimeout(() => navigate("/"), 1000); // Nach 1 Sekunde weiterleiten
        });
    }, [logout, navigate]);

    return (
        <div className="page-container logout-container">
            <h2>Du wurdest erfolgreich ausgeloggt!</h2>
            <p>Du wirst in Kürze zur Startseite weitergeleitet...</p>
            <div className="spinner"></div>
        </div>
    );
}