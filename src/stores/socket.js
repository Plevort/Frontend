// src/stores/socket.js
import { writable } from 'svelte/store';
import { io } from 'socket.io-client';

// Initialize the WebSocket connection
const socket = io('wss://plevortapi.fryde.id.lv:443'); // Ensure this URL is correct

// Create a writable store to manage the socket instance
export const socketStore = writable(socket);

// Log when the socket connects and disconnects
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});
