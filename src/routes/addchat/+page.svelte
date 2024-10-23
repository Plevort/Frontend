<script>
    import { goto } from '$app/navigation'; 
    import '../../styles/addchat.css'; 

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
