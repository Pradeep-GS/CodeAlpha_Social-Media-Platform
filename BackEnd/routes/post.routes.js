const express = require("express")
const routes = express.Router()
const {createPost,getAllPosts,getPostById,getAllUserPosts,deletePost,likeUnlikePost,addComment,deleteComment,getPersonalizedFeed} = require("../controllers/post.controller")
const authMiddleware = require("../middilewars/auth.middleware")
const { uploadPost } = require('../middilewars/upload.middleware');

routes.post("/newpost",authMiddleware,uploadPost.single('image'),createPost)
routes.get("/",getAllPosts)
routes.get("/my-post",authMiddleware,getAllUserPosts)
routes.get("/:id",getPostById)
routes.delete("/:id",authMiddleware,deletePost)
routes.put("/:id/likeToggle",authMiddleware,likeUnlikePost)
routes.post("/:id/comment",authMiddleware,addComment)
routes.delete("/:commentId/comment",authMiddleware,deleteComment)
routes.get('/feed', authMiddleware, getPersonalizedFeed);

module.exports=routes