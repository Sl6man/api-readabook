const express = require("express")
const User = require("../modules/User")
const JWT = require("jsonwebtoken")
require('dotenv').config();

const SECRET = process.env.SECRT

const router = express.Router()

// add book 
router.post('/addBook/api', async(req,res)=>{
    const {token, id, title, pageCount, author, language, date} = req.body

    // tacking the info of user from the token
    let userId
    JWT.verify(token,SECRET,(err, decoded)=>{
        if(err){
            res.send(err)
        } else{
            
            userId=decoded.data.id
        }
    })
    
    // find user by id from the token
    const user = await User.findById(userId)
    // check if the is in the list 
    const isThere = user.books.filter(book => book.bookId === id)
    const isThereTitle = user.books.filter(book=> book.bookId === title)
    if(isThere.length <= 0 && isThereTitle.length <= 0){
        // add the book info to the data base
        user.books = user.books.concat({
            bookId:id,
            title:title,
            pages:pageCount,
            author:author,
            language: language,
            date: date,
            createAt: new Date(),
            state: "list"
        })
        await user.save()
        res.json({
            add: true
        })
    }else{
        res.json({add: false, message:'book is added before'})
    }
})


module.exports  = router