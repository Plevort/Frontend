<script>
    import { writable } from 'svelte/store';
  
    export let chatId; 
    export let user; 
  
    const messages = writable([]); 
    let newMessage = '';
  
    function fetchMessages() {
      messages.set([
        { id: 1, sender: 'John Doe', text: 'Hey there!' },
        { id: 2, sender: 'You', text: 'Hi!' },
        { id: 3, sender: 'John Doe', text: 'How are you?' },
      ]);
    }
  
    fetchMessages();
  
    function sendMessage() {
      if (newMessage.trim()) {
        messages.update(currentMessages => [
          ...currentMessages,
          { id: currentMessages.length + 1, sender: 'You', text: newMessage }
        ]);
        newMessage = '';
      }
    }
  </script>
  
  <div class="chat-container">
    <div class="chat-header">
      <img src={user.pfp} alt={user.name} class="profile-pic" />
      <h1>{user.name}</h1>
    </div>
  
    <div class="message-list">
      {#each $messages as message}
        <div class="message {message.sender === 'You' ? 'sent' : 'received'}">
          <strong>{message.sender}: </strong> {message.text}
        </div>
      {/each}
    </div>
  
    <div class="message-input">
      <input type="text" bind:value={newMessage} placeholder="Type a message..." />
      <button on:click={sendMessage}>Send</button>
    </div>
  </div>
  
  <style>
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 20px;
      background-color: #1c1c1c; 
      color: #fff; 
    }
  
    .chat-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
  
    .profile-pic {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
  
    .message-list {
      flex-grow: 1;
      overflow-y: auto; 
      margin-bottom: 10px;
    }
  
    .message {
      margin: 5px 0;
      padding: 10px;
      border-radius: 5px;
    }
  
    .sent {
      background-color: #4caf50; 
      color: white;
      align-self: flex-end; 
    }
  
    .received {
      background-color: #3c3c3c; 
      color: white;
    }
  
    .message-input {
      display: flex;
      gap: 10px;
    }
  
    input[type="text"] {
      flex-grow: 1; 
      padding: 10px;
      border-radius: 5px;
      border: none;
    }
  
    input[type="text"]:focus {
      outline: none; 
      border: 1px solid #3c3c3c; 
    }
  
    button {
      background-color: #3c3c3c; 
      border: none;
      color: #fff;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    button:hover {
      background-color: #505050; 
    }
  </style>
  