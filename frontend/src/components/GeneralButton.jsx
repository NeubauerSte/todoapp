import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logEvent from "../utils/logEvent";
import logout from "../components/Logout"; // Prüfe den Importpfad

const GeneralButton = ({ action, position, emoji }) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const { checkAuthStatus } = useContext(AuthContext);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 1000);
        return () => clearTimeout(timeout);
    }, []);

    const handleClick = async () => {
        if (action === "back") {
            logEvent("INFO", "Zurück zur Startseite");
            await checkAuthStatus();
            setTimeout(() => navigate("/"), 300);
        } else if (action === "logout") {
            logEvent("INFO", "Logout-Klick erkannt");
            await logout(navigate, checkAuthStatus);
        }
    };

    return (
        <div className={`fixed-button ${position} ${visible ? "show" : ""}`}>
            <button onClick={handleClick}>{emoji}</button>
        </div>
    );
};

export default GeneralButton;
