const mongoose = require("mongoose")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const Post = require("../models/Post")

dotenv.config()
const createNewAccount = async (req,res) => {
    try
    {
        const {name,username,password,bio,email,profile}=req.body
        const isExistingUserName = await User.findOne({username})
        const isExistingEmail = await User.findOne({email})

        if(isExistingUserName)
        {
            return res.status(409).json({success:false,message:"User Name Already Taken"})
        }
        if(isExistingEmail)
        {
            return res.status(409).json({success:false,message:"Email Alreday Existing Try With New Email Or Log In"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            name:name,
            username:username,
            email:email,
            password:hashPassword,
            bio:bio,
            profilePic:profile
        })
        return res.status(201).json({success:true,message:"Account Created Successfully,"})
    } catch (e) {
        console.log(e)
        return res.status(500).json({success:false,message:"Server Side Issues"})
    }
}

const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.userId;  // Already string
        const {bio} = req.body;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image"
            });
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        user.profilePic = req.file.path;
        user.bio = bio || user.bio;
        user.isCompleted = true; 
        await user.save();
        
        const safeUser = {
            _id: user._id,
            username: user.username,
            name: user.name,
            profilePic: user.profilePic,
            bio: user.bio,
            createdAt: user.createdAt
        };
        
        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            user: safeUser
        });
        
    } catch (error) {
        console.error("Profile upload error:", error);
        return res.status(500).json({
            success: false,  // FIXED: false for errors
            message: "Error uploading profile picture"
        });
    }
};

const userLogIn = async(req,res)=>{
    try {
        const {username,password} = req.body;
        const isExistingUser = await User.findOne(
            {$or: [{username: username}, {email: username}]}
        )
        if(!isExistingUser) {
            return res.status(401).json({success:false,message:"User Not Found"})
        }

        const hashedPassword = isExistingUser.password
        const comparePassword = await bcrypt.compare(password,hashedPassword)
        if(!comparePassword) {
            return res.status(401).json({success:false,message:"Invalid Credentials"})
        }
        const token = jwt.sign({userId: isExistingUser._id},process.env.JWT_SECRET,{expiresIn:"7d"})

        return res.status(200).json({success:true,message:"Logged In Successfully",token:token,isCompleted: isExistingUser.isCompleted})
    } catch (e) {
        console.log(e)
        return res.status(500).json({success:false,message:"Server Side Issues"})
    }
}

const updateUser = async (req,res) => {
    try
    {
        const userId = req.user.userId;
        const {name,email,username,password,bio,profile} = req.body
        const isExistingUser = await User.findById(userId)
        if(!isExistingUser){
            return res.status(401).json({success:false,message:"User Doesn't Existing"})
        }
        const hasExistingUserName = await  User.findOne({username})
        const hasExistingemail = await User.findOne({email})

        if(hasExistingUserName  && hasExistingUserName._id.toString() !== userId)
        {
            return res.status(401).json({success:false,message:"User Name Already Taken"})
        }
        if(hasExistingemail && hasExistingemail._id.toString() !== userId)
        {
            return res.status(401).json({success:false,message:"Enter Valid Email ID / Mail Id already Taken"})
        }

        if(name!==undefined && name.trim()!==""){
            isExistingUser.name=name.trim()
        }
        if(email!==undefined && email.trim()!==""){
            isExistingUser.email=email.trim()
        }
        if(password!==undefined && password.trim()!==""){
            const hashPassword = await bcrypt.hash(password,10)
            isExistingUser.password=hashPassword
        }
        if(username!==undefined && username.trim()!=="")
        {
            isExistingUser.username=username.trim()
        }
        if(bio!==undefined && bio.trim()!=="")
        {
            isExistingUser.bio=bio.trim()
        }
        if(profile!==undefined && profile.trim()!=="")
        {
            isExistingUser.profilePic=profile.trim()
        }
        await isExistingUser.save()
        return res.status(200).json({success:true,message:"Profile Added Successfully"})
    }
    catch (e)
    {
        console.log(e)
        return res.status(500).json({success:false,message:"Server Side Issues"})
    }
}

const getUserDetails = async(req,res)=>{
    try {
        const username = req.params.user
        const user = await User.findOne({username})
        if(!user)
        {
            return res.status(404).json({success:false,message:"User Doesn't Existing"})
        }
        const followersCount = user.followers.length
        const followingCount = user.following.length
        const postCount = await Post.countDocuments({ user: user._id });
         const safeUser = {
            _id: user._id,
            username: user.username,
            name: user.name,
            email:user.email,
            profilePic: user.profilePic,
            bio: user.bio,
            followersCount: followersCount,
            followingCount: followingCount,
            createdAt: user.createdAt
        };
        return res.status(200).json({success: true,user: safeUser,postCount: postCount,followersCount: followersCount,followingCount: followingCount});
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({success:true,message:"Server Side Issues"})
    }
}

const followUser = async (req, res) => {
  try {
    const ourUserId = req.user.userId;
    const targetUserId = req.params.userId;

    if (ourUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot follow yourself",
      });
    }

    const [selfUser, targetUser] = await Promise.all([
      User.findById(ourUserId),
      User.findById(targetUserId),
    ]);

    if (!selfUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (selfUser.following.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Already following this user",
      });
    }

    selfUser.following.push(targetUserId);
    targetUser.followers.push(ourUserId);

    await Promise.all([selfUser.save(), targetUser.save()]);

    return res.status(200).json({
      success: true,
      message: "Successfully followed user",
      followingCount: selfUser.following.length,
      followersCount: targetUser.followers.length,
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const unfollowUser = async (req, res) => {
  try {
    const ourUserId = req.user.userId;
    const targetUserId = req.params.userId;

    if (ourUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot unfollow yourself",
      });
    }

    const [selfUser, targetUser] = await Promise.all([
      User.findById(ourUserId),
      User.findById(targetUserId),
    ]);

    if (!selfUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!selfUser.following.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Not following this user",
      });
    }

    selfUser.following.pull(targetUserId);
    targetUser.followers.pull(ourUserId);

    await Promise.all([selfUser.save(), targetUser.save()]);

    return res.status(200).json({
      success: true,
      message: "Successfully unfollowed user",
      followingCount: selfUser.following.length,
      followersCount: targetUser.followers.length,
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const getFollowers = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId)
            .populate('followers', 'username name profilePic');
        
        if (!user) {
            return res.status(404).json({success: false,message: "User not found"});
        }
        return res.status(200).json({success: true,followers: user.followers,followersCount: user.followers.length});
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false,message: "Server error"});
    }
};

const getFollowing = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId)
            .populate('following', 'username name profilePic');
        
        if (!user) {
            return res.status(404).json({success: false,message: "User not found"});
        }
        
        return res.status(200).json({success: true,following: user.following,followingCount: user.following.length});
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false,message: "Server error"});
    }
};

const getSelfDetails = async(req,res)=>{
    try {
        const userId = req.user.userId; 
        const user = await User.findById(userId);
        if(!user)
        {
            return res.status(404).json({success:false,message:"User Doesn't Existing"})
        }
        const safeUser = {
            _id: user._id,
            username: user.username,
            name: user.name,
            email:user.email,
            profilePic: user.profilePic,
            bio: user.bio,
            createdAt: user.createdAt,
            followersCount: user.followers.length,
            followingCount: user.following.length
        };
        return res.status(200).json({success: true,user: safeUser});
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({success:true,message:"Server Side Issues"})
    }
}
const deleteUser = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: "Server Side Issues" });
    }
} 

const getOtherUserDetails = async (req, res) => {
    try {
        const identifier = req.params.userId;
        
        // Check if the identifier is a valid MongoDB ObjectId
        let user;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            // If it's a valid ObjectId, find by ID
            user = await User.findById(identifier);
        } else {
            // If not, assume it's a username
            user = await User.findOne({ username: identifier });
        }
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        const safeUser = {
            _id: user._id,
            username: user.username,
            name: user.name,
            profilePic: user.profilePic,
            bio: user.bio,
            createdAt: user.createdAt,
            followersCount: user.followers.length,
            followingCount: user.following.length
        };
        
        return res.status(200).json({
            success: true,
            user: safeUser
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {createNewAccount,userLogIn,updateUser,getUserDetails,followUser,unfollowUser,getFollowers,getFollowing,uploadProfilePicture,getSelfDetails,deleteUser,getOtherUserDetails}