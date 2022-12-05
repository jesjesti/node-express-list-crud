"use strict";
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();

//APP Configuration
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
  })
);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started on port :${process.env.SERVER_PORT}`);
});
