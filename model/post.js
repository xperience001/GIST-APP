const mongoose = require('mongoose');

const Schema = mongoose.Schema

const postSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    post_date: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('post', postSchema)