//================================================================================
//  User controller
//================================================================================

// Required modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cryptoJs = require('crypto-js');

const User = require('../models/User');

//Configuring Dotenv
dotenv.config();


//------------------------------------
//  User sign-up
//------------------------------------
exports.signup = (req, res, next) => {
  // encrypting the email entered by the user
  const encryptedEmail = cryptoJs.HmacSHA256(req.body.email, process.env.SECRET_EMAIL_KEY).toString();
  // using bcrypt to salt the password ten times
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // creating a new user
      const user = new User({
        email: encryptedEmail,
        password: hash
      });
      // saving the new user in the database
      user.save()
        .then(() => res.status(201).json({ message: 'User successfully created!' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


//------------------------------------
//  User login
//------------------------------------
exports.login = (req, res, next) => {
  // encrypting the email entered by the user
  const encryptedEmail = cryptoJs.HmacSHA256(req.body.email, process.env.SECRET_EMAIL_KEY).toString();
  // the mongoose model checks that the email input by the user corresponds to a user in the database
  User.findOne({ email: encryptedEmail })
    .then(user => {
      // Case 1: the user was not found
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      // Case 2: the user has been found, but the password must be verified
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // Case 2.1: the password is not correct
          if (!valid) {
            return res.status(401).json({ error: 'Invalid password!' });
          }
          // Case 2.2: the password is correct
          res.status(200).json({
            userId: user._id,
            // encoding a new token
            token: jwt.sign(
              { userId: user._id },
              process.env.SECRET_TOKEN_KEY,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};