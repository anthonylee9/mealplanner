import User from '../models/user.js';
import axios from 'axios';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_API_URL = process.env.SPOONACULAR_API_URL;

const searchMeal = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { recipeName } = req.query;
        const userWithMealPlans = await User.findById(user_id).select('-password').populate('mealPlans')
        const preferencesArray = userWithMealPlans.preferences;
        const diet = preferencesArray.length > 0 ? preferencesArray.join(',') : undefined;

        // makes request to API for recipes using recipeName w/ matching preferences
        const meals = await axios.get(`${SPOONACULAR_API_URL}/complexSearch`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                query: recipeName,
                diet: diet,
                addRecipeInformation: true
            }
        });
       
        res.json(meals.data.results);
    } catch (error) {
        res.status(500).json({error: error.toString() });
    }
}

export { searchMeal };
