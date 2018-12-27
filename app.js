const createError = require('http-errors');
const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const SessionStore = require('express-mysql-session');

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const paperworkRouter = require('./routes/paperwork');
const filesRouter = require('./routes/files');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
    key: 'sc_name',
    secret: 'fadgfhtjrst35fs35faeu7',
    store: new SessionStore({
        host:"localhost",
        user:"root",
        password:"password",
        database:"ilab2"
    }),
    resave: true,
    saveUninitialized: true
}));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/paperwork', paperworkRouter);
app.use('/files', filesRouter);

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
