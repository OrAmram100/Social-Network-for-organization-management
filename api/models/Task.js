const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    creatorId:{
        type: String,
        required: true
    },
    members:{
        type:Array,
        default:[]
      },
      status:{
        type:String
      },
    desc:{
        required:true,
        type:String,
    },
},
    {timestamps:true}
    );

module.exports = mongoose.model("Task", TaskSchema);