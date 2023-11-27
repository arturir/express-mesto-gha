const mongoose = require("mongoose");
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require("http2").constants;
const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send(cards))
    .catch(() => { res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" }); });
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные при создании карточки." });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
      }
  });
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Такой карточки не существует" });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные для удаления карточки" });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
      }
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Такой карточки не существует" });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные для лайка карточки" });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
      }
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Такой карточки не существует" });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные для дизлайка карточки" });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
      }
    });
};
