const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const util = require('./util');
const apiRouter = require('./routes/api');
const app = express();

let hostname = '127.0.0.1';
let port = normalizePort(process.env.PORT || '8000');

//------------------------------------사전설정-----------------------------------------

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//------------------------------------http서버생성-----------------------------------------
const http = require('http');
app.set('port', port);

let server = http.createServer(app);

server.listen(port, hostname, ()=>{
  util.log(`Server running at http://${hostname}:${port}/`)
});
server.on('error', onError);


//------------------------------------라우터설정-----------------------------------------
app.get('/', function (req, res, next) {
  res.send("server is online")
});

app.use('/api', apiRouter);

//------------------------------------에러핸들링-----------------------------------------
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  let message = req.app.get('env') === 'development' ? err.message : {};
  util.error(err);

  // render the error page
  res.status(err.status || 500);
  res.json(util.resJson(false, message));
});

//------------------------------------아래는 함수들-----------------------------------------

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      util.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      util.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}



module.exports = app;
