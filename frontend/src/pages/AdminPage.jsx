import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GeneralButton from "../components/GeneralButton";
import BackButton from "../components/BackButton";
import LogoutButton from "../components/LogoutButton";
import logEvent from "../utils/logEvent";

export default function AdminPage() {
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isAdmin) {
            navigate("/todos");
            return;
        }

        async function fetchUsers() {
            try {
                const response = await fetch("http://localhost:8080/api/admin/users", { credentials: "include" });
                if (!response.ok) throw new Error("Fehler beim Abrufen der Benutzerliste.");
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
                logEvent("error", "Benutzerabruf fehlgeschlagen", err);
            }
        }

        fetchUsers().catch(console.error);
    }, [isAdmin, navigate]);

    const handleToggleRole = async (username, role) => {
        if (username === "admin") {
            alert("🚨 Der Hauptadmin kann nicht verändert werden!");
            return;
        }

        const userToModify = users.find((u) => u.username === username);
        const hasRole = userToModify?.roles.some((r) => r.name === role);

        const method = hasRole ? "DELETE" : "POST"; // 🟢 Wechsel zwischen Zuweisen (POST) und Entfernen (DELETE)

        try {
            const response = await fetch(`http://localhost:8080/api/admin/roles?username=${username}&role=${role}`, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const message = await response.text();
            if (!response.ok) throw new Error(message);
            alert(message);

            // 🟢 State aktualisieren und neu rendern lassen
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.username === username
                        ? {
                            ...user,
                            roles: hasRole
                                ? user.roles.filter((r) => r.name !== role) // ❌ Entfernen (DELETE)
                                : [...user.roles, { id: 2, name: role }], // ✅ Hinzufügen (POST)
                        }
                        : user
                )
            );
        } catch (err) {
            alert(`Fehler: ${err.message}`);
        }
    };

    const handleViewTodos = (username) => {
        navigate(`/admin/todos/${username}`);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-600 to-red-800 text-white">
            <div className="bg-white p-10 rounded-xl shadow-xl text-center max-w-4xl w-full animate-fadeIn text-gray-900">
                <h2 className="text-3xl font-bold mb-4 text-red-700">Admin-Dashboard</h2>
                <p className="mb-6 text-gray-600">Verwalte Benutzer, ihre Rollen und Todos.</p>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse rounded-xl shadow-lg text-gray-800">
                        <thead>
                        <tr className="bg-red-700 text-white">
                            <th className="p-3">Benutzername</th>
                            <th className="p-3">Rollen</th>
                            <th className="p-3">Aktionen</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((targetUser) => (
                            <tr key={targetUser.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                <td className="p-3 cursor-pointer font-semibold text-blue-600 hover:underline"
                                    onClick={() => handleViewTodos(targetUser.username)}>
                                    {targetUser.username}
                                </td>
                                <td className="p-3">
                                    {targetUser.roles.map((role) => (
                                        <span key={role.name} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm mr-1">
                                                {role.name}
                                            </span>
                                    ))}
                                </td>
                                <td className="p-3 flex gap-2 justify-center">
                                    {/* 🟢 Admin zuweisen / entziehen */}
                                    {targetUser.roles.some((r) => r.name === "ADMIN") ? (
                                        user.username === "admin" && targetUser.username !== "admin" ? (
                                            <GeneralButton
                                                onClick={() => handleToggleRole(targetUser.username, "ADMIN")}
                                                text="Admin entziehen"
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 shadow-md"
                                            />
                                        ) : (
                                            <span className="text-gray-400">Nicht erlaubt</span>
                                        )
                                    ) : (
                                        <GeneralButton
                                            onClick={() => handleToggleRole(targetUser.username, "ADMIN")}
                                            text="Admin zuweisen"
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 shadow-md"
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-between">
                    <BackButton />
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}