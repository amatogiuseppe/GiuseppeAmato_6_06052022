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
  // creating the new sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  // saving the new sauce in the database
  sauce.save()
    .then(() => res.status(201).json({ message: 'The sauce was successfully saved!'}))
    .catch(error => res.status(400).json({ error }));
};


//------------------------------------
//  Liking the sauce
//------------------------------------
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then( sauce => {
      switch (req.body.like) {
        // Case in which the user puts a like
        case 1:
          if (!sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId } })
              .then(() => res.status(200).json({ message: "Your like has been added!" }))
              .catch((error) => res.status(400).json({ error }));
          }
        break;
        // Case in which the user removes his like or dislike
        case 0:
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
              .then(() => res.status(200).json({ message: "Your like has been removed!" }))
              .catch((error) => res.status(400).json({ error }));
          }
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
              .then(() => res.status(200).json({ message: "Your dislike has been removed!" }))
              .catch((error) => res.status(400).json({ error }));
          }
        break;
        // Case in which the user puts a dislike
        case -1:
          if (!sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId } })
              .then(() => res.status(200).json({ message: "Your dislike has been added!" }))
              .catch((error) => res.status(400).json({ error }));
          }
        break;
        default:
          console.log('There is an error in the request!');
      }
    })
    .catch(error => res.status(500).json({ error }));
};


//------------------------------------
//  Modifying the sauce
//------------------------------------
exports.modifySauce = (req, res, next) => {
  // Case 1: the user may upload a new image along with the sauce information
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          };
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'The sauce has been updated with the new image!'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  }
  // Case 2: the user wants to change only the sauce information, but not the image
  else {
    const sauceObject = { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'The sauce has been successfully updated!'}))
    .catch(error => res.status(400).json({ error }));
  }
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
        return res.status(404).json({ error: new Error('No sauce!') });
      }
      // Case 2: the specified sauce exists but does not belong to the person requesting its removal
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({ error: new Error('Request not allowed!') });
      }
      // Case 3: the specified sauce exists and belongs to the person requesting its removal
      // In this case, the sauce image in the /images folder must be removed as well
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'The sauce was successfully removed!'}))
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
};