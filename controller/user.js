const User = require('../model/user');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            else{
                bcrypt.hash(req.body.password, 10, (err, hpass)=>{

                    if(err){
                        res.status(500).json({
                            error: err.message
                        });
                    }
                    else{
        
                        const user = new User({
                            email: req.body.email,
                            password: hpass
                        });
                        user.save()
                        .then( user=>{
                            res.status(200).json({
                                error:false,
                                message: `User created succesfully with id ${user._id}`,
                                // user_id: user._id
                            });
                        })
                        .catch( err=>{
                            return res.send({
                                error: true,
                                message: 'unable to save to db',
                                response: err
                            });
                        });
                    }
                });
            }

    }).catch( error=>{
        return res.send({
            error: true,
            message: 'unable to find from db',
            response: error
        })
    }) 
    }

    logIn (req, res, next) {
        let { email } = req.body;
        let { password } = req.body;
                
        if(validator.isEmail(email) !== true){
            return res.send({
                error: true,
                message: `invalid email address`
            })
        }

        User.findOne({email: email})
        .exec()
        .then( user=>{
            if(!user){
                return res.status(401).json({
                    error: true,
                    message: 'Email does not exist kindly sign up'
                });
            }
            else{
                bcrypt.compare(password, user.password, (err, result)=>{
                    if(err){
                        return res.status(401).json({
                            error: true,
                            message: 'Auth failed'
                        });
                    }
                    if(result){
                        const token =jwt.sign({
                            email: user.email,
                            userID: user._id
                          },
                        //   process.env.JWT_SECRET
                        'secret',
                           {
                             expiresIn: "1h"
                              }
                        );
                        
                        return res.status(200).json({
                            error: false,
                            message: 'You logged in succesfully',
                            token: token
                        });
                    }
                    else{
                        return res.status(401).json({
                            error: true,
                            message: 'Incorrect password'
                        });
                    }
                });
            }
        })
        .catch( err=>{
            Response(res)
            .error_res(err, 500);
        });
    }

    deleteUser (req, res, next){
        User.deleteOne({_id: req.params.id})
        .then( data=>{
            res.status(200).json({
                error: false,
                message: `User was deleted succesfully`
            });
        })
        .catch( err=>{
            return res.send({
                error: true,
                message: 'an error occured deleting the user',
                response: err
            })
        });
    }
}

module.exports = allUser;