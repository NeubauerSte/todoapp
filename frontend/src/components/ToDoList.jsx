// src/components/ToDoList.jsx
import ToDoItem from "./ToDoItem";
import { ListGroup } from "react-bootstrap";

function ToDoList({ todos, deleteTodo }) {
    return (
        <ListGroup>
            {todos.length > 0 ? (
                todos.map((todo) => (
                    <ToDoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} />
                ))
            ) : (
                <p className="text-center text-muted">Keine Todos vorhanden</p>
            )}
        </ListGroup>
    );
}

export default ToDoList;
