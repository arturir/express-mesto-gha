const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {});

const { PORT = 3000 } = process.env;

const app = express();
app.use("/", require("./routes/index"));

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? "На сервере произошла ошибка" : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
