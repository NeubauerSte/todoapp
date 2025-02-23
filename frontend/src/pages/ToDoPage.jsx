import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ToDoList from "../components/ToDoList";
import logEvent from "../utils/logEvent";
import BackButton from "../components/BackButton.jsx";
import LogoutButton from "../components/LogoutButton.jsx";

export default function ToDoPage() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    // Todos abrufen
    const fetchTodos = async () => {
        if (!user) return;
        console.log("[DEBUG] fetchTodos() wird aufgerufen...");

        try {
            const response = await fetch("http://localhost:8080/api/todos", {
                method: "GET",
                credentials: "include",
                headers: { "Accept": "application/json" },
            });

            if (!response.ok) throw new Error(`Fehler: ${response.statusText}`);
            const data = await response.json();

            console.log("[DEBUG] API Todos:", data);
            setTodos(data);
            logEvent("SUCCESS", "Todos erfolgreich geladen", { todoCount: data.length });
        } catch (error) {
            console.error("[DEBUG] Fehler in fetchTodos()", error);
            logEvent("ERROR", "Fehler beim Abrufen der Todos", error);
        }
    };

    // Todos beim ersten Laden abrufen
    useEffect(() => {
        console.log("[DEBUG] useEffect wird ausgeführt...");
        fetchTodos();
    }, [user, navigate]);

    // Neues Todo hinzufügen
    const addTodo = async () => {
        if (!newTodo.trim()) {
            logEvent("WARNING", "Leeres Todo kann nicht hinzugefügt werden.");
            return;
        }

        console.log("[DEBUG] addTodo() wird aufgerufen mit:", newTodo);
        logEvent("INFO", "Neues Todo wird hinzugefügt", { title: newTodo });

        try {
            const response = await fetch("http://localhost:8080/api/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ title: newTodo }),
            });

            if (!response.ok) throw new Error("Fehler beim Speichern des Todos");
            const data = await response.json();

            console.log("[DEBUG] Todo erfolgreich erstellt:", data);

            setNewTodo(""); // Eingabefeld leeren
            fetchTodos(); // Direkt nach dem Erstellen die Liste neu abrufen
            logEvent("SUCCESS", "Todo erfolgreich gespeichert", { id: data.id, title: data.title });
        } catch (error) {
            console.error("[DEBUG] Fehler in addTodo()", error);
            logEvent("ERROR", "Fehler beim Speichern des Todos", error);
        }
    };

    // Todo löschen
    const deleteTodo = async (id) => {
        if (!id) {
            logEvent("ERROR", "Ungültige Todo-ID beim Löschen");
            return;
        }

        console.log("[DEBUG] deleteTodo() wird aufgerufen mit ID:", id);
        logEvent("INFO", "Todo wird gelöscht", { id });

        try {
            const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
                method: "DELETE",
                headers: { "Accept": "application/json" },
                credentials: "include",
            });

            if (!response.ok) throw new Error("Fehler beim Löschen des Todos");

            fetchTodos(); // Todos neu abrufen
            logEvent("SUCCESS", "Todo erfolgreich gelöscht", { id });
        } catch (error) {
            console.error("[DEBUG] Fehler in deleteTodo()", error);
            logEvent("ERROR", "Fehler beim Löschen des Todos", error);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-lg w-full animate-fadeIn text-gray-900">
                <BackButton />
                <LogoutButton />

                <h1 className="text-3xl font-bold mb-3 text-blue-600">Meine Todos</h1>
                <p className="text-gray-600 mb-6">Verwalte deine Aufgaben effizient und bleib organisiert.</p>

                {/* Eingabefeld */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Neues Todo hinzufügen..."
                        className="border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none p-3 rounded-lg w-full transition"
                    />
                    <button
                        onClick={addTodo}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-full transition hover:bg-blue-600 hover:scale-105 shadow-md"
                    >
                        ➕
                    </button>
                </div>

                {/* To-Do-Liste */}
                <div className="mt-4">
                    {todos.length === 0 ? (
                        <p className="text-gray-500">Keine Todos vorhanden.</p>
                    ) : (
                        <div className="space-y-3">
                            {todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md transition"
                                >
                                    <span className="text-gray-800">{todo.title}</span>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg transition hover:bg-red-600 hover:scale-105 shadow-sm"
                                        onClick={() => deleteTodo(todo.id)}
                                    >
                                        ❌ Löschen
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}