import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logEvent from "../utils/logEvent";

const logout = async (navigate, checkAuthStatus) => {
    try {
        logEvent("INFO", "Logout wird ausgeführt...");
        const response = await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
            logEvent("SUCCESS", "Logout erfolgreich");
            await checkAuthStatus();
            navigate("/");
        } else {
            logEvent("ERROR", "Logout fehlgeschlagen");
        }
    } catch (error) {
        logEvent("ERROR", "Fehler beim Logout", error);
    }
};

export default logout;
