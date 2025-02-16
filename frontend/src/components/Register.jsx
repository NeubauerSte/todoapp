import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const {checkAuthStatus } = useContext(AuthContext);

    const handleRegister = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwörter müssen übereinstimmen!");
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include",
            });

            if (response.ok) {
                await checkAuthStatus();
                navigate("/todos");
            } else {
                console.error("Registrierung fehlgeschlagen");
            }
        } catch (error) {
            console.error("Fehler bei der Registrierung:", error);
        }
    };


    return (
        <form onSubmit={handleRegister} className="auth-form">
            <input type="text" placeholder="Benutzername" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="password" placeholder="Passwort bestätigen" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <button type="submit">📝 Registrieren</button>
        </form>
    );
};

export default Register;
