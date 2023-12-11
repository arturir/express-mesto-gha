const router = require("express").Router();
const { HTTP_STATUS_NOT_FOUND } = require("http2").constants;
const express = require("express");
const { celebrate, Joi, errors } = require("celebrate");

const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const validationBodyCreateCard = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(2),
  }),
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use("/users", auth, require("./users"));
router.use("/cards", auth, require("./cards"));

router.post("/signin", validationBodyCreateCard, login);
router.post("/signup", validationBodyCreateCard, createUser);

router.use(errors());
router.use("*", (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Страница не найдена" });
});

module.exports = router;
