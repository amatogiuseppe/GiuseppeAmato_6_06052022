//================================================================================
//  Express Application
//================================================================================

// Required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connecting the application to the database using mongoose
mongoose.connect('mongodb+srv://joe:lxdWWx7loKn9ul9v@cluster0.olfbz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
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

// Middleware to handle the POST request and extract the JSON body
app.use(express.json());

// Configuration to handle image files statically whenever there is a request to the /images route
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routers
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Exporting the application
module.exports = app;