import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ IMPORT HINZUFÜGEN!
import ToDoList from "../components/ToDoList";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function ToDoPage() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const navigate = useNavigate(); // ⬅️ NAVIGATION HINZUFÜGEN!

    useEffect(() => {
        fetch("http://localhost:8080/todos", {
            method: "GET",
            credentials: "include", // Session mit Cookies senden!
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                if (response.status === 401) { // ⬅️ Falls nicht authentifiziert
                    navigate("/login"); // ⬅️ Zur Login-Seite umleiten!
                    return;
                }
                return response.json();
            })
            .then((data) => setTodos(data))
            .catch((error) => console.error("Fehler beim Laden der Todos:", error));
    }, [navigate]);

    const addTodo = () => {
        if (!newTodo.trim()) return; // Leere Eingaben verhindern

        fetch("http://localhost:8080/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // WICHTIG: Session mit senden
            body: JSON.stringify({ title: newTodo }),
        })
            .then((response) => {
                if (response.status === 401) {
                    navigate("/login"); // Falls nicht authentifiziert, zurück zur Login-Seite
                    return;
                }
                return response.json();
            })
            .then((data) => setTodos([...todos, data]))
            .catch((error) => console.error("Fehler beim Speichern:", error));

        setNewTodo("");
    };

    const deleteTodo = (id) => {
        fetch(`http://localhost:8080/todos/${id}`, {
            method: "DELETE",
            credentials: "include", // WICHTIG: Session mit senden
        })
            .then((response) => {
                if (response.status === 401) {
                    navigate("/login"); // Falls nicht authentifiziert, zurück zur Login-Seite
                    return;
                }
                setTodos(todos.filter(todo => todo.id !== id));
            })
            .catch((error) => console.error("Fehler beim Löschen:", error));
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <h1 className="text-center mb-4">📝 Meine To-Do Liste</h1>

                    {/* Eingabefeld und Button */}
                    <Form onSubmit={(e) => e.preventDefault()} className="d-flex mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Neues Todo..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                        />
                        <Button variant="primary" className="ms-2" onClick={addTodo}>
                            ➕ Hinzufügen
                        </Button>
                    </Form>

                    {/* ToDoList-Komponente */}
                    <ToDoList todos={todos} deleteTodo={deleteTodo} />
                </Col>
            </Row>
        </Container>
    );
}

export default ToDoPage;
