const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {});

const { PORT = 3000 } = process.env;

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: "655e69f68f7be2536861c904",
  };
  next();
});
app.use(require("./routes/index"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
