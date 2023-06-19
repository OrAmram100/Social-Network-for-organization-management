const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    userId:{
        required: true,
        type: String,
    },
    text:{
        required:true,
        type:String,
    },
    postId:{
        required: true,
        type: String,
    },
},
    {timestamps:true}
    );

module.exports = mongoose.model("Comment", CommentSchema);