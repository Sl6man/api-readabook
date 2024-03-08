const express = require('express')
const User = require('../modules/User')
const JWT = require('jsonwebtoken')
const { mongo } = require('mongoose')
require('dotenv').config();


const SECRET = process.env.SECRT

const router = express.Router()


// delete book 
router.post('/deleteBook/api', async(req,res)=>{
    const {token, mongoId} = req.body
    JWT.verify(token, SECRET, async(err,decoded)=>{
        if(err){
            return res.json(err)
        }else{
            const user = await User.findById(decoded.data.id)
            for(let i=0; i < user.books.length ; i++){
                if(user.books[i]._id.toString() === mongoId){
                    user.books.splice(i, 1   )
                }
            }
            await user.save()
            res.json({
                delete: true
            })
        }
    })
})

router.get('/getBook/api', async (req,res, next)=>{
    const token = req.headers['x-access-token']
    JWT.verify(token, SECRET, async (err, decoded)=>{
        if(err){
            return res.json(err)
        }else{
            const user = await User.findById(decoded.data.id)
            res.json(user.books.filter(book => book.state == 'list'))
            next()
        }
    })
})

router.post('/reading/api', async(req,res)=>{
    const {token, mongoId} = req.body
    JWT.verify(token, SECRET, async(err, decoded)=>{
        if(err){
            return res.json(err)
        }else{
            const user = await User.findById(decoded.data.id)
            const book = user.books.find(book => book._id == mongoId)
            book.state = "reading"
            await user.save()
            res.json({
                add: true
            })
        }
    })
})

router.get("/reading/api", async(req,res)=>{
    const token = req.headers['x-access-token']
    JWT.verify(token, SECRET, async(err, decoded)=>{
        if(err){
            return res.json(err)
        }else{
            const user = await User.findById(decoded.data.id)
            const readingBook = user.books.filter(book => book.state === "reading")
            res.json(user.books.filter(book => book.state === "reading"))
        }
    })
})

router.post('/progress/api', (req,res)=>{
    const {token, progress} = req.body

    const bookProgress = progress.split(' ')[0]
    const mongoId = progress.split(' ')[1]
    JWT.verify(token, SECRET, async(err, decoded)=>{
        const user = await User.findById(decoded.data.id)
        const book = user.books.find(book => book._id == mongoId)
        book.progress = bookProgress
        user.save()
        res.json({
            pageCount: book.pages,
            mongoId: book._id
        })
    })
})

router.post('/finished/api', (req,res)=>{
    const {token, mongoId} = req.body
    JWT.verify(token, SECRET, async(err, decoded)=>{
        if(err){
            res.json(err)
        }else{
            const user = await User.findById(decoded.data.id)
            const book = user.books.find(book => book._id == mongoId)
            book.state = "finished"
            user.save()
            res.json({
                add: true
            })
        }
    })
})

router.get('/finished/api', (req,res)=>{
    const token = req.headers['x-access-token']
    JWT.verify(token, SECRET, async(err, decoded)=>{
        if(err){
            return res.json(err)
        }else{
            const user = await User.findById(decoded.data.id)
            res.json(user.books.filter(book => book.state === "finished"))
        }
    })
})



module.exports = router