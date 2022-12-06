"use strict";

var express = require("express");
var router = express.Router();
var authUtil = require("../utils/AuthUtil");

var userController = require("../controller/UserController");

router.post("/register", userController.register);
//router.post("/update", userController.updateUser);
router.post("/get/all", authUtil.authenticateJWT, userController.findAll);

module.exports = router;
