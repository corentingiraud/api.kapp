const passport = require("passport");

module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()){
    return next();
  }
  const rep = {
    code: "err",
    message: "Vous n'êtes pas identifié.",
  };
  res.send(rep);
}

module.exports.isLoggedInWithCode = (req, res, next) => {
  if (req.isAuthenticated() && req.user.validCode(req.query.code)) {
    return next();
  }
  const rep = {
    code: "err",
    message: "Vous n'êtes pas identifié, ou vous avez tapez le mauvais code.",
  };
  res.send(rep);
} 

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.local.role === "admin") {
    return next();
  }
  const rep = {
    code: "err",
    message: "Vous n'avez pas les droits suffisant",
  };
  res.status(401).send(rep);
}
