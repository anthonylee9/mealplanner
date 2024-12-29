<script>
    import { navigate } from 'svelte-routing';
    import axios from 'axios';
    
    let username = $state('');
    let password = $state('');
    const list_of_preferences = [
        "gluten free", "ketogenic", "vegetarian", "lacto-vegetarian", "ovo-vegetarian", "vegan", "pescetarian", "paleo", 
        "primal", "low fodmap", "whole30"
    ];
    let preferences = $state({
        "gluten free": false,
        "ketogenic": false,
        "vegetarian": false,
        "lacto-vegetarian": false,
        "ovo-vegetarian": false,
        "vegan": false,
        "pescetarian": false,
        "paleo": false,
        "primal": false,
        "low fodmap": false,
        "whole30": false
    });

    let errorMessage= $state('');
    let showError = $state(false);

    let formType= $state('login');
    const formConfig = {
        login: {
            title: 'Login',
            button_text: 'Login',
            toggle_text: 'No account? Register'
        },
        register: {
            title: 'Register',
            button_text: 'Register',
            toggle_text: 'Already have an account? Login'
        }
    };

    const formTypeToggle = () => {
        formType = formType === 'login' ? 'register' : 'login';
    };

    const handleSubmit = async () => {
        const endpoint = `http://localhost:8080/users/${formType}`;
        
        try {
            const selected_preferences = Object.keys(preferences).filter(preference => preferences[preference]);
            const response = await axios.post(endpoint, { username, password, preferences: selected_preferences });
            console.log(response.data);
            
            if (formType === 'login' && response.data._id) {
                const { _id, token_type, access_token } = response.data;

                const user = { _id, header_token: `${token_type} ${access_token}` };
                localStorage.setItem('user', JSON.stringify(user));
                window.dispatchEvent(new Event('storage-updated'));
                navigate(`/profile/${_id}`);
                
            }

            if (formType == 'register' && response.data._id) {
                formTypeToggle();
            }

            // TODO handle error messages
        } catch (error) {
           errorMessage = error.response.data.error;
           console.log(errorMessage)
           showError = true;
           setTimeout(() => { showError = false; }, 10000);
        }
    }
</script>

<div class="form-container">
    <h1>{formConfig[formType].title}</h1>
    <input type="text" bind:value={username} placeholder="username" />
    <input type="password" bind:value={password} placeholder="password" />
    {#if formType === 'register'}
        <h2>Preferences:</h2>
        {#each list_of_preferences as preference}
            <label>
                <input 
                    type="checkbox" 
                    bind:checked={preferences[preference]}/>
                    {preference}
                </label>
        {/each}
    {/if}
    <button class="submit-btn" onclick={handleSubmit}>{formConfig[formType].button_text}</button>

    <div class="toggle-container">
        <label for="toggle" class="toggle-label">{formConfig[formType].toggle_text}</label>
        <button 
            class="toggle-btn" 
            role="switch"
            aria-label="Toggle between login and register" 
            aria-checked={formType === 'login' ? false: true}
            class:active={formType === 'login'}
            onclick={formTypeToggle}>
        </button>
    </div>
    {#if showError}
        <p class="error">{errorMessage}</p>
    {/if}
</div>

<style>
.form-container {
    background-color: #1d2531;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 32rem;
    margin: 2.5rem auto;
    text-align: center;
}

.form-container h1 {
    text-transform: uppercase;
}

.form-container input {
    width: 100%;
    padding: 1rem;
    margin: 1rem 0;
    border: none;
    border-radius: 0.5rem;
    background: #0f1621;
    color: #a0a0a0;
}

.form-container input:focus {
    outline: none;
    box-shadow: 0 0 0.3125rem #394961;
}

.form-container .submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background: #f2c069;
    cursor: pointer;
    margin-bottom: 1rem;
}

.form-container .submit-btn:hover {
    background: #d9ac5e;
}

.toggle-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.toggle-label {
    font-size: 1rem;
}

.toggle-btn {
    width: 3rem;
    height: 1.5rem;
    background-color: #555;
    border-radius: 1.875rem;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    padding: 0;
    outline: none;
    border: none;
}

.toggle-btn:before {
    content: '';
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 1.25rem;
    height: 1.25rem;
    background-color: #d6dbe4;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.toggle-btn.active {
    background-color: #d9ac5e;
}

.toggle-btn.active:before {
    transform: translateX(1.5rem);
}

.toggle-btn:focus {
    outline: none;
    box-shadow: none;
}

.error {
    margin-top: 12px;
}
</style>