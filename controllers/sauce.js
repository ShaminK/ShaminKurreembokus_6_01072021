const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'objet enregistré' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));

};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeOrDislike = (req, res, next) => { 
    if (req.body.like === 1) {  // si like
      Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }) // Maj de la sauce (via l'id)-> likes:+1, userLikes: ajoute l'userId
        .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
        .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1) {  // si dislike
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $push: { usersDisliked: req.body.userId } }) // Maj de la sauce (via l'id)-> dislikes:+1, usersDislikes: ajoute l'userId
        .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
        .catch(error => res.status(400).json({ error }));
    } else { //si enleve like ou dislike
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          if (sauce.usersLiked.includes(req.body.userId)) { //enleve like
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }) //Maj de la sauce(id)-> likes:-1, usersliked = enleve l'userId
                .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                .catch(error => res.status(400).json({ error }))
          } else if (sauce.usersDisliked.includes(req.body.userId)) {  //enleve dislike
              Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })  //Maj de la sauce(id)-> dislikes:-1, usersDisliked = enleve l'userId
                .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                .catch(error => res.status(400).json({ error }))
          }
        })
        .catch(error => res.status(400).json({ error }));
    }
  };
  