import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton.jsx";

function HomePage() {
    const navigate = useNavigate();
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-100"><p className="text-gray-600 text-lg">Lädt...</p></div>;
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-400 to-blue-600 text-white">
            <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md mx-auto animate-fadeIn text-gray-900">
                <h1 className="text-3xl font-bold mb-4">Willkommen zur To-Do App ✅</h1>

                {user ? (
                    <>
                        <p className="mb-4 text-lg">Hallo, <span className="font-bold text-blue-600">{user.username}</span>! 👋</p>

                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={() => navigate("/todos")}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg transition hover:bg-blue-700 hover:scale-105 shadow-md"
                            >
                                📋 ToDos verwalten
                            </button>

                            {isAdmin && (
                                <button
                                    onClick={() => navigate("/admin")}
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg transition hover:bg-red-700 hover:scale-105 shadow-md"
                                >
                                    👑 Nutzer verwalten
                                </button>
                            )}
                        </div>

                        <LogoutButton />
                    </>
                ) : (
                    <>
                        <p className="mb-4 text-lg">Verwalte deine Aufgaben effizient mit unserer App!</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg transition hover:bg-blue-700 hover:scale-105 mb-2 shadow-md"
                        >
                            🔑 Login
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg transition hover:bg-green-700 hover:scale-105 shadow-md"
                        >
                            📝 Registrieren
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default HomePage;