import User from '../models/user.js';
import { hash, compare, signToken } from '../util/auth.js';

const registerUser = async (req, res) => {
    try {
        const { username, password, preferences = [] } = req.body;

        // ensure both username and password are provided
        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }
        
        const hashedPassword = await hash(password);

        // add to user
        const user = await User.create({
            username,
            password: hashedPassword,
            preferences
        })
       
        res.json({ _id: user._id, username: user.username, preferences: user.preferences });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // ensure both username and password are in req.body
        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        // find user by username and verify password
        const userEntry = await User.findOne({ username: username.toLowerCase() });
        
        if (!userEntry) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        const isPasswordEqual = await compare(password, userEntry.password);
        if (!isPasswordEqual) {
            return res.status(401).json({ error: 'Invalid password'});
        }
        
        const token = signToken(userEntry.username, userEntry._id);

        res.json({ _id: userEntry._id, username: userEntry.username, preferences: userEntry.preferences, token_type: 'Bearer', access_token: token });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.verified;
        
        // ensure header matches id in URL
        if (id !== user_id) {
            return res.status(403).json({ error: "You don't have access to this." });
        }

        const userWithMealPlans = await User.findById(id).select('-password').populate('mealPlans');

        res.json(userWithMealPlans);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.verified;
        const { preferences } = req.body;
        console.log(id);
        console.log(user_id);
        // check if headerid matches url id
        if (id !== user_id) {
            return res.status(403).json({ error: "You don't have access to this." });
        }

        const user = await User.findById(id).select('-password')
    
        user.preferences = preferences;
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}
export { registerUser, loginUser, getUserById, updateUser};