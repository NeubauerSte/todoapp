import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");

    // Todos aus dem Backend laden
    useEffect(() => {
        fetch("http://localhost:8080/todos")
            .then((response) => response.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error("Fehler beim Laden der Todos:", error));
    }, []);

    // Neues Todo speichern
    const addTodo = () => {
        if (!newTodo.trim()) return; // Leere Eingaben verhindern

        fetch("http://localhost:8080/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTodo})
        })
            .then((response) => response.json())
            .then((data) => setTodos([...todos, data]))
            .catch((error) => console.error("Fehler beim Speichern:", error));

        setNewTodo("");
    };

    // Todo löschen
    const deleteTodo = (id) => {
        console.log("Zu löschende ID:", id); // Debugging
        fetch(`http://localhost:8080/todos/${id}`, { method: "DELETE" })
            .then(() => setTodos(todos.filter(todo => todo.id !== id)))
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

                    {/* Liste der Todos */}
                    <ListGroup>
                        {todos.length > 0 ? (
                            todos.map((todo, index) => (
                                <ListGroup.Item
                                    key={todo.id || index} // Falls id fehlt, nutze den Index als Fallback
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <span>{todo.title}</span>
                                    <Button variant="danger" size="sm" onClick={() => deleteTodo(todo.id)}>
                                        ❌ Löschen
                                    </Button>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p className="text-center text-muted">Keine Todos vorhanden</p>
                        )}
                    </ListGroup>

                </Col>
            </Row>
        </Container>
    );
}

export default App;
