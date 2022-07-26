const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// routers
const createUser = require("./routers/creatUser")
const login = require('./routers/login')
const addBook = require('./routers/addBook')
const bookList = require('./routers/bookList')
require('dotenv').config();



// use 
app.use(express.json())
app.use(express.static('public'))
app.use(cors({
    origin  : 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true
}))


// connect to the database
mongoose.connect(process.env.mongokey)

// use the routers 
app.use(createUser)
app.use(login)
app.use(bookList)
app.use(addBook)

const port = process.env.PORT || 3001

app.listen(port, ()=>{
    console.log("up on port 3000")
})
