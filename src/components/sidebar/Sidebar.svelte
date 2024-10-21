<script>
  export let chats;
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function selectChat(chat) {
    dispatch('selectChat', chat);
  }
</script>

<aside class="sidebar">
  <h2>Chats</h2>
  <ul class="chat-list">
      {#each chats as chat}
          <li on:click={() => selectChat(chat)}>{chat.name}</li>
      {/each}
  </ul>
</aside>

<style>
  @import '../../styles/sidebar.css';
</style>
