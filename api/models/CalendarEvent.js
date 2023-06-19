const mongoose = require("mongoose");

const CalendarEventSchema = new mongoose.Schema({

    organizationId:{
        required: true,
        type: String,
    },
    userId:{
        required: true,
        type: String,
    },
    
    title:{
        required: true,
        type: String,
    },
    start:{
        required:true,
        type:Date,
    },
    end:{
        type: Date,
    },
},
    {timestamps:true}
    );

module.exports = mongoose.model("CalendarEvent", CalendarEventSchema);