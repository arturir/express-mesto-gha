const { ObjectId } = require("mongoose").Types;
const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send(cards))
    .catch(() => { res.status(500).send({ message: "Произошла ошибка" }); });
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные при создании карточки." });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
  });
};
module.exports.deleteCard = (req, res) => {
  if (!ObjectId.isValid(req.params.cardId)) {
    res.status(400).send({ message: "Переданы некорректные данные для удаления карточки" });
  } else {
    Card.findByIdAndDelete(req.params.cardId)
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: "Такой карточки не существует" });
        } else {
          res.send(card);
        }
      })
      .catch(res.status(500).send({ message: "Произошла ошибка" }));
  }
};
module.exports.likeCard = (req, res) => {
  if (!ObjectId.isValid(req.params.cardId)) {
    res.status(400).send({ message: "Переданы некорректные данные для лайка карточки" });
  } else {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: "Такой карточки не существует" });
        } else {
          res.send(card);
        }
      })
      .catch(() => { res.status(500).send({ message: "Произошла ошибка" }); });
  }
};
module.exports.dislikeCard = (req, res) => {
  if (!ObjectId.isValid(req.params.cardId)) {
    res.status(400).send({ message: "Переданы некорректные данные для дизлайка карточки" });
  } else {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: "Такой карточки не существует" });
        } else {
          res.send(card);
        }
      })
      .catch(() => { res.status(500).send({ message: "Произошла ошибка" }); });
  }
};
