const User = require('../model/user');
const validator = require('validator');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

class allUser {
    signup(req,res){
        let user = new User(req.body);
        let { email } = req.body;

        if(validator.isEmail(email) != true){
            return res.status(400).send({
                error: true,
                code: 400,
                message: 'email is not valid'
            });
        } 

        User.findOne({email})
        .then( data =>{
            if(data){
                return res.send({
                    error:true,
                    message: `email ${email} already exists`
                });
            }
            user.save().then( data =>{
                return res.send({
                    error: false,
                    message: `user was registered successfully`,
                    user_id: data._id
                })
            }).catch( error =>{
                return res.send({
                    error: true,
                    message: 'unable to save to db',
                    response: error
                })
            })

    }).catch( error=>{
        return res.send({
            error: true,
            message: 'unable to find from db',
            response: error
        })
    }) 
    }

    login(req,res){
        let { email } = req.body;
        let { password } = req.body
        let user = new User;
        
        if(validator.isEmail(email) !== true){
            return res.send({
                error: true,
                message: `invalid email address`
            })
        }
        if(!email){
            return res.send({
                message: `enter a valid email`
            })
        }

        User.findOne({email, password})
        .then(data=>{
            if(data){
                // bcrypt.compare(password,user.password,(err,isMatch)=>{
                //     if (err) throw err,
                //     res.status(200).send(isMatch)
                // })

                return res.send({
                    error: false,
                    message: 'user successfully logged-in'
                }).then(()=>{
                    user.generateToken((err,user)=>{
                        if(err) res.status(400).send(err);
                        res.cookie('auth',user.token).send('ok')
                    })
                }).catch((err)=>{
                    return err
                })


            }
            else{
                return res.send({
                    error: true,
                    message: 'invalid username or password'
            })
            }
        }
        )
        .catch(err=>{
            return res.send({
                error: true,
                message: 'an error occured',
                response: err
            })
        })
    }
}

module.exports = allUser;