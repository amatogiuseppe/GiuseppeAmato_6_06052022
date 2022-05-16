//================================================================================
//  Authentication middleware: to authenticate each request
//================================================================================

// Required modules
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//Configuring Dotenv
dotenv.config();

//------------------------------------
//  Authentication configuration
//------------------------------------
module.exports = (req, res, next) => {
  try {
    // decoding the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    const userId = decodedToken.userId;
    // An object containing the userID is added to the request to prevent security holes in the DELETE controller
    req.auth = { userId };
    // token checking
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid User ID!';
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error('Request not allowed!') });
  }
};