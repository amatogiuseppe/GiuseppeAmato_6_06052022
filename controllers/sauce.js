const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
  res.status(201).json({ message: 'Sauce enregistrée' });
};

exports.modifySauce = (req, res, next) => {
  res.status(200).json({ message: 'Sauce modifiée' });
};

exports.deleteSauce = (req, res, next) => {
  res.status(200).json({ message: 'Sauce supprimée' });
};

exports.getOneSauce = (req, res, next) => {
  res.status(200).json(sauce);
};

exports.getAllSauce = (req, res, next) => {
  res.status(200).json(sauces);
}