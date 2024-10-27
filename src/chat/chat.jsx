// /src/chat/chat.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import config from '../config';
import Sidebar from '../sidebar/sidebar';
import './chat.css';

const Chat = () => {
    const { id: chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false); 
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const previousScrollHeight = useRef(0);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const socket = io(config.API_URL, {
            query: { chatId },
            transports: ['websocket'],
            auth: { token: `Bearer ${token}` },
        });

        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });

        return () => {
            socket.disconnect();
        };
    }, [chatId, token]);

    useEffect(() => {
        loadMessages(page);
    }, [page]);

    const loadMessages = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL}/v1/message/read`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { cid: chatId, p: page },
            });

            if (page === 1) {
                setMessages(response.data.messages);
                setTimeout(() => scrollToBottom(), 100);
            } else {
                const messagesContainer = messagesContainerRef.current;
                const currentScrollHeight = messagesContainer.scrollHeight;
                setMessages((prevMessages) => [
                    ...response.data.messages,
                    ...prevMessages,
                ]);

                setTimeout(() => {
                    const newScrollHeight = messagesContainer.scrollHeight;
                    messagesContainer.scrollTop += newScrollHeight - currentScrollHeight;
                }, 0);
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
        setLoading(false);
    };

    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && !loading) {
            previousScrollHeight.current = e.target.scrollHeight;
            setPage((prevPage) => prevPage + 1);
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const response = await axios.post(`${config.API_URL}/v1/message/send`, {
                chatId,
                content: newMessage,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 201) {
                setNewMessage('');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="chat-page">
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <button className="close-button" onClick={toggleSidebar}>X</button>
                <Sidebar />
            </div>
            <div className="chat-container">
                <button className="hamburger-button" onClick={toggleSidebar}>☰</button>
                <div
                    className="messages"
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                >
                    {messages.map((msg) => (
                        <div key={msg.mid} className="message">
                            <div className="message-header">
                                <img src="https://plevort.fryde.id.lv/default.png" alt="PFP" className="message-pfp" />
                                <span className="message-username">{msg.displayName}</span>
                            </div>
                            <div className="message-content">{msg.cnt}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="message-input-container">
                    <input
                        type="text"
                        className="message-input"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSendMessage} className="send-button">Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
