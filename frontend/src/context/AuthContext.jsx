import { createContext, useState, useEffect } from "react";
import logEvent from "../utils/logEvent";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/check", {
                credentials: "include",
            });

            if (!response.ok) throw new Error("Nicht authentifiziert");

            const data = await response.json();
            if (data) {
                logEvent("Auth", `User authentifiziert: ${data.username}`);
                setIsAuthenticated(true);
                setUser(data);
            } else {
                logEvent("Auth", "Keine gültigen User-Daten erhalten.");
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            logEvent("Auth Fehler", error.message);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) throw new Error("Login fehlgeschlagen");

            const data = await response.json();
            setIsAuthenticated(true);
            setUser(data);
            logEvent("Login", `Erfolgreich eingeloggt als ${data.username}`);
            return { success: true };
        } catch (error) {
            logEvent("Login Fehler", error.message);
            return { success: false, error: error.message };
        }
    };

    useEffect(() => {
        (async () => {
            await checkAuthStatus();
        })();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, checkAuthStatus, login, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
