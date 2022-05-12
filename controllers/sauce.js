//================================================================================
//  Sauce controller
//================================================================================

// Required modules
const Sauce = require('../models/Sauce');
const fs = require('fs');


//------------------------------------
//  Creating the sauce
//------------------------------------
exports.createSauce = (req, res, next) => {
  // turning a string object into a usable object
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // creating the new sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  // saving the new sauce in the database
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};


//------------------------------------
//  Liking the sauce
//------------------------------------
exports.likeSauce = (req, res, next) => {
};


//------------------------------------
//  Modifying the sauce
//------------------------------------
exports.modifySauce = (req, res, next) => {
  // A sauceObject is created that checks whether or not req.file exists
  const sauceObject = req.file ?
    // Case 1: if it does exist, it processes the new image
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    // Case 2: if it does not, it simply processes the incoming object
    : { ...req.body };
  // Updating the sauce
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};


//------------------------------------
//  Deleting the sauce
//------------------------------------
exports.deleteSauce = (req, res, next) => {
  // looking for the sauce to be deleted in the database
  Sauce.findOne({ _id: req.params.id })
    .then( sauce => {
      // Case 1: the specified sauce is not in the database
      if (!sauce) {
        return res.status(404).json({ error: new Error('Pas de Sauce !') });
      }
      // Case 2: the specified sauce exists but does not belong to the person requesting its removal
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({ error: new Error('Requête non autorisée !') });
      }
      // Case 3: the specified sauce exists and belongs to the person requesting its removal
      // In this case, the sauce image in the /images folder must be removed as well
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


//------------------------------------
//  Getting a specific sauce
//------------------------------------
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};


//------------------------------------
//  Getting all the sauces
//------------------------------------
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}