var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var donor = require('./routes/donor')
var employee = require('./routes/employee')
var role = require('./routes/role')
var blood = require('./routes/blood')
var hospital = require('./routes/hospital')
var donation = require('./routes/donation')
var order = require('./routes/order')
var issue = require('./routes/issue')
var bloodbank = require('./routes/bloodbank')

var methodOverride = require('method-override')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const hbs = require('hbs')

hbs.registerHelper('select', function(selected, options){
	return options.fn(this).replace(
		new RegExp('value=\"' + selected + '\"'),
		'$& selected=selected"')
})

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))
app.use('/', index);
app.use('/donor', donor)
app.use('/employee', employee)
app.use('/role', role)
app.use('/blood', blood)
app.use('/hospital', hospital)
app.use('/donation', donation)
app.use('/order', order)
app.use('/issue', issue)
app.use('/bloodbank', bloodbank)
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
