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
    },

}, { timestamps: true });

const OrganizationSchema = new mongoose.Schema({
    organizationName:{
        required:true,
        type:String
    },
    establishmentDate :{
        type:Date,
    },
    CEO:{
        type: UserSchema,
    },
    organizationPicture: {
        type: String,
        default: ""
    },
    NumOfEmployees: {
        type: "number",
        default: 0
    },
    desc:{
        required:true,
        type:String
    },
    users:[{
        type: UserSchema,
    }],
},
    {timestamps:true}
);

module.exports = mongoose.model("Organization", OrganizationSchema);