<!-- src/routes/friendrequest/+page.svelte -->
<script>
    import { onMount } from 'svelte';
    import { socketStore } from '../../stores/socket.js'; // Adjust path if necessary

    let username = '';
    let socket;

    // Use the socket store
    onMount(() => {
        const unsubscribe = socketStore.subscribe(value => {
            socket = value;
        });

        return () => {
            unsubscribe();
        };
    });

    const sendFriendRequest = () => {
        if (username) {
            socket.emit('send friend request', {
                requesterId: 'YOUR_REQUESTER_ID', // Replace with the actual requester ID
                requestedId: username // Assume username is the requested user ID
            });
            console.log(`Friend request sent to ${username}`);
        }
    };
</script>

<div>
    <h2>Send Friend Request</h2>
    <input type="text" bind:value={username} placeholder="Enter username or ID" />
    <button on:click={sendFriendRequest}>Send Request</button>
</div>
