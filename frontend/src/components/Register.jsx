import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Korrekt importiert
import logEvent from "../utils/logEvent";
import error from "eslint-plugin-react/lib/util/error.js";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
                alert("Registrierung erfolgreich! Bitte logge dich jetzt ein.");
                navigate("/login"); // ✅ Weiterleitung zur Login-Seite nach Registrierung
            } else {
                const errorMessage = await response.text();
                logEvent("ERROR", "Registrierung fehlgeschlagen", { username, errorMessage });
                alert("Registrierung fehlgeschlagen: " + errorMessage);
            }
        } catch (error) {
            logEvent("ERROR", "Fehler bei der Registrierung", error);
            alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-500 to-green-700 text-white">
            <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md mx-auto animate-fadeIn text-gray-900">
                <h2 className="text-3xl font-bold mb-2 text-gray-800">Willkommen! 🎉</h2>
                <p className="mb-6 text-gray-600">Erstelle einen Account, um loszulegen.</p>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Benutzername */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Benutzername"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                        <span className="absolute left-3 top-3 text-gray-500">👤</span>
                    </div>

                    {/* Passwort */}
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                        <span className="absolute left-3 top-3 text-gray-500">🔒</span>
                    </div>

                    {/* Passwort bestätigen */}
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Passwort bestätigen"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                        <span className="absolute left-3 top-3 text-gray-500">✅</span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg transition hover:bg-green-700 hover:scale-105"
                    >
                        📝 Registrieren
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-600">
                    Bereits einen Account?{" "}
                    <a href="/login" className="text-green-600 hover:underline">
                        Anmelden
                    </a>
                </p>
            </div>
        </div>
    );
}