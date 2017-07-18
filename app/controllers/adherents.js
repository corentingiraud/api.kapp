const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../middlewares/auth.js");
const adherentModel = require('../models/adherent.js');

router.get("/", auth.isLoggedIn, function (req, res) {
  adherentModel.find(function(err, adherents) {
    if (err) {
      res.send(err);
    }
    res.json(adherents);
  });
});

router.post("/new", auth.isLoggedInWithCode, function (req, res) {
  adherentModel.create({
    nom: req.body.nom,
    prenom: req.body.prenom,
    dateNaissance: new Date(req.body.dateNaissance),
    dateCreation: Date.now(),
    ecole: req.body.ecole,
  }, function (err, adherent) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json({code:"ok", message: ""});
    }            
  });
});

router.delete("/:adherentId", auth.isLoggedInWithCode, function (req, res) {
  adherentModel.remove({
    _id: req.params.adherentId
  }, function (err, adherent) {
    if (err)
      res.send(err);
    res.status(200).send({code: "ok", message: ""});
  });
});

module.exports = router;
