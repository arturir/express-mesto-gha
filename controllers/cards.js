const mongoose = require("mongoose");
const Card = require("../models/card");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const InternalServerError = require("../errors/InternalServerError");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send(cards))
    .catch(() => { next(new InternalServerError("Произошла ошибка")); });
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные при создании карточки."));
      } else {
        next(new InternalServerError("Произошла ошибка"));
      }
  });
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw new NotFoundError("Такой карточки не существует");
    } else if (!card.owner.equals(req.user._id)) {
      throw new ForbiddenError("Вы не являетесь владельцем данной карточки");
    } else {
      card.deleteOne()
        .then(() => { res.send({ message: "Карточка удалена" }); })
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError("Переданы некорректные данные для удаления карточки."));
    } else {
      next(err);
    }
  });
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Такой карточки не существует");
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError("Переданы некорректные данные для лайка карточки."));
      } else {
        next(err);
      }
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Такой карточки не существует");
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError("Переданы некорректные данные для дизлайка карточки."));
      } else {
        next(err);
      }
    });
};
