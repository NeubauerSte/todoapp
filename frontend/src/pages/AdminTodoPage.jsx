import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function AdminTodosPage() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        async function fetchUserTodos() {
            try {
                const response = await fetch(`http://localhost:8080/api/admin/todos/${username}`, { credentials: "include" });
                if (!response.ok) throw new Error("Fehler beim Abrufen der Todos");
                setTodos(await response.json());
            } catch (err) {
                console.error("❌ Fehler:", err);
            }
        }

        fetchUserTodos();
    }, [username]);

    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/todos/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Fehler beim Löschen");
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (err) {
            console.error("❌ Fehler beim Löschen:", err);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-500 to-red-700 text-white">
            <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-lg w-full animate-fadeIn text-gray-900">
                <h2 className="text-3xl font-bold mb-2 text-red-600">Todos von {username}</h2>

                {todos.length === 0 ? (
                    <p className="text-gray-500">Keine Todos vorhanden.</p>
                ) : (
                    todos.map(todo => (
                        <div key={todo.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg mb-2">
                            <span>{todo.title}</span>
                            <button
                                className="bg-danger text-white px-2 py-1 rounded-lg transition hover:bg-red-700"
                                onClick={() => deleteTodo(todo.id)}
                            >
                                ❌ Löschen
                            </button>
                        </div>
                    ))
                )}

                <div className="mt-6 flex justify-between">
                    <BackButton />
                    <button
                        onClick={() => navigate("/admin")}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition hover:scale-105"
                    >
                        ✅ Fertig
                    </button>
                </div>
            </div>
        </div>
    );
}