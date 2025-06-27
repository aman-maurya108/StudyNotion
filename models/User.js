const mongoose = require("mongoose");
const { resetPasswordToken } = require("../controllers/ResetPassword");
require('dotenv').config();

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim :true
    },
    password:{
        type:String,
        required:true,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    additionalDetail:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },
    courses : [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
],
    image:{
        type: String,
        required: true,
    },
    token:{
        type : String,
    },
    resetPasswordExpires:{
        type: Date,
    },
    courseProgress : [{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"courseProgress"
    }]
});

module.exports = mongoose.model("User",userSchema);