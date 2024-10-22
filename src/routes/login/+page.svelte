<script>
    import { writable } from 'svelte/store';

    const email = writable('');
    const password = writable('');
    const error = writable('');
    const success = writable('');

    const loginUser = async () => {
        error.set('');
        success.set('');

        const userData = {
            email: $email,
            password: $password
        };

        try {
            const response = await fetch('https://plevortapi.fryde.id.lv/v1/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const data = await response.json();
                
                // Save the token to localStorage
                const token = data.token;  
                localStorage.setItem('token', token);

                success.set(data.message || 'Login successful!');
            } else {
                const data = await response.json();
                error.set(data.error || 'An unexpected error occurred.');
            }
        } catch (err) {
            console.error(err);
            error.set('Network error. Please try again later.');
        }
    };

    import './login.css';
</script>

<main>
    <div class="login-box">
        <form on:submit|preventDefault={loginUser}>
            <label for="email">Email</label>
            <input type="email" id="email" bind:value={$email} placeholder="e.g., example@domain.com" required />

            <label for="password">Password</label>
            <input type="password" id="password" bind:value={$password} placeholder="e.g., jSZ5?G23AKh7" required />
            
            <button type="submit">Login</button>

            {#if $error}
                <p class="error">Error: {$error}</p>
            {/if}
            {#if $success}
                <p class="success">Success: {$success}</p>
            {/if}
        </form>
    </div>
</main>
