const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 8080;
const database = require('./config/database');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

mongoose.connect(database.url);

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  next();
};

var sessionMiddleware = session({
  secret: 'kfet4everKfet4ever',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: false
  },
});

const sessionProxy = function(req, res, next) {
  if (req.method !== "OPTIONS") {
    return sessionMiddleware(req, res, next);
  }
  next();
};

app.use(allowCrossDomain);
app.use(sessionProxy);

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser());

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

require('./app/controllers/main.js')(app);

app.listen(port);
console.log("App listening on port " + port);
