const express = require("express");

const { PORT = 3000 } = process.env;

const app = express();

app.use(require("./routes/index"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
