const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../middlewares/auth.js");

router.post("/", auth.isAdmin, function(req, res, next) {
  passport.authenticate('local-signup', function(error, user, info) {
    if(error) {
      return res.status(500).json({code:"err", message: (error || "Erreur serveur.")});
    }
    if(!user) {
      return res.status(409).send({code: "err", message:"That email is already taken."});
    }
    res.status(201).send({code:"ok", user: user});
  })(req, res, next);
});

router.post("/login", function(req, res, next) {
  console.log(req.sessionID);
  passport.authenticate('local-login', function(error, user, info) {
    if(error) {
      return res.status(500).json({code:"err", message: (error || "Erreur serveur.")});
    }
    if(!user) {
      return res.status(200).json({code:"err", message: "Username or password invalid"});
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send({code:"ok", message: user.local.role});
    });
  })(req, res, next);
});

router.get("/me", auth.isLoggedIn, function (req, res) {
  res.status(200).send({code:"ok", message: req.user.local.role});
});

router.post('/logout', function(req, res) {
  req.logout();
  res.send({code: "ok", message:"deconnexion reussie"});
});

module.exports = router;
