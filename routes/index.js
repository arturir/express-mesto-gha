const router = require("express").Router();
const express = require("express");
const { celebrate, Joi, errors } = require("celebrate");
const NotFoundError = require("../errors/NotFoundError");
const regExpUrl = require("../regexp/url");
const regExpEmail = require("../regexp/email");

const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const validationBodyCreateCard = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3).regex(regExpEmail),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).regex(regExpUrl),
  }),
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use("/users", auth, require("./users"));
router.use("/cards", auth, require("./cards"));

router.post("/signin", validationBodyCreateCard, login);
router.post("/signup", validationBodyCreateCard, createUser);

router.use("*", auth, () => {
  throw new NotFoundError("Страница не найдена");
});

router.use(errors());
router.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? "На сервере произошла ошибка" : message });
});

module.exports = router;
