const express = require('express');
const router = express.Router();
const AllPost = require('../controller/post');
const AllUser = require('../controller/user');
const postController = new AllPost();
const userController = new AllUser();

router.get('/', (req,res)=>{
    console.log('healthy API, you are welcome');
    res.status(200).send({
        error: false,
        message: 'healthy API, you are welcome'
    });
});

router.get('/all-post', (req,res)=>{
    postController.getAllPost(req,res);
});

router.get('/post', (req,res)=>{
    postController.getPost(req,res);
});

router.post('/post/create', (req,res)=>{
    postController.createPost(req,res);
});

router.post('/post/signup', (req,res)=>{
    userController.signup(req,res);
});

router.post('/post/login', (req,res)=>{
    userController.login(req,res);
});


module.exports = router; 