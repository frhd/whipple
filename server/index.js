"use strict";
require("dotenv").config();

const bodyParser = require("body-parser");
const app = require("./app");

const PORT = process.env.PORT || 9000;

app.use(bodyParser.json({ strict: true }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}! in mode ${process.env.NODE_ENV}`);
});
