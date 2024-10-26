// /src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${config.API_URL}/v1/login`, 
                { email, password }, 
                {
                    validateStatus: (status) => status >= 200 && status < 300
                }
            );
            
            console.log("Response from server:", response);

            if (response.data.success) {
                setMessage(response.data.message);
                setIsError(false);
                localStorage.setItem('token', response.data.token);
                setTimeout(() => navigate('/'), 1500);
            } else {
                setMessage(response.data.message);
                setIsError(true);
            }
        } catch (error) {
            console.error("Error during login request:", error);
            
            setMessage('Something went wrong. Please try again.');
            setIsError(true);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2 className="login-title">Welcome Back</h2>
                <div className="input-container">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                {message && (
                    <p className={isError ? 'error-message' : 'success-message'}>{message}</p>
                )}
                <button type="submit" className="login-button">Login</button>

                <div className="login-small-text">
                    <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                    <p>Don't have an account? <a href="/register" className="register-link">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
