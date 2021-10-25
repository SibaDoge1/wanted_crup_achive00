const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const models = require("../models");
const util = require('../util');
const jwt = require('jsonwebtoken');


/*토큰 관련 라우터*/
router.get('/', async function (req, res, next) {
  let userid = req.query.userid;
  let result = await models.user.findOne({
    where: {userid : userid}
  });

  if (result == undefined) {
    res.json(util.resJson(false, `There is no userid: ${userid}`));
  } 

  else {
    let dbPassword = result.dataValues.password;
    let inputPassword = req.query.password;
    let salt = result.dataValues.salt;
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    
    if(dbPassword === hashPassword){
      let payload = { userid: userid };
      let options = { expiresIn: 60 * 60 * 24 };

      jwt.sign(payload, process.env.JWT_SECRET, options, function(err, token){
        if(err) return res.json(util.resJson(false, err.message));
        res.json(util.resJson(true, `User [${userid}] token is generated!`,{"token":token}));
      });
    }
    else{
      res.json(util.resJson(false, `invalid password!`));
    }
  }
});

module.exports = router;