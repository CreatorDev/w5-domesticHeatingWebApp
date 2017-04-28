var express = require('express')
var path = require('path')
// var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const dsHeater = require('./helpers/ds_heater')
const cors = require('cors')
const Notifications = require('./cfg/notification_endpoints')

var app = express()
app.use(cors())
app.options('/schedule', cors()) // enable pre-flight request

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const dsNotificationRoutes = require('./routes/ds_notification_routes')
app.use(Notifications.endpointPrefix, dsNotificationRoutes)

const dsSettingsRoutes = require('./routes/ds_settings_routes')
app.use('/', dsSettingsRoutes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

dsHeater.subscribeToClientConnectedChanges()
dsHeater.updateClientsNamesAndSubscribeForChanges()

module.exports = app