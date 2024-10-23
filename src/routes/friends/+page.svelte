<script>
    import { onMount } from 'svelte';
    import { socketStore } from '../../stores/socket.js';
    import "$lib/global.css";

    let friends = [];
    let incomingRequests = [];
    let friendUsername = '';
    let socket;
    let feedbackMessage = '';
    let feedbackColor = ''; 

    const getToken = () => localStorage.getItem('token');

    const fetchFriends = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch('https://plevortapi.fryde.id.lv/v1/friend/friends', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                feedbackMessage = response.status === 403 
                    ? 'Access forbidden. Please check your permissions.' 
                    : 'Failed to fetch friends.';
                feedbackColor = 'red';
                return;
            }

            const data = await response.json();
            friends = data.friends && data.friends.length > 0 ? data.friends : [];
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchIncomingRequests = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch('https://plevortapi.fryde.id.lv/v1/friend/incoming', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) return;

            const data = await response.json();
            incomingRequests = data.incomingRequests && data.incomingRequests.length > 0 ? data.incomingRequests : [];
        } catch (error) {
            console.error('Error fetching incoming requests:', error);
        }
    };

    const acceptRequest = async (id) => {
        const token = getToken();
        try {
            const response = await fetch('https://plevortapi.fryde.id.lv/v1/friend/accept', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) return;

            incomingRequests = incomingRequests.filter(request => request.id !== id);
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const declineRequest = async (id) => {
        const token = getToken();
        try {
            const response = await fetch('https://plevortapi.fryde.id.lv/v1/friend/decline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) return;

            incomingRequests = incomingRequests.filter(request => request.id !== id);
        } catch (error) {
            console.error('Error declining request:', error);
        }
    };

    onMount(() => {
        const unsubscribe = socketStore.subscribe(value => {
            socket = value;
        });

        fetchFriends();
        fetchIncomingRequests();

        return () => {
            unsubscribe();
        };
    });

    const addFriend = async () => {
        const token = getToken();
        if (token) {
            try {
                const response = await fetch('https://plevortapi.fryde.id.lv/v1/friend/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ username: friendUsername })
                });

                const data = await response.json();
                
                if (data.success) {
                    friends.push({ displayName: friendUsername });
                    feedbackMessage = 'Friend request sent successfully!';
                    feedbackColor = 'green';
                } else {
                    feedbackMessage = data.error || 'An unexpected error occurred';
                    feedbackColor = 'red';
                }
            } catch (error) {
                feedbackMessage = 'An error occurred while adding friend';
                feedbackColor = 'red';
            }
            friendUsername = '';
        } else {
            feedbackMessage = 'Token is missing. Please log in again.';
            feedbackColor = 'red';
        }
    };
</script>

<div>
    <h2>Friends List</h2>
    {#if friends.length === 0}
        <p>No friends found.</p>
    {:else}
        <div class="friend-list">
            {#each friends as friend}
                <div class="friend">
                    <span>{friend.displayName}</span>
                </div>
            {/each}
        </div>
    {/if}

    <h2>Incoming Friend Requests</h2>
    {#if incomingRequests.length === 0}
        <p>No incoming friend requests.</p>
    {:else}
        <div class="incoming-requests">
            {#each incomingRequests as request}
                <div class="request">
                    <span>{request.displayName}</span>
                    <button on:click={() => acceptRequest(request.id)}>Accept</button>
                    <button on:click={() => declineRequest(request.id)}>Decline</button>
                </div>
            {/each}
        </div>
    {/if}

    <h2>Add a Friend by Username</h2>
    <div class="add-friend">
        <input 
            type="text" 
            placeholder="Enter friend's username" 
            bind:value={friendUsername} 
        />
        <button on:click={addFriend}>Add Friend</button> 
    </div>
    
    {#if feedbackMessage}
        <p style="color: {feedbackColor}; margin-top: 5px;">{feedbackMessage}</p>
    {/if}
</div>

<style>
    /* General dark theme styling */
body {
    background-color: #1c1c1c; /* Dark background */
    color: #eaeaea; /* Light text */
    font-family: Arial, sans-serif;
}

h2 {
    color: #ffffff; /* White for headers */
    font-size: 1.5rem;
    margin-bottom: 20px;
}

/* Container styling */
div {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #444; /* Darker border */
    border-radius: 8px;
    background-color: #2a2a2a; /* Slightly lighter dark background */
}

/* Scrollable friend list and requests */
.friend-list, .incoming-requests {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #333; /* Darker background for lists */
    border-radius: 5px;
    max-height: 200px; /* Limit height */
    overflow-y: auto; /* Enable scrolling */
}

/* Individual friend or request */
.friend, .request {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #555; /* Darker border */
    font-size: 1em;
}

.friend:last-child, .request:last-child {
    border-bottom: none;
}

button {
    background-color: #4a4a4a; /* Dark button */
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 0.9em;
}

button:hover {
    background-color: #606060; /* Slightly lighter on hover */
}

/* Input field for adding a friend */
.add-friend {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.add-friend input {
    flex: 1;
    padding: 10px;
    border: 1px solid #555;
    border-radius: 5px;
    background-color: #2a2a2a;
    color: #eaeaea;
    font-size: 1em;
    transition: border-color 0.3s;
}

.add-friend input::placeholder {
    color: #999; /* Lighter placeholder text */
}

.add-friend input:focus {
    border-color: #4a90e2; /* Blue border on focus */
    outline: none;
}

.add-friend button {
    background-color: #4a90e2; /* Blue button for adding friends */
    padding: 10px 20px;
    font-size: 1em;
}

.add-friend button:hover {
    background-color: #357ab9; /* Slightly darker blue on hover */
}

/* Mobile responsiveness */
@media (max-width: 600px) {
    div {
        padding: 15px; /* Adjust padding on mobile */
    }

    h2 {
        font-size: 1.25rem; /* Smaller font size for headings */
    }

    .friend, .request {
        flex-direction: column; /* Stack items vertically */
        align-items: flex-start;
        padding: 10px 0; /* Extra padding for spacing */
    }

    button {
        width: 100%; /* Full width for buttons on mobile */
        padding: 10px;
        margin-top: 5px; /* Extra margin for spacing */
    }
}
</style>