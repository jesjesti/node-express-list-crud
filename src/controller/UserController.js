"use strict";

var mongoose = require("mongoose");
User = mongoose.model("User");

exports.save = function (req, res) {
  var newUser = new User(req.body);

  User.findOne({ email: newUser.email }, (err, data) => {
    if (!data) {
      newUser.save((err, data) => {
        if (data) {
          return res.status(200).json({
            message: "Save successfull",
            data: data,
          });
        }
      });
    } else {
      return res.status(412).json({
        message: "email id is already exist",
        data: null,
      });
    }
  });
};

exports.update = function (req, res, next) {
  var userBean = new User(req.body);
  Role.findOneAndUpdate(
    {
      _id: userBean._id,
    },
    {
      $set: {
        userName: userBean.userName,
        email: userBean.email,
        contactNumber: userBeancontactNumber,
        address: userBean.address,
        password: userBean.password,
      },
    },
    (err, data) => {
      if (!data) {
        if (err) throw err;
        res.send({ message: "Can't update user" });
      } else {
        return res.status(200).json({
          message: "User deatils updated sucessfully",
          data: data,
        });
      }
    }
  );
};
