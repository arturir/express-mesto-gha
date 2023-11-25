const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { handleError } = require("./middlewares/middlewares");

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: "655e69f68f7be2536861c904",
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use((req, res, next) => {
  if (res.err) {
    handleError(req, res, res.err);
  } else {
    next();
  }
});
app.get("*", (req, res) => {
  res.send({ message: "Страница не найдена" }, 404);
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
