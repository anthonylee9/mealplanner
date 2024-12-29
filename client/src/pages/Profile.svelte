<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import MealCard from "../components/MealCard.svelte";
    
    let { id } = $props();
    let profile = $state(null);

    onMount(async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.get(`http://localhost:8080/users/${id}`, {
                headers: {
                    Authorization: user.header_token
                }
            });

            profile = response.data;
            
        } catch (error) {
            console.log(error);
        }
    })
    
</script>

<div class="profile-container">
    {#if !profile}
        <div>Loading User Profile...</div>
    {:else}
        <h1>Welcome, {profile.username}! Your Preferences: {profile.preferences}</h1>
        <hr/>
        <div class="meal-plans">
            {#if profile.mealPlans.length === 0}
                <p>No meal plans available</p>
            {:else}
                {#each profile.mealPlans as mealPlan}
                    <h3>Meal Plan for Week {mealPlan.week}</h3>
                    <MealCard meals={mealPlan.meals}/>

                {/each}
            {/if}
        </div>
    {/if}
</div>

<style>
    .profile-container {
        margin: 2rem auto;
        padding: 2rem;
        text-align: left;
    }

    h1 {
        font-family: 'Montserrat', sans-serif;
        font-size: 2rem;
    }

    .meal-plans {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }
</style>