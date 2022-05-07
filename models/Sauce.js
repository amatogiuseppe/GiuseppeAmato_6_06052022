const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  title: { type: String, required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);