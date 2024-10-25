<script>
    import { writable } from 'svelte/store';
    import "$lib/global.css";

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
            const response = await fetch('https://plevortbeta.fryde.id.lv/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const data = await response.json();
                
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
                <input type="checkbox" required /> I accept the <a href="/privacyandterms">Privacy Policy and TOS</a> 
            </label>
            
            <button type="submit">Register</button>

            {#if $error}
                <p class="error">Error: {$error}</p>
            {/if}
            {#if $success}
                <p class="success">Success: {$success}</p> 
            {/if}
        </form>

        <div class="login-redirect">
            <p>Already registered? </p>
            <button on:click={() => window.location.href = '../../login'}>
                Login
            </button>
        </div>
    </div>
</main>

<style> 
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

.register-box {
    background-color: #222;
    padding: 2rem;
    border-radius: 15px;  /* Rounded corners */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 400px;  /* Max width of the box */
}

form {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

/* Style input fields */
input {
    padding: 0.8rem;
    border-radius: 5px; /* Rounded corners for input fields */
    border: 1px solid #444;
    background-color: #333;
    color: #f0f0f0;
}

input:focus {
    outline: none;
    border-color: #5865F2;
}

/* Style the register button */
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

/* Style for error and success messages */
.error {
    color: red;
}

.success {
    color: green;
}

label {
    color: #f0f0f0;
}
.login-redirect {
    margin-top: 20px;
    text-align: center;
}

.login-redirect button {
    background-color: #007BFF; /* Button color */
    color: white; /* Text color */
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
}

.login-redirect button:hover {
    background-color: #0056b3; /* Darker shade on hover */
}

</style>
