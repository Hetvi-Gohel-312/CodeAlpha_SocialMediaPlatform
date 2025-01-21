const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensures that email is unique in the database
    },
    password: {
        type: String,
        required: true,
    },
});

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User; // Export the model so it can be used in other files
