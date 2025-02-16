import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Logout = () => {
    const navigate = useNavigate();
    const { isAuthenticated, checkAuthStatus } = useContext(AuthContext);

    if (!isAuthenticated) return null; // Keine Anzeige für nicht eingeloggte User

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                console.log("Erfolgreich ausgeloggt");
                checkAuthStatus(); // Auth-Status aktualisieren
                navigate("/"); // Zur Startseite
            } else {
                console.error("Fehler beim Logout:", await response.text());
            }
        } catch (error) {
            console.error("Netzwerkfehler beim Logout:", error);
        }
    };

    return (
        <button className="logout-button" onClick={handleLogout}>
            🚪 Logout
        </button>
    );
};

export default Logout;
