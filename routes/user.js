//================================================================================
//  User routes
//================================================================================

// Required modules
const express = require('express');

const userCtrl = require('../controllers/user');

// User router
const router = express.Router();

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exporting the user router
module.exports = router;