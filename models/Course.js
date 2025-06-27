const mongoose = require("mongoose");
require('dotenv').config();

const courseSchema= new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
        trim:true
    },
    courseDescription:{
        type:String,
       
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    whatYouWillLearn:{
        type: String,
    },
    
    courseContent : [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Section"
        }
    ],
   
    ratingAndReviews : [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
    }],
    price: {
        type: Number,
        default : 0
    },
    thumbnail : {
        type: String,

    },
    tag: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    }],
    studentsEnrolled : [{
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: "User",
    }]

});

module.exports = mongoose.model("Course",courseSchema);