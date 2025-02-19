import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logEvent from "../utils/logEvent";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            logEvent("WARNING", "Passwörter stimmen nicht überein", { username });
            alert("Passwörter müssen übereinstimmen!");
            return;
        }

        logEvent("INFO", "Registrierungsversuch", { username });

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                logEvent("SUCCESS", "Registrierung erfolgreich", { username });

                // Automatisch einloggen nach erfolgreicher Registrierung
                const success = await login(username, password);
                if (success) {
                    logEvent("SUCCESS", "Automatischer Login nach Registrierung", { username });
                    navigate("/todos");
                } else {
                    logEvent("ERROR", "Automatischer Login nach Registrierung fehlgeschlagen", { username });
                }
            } else {
                const errorMessage = await response.text();
                logEvent("ERROR", "Registrierung fehlgeschlagen", { username, errorMessage });
                alert("Registrierung fehlgeschlagen: " + errorMessage);
            }
        } catch (error) {
            logEvent("ERROR", "Fehler bei der Registrierung", error);
        }
    };

    return (
        <form onSubmit={handleRegister} className="auth-form">
            <input
                type="text"
                placeholder="Benutzername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Passwort bestätigen"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <button type="submit">📝 Registrieren</button>
        </form>
    );
};

export default Register;
