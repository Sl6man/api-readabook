const express = require('express')
const bcryptjs = require('bcryptjs')
const JWT = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../modules/User')
require('dotenv').config();

const SECRET = process.env.SECRT

const router = express.Router()


router.get('/login/api', (req,res)=>{
    res.json('get')
})

router.post('/login/api', async(req,res)=>{
    const {username , password} = req.body
    // check of the user
    const user = await User.findOne({username})
    // if the user not found 
    if(user == null){return res.send({massage:"user not found or wrong password", auth:false})}
    
    // check of the password
    bcryptjs.compare(password, user.password,(err,call) => {
        if(call){
            // if the password is correct
            // create the token
            const token = JWT.sign({
                data: {
                    username,
                    id: user.id
                }
            }, SECRET, {})
            res.status(201).json({ 
                auth:true,
                username : user.username,
                email: user.email,
                token
            })

        }else{
            // if the password not correct
            res.json({massage:"user not found or wrong password", auth:false})
        }
    })

})


module.exports = router