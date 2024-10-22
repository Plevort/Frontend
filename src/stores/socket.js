// src/stores/socket.js
import { writable } from 'svelte/store';
import { io } from 'socket.io-client';

// Create a writable store to manage the socket instance
export const socketStore = writable(null);

// Initialize the socket connection only in the browser
if (typeof window !== 'undefined') {
    // Access localStorage in the client-side
    const token = localStorage.getItem('token');

    // Ensure the token exists before attempting to connect
    if (token) {
        const socket = io('https://plevortapi.fryde.id.lv', {  // Use 'https' instead of 'wss'
            auth: {
                token: token // Send token as part of the connection
            },
            transports: ['websocket'], // Prefer WebSocket transport if available
        });

        // Update the store with the socket instance
        socketStore.set(socket);

        // Log when the socket connects and disconnects
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected from WebSocket server:', reason);
        });

        // Handle connection errors
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error.message);
        });

        // Handle authentication errors
        socket.on('connect_timeout', () => {
            console.error('Connection timed out. Please try again later.');
        });
    } else {
        console.error('No token found in localStorage. Please log in again.');
    }
}
