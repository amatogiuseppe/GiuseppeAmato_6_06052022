//================================================================================
//  Email Checking
//================================================================================

// email pattern
const re = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

//------------------------------------
//  Verify email
//------------------------------------
module.exports = (req, res, next) => {
  if (!re.test(req.body.email)) {
    res.status(400).json({ message: "Invalid email. Please respect this format: abc@def.gh"});
  } else {
    next();
  }
};

