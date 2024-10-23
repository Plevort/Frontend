<!-- src/lib/Sidebar.svelte -->
<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
    import { socketStore } from '../stores/socket.js'; // Adjust the path as needed
  
    let chats = [];
    let socket;
  
    // Fetch chats from API
    async function fetchChats() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage. Please log in again.');
            return;
        }
  
        const response = await fetch('https://plevortapi.fryde.id.lv/v1/chat/list', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
  
        if (response.ok) {
            const data = await response.json();
            chats = data.map(chat => ({
                id: chat.id,
                name: chat.name,
                lastMessage: chat.lastMessage || '', 
                pfp: 'https://plevort.fryde.id.lv/default.png' 
            }));
        } else {
            console.error('Failed to fetch chats:', response.statusText);
        }
    }
  
    onMount(() => {
        const unsubscribe = socketStore.subscribe(value => {
            socket = value;
        });
  
        fetchChats();
  
        if (socket) {
            socket.on('chat_update', () => {
                fetchChats();
            });
        }
  
        return () => {
            unsubscribe(); 
            if (socket) {
                socket.off('chat_update');
            }
        };
    });
  
    function goToChat(id) {
        goto(`/chat/${id}`);
    }
  
    function goToAddChat() {
        goto('/createchat'); 
    }
  
    function goToFriendManagement() {
        goto('/friends'); 
    }
  </script>
  
  <div class="sidebar">
    <div class="sidebar-header">
        <h1 class="title">Chats</h1>
    </div>
    <div class="buttons">
        <button on:click={goToAddChat}>Message</button>
        <button on:click={goToFriendManagement}>Friends</button>
    </div>
    
    <div class="user-list">
        {#if chats.length > 0}
            {#each chats as chat}
                <div class="user" on:click={() => goToChat(chat.id)}>
                    <img src={chat.pfp} alt={chat.name} class="profile-pic" />
                    <div class="user-details">
                        <p class="user-name">{chat.name}</p>
                        <p class="last-message">{chat.lastMessage}</p>
                    </div>
                </div>
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
    margin: 0;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.title {
    font-size: 24px;
    margin: 0;
}

.buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px; 
}

button {
    background-color: #3c3c3c; 
    border: none;
    color: #fff;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #505050;
}

.user-list {
    flex-grow: 1;
    overflow-y: auto; 
    scrollbar-width: thin; 
    scrollbar-color: #3c3c3c #1c1c1c; 
}

.user-list::-webkit-scrollbar {
    width: 8px; 
}

.user-list::-webkit-scrollbar-track {
    background: #1c1c1c; 
}

.user-list::-webkit-scrollbar-thumb {
    background-color: #3c3c3c; 
    border-radius: 5px; 
}

.user-list::-webkit-scrollbar-thumb:hover {
    background-color: #505050; 
}

.user {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    cursor: pointer;
    margin-bottom: 10px;
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

.user-details {
    display: flex;
    flex-direction: column;
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

@media (max-width: 768px) {
    .sidebar {
        width: 100%; 
        height: 100vh;
    }
}
</style>
