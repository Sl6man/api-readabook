const express = require("express");
const User = require("../modules/User.js")
const bcryptjs  = require("bcryptjs")
const validator = require('validator')
const JWT = require('jsonwebtoken')
require('dotenv').config();

const SECRET = process.env.SECRT

const router = express.Router()

// const token = JWT.sign({
//     data: "username"
// }, "ss", {expiresIn:"1h"})

// console.log(token)


router.post('/signup/api', async (req,res)=>{
    // check if the email is exists
    const userEmail = await User.exists({email: req.body.email})
    if(userEmail){
        return res.json({auth:false, message:"email exists"})
    }
    // check if the user exists 
    const user = await User.exists({username: req.body.username})
    if(user){
        return res.json({auth:false, message:"user exists"})
    }

    // get info from the req 
    const {password, email, username} = req.body
    // check the data if it's valid 
    if(!validator.isEmail(email)){return res.json({auth:false, message:"valid email"})}
    if(!validator.isStrongPassword(password, {minLength: 5,minSymbols: 0,minUppercase: 0})){ return res.json({auth:false, message:"valid password"})}
    else{
        // hash the password before save it in the database
        // gen salt 
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(password, salt, (err, hashed) => {
                // add the user info in the data base
                const user = new User({username, email, password:hashed})
                user.save()
                // create token and send it with the api
                const token = JWT.sign({
                    data: {
                        username,
                        id: user.id
                    }
                }, SECRET, {})
                
                res.status(201).json({auth: true,user:user.username,token})
            })
        })
    }
})

module.exports = router
