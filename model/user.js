const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_I = 10;

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    firstname: {
        type:String,
        maxlength:30
    },
    lastname:{
        type:String,
        maxlength:30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    token: {
        type: String
    }
},
{
    timestamps: true
})

userSchema.pre('save',(next)=>{
    let user = this;

    if(user.isModified('password')){
    bcrypt.genSalt(SALT_I, (err,salt)=>{
        if(err) return next(err);

        bcrypt.hash(user.password,salt,(err,hash)=>{
            if(err) return next(err);
            user.password = hash;
            next();
            console.log('reached here')
        })

    })
}else{
    next();
}
})

userSchema.methods.generatetoken = function(cb){
    let user = this;
    let token = jwt.sign(user._id.toHexString(), 'supersecret');

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user)
    })
}

userSchema.statics,findByToken = (token,cb)=>{
    const user = this;

    jwt.verify(token,'supersecret',(err,decode)=>{
        user.findOne({"_id":decode,"token":token},(err,user)=>{
            if(err) return cb(err);
            cb(null,user)
        })
    })
}

module.exports = mongoose.model('user', userSchema)