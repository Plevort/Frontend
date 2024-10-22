<script>
  import Chat from "$lib/Chat.svelte";
  import { onMount } from 'svelte';
  import { page } from '$app/stores'; 

  let chatId; 
  let user = {
    name: 'Loading...', 
    pfp: 'https://plevort.fryde.id.lv/default.png'
  };

  $: chatId = page.params.id;

  onMount(async () => {
    if (chatId == 1) {
      user = {
        name: 'John Doe',
        pfp: 'https://plevort.fryde.id.lv/default.png'
      };
    } else if (chatId == 2) {
      user = {
        name: 'Jane Smith',
        pfp: 'https://plevort.fryde.id.lv/default.png'
      };
    }
  });
</script>

<div class="chat-page">
  <Chat {chatId} {user} />
</div>

<style>
  .chat-page {
    height: 100vh;
    background-color: #1c1c1c; 
    color: #fff; 
  }
</style>
