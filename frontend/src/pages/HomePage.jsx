import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import GeneralButton from "../components/GeneralButton";

function HomePage() {
    const navigate = useNavigate();
    const { isAuthenticated, user, checkAuthStatus, loading } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated) checkAuthStatus(); // Nur prüfen, wenn nicht eingeloggt
    }, []); // Leer lassen, damit es nur einmal beim Laden aufgerufen wird

    if (loading) {
        return <div className="page-container"><p>Lädt...</p></div>;
    }

    return (
        <div className="page-container">
            <h1>Willkommen zur To-Do App ✅</h1>
            {isAuthenticated ? (
                <>
                    <p>Hallo, {user?.username || "Hacker, wtf?"}! 👋</p>
                    <button onClick={() => navigate("/todos")}>📋 Todos verwalten</button>
                    <GeneralButton action="logout" position="right" emoji="🚪" />
                </>
            ) : (
                <>
                    <p>Verwalte deine Aufgaben effizient mit unserer App!</p>
                    <button onClick={() => navigate("/login")}>🔑 Login</button>
                    <button onClick={() => navigate("/register")}>📝 Registrieren</button>
                </>
            )}
        </div>
    );
}

export default HomePage;
