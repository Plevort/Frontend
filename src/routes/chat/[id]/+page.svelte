<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { io } from 'socket.io-client';
    import Sidebar from '$lib/Sidebar.svelte';
    import '$lib/global.css';

    let messages = writable([]);
    let currentPage = 1;
    let chatId = '';
    let loading = writable(false);
    let canLoadMore = writable(true);
    let isSending = writable(false);
    let newMessage = '';
    let token = '';
    let chatContainer;
    let showSidebar = writable(false);
    let isDesktop = writable(false);
    let socket;

    function scrollToBottom() {
        setTimeout(() => {
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 0);
    }

    async function fetchMessages(page = 1, initialLoad = false) {
        loading.set(true);
        try {
            const res = await fetch(`https://plevortbeta.fryde.id.lv/v1/message/read?cid=${chatId}&p=${page}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (data.messages.length === 0) {
                canLoadMore.set(false);
            } else {
                const fetchedMessages = data.messages.reverse();

                if (initialLoad) {
                    messages.set(fetchedMessages);
                    scrollToBottom();
                } else {
                    const previousHeight = chatContainer.scrollHeight;
                    messages.update(current => [...fetchedMessages, ...current]);

                    setTimeout(() => {
                        const newHeight = chatContainer.scrollHeight;
                        chatContainer.scrollTop = newHeight - previousHeight;
                    }, 0);
                }

                currentPage = page;
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
            const res = await fetch(`https://plevortbeta.fryde.id.lv/v1/message/send`, {
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
                messages.update(current => [
                    ...current,
                    { cnt: newMessage, uid: 'my-uid', createdAt: new Date().toISOString() }
                ]);
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
        showSidebar.update(value => !value);
    }

    function handleScroll() {
        if (chatContainer && chatContainer.scrollTop === 0 && $canLoadMore) {
            fetchMessages(currentPage + 1);
        }
    }

    onMount(() => {
        chatId = window.location.pathname.split('/').pop();
        token = localStorage.getItem('token');
        fetchMessages(1, true);

        socket = io('https://plevortbeta.fryde.id.lv');
        socket.on('connect', () => {
            socket.emit('joinChat', chatId);
        });

        socket.on('newMessage', (message) => {
            if (message.chatId === chatId) {
                messages.update(current => [...current, message]);
                scrollToBottom();
            }
        });

        const updateScreenWidth = () => {
            isDesktop.set(window.innerWidth >= 776);
            showSidebar.set(window.innerWidth >= 776);
        };

        updateScreenWidth();
        window.addEventListener('resize', updateScreenWidth);

        return () => {
            window.removeEventListener('resize', updateScreenWidth);
            socket.disconnect();
        };
    });
</script>

{#if !$isDesktop && !$showSidebar}
    <button class="sidebar-toggle" on:click={toggleSidebar} aria-label="Toggle Sidebar">≡</button>
{/if}

<div class="chat-wrapper">
    {#if $showSidebar && !$isDesktop}
        <div class="sidebar-fullscreen">
            <Sidebar on:close={() => showSidebar.set(false)} />
            <button class="close-sidebar" on:click={() => showSidebar.set(false)}>✕</button>
        </div>
    {/if}

    {#if $isDesktop}
        <Sidebar />
    {/if}

    <div class="chat-container" bind:this={chatContainer} on:scroll={handleScroll}>
        <div class="chat-content">
            {#if $loading}
                <p class="loading">Loading more messages...</p>
            {/if}
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

<style>
    .chat-wrapper {
        display: flex;
        height: 100vh;
    }

    .chat-container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        background-color: #2c2c2c;
        overflow-y: auto;
    }

    .chat-content {
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column-reverse;
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
        resize: none;
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
        word-break: break-word;
    }

    .my-message {
        background-color: #4CAF50;
        margin-left: auto;
    }

    .other-message {
        background-color: #1e1e1e;
        margin-right: auto;
    }

    .sidebar-toggle {
        position: absolute;
        top: 10px;
        left: 10px;
        background: none;
        border: none;
        font-size: 24px;
        color: #fff;
        z-index: 1001;
        cursor: pointer;
    }

    .sidebar-fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #1c1c1c;
        z-index: 1002;
    }

    .close-sidebar {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        color: #fff;
        cursor: pointer;
    }

    .chat-container {
        border: none;
    }

    .loading {
        text-align: center;
        font-size: 0.9em;
        color: #aaa;
        margin: 10px 0;
    }

    @media (min-width: 776px) {
        .sidebar-toggle {
            display: none;
        }
    }
</style>
