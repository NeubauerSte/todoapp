import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ToDoItem from "./ToDoItem";

export default function ToDoList() {
    const { user } = useAuth(); // Nutze direkt `user` statt `isAdmin`
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        async function fetchTodos() {
            try {
                if (!user) {
                    console.warn("Kein Benutzer angemeldet, Todos werden nicht geladen.");
                    return;
                }

                // Prüfe, ob der Benutzer Admin-Rechte hat
                const isAdmin = user.roles.includes("ADMIN");
                const url = isAdmin
                    ? "http://localhost:8080/api/admin/todos"
                    : "http://localhost:8080/api/todos";

                const response = await fetch(url, {
                    credentials: "include",
                    headers: { "Accept": "application/json" }
                });

                if (!response.ok) throw new Error(`Fehler beim Laden der ToDos: ${response.statusText}`);

                const data = await response.json();
                setTodos(data);
            } catch (error) {
                console.error("Fehler beim Abrufen der ToDos:", error);
            }
        }

        fetchTodos().catch(console.error);
    }, [user]); // Überwache `user`, nicht `isAdmin`

    return (
        <div className="mt-4">
            {todos.length === 0 ? (
                <p className="text-gray-500">Keine Todos vorhanden.</p>
            ) : (
                todos.map((todo) => (
                    <ToDoItem key={todo.id} todo={todo} />
                ))
            )}
        </div>
    );
}