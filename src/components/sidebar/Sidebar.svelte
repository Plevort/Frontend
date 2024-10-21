<script>
    // example friends list (example since you prob dont have any)
    let friends = [
      { name: "Alice", online: true },
      { name: "Bob", online: false },
      { name: "Charlie", online: true },
      { name: "Dave", online: true },
    ];
  </script>
  
  <aside class="sidebar">
    <h2>Friends</h2>
    <ul class="friend-list">
      {#each friends as friend}
        <li class={friend.online ? 'online' : 'offline'}>
          {friend.name}
          <span class="status-indicator {friend.online ? 'online' : 'offline'}"></span>
        </li>
      {/each}
    </ul>
  </aside>
  
  <!-- dis dud add style thing from the path below -->
  <style>
    @import '../../styles/sidebar.css';
  </style>
  