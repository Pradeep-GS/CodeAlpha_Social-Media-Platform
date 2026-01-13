const express = require("express")
const routes = express.Router()
const {createNewAccount,userLogIn,updateUser,getUserDetails,followUser,unfollowUser,getFollowers,getFollowing,uploadProfilePicture,getSelfDetails,deleteUser,getOtherUserDetails} = require("../controllers/user.controller")
const authMiddleware = require("../middilewars/auth.middleware")
const { uploadProfile } = require('../middilewars/upload.middleware');

routes.put('/upload-profile', authMiddleware, uploadProfile.single('image'), uploadProfilePicture);
routes.post("/create-account",createNewAccount)
routes.post("/login",userLogIn)
routes.put("/update",authMiddleware,updateUser)
routes.get("/getuser/:user",getUserDetails)
routes.put('/:userId/follow', authMiddleware, followUser);
routes.put('/:userId/unfollow', authMiddleware, unfollowUser);
routes.get('/:userId/followers', getFollowers);
routes.get('/:userId/following', getFollowing);
routes.get("/getuser",authMiddleware,getSelfDetails)
routes.delete("/delete",authMiddleware,deleteUser)
routes.get('/getuser/:userId', getOtherUserDetails);
module.exports=routes