import express from 'express';
import { verifyUser } from '../middleware/authorization.js';
import { addToMealPlan, deleteMealPlan} from '../controllers/mealplan.js';

const router = express.Router();
router.use(verifyUser);

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_API_URL = process.env.SPOONACULAR_API_URL;

router.post('/', addToMealPlan);

router.delete('/:id', deleteMealPlan);

export default router;