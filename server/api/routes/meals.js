import express from 'express';
import { verifyUser } from '../middleware/authorization.js';
import { searchMeal } from '../controllers/meals.js';

const router = express.Router();

router.use(verifyUser);

// GET/meals/search?recipeName=
router.get('/search', searchMeal);

export default router;