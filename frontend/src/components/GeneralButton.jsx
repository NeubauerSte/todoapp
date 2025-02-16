import {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";

const GeneralButton = ({ action, position, emoji }) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const { checkAuthStatus } = useContext(AuthContext)

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 1000);
        return () => clearTimeout(timeout);
    }, []);

    const handleClick = () => {
        if (action === "back") {
            setTimeout(() => navigate("/"), 300); // Kleiner Delay, um sicherzugehen            checkAuthStatus(); // ⬅️ Stelle sicher, dass der Status erneut überprüft wird
        } else if (action === "logout") {
            fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include",
            })
                .then((response) => {
                    if (response.ok) {
                        navigate("/");
                        checkAuthStatus();
                    } else {
                        console.error("Fehler beim Logout");
                    }
                })
                .catch((error) => console.error("Netzwerkfehler:", error));
        }
    };

    return (
        <div className={`fixed-button ${position} ${visible ? "show" : ""}`}>
            <button onClick={handleClick}>{emoji}</button>
        </div>
    );
};

export default GeneralButton;
