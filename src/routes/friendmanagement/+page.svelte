<script>
    import { onMount } from 'svelte';
    import { socketStore } from '../../stores/socket.js';
    import { get } from 'svelte/store';

    let friends = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Mike Johnson' }
    ];

    let incomingRequests = [
        { id: 4, name: 'Alice Brown' },
        { id: 5, name: 'Bob White' }
    ];

    let friendUsername = ''; 
    let socket;

    export let token = ''; 

    onMount(() => {
        const unsubscribe = socketStore.subscribe(value => {
            socket = value; 
        });

        if (socket) {

            socket.on('friend added', fetchFriends);
            socket.on('request updated', fetchIncomingRequests);
        }

        return () => {
            unsubscribe();
        };
    });

    const acceptRequest = (id) => {
        if (socket) {
            socket.emit('accept friend request', { requesterId: id });
            incomingRequests = incomingRequests.filter(req => req.id !== id);
        }
    };

    const denyRequest = (id) => {
        if (socket) {
            socket.emit('deny friend request', { requesterId: id });
            incomingRequests = incomingRequests.filter(req => req.id !== id);
        }
    };

    const removeFriend = (id) => {
        if (socket) {
            socket.emit('remove friend', { friendId: id });
            friends = friends.filter(friend => friend.id !== id);
        }
    };

    const addFriend = (username) => {
        if (socket) {
            socket.emit('add friend', { username });
            console.log(`Adding friend with username: ${username}`);

            // Example: Adding new friend to the list locally for demo purposes
            friends.push({ id: Date.now(), name: username });
            friendUsername = ''; 
        }
    };
</script>

<link rel="stylesheet" href="/src/styles/friends.css">

<div>
    <h2>Friends List</h2>
    <div class="friend-list">
        {#each friends as friend}
            <div class="friend">
                <span>{friend.name}</span>
                <button on:click={() => removeFriend(friend.id)}>Remove</button>
            </div>
        {/each}
    </div>

    <h2>Incoming Friend Requests</h2>
    <div class="incoming-requests">
        {#each incomingRequests as request}
            <div class="request">
                <span>{request.name}</span>
                <div>
                    <button on:click={() => acceptRequest(request.id)}>Accept</button>
                    <button on:click={() => denyRequest(request.id)}>Deny</button>
                </div>
            </div>
        {/each}
    </div>

    <h2>Add a Friend by Username</h2>
    <div class="add-friend">
        <input type="text" placeholder="Enter friend's username" bind:value={friendUsername} />
        <button on:click={() => addFriend(friendUsername)}>Add Friend</button>
    </div>
</div>
