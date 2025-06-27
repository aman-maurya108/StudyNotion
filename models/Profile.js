const mongoose = require("mongoose");
require('dotenv').config();

const profileSchema= new mongoose.Schema({
    gender:{
        type:String,
        enum: ["Male", "Female", "Other"],
       
    },
    dateOfBirth:{
        type:Date,
    },
    about:{
        type:String,
        trim: true,
    },
    contactNumber :{
        type:String,
        trim: true
    }
});

module.exports = mongoose.model("Profile",profileSchema);