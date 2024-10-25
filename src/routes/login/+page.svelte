<script>
    import { writable } from 'svelte/store';
    import "$lib/global.css";

    // Define writable stores for form fields and messages
    const email = writable('');
    const password = writable('');
    const error = writable('');
    const success = writable('');

    // Login function to handle form submission
    const loginUser = async () => {
        error.set('');
        success.set('');

        // Read values from stores
        const userData = {
            email: $email,
            password: $password
        };

        try {
            const response = await fetch('https://plevortbeta.fryde.id.lv/v1/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            // Check for success based on data.success instead of response.ok
            if (data.success === true) {
                const token = data.token;  
                localStorage.setItem('token', token);
                success.set(data.message || 'Login successful!');
                
                // Redirect to homepage
                window.location.href = '/';
            } else {
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
        <!-- Prevent default form submission and trigger loginUser -->
        <form on:submit|preventDefault={loginUser}>
            <label for="email">Email</label>
            <input type="email" id="email" bind:value={$email} placeholder="e.g., example@domain.com" required />

            <label for="password">Password</label>
            <input type="password" id="password" bind:value={$password} placeholder="e.g., jSZ5?G23AKh7" required />
            
            <button type="submit">Login</button>

            <!-- Display error and success messages -->
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
    /* Styles for login form */
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
        text-align: center;
        margin-top: 20px;
    }

    .small-button {
        padding: 8px 12px;
        font-size: 14px;
        border: none;
        border-radius: 3px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .small-button:hover {
        background-color: #0056b3;
    }
</style>
