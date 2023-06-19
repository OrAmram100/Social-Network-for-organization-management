const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    members:{
        type:Array,
      },
    desc:{
        required:true,
        type:String,
    },
},
    {timestamps:true}
    );

module.exports = mongoose.model("Request", RequestSchema);