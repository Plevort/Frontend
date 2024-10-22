<!-- src/routes/friendmanagement/+page.svelte -->
<script>
    import { onMount } from 'svelte';
    import { socketStore } from '../../stores/socket.js'; // Adjust path if necessary

    let friends = []; // Array to hold friends list
    let incomingRequests = []; // Array to hold incoming friend requests
    let socket;

    // Use the socket store
    onMount(() => {
        const unsubscribe = socketStore.subscribe(value => {
            socket = value; // Subscribe to the socket store to get the socket instance
        });

        // Example: Fetch friends and incoming requests (replace with actual implementation)
        fetchFriends();
        fetchIncomingRequests();

        return () => {
            unsubscribe(); // Unsubscribe when the component is destroyed
        };
    });

    const fetchFriends = () => {
        // Replace with actual socket or API call to fetch friends
        friends = [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Smith' },
            { id: 3, name: 'Alice Johnson' },
            { id: 4, name: 'Bob Brown' },
        ];
    };

    const fetchIncomingRequests = () => {
        // Replace with actual socket or API call to fetch incoming friend requests
        incomingRequests = [
            { id: 5, name: 'Tom Green' },
            { id: 6, name: 'Emily White' },
        ];
    };

    const acceptRequest = (id) => {
        // Emit socket event to accept the friend request
        socket.emit('accept friend request', { requesterId: id });
        incomingRequests = incomingRequests.filter(req => req.id !== id); // Remove from the incoming requests
    };

    const denyRequest = (id) => {
        // Emit socket event to deny the friend request
        socket.emit('deny friend request', { requesterId: id });
        incomingRequests = incomingRequests.filter(req => req.id !== id); // Remove from the incoming requests
    };

    const removeFriend = (id) => {
        // Emit socket event to remove a friend
        socket.emit('remove friend', { friendId: id });
        friends = friends.filter(friend => friend.id !== id); // Remove from the friends list
    };
</script>

<style>
    div {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #444; /* Darker border */
        border-radius: 8px;
        background-color: #2c2c2c; /* Darker background */
        color: #fff;
    }

    h2 {
        margin-bottom: 20px;
        color: #f1f1f1; /* Light color for headings */
        font-size: 1.5em; /* Larger font size for headings */
    }

    .friend-list, .incoming-requests {
        margin-bottom: 20px;
        padding: 10px;
        background-color: #3a3a3a; /* Darker background for lists */
        border-radius: 5px;
    }

    .friend, .request {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #555; /* Darker border for list items */
        font-size: 1em; /* Standard font size */
    }

    .friend:last-child, .request:last-child {
        border-bottom: none;
    }

    button {
        background-color: #4a4a4a; /* Darker button background */
        color: white;
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 0.9em; /* Slightly smaller font for buttons */
    }

    button:hover {
        background-color: #606060; /* Slightly lighter on hover */
    }

    @media (max-width: 600px) {
        div {
            padding: 15px; /* Reduce padding on mobile */
        }

        h2 {
            font-size: 1.25em; /* Smaller font size for headings on mobile */
        }

        .friend, .request {
            flex-direction: column; /* Stack items vertically */
            align-items: flex-start; /* Align items to start */
            padding: 10px 0; /* Padding for better spacing */
        }

        button {
            width: 100%; /* Full width for buttons */
            padding: 10px; /* More padding for touch targets */
            margin-top: 5px; /* Margin for spacing */
        }
    }
</style>

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
</div>
