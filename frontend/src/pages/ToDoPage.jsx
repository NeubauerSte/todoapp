import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ToDoList from "../components/ToDoList";
import { AuthContext } from "../context/AuthContext";
import logEvent from "../utils/logEvent";
import BackButton from "../components/BackButton.jsx";
import LogoutButton from "../components/LogoutButton.jsx";

const ToDoPage = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated) {
            logEvent("WARNING", "Nicht authentifizierter Zugriff auf ToDoPage, Weiterleitung zur Login-Seite.");
            navigate("/login");
            return;
        }

        logEvent("INFO", "Lade Todos...");
        fetch("http://localhost:8080/todos", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Fehler: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!Array.isArray(data)) {
                    throw new Error("Unerwartetes Datenformat");
                }
                setTodos(data);
                logEvent("SUCCESS", "Todos erfolgreich geladen", { todoCount: data.length });
            })
            .catch((error) => {
                logEvent("ERROR", "Fehler beim Abrufen der Todos", error);
            });
    }, [isAuthenticated, navigate]);

    const addTodo = () => {
        if (!newTodo.trim()) {
            logEvent("WARNING", "Leeres Todo kann nicht hinzugefügt werden.");
            return;
        }

        logEvent("INFO", "Neues Todo wird hinzugefügt", { title: newTodo });

        fetch("http://localhost:8080/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ title: newTodo }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Fehler beim Speichern des Todos");
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.id || !data.title) {
                    throw new Error("Ungültige Serverantwort");
                }
                setTodos([...todos, { id: data.id, title: data.title }]);
                setNewTodo("");
                logEvent("SUCCESS", "Todo erfolgreich gespeichert", { id: data.id, title: data.title });
            })
            .catch((error) => {
                logEvent("ERROR", "Fehler beim Speichern des Todos", error);
            });
    };

    const deleteTodo = (id) => {
        if (!id) {
            logEvent("ERROR", "Ungültige Todo-ID beim Löschen");
            return;
        }

        logEvent("INFO", "Todo wird gelöscht", { id });

        fetch(`http://localhost:8080/todos/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Fehler beim Löschen des Todos");
                }
                setTodos(todos.filter((todo) => todo.id !== id));
                logEvent("SUCCESS", "Todo erfolgreich gelöscht", { id });
            })
            .catch((error) => {
                logEvent("ERROR", "Fehler beim Löschen des Todos", error);
            });
    };

    return (
        <div className="page-container">
            <BackButton />
            <LogoutButton />
            <h1>Meine Todos</h1>
            <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Neues Todo..."
            />
            <button onClick={addTodo}>➕ Hinzufügen</button>

            <ToDoList todos={todos} deleteTodo={deleteTodo} />
        </div>
    );
};

export default ToDoPage;
