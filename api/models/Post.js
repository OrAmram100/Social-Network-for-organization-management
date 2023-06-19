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

    votes: [{
        userId: {
          type: String,
          required: true,
        },
        confidenceLevel: {
          type: Number,
        },
      }],
    weighingVotes:{
        type: Number,
      },
    isCorrect: {
        type: Boolean,
      },
},
    {timestamps:true}
    );



const PostSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true,
        max:500
    },
    questionType:{
        type: String,
    },
    comments: [{
        type: CommentSchema,
        required: true
    }],
    location:{
        type: String,
        max:500 
    },
    desc:{
        type: String,
        max:500
    },
    isImportant: {
        type: Boolean,
        default: false,
    },
   
    img:{
        type: String
    },
    likes:{
        type:Array,
        default:[]
    },
    startEventDate:{
        type:Date
    },
    repeatedDecision:{
        type:Boolean,
        default:false,
    },
    endEventDate:{
        type:Date
    },
    
},
{timestamps:true}
);

module.exports = mongoose.model("Post", PostSchema);