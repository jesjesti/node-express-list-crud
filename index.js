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

//Mongoos Connection
const mongoose = require("mongoose");
const option = {
  socketTimeoutMS: 30000,
  keepAlive: true,
};

//Import Mongoos Model
require("./src/model/UserShema");

//Routers imports
var userRouter = require("./src/routes/UserRouter");

//Router usage
app.use("/user", userRouter);

//mongo connection
mongoose
  .connect(
    process.env.MONGO_CONNECTION_URL + "/" + process.env.MONGO_DB_NAME,
    option
  )
  .then(
    function () {
      console.log("DB connection sucessfull");
    },
    function (err) {
      console.log("DB connection failed", err);
    }
  );

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started on port :${process.env.SERVER_PORT}`);
});
