const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const models = require("../models");
const util = require("../util");

/* id 설정관련 라우터 */
router.get('/', function(req, res, next) {
    models.user.findAll()
    .then(function(result){
      res.json(util.resJson(true, result));
    })
    .catch(error => res.json(util.resJson(false, error)))
});


router.post("/", async function(req,res,next){
  let body = req.body;

  let inputPassword = body.password; 
  let salt = Math.round((new Date().valueOf() * Math.random())) + ""; 
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex"); 
 
  models.user.create({
    userid: body.userid,
    password: hashPassword,
    salt: salt
  })
  .then( result => {
    util.log(`user ${body.userid} created!`);
    res.json(util.resJson(true, `user [${body.userid}] created!`));
  })
  .catch( err => {
    util.log(err);
    res.json(util.resJson(false, err.errors[0].message));
  })
})


module.exports = router;