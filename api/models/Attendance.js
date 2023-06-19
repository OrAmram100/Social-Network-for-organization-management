const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    userId:{
        required: true,
        type: String,
    },
    userName:{
        required: true,
        type: String, 
    },
    isAttend:{
        required:true,
        type:Boolean,
    },
    reasonOfAbsence:{
        type:String,
    },
    hours:{
        type:Number
    },
    start:{
        required: true,
        type: Date,
    },
},
    {timestamps:true}
    );

module.exports = mongoose.model("Attendance", AttendanceSchema);