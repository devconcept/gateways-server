const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const config = require('config');

const { normalizeAndPrintError } = require('./helpers/errors');
const { isProduction, isTest } = require('./helpers/environments');

const gatewaysRouter = require('./routes/gateways');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'resources/public'),
  dest: path.join(__dirname, 'resources/public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
}));

if (isProduction() || isTest()) {
  app.use(helmet());
  app.use(compression());
}

app.use(express.static(path.join(__dirname, 'resources/public')));

app.use(cors(config.get('cors')));
app.use('/gateways', gatewaysRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
/* eslint-disable-next-line no-unused-vars */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  normalizeAndPrintError(res, err);
});

module.exports = app;
