const router = require("express").Router();
const { HTTP_STATUS_NOT_FOUND } = require("http2").constants;
const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use((req, res, next) => {
  req.user = {
    _id: "655e69f68f7be2536861c904",
  };
  next();
});
router.use("/users", require("./users"));
router.use("/cards", require("./cards"));

router.use("*", (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Страница не найдена" });
});

module.exports = router;
