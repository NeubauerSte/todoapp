import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/Login";
import BackButton from "../components/BackButton.jsx";

function LoginPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            setTimeout(() => navigate("/todos"), 100); // Kleiner Delay, um sicherzugehen
        }
    }, [isAuthenticated, navigate]);

    return (
        <div>
            <BackButton />
            <h2>Login</h2>
            <Login onLogin={() => navigate("/todos")} />
        </div>
    );
}

export default LoginPage;
