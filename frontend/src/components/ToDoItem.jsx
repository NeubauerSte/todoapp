// src/components/ToDoItem.jsx
import { ListGroup, Button } from "react-bootstrap";

function ToDoItem({ todo, deleteTodo }) {
    return (
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>{todo.title}</span>
            <Button variant="danger" size="sm" onClick={() => deleteTodo(todo.id)}>
                ❌ Löschen
            </Button>
        </ListGroup.Item>
    );
}

export default ToDoItem;
