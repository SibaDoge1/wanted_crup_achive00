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

    models.post.findAll({
        order : [['postid', 'DESC']],
        ...pageOpt
    }).then(result => {
        res.json(util.resJson(true, null,
          {
          "count":result ? result.length : 0 ,
          "posts":result
          }
        ));
    });
});


router.get('/:postid', async function(req, res, next){
  let postid = parseInt(req.params.postid);
  let post = await models.post.findByPk(postid);
  if(post == undefined){
    res.json(util.resJson(false, `postid [${postid}] not exists`));
    return;
  }
  res.json(util.resJson(true, null, post))
});


router.post('/', util.decodeToken, function(req, res, next){
    models.post.create({
        author: req.decoded.userid,
        title: req.body.title,
        content: req.body.content
      })
      .then( result => {
        util.log(`post ${result.title} created!`);
        res.json(util.resJson(true, `post [${result.title}] created!`, {"postid":result.postid}));
      })
      .catch( err => {
        util.log(err);
        res.json(util.resJson(false, err.errors[0].message));
      })
});


router.put('/:postid', util.decodeToken, async function(req, res, next){
    let postid = parseInt(req.params.postid);
    let post = await models.post.findByPk(postid);
    if(post == undefined){
      res.json(util.resJson(false, `postid [${postid}] not exists`));
      return;
    }
    if(post.author != req.decoded.userid){
        res.json(util.resJson(false, "Author is not YOU!!!"));
        return;
    }

    models.post.update({
        title: req.body.title,
        content: req.body.content
      }, {
          where:{
              postid:postid,
              author:req.decoded.userid
          }
      })
      .then( result => {
        util.log(`post ${postid} updated!`);
        res.json(util.resJson(true, `postid [${postid}] updated!`));
      })
      .catch( err => {
        util.log(err);
        res.json(util.resJson(false, err.errors[0].message));
      })
});


router.delete('/:postid', util.decodeToken, async function(req, res, next){
    let postid = parseInt(req.params.postid);
    let post = await models.post.findByPk(postid);
    if(post == undefined){
      res.json(util.resJson(false, `postid [${postid}] not exists`));
      return;
    }
    if(post.author != req.decoded.userid){
        res.json(util.resJson(false, "Author is not YOU!!!"));
        return;
    }

    models.post.destroy({
        where: {
            postid:postid,
            author:req.decoded.userid
        }
      })
      .then( result => {
        util.log(`postid ${postid} deleted!`);
        res.json(util.resJson(true, `postid [${postid}] deleted!`));
      })
      .catch( err => {
        util.log(err);
        res.json(util.resJson(false, err.errors[0].message));
      })
});


module.exports = router;
