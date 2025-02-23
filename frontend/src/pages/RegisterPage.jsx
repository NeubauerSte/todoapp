import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Korrekt importiert
import Register from "../components/Register";
import BackButton from "../components/BackButton.jsx";
import LogoutButton from "../components/LogoutButton.jsx";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { user } = useAuth(); // ✅ `user` statt `isAuthenticated` verwenden

    useEffect(() => {
        if (user) {
            setTimeout(() => navigate("/todos"), 100); // ✅ Falls eingeloggt, direkt weiterleiten
        }
    }, [user, navigate]);

    return (
        <div className="page-container">
            <BackButton />
            <Register onRegister={() => navigate("/login")} />
        </div>
    );
}