import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import logEvent from "../utils/logEvent";

export default function Login() {
    const { user, isAdmin, isUser } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) throw new Error("Login fehlgeschlagen!");

            const userData = await response.json();
            localStorage.setItem("user", JSON.stringify(userData));
            window.location.reload(); // AuthContext lädt sich neu
        } catch (err) {
            setError(err.message);
            logEvent("error", "Login fehlgeschlagen", err);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md mx-auto animate-fadeIn text-gray-900">
                <h2 className="text-3xl font-bold mb-2 text-gray-800">Willkommen zurück! 👋</h2>
                <p className="mb-6 text-gray-600">Melde dich an, um deine Aufgaben zu verwalten.</p>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Benutzername"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                        <span className="absolute left-3 top-3 text-gray-500">👤</span>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                        <span className="absolute left-3 top-3 text-gray-500">🔒</span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg transition hover:bg-blue-700 hover:scale-105"
                    >
                        🔑 Anmelden
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-600">
                    Noch keinen Account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Registrieren
                    </a>
                </p>
            </div>
        </div>
    );
}