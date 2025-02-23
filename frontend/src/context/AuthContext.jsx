import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useLocalStorage("user", null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Navigations-Funktion für die Weiterleitung

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch("http://localhost:8080/api/auth/check", { credentials: "include" });

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    console.error("🚨 API gibt KEIN JSON zurück:", await response.text());
                    setUser(null);
                    return;
                }

                const data = await response.json();
                console.log("📡 API-Response:", data);

                setUser(data.username ? data : null);

            } catch (error) {
                console.error("❌ Fehler beim Abrufen der Benutzerdaten:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkAuth().catch((error) => {
            console.error("❌ Unerwarteter Fehler in `checkAuth()`:", error);
            setUser(null);
            setLoading(false);
        });
    }, [navigate]);

    const logout = async () => {
        console.log("[DEBUG] logout() wird aufgerufen...");

        try {
            const response = await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Logout fehlgeschlagen.");

            console.log("[DEBUG] Logout erfolgreich!");

            setUser(null);
            document.cookie = "JSESSIONID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        } catch (error) {
            console.error("[DEBUG] Fehler beim Logout", error);
        }
    };

    const isAdmin = user?.roles?.includes("ADMIN") ?? false;
    const isUser = user?.roles?.includes("USER") || isAdmin;

    return (
        <AuthContext.Provider value={{ user, isAdmin, isUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}