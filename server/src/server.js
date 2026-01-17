require('dotenv').config()
const express=require('express')
const db=require('./config/db')

const app=express()

// database connection
db();

// server started
const PORT=process.env.PORT
app.listen(PORT,()=>{console.log(`🚀 server is running on the port ${PORT} 🚀`)})
