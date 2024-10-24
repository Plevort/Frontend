<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import '$lib/global.css'; 
    import Sidebar from '$lib/Sidebar.svelte';

    let messages = writable([]);
    let currentPage = 1; 
    let chatId = ''; 
    let loading = writable(false); 
    let canLoadMore = writable(true); 
    let isSending = writable(false); 
    let newMessage = ''; 
    let token = ''; 
    let chatContainer; 
    let showSidebar = false; 

    const isBrowser = typeof window !== 'undefined';

    function scrollToBottom() {
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight; 
        }
    }

    async function fetchMessages(page = 1) {
        loading.set(true);
        try {
            const res = await fetch(`https://plevortapi.fryde.id.lv/v1/message/read?cid=${chatId}&p=${page}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.messages.length === 0) {
                canLoadMore.set(false); 
            } else {
                messages.update(current => [...current, ...data.messages]);
                currentPage = page;
                scrollToBottom(); 
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            loading.set(false);
        }
    }

    async function sendMessage() {
        if (!newMessage.trim()) return;
        isSending.set(true);
        try {
            const res = await fetch(`https://plevortapi.fryde.id.lv/v1/message/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatId,
                    content: newMessage
                })
            });
            const data = await res.json();
            if (data.messageId) {
                messages.update(current => [...current, { cnt: newMessage, uid: 'my-uid', createdAt: new Date().toISOString() }]);
                newMessage = '';
                scrollToBottom();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            isSending.set(false);
        }
    }

    function toggleSidebar() {
        showSidebar = !showSidebar;
    }

    onMount(() => {
        if (isBrowser) {
            const path = window.location.pathname;
            chatId = path.split('/').pop();
            token = localStorage.getItem('token');
            fetchMessages();
        }
    });
</script>

<button class="hamburger-left" on:click={toggleSidebar} style="display: {showSidebar ? 'none' : 'block'};">☰</button>

<div class="chat-wrapper">
    {#if showSidebar}
        <Sidebar /> 
    {/if}

    <div class="chat-container" bind:this={chatContainer}>
        <div class="chat-content">
            {#each $messages as message}
                <div class="message {message.uid === 'my-uid' ? 'my-message' : 'other-message'}">
                    <p>{message.cnt}</p>
                </div>
            {/each}
        </div>

        <div class="send-message">
            <textarea bind:value={newMessage} placeholder="Type a message..."></textarea>
            <button on:click={sendMessage} disabled={$isSending}>Send</button>
        </div>
    </div>
</div>

<button class="hamburger-right" on:click={toggleSidebar} style="display: {showSidebar ? 'none' : 'block'};">☰</button>

<style>
    /* General layout */
    .chat-wrapper {
        display: flex;
        height: 100vh;
    }

    .chat-container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        background-color: #2c2c2c;
    }

    .chat-content {
        flex-grow: 1;
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column; 
    }

    .send-message {
        padding: 10px;
        background-color: #1c1c1c;
        display: flex;
        align-items: center;
    }

    textarea {
        flex-grow: 1;
        padding: 10px;
        margin-right: 10px;
        border-radius: 5px;
        border: none;
        background-color: #333;
        color: white;
    }

    button {
        padding: 10px 20px;
        background-color: #3c3c3c;
        border: none;
        color: white;
        cursor: pointer;
        border-radius: 5px;
    }

    button:disabled {
        background-color: #777;
        cursor: not-allowed;
    }

    .message {
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 5px;
        max-width: 60%;
        word-wrap: break-word;
    }

    .my-message {
        background-color: #4CAF50;
        margin-left: auto;
    }

    .other-message {
        background-color: #1e1e1e;
        margin-right: auto;
    }

    .hamburger-left {
        display: none;
        position: absolute;
        top: 10px;
        left: 10px;
        background: none;
        border: none;
        font-size: 30px;
        color: #fff;
        z-index: 1001;
    }

    .hamburger-right {
        display: none;
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 30px;
        color: #fff;
        z-index: 1001;
    }

    @media (max-width: 768px) {
        .hamburger-left {
            display: block; 
        }
        .hamburger-right {
            display: block; 
        }
    }

    @media (min-width: 769px) {
        .hamburger-left, .hamburger-right {
            display: none; 
        }
    }
</style>
