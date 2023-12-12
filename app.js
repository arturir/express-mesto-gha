const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {});

const { PORT = 3000 } = process.env;

const app = express();
app.use("/", require("./routes/index"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
