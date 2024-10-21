<script>
    import Sidebar from '../components/sidebar/Sidebar.svelte';

    let boxes = [
      { title: "Add Chat", description: "Start a new chat.", path: "../../routes/addchat/" },
      { title: "Support", description: "Get help and support.", path: "../../routes/support/" }
    ];

    let chats = [{ name: "Chat with Alice", messages: [] }];
    let selectedChat = null;
    let newMessage = "";

    function sendMessage() {
      if (selectedChat && newMessage.trim() !== "") {
        selectedChat.messages.push(newMessage.trim());
        newMessage = "";
      }
    }
</script>

<div class="container">
    <Sidebar {chats} on:selectChat={event => selectedChat = event.detail} />

    <main class="main-content">
      <div class="buttons-section">
        {#each boxes as box}
          <div class="button-box" on:click={() => window.location.href = box.path}>
            <h3>{box.title}</h3>
            <p>{box.description}</p>
          </div>
        {/each}
      </div>

      <div class="chat-box large-chat">
        <h2>Chats</h2>
        {#if selectedChat}
          <div class="chat-messages">
            {#each selectedChat.messages as message}
              <div class="chat-message">{message}</div>
            {/each}
          </div>
          <div class="chat-input">
            <input
              type="text"
              bind:value={newMessage}
              placeholder="Type your message..."
              on:keydown={e => {
                  if (e.key === 'Enter') {
                      sendMessage();
                  }
              }} 
            />
            <button on:click={sendMessage}>Send</button>
          </div>
        {:else}
          <p>Select a chat to see messages</p>
        {/if}
      </div>
    </main>
</div>

<style>
    @import '../styles/style.css';
</style>
