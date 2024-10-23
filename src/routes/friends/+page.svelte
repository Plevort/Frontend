<script>
    import { onMount } from 'svelte';
    import { socketStore } from '../../stores/socket.js';

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

    import '../../styles/friends.css';
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
