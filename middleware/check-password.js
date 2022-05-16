//================================================================================
//  Password Checking
//================================================================================

// Required module
const passwordSchema = require('../models/Password');

//------------------------------------
//  Verify password
//------------------------------------
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({ message: 'The password must be between 8 and 20 characters long, with at least one uppercase letter, one lowercase letter, one digit, and no spaces' });
  } else {
    next();
  }
};