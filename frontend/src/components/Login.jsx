// src/components/Login.jsx
import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [_storedUsername, setStoredUsername] = useLocalStorage('username', '');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include', // Wichtig: Session-Cookies senden
            });

            if (response.ok) {
                setStoredUsername(username);
                onLogin();
            } else {
                const errorText = await response.text();
                alert('Fehler: ' + errorText); // Zeigt die Fehlermeldung vom Server an
            }
        } catch (error) {
            console.error('Fehler bei der Anmeldung:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Benutzername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Anmelden</button>
        </form>
    );
}

export default Login;
