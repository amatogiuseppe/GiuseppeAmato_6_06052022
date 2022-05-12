//================================================================================
//  Authentication middleware: to authenticate each request
//================================================================================

// Required module
const jwt = require('jsonwebtoken');

//------------------------------------
//  Authentication configuration
//------------------------------------
module.exports = (req, res, next) => {
  try {
    // decoding the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    // An object containing the userID is added to the request to prevent security holes in the DELETE controller
    req.auth = { userId };
    // token checking
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable !';
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error('Requête non valide') });
  }
};