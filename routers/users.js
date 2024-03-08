const express = require('express')
const User = require('../modules/User')
const Comenaty = require('../modules/Comenaty')
const JWT = require('jsonwebtoken')
const { mongo } = require('mongoose')
require('dotenv').config();


const SECRET = process.env.SECRT

const router = express.Router()

router.post('/findUser/api', async(req,res)=>{
    const {token, search} = req.body
    
    JWT.verify(token, SECRET, async(err, decoded)=>{
        if(err){
            return res.send(err)
        } else {
            const user = await User.findById(decoded.data.id)
            const users = await User.find({username: new RegExp(search, "gi")})
            const usersAfter = users.map(friendUser => {
                const isAdded = user.following.map(e=> {
                    if(e.userId == friendUser._id){
                        return true
                    }})

                const isUser = friendUser._id.toString() == user._id.toString()
                return([{username: friendUser.username,
                    following: friendUser.following.length,
                    followers:friendUser.followers.length,
                    rated: friendUser.rate.length,
                    userId : friendUser._id,
                    isAdded: isAdded.includes(true),
                    isUser
                }])
            })
            res.json({
                users: usersAfter
            })
        }
    })

})

router.post('/addFriend/api', (req,res)=>{
    const {userId, token} = req.body
    JWT.verify(token, SECRET, async(err, decoded)=>{
        const user = await User.findById(decoded.data.id)
        const friend = await User.findById(userId)
        // add to following "user"
        user.following = user.following.concat({
            userId: userId,
            followingUsername: friend.username
        })
        await user.save()
        // add to followers "friend"
        friend.followers = friend.followers.concat({
            userId: decoded.data.id,
            followingUsername: user.username
        })
        await friend.save()
        res.send({added: true})
    }) 
})

router.post('/deleteFriend/api', (req,res)=>{
    const {userId, token} = req.body
    JWT.verify(token, SECRET, async(err, decoded)=>{
        const user = await User.findById(decoded.data.id)
        const friend = await User.findById(userId)
        // delete from following "user"
        let i = 0
        for (i; i < user.following.length; i++){
            if(user.following[i].userId === userId){
                user.following.splice(i,1)
            }
        }
         // delete from following "friend"
        let b = 0
        for (b; b < friend.followers.length; b++){
            if(friend.followers[b].userId === decoded.data.id){
                friend.followers.splice(b,1)
            }
        }
        user.save()
        friend.save()
        res.json({deleted: true})
    })
})


router.post('/rate/api', (req,res)=>{
    const {token, mongoId, rate, textarea} = req.body
    JWT.verify(token, SECRET, async(err, decoded)=>{
        const user = await User.findById(decoded.data.id)
        user.rate = user.rate.concat({
            rating: rate,
            description: textarea,
            bookId: mongoId
        })
        const book = user.books.find(book => book._id == mongoId)
        book.rated = true
        user.save()
        res.json({rated:true})
    })
})

router.get('/account/api', (req,res)=>{
    const token = req.headers['x-access-token']
    JWT.verify(token, SECRET, async (err, decoded)=>{
        const user = await User.findById(decoded.data.id)
        res.json({
            username: user.username,
            followers: user.followers.length,
            following: user.following.length,
            rate: user.rate.length
        })
    })
})

router.post('/create/comenaty/api', (req,res)=>{    
    const {bookId, title, aotuer, pages, date, name, token} = req.body

    JWT.verify(token, SECRET, async(err, decoded)=>{
        const user = await User.findById(decoded.data.id)
        const comenaty = new Comenaty({
            name,
            members: [
                {
                    userId: user._id,
                    username: user.username
                }
            ],
            book: {
                bookId,
                title,
                aotuer,
                pages,
                date
            },
            admin: {
                userId: user._id,
                username: user.username
            }
        })
        comenaty.save()
        res.json({created: true})
    })
})

router.post('/join/comenaty/api', (req,res)=>{
    const {comenatyId, token} = req.body
    JWT.verify(token, SECRET, async(err, decoded)=>{
        const user = await User.findById(decoded.data.id)
        const comenaty = await Comenaty.findById(comenatyId)
        comenaty.members = comenaty.members.concat({
            userId: user._id,
            username: user.username
        })
        comenaty.save()
        res.json({joined: true})
    })
})

router.get('/comenaty/api', (req,res)=>{
    Comenaty.find({}, (err, comenaties)=>{
        res.json({comenaties})
    })
})

module.exports = router