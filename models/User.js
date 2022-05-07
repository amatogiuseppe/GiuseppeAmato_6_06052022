//================================================================================
//  User model
//================================================================================

// Required modules
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// User schema
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Implementing uniqueValidator to pre-validate information before saving it
userSchema.plugin(uniqueValidator);

// Exporting the user's schema
module.exports = mongoose.model('User', userSchema);