const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const mysql = require('mysql');

const indexRouter = require('./routes/index');
const animeNightRouter = require('./routes/animenight')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const MySQLStore = require('express-mysql-session')(session);

const options = {
	host: '127.0.0.1',
	port: 3306,
	user: 'candxkxa_candybot',
	password: 'b@8L!66T6Kxx',
	database: 'candxkxa_candyBot',
};

const database = mysql.createConnection(options);
module.exports.mysql = database;

const sessionStore = new MySQLStore({ },database);


app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		maxAge: 86400000,
	},
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/animenight/', animeNightRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
