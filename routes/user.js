//================================================================================
//  User routes
//================================================================================

// Required modules
const express = require('express');

const checkEmail = require('../middleware/check-email');
const checkPassword = require('../middleware/check-password');
const userCtrl = require('../controllers/user');

// User router
const router = express.Router();

router.post('/signup', checkEmail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

// Exporting the user router
module.exports = router;