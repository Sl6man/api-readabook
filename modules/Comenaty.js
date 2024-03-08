// this file will build a comenity

const mongoose = require('mongoose')

const comenaty = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    members:[
        {
            userId: String,
            username: String
        }
    ],
    book:{
        bookId: String,
        title: String,
        aotuer: String,
        pages: String,
        date: String,
    },
    admin:{
        userId: String,
        username: String
    }
    })
    
const Comenaty = mongoose.model('comenaty', comenaty);

module.exports = Comenaty

