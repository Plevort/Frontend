<script>
    import Sidebar from '../components/sidebar/Sidebar.svelte';  //this piece of line of code looks for sidebar component so the sidebar worky worky
</script>

<div class="container">
    <Sidebar />
    <main class="main-content">
        <h1>Welcome to Plevort</h1>
        <p>Choose one of the options below</p>
    </main>
</div>

<style>
    .container {
        display: flex;
        height: 100vh;
        background-color: #202225;
    }

    .main-content {
        flex-grow: 1;
        padding: 20px;
        color: white;
    }
</style>
