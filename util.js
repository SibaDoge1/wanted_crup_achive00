const jwt = require('jsonwebtoken');
const debug = require('debug');

var util = {};

util.resJson = function(success, message, data){
  if(!message) message = null;
  if(!data) data = null;
  return {
    success:success,
    message:message,
    data:data
  };
};


util.decodeToken = function(req,res,next){
  var token = req.headers['x-access-token'];
  if (!token) return res.json(util.resJson(false, 'token is required!'));
  else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if(err) return res.json(util.resJson(false, err.message));
      else{
        req.decoded = decoded;
        next();
      }
    });
  }
};

util.log = debug('mycode:log');
util.error = debug('mycode:error');

module.exports = util;