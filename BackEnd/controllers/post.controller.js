const mongoose = require("mongoose")
const Post = require("../models/Post")
const User = require("../models/User")

const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image"
      });
    }
    
    const newPost = await Post.create({
      post: req.file.path,
      caption: caption || "",
      user: userId
    });
    
    const populatedPost = await Post.findById(newPost._id)
      .populate("user", "username profilePic");
    
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error creating post"
    });
  }
};

const getAllPosts = async(req,res)=>{
    try {
        const posts = await Post.find().populate("user","username profilePic").populate('comments.user', 'username profilePic').populate('likes', 'username profilePic').sort({createdAt:-1})
        return res.status(200).json({success:true,posts:posts})
    } 
    catch (e) {
        console.log(e)
        return res.status(500).json({success:false,message:"Server Side Issues"})
    }
}

const getPostById = async(req,res)=>{
    try {
        const postId = req.params.id
        const post = await Post.findById(req.params.id)
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic")
      .populate("likes", "username profilePic");
        if(!post)
        {
            return res.status(404).json({success:false,message:"Post Not Found"})
        }
        return res.status(200).json({success:true,post:post})
    } 
    catch (e) 
    {
        console.log(e)
        return res.status(500).json({success:false,message:"Server Side Issues"})
    }
}

const getAllUserPosts = async(req,res)=>{
    try {
        const userId = req.user.userId
        const posts = await Post.find({ user: userId }).sort({ createdAt: -1 }).populate('comments.user', 'username profilePic').populate('likes', 'username profilePic').populate("user","username profilePic")    
        const postCount = await Post.countDocuments({ user: userId });
        return res.status(200).json({success: true,count:postCount,posts: posts});

    } catch (error) {
        console.log(e)
        return res.status(500).json({success:false,message:"Server Side Issues"})
    }
}

const deletePost = async (req,res) => {
    try {
        const userId = req.user.userId
        const postId = req.params.id
        const post = await Post.findById(postId)
        if(!post)
        {
            return res.status(404).json({success:false,message:"Post Not Founded "})
        }
        const hasRights = post.user.equals(userId)
        if(!hasRights)
        {
            return res.status(403).json({success:false,message:"You Not Have Right To Access"})
        }
        await post.deleteOne()
        return res.status(200).json({success:true,message:"Post Deleted Successfully"})
    } 
    catch (e) {
        console.log(e)
        return res.status(500).json({success:false,message:"Server Side Issues"})
    }
}

const likeUnlikePost = async (req,res) => {
    try {
        const userId = req.user.userId
        const postId = req.params.id
        const post = await Post.findById(postId)
        if(!post)
        {
            return res.status(404).json({success:false,message:"Post Not Founded "})
        }
        const isAlreadyLiked = post.likes.includes(userId)
        if(isAlreadyLiked)
        {
            await post.likes.pull(userId)
            await post.save() 
            const count = post.likes.length;
            return res.status(200).json({success:true,liked:false,likeCount:count,message:"Post UnLiked"})
        }
        else
        {
            await post.likes.push(userId)
            await post.save() 
            const count = post.likes.length;
            return res.status(200).json({success:true,liked:true,likeCount:count,message:"Post Liked"})
        }
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({success:false,message:"Server Side Issues"})
    }
}

const addComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const postId = req.params.id;
        const { comment } = req.body;
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post Not Found" });
        }
        
        if (!comment || comment.trim() === "") {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }
        
        const newComment = {
            user: userId,
            Comment: comment.trim(),
            createdAt: new Date()
        };
        
        post.comments.push(newComment);
        await post.save();
        
        await post.populate('comments.user', 'username profilePic');
        

        const lastIndex = post.comments.length - 1;
        const populatedComment = post.comments[lastIndex];
        
        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: populatedComment,
            totalComments: post.comments.length
        });
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const commentId = req.params.commentId;

        const post = await Post.findOne({ 'comments._id': commentId });
        
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: "Comment not found" 
            });
        }
        
        const comment = post.comments.id(commentId);
        
        if (!comment) {
            return res.status(404).json({ 
                success: false, 
                message: "Comment not found" 
            });
        }

        if (!comment.user.equals(userId)) {
            return res.status(403).json({ 
                success: false, 
                message: "Not authorized to delete this comment" 
            });
        }
        comment.deleteOne(commentId);
        await post.save();
        
        return res.status(200).json({ 
            success: true, 
            message: "Comment deleted successfully" 
        });
        
    } catch (error) {
        console.error("Delete comment error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

const getPersonalizedFeed = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        const followingIds = user.following;

        followingIds.push(userId);

        const posts = await Post.find({
            user: { $in: followingIds }
        })
        .populate('user', 'username profilePic')
        .populate('comments.user', 'username profilePic')
        .populate('likes', 'username profilePic')
        .sort({ createdAt: -1 });
        
        return res.status(200).json({success: true,posts: posts,message: `Showing posts from ${followingIds.length - 1} followed users`});
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false,message: "Server error"});
    }
};

module.exports = {createPost,getAllPosts,getPostById,getAllUserPosts,deletePost,likeUnlikePost,addComment,deleteComment,getPersonalizedFeed}