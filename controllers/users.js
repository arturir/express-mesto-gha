const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const secretKey = NODE_ENV === "production" ? JWT_SECRET : "dev-secret";

const User = require("../models/user");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const InternalServerError = require("../errors/InternalServerError");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => { next(new InternalServerError("Произошла ошибка")); });
};
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Такого пользователя не существует");
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError("Переданы некорректные данные для получения пользователя."));
      } else {
        next(err);
      }
    });
};
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then((hash) => {
    const { email, name, about, avatar } = req.body;
    User.create({ email, password: hash, name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError("Переданы некорректные данные при создании пользователя."));
      } else {
        next(new InternalServerError("Произошла ошибка"));
      }
    });
  });
};
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь с указанным _id не найден.");
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError("Переданы некорректные данные при обновлении профиля."));
      } else {
        next(err);
      }
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
  .then((user) => {
    if (!user) {
      throw new NotFoundError("Пользователь с указанным _id не найден.");
    } else {
      res.send(user);
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Переданы некорректные данные при обновлении аватара."));
    } else {
      next(err);
    }
  });
};
module.exports.login = (req, res, next) => { //исправить дбавлением в куки
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: "7d" });
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};
