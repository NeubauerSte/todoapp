import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/todos');
    };

    return (
        <div>
            <h2>Login</h2>
            <Login onLogin={handleLogin} />
        </div>
    );
}

export default LoginPage;
