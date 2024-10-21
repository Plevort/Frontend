<script>
    // sidebar
    import Sidebar from '../components/sidebar/Sidebar.svelte';
  
    // box
    let boxes = [
      {
        title: "Server List",
        description: "View all the available servers.",
        path: "../../serverlist/"
      },
      {
        title: "Add Friend",
        description: "Add new friends to your list.",
        path: "../../routes/addfriend/"
      },
      {
        title: "Create Server",
        description: "Start your own server.",
        path: "../../routes/createserver/"
      },
      {
        title: "Support",
        description: "Get help and support.",
        path: "../../routes/support/"
      }
    ];
  
    // YouTube video 
    let youtubeURL = "https://www.youtube.com/embed/Fp9tCElcLtY"; 
  </script>
  
  <div class="container">
    <Sidebar />
  
    <main class="main-content">
      <h1>Welcome to Plevort</h1>
      <p>Select an option below or watch our latest devlog.</p>
  
      <!-- 4 Boxes as Buttons -->
      <div class="box-container">
        {#each boxes as box}
          <div class="box" on:click={() => window.location.href = box.path}>
            <h3>{box.title}</h3>
            <p>{box.description}</p>
          </div>
        {/each}
      </div>
  
      <!-- YouTube Embed (chatgpt says i need this)-->
      <div class="video-container">
        <iframe
          width="560"
          height="315"
          src={youtubeURL}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </main>
  </div>
  
  <style>
    @import '../styles/style.css';
  </style>
  