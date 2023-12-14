const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const app = express();

const isLoggedIn = (req, res, next) => {
  try {
    const { jwttoken } = req.headers;
    const user = jwt.verify(jwttoken, process.env.JWT);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.json({
      status: 'FAILED',
      message: "You've not logged in! Please login",
    });
  }
};

//privateroute
app.get('/dashboard', isLoggedIn, async (req, res) => {
  res.send('WELCOME TO DASHBOARD PAGE!');
});

app.post('/signUp', async (req, res) => {
  try {
    const { FullName, email, password, age, gender, mobile } = req.body;
    const encryption = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const user = await User.create({
        FullName,
        email,
        password: encryption,
        age,
        gender,
        mobile,
      });
      const jwttoken = jwt.sign(user.toJSON(), process.env.JWT, {
        expiresIn: 60 * 30,
      });
      res.status(201);
      res.json({
        status: 'Success',
        message: 'User SignUp Successfully',
        jwttoken,
      });
    } else {
      res.status(409);
      res.send({
        status: 'Failed',
        message: 'User already Exist',
      });
    }
  } catch (error) {
    res.status(404);
    res.json({
      status: 'Failed',
      message: 'Something went wrong',
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      let PasswordMatch = await bcrypt.compare(password, user.password);
      if (PasswordMatch) {
        const jwttoken = jwt.sign(user.toJSON(), process.env.JWT, {
          expiresIn: 60 * 30,
        });
        res.json({
          status: 'Success',
          message: 'User loggedIn Successfully',
          jwttoken,
        });
      } else {
        res.json({
          status: 'Failed',
          message: 'Invaild credentials',
        });
      }
    } else {
      res.json({
        status: 'Failed',
        message: 'User Not Found',
      });
    }
  } catch (error) {
    res.json({
      status: 'Failed',
      message: 'Invaild credentials',
    });
  }
});

module.exports = app;
