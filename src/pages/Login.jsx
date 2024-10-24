import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customFetch from '../../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await customFetch.post('api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (error) {
            alert('Login failed');
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
