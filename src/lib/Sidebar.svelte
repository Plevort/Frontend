<script>
  let users = [
    { id: 1, name: 'John Doe', lastMessage: 'Hey there!', pfp: 'https://plevort.fryde.id.lv/default.png' },
    { id: 2, name: 'Jane Smith', lastMessage: 'Let\'s catch up!', pfp: 'https://plevort.fryde.id.lv/default.png' },
    { id: 3, name: 'Alice Johnson', lastMessage: 'Are you coming?', pfp: 'https://plevort.fryde.id.lv/default.png' },
    { id: 4, name: 'Bob Brown', lastMessage: 'See you later!', pfp: 'https://plevort.fryde.id.lv/default.png' },
  ];

  function goToChat(id) {
    window.location.href = `/chat/${id}`;
  }

  function addFriend() {
    console.log('Add Friend clicked');
  }

  function createChat() {
    console.log('Create Chat clicked');
  }
</script>

<div class="sidebar">
  <div class="sidebar-header">
    <h1 class="title">Chats</h1>
  </div>
  <div class="buttons">
    <button on:click={addFriend}>Add Friend</button>
    <button on:click={createChat}>Create Chat</button>
  </div>
  
  <div class="user-list">
    {#each users as user}
      <div class="user" on:click={() => goToChat(user.id)}>
        <img src={user.pfp} alt={user.name} class="profile-pic" />
        <div class="user-details">
          <p class="user-name">{user.name}</p>
          <p class="last-message">{user.lastMessage}</p>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .sidebar {
    width: 300px; 
    height: 100vh; 
    background-color: #1c1c1c; 
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .title {
    font-size: 24px;
    margin: 0;
  }

  .buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px; 
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

  .user-list {
    flex-grow: 1;
    overflow-y: auto; 
    overflow-x: hidden; 
    scrollbar-width: thin; 
    scrollbar-color: #3c3c3c #1c1c1c; 
  }

  .user-list::-webkit-scrollbar {
    width: 8px; 
  }

  .user-list::-webkit-scrollbar-track {
    background: #1c1c1c; 
  }

  .user-list::-webkit-scrollbar-thumb {
    background-color: #3c3c3c; 
    border-radius: 5px; 
  }

  .user-list::-webkit-scrollbar-thumb:hover {
    background-color: #505050; 
  }

  .user {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .user:hover {
    background-color: #333; 
  }

  .profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: bold;
    margin: 0;
  }

  .last-message {
    font-size: 14px;
    color: #ccc; 
    margin: 0;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%; 
      height: 100vh;
    }

    .buttons {
      margin-top: 10px; 
    }

    main {
      display: none; 
    }
  }
</style>
