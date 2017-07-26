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

app.use(cors({
  credentials: true
}));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser());

app.use(session({
  secret: 'kfet4everKfet4ever',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: true,
  proxy: undefined,
  cookie: {
    secure: true,
    maxAge: 36000000
  },
  rolling: true,
  unset: 'destroy'
}));

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

require('./app/controllers/main.js')(app);

app.listen(port);
console.log("App listening on port " + port);
