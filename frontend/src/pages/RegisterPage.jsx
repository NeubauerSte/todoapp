// src/pages/RegisterPage.jsx
import { useNavigate } from "react-router-dom";
import Register from "../components/Register";
import BackButton from "../components/BackButton.jsx";
import LogoutButton from "../components/LogoutButton.jsx";

function RegisterPage() {
    const navigate = useNavigate();

    return (
        <div className="page-container">
            <BackButton />
            <h2>Registrierung</h2>
            <Register onRegister={() => navigate("/login")} />
        </div>
    );
}

export default RegisterPage;
