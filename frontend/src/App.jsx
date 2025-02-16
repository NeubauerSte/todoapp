import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ToDoPage from "./pages/ToDoPage";
import { useContext } from "react";
import "./assets/App.css"

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/todos" element={<ProtectedRoute element={<ToDoPage />} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
        </AuthProvider>
    );
}

export default App;
