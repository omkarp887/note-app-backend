const express = require("express");
const bcrypt = require("bcrypt");
const { userModel } = require("../models/userModel");
// const { noteModel } = require("../models/NoteModel");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("All the user");
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 5, async function (err, hash) {
    //store hash in password DB.
    try {
      if (err) return res.send({ message: "something went wrong", status: 0 });
      let user = new userModel({ name, email, password: hash });
      await user.save();
      res.send({
        message: "user created",
        status: 1,
      });
    } catch (error) {
      res.send({
        message: error.message,
        status: 0,
      });
    }
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let option = {
    expiresIn: "10m",
  };
  try {
    let data = await userModel.find({ email });
    if (data.length > 0) {
      let token = jwt.sign({ userId: data[0]._id }, "omkar", option);
      bcrypt.compare(password, data[0].password, function (err, result) {
        if (err)
          return res.send({ message: "Something went wrong" + err, status: 0 });
        if (result) {
          res.send({
            message: "User logged in succesfully",
            token: token,
            status: 1,
          });
        } else {
          res.send({
            message: "incorrect password",
            status: 0,
          });
        }
      });
    } else {
      res.send({
        message: "user does not exist",
        status: 0,
      });
    }
  } catch (error) {
    res.send({
      message: error.message,
      status: 0,
    });
  }
});

module.exports = {
  userRouter,
};
