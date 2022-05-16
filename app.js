//================================================================================
//  Express Application
//================================================================================

// Required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const mongoSanitize = require('express-mongo-sanitize');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Configuring Dotenv
dotenv.config();

// Connecting the application to the database using mongoose
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Declaring the Express Application
const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Middleware to protect the application from certain web vulnerabilities by modifying HTTP headers appropriately
app.use(helmet());

// Middleware to protect the application and clean up the request body by avoiding data injections
app.use(mongoSanitize());

// Middleware to protect the application and limit the number of requests made by a user for a given period of time
app.use(rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP"
}));

// Middleware to handle the POST request and extract the JSON body
app.use(express.json());

// Configuration to handle image files statically whenever there is a request to the /images route
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routers
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Exporting the application
module.exports = app;