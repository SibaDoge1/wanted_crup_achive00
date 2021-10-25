const express = require('express');
const router = express.Router();
const models = require("../models");
const util = require("../util");


/*게시글 관련 라우터*/
router.get('/', function(req, res, next){
    let page = (req.query.page == undefined || req.query.page <= 0) ? 1 : req.query.page;
    let pageOpt = {};

    if(req.query.size != undefined || req.query.size > 0){
        pageOpt = {
            offset: (page-1)*req.query.size,
            limit: req.query.size
        };
    }

    models.post.findAndCountAll({
        order : [['createdAt', 'DESC']],
        distinct: true,
        ...pageOpt
    }).then(result => {
        res.json(util.resJson(true, null,result));
    });
});


router.post('/', util.decodeToken, function(req, res, next){
    models.post.create({
        author: req.decoded.userid,
        title: req.body.title,
        content: req.body.content
      })
      .then( result => {
        util.log(`post ${result.postid} created!`);
        res.json(util.resJson(true, `post [${result.postid}] created!`));
      })
      .catch( err => {
        util.log(err);
        res.json(util.resJson(false, err.errors[0].message));
      })
});


router.put('/', util.decodeToken, async function(req, res, next){
    let post = await models.post.findByPk(req.body.postid);
    if(post.userid != req.decoded.userid){
        res.json(util.resJson(false, "Author is not YOU!!!"));
        return;
    }

    models.post.update({
        title: req.body.title,
        content: req.body.content
      }, {
          where:{
              postid:req.body.postid,
              author:req.decoded.userid
          }
      })
      .then( result => {
        util.log(`post ${result.postid} updated!`);
        res.json(util.resJson(true, `post [${result.postid}] updated!`));
      })
      .catch( err => {
        util.log(err);
        res.json(util.resJson(false, err.errors[0].message));
      })
});


router.put('/', util.decodeToken, async function(req, res, next){
    let post = await models.post.findByPk(req.body.postid);
    if(post.userid != req.decoded.userid){
        res.json(util.resJson(false, "Author is not YOU!!!"));
        return;
    }

    models.post.destroy({
        where: {
            postid:req.body.postid,
            author:req.decoded.userid
        }
      })
      .then( result => {
        util.log(`post ${result} deleted!`);
        res.json(util.resJson(true, `post [${result.title}] deleted!`));
      })
      .catch( err => {
        util.log(err);
        res.json(util.resJson(false, err.errors[0].message));
      })
});


module.exports = router;
