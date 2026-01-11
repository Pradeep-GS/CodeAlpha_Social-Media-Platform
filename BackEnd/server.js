const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors =require("cors")
const ConnectDb = require("./config/db")
const userRoutes = require("./routes/user.routes")
const postRoutes = require("./routes/post.routes")

app.use(express.json())
app.use(cors())
dotenv.config()
ConnectDb()
const PORT =  process.env.PORT || 8000

app.use("/api/user",userRoutes)
app.use("/api/post",postRoutes)


app.listen(PORT,()=>{
    console.log(`Server Running On The Port Of ${PORT}`)
})
