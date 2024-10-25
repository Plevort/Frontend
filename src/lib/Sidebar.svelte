<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { socketStore } from '../stores/socket.js';

    let chats = writable([]);

    async function fetchChats() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage. Please log in again.');
            return;
        }

        console.log('Fetching chats...');
        const response = await fetch('https://plevortapi.fryde.id.lv/v1/chat/list', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Fetched chats:', data);
            chats.set(data.map(chat => ({
                id: chat.id,
                name: chat.name,
                lastMessage: chat.lastMessage || '',
                pfp: 'https://plevort.fryde.id.lv/default.png'
            })));
        } else {
            console.error('Failed to fetch chats:', response.statusText);
        }
    }

    function navigateToChat(id) {
        console.log('Navigating to chat:', id);
        window.location.href = `/chat/${id}`; 
    }

    function navigateToFriends() {
        console.log('Navigating to friends page');
        window.location.href = '/friends';
    }

    function createNewChat() {
        console.log('Creating a new chat');
        window.location.href = '/create-chat';
    }

    onMount(() => {
        console.log('Sidebar component mounted, fetching chats...');
        fetchChats();
    });
</script>

<div class="sidebar">
    <div class="sidebar-header">
        <h1 class="title">Chats</h1>
        <div class="button-container">
            <button class="sidebar-button" on:click={navigateToFriends}>Friends</button>
            <button class="sidebar-button" on:click={createNewChat}>Create Chat</button>
        </div>
    </div>
    
    <div class="user-list">
        {#if $chats.length > 0}
            {#each $chats as chat}
                <a class="user" href={`/chat/${chat.id}`} on:click|preventDefault={() => navigateToChat(chat.id)}>
                    <img src={chat.pfp} alt={chat.name} class="profile-pic" />
                    <div class="user-details">
                        <p class="user-name">{chat.name}</p>
                        <p class="last-message">{chat.lastMessage}</p>
                    </div>
                </a>
            {/each}
        {:else}
            <p>No chats</p>
        {/if}
    </div>
</div>

<style>
    .sidebar {
        width: 300px; 
        height: 100vh; 
        background-color: #1c1c1c; 
        color: #fff;
        padding: 20px;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column; /* Ensures children stack vertically */
    }

    .sidebar-header {
        display: flex;
        flex-direction: column; /* Stack title and buttons vertically */
        align-items: flex-start; /* Align items to the left */
    }

    .button-container {
        margin-bottom: 10px; /* Space below buttons */
    }

    .sidebar-button {
        display: block; /* Ensure buttons take full width */
        width: calc(100% - 20px); /* Adjust width for padding */
        padding: 15px; /* Height of the button */
        background-color: #333; 
        color: #fff; 
        border: none; 
        border-radius: 5px; 
        cursor: pointer; 
        transition: background-color 0.3s ease;
        margin-bottom: 10px; /* Space between buttons */
        font-size: 16px; /* Increased font size for better readability */
        text-align: center; /* Center text horizontally */
    }

    .sidebar-button:hover {
        background-color: #555; 
    }

    .user-list {
        flex-grow: 1;
        overflow-y: auto; 
    }

    .user {
        display: flex;
        align-items: center;
        padding: 10px;
        border-radius: 5px;
        transition: background-color 0.3s ease;
        cursor: pointer; 
        margin-bottom: 10px;
        text-decoration: none; 
        color: inherit;
    }

    .user:hover {
        background-color: #333; 
    }

    .profile-pic {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .user-name {
        font-weight: bold;
        margin: 0;
    }

    .last-message {
        font-size: 14px;
        color: #ccc; 
        margin: 0;
    }
</style>
