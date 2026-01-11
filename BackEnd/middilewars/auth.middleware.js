const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

const authMiddleware = async(req,res,next)=>{
    try {
        const authHeader =req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({success:false,message:"Token Missing Please Log In"});
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (e) {
        console.log(e)
        return res.status(500).json({success:false,message:"Token Expired"})
    }
}

module.exports=authMiddleware