import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/check", {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Raw Server Response:", data); // Debugging

                if (data) {
                    setIsAuthenticated(true);
                    setUser(data);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                console.log("Fehlerhafte Server-Antwort:", response.status);
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        catch (error) {
            console.error("Fehler beim Auth-Check:", error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus().catch(error => console.error("Auth-Check Fehler:", error));
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, checkAuthStatus, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
