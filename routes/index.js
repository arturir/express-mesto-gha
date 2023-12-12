const router = require("express").Router();
const { HTTP_STATUS_NOT_FOUND } = require("http2").constants;
const express = require("express");
const { celebrate, Joi, errors } = require("celebrate");

const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const validationBodyCreateCard = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3).regex(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).regex(/[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/i),
  }),
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use("/users", auth, require("./users"));
router.use("/cards", auth, require("./cards"));

router.post("/signin", validationBodyCreateCard, login);
router.post("/signup", validationBodyCreateCard, createUser);

router.use(errors());
router.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? "На сервере произошла ошибка" : message });
});

router.use("*", (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Страница не найдена" });
});

module.exports = router;
