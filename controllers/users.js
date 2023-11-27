const mongoose = require("mongoose");
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require("http2").constants;
const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => { res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" }); });
};
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Такого пользователя не существует" });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные для получения пользователя" });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
      }
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные при создании пользователя." });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
      }
    });
};
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Пользователь с указанным _id не найден." });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные при обновлении профиля." });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
      }
    });
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
  .then((user) => {
    if (!user) {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Пользователь с указанным _id не найден." });
    } else {
      res.send(user);
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные при обновлении аватара." });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
    }
  });
};
