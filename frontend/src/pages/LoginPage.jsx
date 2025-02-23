import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../components/Login";
import BackButton from "../components/BackButton.jsx";

export default function LoginPage() {
    const navigate = useNavigate();
    const { user, isAdmin, loading } = useAuth();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (!loading && user && !hasRedirected.current) {
            hasRedirected.current = true;
            navigate(isAdmin ? "/admin" : "/todos");
        }
    }, [user, isAdmin, loading, navigate]);

    return (
        <div>
            <BackButton />
            <Login onLogin={() => navigate(isAdmin ? "/admin" : "/todos")} />
        </div>
    );
}