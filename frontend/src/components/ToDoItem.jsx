// src/components/ToDoItem.jsx
import { ListGroup, Button } from "react-bootstrap";

export default function ToDoItem({ todo, deleteTodo }) {
    return (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg mb-2">
            <span>{todo.title}</span>
        </div>
    );
}