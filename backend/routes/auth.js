const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.status(401).json({
        msg: "User already exist",
        success: false,
      });
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      password: hash,
    });
    return res.status(200).json({
      msg: "SignIn Success",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(200).json({
        msg: `${info.message}`,
        success: false,
      });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      return res.status(200).json({
        msg: "Login Sucess!",
        success: true,
      });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next) 꼭 붙여야함.
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).json({
    msg: "Logout success",
    success: true,
  });
});

module.exports = router;
