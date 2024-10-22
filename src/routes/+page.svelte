<script>
  import { onMount } from "svelte";
  import Sidebar from "$lib/Sidebar.svelte";
  import "../styles/homepage.css";

  onMount(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/register";
    }
  });
</script>

<main>
</main>

<Sidebar />
