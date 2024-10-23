<script>
    import { goto } from '$app/navigation'; 
    import "$lib/global.css";
    import { onMount } from 'svelte';

    let friends = [];
    let selectedChatType = null;

    async function fetchFriends() {
        const token = localStorage.getItem('token');
        const response = await fetch('https://plevortapi.fryde.id.lv/v1/friend/friends', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            friends = data.friends.map(friend => ({
                id: friend.id,
                name: friend.displayName
            }));
        } else {
            console.error('Failed to fetch friends:', response.statusText);
        }
    }

    onMount(() => {
        fetchFriends();
    });

    function selectChatType(type) {
        selectedChatType = type;
    }

    async function startChat(friendId) {
        const token = localStorage.getItem('token');
        const response = await fetch('https://plevortapi.fryde.id.lv/v1/createchat/directmessage', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: friendId })
        });

        if (response.ok) {
            const data = await response.json();
            const chatId = data.chatId;
            goto(`/chat/${chatId}`);
        } else {
            console.error('Failed to create chat:', response.statusText);
        }
    }
</script>

<div class="add-chat-container">
    {#if !selectedChatType}
        <h2>Select Chat Type</h2>
        <button on:click={() => selectChatType('direct')}>Direct Message</button>
        <button class="inactive">Group</button>
        <button class="inactive">Server</button>
    {:else if selectedChatType === 'direct'}
        <h2>Direct Message</h2> 
        <h2>Your Friends</h2>
        <div class="friend-list">
            {#each friends as friend}
                <div class="friend" on:click={() => startChat(friend.id)}>
                    <span>{friend.name}</span>
                    <button>Chat</button>
                </div>
            {/each}
        </div>
        <button class="back-button" on:click={() => selectedChatType = null}>Back</button>
    {/if}
</div>

<style>
    body {
        background-color: #1c1c1c;
        color: #eaeaea;
        font-family: Arial, sans-serif;
    }

    .add-chat-container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #2a2a2a;
        border-radius: 8px;
        text-align: center;
    }

    h2 {
        color: #ffffff;
        margin-bottom: 20px;
    }

    button {
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 1em;
        margin: 10px;
    }

    button:hover {
        background-color: #357ab9;
    }

    .inactive {
        background-color: #555; 
        color: #999; 
        cursor: not-allowed; 
    }

    .inactive:hover {
        background-color: #555; 
    }

    .friend-list {
        margin-top: 20px;
        padding: 10px;
        background-color: #333;
        border-radius: 5px;
        max-height: 200px;
        overflow-y: auto;
    }

    .friend {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #555;
        font-size: 1em;
    }

    .friend:last-child {
        border-bottom: none;
    }

    .back-button {
        background-color: #4a4a4a;
        margin-top: 20px;
    }

    .back-button:hover {
        background-color: #606060;
    }

    @media (max-width: 600px) {
        .add-chat-container {
            padding: 15px;
        }

        h2 {
            font-size: 1.25rem;
        }

        button {
            width: 100%;
        }

        .friend {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
