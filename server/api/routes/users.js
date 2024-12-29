import express from 'express';
import { registerUser, loginUser, getUserById, updateUser } from '../controllers/user.js';
import { verifyUser } from '../middleware/authorization.js';

const router = express.Router();


// POST /users/register
router.post('/register', registerUser);

// POST /users/login
router.post('/login', loginUser);

// GET /users/:id
router.get('/:id', verifyUser, getUserById);

// PUT /users/:id
router.put('/:id', verifyUser, updateUser);

export default router;
