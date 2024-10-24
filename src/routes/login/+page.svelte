<script>
    import { writable } from 'svelte/store';
    import "$lib/global.css";

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

                // Redirect to homepage
                window.location.href = '/';
            } else {
                const data = await response.json();
                error.set(data.error || 'An unexpected error occurred.');
            }
        } catch (err) {
            console.error(err);
            error.set('Network error. Please try again later.');
        }
    };
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

        <!-- Button to return to the register page -->
        <div class="register-redirect">
            <p>Don't have an account?</p>
            <button class="small-button" on:click={() => window.location.href = '/register'}>
                Return to Register
            </button>
        </div>
    </div>
</main>

<style>
    /* login.css */
html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #121212;
    font-family: 'Inter', sans-serif;
    color: #f0f0f0;
}

main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login-box {
    background-color: #222;
    padding: 2rem;
    border-radius: 15px; 
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 400px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

input {
    padding: 0.8rem;
    border-radius: 5px;
    border: 1px solid #444;
    background-color: #333;
    color: #f0f0f0;
}

input:focus {
    outline: none;
    border-color: #5865F2;
}

button {
    background-color: #5865F2;
    color: #fff;
    padding: 1rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #4752c4;
}

.error {
    color: red;
}

.success {
    color: green;
}

label {
    color: #f0f0f0;
}

.register-redirect {
    text-align: center; /* Center the content inside the redirect div */
    margin-top: 20px; /* Add some space above the button */
}

.small-button {
    padding: 8px 12px; /* Smaller padding for the button */
    font-size: 14px; /* Smaller font size */
    border: none; /* Remove default border */
    border-radius: 3px; /* Rounded corners */
    background-color: #007bff; /* Bootstrap primary color */
    color: white; /* White text color */
    cursor: pointer; /* Pointer cursor on hover */
    transition: background-color 0.3s; /* Smooth transition */
}

.small-button:hover {
    background-color: #0056b3; /* Darker shade on hover */
}
</style>
