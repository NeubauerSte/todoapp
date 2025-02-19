import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logEvent from "../utils/logEvent";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        logEvent("INFO", "Login-Versuch", { username });

        try {
            const success = await login(username, password);
            if (success) {
                logEvent("SUCCESS", "Login erfolgreich", { username });
                navigate("/todos");
            } else {
                logEvent("ERROR", "Login fehlgeschlagen", { username });
            }
        } catch (error) {
            logEvent("ERROR", "Fehler beim Login", error);
        }
    };

    return (
        <form onSubmit={handleLogin} className="auth-form">
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
            <button type="submit">🔑 Login</button>
        </form>
    );
};

export default Login;
