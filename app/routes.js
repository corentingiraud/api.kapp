var adherentModel = require('./models/adherent.js');

module.exports = function (app, passport) {
 
    app.post('/api/users/login', function(req, res, next) {
        passport.authenticate('local-login', function(error, user, info) {
            if(error) {
                return res.status(500).json({code:"err", message: (error || "Erreur serveur.")});
            }
            if(!user) {
                return res.status(200).json({code:"err", message: "Username or password invalid"});
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send({code:"ok", user: user});
            });
        })(req, res, next);
    });

    app.post('/api/users', isAdmin, function(req, res, next) {
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

    app.get('/api/adherents', isLoggedIn, function (req, res) {
        adherentModel.find(function(err, adherents) {
            if (err) {
                res.send(err);
            }
            res.json(adherents);
        });
    });

    app.post('/api/adherents/new', isLoggedIn, function (req, res) {
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

    app.delete('/api/adherents/:adherentId', isLoggedIn, function (req, res) {
        adherentModel.remove({
            _id: req.params.adherentId
        }, function (err, adherent) {
            if (err)
                res.send(err);
            res.status(200).send({code: "ok", message: ""});
        });
    });

    app.get('/api/adherents/search', isLoggedIn, function(req, res) {
        const strRegEx = ".*?"+req.query.query+".*?";
        const regex = new RegExp(strRegEx);
        adherentModel.find({ $or: [ { nom: regex}, { prenom: regex}]
        }, function(err, adherentResult){
            if (err)
                res.send(err);
            res.json(adherentResult);
        });
    });

    app.post('/api/users/logout', function(req, res) {
        req.logout();
        res.send({code: "ok", message:"deconnexion reussie"});
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    const rep = {
        code: "err",
        message: "Vous n'êtes pas identifié.",
    };
    res.send(rep);
} 

function isLoggedInWithCode(req, res, next) {
    if (req.isAuthenticated() && req.user.validCode(req.body.code)) {
        return next();
    }
    const rep = {
        code: "err",
        message: "Vous n'êtes pas identifié, ou vous avez tapez le mauvais code.",
    };
    res.send(rep);
} 

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.local.role === "admin") {
        return next();
    }
    const rep = {
        code: "err",
        message: "Vous n'avez pas les droits suffisant",
    };
    res.status(401).send(rep);
}
