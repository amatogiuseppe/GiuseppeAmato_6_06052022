//================================================================================
//  Password model
//================================================================================

// Required module
const passwordValidator = require('password-validator');

// Password schema
const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8)
  .is().max(20)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces();

// Exporting the password schema
module.exports = passwordSchema;