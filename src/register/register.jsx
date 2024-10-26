// /src/components/register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import './register.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordconfirm, setPasswordconfirm] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            setMessage('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
            setIsError(true);
            return;
        }

        if (password !== passwordconfirm) {
            setMessage("Passwords do not match.");
            setIsError(true);
            return;
        }

        try {
            const response = await axios.post(`${config.API_URL}/v1/register`, {
                email,
                username,
                password,
                passwordconfirm
            });

            if (response.data.success) {
                setMessage(response.data.message || 'User registered successfully');
                setIsError(false);
                
                try {
                    if (typeof window !== "undefined" && window.localStorage) {
                        localStorage.setItem('token', response.data.token);
                    } else {
                        console.warn("localStorage is not accessible.");
                    }
                } catch (storageError) {
                    console.error("localStorage access error:", storageError);
                    setMessage('Unable to save registration data locally.');
                    setIsError(true);
                    return;
                }

                setTimeout(() => navigate('/'), 1500);
            } else {
                setMessage(response.data.message || 'Registration failed.');
                setIsError(true);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Something went wrong. Please try again.');
            }
            setIsError(true);
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2 className="register-title">Create an Account</h2>
                
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
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        placeholder="Choose a username"
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
                        autoComplete="new-password"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="passwordconfirm">Confirm Password</label>
                    <input
                        type="password"
                        id="passwordconfirm"
                        name="passwordconfirm"
                        value={passwordconfirm}
                        onChange={(e) => setPasswordconfirm(e.target.value)}
                        autoComplete="new-password"
                        placeholder="Confirm your password"
                        required
                    />
                </div>

                {message && (
                    <p className={isError ? 'error-message' : 'success-message'}>{message}</p>
                )}

                <button type="submit" className="register-button">Register</button>

                <div className="login-small-text">
                    <p>Already registered? <a href="/login" className="register-link">Log in</a></p>
                </div>
            </form>
        </div>
    );
};

export default Register;
