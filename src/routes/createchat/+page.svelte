<script>
    import { goto } from '$app/navigation'; 
    import "$lib/global.css";

    let friends = [
        { id: 1, name: 'Alice Johnson' },
        { id: 2, name: 'Bob Smith' },
        { id: 3, name: 'Charlie Brown' },
        { id: 4, name: 'Diana Prince' },
        { id: 5, name: 'Ethan Hunt' }
    ];

    let selectedChatType = null;

    function selectChatType(type) {
        selectedChatType = type;
    }

    function startChat() {
        goto('/chat'); // Redirect to the same chat page for all friends
    }
</script>

<div class="add-chat-container">
    <h2>Select Chat Type</h2>
    {#if !selectedChatType}
        <button on:click={() => selectChatType('direct')}>Direct Message</button>
        <button class="inactive">Group</button>
        <button class="inactive">Server</button>
    {:else if selectedChatType === 'direct'}
        <h2>Your Friends</h2>
        <div class="friend-list">
            {#each friends as friend}
                <div class="friend" on:click={startChat}>
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
