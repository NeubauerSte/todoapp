import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { checkAuthStatus } = useContext(AuthContext);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                await checkAuthStatus(); // Aktualisiert den Auth-Status
                navigate("/todos");
            } else {
                const errorText = await response.text();
                setError(errorText || "Login fehlgeschlagen!");
            }
        } catch (err) {
            console.error("Fehler beim Login:", err);
            setError("Netzwerkfehler! Server nicht erreichbar.");
        }
    };

    return (
        <div className="page-container">
            <h2>🔑 Login</h2>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleLogin}>
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
                <button type="submit">Einloggen</button>
            </form>
            <p>Kein Konto? <a href="/register">Hier registrieren</a></p>
        </div>
    );
}

export default Login;
