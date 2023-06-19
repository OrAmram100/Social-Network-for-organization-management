const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 20,
        validate: {
            validator: function(v) {
                return /^[A-Z][a-z]*$/.test(v);
            },
            message: props => `${props.value} is not a valid first name!`
        }
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 20,
        validate: {
            validator: function(v) {
                return /^[A-Z][a-z]*$/.test(v);
            },
            message: props => `${props.value} is not a valid first name!`
        }
    },
    workStartDate: {
        type:Date
    },
    email: {
        type: String,
        required: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    
    birthdayDate: {
        type: Date
    },
    profilePicture: {
        type: String,
        default: ""
    },

    arrivalMessageNotifications: {
        type: Array,
        default: []
    },
    postNotifications: {
        type: Array,
        default: []
    },

    coverPicture: {
        type: String,
        default: ""
    },
    connections: {
        type: Array,
        default: []
    },

    department:{
        type: String,
        default: ""
    },
    skill:{
        type: Number,
        default:0,
    },
    flag:{
        type: Number,
        default:0,
    },
    sendConnectionsReq: {
        type: Array,
        default: []
    },
    recvConnectionsReq: {
        type: Array,
        default: []
    },
    userType:{
        type: String,
    },
    desc: {
        type: String,
        max: 50
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    relationship: {
        type: String,
        default: "-",
        enum: ["Married", "Single", "-"]
    },
    score: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        max: 50
    }


}, { timestamps: true });

const TeamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        min: 2,
        max: 20,
        validate: {
            validator: function(v) {
                return /^[A-Z][a-zA-Z]*(\s[A-Z][a-zA-Z]*)*$/.test(v);
            },
            message: props => `${props.value} is not a valid team name!`
        }
    },
    teamManager: {
        type: UserSchema,
        required: true,
    },
    users:[{
        type: UserSchema,
    }],
})

const DepartmentSchema = new mongoose.Schema({

    organizationId:{
        type: String,
        required: true
    },

    departmentName:{
        required:true,
        type:String
    },
    departmentManager: {
        type: UserSchema,
    },
    teams:[{
        type: TeamSchema,
    }],

},
    {timestamps:true}
    );

module.exports = mongoose.model("Department", DepartmentSchema);