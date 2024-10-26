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
            const response = await axios.post(`${config.API_URL}/v1/login`, { email, password });
            
            console.log("Full response:", response);
            console.log("Response status:", response.status);
            console.log("Response data:", response.data);
            
            if (response.data && response.data.success) {
                setMessage(response.data.message || 'Login successful');
                setIsError(false);
                
                // Check if localStorage is accessible before attempting to use it
                try {
                    if (typeof window !== "undefined" && window.localStorage) {
                        localStorage.setItem('token', response.data.token);
                    } else {
                        console.warn("localStorage is not accessible.");
                    }
                } catch (storageError) {
                    console.error("localStorage access error:", storageError);
                    setMessage('Unable to save login data locally.');
                    setIsError(true);
                    return; // Stop further actions if localStorage fails
                }
    
                setTimeout(() => navigate('/'), 1500);
            } else {
                setMessage(response.data.message || 'Login failed.');
                setIsError(true);
            }
        } catch (error) {
            console.error("Error object:", error);
            
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Something went wrong. Please try again.');
            }
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
