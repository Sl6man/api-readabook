const mongoose = require('mongoose')

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    books:[
        {
            author: String,
            pages: String,
            date: String,
            title: String,
            subTitle:String,
            progress: {
                type:String,
                default:'0'
            },
            bookId: String,
            createAt: String,
            state: String,
            language: String,
            rated:{
                type: Boolean,
                default: false
            }
        }
    ],
    following:[
        {
            userId: String,
            followingUsername: String
        }
    ],
    followers:[
        {
            userId: String,
            followingUsername: String
        }
    ],
    rate: [{
        rating: String,
        description: String,
        bookId: String
    }]
})

const User = mongoose.model('user', user)

module.exports = User