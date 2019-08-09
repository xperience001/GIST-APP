const Post = require('../model/post');


class allPost {
    createPost(req,res){
        let post = new Post(req.body)
        post.save().then(()=>{
            return res.send({
                error: false,
                statusCode: 200,
                message: 'successfully created a gist'
            })
        })
        .catch((err)=>{
            return res.send({
                error: true,
                statusCode: 400,
                message: 'err', err
            })
        })
    }

    getPost(req,res){
        const {postid} = req.params
        if(!postid){
            return res.send({
                error: true,
                statusCode: 404,
                message: 'oga pass id joor',
                })
        }
        Trivia.findById(postid).then((post) => {
            return res.send({
                error: false,
                statusCode: 200,
                message: 'a post',
                response: post
                })
        }).catch((err) => {
           return res.send({
                error: true,
                statusCode: 400,
                message: 'err', err
                })
        });
    }

        getAllPost(req,res){
        Post.find()
        .then((post)=>{
            res.send({
                error: false,
                statusCode: 200,
                triviaCount: post.length,
                message: 'all post',
                response: post
                })
        }).catch((err)=>{
            return res.send({
                error: true,
                statusCode: 400,
                message: 'err', err
                })
        });
    }

    
}

module.exports = allPost;
