import MealPlan from "../models/mealplan.js";


const addToMealPlan = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { week, meal } = req.body;
        
        // check if a plan exists
        const existingMealPlan = await MealPlan.findOne({ user_id: user_id, week: week });
        
        if (existingMealPlan) {
            // if it does, is it full?
            if (existingMealPlan.meals.length >= 3) {
                return res.status(422).json({error: "Meal plan already has 3 meals"});
            }
        
            // if not, gladly add to plan
            await existingMealPlan.meals.push({
                    mealId: meal.mealId,
                    name: meal.name,
                    diets: meal.diets,
                    image: meal.image
                });
            await existingMealPlan.save();
            return res.json(existingMealPlan);
        } else {
            // create
            // brand new plan
            const newMealPlan = await MealPlan.create({
                user_id: user_id,
                week: week,
                meals: { 
                    mealId: meal.mealId,
                    name: meal.name,
                    diets: meal.diets,
                    image: meal.image
                }
            });
           
            return res.json(newMealPlan);
        }
        
    } catch (error) {
        res.status(500).json({error: error.toString() });
    }
}

const deleteMealPlan = async (req, res) => {
    try { 
        const { user_id } = req.verified;
        const { id } = req.params;

        // go through the meal plans to see if you own id 
        // of the one you want to delete 
        const mealPlan = await MealPlan.findOne({ user_id: user_id, _id: id });
        
        if (!mealPlan) {
            return res.status(404).json({ error: "Meal plan not found or owned"});
        }

        await MealPlan.deleteOne({ _id: id });
        return res.json({success: `Deleted mealplan id: ${id}`});

    } catch (error) {
        res.status(500).json({error: error.toString() });
    }
}
export { addToMealPlan, deleteMealPlan };