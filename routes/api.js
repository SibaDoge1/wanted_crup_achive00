const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const postsRouter = require('./posts');
const authRouter = require('./auth');


router.get('/', function(req, res, next){
  res.send("helloooooooh");
})


router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/auth', authRouter);


module.exports = router;
