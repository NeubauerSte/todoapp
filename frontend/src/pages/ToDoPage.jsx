import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ToDoList from "../components/ToDoList";
import BackButton from "../components/BackButton";
import LogoutButton from "../components/LogoutButton";

const ToDoPage = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        fetch("http://localhost:8080/todos", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (!Array.isArray(data)) {
                    console.error("Fehler: Erwartete ein Array von Todos", data);
                    return;
                }
                setTodos(data);
            })
            .catch((error) => console.error("Fehler beim Abrufen der Todos:", error));
    }, [isAuthenticated, navigate]);

    const addTodo = () => {
        if (!newTodo.trim()) return;

        fetch("http://localhost:8080/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ title: newTodo }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data || !data.id || !data.title) {
                    console.error("Fehlerhafte Antwort vom Server:", data);
                    return;
                }
                setTodos([...todos, { id: data.id, title: data.title }]);
            })
            .catch((error) => console.error("Fehler beim Speichern:", error));

        setNewTodo("");
    };

    const deleteTodo = (id) => {
        if (!id) {
            console.error("Fehler: Todo-ID ist undefined");
            return;
        }

        fetch(`http://localhost:8080/todos/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then(() => {
                setTodos(todos.filter(todo => todo.id !== id));
            })
            .catch((error) => console.error("Fehler beim Löschen:", error));
    };

    return (
        <div className="page-container">
            <BackButton redirectTo="/" />
            <LogoutButton />
            <h1>Meine Todos</h1>
            <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Neues Todo..."
            />
            <button onClick={addTodo}>Hinzufügen</button>
            <ToDoList todos={todos} deleteTodo={deleteTodo} />
        </div>
    );
};

export default ToDoPage;
