<script>
    import { writable } from 'svelte/store';

    const email = writable('');
    const password = writable('');
    const passwordConfirm = writable('');
    const username = writable('');
    const error = writable('');
    const success = writable('');

    const registerUser = async () => {
        error.set('');
        success.set('');

        const userData = {
            email: $email,
            password: $password,
            passwordConfirm: $passwordConfirm,
            username: $username
        };

        try {
            const response = await fetch('https://plevortapi.fryde.id.lv/v1/register', {
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

                success.set(data.message || 'Registration successful!');

                // Redirect to homepage
                window.location.href = '/';
            } else {
                const data = await response.json();
                error.set(data.error || 'An unexpected error occurred.');
            }
        } catch (err) {
            console.error(err); // Log any errors
            error.set('Network error. Please try again later.');
        }
    };

    import './register.css'; 
</script>

<main>
    <div class="register-box">
        <form on:submit|preventDefault={registerUser}>
            <label for="email">Email</label>
            <input type="email" id="email" bind:value={$email} placeholder="e.g., example@domain.com" required />

            <label for="password">Password</label>
            <input type="password" id="password" bind:value={$password} placeholder="e.g., jSZ5?G23AKh7" required />

            <label for="passwordConfirm">Confirm Password</label>
            <input type="password" id="passwordConfirm" bind:value={$passwordConfirm} placeholder="e.g., jSZ5?G23AKh7" required />

            <label for="username">Username</label>
            <input type="text" id="username" bind:value={$username} placeholder="e.g., johndoe123" required />

            <label>
                <input type="checkbox" required /> I accept the <a href="../../privacyandterms">Privacy Policy and TOS</a> 
                <p>if the TOS page looks weird please refresh it and there should be a white background. some bug</p>
            </label>
            
            <button type="submit">Register</button>

            {#if $error}
                <p class="error">Error: {$error}</p>
            {/if}
            {#if $success}
                <p class="success">Success: {$success}</p> 
            {/if}
        </form>

        <!-- Button to redirect to the login page -->
        <div class="login-redirect">
            <p>Already registered? </p>
            <button on:click={() => window.location.href = '../../login'}>
                Login
            </button>
        </div>
    </div>
</main>
