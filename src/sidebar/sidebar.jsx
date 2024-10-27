import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import './sidebar.css';

const Sidebar = () => {
    const [chats, setChats] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchChats = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }
            
            try {
                const response = await axios.get(`${config.API_URL}/v1/chat/list`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setChats(response.data);
            } catch (error) {
                console.error('Failed to fetch chat list:', error);
            }
        };

        fetchChats();
    }, []);

    const handleRedirect = (path) => {
        window.location.href = path;
    };

    return (
        <>
            <button 
                className="sidebar-toggle" 
                onClick={() => setSidebarOpen(true)}
                style={{ display: sidebarOpen ? 'none' : 'block' }}
            >
                ☰
            </button>
            
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <button 
                    className="close-sidebar" 
                    onClick={() => setSidebarOpen(false)}
                >
                    ✖
                </button>
                <div className="sidebar-header">
                    <button onClick={() => handleRedirect('/friends')} className="header-button">Friends</button>
                    <button onClick={() => handleRedirect('/create-chat')} className="header-button">Create Chat</button>
                </div>
                <div className="chat-list">
                    {chats.map(chat => (
                        <div 
                            key={chat.id} 
                            className="chat-item" 
                            onClick={() => handleRedirect(`/chat/${chat.id}`)}
                        >
                            <img src="https://plevort.fryde.id.lv/default.png" alt="Profile" className="chat-pfp" />
                            <div className="chat-info">
                                <div className="chat-name">{chat.name}</div>
                                <div className="chat-last-message">{chat.lastMessage}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
