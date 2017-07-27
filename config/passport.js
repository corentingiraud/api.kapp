const LocalStrategy   = require('passport-local').Strategy;
const userModel = require('../app/models/user.js');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
	done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    userModel.findById(id, function(err, user) {
      done(err, user);
    });
  });

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true,
	},

	function(req, username, password, done) {
		process.nextTick(function() {
      userModel.findOne({ 'local.username' :  username }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, false);
        } else {
          var newUser = new userModel();
          newUser.local.username = username;
          newUser.local.password = newUser.generateHash(password);
          newUser.local.code = newUser.generateHash(req.body.code);
          newUser.local.role = req.body.role;
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });    
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true,
	},
	function(req, username, password, done) {
		userModel.findOne({ 'local.username' :  username }, function(err, user) {
      console.log(user.validPassword(password));
			if (err)
				return done(err);
			if (!user)
				return done(null, false); 
			if (!user.validPassword(password))
				return done(null, false); 
			return done(null, user);
		});
	}));
}; 
