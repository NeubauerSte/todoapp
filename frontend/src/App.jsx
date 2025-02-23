import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ToDoPage from "./pages/ToDoPage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage"; // ✅ HomePage importieren
import Logout from "./components/Logout.jsx";
import "./assets/index.css";
import AdminTodosPage from "./pages/AdminTodoPage.jsx";

function ProtectedRoute({ children, adminOnly = false }) {
    const { user, isAdmin, loading } = useAuth();
    console.log("🔍 Debug AuthContext:", { user, isAdmin, loading });

    if (loading) return <p>Loading...</p>; // ✅ Zeigt zuerst "Loading...", damit nicht sofort umgeleitet wird.
    if (!user) return <Navigate to="/" />;
    if (adminOnly && !isAdmin) return <Navigate to="/todos" />;
    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin/todos/:username" element={<AdminTodosPage />} />
                <Route path="/todos" element={<ProtectedRoute><ToDoPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AuthProvider>
    );
}