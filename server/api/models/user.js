import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        set: (username) => username.toLowerCase()
    },
    password: {
        type: String,
        required: true
    },
    preferences: {
        type: [String],
        default: [],
        required: true,
        enum: ["gluten free", "ketogenic", "vegetarian", "lacto-vegetarian", "ovo-vegetarian", "vegan", 
        "pescetarian", "paleo", "primal", "low fodmap", "whole30"]
    }
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}
);

UserSchema.virtual('mealPlans', {
    ref: 'MealPlan',
    localField: '_id',
    foreignField: 'user_id'
});

const User = mongoose.model('User', UserSchema);

export default User;

