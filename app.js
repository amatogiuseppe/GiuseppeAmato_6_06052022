const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://joe:lxdWWx7loKn9ul9v@cluster0.olfbz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/*
app.use(express.json());

app.post('/', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: 'Objet crée !' });
  next();
})
*/

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Votre requête a bien été reçue !' });
});

module.exports = app;