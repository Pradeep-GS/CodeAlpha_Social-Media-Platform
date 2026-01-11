const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    post:{
        type:String,
        required:true,
    },
    caption:{
        type:String,
        default:""
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        Comment:String,
        createdAt:Date
    }]
},
{
    timestamps: true
}
)

module.exports=mongoose.model("Post",postSchema)