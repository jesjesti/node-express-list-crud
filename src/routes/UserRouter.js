"use strict";

var express = require("express");
var router = express.Router();

var userController = require("../controller/UserController");

router.post("/save", userController.register);
router.post("/update", userController.updateUser);

module.exports = router;
