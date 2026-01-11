const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()
const ConnectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DataBase Connected Successfully")
    } catch (error) {
        console.error("Some Error Have Been Occured",error)
    }
}

module.exports=ConnectDb